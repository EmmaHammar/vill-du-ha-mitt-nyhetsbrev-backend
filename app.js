var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let adminRouter = require('./routes/admin');

var app = express();

const MongoClient = require("mongodb").MongoClient;

//mongodb -> ändra till atlassis(?)
// MongoClient.connect("mongodb://127.0.0.1:27017", {
MongoClient.connect("mongodb+srv://jagheteremma:jagheteremma@cluster0.ckgwo.mongodb.net/newsletter2?retryWrites=true&w=majority", { //vad skriva på myFirstDatabase? 
    useUnifiedTopology: true
})
.then(client => {
   console.log("Vi är uppkopplade mot databasen!"); 

   // ett projekt vi kallar för usersbook
   const db = client.db("usersbook");

   //vi sparar detta till app.locals
   app.locals.db = db;
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {index:false}));

app.use('/', adminRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

module.exports = app;
