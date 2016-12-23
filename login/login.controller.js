(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope','$location', 'AuthenticationService', 'FlashService', '$q', '$http'];
    function LoginController($scope,$location, AuthenticationService, FlashService, $q, $http) {


        $scope.go = function ( path ) {

            $location.path( path );
        };

        var vm = this;

        vm.login = login;



        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function sendObjToSQS(usersign)
        {
            console.log(usersign);
            var deferred = $q.defer();
            $http.post("/api/sqs/usersign",usersign).success(function(response){
                deferred.resolve(response);


            });
            console.log(deferred.promise);
            return deferred.promise;

        }

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {

                console.log("In login Controler value returned");
                console.log(response);

                if(response.length!=0)
                {

                    /*var d = new Date();
                    var getDatetime = Math.floor(d.getTime()/1000);

                    var userSign;
                    userSign = {
                        userid: vm.username,
                        timeStamp: getDatetime,
                        type: 20
                    };
                    console.log(userSign);

                    sendObjToSQS(userSign);
*/


                    //AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/home');
                } else {

                    console.log(response);

                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();
