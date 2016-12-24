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

    var index = [];
    var values = [];
    var uniqueResponse = [];


    var client = new elasticsearch.Client({
        host: 'https://search-movies-5zcbuwmhuftqplir3dnm72jd4a.us-east-1.es.amazonaws.com/complete_movies'
    });


    app.get("/api/es/:type", getData);

    function getData(req, res){
        var type = req.params.type;
        console.log(type);
        getMovie(type)
            .then(function(result){
                console.log("count sent: "+result.length);
                res.json(result)});
    }


    function getMovie(type){
        var deferred = q.defer();

        client.search({
            size: 1,
            q: 'key:'+type

        }).then(function (body) {

            var hits = body.hits.hits;
            console.log("hits length : " + hits.length);
            deferred.resolve(hits);
        }, function (error) {
            console.trace(error.message);
            deferred.reject(error);
        });

        return deferred.promise;

    }

};