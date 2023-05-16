const { STRING } = require("sequelize");

module.exports = (sequelize, type) => {
    return sequelize.define("transaction", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        amount:type.STRING,
        type:type.STRING,

    });
};
