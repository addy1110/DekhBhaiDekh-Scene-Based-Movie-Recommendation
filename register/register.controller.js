(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService', 'AuthenticationService'];
    function RegisterController(UserService, $location, $rootScope, FlashService,  AuthenticationService) {
        var vm = this;

        vm.register = register;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();



        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        var getDatetime = new Date();
                        var userSign;
                        userSign = {
                            userid: vm.user.username,
                            timeStamp: getDatetime,
                            type: 10
                        };
                        console.log(userSign);
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

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
