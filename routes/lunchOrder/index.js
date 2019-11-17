var express = require('express');
var router = express.Router();
var LunchOrder = require('../../models/lunchOrder');
var LunchMenu = require('../../models/lunchMenu');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var moment = require('moment');
var mail = require('../../nodeMailerWithTemp');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);


router.post('/addLunchOrder', (req, res) => {
	
    // create the new LunchMenu
    var newData = req.body
	var newMenu 	= new LunchOrder(newData);
	newMenu.save().then(() => res.json(newMenu));

});

router.get('/getlunchorder', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID
    var matchquery = {}
    matchquery.catererID = new ObjectId(userID);
    
    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'ddd, DD MMM YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'ddd, DD MMM YYYY').add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}
    }

    if (typeof req.query.date !== 'undefined') {
        var gteDate = moment(req.query.date, 'ddd, DD MMM YYYY').toDate()
		var lteDate = moment(req.query.date, 'ddd, DD MMM YYYY').add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}
    }

    if (typeof req.query.paymentStatus !== 'undefined') {
        matchquery.paymentStatus = req.query.paymentStatus;
    }

    /*LunchOrder.find(matchquery).sort({createdAt: -1}).exec((err,doc) => {
        if (err) return res.status(500).send({ error: err });
        return res.status(200).json(doc);
    });*/

	LunchOrder.aggregate([ 
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        {$lookup: {
            from: "company", 
            localField: "customerCompanyID", 
            foreignField: "_id", 
            as: "customerCompanyDetails" }
        },
        { $sort : { createdAt : -1 } }
      ], (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            console.log(doc)
            return res.status(200).json(doc);
        }
      });
});

router.get('/getlunchorder_customer', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { user } = req;
    var userID = user.catererID
    var matchquery = {}
	matchquery.catererID = new ObjectId(userID);

    if (typeof req.query.lteDate !== 'undefined' && typeof req.query.gteDate !== 'undefined') {
		var gteDate = moment(req.query.gteDate, 'ddd, DD MMM YYYY').toDate()
		var lteDate = moment(req.query.lteDate, 'ddd, DD MMM YYYY').add(1, 'days').toDate()
        matchquery.createdAt = {$gte: new Date(gteDate.toISOString()),$lte: new Date(lteDate.toISOString())}
    }

    LunchOrder.aggregate([
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        {$group: {
            _id: '$customerID',
            orderID : { $last: '$_id' },
            orderNumber : { $last: '$orderNumber' },
            orderItem : { $last: '$orderItem' },
            catererID : { $last: '$catererID' },
            totalOrderPrice : { $last: '$totalOrderPrice' },
            customerType : { $last: '$customerType' },
            orderStatus : { $last: '$orderStatus' },
            paymentType : { $last: '$paymentType' },
            customerDetails : { $last: '$customerDetails' },
            createdAt : { $last: '$createdAt' },
            updatedAt : { $last: '$updatedAt' },
            count: { $sum: 1 }
        }},
        { $sort : { createdAt : -1 } },
    ], (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            console.log(doc)
            return res.status(200).json(doc);
        }
     });
      
});

router.put('/acceptlunchorder', passport.authenticate('jwt', {session: false}), (req, res) => {

    var matchquery = {};
    var arrayOfLunchOrderIDString = JSON.parse(req.body.arrayOfLunchOrderID)

    var arrayOfLunchOrderID = []
    for(var i = 0; i < arrayOfLunchOrderIDString.length; i++){
        arrayOfLunchOrderID.push(new ObjectId(arrayOfLunchOrderIDString[i]))
    }

    matchquery._id = { $in: arrayOfLunchOrderID }

    LunchOrder.aggregate([
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        {$lookup: {
            from: "caterer", 
            localField: "catererID", 
            foreignField: "_id", 
            as: "catererDetails" }
        },
        {$lookup: {
            from: "company", 
            localField: "customerCompanyID", 
            foreignField: "_id", 
            as: "customerCompanyDetails" }
        }
    ], (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            if (doc.length > 0) {
                let promiseArr = [];
                for(var i = 0; i < doc.length; i++){
                    console.log(doc[i])
                    var lunchorderdoc = doc[i]
                    var paymentIntentID = doc[i].paymentIntentID
                    var lunchOrderID = doc[i]._id
                    var lunchOrderItemID = doc[i].orderItemID
                    var catererDetails = doc[i].catererDetails[0]
                    var customerEmail = doc[i].customerDetails[0].customerEmail
                    var orderStatus = "accepted"
                    mail.sendCustomerLunchOrderEmail('/templates/customer_lunchorder/email.html', lunchorderdoc, catererDetails, customerEmail, orderStatus);

                    promiseArr.push(acceptAction(lunchorderdoc, paymentIntentID, lunchOrderID, lunchOrderItemID ))

                }

                Promise.all(promiseArr)
                .then((result) => {
                    console.log('result = ', result)
                    return res.status(201).json("updated");
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(500).send({ error: err });
                })
            }
            else {
                return res.status(500).send({ error: "doc not found" }); 
            }
        }
     });
});

