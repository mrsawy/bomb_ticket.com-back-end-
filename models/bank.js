module.exports = (sequelize, type) => {
    return sequelize.define("bank", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        ibanNumber: type.STRING,
        bankName: type.STRING,
        accountHolderName: type.STRING,
    });
};
// userId
