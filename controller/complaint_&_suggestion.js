const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { ComplaintSuggestion, User } = require("../database/database");
const op = sequelize.Op;
module.exports = {
    async createComplaintAndSuggestion(req, res, next) {
        try {
            const {
                subject,
                message,
                email,
            } = req.body;
            const createComplaintAndSuggestion = await ComplaintSuggestion.create({
                subject: subject,
                message: message,
                email: email,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "contact us created successfully",
                createComplaintAndSuggestion: createComplaintAndSuggestion,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create ComplaintAndSuggestion",
                    err: error,
                });
        }
    },

    async deleteComplainAndSuggestion(req, res, next) {
        try {
            const complainSuggestionId = req.params.complainSuggestionId;
            const deleteComplainAndSuggestion = await ComplaintSuggestion.destroy({
                where: {
                    id: complainSuggestionId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Complain Suggestion deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in Complain Suggestion delete",
                    err: error,
                });
        }
    },

    async allComplaintAndSuggestion(req, res, next) {

        try {
            const complaintAndSuggestion = await ComplaintSuggestion.findAll({

                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(complaintAndSuggestion);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all Complain Suggestion",
                    err: error,
                });
        }
    },

}