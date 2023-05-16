module.exports = (sequelize, type) => {
    return sequelize.define("withdraw", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        status: type.STRING,
        amount: type.DOUBLE,
        paidAt: type.DATE,
    });
};



