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
var values = {
    userid: 'addy',
    firstname: 'Aditya',
    lastname: 'Kaushal',
    email: 'addy@example.com',
    pass: '1234598'

};
// var id = "addy2120";
// sql = 'INSERT INTO moviedb (userid) '+
//     'VALUES('+id+')';

// var query = "INSERT INTO `moviedb` (userid, firstname, lastname, email, pass) VALUES ('" + userid + "', '" + firstname + "', '" + lastname + "', '" + email + ''"+pass'");";
//
// connection.query(sql,
//     function (err) {
//         if(err) throw err;
//         else{
//             console.log('Data inserted:\n');
//         }
//
//     });


// var newuser = { userid: 'winnie', firstname: 'Winnie', lastname: 'Sharma', email: 'winnie@example.com', pass: 'ankit23'};
// connection.query('INSERT INTO moviedb SET ?', newuser, function(err,res){
//     if(err) throw err;
//
//     console.log('Last insert ID:', res.insertId);
// });

var dataobj = {userid: 'mishra',
    firstname: 'Lordho',
    lastname: 'Mishra',
    email: 'mishraChutiya@example.com',
    pass: '100802434'};

var newuser = "INSERT INTO `moviedb` (userid, firstname, lastname, email, pass) VALUES ('" + dataobj.userid + "', '" + dataobj.firstname + "', '" + dataobj.lastname + "', '" + dataobj.email + "', '" + dataobj.pass + "');";
//console.log(query);
connection.query(newuser, dataobj, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res, "Cast Member Added", 201);
        }
    });



connection.query('SELECT * FROM moviedb',function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
});



connection.end(function(err) {
    // The connection is terminated now
});
