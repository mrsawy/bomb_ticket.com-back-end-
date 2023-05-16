const sequelize = require("sequelize");
const Op = sequelize.Op;
const http_status_codes = require("http-status-codes");
const { Coupon, UserCoupon, User, Order } = require("../database/database.js");

module.exports = {

    async findCoupon(req, res, next) {
        try {
            const {
                name,
                userId,
            } = req.body;

            const oneCoupon = await Coupon.findOne({
                where: {
                    name: name,
                },
                include: {
                    model: UserCoupon,
                    required: false,
                    where: {
                        userId: userId,
                    },
                }
            });
            var result = null;
            result = oneCoupon;
            if (oneCoupon) {
                if (oneCoupon.user_coupons.length) {
                    const userCoupon = oneCoupon.user_coupons[0];
                    if (userCoupon.status == 'active') {
                        return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                            couponData: oneCoupon,
                            userCouponId: userCoupon.id,
                        });
                    } else if (userCoupon.status == 'used') {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Coupon is used"
                        });
                    } else {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Coupon is not valid"
                        });
                    }
                } else {
                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: "Coupon not assigned to user"
                    });
                }
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "Coupon not found",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in find Coupon",
                    err: error,
                });
        }
    },

    async getAllCouponsWithQty(req, res, next) {
        try {
            const allCoupons = await Coupon.findAll({
                attributes: {
                    include: [[sequelize.fn("COUNT", sequelize.col("user_coupons.id")), "userCouponsCount"]]
                },
                group: ['coupon.id'],
                include: {
                    model: UserCoupon,
                    attributes: [],
                },
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Coupon data fetch successfully",
                couponData: allCoupons,
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in get all Coupon",
                    data: error,
                });
        }
    },

    async getAllUsersWithCoupon(req, res, next) {
        try {

            const couponId = req.params.couponId;

            const allUsersWithCoupon = await User.findAll({
                include: [
                    {
                        model: UserCoupon,
                        required: false,
                        where: {
                            couponId: couponId,
                        },
                    },
                    {
                        model: Order,
                        required: false,
                        include: {
                            model: UserCoupon,
                            where: {
                                couponId: couponId,
                            },
                            attributes: []
                        },
                        attributes: ['id']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Users with Coupon data fetch successfully",
                usersData: allUsersWithCoupon,
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in get all Users with Coupon",
                    data: error,
                });
        }
    },


    async assignCouponToBulkUsers(req, res, next) {
        try {

            const {
                couponId,
                userIds,
            } = req.body;

            const userCouponsArray = userIds.map(item => {
                return {
                    userId: item,
                    couponId: couponId,
                    status: 'active'
                }
            })

            await UserCoupon.bulkCreate(userCouponsArray);

            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Coupon Assigned To Bulk Users successfully",
                couponData: {},
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in Assigning Coupon To Bulk Users",
                    data: error,
                });
        }
    },

    async unassignCouponToBulkUsers(req, res, next) {
        try {

            const {
                couponId,
                userIds,
            } = req.body;


            const deleteCoupons = await UserCoupon.destroy({
                where: {
                    couponId: couponId,
                    userId: userIds,
                }
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Coupon Unassigned To Bulk Users successfully",
                couponData: {},
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in Unassign Coupon To Bulk Users",
                    data: error,
                });
        }
    },


    async getUserCouponsWithUserCoupon(req, res, next) {
        try {

            const userId = req.params.userId;

            const allCouponsWithUserCoupon = await Coupon.findAll({
                include: {
                    model: UserCoupon,
                    required: true,
                    where: {
                        userId: userId,
                    },
                    include: {
                        model: Order,
                        required: false,
                        attributes: ['id', 'orderNumber']
                    }
                },
                order: [['createdAt', 'DESC']]
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Coupons with UserCoupon data fetch successfully",
                couponsData: allCouponsWithUserCoupon,
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in get all Coupons with UserCoupon",
                    data: error,
                });
        }
    },


}