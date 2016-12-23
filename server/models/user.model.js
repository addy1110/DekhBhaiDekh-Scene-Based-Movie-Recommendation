var q = require("q");

module.exports = function(pool) {

    var api = {
        //----------- Addy New  ---------------------
        findUserByCredentials: findUserByCredentials,
        FindById: FindById,
        addUser:addUser
    };

    return api;
    //----------------------------------------------------------------------
    function addUser(user){

        var deferred = q.defer();
        console.log("userid in model addUser:")
        console.log (user)
        var mysql = require('mysql');
        var q2 = pool.query("SELECT * FROM moviedb WHERE userid = ? OR  email = ? ",[user.userid,user.email],
            function (err, res) {

                if (err != null) {
                    console.log("error connecting FindById")
                    console.log(err)
                    deferred.reject(err);
                }
                else {
                    if(res.length>0){

                        deferred.resolve(null);
                    }
                    else{

                        var query1 = pool.query('INSERT INTO moviedb SET ?', user,
                            function(err, result2) {
                                if (err != null) {
                                    console.log("error connecting")
                                    deferred.reject(error);
                                }
                                else {
                                    console.log('The insertion  is: ', result2);
                                    deferred.resolve(result2)
                                }
                            })

                    }

                }
            });
        return deferred.promise;

    }
    function FindById(userId) {
        var deferred = q.defer();
        console.log("userid in model findbyid:"+userId)
        console.log (userId)
        var mysql = require('mysql');
          var q2 = pool.query("SELECT * FROM moviedb WHERE userid = ? ",[userId],
            function (err, res) {

                if (err != null) {
                    console.log("error connecting FindById")
                    console.log(err)
                    deferred.reject(err);
                }
                else {
                    console.log('The solution FindById: ', res);
                    deferred.resolve(res)
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(username,password) {
        var deferred = q.defer();
        console.log("userid in model findUserByCredentials:"+username,password)
        var mysql = require('mysql');
        var q2 = pool.query("SELECT * FROM moviedb WHERE userid = ? AND pass =? ",[username,password],
            function (err, res) {

                if (err != null) {
                    console.log("error connecting findUserByCredentials")
                    console.log(err)
                    deferred.reject(err);
                }
                else {
                    console.log('The solution findUserByCredentials: ', res);
                    deferred.resolve(res)
                }
            });
        return deferred.promise;
    }



    //--------------------------------------------------------------------------


};