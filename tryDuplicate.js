/**
 * Created by ADDY on 23/12/16.
 */
var elasticsearch = require('elasticsearch');


var q = require("q");
var request = require("request");


var client = new elasticsearch.Client({
    host: 'https://search-movies-5zcbuwmhuftqplir3dnm72jd4a.us-east-1.es.amazonaws.com/complete_movies'
});

var index = [];
var values = [];
var uniqueResponse = [];
client.search({
    size: 20,
    q: "Horror"
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
        console.log(uniqueResponse[i]._source.genres);
    }
    console.log(values.length);
    console.log(index.length);
    console.log(uniqueResponse.length);



}, function (error) {
    console.trace(error.message);

});


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
