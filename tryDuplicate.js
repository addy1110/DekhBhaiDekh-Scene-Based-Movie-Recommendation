/**
 * Created by ADDY on 23/12/16.
 */
var elasticsearch = require('elasticsearch');


var q = require("q");
var request = require("request");


var client = new elasticsearch.Client({
    host: 'https://search-tweetymap-gurowqxu56ejw6kii5afincr3y.us-east-1.es.amazonaws.com/graph_data'
});

var index = [];
var values = [];
var uniqueResponse = [];
client.search({
    size: 1,
    q: 'doctorstrange-2016:'
}).then(function (body) {

    var hits = body.hits.hits;
    console.log("hits length : " + hits.length);
    /*index = [];
    values = [];
    uniqueResponse = [];*/
    for(var i=0;i<hits.length;i++){
        console.log(hits[i]._source);
    }


}, function (error) {
    console.trace(error.message);

});

