const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { PaymentMethod } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {

    async createPaymentMethod(req, res, next) {
        try {

            const {
                cardNumber,
                cardName,
                cvv,
                expMonth,
                expYear,
                userId,
            } = req.body;

            const findPaymentMethod = await PaymentMethod.findOne({
                where: {
                    userId: userId
                }
            });
            if (!findPaymentMethod) {
                const createPaymentMethod = await PaymentMethod.create({
                    cardNumber: cardNumber,
                    cardName: cardName,
                    cvv: JSON.stringify(Math.floor(1000000 + Math.random() * 9000000)) + cvv + JSON.stringify(Math.floor(100000 + Math.random() * 900000)),
                    expMonth: expMonth,
                    expYear: expYear,
                    userId: userId,
                });
                return res
                    .status(http_status_codes.StatusCodes.ACCEPTED)
                    .json({
                        message: "PaymentMethod created successfully",
                        paymentMethod: createPaymentMethod,
                    });
            } else {
                const updatePaymentMethod = await PaymentMethod.update(
                    {
                        cardNumber: cardNumber,
                        cardName: cardName,
                        cvv: JSON.stringify(Math.floor(1000000 + Math.random() * 9000000)) + cvv + JSON.stringify(Math.floor(100000 + Math.random() * 900000)),
                        expMonth: expMonth,
                        expYear: expYear,
                    },
                    {
                        where: {
                            userId: userId
                        }
                    }
                )
                return res
                    .status(http_status_codes.StatusCodes.ACCEPTED)
                    .json({
                        message: "PaymentMethod update successfully!",
                    });
            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error occurred in createPaymentMethod',
                err: error
            });
        }
    },

    async updatePaymentMethod(req, res, next) {
        try {

            const paymentMethodId = req.params.paymentMethodId;

            const {
                cardNumber,
                cardName,
                cvv,
                expMonth,
                expYear,
            } = req.body;

            const updatePaymentMethod = await PaymentMethod.update(
                {
                    cardNumber: cardNumber,
                    cardName: cardName,
                    cvv: cvv,
                    expMonth: expMonth,
                    expYear: expYear,
                },
                {
                    where: {
                        id: paymentMethodId
                    }
                }
            )

            const findPaymentMethod = await PaymentMethod.findOne({
                where: {
                    id: paymentMethodId
                }
            });

            if (findPaymentMethod) {
                return res
                    .status(http_status_codes.StatusCodes.ACCEPTED)
                    .json({
                        message: "PaymentMethod updated successfully!",
                        PaymentMethod: findPaymentMethod,
                    });
            } else {
                return res
                    .status(http_status_codes.StatusCodes.NOT_FOUND)
                    .json({
                        message: "PaymentMethod data not found!",
                    });
            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: 'Error occurred in updatePaymentMethod',
                    err: error
                });
        }
    },

    async deletePaymentMethod(req, res, next) {

        try {
            const paymentMethodId = req.params.paymentMethodId;

            const deletePaymentMethod = await PaymentMethod.destroy({
                where: {
                    id: paymentMethodId
                }
            });

            return res
                .status(http_status_codes.StatusCodes.ACCEPTED)
                .json({
                    message: "PaymentMethod deleted successfully!"
                });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error occurred in deletePaymentMethod',
                err: error
            });
        }
    },

    async getPaymentMethod(req, res, next) {
        try {
            const paymentMethodId = req.params.paymentMethodId;

            const getPaymentMethod = await PaymentMethod.findOne({
                id: paymentMethodId
            });

            if (getPaymentMethod) {
                return res
                    .status(http_status_codes.StatusCodes.OK)
                    .json({
                        message: "PaymentMethod data fetched successfully!",
                        PaymentMethod: getPaymentMethod,
                    });
            } else {
                return res
                    .status(http_status_codes.StatusCodes.NOT_FOUND)
                    .json({
                        message: "PaymentMethod data not found!",
                    });
            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: 'Error occurred in getPaymentMethod',
                    err: error
                });
        }
    },

    async getAllPaymentMethodsByUserId(req, res, next) {
        try {
            const userId = req.params.userId;

            const paymentMethods = await PaymentMethod.findAll(
                {
                    where: {
                        userId: userId
                    }
                }
            );

            if (paymentMethods.length) {

                const decryptedPaymentMethods = await paymentMethods.map(element => {
                    let removeFromFirst = element.cvv.substr(7, element.cvv.length);
                    let removeFromLast = removeFromFirst.substr(0, removeFromFirst.length - 6)
                    return {
                        cardNumber: element.cardNumber,
                        cardName: element.cardName,
                        expMonth: element.expMonth,
                        expYear: element.expYear,
                        userId: element.userId,
                        cvv: removeFromLast,
                        id: element.id,
                    }
                });

                return res
                    .status(http_status_codes.StatusCodes.OK)
                    .json(decryptedPaymentMethods);

            } else {
                return res
                    .status(http_status_codes.StatusCodes.OK)
                    .json(paymentMethods);
            }



        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error occurred in getAllPaymentMethods',
                err: error,
            });
        }
    },

    async getAllPaymentMethods(req, res, next) {
        try {
            const paymentMethods = await PaymentMethod.findAll();

            return res
                .status(http_status_codes.StatusCodes.OK)
                .json(paymentMethods);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error occurred in getAllPaymentMethods',
                err: error,
            });
        }
    },
}