module.exports = (sequelize, type) => {
    return sequelize.define("event", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        title: type.STRING,
        subtitle: type.STRING,
        eventImg: type.STRING,
        dateTime: type.DATE,
        locationImg: type.STRING,
        location: type.STRING,
        // lat: type.STRING,
        // lng: type.STRING,
        termsAndCondition: type.TEXT,
    });
};
