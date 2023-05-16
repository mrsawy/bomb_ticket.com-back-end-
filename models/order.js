module.exports = (sequelize, type) => {
    return sequelize.define("order", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        firstName: type.STRING,
        lastName: type.STRING,
        phoneNumber: type.STRING,
        // status: type.STRING,
        orderNumber: type.INTEGER,
        quantity: type.INTEGER,
        price: type.DOUBLE,
        discount: type.DOUBLE,
        orderAmount: type.DOUBLE,
    });
};
// (userId as) sellerId

// ticketId