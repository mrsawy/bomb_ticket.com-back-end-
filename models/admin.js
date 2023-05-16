module.exports = (sequelize, type) => {
    return sequelize.define("admin", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: type.STRING,
        email: type.STRING,
        phoneNumber: type.STRING,
        profilePhoto: type.STRING,
        password: type.STRING,
        isSuper: type.BOOLEAN,
        percentage: type.DOUBLE,
    });
};
