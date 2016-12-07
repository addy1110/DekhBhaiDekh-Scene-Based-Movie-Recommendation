/**
 * Created by ADDY on 04/11/16.
 */

var express = require('express');
var app = express();


app.use(express.static(__dirname + '/'));


require("./getData.js")(app);

var port = 8082;
var server = app.listen(port, function(){
    console.log("server running at localhost:"+port+"/");
});
