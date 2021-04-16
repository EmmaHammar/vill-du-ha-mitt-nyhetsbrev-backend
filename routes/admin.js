var express = require('express');
var router = express.Router();
const fs = require("fs");


/* GET users listing. */
router.get('/', function(req, res, next) {

let printAdminLoginTemplate = `
    <title>Adminsida för Kundklubben</title> <h1>Adminsida för Kundklubben</h1>
    <div>
        <h2>Adminlogin</h2>
        <form action="/admin" method="post">
            <div><input typ="text" id="adminUserName" name="adminUserName">Admin-användarnamn</div> 
            <div><input typ="text" id="adminPassword" name="adminPassword">Admin-lösenord</div>
            <div id="adminBtn"><button>Admin-login</button></div> 
        </form>
    </div>
`;

  res.send(printAdminLoginTemplate);

});

router.post('/', function(req, res) {

    //adminUser = req.body , ex { adminUserName: 'eva', adminPassword: 'evaspass' }
    //fråga varför får jag [Object: null prototype] före ??? [Object: null prototype] { adminUserName: 'eva', adminPassword: 'kalle'}
    // console.log(req.body);
    // console.log(req.body.adminUserName);
    let adminUser = req.body;
    let adminLoginMsg; 
    console.log(adminUser);


    fs.readFile("admins.json", function(err, data) {
        if(err) {
            console.log(err);
        }

        //hämta admins från admins.json
        let admins = JSON.parse(data);
        // console.log(admins);
        // console.log(adminUser.adminUserName);

        //se om adminUserName finns i admins
        const result = admins.find( ({ adminUserName }) => adminUserName === adminUser.adminUserName);
        console.log(result);

        if (result !== undefined) {
            console.log("admin exists");
            adminLoginMsg = "admin exists";
            
            

            if (adminUser.adminPassword === result.adminPassword) {
                console.log("login success");
                res.redirect('/admin/loggedin')
                // printUsers();
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

router.get('/loggedin', function(req, res) {

    let printUsers = `<h3>Registrerade användare</h3>`;

    fs.readFile('users.json', function(err, data) {
        if (err) {
            console.log(err);
        }

        let users = JSON.parse(data);
        // console.log(users);

        for (user in users) {
            console.log(users[user].userName);
        
            let userTemplate = `
                <article>
                    <ul>
                        <li>
                            <p>${users[user].userName}<p>
                        </li>
                    </ul>
                </article>
            `;
            printUsers += userTemplate;
        };

        res.send(printUsers);

    });
    
    
}); 

module.exports = router;
