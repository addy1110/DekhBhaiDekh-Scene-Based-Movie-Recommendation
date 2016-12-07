/**
 * Created by ADDY on 19/11/16.
 */
module.exports = function(app){

    var q = require("q");


    function es(type) {


        var deferred = q.defer();
        console.log(type);


    }

    app.get("/api/users/:type",querysearch)


    function querysearch(req,res){

        var type=req.params.type;
        console.log(type);
        // es(type)
        //     .then(function(result){
        //         console.log("hits length sent : "+result.length);
        //         res.json(result)});

    }
};