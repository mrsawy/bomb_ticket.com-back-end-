const client = require(`./../whats_app_Bot/app`);
const http_status_codes = require("http-status-codes");
// const { User } = require(`./../database/database`);
const { TicketImg, Ticket, User, Order } = require(`./../database/database`);
const whatsappSend = require(`./helper/whatsapp-send`);
const {
  msgAfterPayment,
  msgTosellerAfterPayment,
  msgTosellerAfterApproval,
  msgTosellerAfterRejection,
  m3roofMsg,
} = require(`./helper/whatsappMassages`);

module.exports = {
  sendWhatsapp: async (req, res, next) => {
    const { msgBody, phoneNumber } = req.body;
    return await whatsappSend(phoneNumber, msgBody, req, res, () => {});
  },

  sendToSellerById: async (req, res, next) => {
    const userId = req.body.sellerId;
    const foundedUser = await User.findOne({ where: { id: userId } });
    if (foundedUser) {
      const phoneNumber = foundedUser.phoneNumber
        .toString()
        .replace(/[^\d]/g, "");
      const msgBody = `مرحبا بك يا صديقنا ${foundedUser.firstName}
      لقد تم إرسال طلبك للمراجعة من قبل فريق بومب تيكت وهي الان قيد الانتظار`;
      return whatsappSend(phoneNumber, msgBody, req, res);
    } else {
      return res.status(http_status_codes.StatusCodes.OK).json({
        user: `not found`,
      });
    }
  },

  sendAfterPayment: async (req, res, next) => {
    try {
      ////////////

      let { data } = req.body;

      const ticketsId = data.split(`/`)[0].split(`,`);
      const phoneNumber = data.split(`/`)[1].toString();
      const eventName = data.split(`/`)[2];

      const foundTickets = await TicketImg.findAll({
        where: { id: ticketsId },
      });
      //////////////////////////////////////////////////

      const sellTicket = await Ticket.findOne({
        where: { id: foundTickets[0].sellTicketId },
      });
      const buyer = await User.findOne({
        where: { phoneNumber: phoneNumber },
      });
      const seller = await User.findOne({
        where: { id: sellTicket.sellerId },
      });
      console.log(seller);

      const orderFounded = await Order.findOne({
        where: {
          sellerId: seller.id,
          userId: buyer.id,
        },
      });

      console.log(orderFounded);

      //////////////////////////////////////////////////
      if (foundTickets && orderFounded) {
        const numberOfTickets = foundTickets.length;
        const ticketsPDF = foundTickets.map((t) => t.image);

        msgBody = msgAfterPayment(eventName, numberOfTickets);
        return await whatsappSend(phoneNumber, msgBody, req, res, async () => {
          ticketsPDF.forEach(async (tPDF) => {
            await client.sendMessage(
              `${phoneNumber.replace(/[^\d]/g, "")}@c.us`,
              `https://bombticket.com:3000/${tPDF}`
            );
          });

          /////////  ~ Sending message to the buyer ~   //////////

          if (buyer) {
            const buyerFirstName = buyer.firstName;
            if (buyerFirstName) {
              const m3roofMsgToBuyer = m3roofMsg(buyerFirstName);
              await client.sendMessage(
                `${phoneNumber.replace(/[^\d]/g, "")}@c.us`,
                m3roofMsgToBuyer
              );
            } else {
              const m3roofMsgToBuyer = m3roofMsg(` `);
              await client.sendMessage(
                `${phoneNumber.replace(/[^\d]/g, "")}@c.us`,
                m3roofMsgToBuyer
              );
            }
          } else {
            const m3roofMsgToBuyer = m3roofMsg(` `);
            await client.sendMessage(
              `${phoneNumber.replace(/[^\d]/g, "")}@c.us`,
              m3roofMsgToBuyer
            );
          }

          // /////////  ~ Sending message to the seller ~   //////////

          const sellerPhoneNumber = seller.phoneNumber.toString();
          const sellerFirstName = seller.firstName.toString();

          if (sellerPhoneNumber.length > 10) {
            const msgToSellerBody = msgTosellerAfterPayment(
              sellerFirstName,
              eventName,
              numberOfTickets
            );

            await client.sendMessage(
              `${sellerPhoneNumber.replace(/[^\d]/g, "")}@c.us`,
              msgToSellerBody
            );
            const m3roofMsgToSeller = m3roofMsg(sellerFirstName);

            await client.sendMessage(
              `${sellerPhoneNumber.replace(/[^\d]/g, "")}@c.us`,
              m3roofMsgToSeller
            );
          }

          ///////////////
        });
      } else {
        return res.status(http_status_codes.StatusCodes.OK).json({
          order: `not found please try again later`,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(http_status_codes.StatusCodes.OK).json({
        user: `not found`,
      });
    }
  },

  ///////////////////////    function for  send to seller after approval
  sendToSellerAfterApproval: async (req, res, next) => {
    const { firstName = "First Name", phoneNumber = "Phone Number" } =
      req.body.sell_ticket?.seller || {};
    const title = req.body.sell_ticket?.event?.title || "event Title";
    const msgBody = msgTosellerAfterApproval(firstName, title);
    return await whatsappSend(phoneNumber, msgBody, req, res);
  },

  sendToSellerAfterRejection: async (req, res, next) => {
    const { firstName = "First Name", phoneNumber = "Phone Number" } =
      req.body.sell_ticket?.seller || {};
    const title = req.body.sell_ticket?.event?.title || "event Title";

    const msgBody = msgTosellerAfterRejection(firstName, title);
    return await whatsappSend(phoneNumber, msgBody, req, res);
  },
};
