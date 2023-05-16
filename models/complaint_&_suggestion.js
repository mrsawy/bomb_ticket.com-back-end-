module.exports = (sequelize, type) => {
    return sequelize.define("complaint_and_suggestion", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        subject: type.STRING,
        email: type.STRING,
        message: type.TEXT,
    });
};
