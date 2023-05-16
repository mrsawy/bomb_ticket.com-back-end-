const http_status_codes = require("http-status-codes");
const moment = require("moment");
const sequelize = require("sequelize");
const {
  Withdraw,
  User,
  Transaction,
  PaymentMethod,
  Ticket,
  TicketImg,
  Event,
  Order,
  Bank,
  OrderTicket,
  TicketSection,
  Admin,
} = require("../database/database");
module.exports = {
  async createWithdraw(req, res, next) {
    try {
      const userId = req.params.userId;

      const { amount } = req.body;

      const findUserWithWithdraw = await User.findOne({
        where: {
          id: userId,
        },
        include: {
          model: Withdraw,
          where: {
            isPaid: false,
          },
        },
      });

      const findUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (findUserWithWithdraw == null) {
        const withdraw = await Withdraw.create({
          amount: amount,
          userId: userId,
        });

        const updateIsWithdrawRequested = await User.update(
          {
            isWithdrawRequested: true,
            balance: findUser.balance - amount,
          },
          {
            where: {
              id: userId,
            },
          }
        );

        return res.status(http_status_codes.StatusCodes.CREATED).json(withdraw);
      } else {
        return res.status(http_status_codes.StatusCodes.CONFLICT).json({
          error:
            "You already requested for Payment. Please wait for two to three business days.",
          // user: findUser,
        });
      }
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Creating Withdraw",
          error: err,
        });
    }
  },

  async payToUser(req, res, next) {
    try {
      const withdrawId = req.params.withdrawId;

      const { amount, userId } = req.body;

      const withdraw = await Withdraw.findOne({
        where: {
          id: withdrawId,
        },
      });

      if (withdraw) {
        await Withdraw.update(
          {
            isPaid: true,
          },
          {
            where: {
              id: withdrawId,
            },
          }
        );

        const user = await User.findOne({ where: { id: userId } });

        await User.update(
          {
            isWithdrawRequested: false,
          },
          {
            where: {
              id: userId,
            },
          }
        );
        const transaction = await Transaction.create({
          amount: amount,
          userId: userId,
          type: "withdraw",
        });

        return res.status(http_status_codes.StatusCodes.OK).json({
          message: "Withdraw Paid to User Successfully",
        });
      }
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in payToUser",
        });
    }
  },

  async updateWithdraw(req, res, next) {
    try {
      const withdrawId = req.params.withdrawId;

      const { status, amount } = req.body;

      var currentDateTime = status == 'Accepted' ? moment() : null;

      const withdraw = await Withdraw.update(
        {
          status: status,
          amount: amount,
          paidAt: currentDateTime,
        },
        {
          where: {
            id: withdrawId,
          },
        }
      );

      if (status == 'Requested' || status == 'Accepted') {

        // const myAdmin = await Admin.findOne({
        //   where: {
        //     isSuper: true
        //   },
        //   attributes: ['percentage']
        // })

        const myWithdraw = await Withdraw.findOne({
          where: {
            id: withdrawId
          },
          include: [
            {
              model: User,
              attributes: ['balance']
            },
            //   {
            //     model: Order,
            //     attributes: ['price']
            //   },
          ],
          attributes: ['userId', 'orderId', 'amount']
        })

        // const ticketPrice = myWithdraw.order.price;
        // const taxAmount = ticketPrice * (myAdmin.percentage / 100);
        // const withdrawAmount = ticketPrice - taxAmount.toFixed(2);

        if (status == 'Requested') {

          await User.update(
            {
              balance: myWithdraw.user.balance + amount
            },
            {
              where: {
                id: myWithdraw.userId
              }
            }
          )

        } else if (status == 'Accepted') {

          await User.update(
            {
              balance: myWithdraw.user.balance - myWithdraw.amount
            },
            {
              where: {
                id: myWithdraw.userId
              }
            }
          )

        }


      }

      return res.status(http_status_codes.StatusCodes.OK).json({
        message: "Withdraw Updated Successfully",
      });
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Updating Withdraw",
        });
    }
  },

  async getWithdraw(req, res, next) {
    try {
      const withdrawId = req.params.withdrawId;

      const withdraw = await Withdraw.findOne({
        where: {
          id: withdrawId,
        },
        include: {
          all: true,
        },
      });

      return res.status(http_status_codes.StatusCodes.OK).json(withdraw);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching Withdraw",
        });
    }
  },

  async getAllWithdraws(req, res, next) {
    try {
      const withdrawPaid = await Withdraw.findAll({
        where: {
          isPaid: true,
        },
        include: [
          {
            model: User,
            include: { model: Bank, require: false },
          },
        ],
      });

      const withdrawUnpaid = await Withdraw.findAll({
        where: {
          isPaid: false,
        },
        include: [
          {
            model: User,
            include: { model: Bank, require: false },
          },
        ],
      });

      return res
        .status(http_status_codes.StatusCodes.OK)
        .json({ withdrawPaid, withdrawUnpaid });
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in Fetching All Withdraw",
        });
    }
  },

  async getAllPaid(req, res, next) {
    try {
      const withdrawPaid = await Withdraw.findAll({
        where: {
          status: 'accepted',
        },
        include: [
          {
            model: User,
            include: { model: Bank, require: false },
            include: { model: Order, require: false, },
          },
        ],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(withdrawPaid);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching All Paid Withdraw",
        });
    }
  },

  async getAllUnpaid(req, res, next) {
    try {
      const withdrawUnpaid = await Withdraw.findAll({
        where: {
          status: 'requested',
        },
        include: [
          {
            model: User,
            include: { model: Bank, require: false },
            include: { model: Order, require: false },
          },
        ],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(withdrawUnpaid);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching All Unpaid Withdraw",
        });
    }
  },

  async getWithdrawByUser(req, res, next) {
    try {
      userId = req.params.userId;
      const withdraw = await Withdraw.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "iBan",
            ],
            include: {
              model: PaymentMethod,
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(http_status_codes.StatusCodes.OK).json(withdraw);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching Withdraw",
        });
    }
  },
  async deleteWithdraw(req, res, next) {
    try {
      withdrawId = req.params.withdrawId;
      const deleteWithdraw = await Withdraw.destroy({
        where: {
          id: withdrawId,
        },
      });
      return res
        .status(http_status_codes.StatusCodes.OK)
        .json({ message: "Withdraw Deleted Successfully" });
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Deleting Withdraw",
        });
    }
  },
  async myWalletData(req, res, next) {
    try {
      userId = req.params.userId;
      const withdraw = await Withdraw.findAll({
        where: {
          userId: userId
        },
        include: [
          {
            model: Order,
            require: false,
            include: [
              {
                model: OrderTicket,
                require: false,
                include: [
                  {
                    model: TicketImg,
                    require: false,
                    include: [
                      {
                        model: Ticket,
                        require: false,
                        include: [
                          {
                            model: TicketSection,
                            require: false,
                            include: [
                              {
                                model: Event,
                                require: false
                              },
                            ],
                          },
                        ],
                      }
                    ],
                  }
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(http_status_codes.StatusCodes.OK).json(withdraw);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching Withdraw",
        });
    }
  },



  async getAllPaidAdmin(req, res, next) {
    try {
      const withdrawPaid = await Withdraw.findAll({
        where: {
          status: 'accepted',
        },
        include: [
          {
            model: User,
            include: { model: Bank, required: false },

          },
          { model: Order, required: false, },
        ],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(withdrawPaid);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching All Paid Withdraw",
        });
    }
  },

  async getAllUnpaidAdmin(req, res, next) {
    try {
      const withdrawUnpaid = await Withdraw.findAll({
        where: {
          status: 'requested',
        },
        include: [
          {
            model: User,
            include: { model: Bank, required: false },

          },
          { model: Order, required: false, },
        ],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(withdrawUnpaid);
    } catch (err) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurd in Fetching All Unpaid Withdraw",
        });
    }
  },
};
