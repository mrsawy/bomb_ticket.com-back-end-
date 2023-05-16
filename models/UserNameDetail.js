module.exports = (sequelize, type) => {
  return sequelize.define("userNameDetails", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      required: true,
    },
    username: type.STRING,
    usernameDetails: type.STRING,
    // eventId: { type: type.INTEGER, required: false },
  });
};
