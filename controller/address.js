const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Address } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async createAddress(req, res, next) {
        try {
            const {
                address,
                city,
                postalCode,
                country,
                userId,
            } = req.body;
            const createAddress = await Address.create({
                address : address,
                city : city,
                postalCode : postalCode,
                country : country,
                userId : userId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Address created successfully",
                address: createAddress,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in create Address",
                    err: error,
                });
        }
    },
    async updateAddress(req, res, next) {
        try {
            const addressId = req.params.addressId;
            const {
                address,
                city,
                postalCode,
                country,
                userId,
            } = req.body;
            const updateAddress = await Address.update(
                {
                    address : address,
                city : city,
                postalCode : postalCode,
                country : country,
                userId : userId,
                },
                {
                    where: {
                        id: addressId,
                    },
                }
            );
            const findAddress = await Address.findOne({
                where: {
                    id: addressId,
                },
            });
            if (findAddress) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Address updated successfully",
                    address: findAddress,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Address not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in update Address",
                    err: error,
                });
        }
    },
    async delAddress(req, res, next) {
        try {
            const addressId = req.params.addressId;
            const deleteAddress = await Address.destroy({
                where: {
                    id: addressId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Address deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in Address delete",
                    err: error,
                });
        }
    },
    async allAddress(req, res, next) {

        try {
            const allAddress = await Address.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(allAddress);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in all all Address",
                    err: error,
                });
        }
    },
    async oneAddress(req, res, next) {
        try {
            const addressId = req.params.addressId;

            const oneAddress = await Address.findOne({
                where: {
                    id: addressId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(oneAddress);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one Address ",
                    err: error,
                });
        }
    },
}