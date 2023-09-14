const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const jwt = require('jsonwebtoken');

const {
  Ticket,
  User,
  Event,
  TicketImg,
  TicketSection,
  UserNameDetail,
} = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
  ////////////////////////////////
  createTicket: async (req, res, next) => {
    try {
      const {
        ticketSectionId,
        sellerId,
        price,
        eventId,
        isBesideEachOther,
        UploadFilesArray,
      } = req.body;

      const [event, created] = await Event.findOrCreate({
        where: { id: eventId },
        defaults: {
          dateTime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const ticketImg = [];
      const createTicket = await Ticket.create({
        price: price,
        sellerId: sellerId,
        eventId: eventId,
        isBesideEachOther: isBesideEachOther,
        ticketSectionId: ticketSectionId,
      });

      if (UploadFilesArray.length !== 0) {
        let createdticketImg;
        UploadFilesArray.forEach((element) => {
          ticketImg.push({
            image: element,
            status: "pending",
            sellTicketId: createTicket.id,
          });
        });

        const output = await TicketImg.bulkCreate(ticketImg);
        return res.status(http_status_codes.StatusCodes.CREATED).json({
          message: "Ticket created successfully",
          ticket: createTicket,
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "Tickets not created",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in create Ticket MYYYYYYY",
          err: error,
        });
    }
  },
  createUserName: async (req, res, next) => {
    try {
      const {
        ticketSectionId,
        sellerId,
        price,
        eventId,
        isBesideEachOther,
        UploadFilesArray,
        username,
        usernameDetails,
      } = req.body;

      const [event, created] = await Event.findOrCreate({
        where: { id: eventId },
        defaults: {
          dateTime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const ticketImg = [];
      const createTicket = await Ticket.create({
        price: price,
        sellerId: sellerId,
        eventId: eventId,
        isBesideEachOther: isBesideEachOther,
        ticketSectionId: ticketSectionId,
      });

      if (UploadFilesArray.length !== 0) {
        let createdticketImg;
        UploadFilesArray.forEach((element) => {
          ticketImg.push({
            image: element,
            status: "pending",
            sellTicketId: createTicket.id,
          });
        });

        const output = await TicketImg.bulkCreate(ticketImg);
        const createdUserNameInstance = await UserNameDetail.create({
          username,
          usernameDetails,
          sellTicketId: createTicket.id,
          eventId: Number(eventId),
        });

        return res.status(http_status_codes.StatusCodes.CREATED).json({
          message: "user created successfully",
          ticket: createTicket,
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "user not created",
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in create Ticket MYYYYYYY",
          err: error,
        });
    }
  },

  //////////////////////////////////
  async updateTicket(req, res, next) {
    try {
      const ticketId = req.params.ticketId;
      const {
        item,
        country,
        supplier,
        features,
        unit,
        price,
        status,
        quantity,
        rejectedReason,
        userInfo
      } = req.body;
      ///////////////////////////
      const userJwt = req.headers.authorization.split(` `)[1];
      const userReceivedInfo = jwt.decode(userJwt, `secretKey-secretKey-secretKey`)

console.log(`userReceivedInfo,`,userReceivedInfo,`userJwt:==`,userJwt);
      ///////////////////////////

      const updateTicket = await Ticket.update(
        {
          item: item,
          country: country,
          supplier: supplier,
          features: features,
          unit: unit,
          price: price,
          quantity: quantity,
          status: status,
          rejectedReason: rejectedReason,
        },
        {
          where: {
            id: ticketId,
            sellerId:userReceivedInfo.id
          },
        }
      );
      const findTicket = await Ticket.findOne({
        where: {
          id: ticketId,
        },
      });

      if (findTicket) {
        return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
          message: "Ticket updated successfully",
          ticket: findTicket,
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "Ticket not found!",
        });
      }
    } catch (error) {
      console.log(error)
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in update Ticket",
          err: error,
        });
    }
  },
  async delTicket(req, res, next) {
    try {
      const {ticketId, userInfo} = req.params;

      const deleteTicket = await Ticket.destroy({
        where: {
          id: ticketId,
          sellerId:userInfo.id

        },
      });
      return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
        message: "Ticket deleted successfully",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in Ticket delete",
          err: error,
        });
    }
  },
  async allTicket(req, res, next) {
    try {
      const pendingTicket = await Ticket.findAll({
        where: {
          status: "pending",
        },
        include: [
          {
            model: Event,
          },
          {
            model: User,
            as: "seller",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const approvedTicket = await Ticket.findAll({
        where: {
          status: "approved",
        },
        include: [
          {
            model: Event,
          },
          {
            model: User,
            as: "seller",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const rejectedTicket = await Ticket.findAll({
        where: {
          status: "rejected",
        },
        include: [
          {
            model: Event,
          },
          {
            model: User,
            as: "seller",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json({
        pendingTicket: pendingTicket,
        approvedTicket: approvedTicket,
        rejectedTicket: rejectedTicket,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Ticket",
          err: error,
        });
    }
  },
  async allPending(req, res, next) {

    console.log(req.headers);


    try {
      const pendingTicket = await TicketImg.findAll({
        where: {
          status: "pending",
        },
        include: [
          {
            model: Ticket,
            include: [
              {
                model: Event,
              },
              {
                model: User,
                as: "seller",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      let userDetailsArray = [];

      for (let pendTick of pendingTicket) {
        const eventId = pendTick.sell_ticket?.event?.id;

        if (eventId == 81) {
          const usersDetails = await UserNameDetail.findOne({
            where: { sellTicketId: pendTick.sell_ticket.id },
          });
          if (usersDetails) {
            userDetailsArray.push(usersDetails);
          }
        }
      }
      return res.status(http_status_codes.StatusCodes.OK).json([...pendingTicket, userDetailsArray]);
    } catch (error) {
      console.log(error);
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all pending Tickets",
          err: error,
        });
    }
  },
  async allApproved(req, res, next) {

    try {
      
      const approvedTicket = await TicketImg.findAll({
        where: {
          status: "approved",
        },
        include: [
          {
            model: Ticket,
            include: [
              {
                model: Event,
              },
              {
                model: User,
                as: "seller",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(approvedTicket);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all approved Tickets",
          err: error,
        });
    }
  },
  async allSold(req, res, next) {
 

    try {
      const soldTicket = await TicketImg.findAll({
        where: {
          status: "sold",
        },
        include: [
          {
            model: Ticket,
            include: [
              {
                model: Event,
              },
              {
                model: User,
                as: "seller",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(soldTicket);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all sold Tickets",
          err: error,
        });
    }
  },
  async allRejected(req, res, next) {

    try {
      const rejectedTicket = await TicketImg.findAll({
        where: {
          status: "rejected",
        },
        include: [
          {
            model: Ticket,
            include: [
              {
                model: Event,
              },
              {
                model: User,
                as: "seller",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(rejectedTicket);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all rejected Tickets",
          err: error,
        });
    }
  },
  async oneTicket(req, res, next) {
    try {
      const ticketId = req.params.ticketId;

      const oneTicket = await Ticket.findOne({
        where: {
          id: ticketId,
        },
      });
      return res.status(http_status_codes.StatusCodes.OK).json(oneTicket);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get one Ticket ",
          err: error,
        });
    }
  },
  async ticketPendingApprovedRejected(req, res, next) {
    try {
      const sellerId = req.params.sellerId;
      const pendingTicket = await TicketImg.findAll({
        where: {
          status: "pending",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: sellerId,
            },
            include: [
              {
                model: TicketSection,
                include: [
                  {
                    model: Event,
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      // pendingTicket.forEach(element1 => {
      //   if (element1.sell_ticket.sellerId == sellerId) {
      //     pendingTicketArray.push(element1)
      //   }
      // });
      const approvedTicket = await TicketImg.findAll({
        where: {
          status: "approved",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: sellerId,
            },
            include: [
              {
                model: TicketSection,
                include: [
                  {
                    model: Event,
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      // approvedTicket.forEach(element1 => {
      //   if (element1.sell_ticket.sellerId == sellerId) {
      //     approvedTicketArray.push(element1)
      //   }
      // });
      const rejectedTicket = await TicketImg.findAll({
        where: {
          status: "rejected",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: sellerId,
            },
            include: [
              {
                model: TicketSection,
                include: [
                  {
                    model: Event,
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const soldTicket = await TicketImg.findAll({
        where: {
          status: "sold",
        },
        include: [
          {
            model: Ticket,
            where: {
              sellerId: sellerId,
            },
            include: [
              {
                model: TicketSection,
                include: [
                  {
                    model: Event,
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      // rejectedTicket.forEach(element1 => {
      //   if (element1.sell_ticket.sellerId == sellerId) {
      //     rejectedTicketArray.push(element1)
      //   }
      // });
      return res.status(http_status_codes.StatusCodes.OK).json({
        pendingTicket: pendingTicket,
        approvedTicket: approvedTicket,
        rejectedTicket: rejectedTicket,
        soldTicket: soldTicket,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Ticket",
          err: error,
        });
    }
  },
};
