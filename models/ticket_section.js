module.exports = (sequelize, type) => {
    return sequelize.define("ticket_section", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        name: type.STRING,
    });
};
// eventId