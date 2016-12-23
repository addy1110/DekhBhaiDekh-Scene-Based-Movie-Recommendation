(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http','$timeout'];
    function UserService($http,$timeout) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            console.log(username);
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user,callback) {
            console.log("in userservice.Create");
            //return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
            console.log("creating user");
            console.log(user);

            $timeout(function () {
            $http.post('/api/project/register', user)
                .success(function (response) {
                    console.log("registration reply");
                    console.log(response);
                    callback(response);
                });
            }, 1000);
        }

        function Update(user) {

            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            console.log(res.data);
            return res.data;

        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
