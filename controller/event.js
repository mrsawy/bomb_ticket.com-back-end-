const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");

const {
  Event,
  Ticket,
  TicketSection,
  User,
  Slider,
  TicketImg,
  UserNameDetail,
} = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
  async createEvent(req, res, next) {
    try {
      const {
        title,
        subtitle,
        eventImg,
        dateTime,
        locationImg,
        location,
        // lat,
        // lng,
        termsAndCondition,
      } = req.body;
      const createEvent = await Event.create({
        title: title,
        subtitle: subtitle,
        eventImg: eventImg,
        dateTime: dateTime,
        locationImg: locationImg,
        location: location,
        // lat: lat,
        // lng: lng,
        termsAndCondition: termsAndCondition,
      });
      return res.status(http_status_codes.StatusCodes.CREATED).json({
        message: "Event created successfully",
        event: createEvent,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in create Event",
          err: error,
        });
    }
  },
  async updateEvent(req, res, next) {
    try {
      const eventId = req.params.eventId;
      const {
        title,
        subtitle,
        eventImg,
        dateTime,
        locationImg,
        location,
    
        termsAndCondition,
      } = req.body;
      const updateEvent = await Event.update(
        {
          title: title,
          subtitle: subtitle,
          eventImg: eventImg,
          dateTime: dateTime,
          locationImg: locationImg,
          location: location,
          // lat: lat,
          // lng: lng,
          termsAndCondition: termsAndCondition,
        },
        {
          where: {
            id: eventId,
          },
        }
      );
      const findEvent = await Event.findOne({
        where: {
          id: eventId,
        },
      });
      if (findEvent) {
        return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
          message: "Event updated successfully",
          event: findEvent,
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "Event not found!",
        });
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in update Event",
          err: error,
        });
    }
  },
  async delEvent(req, res, next) {
    try {
      const eventId = req.params.eventId;
      const deleteEvent = await Event.destroy({
        where: {
          id: eventId,
        },
      });
      return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in Event delete",
          err: error,
        });
    }
  },
  async allEvent(req, res, next) {
    try {
      const allEvent = await Event.findAll({
        include: [
          {
            model: TicketSection,
            require: false,
            include: [
              {
                model: Ticket,
                require: false,
                include: [
                  {
                    model: User,
                    require: false,
                    as: "seller",
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allEvent);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Event",
          err: error,
        });
    }
  },
  async allEventWithCarouselData(req, res, next) {
    try {
      console.log(`test`);
      const allEvent = await Event.findAll({
        order: [["createdAt", "DESC"]],
      });
      const allSlider = await Slider.findAll({
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json({
        allEvent: allEvent,
        allSlider: allSlider,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Event",
          err: error,
        });
    }
  },
  async oneEvent(req, res, next) {
    try {
      const eventId = req.params.eventId;

      const oneEvent = await Event.findOne({
        where: {
          id: eventId,
        },
        include: [
          {
            require: false,
            model: Ticket,
            include: [
              {
                require: false,
                model: TicketSection,
              },
              {
                require: false,
                model: TicketImg,
                where: {
                  [op.or]: [
                    {
                      status: "approved",
                    },
                    {
                      status: "sold",
                    },
                  ],
                },
              },
            ],
          },
        ],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(oneEvent);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get one Event ",
          err: error,
        });
    }
  },

  async allEventAdmin(req, res, next) {
    try {
      const allEvent = await Event.findAll({
        include: [
          {
            model: TicketSection,
            require: false,
            include: [
              {
                model: Ticket,
                require: false,
                include: [
                  {
                    model: User,
                    require: false,
                    as: "seller",
                  },
                  {
                    model: TicketImg,
                    require: false,
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allEvent);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Event",
          err: error,
        });
    }
  },

  async getDetail(req, res, next) {
    try {
      const eventId = req.params.eventId;


      const oneEvent = await Event.findOne({
        where: {
          id: eventId,
        },
      });

      const eventTickets = await Ticket.findAll({
        where: {
          eventId: eventId,
        },
        include: [
          {
            model: TicketSection,
            required: false,
          },
          // {
          //   model: UserNameDetail,
          //   required: false,
          // },
          {
            model: TicketImg,
            required: false,
            where: {
              [op.or]: [{ status: "approved" }, { status: "sold" }],
            },
            attributes: ["id", "sellTicketId", "status"],
          },
        ],
      });


      const usersDetails=[];
      if (eventId == 81) {


        for (const sellTicket of eventTickets) {
          let userDetail = await UserNameDetail.findOne({
            where: { sellTicketId: sellTicket.id },
          });
          if(userDetail){
            usersDetails.push(userDetail)
          }

        }

    }
    // console.log(`usersDetails=====================`,usersDetails);


     


      const eventTicketsArray = await eventTickets.map( (sellTicket) => {

        let  userNameDetails = usersDetails.find(d=>d.sellTicketId==sellTicket.id)
        var sellTicketObj = {
          id: sellTicket.id,
          price: sellTicket.price,
          isBesideEachOther: sellTicket.isBesideEachOther,
          ticketSectionId: sellTicket.ticketSectionId,
          eventId: sellTicket.eventId,
          // sellerId: sellTicket.sellerId,
          ticket_section: sellTicket.ticket_section,
          approvedTickets: 0,
          soldTickets: 0,
          tickets: [],
          userNameDetails:eventId==81?userNameDetails:null
        };

       

        sellTicket.tickets.forEach( (ticket) => {
          var ticketObj = {
            id: ticket.id,
            image: ticket.image,
            status: ticket.status,
            sellTicketId: ticket.sellTicketId,
          };
          if (ticket.status == "approved") {
            sellTicketObj.approvedTickets += 1;
            sellTicketObj.tickets.push(ticketObj);
            // if (eventId == 81) {
            // } else {
            //   sellTicketObj.tickets.push(ticketObj);
            // }
          } else if (ticket.status == "sold") {
            sellTicketObj.soldTickets += 1;
            if (sellTicket.eventId == 81) {
              sellTicketObj.tickets.push(ticketObj);
            }
          }
        });
  

        return sellTicketObj;
      });

      return res.status(http_status_codes.StatusCodes.OK).json({
        event: oneEvent,
        eventTickets: eventTicketsArray,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get Event Detail ",
          err: error,
        });
    }
  },
};
