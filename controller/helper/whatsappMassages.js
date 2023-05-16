module.exports = {
  msgToSellerFirst: () => {},
  msgAfterPayment: (eventName = ` `, numberOfTickets = ` `) => {
    return `        
    "لقد تم تأكيد عملية الشراء ويمكنك تحميل طلب الشراء عبر الرابط التالي🤩
        الحدث : ${eventName}
        العدد: ${numberOfTickets}
        `;
  },
  msgTosellerAfterPayment:(sellerName=` `,eventName = ` `, numberOfTickets = ` ` )=>{
    return `        
    "مرحبا يا صديقنا ${sellerName} 🤩
    لقد تم بيع طلبك المعروض بنجاح🤩

    الحدث : ${eventName}
    العدد: ${numberOfTickets}
    `
  },
  msgTosellerAfterApproval:(sellerName=` `,eventName = ` `, numberOfTickets = ` `)=>{


    return`مرحبا يا صديقنا ${sellerName} 🤩
    لقد تم اعتماد طلبك من قبل فريق بومب تيكت وهي الان موجودة في العرض
    الحدث : ${eventName}
    `
  },
  msgTosellerAfterRejection:(sellerName=` `,eventName = ` `, numberOfTickets = ` ` )=>{
    return ` مرحبا يا صديقنا ${sellerName}
    لقد تم رفض عرض الطلب الخاص بك لأسباب فنية من قبل فريق بومب تيكت وهي الان في خانه مرفوض في حال تود معرف أسباب الرفض تواصل معنا واتساب
    الحدث : ${eventName}   
    `
  },
  m3roofMsg:(sellerName=` `)=>{
    return `مرحبا يا صديقنا ${sellerName}
    كرماً منك نرجو منك تقييمنا ووضع تعليق في معروف لتحفزنا كلماتكم الإيجابية في بذل المزيد من أجل خدمتكم🌹
  
  رابط معروف : https://maroof.sa/businesses/details/253277
    `
  }

  

};
