var express = require('express');
var router = express.Router();
const cors = require("cors");
const fs = require("fs");
const rand = require("random-key");


router.use(cors());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users root');
});

//varför behövs denna get? Här post ska skrivas ut?
router.get('/login', function(req, res, next) {
  res.send("hej från get login-routern");
});

//skicka ny användare till servern. Spara i users.json
router.post('/login', function(req, res) {

  // console.log(req.body);
  let newUser = req.body;
  // console.log(newUser);

  fs.readFile("users.json", function(err, data) {
    if (err) {
      console.log(err);
    }

    //hämta alla users
    const users = JSON.parse(data);
    // console.log(users);

    //kolla om användarnamnet redan finns bland users
    const result = users.find( ({ userName }) => userName === newUser.userName);
    // console.log(result);

    //FRÅGA: kolla så lösen inte är tomt - kollla i frontend för ska inte gå att skicka

    if (result !== undefined) {
      console.log("no registration, userName already exists");
      res.json("error")
    } else {
      console.log("ok to register");

      //FRÅGA ÄR DETTA RANDOM KEYS?
      //generate random key:
      let key = rand.generateDigits(5);
      // console.log(key);

      //FRÅGA BÖR ID KOMMA FÖRST I OBJEKTET, NU LÄGGS DET TILL SIST. ÄR DET OK ATT ANVÄNDA ASSIGN()? HETTE TYP ASSIGN API PÅ CANIUSE o då verkade det ok men ÄR DET SAMMA SOM nedan ASSIGN()?
      //add random key to newUser:
      Object.assign(newUser, {id: key});
      // console.log(newUser);
      // console.log(users);

      //lägg till newUser till users
      users.push(newUser);
      // console.log(users);

      //spara users till users.json
      fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {
          
        if (err) {
          console.log(err);
        };

      });

      res.json("newUser saved");

    };
  
  });

});

module.exports = router;
