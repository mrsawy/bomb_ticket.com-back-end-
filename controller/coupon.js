const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Coupon } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async createCoupon(req, res, next) {
        try {
            const {
                name,
                percentOff,
                limit,
            } = req.body;
            const createCoupon = await Coupon.create({
                name: name,
                percentOff: percentOff,
                limit: limit,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Coupon created successfully",
                coupon: createCoupon,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in create Coupon",
                    err: error,
                });
        }
    },
    async updateCoupon(req, res, next) {
        try {
            const couponId = req.params.couponId;
            const {
                name,
                percentOff,
                limit,
            } = req.body;
            const updateCoupon = await Coupon.update(
                {
                    name: name,
                    percentOff: percentOff,
                    limit: limit,
                },
                {
                    where: {
                        id: couponId,
                    },
                }
            );
            const findCoupon = await Coupon.findOne({
                where: {
                    id: couponId,
                },
            });
            if (findCoupon) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Coupon updated successfully",
                    coupon: findCoupon,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Coupon not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in update Coupon",
                    err: error,
                });
        }
    },
    async delCoupon(req, res, next) {
        try {
            const couponId = req.params.couponId;
            const deleteCoupon = await Coupon.destroy({
                where: {
                    id: couponId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Coupon deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in Coupon delete",
                    err: error,
                });
        }
    },
    async allCoupon(req, res, next) {

        try {
            const allCoupon = await Coupon.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(allCoupon);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in all all Coupon",
                    err: error,
                });
        }
    },
    async oneCoupon(req, res, next) {
        try {
            const couponId = req.params.couponId;

            const oneCoupon = await Coupon.findOne({
                where: {
                    id: couponId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(oneCoupon);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one Coupon ",
                    err: error,
                });
        }
    },
    async checkCouponName(req, res, next) {
        try {
            const couponName = req.params.couponName;

            const oneCoupon = await Coupon.findOne({
                where: {
                    name: couponName,
                },
            });
            if (oneCoupon) {

                if (oneCoupon.limit > 0) {
                    return res.status(http_status_codes.StatusCodes.OK).json(oneCoupon);
                } else {
                    return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                        message: "Coupon is not Valid",
                    });
                }
            }else {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Coupon is not Valid",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one Coupon ",
                    err: error,
                });
        }
    },
}