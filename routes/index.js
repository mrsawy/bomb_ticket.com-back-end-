var express = require("express");
var router = express.Router();
var request = require("request");
var { TicketImg } = require(`./../database/database`);
// Test Credentials
// var token = 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL';
// var baseURL = 'https://apitest.myfatoorah.com';

// Live Credentials
// cqxRRLtZ0bPiuTpcu-lkmG_sjQ6mvYOuhAK4uhXSQAL6C9hAtXmn0U02wLC1gbhnDMKfVprl2tocdt7Nswdj01_6QdVmhQmECbvlENMankoasbK5EkVgzO3Jz2zgNXH2dZ3nmkl3iIdiju-CIEd6OOTuYGs9nG_hOdM_GeIuotm4n7mWsCTlhI7IKecct7I5mAnSXwA3oXdYnKb0X1WmptgwrmwQM2CrBAMb7eTlvd_eH73fMzKfpwswu-cxsj4smRT_at1Xp8axdacvWB3kSCvZ9nbLnOSiBbVNAbfkzr3RqUuQDHqgnU770qxTQAXd4lTxdFz-LYoiws3PoStgKOT9SiAVh_tWG5PCq4mkPCWxbY1JXGzgQNaC_HGykyCS-eQfNUeBGgyV0a_hZiujZvoZl2XwTFc52Wt4tWWVGcwVs4YL8Kl5eShxAovG4Qj2WkmruOu5dLmDU5MgYaRnR02dLIoBGyNnmUUGXDcbGfBY9w-HrCkzCX09LeDaAEJNQNIIGX6lRbVjIgWjGH2NHS3BnHKujdcrDvCCpHDLbZh5H66fV5OoXF-U27ePTtMKKq2Hpr9uLcYpEwWhsqXH2Ioel7RRPV2b-_b9wqYq-k5LpxNzSgzQ8CaP_TIz51wyhONfonAOelRfpytBNr4CUGtsOpCFnteQQx5RPzaTScmmDQgS

// `cqxRRLtZ0bPiuTpcu-lkmG_sjQ6mvYOuhAK4uhXSQAL6C9hAtXmn0U02wLC1gbhnDMKfVprl2tocdt7Nswdj01_6QdVmhQmECbvlENMankoasbK5EkVgzO3Jz2zgNXH2dZ3nmkl3iIdiju-CIEd6OOTuYGs9nG_hOdM_GeIuotm4n7mWsCTlhI7IKecct7I5mAnSXwA3oXdYnKb0X1WmptgwrmwQM2CrBAMb7eTlvd_eH73fMzKfpwswu-cxsj4smRT_at1Xp8axdacvWB3kSCvZ9nbLnOSiBbVNAbfkzr3RqUuQDHqgnU770qxTQAXd4lTxdFz-LYoiws3PoStgKOT9SiAVh_tWG5PCq4mkPCWxbY1JXGzgQNaC_HGykyCS-eQfNUeBGgyV0a_hZiujZvoZl2XwTFc52Wt4tWWVGcwVs4YL8Kl5eShxAovG4Qj2WkmruOu5dLmDU5MgYaRnR02dLIoBGyNnmUUGXDcbGfBY9w-HrCkzCX09LeDaAEJNQNIIGX6lRbVjIgWjGH2NHS3BnHKujdcrDvCCpHDLbZh5H66fV5OoXF-U27ePTtMKKq2Hpr9uLcYpEwWhsqXH2Ioel7RRPV2b-_b9wqYq-k5LpxNzSgzQ8CaP_TIz51wyhONfonAOelRfpytBNr4CUGtsOpCFnteQQx5RPzaTScmmDQgS`
var token =
  "5o00lZv8Ljit3cNfKqCvR_Y7g1RFQpf3X0RTqS3sBS9JITwUhZ15-tNBjrif2pVVsT6rx1BERH5NfVC1ajcYjkc9u78668QNxvcjSr9i5F2avvRSQHYW-DWO04T-wuGDXzhpJF4EMYoXRT66mFmcsEeQYBhJAGceiesEN48D75bwzjHGvVYozZHsEO5kT20CFqEKt3t_HnExYb9etFCE9UMxdQoP3ZzOYDvdQaCfh6Jk-MFJzkuh2OST4jQoiJsSXJeuKOtpQIfjlqvy2QOeI4sW5ZVJihxInPiK8hISypJ3eAx2rtzcpPsvyCtKaOV7SJrv0-4z9da-gb9kyhLSECDU2v2c7bOfBOzS3b2o53pD8zoqHDQLCFYzhe0E2GwLsMvZ-2cwkEh739Y8hgW97l_fzCQ2DLI5hgv6L1s6_sL0TKx22ArPph5_tJm554z_DibkosAPaHiZFX2yc30RvItuQe6ko-f8EPBJHYa4Gx7PZl62R1EQOmrB2bElR-GJicnzFreSNL1kr4re0u9uPyD2SGOom4beTrmK1Q6d0hfgCXD6xkp0mLTfsSqfCmt_7hqTv7XGf7Ffx0sQjvjEOemSywAct5oZ20XkthuAuUtKrR-QSE3l-VWQY5NSiYWufQzujyZ9kB1oVF3FvSZU8M-oKhujEhlj33TJVfsB7eT6Yd8Q7o0NSgsGRoYIyXTqk-taJobE7gVnpoqnWNKN-XMSVendX34U45ue-_1xTCFg2eYR";
