const client = require(`./../../whats_app_Bot/app`);
const http_status_codes = require("http-status-codes");


const whatsappSend = async (number, msgBody, req, res, cd=()=>{}) => {

  console.log(cd)

  console.log(`trying to send now`);


  const phoneNumber = number.toString().replace(/[^\d]/g, "");
  try {
    const isRegistered = await client.isRegisteredUser(`${phoneNumber}@c.us`);
    if (isRegistered) {
      client.sendMessage(
        `${phoneNumber}@c.us`,
        `     *بومب تيكت*
        ${msgBody}
        `
      );

      if (typeof cd === "function") {
        console.log(`typeof cd is function`)
        cd();
      } else {
        console.error("Callback function not provided!");
      }

      return res.status(http_status_codes.StatusCodes.OK).json({
        isSent: true,
      });
    } else {
      console.log(`not registered`);
      return res.status(http_status_codes.StatusCodes.OK).json({
        isSent: false,
        reason: `phone number is not registered on whats app`,
      });
    }
  } catch (error) {
    console.log(error.message);
    if (
      error.message == `client_loop: send disconnect: Connection reset` ||
      error.message ==
        `Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed.` ||
      client.pupPage.isClosed()
    ) {
      /////////
      try {
        await client.initialize();
        const response = await whatsappSend(phoneNumber, msgBody, req, res);
        return response;
      } catch (err) {
        console.log(err.message);
        return res
          .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
          .json({
            error: "error in sending the otp",
            err: err,
            errorMassage: err.message,
          });
      }

      ////////////
    } else {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error in sending the massage",
          errorMassage: error.message,
        });
    }
  }
};

  module.exports = whatsappSend;