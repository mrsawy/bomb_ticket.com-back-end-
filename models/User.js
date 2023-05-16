module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      required: true,
    },
    firstName: type.STRING,
    lastName: type.STRING,
    email: type.STRING,
    phoneNumber: type.STRING,
    password: type.STRING,
    profileImg: type.STRING,
    gender: type.STRING,
    balance: {
      type: type.DOUBLE,
      defaultValue: 0,
    },
    isWithdrawRequested: type.BOOLEAN,
    isBlocked: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    isDisclaimerAgreed: {
      type: type.BOOLEAN,
      defaultValue: false,
    }
  });
};
