var express = require('express');
var router = express.Router();
const cors = require("cors");
const fs = require("fs");
const rand = require("random-key");
const CryptoJS = require("crypto-js");

router.use(cors());

//Denna router vanligtvis printar ut alla
router.get('/', function(req, res, next) {

  res.send('users root');

});

router.post('/register', function(req, res) {
  //Denna router sparar nya användare till databasen
  
  let newUser = req.body;

  //Hämta MongoDB
  req.app.locals.db.collection("users").find( {"userName":newUser.userName} ).toArray()
  .then(results => {
    // console.log("results", results); 

      if ( results == "") {
        // console.log("newUser saved");
        let randomKey = rand.generate(8);
        Object.assign(newUser, {id: randomKey});
        
        req.app.locals.db.collection("users").insertOne(newUser)
          .then(result => { 
            // console.log("saved to mongoDB", result);
            // console.log(" newUser.id",  newUser.id);
            res.json( {"code" : "newUser saved", "id" : newUser.id} );
          });

      } else {
        // console.log("userName already exists");
        res.json( {"code" : "userName already exists"} );
      }
    
  });

});

//Check if password and username is ok at login
router.post("/userpage", function(req,res) {

  let checkUser = req.body;
  console.log(checkUser);

  req.app.locals.db.collection("users").find( {"userName":checkUser.userName}).toArray()
  .then(results => {

    //if kolla om det results är [] = ej hittat användare
    if (results == "") {
      console.log("ingen user hittad");
      res.json( {"code": "error"} )
  
    } else {
      // console.log("results", results);
      if (results[0].password === checkUser.password) {
        console.log("user och lösenord stämde");
        res.json( {"code": "ok", "userId": results[0].id} ) //skicka tillbaka ett objekt: ett ok-code och id-et för användaren
      } else {
        console.log("fel lösenord");
        res.json( {"code": "error"} )
      }
    }   
  })

});

router.get('/userpage/:id', function(req, res, next) {

  let showUserId = req.params.id;
  console.log("showUserId", showUserId);

  //hämta users
  req.app.locals.db.collection("users").find( {"id": showUserId} ).toArray()
  .then(results => {
    console.log("om user finns i databasen visas hela användarens objekt, annars []", results);

    if (results == "") {
      console.log("denna userpage finns ej");
      res.json( {"code": "error"} )

    } else {
        res.json( {"userName": results[0].userName, "subscription": results[0].subscription } )

    }

  });

}); 


router.post('/subscribe/:id', function(req, res) {
  let getUser = req.body;
  // console.log("getUser", getUser);

  //HÄMTA
  // req.app.locals.db.collection("users").find( {"userName":getUser.userName} ).toArray()
  req.app.locals.db.collection("users").find().toArray()
  .then(result => {

    let allUsers = result; //array
    
    //HITTA 
    for (user in allUsers) {
      if (result[user].userName === getUser.userName) {
        let findUser = result[user];
        console.log("findUser-subscription före assign", findUser.subscription);

        switch (findUser.subscription) {
          case true: 
            console.log("ändra till false");
            findUser.subscription = false;
            break;
          case false: 
            console.log("ändra till true");
            findUser.subscription = true;
            break;
        };

        //ÄNDRA
        // allUsers.push(findUser);
        Object.assign(findUser, {subscription: findUser.subscription});
        console.log("findUser-subscription after assign", findUser.subscription);
        
        // SPARA 
        // req.app.locals.db.collection("users").insertOne(findUser)
        // .then(result => { 
        //   console.log("result", result);
        //   res.json( {"code": "Uppdaterat prenumerationsstatuset!", "subscription": findUser.subscription} );
        // });

        //The index is not present in your collection, in which you are trying insert.??
        //(node:15012) UnhandledPromiseRejectionWarning: MongoError: E11000 duplicate key error collection: usersbook.users index: _id_ dup key: { _id: ObjectId('607ebc1e5c85b91dd98d6025') }
        res.json( {"code": "Uppdaterat prenumerationsstatuset!", "subscription": findUser.subscription} ); //ta bort denna rad sen när jag lyckats SPARA

      }

    }
    
  });
  
});

module.exports = router;









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


