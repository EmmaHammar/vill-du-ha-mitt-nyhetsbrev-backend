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
    // console.log("results", results); 

      if ( results == "") {
        // console.log("newUser saved");
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

        console.log("newUser", newUser);
        
        req.app.locals.db.collection("users").insertOne(newUser)
          .then(result => { 
            res.json( {"code" : "newUser saved", "id" : newUser.id} );
          });

      } else {
        // console.log("userName already exists");
        res.json( {"code" : "userName already exists"} );
      }
    
  });

});

router.post("/userpage", function(req,res) {
//This router makes login checks 

  let checkUser = req.body;
  // console.log("checkUser", checkUser);

  req.app.locals.db.collection("users").find( {"userName":checkUser.userName}).toArray()
  .then(results => {

    //if kolla om det results är [] = ej hittat användare
    if (results == "") {
      // console.log("ingen user hittad");
      res.json( {"code": "error"} )
  
    } else {
      // console.log("pass in MongoDB is:", results[0].password);
  
      let originalPass = CryptoJS.AES.decrypt(results[0].password, "o=B6LCgWNMXYDT(").toString(CryptoJS.enc.Utf8);
      // console.log("originalPass", originalPass);
      // console.log("checkUsers pass:", checkUser.password);

      if (originalPass === checkUser.password) {
        // console.log("user och lösenord stämde");
        res.json( {"code": "ok", "userId": results[0].id} ) //skixkar tillb code + id
      } else {
        // console.log("fel lösenord");
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
    // console.log("om user finns i databasen visas hela användarens objekt, annars []", results);

    if (results == "") {
      // console.log("denna userpage finns ej");
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

    console.log("detta är findUser i databasen:", result);

        switch (result[0].subscription) {
          case true: 
            console.log("ändra till false");
            result[0].subscription = false;
            break;
          case false: 
            console.log("ändra till true");
            result[0].subscription = true;
            break;
        };

        // console.log("result[0].subscription after switch", result[0].subscription);
        //change/save
        req.app.locals.db.collection("users").updateOne( {"id" : result[0].id}, {$set: {"subscription": result[0].subscription} }  )
        .then(result => {
        });
        // console.log("result[0] after $set", result[0]);

        res.json( {"code": "Uppdaterat prenumerationsstatuset!", "subscription": result[0].subscription} ); 
  });
  
});

module.exports = router;