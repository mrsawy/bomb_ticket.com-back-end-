module.exports = (sequelize, type) => {
    return sequelize.define("silder", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        image: type.STRING,
    });
};