var baseURL = "https://api-sa.myfatoorah.com";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Bomb Ticket",
  });
});

router.post("/get-payment-options", function (req, res) {
  var options = {
    method: "POST",
    url: baseURL + "/v2/InitiatePayment",
    headers: {
      Accept: "application/json",
      Authorization: "bearer " + token,
      "Content-Type": "application/json",
    },
    body: {
      CurrencyIso: "SAR",
      InvoiceAmount: req.body.price,
    },
    json: true,
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
      res.json({
        error: error,
      });
    } else {
      console.log(response);
      console.log(`init payment body`, body);
      var bodyData = body["Data"];
      console.log(`============================`);
      console.log(bodyData);

      // console.log(response.body?response.body:`nobody in the response`);
      // console.log(response.body?response.body:`nobody in the response`);
      var bodyData = body["Data"];
      res.json({
        bodyData: bodyData,
      });
    }
  });
});

// /////////////////////////////////   function for validating the email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
// ///////////////////////  end of  function for validating the email

///////// the payment function////////////////////////
router.post("/pay", async function (req, res) {
  const singleTicketID = req.body.ticketsId[0];

  // console.log(singleTicketID);

  const foundedTicket = await TicketImg.findOne({
    where: { id: singleTicketID },
  });

  console.log(foundedTicket);

  if (
    !foundedTicket &&
    foundedTicket.price.toFixed(1) !== req.body.price.toFixed(1)
  ) {
    return res
      .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: "error in sending the otp",
        err: err,
        errorMassage: err.message,
      });
  } else {
    const my_InvoiceItems = [];
    for (let index = 0; index < req.body.Quantity; index++) {
      my_InvoiceItems.push({
        ItemName: req.body.eventName,
        Quantity: 1,
        UnitPrice: req.body.price.toFixed(1) / req.body.Quantity,
      });
    }
    var options = {
      method: "POST",
      url: baseURL + "/v2/SendPayment",
      headers: {
        Accept: "application/json",
        Authorization: "bearer " + token,
        "Content-Type": "application/json",
      },
      body: {
        // PaymentMethodId: req.body.PaymentMethodId,
        NotificationOption: "LNK",
        // SessionId: req.body.SessionId,
        CustomerName: req.body.CustomerName,
        DisplayCurrencyIso: "SAR",

        MobileCountryCode: req.body.MobileCountryCode,
        CustomerMobile: req.body.CustomerMobile,
        CustomerEmail: isValidEmail(req.body.CustomerEmail)
          ? req.body.CustomerEmail
          : `undefined@undefined.undefined`,
        InvoiceValue: req.body.price.toFixed(1),

        CallBackUrl: "https://bombticket.com/payment-response",
        ErrorUrl: "https://bombticket.com/payment-response",
        Language: "ar",
        CustomerReference: "ref 1",
        CustomerCivilId: 12345678,
        UserDefinedField: `${req.body.ticketsId}/${req.body.phoneNumber}/${req.body.eventName}`,
        ExpireDate: "",
        CustomerAddress: {
          Block: "",
          Street: "",
          HouseBuildingNo: "",
          Address: req.body.address,
          AddressInstructions: "",
        },
        InvoiceItems: my_InvoiceItems,
      },
      json: true,
    };

    // console.log(options.body)
    request(options, function (error, response, body) {
      // console.log(body)
      if (error) {
        return res.json({
          error: error,
        });
      } else if (!body.IsSuccess) {
        console.log(body);

        return res.json({
          error: `Error happened , please enter you data correctly and try again`,
        });
      } else {
        console.log(body);
        // var paymentURL = body['Data']['PaymentURL'];
        return res.json(body);
      }
    });
  }
});

//////////////////////// execute payment function  //////////////////////

