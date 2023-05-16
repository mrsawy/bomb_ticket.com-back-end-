const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Slider } = require("../database/database.js");
const op = sequelize.Op;
module.exports = {
    async createSlider(req, res, next) {
        try {
            const {
                image,
            } = req.body;
            const createSlider = await Slider.create({
                image : image,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Slider created successfully",
                slider: createSlider,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in create Slider",
                    err: error,
                });
        }
    },
    async updateSlider(req, res, next) {
        try {
            const sliderId = req.params.sliderId;
            const {
                image,
            } = req.body;
            const updateSlider = await Slider.update(
                {
                    image : image,
                },
                {
                    where: {
                        id: sliderId,
                    },
                }
            );
            const findSlider = await Slider.findOne({
                where: {
                    id: sliderId,
                },
            });
            if (findSlider) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Slider updated successfully",
                    slider: findSlider,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Slider not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in update Slider",
                    err: error,
                });
        }
    },
    async delSlider(req, res, next) {
        try {
            const sliderId = req.params.sliderId;
            const deleteSlider = await Slider.destroy({
                where: {
                    id: sliderId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Slider deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in Slider delete",
                    err: error,
                });
        }
    },
    async allSlider(req, res, next) {

        try {
            const allSlider = await Slider.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(allSlider);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in all all Slider",
                    err: error,
                });
        }
    },
    async oneSlider(req, res, next) {
        try {
            const sliderId = req.params.sliderId;

            const oneSlider = await Slider.findOne({
                where: {
                    id: sliderId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(oneSlider);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error occurred in get one Slider ",
                    err: error,
                });
        }
    },
}