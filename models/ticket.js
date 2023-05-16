module.exports = (sequelize, type) => {
    return sequelize.define("sell_ticket", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        price: type.DOUBLE,
        isBesideEachOther: type.BOOLEAN,
    });
};
// eventId

// (userId as) sellerId