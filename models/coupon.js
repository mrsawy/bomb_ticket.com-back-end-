module.exports = (sequelize, type) => {
    return sequelize.define("coupon", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        name: type.STRING,
        percentOff: type.DOUBLE,
        limit: type.INTEGER,
    });
};