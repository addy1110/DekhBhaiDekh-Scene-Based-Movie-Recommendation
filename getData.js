/**
 * Created by ADDY on 19/11/16.
 */
module.exports = function(app){

    var elasticsearch = require('elasticsearch');

    var q = require("q");


    var client = new elasticsearch.Client({
        host: 'https://search-test-movie-recommendation-oyp7fwybxby3qe5xlif23zl5d4.us-east-1.es.amazonaws.com/movieproject/Movies'
    });



    /*function es(type) {


        var deferred = q.defer();
        console.log(type);


    }*/
    function getMovie(type){
        var deferred = q.defer();

        if(type == "init"){
            var query = "mv01, mv02, mv03, mv04, mv05, mv06, mv07, mv08, mv09, mv10, mv11, mv12, mv13, mv14, mv15, mv16";
        }



        client.search({
            size: 16,
            q: query

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

    app.get("/api/users/:type",querysearch);


    function querysearch(req,res){

        var type=req.params.type;
        console.log(type);
        // es(type)
        //     .then(function(result){
        //         console.log("hits length sent : "+result.length);
        //         res.json(result)});

    }

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