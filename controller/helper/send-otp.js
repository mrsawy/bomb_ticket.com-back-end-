const http_status_codes = require("http-status-codes");
const client = require(`./../../whats_app_Bot/app`);
const { Otp } = require(`./../../database/database`);

// const connectionState = client.getConnectionState();

// console.log(connectionState);
module.exports = async (phoneNumber, req, res) => {
  //   try {
  // if (connectionState == `open`) {
  const isRegistered = await client.isRegisteredUser(`${phoneNumber}@c.us`);
  if (isRegistered) {
    let otpValue = Math.floor(Math.random() * 900000) + 100000;
    const newOtp = await Otp.create({
      value: otpValue,
      phoneNumber: phoneNumber,
    });
    const otpId = newOtp.id;
    await client.sendMessage(
      `${phoneNumber}@c.us`,
      `صديقنا العزيز , رمز التفعيل الخاص بك لموقع بومب تيكت هو : ${otpValue}
`
    );
    console.log(`massage ent`);
    return res.status(http_status_codes.StatusCodes.OK).json({
      topState: `sent`,
      otpId: otpId,
      phoneNumber: phoneNumber,
    });
  } else {
    console.log(`not registered`);
    return res
      .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: "user not register to whatsapp",
      });
  }
  // }
  //   }
  //   catch (error) {
  //     console.log(error.message);
  //     return res
  //       .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({
  //         error: "error in sending the otp",
  //         err: error,
  //         errorMassage: error.message,
  //       });
  //   }
};
