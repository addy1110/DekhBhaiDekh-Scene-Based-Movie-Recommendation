(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope','$location', 'AuthenticationService', 'FlashService'];
    function LoginController($scope,$location, AuthenticationService, FlashService) {


        $scope.go = function ( path ) {

            $location.path( path );
        };

        var vm = this;

        vm.login = login;



        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    var getDatetime = new Date();
                    var userSign;
                    userSign = {
                        userid: vm.username,
                        timeStamp: getDatetime,
                        type: 20
                    };
                    console.log(userSign);

                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();
