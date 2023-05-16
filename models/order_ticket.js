module.exports = (sequelize, type) => {
    return sequelize.define("order_ticket", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
    });
};