router.post(
  `/executePayment`,
  async (req, res) => {
    const singleTicketID = req.body.ticketsId[0];

    const foundedTicket = await TicketImg.findOne({
      where: { id: singleTicketID },
    });

    if (
      !foundedTicket &&
      foundedTicket.price.toFixed(1) !== req.body.price.toFixed(1)
    ) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error in sending the otp",
          err: err,
          errorMassage: err.message,
        });
    }

    const my_InvoiceItems = [];
    for (let index = 0; index < req.body.Quantity; index++) {
      my_InvoiceItems.push({
        ItemName: req.body.eventName,
        Quantity: 1,
        UnitPrice: req.body.price.toFixed(1) / req.body.Quantity,
      });
    }

    var options = {
      method: "POST",
      url: baseURL + "/v2/SendPayment",
      headers: {
        Accept: "application/json",
        Authorization: "bearer " + token,
        "Content-Type": "application/json",
      },
      body: {
        // PaymentMethodId: req.body.PaymentMethodId,
        NotificationOption: "LNK",
        SessionId: req.body.SessionId,
        CustomerName: req.body.CustomerName,
        DisplayCurrencyIso: "SAR",

        MobileCountryCode: req.body.MobileCountryCode,
        CustomerMobile: req.body.CustomerMobile,
        CustomerEmail: isValidEmail(req.body.CustomerEmail)
          ? req.body.CustomerEmail
          : `undefined@undefined.undefined`,
        InvoiceValue: req.body.price.toFixed(1),

        CallBackUrl: "https://bombticket.com/payment-response",
        ErrorUrl: "https://bombticket.com/payment-response",
        Language: "ar",
        CustomerReference: "ref 1",
        CustomerCivilId: 12345678,
        UserDefinedField: `${req.body.ticketsId}/${req.body.phoneNumber}/${req.body.eventName}`,
        ExpireDate: "",
        CustomerAddress: {
          Block: "",
          Street: "",
          HouseBuildingNo: "",
          Address: req.body.address,
          AddressInstructions: "",
        },
        InvoiceItems: my_InvoiceItems,
      },
      json: true,
    };

    // var options = {
    //   method: "POST",
    //   url: baseURL + "/v2/ExecutePayment",
    //   headers: {
    //     Accept: "application/json",
    //     Authorization: "Bearer " + token,
    //     "Content-Type": "application/json",
    //   },
    //   body: {
    //     // PaymentMethodId: "2",
    //     CustomerName: "Ahmed",
    //     DisplayCurrencyIso: "KWD",
    //     MobileCountryCode: "+965",
    //     CustomerMobile: "12345678",
    //     CustomerEmail: "xx@yy.com",
    //     InvoiceValue: 100,
    //     CallBackUrl: "https://google.com",
    //     ErrorUrl: "https://google.com",
    //     Language: "en",
    //     CustomerReference: "ref 1",
    //     CustomerCivilId: 12345678,
    //     UserDefinedField: "Custom field",
    //     ExpireDate: "",
    //     CustomerAddress: {
    //       Block: "",
    //       Street: "",
    //       HouseBuildingNo: "",
    //       Address: "",
    //       AddressInstructions: "",
    //     },
    //     InvoiceItems: [{ ItemName: "Product 01", Quantity: 1, UnitPrice: 100 }],
    //   },
    //   json: true,
    // };
    ////////

    request(options, function (error, response, body) {
      if (error) {
        return res.json({
          error: error,
        });
      } else if (!body.IsSuccess) {
        console.log(body);

        return res.json({
          response,
          error: `Error happened , please enter you data correctly and try again`,
        });
      } else {  
        console.log(body);
        // var paymentURL = body['Data']['PaymentURL'];
        return res.json(body);
      }
    });
  }

  ////////
);

//////////////// end of payment function //////////////////////

router.post("/checkPaymentStatus", function (req, res) {
  var options = {
    method: "POST",
    url: baseURL + "/v2/getPaymentStatus",
    headers: {
      Accept: "application/json",
      Authorization: "bearer " + token,
      "Content-Type": "application/json",
    },
    body: {
      Key: req.body.Key,
      KeyType: req.body.KeyType,
    },
    json: true,
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.json({
      paymentResponse: body,
    });
  });
});

router.get("/initiate-session", function (req, res) {
  var options = {
    method: "POST",
    url: baseURL + "/v2/InitiateSession",
    headers: {
      Accept: "application/json",
      Authorization: "bearer " + token,
      "Content-Type": "application/json",
    },
    json: true,
  };

  request(options, function (error, response, body) {
    if (error) {
      res.json({
        error: error,
      });
    } else {
      res.json({
        body: body,
      });
    }
  });
});

module.exports = router;

// paymentId=07071608448123492072&Id=07071608448123492072
// https://demo.MyFatoorah.com/En/KWT/PayInvoice/Checkout?invoiceKey=01072160844841&paymentGatewayId=22
