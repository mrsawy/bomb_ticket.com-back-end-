module.exports = (sequelize, type) => {
    return sequelize.define("user_coupon", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        status: type.ENUM('active', 'used'),
    });
};