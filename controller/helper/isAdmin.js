const jwt = require('jsonwebtoken');
const { Admin } = require("../../database/database");

module.exports = (req,res,next)=>{

    console.log(`checking if admin or not `);

    const adminJwt = req.headers.authorization.split(` `)[1];
    const adminReceivedInfo = jwt.decode(adminJwt, `secretKey-secretKey-secretKey`)


    
    const foundedAdmin = Admin.findOne({
        where:{
            id: adminReceivedInfo.id,
            email: adminReceivedInfo.email,
            password: adminReceivedInfo.password      
        }
    })


    if(foundedAdmin){
        console.log(`admin w klo tamam ^_^`)
        next();
    }else{
        console.log(`not admin`)

        res.status(401).json({error:`unaouthorized`})
    }



}