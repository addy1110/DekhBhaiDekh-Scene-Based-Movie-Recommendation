(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', 'UserService', '$location', '$rootScope', 'FlashService', 'AuthenticationService', '$q', '$http'];
    function RegisterController($scope, UserService, $location, $rootScope, FlashService,  AuthenticationService,  $q, $http) {
        var vm = this;

        vm.userdata = {
            userid : null,
            firstname: null,
            lastname : null,
            email : null,
            pass : null,
            dob : null,
            genre : null
        };

        vm.genre = ["Action", "Comedy", "Horror", "Romance", "Sci-fi", "Drama"];

        $scope.albums = [{name:vm.genre[0]},{name:vm.genre[1]},{name:vm.genre[2]}, {name:vm.genre[3]},{name:vm.genre[4]},{name:vm.genre[5]}];

        vm.register = register;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();


        function sendObjToSQS(usersign) {
            // var q = require("q");

            console.log(usersign);
            var deferred = $q.defer();
            $http.post("/api/sqs/usersign", usersign).success(function (response) {
                deferred.resolve(response);


            });
            console.log(deferred.promise);
            return deferred.promise;

        }


        function register() {
            vm.dataLoading = true;
            console.log("in register");
            vm.albumNameArray = "";

            angular.forEach($scope.albums, function(album){
                if (album.selected){
                    vm.albumNameArray += album.name+',';
                }
            });

            vm.userdata.genre = vm.albumNameArray;

            console.log(vm.userdata.userid);
            console.log(vm.userdata);

            UserService.Create(vm.userdata, function (response) {
                      if (response.status == "OK") {
                       var d = new Date();
                        var getDatetime = Math.floor(d.getTime()/1000);
                        var userSign;
                        userSign = {
                            userid: vm.userdata.userid,
                            timeStamp: getDatetime,
                            type: 10
                        };
                        console.log(userSign);
                        sendObjToSQS(userSign);
                        FlashService.Success('Registration successful', true);

                        $location.path('/login');
                    } else {
                          alert("Email or UserId exists")
                       // FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {

                console.log("In login Controler value returned");
                console.log(response);

                if (response.length != 0) {

                    var getDatetime = new Date();
                    var userSign;
                    userSign = {
                        userid: vm.username,
                        timeStamp: getDatetime,
                        type: 20
                    };
                    console.log(userSign);

                    sendObjToSQS(userSign);

                    $location.path('/home');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();
