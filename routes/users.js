var express = require('express');
var router = express.Router();
const cors = require("cors");
const fs = require("fs");
const rand = require("random-key");
const CryptoJS = require("crypto-js");

router.use(cors());

router.get('/', function(req, res, next) {

  res.send('users root');

});

router.post('/register', function(req, res) {
  //This router saves new users to MongoDB 

  //Hämta MongoDB
  req.app.locals.db.collection("users").find( {"userName":req.body.userName} ).toArray()
  .then(results => {

      if ( results == "") {

        let randomKey = rand.generate(8);
        let cryptoPass = CryptoJS.AES.encrypt(req.body.password, "o=B6LCgWNMXYDT(").toString();
        
        let newUser = 
          {
            id: randomKey,
            userName: req.body.userName,
            email: req.body.email,
            password: cryptoPass,
            subscription: false
          };
        
        req.app.locals.db.collection("users").insertOne(newUser)
          .then(result => { 
            res.json( {"code" : "newUser saved", "id" : newUser.id} );
          });

      } else {
        res.json( {"code" : "userName already exists"} );
      }
    
  });

});

router.post("/userpage", function(req,res) {
//This router makes login checks 

  let checkUser = req.body;

  req.app.locals.db.collection("users").find( {"userName":checkUser.userName}).toArray()
  .then(results => {

    //if kolla om det results är [] = ej hittat användare
    if (results == "") {
      res.json( {"code": "error"} )
  
    } else {
      let originalPass = CryptoJS.AES.decrypt(results[0].password, "o=B6LCgWNMXYDT(").toString(CryptoJS.enc.Utf8);

      if (originalPass === checkUser.password) {
        res.json( {"code": "ok", "userId": results[0].id} )
      } else {
        res.json( {"code": "error"} )
      }
    }   
  })

});

router.get('/userpage/:id', function(req, res, next) {

  let showUserId = req.params.id;

  //hämta users
  req.app.locals.db.collection("users").find( {"id": showUserId} ).toArray()
  .then(results => {

    if (results == "") {
      res.json( {"code": "error"} )

    } else {
        res.json( {"userName": results[0].userName, "subscription": results[0].subscription } )
    }

  });

}); 

router.post('/subscribe/:id', function(req, res) {
  let findUser = req.body;
  // get/find
  req.app.locals.db.collection("users").find( {"userName":findUser.userName} ).toArray()
  .then(result => {

        switch (result[0].subscription) {
          case true: 
            result[0].subscription = false;
            break;
          case false: 
            result[0].subscription = true;
            break;
        };

        //change/save
        req.app.locals.db.collection("users").updateOne( {"id" : result[0].id}, {$set: {"subscription": result[0].subscription} }  )
        .then(result => {
        });

        res.json( {"code": "Uppdaterat prenumerationsstatuset!", "subscription": result[0].subscription} ); 
  });
  
});

module.exports = router;