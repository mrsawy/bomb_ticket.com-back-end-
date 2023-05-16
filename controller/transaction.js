const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { User, Order, Transaction, FoodTruck, PaymentMethod, Withdraw, } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async allTransaction(req, res, next) {
        try {
            const userId = req.params.userId;

            const user = await User.findOne({
                where: {
                    id: userId,
                },
            });

            const userWithDraw = await Withdraw.findOne({
                where: {
                    userId: userId,
                    isPaid : false,
                },
            });
            
            const transaction = await Transaction.findAll({
                where: {
                    userId: userId,
                },
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                balance: user.balance,
                inprogressAmount: userWithDraw? userWithDraw.amount:0, 
                allTransaction: transaction 
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get in pending transaction ",
                    err: error,
                });
        }
    }
}