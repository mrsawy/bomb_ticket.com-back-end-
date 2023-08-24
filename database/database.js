var Sequelize = require("sequelize");
var userModal = require("../models/User.js");
var adminModal = require("../models/admin.js");
var withdrawModal = require("../models/withdraw.js");
var transactionModal = require("../models/transaction");
var paymentMethodModal = require("../models/payment_method.js");
var addressModal = require("../models/address");
var bankModal = require("../models/bank");
var couponModal = require("../models/coupon");
var eventModal = require("../models/event");
var orderModal = require("../models/order");
var sliderModal = require("../models/slider");
var ticketModal = require("../models/ticket");
var ticketImgModal = require("../models/ticket_img");
var ticketSectionModal = require("../models/ticket_section");
var orderTicketModal = require("../models/order_ticket");
const partnerShipModal = require("../models/partner_ship");
const complaintSuggestionModal = require("../models/complaint_&_suggestion");
const userCouponModal = require("../models/user_coupon");
const otpModal = require("../models/otp");
const userNameDetailModal = require("../models/UserNameDetail.js");


//  bomb_ticket_backup
//  Dfg456h7j8!
// const sequelize = new Sequelize("bomb_ticket", "root", "", {
//bombticket@phpmyadmin.nls
// const sequelize = new Sequelize("bomb_ticket", "root", "bombticket@phpmyadmin.nls", {

const sequelize = new Sequelize("bomb_ticket_backup", "root", "Dfg456h7j8!", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log,
});
const Admin = adminModal(sequelize, Sequelize);
const User = userModal(sequelize, Sequelize);
const PaymentMethod = paymentMethodModal(sequelize, Sequelize);
const Withdraw = withdrawModal(sequelize, Sequelize);
const Address = addressModal(sequelize, Sequelize);
const Bank = bankModal(sequelize, Sequelize);
const Coupon = couponModal(sequelize, Sequelize);
const Event = eventModal(sequelize, Sequelize);
const Order = orderModal(sequelize, Sequelize);
const Slider = sliderModal(sequelize, Sequelize);
const Ticket = ticketModal(sequelize, Sequelize);
const TicketImg = ticketImgModal(sequelize, Sequelize);
const TicketSection = ticketSectionModal(sequelize, Sequelize);
const Transaction = transactionModal(sequelize, Sequelize);
const OrderTicket = orderTicketModal(sequelize, Sequelize);
const PartnerShip = partnerShipModal(sequelize, Sequelize);
const ComplaintSuggestion = complaintSuggestionModal(sequelize, Sequelize);
const UserCoupon = userCouponModal(sequelize, Sequelize);
const Otp = otpModal(sequelize, Sequelize);
const UserNameDetail = userNameDetailModal(sequelize, Sequelize);


//otpModal relations

UserCoupon.belongsTo(User);
User.hasMany(UserCoupon);

UserCoupon.belongsTo(Coupon);
Coupon.hasMany(UserCoupon);

Order.belongsTo(UserCoupon);
UserCoupon.hasMany(Order);

Address.belongsTo(User);
User.hasMany(Address);

Bank.belongsTo(User);
User.hasMany(Bank);

// Order.belongsTo(Ticket);
// Ticket.hasMany(Order);

TicketImg.belongsTo(Ticket);
Ticket.hasMany(TicketImg);

Ticket.belongsTo(TicketSection);
TicketSection.hasMany(Ticket);

Ticket.belongsTo(Event);
Event.hasMany(Ticket);

TicketSection.belongsTo(Event);
Event.hasMany(TicketSection);

User.hasMany(Order);
Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Order.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

Ticket.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});
Withdraw.belongsTo(User);
User.hasMany(Withdraw);

Withdraw.belongsTo(Order);
Order.hasMany(Withdraw);

PaymentMethod.belongsTo(User);
User.hasMany(PaymentMethod);

OrderTicket.belongsTo(Order);
Order.hasMany(OrderTicket);

OrderTicket.belongsTo(TicketImg);
TicketImg.hasMany(OrderTicket);



UserNameDetail.belongsTo(Ticket);


UserNameDetail.belongsTo(Event);
Event.hasMany(UserNameDetail);


    // setTimeout(()=>{
    //   // console.log(`Database & tables createffffffffffd!!!!`);


    // },6000)

// sequelize
//   .sync({
//     alter: true,
//   })
//   .then(() => {
//     // console.log(`Database & tables created!!!!`);
//     // console.log(`UserNameDetail========>`,UserNameDetail)
//     console.log(`Database & tables created!`);

//   });

module.exports = {
  UserNameDetail,
  Admin,
  User,
  Transaction,
  PaymentMethod,
  Withdraw,
  Address,
  Bank,
  Coupon,
  Event,
  Order,
  Slider,
  Ticket,
  TicketImg,
  TicketSection,
  OrderTicket,
  PartnerShip,
  ComplaintSuggestion,
  UserCoupon,
  Otp

};
// console.log(Otp);
