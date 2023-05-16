const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Bank } = require("../database/database.js");
const jwt = require("jsonwebtoken");

const op = sequelize.Op;
module.exports = {
  async createBank(req, res, next) {
    try {
      const { ibanNumber, bankName, accountHolderName, userId } = req.body;
      const createBank = await Bank.create({
        ibanNumber: ibanNumber,
        bankName: bankName,
        accountHolderName: accountHolderName,
        userId: userId,
      });
      return res.status(http_status_codes.StatusCodes.CREATED).json({
        message: "Bank created successfully",
        bank: createBank,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in create Bank",
          err: error,
        });
    }
  },
  async updateBank(req, res, next) {
    try {
      const bankId = req.params.bankId;
      const { ibanNumber, bankName, accountHolderName, userId } = req.body;
      const updateBank = await Bank.update(
        {
          ibanNumber: ibanNumber,
          bankName: bankName,
          accountHolderName: accountHolderName,
          userId: userId,
        },
        {
          where: {
            id: bankId,
          },
        }
      );
      const findBank = await Bank.findOne({
        where: {
          id: bankId,
        },
      });
      if (findBank) {
        return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
          message: "Bank updated successfully",
          bank: findBank,
        });
      } else {
        return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
          message: "Bank not found!",
        });
      }
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in update Bank",
          err: error,
        });
    }
  },
  async delBank(req, res, next) {
    try {
      const bankId = req.params.bankId;
      const deleteBank = await Bank.destroy({
        where: {
          id: bankId,
        },
      });
      return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
        message: "Bank deleted successfully",
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in Bank delete",
          err: error,
        });
    }
  },
  async allBank(req, res, next) {
    try {
      const allBank = await Bank.findAll({
        order: [["createdAt", "DESC"]],
      });
      return res.status(http_status_codes.StatusCodes.OK).json(allBank);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in all all Bank",
          err: error,
        });
    }
  },
  async oneBank(req, res, next) {
    try {
      const bankId = req.params.bankId;

      const oneBank = await Bank.findOne({
        where: {
          id: bankId,
        },
      });
      return res.status(http_status_codes.StatusCodes.OK).json(oneBank);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get one Bank ",
          err: error,
        });
    }
  },
  async userBankInfo(req, res, next) {
    try {
      const userId = req.params.userId;

      const oneBank = await Bank.findOne({
        where: {
          userId: userId,
        },
      });
      return res.status(http_status_codes.StatusCodes.OK).json(oneBank);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error occurred in get one Bank ",
          err: error,
        });
    }
  },
  async getByUser(req, res, next) {
    try {
      const userJwt = req.headers.authorization.split(` `)[1];
      const userReceivedInfo = jwt.decode(
        userJwt,
        `secretKey-secretKey-secretKey`
      );
      const userId = req.params.userId;



      console.log(userReceivedInfo.id);
      console.log(userReceivedInfo.id == userId);

      const userBank = await Bank.findOne({
        where: {
          userId: userReceivedInfo.id,
        },
      });
      return res.status(http_status_codes.StatusCodes.OK).json(userBank);
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Error occurred in get user Bank ",
          err: error,
        });
    }
  },
};
