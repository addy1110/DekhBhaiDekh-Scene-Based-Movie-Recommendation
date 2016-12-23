(function () {
    'use strict';

    angular
        .module('app')
        .controller('RomanceController', RomanceController);

    RomanceController.$inject = ['UserService', '$rootScope', '$scope', '$location', '$q', '$http'];
    function RomanceController(UserService, $rootScope, $scope, $location,  $q, $http) {
        var vm = this;
        // vm.imgShow = false;
        vm.dataloading=true;
        vm.myimg=[
            {
                id:"mv01",
                name:"Top Gear",
                imgSrc:"http://ia.media-imdb.com/images/M/MV5BMTM4OTQ1MDMwOF5BMl5BanBnXkFtZTcwMDgwMjg2OQ@@._V1_SX300.jpg"
            },
            {id:"mv02",
                name:"Rock Dancing",
                imgSrc:"https://images-na.ssl-images-amazon.com/images/M/MV5BMWRiOTQyMzktNWZlNS00ZjYxLTkwNTItYzA4YzVkNWRkYzRjXkEyXkFqcGdeQXVyNjQ4ODc3Nzc@._V1_SX300.jpg"
            },
            {id:"mv03",
                name:"Chinese Cooking",
                imgSrc:"http://ia.media-imdb.com/images/M/MV5BNTNiNDQxYjktYzk5MS00MTNiLWE0YTktMTFlOThiZjE4YTNjXkEyXkFqcGdeQXVyMjExMzEyNTM@._V1_SX300.jpg"
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

        var genreType = {
            "action"    : 401,
            "comedy"    : 402,
            "horror"    : 403,
            "romance"   : 404,
            "sci-fi"    : 405,
            "crime"     : 406,
            "drama"     : 407
        };
        vm.mvname = "mv06";

        vm.movie=[];
        vm.imgSrc=[];

        /*$.get("/api/es/" + "init",
         function (response) {
         for(var i = 0; i < response.length; i++){
         vm.movie[i] = response[i]._source;
         vm.imgSrc[i] = response[i]._source['poster-links'];
         console.log(vm.imgSrc[i]);
         }
         vm.dataloading=false;
         });*/


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
            var movieselect;
            var getDatetime = new Date();
            vm.imgToShow=$scope.imgSrc;
            vm.imgName=$scope.name;
            vm.showImg=true;

            if(vm.user!=null) {
                movieselect = {
                    userid: vm.user.username,
                    timeStamp: getDatetime,
                    eventType : 200,
                    movieid: vm.imgName,
                    genreid: null
                };
                console.log(movieselect);
                sendObjToSQS(movieselect);
            }


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
                sendObjToSQS(userSign);
            }

            $location.path( path );
        };

        $scope.logdata = function ( genre ) {
            console.log(genre);
            var getDatetime = new Date();
            var userevent;
            var genreid = genreType[genre];
            if(vm.user!=null) {
                userevent = {
                    userid: vm.user.username,
                    timeStamp: getDatetime,
                    eventType : 400,
                    movieid: null,
                    genreid: genreid
                };
                console.log(userevent);
                sendObjToSQS(userevent);
            }

            //$location.path( path );
        };

        function sendObjToSQS(userev)
        {
            // var q = require("q");

            console.log(userev);
            var deferred = $q.defer();
            $http.post("/api/sqs/usersign",userev).success(function(response){
                deferred.resolve(response);


            });
            console.log(deferred.promise);
            return deferred.promise;

        }

    }

})();
