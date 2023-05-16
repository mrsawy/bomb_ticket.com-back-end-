const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { TicketImg, Ticket } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async createTicketImg(req, res, next) {
        try {
            const {
                image,
                ticketId,
            } = req.body;
            const createTicketImg = await TicketImg.create({
                image: image,
                ticketId: ticketId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Ticket Img created successfully",
                ticketImg: createTicketImg,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in create TicketImg",
                    err: error,
                });
        }
    },
    async updateTicketImg(req, res, next) {
        try {
            const ticketImgId = req.params.ticketImgId;
            const {
                image,
                status,
                rejectedReason,
                sellTicketId,
            } = req.body;
            const updateTicketImg = await TicketImg.update(
                {
                    image: image,
                    status: status,
                    rejectedReason: rejectedReason,
                    sellTicketId: sellTicketId,
                },
                {
                    where: {
                        id: ticketImgId,
                    },
                }
            );
            const findTicketImg = await TicketImg.findOne({
                where: {
                    id: ticketImgId,
                },
            });
            if (findTicketImg) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "TicketImg updated successfully",
                    ticketImg: findTicketImg,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "TicketImg not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in update TicketImg",
                    err: error,
                });
        }
    },
    async delTicketImg(req, res, next) {
        try {
            const ticketImgId = req.params.ticketImgId;
            const deleteTicketImg = await TicketImg.destroy({
                where: {
                    id: ticketImgId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "TicketImg deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in TicketImg delete",
                    err: error,
                });
        }
    },

    async delTicketAndImg(req, res, next) {
        try {
            const {
                ticketId,
                sellTicketId
            } = req.body;

            const ticketsCount = await TicketImg.count({
                where: {
                    sellTicketId: sellTicketId,
                }
            })

            if (ticketsCount < 2) {
                await TicketImg.destroy({
                    where: {
                        sellTicketId: sellTicketId,
                    },
                });

            } else {
                await TicketImg.destroy({
                    where: {
                        id: ticketId,
                    },
                });
            }
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "TicketImg deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in TicketImg delete",
                    err: error,
                });
        }
    },

    async allTicketImg(req, res, next) {

        try {
            const allTicketImg = await TicketImg.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(allTicketImg);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in all all TicketImg",
                    err: error,
                });
        }
    },
    async oneTicketImg(req, res, next) {
        try {
            const ticketImgId = req.params.ticketImgId;

            const oneTicketImg = await TicketImg.findOne({
                where: {
                    id: ticketImgId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(oneTicketImg);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one TicketImg ",
                    err: error,
                });
        }
    },


    async updateDeleteBulkTickets(req, res, next) {
        try {
            const {
                ticketIds,
                status,
                rejectedReason,
            } = req.body;

            if (status == 'delete') {

                await TicketImg.destroy({
                    where: {
                        id: ticketIds,
                    }
                })

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Bulk Tickets deleted successfully",
                });

            } else if (status == 'rejected') {

                await TicketImg.update(
                    {
                        status: status,
                        rejectedReason: rejectedReason,
                    },
                    {
                        where: {
                            id: ticketIds,
                        },
                    }
                );

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Bulk Tickets rejected successfully",
                });

            } else {

                await TicketImg.update(
                    {
                        status: status,
                    },
                    {
                        where: {
                            id: ticketIds,
                        },
                    }
                );

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Bulk Tickets updated successfully",
                });

            }


        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in update delete bulk Tickets",
                    err: error,
                });
        }
    },
}