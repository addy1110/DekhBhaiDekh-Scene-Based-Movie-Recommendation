module.exports = function(app,connection) {
    console.log("In mySQL app.js")

var mysql = require('mysql');


 var connection = mysql.createConnection({
 host     : "movie-rec.cbpb1pakub7i.us-east-1.rds.amazonaws.com",
 user     : "aa4960",
 password : "qwerty16",
 port     : 3306,
 database : "moviedb"
 });

// Connection to the database
    connection.connect(function(err){

// Case there is an error during the connection
        if(err){
            console.log("Connection problem : " + err);
        } else
            console.log("Connection ok");
    });


    var modeluser = require("./models/user.model.js")(connection);
    require("./services/user.service.server.js")(app, modeluser);

};






