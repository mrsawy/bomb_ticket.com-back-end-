module.exports = (sequelize, type) => {
    return sequelize.define("ticket", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        image: type.STRING,
        status: type.STRING,
        rejectedReason: type.STRING,
        price: type.DOUBLE, // only for sold tickets
        tax: type.DOUBLE, // only for sold tickets
        finalPrice: type.DOUBLE, // only for sold tickets
    });
};
// ticketId