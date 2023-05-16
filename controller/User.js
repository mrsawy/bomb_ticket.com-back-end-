const sequelize = require("sequelize");
const { Op } = require("sequelize");
const client = require(`./../whats_app_Bot/app`);
const { Otp } = require(`./../database/database`);
require("dotenv").config();
const sendOTP = require(`./helper/send-otp`);
const jwt = require('jsonwebtoken');

// "


/////////////////////

const http_status_codes = require("http-status-codes");
const {
  User,
  Order,
  Ticket,
  TicketImg,
  Address,
  Bank,
  Withdraw,
} = require("../database/database.js");
const hashedPassword = require("password-hash");
const nodemailer = require("nodemailer");
const moment = require("moment");
module.exports = {
  async registerUser(req, res, next) {
    try {
      const { firstName, lastName, password, email, phoneNumber, gender } =
        req.body;
      const profileImg = req.body.profileImg ? req.body.profileImg : ``;

      const findUser = await User.findOne({
        where: {
          phoneNumber: phoneNumber,
          email: email,
        },
      });
      if (findUser) {
        return res.status(http_status_codes.StatusCodes.NOT_ACCEPTABLE).json({
          error: "this account already Exits!",
        });
      } else {
        if (password.length < 6) {
          return res
            .status(http_status_codes.StatusCodes.NOT_ACCEPTABLE)
            .json({ error: "Password should be greater than 6 characters!" });
        } else {
          const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            profileImg: profileImg ? profileImg : ``,
            gender: gender,
            password: hashedPassword.generate(password),
          });
          return res.status(http_status_codes.StatusCodes.CREATED).json({
            message: "Account successfully Created",
            user: user,
            jwt:jwt.sign({id:user.id , password:user.password,email:user.email , phoneNumber:user.phoneNumber }, `secretKey-secretKey-secretKey`)

          });
        }
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error Occurred in Creating User",
          err: error,
        });
    }
  },


  async signInUser(req, res, next) {
    try {
      const { password } = req.body;

      const phoneNumber = req.body.phoneNumber.replace(/[^\d]/g, "");

      

      const user = await User.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      if (user) {
        if (user.isBlocked) {
          return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
            error: "You are blocked by Admin",
          });
        } else {
          const verify_password = hashedPassword.verify(
            password,
            user.password
          );
          if (verify_password ) {

            // const {password , ...userWithoutPassword} = user ; 
            // console.log(user);
            return res.status(http_status_codes.StatusCodes.OK).json({
              message: "successfully login",
              user: user,
              jwt:jwt.sign({id:user.id , password:user.password,email:user.email , phoneNumber:user.phoneNumber }, `secretKey-secretKey-secretKey`)
            });


          } else {
            return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
              error: "Password is incorrect!",
            });
          }
        }
      } else {
        return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
          error: "Email does not exist!",
        });
      }
    } catch (error) {
      console.log(error.message)
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error in login",
          err: error,
          message:error.message
        });
    }
  },
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  // async
  sendOtp: async (req, res, next) => {
    let { phoneNumber } = req.body;
    try {
      const response = await sendOTP(phoneNumber, req, res);
      return response;
    } catch (err) {
      console.log(`errMSG:=>`, err.message);
      if (
        err.message == `client_loop: send disconnect: Connection reset` ||
        err.message ==
          `Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed.` ||
        client.pupPage.isClosed()
      ) {
        try {
          await client.initialize();
          const response = await sendOTP(phoneNumber, req, res);
          return response;
        } catch (e) {
          return res
            .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
              error: "error in sending the otp",
              err: e,
              errorMassage: e.message,
            });
        }
      } else {
        return res
          .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({
            error: "error in sending the otp",
            err: err,
            errorMassage: err.message,
          });
      }
    }
  },

  //////////////////////////

  async verifyOtp(req, res, next) {
    const { otp, otpId, phoneNumber } = req.body;

    try {
      const foundedOtp = await Otp.findOne({
        where: { value: otp, id: otpId, phoneNumber: phoneNumber },
      });
      if (foundedOtp) {
        return res.status(http_status_codes.StatusCodes.OK).json(true);
      } else {
        res.status(http_status_codes.StatusCodes.CREATED).json(false);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error in verifing the otp",
          err: error,
        });
    }
  },
  ///////////////
  async isUserExist(req, res, next) {
    try {
      const { email } = req.body;

      const isEmail = await User.findOne({
        where: {
          email: email,
        },
      });

      if (isEmail) {
        return res.status(http_status_codes.StatusCodes.OK).json(true);
      } else {
        return res.status(http_status_codes.StatusCodes.OK).json(false);
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in isUserExist",
          err: err,
        });
    }
  },
  async changePassword(req, res) {
    try {
      const userId = req.params.userId;

      const { oldPassword, newPassword } = req.body;

      const findUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (findUser) {
        const isAuth = hashedPassword.verify(oldPassword, findUser.password);
        if (!isAuth) {
          return res
            .status(http_status_codes.StatusCodes.UNAUTHORIZED)
            .json({ error: "Invalid old password!" });
        } else if (newPassword.length < 6) {
          return res
            .status(http_status_codes.StatusCodes.UNAUTHORIZED)
            .json({ error: "Password should be greater than 6 characters!" });
        } else {
          const changePassword = await User.update(
            {
              password: hashedPassword.generate(newPassword),
            },
            {
              where: {
                id: userId,
              },
            }
          );
          return res
            .status(http_status_codes.StatusCodes.ACCEPTED)
            .json({ message: "Password Changed Successfully!" });
        }
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in reset Password",
          error: error,
        });
    }
  },
  async updatePassword(req, res) {
    try {
      const userId = req.params.userId;
      const { password } = req.body;

      User.update(
        {
          password: hashedPassword.generate(password),
        },
        {
          where: {
            id: userId,
          },
        }
      );
      return res.status(http_status_codes.StatusCodes.OK).json({
        message: "Password Updated successfully",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "An error updatePassword",
          error: error,
        });
    }
  },
  async updateUser(req, res, next) {
    try {
      const userId = req.params.userId;

      const { firstName, lastName, phoneNumber, profileImg } = req.body;

      const updateUser = await User.update(
        {
          firstName: firstName,
          lastName: lastName,
          profileImg: profileImg,
          phoneNumber: phoneNumber,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      const findUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      return res.status(http_status_codes.StatusCodes.OK).json({
        message: "User updated successfully!",
        user: findUser,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in updateUser",
          err: error,
        });
    }
  },
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const deleteUser = await User.destroy({
        where: {
          id: userId,
        },
      });
      return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in User delete",
          err: error,
        });
    }
  },
  async allUser(req, res, next) {

    console.log(`reached here`);
    try {
      const user = await User.findAll({
        include: [
          {
            model: Address,
            require: false,
          },
          {
            model: Bank,
            require: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(user);
    } catch (error) {
      console.log(error)
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all user",
          err: error,
        });
    }
  },

  async oneUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const userJwt = req.headers.authorization.split(` `)[1];
      const userReceivedInfo = jwt.decode(userJwt, `secretKey-secretKey-secretKey`)
      // if (userReceivedInfo !==userId){
      //   return res
      //   .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
      //   .json({
      //     error: "Error occurred in get one User ",
      //     err: error,
      //   });
      // }

      console.log(userReceivedInfo.id);
      console.log(userReceivedInfo.id == userId);


      const user = await User.findOne({
        where: {
          id: userReceivedInfo.id,
        },
      });
      return res.status(http_status_codes.StatusCodes.OK).json(user);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get one User ",
          err: error,
        });
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      // var transporter = nodemailer.createTransport({
      //   service: "Gmail",
      //   auth: {
      //     user: "mrsawy5@gmail.com",
      //     pass: "Dfg456h7j8!",
      //   },
      // });

      const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net', // GoDaddy SMTP server hostname
        port: 465, // Use port 465 for SSL/TLS connection
        secure: true, // Enable SSL/TLS
        auth: {
          user: 'admin@bombticket.com', // Your domain email address
          pass: 'Azsxdcfv12345!' // Your domain email password
        }
      });
      var rand = Math.floor(100000 + Math.random() * 900000);

      var mailOptions = {
        from: "info@bombticket.com", // sender address
        to: email, // list of receivers
        subject: "User Password Verification Code", // Subject line
        text: "Here is a code to reset your password.", // plain text body
        html: `<h2>Hi,</h2>
                </br>
                <h3>You have requested to reset your password</h3>
                <p>Here is your verification code to reset your password: </p>
                </br></br>
                <h1> Your code - ${rand} </h1>
                </br>
                <p>If you ignore this message, your password will not be changed.</p>
                <h3>Best regards, Bomb ticket</h3>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(http_status_codes.StatusCodes.CONFLICT).json({
            error: "Error occurred while sending Verification Code",
            err: error,
          });
        } else {
          return res.status(http_status_codes.StatusCodes.OK).json({
            user: user,
            verificationCode: rand,
          });
        }
      });
    } else {
      return res
        .status(http_status_codes.StatusCodes.UNAUTHORIZED)
        .json({ error: "Email does not exist" });
    }
  },
  async blockUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const { isBlocked } = req.body;

      const blockUser = await User.update(
        {
          isBlocked: isBlocked,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      return res.status(http_status_codes.StatusCodes.OK).json({
        message: isBlocked
          ? "User blocked successfully!"
          : "User unblocked successfully!",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in blockUser",
          err: error,
        });
    }
  },

  async checkBlockUnblock(req, res, next) {
    try {
      const userId = req.params.userId;

      const user = await User.findOne({
        where: {
          id: userId,
        },
        attributes: ["isBlocked"],
      });
      if (user.isBlocked) {
        return res
          .status(http_status_codes.StatusCodes.UNAUTHORIZED)
          .json(user);
      } else {
        return res.status(http_status_codes.StatusCodes.OK).json(user);
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get one User ",
          err: error,
        });
    }
  },

  async dashBoard(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      const inProgressOrder = await Order.count({
        where: {
          providerId: userId,
          status: "in_progress",
        },

        order: [["createdAt", "DESC"]],
      });
      const reversedOrder = await Order.count({
        where: {
          providerId: userId,
          status: "reserved",
        },

        order: [["createdAt", "DESC"]],
      });
      const completedOrder = await Order.count({
        where: {
          providerId: userId,
          status: "completed",
        },

        order: [["createdAt", "DESC"]],
      });
      const cancelledOrder = await Order.count({
        where: {
          providerId: userId,
          status: "cancelled",
        },

        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json({
        inProgressOrder: inProgressOrder,
        reservedOrder: reversedOrder,
        completedOrder: completedOrder,
        cancelledOrder: cancelledOrder,
        userAvailable: user.isAvailable,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in user dash board",
          err: error,
        });
    }
  },
  async providerData(req, res, next) {
    try {
      const userId = req.params.userId;
      const getsOrderCount = await Order.count({
        where: {
          providerId: userId,
        },
      });
      const getFoodTruckCount = await FoodTruck.count({
        where: {
          userId: userId,
        },
      });
      const getMenuCount = await Menu.count({
        where: {
          userId: userId,
        },
      });

      return res.status(http_status_codes.StatusCodes.OK).json({
        orderCount: getsOrderCount,
        foodTruckCount: getFoodTruckCount,
        menuCount: getMenuCount,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get dash board",
          err: error,
        });
    }
  },
  async dashBoardBySeller(req, res, next) {
    try {
      const userId = req.params.userId;

      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD HH:mm");
      const endOfMonth = moment().endOf("month").format("YYYY-MM-DD HH:mm");

      const allWithdraws = await Withdraw.findAll({
        where: {
          userId: userId,
          status: "Accepted",
        },
        attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "amount"]],
      });

      const monthWithdraws = await Withdraw.findAll({
        where: {
          userId: userId,
          status: "Accepted",
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        attributes: [[sequelize.fn("SUM", sequelize.col("amount")), "amount"]],
      });

      const totalEarningOfSellers = allWithdraws[0].amount
        ? allWithdraws[0].amount
        : 0;
      const totalEarningOfSellersThisMouth = monthWithdraws[0].amount
        ? monthWithdraws[0].amount
        : 0;

      const approvedTickets = await TicketImg.count({
        where: {
          status: "approved",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: userId,
            },
          },
        ],
      });
      const PendingTicket = await TicketImg.count({
        where: {
          status: "pending",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: userId,
            },
          },
        ],
      });
      const rejectedTicket = await TicketImg.count({
        where: {
          status: "rejected",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: userId,
            },
          },
        ],
      });
      const getAllSellerOrderCount = await Order.count({
        sellerId: userId,
      });
      const allTicket = await TicketImg.count({
        include: [
          {
            where: {
              sellerId: userId,
            },
            model: Ticket,
          },
        ],
      });
      return res.status(http_status_codes.StatusCodes.OK).json({
        totalEarningOSellers: totalEarningOfSellers,
        totalEarningOSellersThisMouth: totalEarningOfSellersThisMouth,
        pendingTicketCount: PendingTicket,
        approvedTicketCount: approvedTickets,
        rejectedTicketCount: rejectedTicket,
        getAllSellerOrderCount: getAllSellerOrderCount,
        getAllSellerTicketCount: allTicket,
        TicketStats: [PendingTicket, approvedTickets, rejectedTicket],
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in seller dashboard",
          err: error,
        });
    }
  },
  async updateIBan(req, res, next) {
    try {
      const userId = req.params.userId;
      const { iBan } = req.body;
      const updateUser = await User.update(
        {
          iBan: iBan,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      return res.status(http_status_codes.StatusCodes.OK).json({
        message: "IBAN Number updated successfully!",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in updateIBan",
          err: error,
        });
    }
  },
  async markUserDisclaimer(req, res, next) {
    try {
      const userId = req.params.userId;

      const updateUser = await User.update(
        {
          isDisclaimerAgreed: true,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      return res.status(http_status_codes.StatusCodes.OK).json({
        message: "User Disclaimer mark agreed successfully!",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: "Error Occurred in updateUser",
          err: error,
        });
    }
  },
};
