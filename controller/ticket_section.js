const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { TicketSection } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async createTicketSection(req, res, next) {
        try {
            const {
                name,
                eventId,
            } = req.body;
            const createTicketSection = await TicketSection.create({
                name : name,
                eventId : eventId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "TicketSection created successfully",
                ticketSection: createTicketSection,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in create TicketSection",
                    err: error,
                });
        }
    },
    async updateTicketSection(req, res, next) {
        try {
            const ticketSectionId = req.params.ticketSectionId;
            const {
                name,
                eventId,
            } = req.body;
            const updateTicketSection = await TicketSection.update(
                {
                    name : name,
                    eventId : eventId,
                },
                {
                    where: {
                        id: ticketSectionId,
                    },
                }
            );
            const findTicketSection = await TicketSection.findOne({
                where: {
                    id: ticketSectionId,
                },
            });
            if (findTicketSection) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "TicketSection updated successfully",
                    ticketSection: findTicketSection,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "TicketSection not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in update TicketSection",
                    err: error,
                });
        }
    },
    async delTicketSection(req, res, next) {
        try {
            const ticketSectionId = req.params.ticketSectionId;
            const deleteTicketSection = await TicketSection.destroy({
                where: {
                    id: ticketSectionId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "TicketSection deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in TicketSection delete",
                    err: error,
                });
        }
    },
    async allTicketSection(req, res, next) {

        try {
            const allTicketSection = await TicketSection.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(allTicketSection);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in all all TicketSection",
                    err: error,
                });
        }
    },
    async allTicketSectionByEvent(req, res, next) {
        try {
            const eventId = req.params.eventId;

            const allTicketSection = await TicketSection.findAll({
                where: {
                    eventId: eventId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(allTicketSection);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one TicketSection ",
                    err: error,
                });
        }
    },
    async oneTicketSection(req, res, next) {
        try {
            const ticketSectionId = req.params.ticketSectionId;

            const oneTicketSection = await TicketSection.findOne({
                where: {
                    id: ticketSectionId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(oneTicketSection);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one TicketSection ",
                    err: error,
                });
        }
    },
}