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


        var queryKeyword=type;
        var count = 0;

        console.log("querrying for this");
        console.log(queryKeyword);

        client.search({
            size: count,
            q: queryKeyword

        }).then(function (body) {

            var hits = body.hits.hits;
            console.log("hits length : " + hits.length);
            index = [];
            values = [];
            uniqueResponse = [];
            for(var i=0;i<hits.length;i++){
                if(hits[i]._source.rating == 'N/A'){
                    hits[i]._source.rating = '0';
                }
                if(checkValue(hits[i]._source.key) ) {
                    values.push(hits[i]._source.key);
                    index.push(i);
                }
            }
            for(i=0;i<index.length;i++){
                uniqueResponse.push(hits[index[i]]);
            }

            uniqueResponse.sort(function (a,b) {
                return parseFloat(b._source.rating) - parseFloat(a._source.rating)
            });

            for(i=0;i<uniqueResponse.length;i++){
                console.log(uniqueResponse[i]._source.key);
            }
            console.log(values.length);
            console.log(index.length);
            console.log(uniqueResponse.length);

            function checkValue(value){
                var result = true;
                if(values.length == 0) result = true;
                for(var i=0; i<values.length; i++){
                    if(value == values[i]){
                        result =  false;
                    }
                }
                return result;
            }

            deferred.resolve(uniqueResponse);
        }, function (error) {
            console.trace(error.message);
            deferred.reject(error);
        });

        return deferred.promise;

    }

};