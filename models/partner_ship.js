module.exports = (sequelize, type) => {
    return sequelize.define("partner_ship", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        image: type.STRING,
    });
};
