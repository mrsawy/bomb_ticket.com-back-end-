module.exports = (sequelize, type) => {
    return sequelize.define("payment_method", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        cvv: type.STRING,
        cardNumber: type.STRING,
        cardName: type.STRING,
        expMonth: type.INTEGER,
        expYear: type.INTEGER,
        
    });
};
