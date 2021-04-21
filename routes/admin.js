var express = require('express');
var router = express.Router();
const fs = require("fs");

let htmlHead = 
    `<link href="/stylesheets/style.css" rel="stylesheet" type="text/css"> 
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">`;

/* GET users listing. */
router.get('/', function(req, res, next) {

    let printAdminLoginTemplate = htmlHead +
        `<title>Adminsida för Kundklubben</title> <h1>Adminsida för <span class="font-family-logo">Kundklubben</span></h1>
    <div>
        <h2>Adminlogin</h2>
        <form action="/admin" method="post">
            <div><input typ="text" id="adminUserName" name="adminUserName" placeholder="Skriv ditt användarnamn"></div> 
            <div><input typ="text" id="adminPassword" name="adminPassword" placeholder="Skriv ditt lösenord"></div>
            <div id="adminBtn"><button>Logga in</button></div> 
        </form>
    </div>`;
  res.send(printAdminLoginTemplate);

});

router.post('/', function(req, res) {

    let adminUser = req.body;
    let adminLoginMsg; 
    console.log(adminUser);

    fs.readFile("admins.json", function(err, data) {
        if(err) {
            console.log(err);
        }

        //hämta admins från admins.json
        let admins = JSON.parse(data);

        //se om adminUserName finns i admins
        const result = admins.find( ({ adminUserName }) => adminUserName === adminUser.adminUserName);
        console.log(result);

        if (result !== undefined) {
            console.log("admin exists");
            adminLoginMsg = "admin exists";
            if (adminUser.adminPassword === result.adminPassword) {
                console.log("login success");
                res.redirect('/admin/loggedin/' + result.id)
            } else {
                console.log("error, wrong password");
                adminLoginMsg = "error, wrong password";
                res.json(adminLoginMsg);
            }

        } else {
            adminLoginMsg = "error, users doesn't exist";
            res.json(adminLoginMsg);
        }
    });

});

router.get('/loggedin/:id', function(req, res) {
    let adminId = req.params.id;

    let printUsers = htmlHead + `<h3>Registrerade användare</h3>`;

    //Hämta alla users from MongoDB
    req.app.locals.db.collection("users").find().toArray()
    .then(results => {

        for (user in results) {
        
            let userTemplate = 
                `<article>
                    <ul>
                        <li>
                            <p>${results[user].userName}<p>
                        </li>
                    </ul>
                </article>`;
                console.log(printUsers);
            printUsers += userTemplate;

        };

        printUsers += 
        `<a href="/admin/loggedin/${adminId}/subscribe" class="btn-fill">Se prenumerant-lista</a>
        <a href="/admin">Logga ut</a>`;
        res.send(printUsers);

    });
    
}); 

router.get('/loggedin/:id/subscribe', function(req, res) {
    let adminId = req.params.id;

    let printSubscription = htmlHead + `<h4>Prenumeranter</h4>`;

    //Hämta alla subscribers from MongoDB
    req.app.locals.db.collection("users").find( {"subscription": true} ).toArray()
    .then(results => {

        if (results == "" ) {
            console.log("Vi har inga prenumeranter");
            res.json( {"code": "Vi har tyvärr inga prenumeranter!"} );

        } else {
            console.log("visa prenumeranter");

            for (subscriber in results) {
                console.log("results[subscriber]", results[subscriber]);

                
                let subscriptionTemplate = 
                    `<article>
                        <ul>
                            <li>
                                <p>${results[subscriber].userName}<p>
                            </li>
                        </ul>
                    </article>`;
                printSubscription += subscriptionTemplate;
                
            }; 
            printSubscription += `<a href="/admin/loggedin/${adminId}">Tillbaka</a><br>`;
            res.send(printSubscription);
        };

    });

});

module.exports = router;