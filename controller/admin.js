const http_status_codes = require("http-status-codes");
const { Admin } = require("../database/database.js");
const passwordHash = require("password-hash");
const jwt = require('jsonwebtoken');

module.exports = {


    async createAdmin(req, res, next) {
        try {
            const {
                name,
                email,
                phoneNumber,
                profilePhoto,
                password,
            } = req.body;

            const mySuperAdmin = await Admin.findOne({
                where: { isSuper: true }
            })

            var isSuperAdmin = false;

            if (!mySuperAdmin) {
                isSuperAdmin = true;
            }

            if (password.length >= 6) {

                const createAdmin = await Admin.create({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    profilePhoto: profilePhoto,
                    password: passwordHash.generate(password),
                    isSuper: isSuperAdmin,
                });

                return res.status(http_status_codes.StatusCodes.CREATED).json({
                    status_code: http_status_codes.StatusCodes.CREATED,
                    status: "success",
                    message: "Admin created successfully!",
                    admin: createAdmin,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    status_code: http_status_codes.StatusCodes.CONFLICT,
                    status: "error",
                    message: "Password must be minimum 6 characters long!",
                    admin: null,
                });

            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in creating Admin!",
                    error: error,
                });
        }
    },


    async updateAdmin(req, res, next) {
        try {
            const {
                id,
                name,
                email,
                phoneNumber,
                profilePhoto,
            } = req.body;

            await Admin.update(
                {
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    profilePhoto: profilePhoto,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            const foundAdmin = await Admin.findOne({
                where: {
                    id: id,
                },
            });
            if (foundAdmin) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    status_code: http_status_codes.StatusCodes.OK,
                    status: "success",
                    message: "Admin updated successfully!",
                    admin: foundAdmin,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    status_code: http_status_codes.StatusCodes.NOT_FOUND,
                    status: "error",
                    message: "Admin data not found!",
                    admin: null,
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: 'error',
                    message: "Error occurred in updating Admin!",
                    error: error,
                });
        }
    },


    async loginAdmin(req, res, next) {
        try {
            const {
                email,
                password,
            } = req.body;

            const myAdmin = await Admin.findOne({
                where: {
                    email: email,

                }
            })
            if (myAdmin) {

                const verifyPassword = passwordHash.verify(password, myAdmin.password);

                if (verifyPassword) {

                    const adminJwt = jwt.sign({id:myAdmin.id , password:password,email:email}, `secretKey-secretKey-secretKey`);
                    console.log(jwt);
                    return res.status(http_status_codes.StatusCodes.OK).json({
                        status_code: http_status_codes.StatusCodes.OK,
                        status: "success",
                        message: "Admin logged in successfully!",
                        admin: myAdmin,
                        jwt:adminJwt
                    });
                } else {
                    return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                        status_code: http_status_codes.StatusCodes.UNAUTHORIZED,
                        status: "error",
                        message: "Password is incorrect!",
                        admin: null,
                    });

                }

            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    status_code: http_status_codes.StatusCodes.NOT_FOUND,
                    status: "error",
                    message: "No Admin found against this email!",
                    admin: null,
                });
            }
        } catch (error) {
            console.log(error);
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: 'error',
                    message: "Error occurred in logging in Admin!",
                    error: error,
                });
        }
    },


    async deleteAdmin(req, res, next) {
        try {
            const adminId = req.params.adminId;

            const adminDelete = await Admin.destroy({
                where: {
                    id: adminId,
                },
            });


            if (adminDelete) {

                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    status_code: http_status_codes.StatusCodes.ACCEPTED,
                    status: "success",
                    message: "Admin deleted successfully!",
                    admin: null,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    status_code: http_status_codes.StatusCodes.NOT_FOUND,
                    status: "error",
                    message: "Admin not deleted!",
                    admin: null,
                });

            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in deleting Admin!",
                    error: error,
                });
        }
    },


    async changePassword(req, res, next) {
        try {
            const {
                id,
                oldPassword,
                newPassword,
            } = req.body;

            const myAdmin = await Admin.findOne({
                where: {
                    id: id
                }
            })

            const verifyPassword = passwordHash.verify(oldPassword, myAdmin.password);

            if (verifyPassword) {

                if (password.length >= 6) {

                    await Admin.update(
                        {
                            password: passwordHash.generate(newPassword)
                        },
                        {
                            where: {
                                id: id
                            }
                        }
                    )

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        status_code: http_status_codes.StatusCodes.OK,
                        status: "success",
                        message: "Password changed successfully!",
                        admin: null,
                    });

                } else {

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        status_code: http_status_codes.StatusCodes.OK,
                        status: "error",
                        message: "Password must be minimum 6 characters long!",
                        admin: null,
                    });

                }

            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    status_code: http_status_codes.StatusCodes.CONFLICT,
                    status: "error",
                    message: "Old Password is incorrect!",
                    admin: null,
                });

            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in changing Password!",
                    error: error,
                });
        }
    },


    async updatePassword(req, res, next) {
        try {
            const {
                id,
                password,
            } = req.body;


            await Admin.update(
                {
                    password: passwordHash.generate(password)
                },
                {
                    where: {
                        id: id
                    }
                }
            )


            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "Admin Password updated successfully!",
                admin: null,
            });

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in updating Admin Password!",
                    error: error,
                });
        }
    },


    async getOneAdmin(req, res, next) {
        try {
            const adminId = req.params.adminId;

            const oneAdmin = await Admin.findOne({
                where: {
                    id: adminId,
                },
            });
            if (oneAdmin) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    status_code: http_status_codes.StatusCodes.OK,
                    status: "success",
                    message: "One Admin data fetched successfully!",
                    admin: oneAdmin,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    status_code: http_status_codes.StatusCodes.NOT_FOUND,
                    status: "error",
                    message: "One Admin data not found!",
                    admin: null,
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting one Admin!",
                    error: error,
                });
        }
    },


    async getAllAdmins(req, res, next) {
        try {
            const allAdmins = await Admin.findAll({
                order: [["createdAt", "DESC"]],
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                status_code: http_status_codes.StatusCodes.OK,
                status: "success",
                message: "All Admins data fetched successfully!",
                admins: allAdmins,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting All Admins!",
                    error: error,
                });
        }
    },


    async setPercentage(req, res, next) {
        try {
            const {
                percentage,
            } = req.body;

            const percentageUpdate = await Admin.update(
                {
                    percentage: percentage,
                },
                {
                    where: {
                        isSuper: true,
                    }
                }
            );

            if (percentageUpdate[0]) {

                return res.status(http_status_codes.StatusCodes.CREATED).json({
                    status_code: http_status_codes.StatusCodes.CREATED,
                    status: "success",
                    message: "Percentage updated successfully!",
                });

            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    status_code: http_status_codes.StatusCodes.CONFLICT,
                    status: "error",
                    message: "Percentage not updated!",
                });

            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in updating Percentage!",
                    error: error,
                });
        }
    },


    async getPercentage(req, res, next) {
        try {

            const foundData = await Admin.findOne({
                where: {
                    isSuper: true
                },
                attributes: ['percentage']
            })

            if (foundData) {

                return res.status(http_status_codes.StatusCodes.CREATED).json({
                    status_code: http_status_codes.StatusCodes.CREATED,
                    status: "success",
                    message: "Percentage data fetched successfully!",
                    data: foundData,
                });

            } else {

                return res.status(http_status_codes.StatusCodes.CONFLICT).json({
                    status_code: http_status_codes.StatusCodes.CONFLICT,
                    status: "error",
                    message: "No Percentage data found!",
                    data: null,
                });

            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    status_code: http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
                    status: "error",
                    message: "Error occurred in getting Percentage!",
                    error: error,
                });
        }
    },

}