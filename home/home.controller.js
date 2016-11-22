(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$scope', '$location'];
    function HomeController(UserService, $rootScope, $scope, $location) {
        var vm = this;

        vm.myimg=[
            {
                id:"mv01",
                name:"Top Gear",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-1.jpg"
            },
            {id:"mv02",
                name:"Rock Dancing",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-2.jpg"
            },
            {id:"mv03",
                name:"Chinese Cooking",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-4.jpg"
            },
            {id:"mv04",
                name:"Audience Interview",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-5.jpg"
            },
            {id:"mv05",
                name:"Jimmy Dancing",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-6.jpg"
            },
            {id:"mv06",
                name:"Singing",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-7.jpg"
            },
            {id:"mv07",
                name:"Singing Audition",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-8.jpg"
            },
            {id:"mv08",
                name:"Gentleman",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-9.jpg"
            },
            {id:"mv09",
                name:"Singing Performance",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-10.jpg"
            },
            {id:"mv10",
                name:"Smoooooch!",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-11.jpg"
            },
            {id:"mv11",
                name:"Cat Fight",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-12.jpg"
            },
            {id:"mv12",
                name:"Model Posing",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-13.jpg"
            },
            {id:"mv13",
                name:"Song Video",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-14.jpg"
            },
            {id:"mv014",
                name:"Marriage",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-15.jpg"
            },
            {id:"mv15",
                name:"Competition",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-16.jpg"
            },
            {id:"mv16",
                name:" Poor Top Gear",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-17.jpg"
            },
            {id:"mv17",
                name:"Mask Man",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-18.jpg"
            },
            {id:"mv18",
                name:"Lobster Cooking",
                imgSrc:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/70390/show-19.jpg"
            }

        ];

        vm.hello = "Hello Aditya";
        vm.showImg = false;
        vm.imgToShow=vm.myimg[0].imgSrc;
        vm.imgName=vm.myimg[0].name;
        vm.searchValue=null;
        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        initController();

        vm.imgClick = imgClick;

        function imgClick($scope) {
            vm.imgToShow=$scope.imgSrc;
            vm.imgName=$scope.name;
            vm.showImg=true;

            console.log($scope);

        }

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }

        $scope.go = function ( path ) {
            var getDatetime = new Date();
            var userSign;
            if(vm.user!=null) {
                userSign = {
                    userid: vm.user.username,
                    timeStamp: getDatetime,
                    type: 30
                };
                console.log(userSign);
            }

            $location.path( path );
        };
    }

})();