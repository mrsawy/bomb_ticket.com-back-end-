var express = require('express');
var router = express.Router();
var request = require("request");

// Test Credentials
// var token = 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL';
// var baseURL = 'https://apitest.myfatoorah.com';

// Live Credentials
var token = '5o00lZv8Ljit3cNfKqCvR_Y7g1RFQpf3X0RTqS3sBS9JITwUhZ15-tNBjrif2pVVsT6rx1BERH5NfVC1ajcYjkc9u78668QNxvcjSr9i5F2avvRSQHYW-DWO04T-wuGDXzhpJF4EMYoXRT66mFmcsEeQYBhJAGceiesEN48D75bwzjHGvVYozZHsEO5kT20CFqEKt3t_HnExYb9etFCE9UMxdQoP3ZzOYDvdQaCfh6Jk-MFJzkuh2OST4jQoiJsSXJeuKOtpQIfjlqvy2QOeI4sW5ZVJihxInPiK8hISypJ3eAx2rtzcpPsvyCtKaOV7SJrv0-4z9da-gb9kyhLSECDU2v2c7bOfBOzS3b2o53pD8zoqHDQLCFYzhe0E2GwLsMvZ-2cwkEh739Y8hgW97l_fzCQ2DLI5hgv6L1s6_sL0TKx22ArPph5_tJm554z_DibkosAPaHiZFX2yc30RvItuQe6ko-f8EPBJHYa4Gx7PZl62R1EQOmrB2bElR-GJicnzFreSNL1kr4re0u9uPyD2SGOom4beTrmK1Q6d0hfgCXD6xkp0mLTfsSqfCmt_7hqTv7XGf7Ffx0sQjvjEOemSywAct5oZ20XkthuAuUtKrR-QSE3l-VWQY5NSiYWufQzujyZ9kB1oVF3FvSZU8M-oKhujEhlj33TJVfsB7eT6Yd8Q7o0NSgsGRoYIyXTqk-taJobE7gVnpoqnWNKN-XMSVendX34U45ue-_1xTCFg2eYR';
var baseURL = 'https://api-sa.myfatoorah.com';


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Bomb Ticket'
  });
});

router.post('/get-payment-options', function (req, res) {

  var options = {
    method: 'POST',
    url: baseURL + '/v2/InitiatePayment',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: {
      CurrencyIso: 'SAR',
      InvoiceAmount: req.body.price,
    },
    json: true
  };

  request(options, function (error, response, body) {
    // console.log(body)
    if (error) {
      res.json({
        error: error
      })
    } else {
      var bodyData = body['Data'];
      res.json({
        bodyData: bodyData
      })
    }
  });

});

router.post('/pay', function (req, res) {
  // console.log('--------------');
  // console.log(req.body);
  // console.log('-----------------');
  const my_InvoiceItems = []
  for (let index = 0; index < req.body.Quantity; index++) {
    my_InvoiceItems.push({
      ItemName: req.body.eventName,
      Quantity: 1,
      UnitPrice: req.body.price / req.body.Quantity
    });
  }
  var options = {
    method: 'POST',
    url: baseURL + '/v2/ExecutePayment',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: {
      PaymentMethodId: req.body.PaymentMethodId,
      SessionId: req.body.SessionId,
      CustomerName: req.body.CustomerName,
      DisplayCurrencyIso: 'SAR',
      MobileCountryCode: req.body.MobileCountryCode,
      CustomerMobile: req.body.CustomerMobile,
      CustomerEmail: req.body.CustomerEmail,
      InvoiceValue: req.body.price,
      CallBackUrl: 'https://bombticket.com/payment-response',
      ErrorUrl: 'https://bombticket.com/payment-response',
      Language: 'en',
      CustomerReference: 'ref 1',
      CustomerCivilId: 12345678,
      UserDefinedField: req.body.UserDefinedField,
      ExpireDate: '',
      CustomerAddress: {
        Block: '',
        Street: '',
        HouseBuildingNo: '',
        Address: req.body.address,
        AddressInstructions: ''
      },
      InvoiceItems: my_InvoiceItems
    },
    json: true
  };

  // console.log(options.body)
  request(options, function (error, response, body) {
    // console.log(body)
    if (error) {
      res.json({
        error: error
      })
    } else {
      // var paymentURL = body['Data']['PaymentURL'];
      res.json(body);
    }
  });

});

router.post('/checkPaymentStatus', function (req, res) {
  var options = {
    method: 'POST',
    url: baseURL + '/v2/getPaymentStatus',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: {
      Key: req.body.Key,
      KeyType: req.body.KeyType
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.json({
      paymentResponse: body
    })
  });
});

router.get('/initiate-session', function (req, res) {
  var options = {
    method: 'POST',
    url: baseURL + '/v2/InitiateSession',
    headers: {
      Accept: 'application/json',
      Authorization: 'bearer ' + token,
      'Content-Type': 'application/json'
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      res.json({
        error: error
      })
    } else {
      res.json({
        body: body
      })
    }
  });

});

module.exports = router;

// paymentId=07071608448123492072&Id=07071608448123492072
// https://demo.MyFatoorah.com/En/KWT/PayInvoice/Checkout?invoiceKey=01072160844841&paymentGatewayId=22