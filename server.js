/**
 * Created by ADDY on 04/11/16.
 */

var express = require('express');
var app = express();

var bodyParser    = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var passport      = require('passport');




app.use(session({
    secret: "key",
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


require("./server/app.js")(app);
app.use(express.static(__dirname + '/'));


require("./getData.js")(app);

var port = 8082;
var server = app.listen(port, function(){
    console.log("server running at localhost:"+port+"/");
});


