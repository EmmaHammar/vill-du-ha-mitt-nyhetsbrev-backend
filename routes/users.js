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

        let cryptoPass = CryptoJS.AES.encrypt(req.body.password, "Salt Nyckel").toString();
        
        let newUser = 
          {
            id: randomKey,
            userName: req.body.userName,
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
  
      let originalPass = CryptoJS.AES.decrypt(results[0].password, "Salt Nyckel").toString(CryptoJS.enc.Utf8);
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






//använda updateOne() för att uppdatera subscription status? Obs behöver radera databasen först så users id är unika.
//req.app.locals.db.collection("cars").updateOne( {"carVin" : xksdguerg8}, {$set: {"color": "Black"} }  )
//.then(results => {
//     console.log(results);
// });

//tar bort den första som matchar o utför operationen
//req.app.locals.db.collection("cars").deleteOne( {"carVin" : xksdguerg8} )
//.then(results => {
//     console.log(results);
// });

//ta bort alla GMC
//req.app.locals.db.collection("cars").deleteMany( {"carMake" : "GMC"} )
//.then(results => {
//     console.log(results);
// });

//kontrollera att allt är borta, får ett nummer i terminalen:
//ta bort alla GMC
//req.app.locals.db.collection("cars").countDocuments()
//.then(results => {
//     console.log(results);
// });

//POST
//insertOne(req.body)
//insertMany(req.body)

//===========================slask
// router.get('/userpage/:id', function(req, res, next) {

//   let showUserId = req.params.id;
//   console.log(showUserId);
// //   fs.readFile('users.json', function(err, data) {
// //     if (err) {
// //       console.log(err);
// //     }
// //     //hämta alla users i users.json
// //     const users = JSON.parse(data);
// //     console.log(users);

// //     let showUser = users.find( ({id}) => id === showUserId);
// //     // console.log(showUser);
    
// //     res.json(showUser.subscription);
// //   });

//   res.send("hej från userpage/:id");
// });



// router.post('/login', function(req, res) {

  //   // console.log(req.body);
    // let user = req.body;
    // console.log("user", user);
  
  //   fs.readFile("users.json", function(err, data) {
  //     if (err) {
  //       console.log(err);
  //     }
  
  //     //hämta users
  //     const users = JSON.parse(data);
  //     // console.log(users);
  
  //     //söka efter userName från webbläsaren i users
  //     const result = users.find( ({ userName }) => userName === user.userName);
  //     // console.log(result);
  //     // console.log(user);
  //     // console.log(userName); //FRÅGA VARFÖR FÅR JAG ERROR OM JAG KONSOLLLOGGAR DETTA? ÄR INTE USERNAME REFERERENS TILL USERNAME I JSONFILEN? ELLER VAD ÄR USERNAME?
  
  //     //om user finns i users
  //     if (result !== undefined) {
  //       answerLogin = {"result": "user finns"};
  
  //       //pass from json
  //       // console.log(result.password); 
  
  //       let originalPass = CryptoJS.AES.decrypt(result.password, "Salt Nyckel").toString(CryptoJS.enc.Utf8);
  //       // console.log(originalPass);
  
  //       //pass from webbläsaren
  //       // console.log(req.body.password);
  
  //       //kolla om password och användarnamn stämmer
  //       if (originalPass === req.body.password) {
  //       // answerLogin = {"subscription": result.subscription, "id": result.id};
  //       answerLogin = {"id": result.id};
  //       } else {
  //         answerLogin = {"result": "error fel lösenord"}
  //       }
  
  //     } else { //om user ej finns
  //       answerLogin = {"result": "error user finns ej"};
  //     };
  //     //skickar tillbaka resultatet till webbläsaren: 
  //     res.json(answerLogin);
  //   });
  
  //   res.send("hej från post login")
  // });

  

  // fs.readFile("users.json", function(err, data) {
  //   if (err) {
  //     console.log(err);
  //   }

  //   //hämta alla users
  //   const users = JSON.parse(data);
  //   // console.log(users);

  //   //kolla om användarnamnet redan finns bland users
  //   const result = users.find( ({ userName }) => userName === newUser.userName);
  //   // console.log(result);

  //   if (result !== undefined) {
  //     console.log("no registration, userName already exists");
  //     res.json("userName already exists")
  //   } else {
  //     console.log("ok to register");

  //     //generate random key: LÄGGA TILL FLER SIFFROR
  //     let key = rand.generateDigits(5);

  //     //FRÅGA BÖR ID KOMMA FÖRST I OBJEKTET, NU LÄGGS DET TILL SIST. ÄR DET OK ATT ANVÄNDA ASSIGN()?
  //     //HETTE TYP ASSIGN API PÅ CANIUSE o då verkade det ok men ÄR DET SAMMA SOM nedan ASSIGN()?
  //     //add random key to newUser:
  //     Object.assign(newUser, {id: key});
  //     // console.log(newUser);
  //     // console.log(users);

  //     //real password:
  //     console.log(newUser.password);
  //     //kryptera userPass och det är detta som ska sparas till backend
  //     let cryptoPass = CryptoJS.AES.encrypt(newUser.password, "Salt Nyckel").toString();
  //     // console.log(cryptoPass);
  //     newUser.password = cryptoPass;

  //     //FRÅGA: varför går ej detta? Då blir lösen inte krypterat, varför? 
  //     // let realPass = newUser.password;
  //     // console.log(realPass);
  //     // //kryptera userPass och det är detta som ska sparas till backend
  //     // let cryptoPass = CryptoJS.AES.encrypt(realPass, "Salt Nyckel").toString();
  //     // console.log(cryptoPass);
  //     // realPass = cryptoPass;
  //     // console.log(newUser);

  //     console.log(newUser);

  //     //lägg till newUser till users
  //     users.push(newUser);
  //     // console.log(users);

  //     //spara users till users.json
  //     fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {
  //       if (err) {
  //         console.log(err);
  //       };
  //     });
  //     res.json("newUser saved");
  //   };
  // });


// router.get('/subscribe/:id', function(req, res, next) {

//   let showUserId = req.params.id;
//   // console.log(showUserId);

//   fs.readFile("users.json", function(err, data) {
//     if (err) {
//       console.log(err);
//     }

//     //hämta alla users i users.json
//     const users = JSON.parse(data);

//     let showUser = users.find( ({id}) => id === showUserId);
//     // console.log(showUser);

//     switch (showUser.subscription) {
//       case true: 
//         console.log("ändra till false");
//         showUser.subscription = false;
//         break;
//       case false: 
//         console.log("ändra till true");
//         showUser.subscription = true;
//         break;
//     };
    
//     // users.push(showUser);
//     Object.assign(users, showUser);
//     // console.log(users);

//     fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {
//       if (err) {
//         console.log(err);
//       };
//     });
    
//     res.json(showUser.subscription);
//   });

// });


