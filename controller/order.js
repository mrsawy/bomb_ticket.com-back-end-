const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const jwt = require('jsonwebtoken');

const {
  Order,
  User,
  Ticket,
  Event,
  OrderTicket,
  Coupon,
  TicketImg,
  TicketSection,
  Withdraw,
  Admin,
  UserCoupon,
} = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
  async createOrder(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        price,
        quantity,
        sellerId,
        userId,
        order,
        discount,
        orderAmount,
        // couponId,
        userCouponId,
      } = req.body;

      const createOrder = await Order.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        orderNumber: Math.floor(
          100000 + Math.random() * 100000000 + Math.random() * 10000000
        ),
        price: price,
        discount: discount,
        orderAmount: orderAmount,
        quantity: quantity,
        sellerId: sellerId,
        userId: userId,
        userCouponId: userCouponId,
      });

      await UserCoupon.update(
        {
          status: "used",
        },
        {
          where: {
            id: userCouponId,
          },
        }
      );

      // const findCoupon = await Coupon.findOne({
      //   where: {
      //     id: couponId,
      //   }
      // });

      // if (findCoupon) {
      //   await Coupon.update(
      //     {
      //       limit: findCoupon.limit - 1,
      //     },
      //     {
      //       where: {
      //         id: couponId,
      //       },
      //     }
      //   );
      // }
      await Withdraw.create({
        status: "noRequested",
        orderId: createOrder.id,
        userId: sellerId,
      });

      const myAdmin = await Admin.findOne({ where: { isSuper: true } });

      if (order.length) {
        await order.forEach(async (element) => {
          const ticket = await TicketImg.findOne({
            where: {
              id: element,
            },
            attributes: ["sellTicketId"],
            include: {
              model: Ticket,
              attributes: ["price"],
            },
          });
          const price = ticket.sell_ticket.price;
          const tax = price * (myAdmin.percentage / 100);
          const finalPrice = price + tax;
          await TicketImg.update(
            {
              status: "sold",
              price: price,
              tax: tax,
              finalPrice: finalPrice,
            },
            {
              where: {
                id: element,
              },
            }
          );
        });

        let orderTickets = await order.map((element) => {
          return {
            ticketId: element,
            orderId: createOrder.id,
          };
        });

        await OrderTicket.bulkCreate(orderTickets);

        return res.status(http_status_codes.StatusCodes.CREATED).json({
          message: "Order created successfully",
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "Order not created",
        });
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in create Order",
          err: error,
        });
    }
  },
  async updateOrder(req, res, next) {
    try {
      const orderId = req.params.orderId;
      const {
        firstName,
        lastName,
        phoneNumber,
        status,
        orderNumber,
        price,
        ticketId,
        sellerId,
        userId,
      } = req.body;
      const updateOrder = await Order.update(
        {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          status: status,
          orderNumber: orderNumber,
          price: price,
          ticketId: ticketId,
          sellerId: sellerId,
          userId: userId,
        },
        {
          where: {
            id: orderId,
          },
        }
      );
      const findOrder = await Order.findOne({
        where: {
          id: orderId,
        },
      });
      if (findOrder) {
        return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
          message: "Order updated successfully",
          order: findOrder,
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "Order not found!",
        });
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in update Order",
          err: error,
        });
    }
  },
  async delOrder(req, res, next) {
    try {
      const orderId = req.params.orderId;
      const deleteOrder = await Order.destroy({
        where: {
          id: orderId,
        },
      });
      return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
        message: "Order deleted successfully",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in Order delete",
          err: error,
        });
    }
  },
  async allOrder(req, res, next) {
    try {
      const allOrder = await Order.findAll({
        include: [
          {
            model: User,
            as: "seller",
            require: false,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "profileImg",
              "gender",
            ],
          },
          {
            model: User,
            as: "user",
            require: false,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "profileImg",
              "gender",
            ],
          },
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
                        model: Event,
                        require: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // {
          //   model: Ticket,
          //   require: false,
          //   include: [
          //     {
          //       model: Event,
          //       require: false
          //     }
          //   ],
          // },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allOrder);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Order",
          err: error,
        });
    }
  },
  async oneOrder(req, res, next) {
    try {
      const orderId = req.params.orderId;

      const oneOrder = await Order.findOne({
        where: {
          id: orderId,
        },
      });
      return res.status(http_status_codes.StatusCodes.OK).json(oneOrder);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get one Order ",
          err: error,
        });
    }
  },
  async sellerOrder(req, res, next) {



    
    
    try {
      const userJwt = req.headers.authorization.split(` `)[1];
      const userReceivedInfo = jwt.decode(userJwt, `secretKey-secretKey-secretKey`)
  
      const sellerId = req.params.sellerId;
      const allOrder = await Order.findAll({
        where: {
          sellerId: userReceivedInfo.id,
        },
        include: [
          {
            model: User,
            as: "seller",
            require: false,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "profileImg",
              "gender",
            ],
          },
          {
            model: User,
            as: "user",
            require: false,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "profileImg",
              "gender",
            ],
          },
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
                        model: Event,
                        require: false,
                      },
                      {
                        model: TicketSection,
                        require: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allOrder);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Order",
          err: error,
        });
    }
  },
  async userOrder(req, res, next) {
    try {
      const userId = req.params.userId;
      const allOrder = await Order.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: User,
            as: "seller",
            require: false,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "profileImg",
              "gender",
            ],
          },
          {
            model: User,
            as: "user",
            require: false,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "profileImg",
              "gender",
            ],
          },
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
                        model: Event,
                        require: false,
                      },
                      {
                        model: TicketSection,
                        require: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allOrder);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Order",
          err: error,
        });
    }
  },

  async getAllOrder(req, res, next) {
    try {
      const allOrder = await Order.findAll({
        include: [
          {
            model: User,
            as: "seller",
            require: false,
            attributes: ["id", "firstName", "lastName"],
          },
          
          {
            model: User,
            as: "user",
            require: false,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(http_status_codes.StatusCodes.OK).json(allOrder);
    } catch (error) {
      console.log(error);
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Order",
          err: error,
        });
    }
  },

  async getOrderDetail(req, res, next) {
    try {
      const orderId = req.params.orderId;
      const allOrder = await Order.findOne({
        where: {
          id: orderId,
        },
        include: [
          {
            model: User,
            as: "seller",
            require: false,
          },
          {
            model: User,
            as: "user",
            require: false,
          },
          {
            model: UserCoupon,
            required: false,
            include: {
              model: Coupon,
            },
          },
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
                        model: Event,
                        require: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // {
          //   model: Ticket,
          //   require: false,
          //   include: [
          //     {
          //       model: Event,
          //       require: false
          //     }
          //   ],
          // },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allOrder);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Order",
          err: error,
        });
    }
  },
};
