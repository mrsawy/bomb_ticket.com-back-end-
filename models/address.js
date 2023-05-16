module.exports = (sequelize, type) => {
    return sequelize.define("address", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        address: type.STRING,
        city: type.STRING,
        postalCode: type.STRING,
        country: type.STRING,
    });
};
// userId