function acceptAction(lunchorderdoc, paymentIntentID, lunchOrderID, lunchOrderItemID) {
    return new Promise((resolve, reject) => {
      //you update code here
      var updateData = {}
      stripe.paymentIntents.confirm(paymentIntentID, function(stripe_err, intent) {
        if (stripe_err) {
            updateData = {
                orderStatus: "accepted",
                paymentStatus: "incomplete"
            }
        }
        else {
            updateData = {
                orderStatus: "accepted",
                paymentStatus: "succeeded"
            }
        }
        LunchOrder.findOneAndUpdate({_id: lunchOrderID}, {$set: updateData}, {returnOriginal: false, runValidators: true}, (updated_err, updateddoc) => {
            if (updated_err) {
                reject(updated_err)
            }
            else {
                LunchMenu.findOneAndUpdate({_id: lunchOrderItemID}, {$inc: {soldamount:1}}, (menu_updated_err, menu_updateddoc) => {
                    resolve(lunchorderdoc)
                })
            }
        })   
      })
 
   });
 }

 router.put('/rejectlunchorder', passport.authenticate('jwt', {session: false}), (req, res) => {

    var matchquery = {}

    var arrayOfLunchOrderIDString = JSON.parse(req.body.arrayOfLunchOrderID)

    var arrayOfLunchOrderID = []
    for(var i = 0; i < arrayOfLunchOrderIDString.length; i++){
        arrayOfLunchOrderID.push(new ObjectId(arrayOfLunchOrderIDString[i]))
    }

    matchquery._id = { $in: arrayOfLunchOrderID }

    LunchOrder.aggregate([
        {$match: matchquery},
        {$lookup: {
            from: "customer", 
            localField: "customerID", 
            foreignField: "_id", 
            as: "customerDetails" }
        },
        {$lookup: {
            from: "caterer", 
            localField: "catererID", 
            foreignField: "_id", 
            as: "catererDetails" }
        },
        {$lookup: {
            from: "company", 
            localField: "customerCompanyID", 
            foreignField: "_id", 
            as: "customerCompanyDetails" }
        }
    ], (err,doc) => {
        if (err) {
            return res.status(500).send({ error: err });
        }
        else {
            if (doc.length > 0) {
                let promiseArr = [];
                for(var i = 0; i < doc.length; i++){
                    var lunchorderdoc = doc[i]
                    var lunchOrderID = doc[i]._id
                    var catererName = doc[i].catererDetails[0].catererName
                    var customerEmail = doc[i].customerDetails[0].customerEmail
                    var orderStatus = "rejected"
                    mail.sendCustomerLunchOrderEmail('/templates/customer_lunchorder/email.html', lunchorderdoc, catererName, customerEmail, orderStatus);
                    promiseArr.push(updateRejectAction(lunchOrderID ))
                }
                Promise.all(promiseArr)
                .then((result) => {
                    return res.status(201).json("updated");
                })
                .catch((err) => {
                    return res.status(500).send({ error: err });
                })
            }
            else {
                return res.status(500).send({ error: "doc not found" }); 
            }
        }
    });

})

function updateRejectAction(lunchOrderID) {
    return new Promise((resolve, reject) => {

        var updateData = {}
        updateData = {orderStatus: "rejected"}
      
        LunchOrder.findOneAndUpdate({_id: lunchOrderID}, {$set: updateData}, {returnOriginal: false, runValidators: true}, (updated_err, updateddoc) => {
            if (updated_err) {
                reject(updated_err)
            }
            else {
                resolve(updateddoc)
            }
        })   
      
    });
 }

module.exports = router;
