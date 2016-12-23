/**
 * Created by ADDY on 19/11/16.
 */
module.exports = function(app){

    var elasticsearch = require('elasticsearch');
    var bodyParser    = require('body-parser');
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    var q = require("q");
    var request = require("request");
    var AWS = require('aws-sdk');

    AWS.config.update({region: 'us-east-1'});


    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    var client = new elasticsearch.Client({
        host: 'https://search-movies-5zcbuwmhuftqplir3dnm72jd4a.us-east-1.es.amazonaws.com/complete_movies'
    });



    /*function es(type) {


        var deferred = q.defer();
        console.log(type);


    }*/
    function getMovie(type){
        var deferred = q.defer();

        var queryType = type.split('|');
        var queryKeyword = null;
        var count = 0;
        if(queryType[0] == "search"){
            queryKeyword = queryType[1];
            count = 20;
        }
        else{
            queryKeyword = 'title:'+type;
            count = 1
        }

        console.log("querrying for this");
        console.log(queryKeyword);

        var index = [];
        var values = [];
        var uniqueResponse = [];

        client.search({
            size: count,
            q: queryKeyword

        }).then(function (body) {
            var hits = body.hits.hits;
            console.log("hits count : "+hits.length);
            deferred.resolve(hits);
        }, function (error) {
            console.trace(error.message);
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function checkValue(value){
        var result = true;
        for(var i=0; i<values.length; i++){
            if(value == values[i]){
                result =  false;
            }
        }
        return result;
    }

    function pushingToSQS(req, res){

        var usersign = req.body;
        console.log(usersign);

        var sendParams = {
            MessageBody: JSON.stringify(usersign),
            /* required */
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/829344914533/clickstreamdata', /* required */
            DelaySeconds: 0,
            MessageAttributes: {}
        };

        sqs.sendMessage(sendParams, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log("Pushed to SQS\n");

            }
        });

    }

    app.post  ('/api/sqs/usersign', pushingToSQS);

    app.get("/api/es/:type", getData);

    function getData(req, res){
        var type = req.params.type;
        console.log(type);
        getMovie(type)
            .then(function(result){
                console.log("count sent: "+result.length);
                res.json(result)});
    }
};