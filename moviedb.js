/**
 * Created by ADDY on 02/12/16.
 */

var mysql = require('mysql');

var options = require('./config.js');

var connection = mysql.createConnection({
    host     : options.storageConfig.RDS_HOSTNAME,
    user     : options.storageConfig.RDS_USERNAME,
    password : options.storageConfig.RDS_PASSWORD,
    port     : options.storageConfig.RDS_PORT,
    database : "moviedb"
});

var now = new Date();
var stringDate = now.toDateString();
console.log(stringDate);

/*var post  = {userid: "addy1110", firstname: "Aditya", lastname: "Kaushal", email: "addy.1110@gmail.com", pass:"qwerty", dob: now, genre: "101111" };

connection.query('INSERT INTO messages VALUES ?', post, function(err, result) {
    console.log(result);
});*/

// Connection to the database
connection.connect(function(err){

// Case there is an error during the connection
    if(err){
        console.log("Connection problem : " + err);
    } else
        console.log("Connection ok");
});

console.log("hello");

/*connection.query('CREATE TABLE moviedb (userid varchar(20), firstname varchar(20), lastname varchar(20), email varchar(32), pass varchar(32), dob date , genre varchar(6))',

    function(err, result){

        // Case there is an error during the creation
        if(err) {
            console.log(err);
        }
        else{
            console.log("Table Created");
        }
    }
);*/

connection.query('SELECT * FROM moviedb',function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows[0]);
});

connection.end(function(err) {
    // The connection is terminated now
});
