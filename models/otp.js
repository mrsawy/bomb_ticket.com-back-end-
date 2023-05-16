module.exports = (sequelize, type) => {
    return sequelize.define("otp", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        value: type.STRING,
        phoneNumber: type.STRING,
        // amount: type.DOUBLE,
        // paidAt: type.DATE,
    });
};