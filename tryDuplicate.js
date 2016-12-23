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
    q: "basketball"
}).then(function (body) {
    var hits = body.hits.hits;
    for(var i=0;i<hits.length;i++){
        if(checkValue(hits[i]._source.key) ) {
            values.push(hits[i]._source.key);
            index.push(i);
            console.log(hits[i]._source.key+" "+hits[i]._source.rating);
        }
    }
    for(i=0;i<index.length;i++){
        uniqueResponse.push(hits[index[i]]);
    }


    console.log(index);
    console.log(values);
    console.log(uniqueResponse);
    console.log(uniqueResponse.length);

    deferred.resolve(hits);
}, function (error) {
    console.trace(error.message);
    deferred.reject(error);

});
return deferred.promise;

function checkValue(value){
    var result = true;
    for(var i=0; i<values.length; i++){
        if(value == values[i]){
            result =  false;
        }
    }
return result;
}
