const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { PartnerShip } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async createPartnerShip(req, res, next) {
        try {
            const {
                image,
            } = req.body;
            const createPartnerShip = await PartnerShip.create({
                image : image,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "PartnerShip created successfully",
                partnerShip: createPartnerShip,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create PartnerShip",
                    err: error,
                });
        }
    },
    async updatePartnerShip(req, res, next) {
        try {
            const partnerShipId = req.params.partnerShipId;
            const {
                image,
            } = req.body;
            const updatePartnerShip = await PartnerShip.update(
                {
                    image : image,
                },
                {
                    where: {
                        id: partnerShipId,
                    },
                }
            );
            const findPartnerShip = await PartnerShip.findOne({
                where: {
                    id: partnerShipId,
                },
            });
            if (findPartnerShip) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "PartnerShip updated successfully",
                    partnerShip: findPartnerShip,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "PartnerShip not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in update PartnerShip",
                    err: error,
                });
        }
    },
    async delPartnerShip(req, res, next) {
        try {
            const partnerShipId = req.params.partnerShipId;
            const deletePartnerShip = await PartnerShip.destroy({
                where: {
                    id: partnerShipId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "PartnerShip deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in PartnerShip delete",
                    err: error,
                });
        }
    },
    async allPartnerShip(req, res, next) {

        try {
            const allPartnerShip = await PartnerShip.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(allPartnerShip);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all all PartnerShip",
                    err: error,
                });
        }
    },
    async onePartnerShip(req, res, next) {
        try {
            const partnerShipId = req.params.partnerShipId;

            const onePartnerShip = await PartnerShip.findOne({
                where: {
                    id: partnerShipId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(onePartnerShip);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one PartnerShip ",
                    err: error,
                });
        }
    },
}