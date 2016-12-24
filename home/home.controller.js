(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$scope', '$location', '$q', '$http'];
    function HomeController($rootScope, $scope, $location,  $q, $http) {
        var vm = this;
        vm.userdata = $rootScope.user[0];
        console.log(vm.userdata.userid);
        vm.myimg=[];
        vm.searchresponse=null;
        vm.recommendedMovies = null;
        vm.movie= null;

        var eventype = [
            '100',   // user sign in
            '200',   // user selects a genre
            '300',   // user selects a movie
            '400'    // user searches for a movie
        ];

        var genreType = {
            "Action"    : 401,
            "Comedy"    : 402,
            "Horror"    : 403,
            "Romance"   : 404,
            "Sci-Fi"    : 405,
            "Crime"     : 406,
            "Drama"     : 407
        };

        var init = function(){
            var initObj = {
                movieId : null,
                userId : vm.userdata.userid,
                genre : vm.userdata.genre,
                code  : eventype[0] // initial user sign in
            };
            console.log("user sign-in query..");


          getMovieData(initObj).then(function (response) {
              try{
                  vm.recommendedMovies = response;

              console.log("init display:",vm.recommendedMovies);
              console.log("init display length :",vm.recommendedMovies.movies.length)


              for (var i=0;i<vm.recommendedMovies.movies.length;i++){
                  if(vm.recommendedMovies.movies[i].mv[0]!= undefined){
                      vm.myimg[i]={};

                      vm.myimg[i].imgSrc = vm.recommendedMovies.movies[i].mv[0]._source["picture_url"];
                      vm.myimg[i].key = vm.recommendedMovies.movies[i].mv[0]._source.key;
                      vm.myimg[i].title = vm.recommendedMovies.movies[i].mv[0]._source.title;
                      vm.myimg[i]["release_year"] = vm.recommendedMovies.movies[i].mv[0]._source["release_year"];
                      vm.myimg[i].rating = vm.recommendedMovies.movies[i].mv[0]._source.rating;
                      vm.myimg[i].actors = vm.recommendedMovies.movies[i].mv[0]._source.actors;
                      vm.myimg[i].directors = vm.recommendedMovies.movies[i].mv[0]._source.directors;
                      vm.myimg[i].synopsis  = vm.recommendedMovies.movies[i].mv[0]._source.synopsis;
                      console.log(vm.myimg[i]);
                  }

              }
              }catch(err){

              }
          })
        };

        init();

        if(vm.movie == null){
            vm.videoSrc =  "/videos/1.mp4"
        }
        else{
            vm.videoSrc =  vm.movie[0]._source["video_urls"];
        }

        console.log(vm.videoSrc);

        vm.imgClick = function(imgKey){
            vm.searchresponse=null;
            var movieselect;
            var d = new Date();
            var getDatetime = Math.floor(d.getTime()/1000);

            // vm.imgToShow = $scope.imgSrc;
            console.log("image is ");
            console.log(imgKey.key);
            // vm.imgName=$scope.name;

            // vm.imgToShow=;
            // vm.imgName=$scope.name;

            console.log(vm.userdata.userid);


            if(vm.userdata.userid!=null) {
                movieselect = {
                    userid: vm.userdata.userid,
                    timeStamp: getDatetime,
                    eventType : 200,
                    movieid: imgKey.key,
                    genreid: null
                };
                console.log(movieselect);
                sendObjToSQS(movieselect);
            }

            var moviequery = {
                code: eventype[2],  //user selects a movie
                userId : vm.userdata.userid,
                movieId : imgKey.key,
                genre : vm.userdata.genre
            };

            vm.recommendedMovies=null;
            vm.movie= null;
            getMovieData(moviequery).then(function (response) {
                try{
                    vm.recommendedMovies= response;

                console.log("init display:",vm.recommendedMovies);
                console.log("init display length :",vm.recommendedMovies.movies.length);

                    vm.recommendedMovies.movies[0].mv[0]._source.title = imgKey.title;
                    vm.recommendedMovies.movies[0].mv[0]._source["release_year"] = imgKey["release_year"];
                    vm.recommendedMovies.movies[0].mv[0]._source.rating = imgKey.rating;
                    vm.recommendedMovies.movies[0].mv[0]._source.actors = imgKey.actors;
                    vm.recommendedMovies.movies[0].mv[0]._source.directors = imgKey.directors;
                    vm.recommendedMovies.movies[0].mv[0]._source.synopsis  = imgKey.synopsis;
                    // console.log(vm.movie.movies[0].mv[0]._source.synopsis);


                for (var i=0;i<vm.recommendedMovies.movies.length;i++){
                    if(vm.recommendedMovies.movies[i].mv[0]!= undefined){
                        vm.myimg[i]={};
                        // .imgSrc=null
                        vm.myimg[i].imgSrc = vm.recommendedMovies.movies[i].mv[0]._source["picture_url"];
                        vm.myimg[i].key = vm.recommendedMovies.movies[i].mv[0]._source.key;
                        vm.myimg[i].title = vm.recommendedMovies.movies[i].mv[0]._source.title;
                        vm.myimg[i]["release_year"] = vm.recommendedMovies.movies[i].mv[0]._source["release_year"];
                        vm.myimg[i].rating = vm.recommendedMovies.movies[i].mv[0]._source.rating;
                        vm.myimg[i].actors = vm.recommendedMovies.movies[i].mv[0]._source.actors;
                        vm.myimg[i].directors = vm.recommendedMovies.movies[i].mv[0]._source.directors;
                        vm.myimg[i].synopsis  = vm.recommendedMovies.movies[i].mv[0]._source.synopsis;
                        console.log(vm.myimg[i]);
                    }

                }
                }catch(err){

                }
            })
        };

        $scope.go = function ( path ) {
            vm.searchresponse=null
            vm.movie= null;
            var d = new Date();
            var getDatetime = Math.floor(d.getTime()/1000);

            var userSign;
            if(vm.userdata.userid!=null) {
                userSign = {
                    userid: vm.userdata.userid,
                    timeStamp: getDatetime,
                    type: 30
                };
                console.log(userSign);
                sendObjToSQS(userSign);
            }

            $location.path( path );
        };

        vm.searchKeyword=null;


        vm.searchMovie = function(){
            vm.searchresponse=null;
            vm.movie= null;
            console.log("search tab");
            console.log(vm.searchKeyword);

            var d = new Date();
            var getDatetime = Math.floor(d.getTime()/1000);

            var search = "search|"+vm.searchKeyword;

            //get movie details
            vm.recommendedMovies = null;

            $http.get("/api/es/" + search).success(
             function (response, err) {
                 vm.showError = false;
                console.log(response);
                if(response.length!=0){
                    vm.searchresponse = response;
                }else{
                    vm.searchresponse = ["error"];
                    vm.showError = true;
                }

                if(err){
                    console.log("Error is "+err);

                }





             /*var userevent;
             if(vm.userdata.userid!=null && vm.searchresponse[0]._source.key!=null) {
                 userevent = {
                     userid: vm.userdata.userid,
                     timeStamp: getDatetime,
                     eventType: 100,
                     movieid: vm.searchresponse[0]._source.key,
                     genreid: null
                 };
                 console.log("pushing to sqs");
                 console.log(userevent);
                 sendObjToSQS(userevent);
             }
             */
             });



        };

        vm.searchedMovie = function(movieKey){
            vm.searchresponse=null;
            vm.recommendedMovies=null;
            vm.movie= null;
            console.log(movieKey.key);

            var movieselect;
            var d = new Date();
            var getDatetime = Math.floor(d.getTime()/1000);

            console.log(vm.userdata.userid);


            /*if(vm.userdata.userid!=null) {
                movieselect = {
                    userid: vm.userdata.userid,
                    timeStamp: getDatetime,
                    eventType : 200,
                    movieid: movieKey.key,
                    genreid: null
                };
                console.log(movieselect);
                sendObjToSQS(movieselect);
            }*/

            var moviequery = {
                code: eventype[2],  //user selects a movie
                userId : vm.userdata.userid,
                movieId : movieKey.key,
                genre : vm.userdata.genre
            };


            getMovieData(moviequery).then(function (response) {
                try{
                    vm.recommendedMovies= response;
                    vm.movie= null;

                    console.log("init display:",vm.recommendedMovies);
                    console.log("init display length :",vm.recommendedMovies.movies.length);

                    vm.recommendedMovies.movies[0].mv[0]._source.title = movieKey.title;
                    vm.recommendedMovies.movies[0].mv[0]._source["release_year"] = movieKey["release_year"];
                    vm.recommendedMovies.movies[0].mv[0]._source.rating = movieKey.rating;
                    vm.recommendedMovies.movies[0].mv[0]._source.actors = movieKey.key;
                    vm.recommendedMovies.movies[0].mv[0]._source.directors = movieKey.key;
                    vm.recommendedMovies.movies[0].mv[0]._source.synopsis  = movieKey.synopsis;
                    // console.log(vm.movie.movies[0].mv[0]._source.synopsis);


                    for (var i=0;i<vm.recommendedMovies.movies.length;i++){
                        if(vm.recommendedMovies.movies[i].mv[0]!= undefined){
                            vm.myimg[i]={};
                            // .imgSrc=null
                            vm.myimg[i].imgSrc = vm.recommendedMovies.movies[i].mv[0]._source["picture_url"];
                            vm.myimg[i].key = vm.recommendedMovies.movies[i].mv[0]._source.key;
                            vm.myimg[i].title = vm.recommendedMovies.movies[i].mv[0]._source.title;
                            vm.myimg[i]["release_year"] = vm.recommendedMovies.movies[i].mv[0]._source["release_year"];
                            vm.myimg[i].rating = vm.recommendedMovies.movies[i].mv[0]._source.rating;
                            vm.myimg[i].actors = vm.recommendedMovies.movies[i].mv[0]._source.actors;
                            vm.myimg[i].directors = vm.recommendedMovies.movies[i].mv[0]._source.directors;
                            vm.myimg[i].synopsis  = vm.recommendedMovies.movies[i].mv[0]._source.synopsis;
                            console.log(vm.myimg[i]);
                        }

                    }
                }catch(err){

                }
            })

        };


        vm.logdata = function(genre){
            console.log(genre);
            vm.searchresponse=null;
            vm.movie= null;
            var d = new Date();
            var getDatetime = Math.floor(d.getTime()/1000);

            var userevent;
            var genreid = genreType[genre];
            if(vm.userdata.userid!=null) {
                userevent = {
                    userid: vm.userdata.userid,
                    timeStamp: getDatetime,
                    eventType : 400,
                    movieid: null,
                    genreid: genreid
                };
                console.log(userevent);
                sendObjToSQS(userevent);
            }

            var genreMovieQuery = {
                code: eventype[1],  //user selects a movie
                userId : vm.userdata.userid,
                movieId : null,
                genre : genre
            };

            vm.recommendedMovies=null;
            getMovieData(genreMovieQuery).then(function (response) {
                vm.recommendedMovies= response;
                vm.movie= null;
                console.log("init display:",vm.recommendedMovies)
                console.log("init display length :",vm.recommendedMovies.movies.length)


                for (var i=0;i<vm.recommendedMovies.movies.length;i++){
                    if(vm.recommendedMovies.movies[i].mv[0]!= undefined){
                        vm.myimg[i]={}
                        // .imgSrc=null
                        vm.myimg[i].imgSrc = vm.recommendedMovies.movies[i].mv[0]._source["picture_url"];
                        vm.myimg[i].key = vm.recommendedMovies.movies[i].mv[0]._source.key;
                        vm.myimg[i].title = vm.recommendedMovies.movies[i].mv[0]._source.title;
                        vm.myimg[i]["release_year"] = vm.recommendedMovies.movies[i].mv[0]._source["release_year"];
                        vm.myimg[i].rating = vm.recommendedMovies.movies[i].mv[0]._source.rating;
                        vm.myimg[i].actors = vm.recommendedMovies.movies[i].mv[0]._source.actors;
                        vm.myimg[i].directors = vm.recommendedMovies.movies[i].mv[0]._source.directors;
                        vm.myimg[i].synopsis  = vm.recommendedMovies.movies[i].mv[0]._source.synopsis;
                        console.log(vm.myimg[i]);
                    }

                }
            })

            //$location.path( path );
        };

        function sendObjToSQS(userev)
        {
            // var q = require("q");
            var deferred = $q.defer();
            console.log(userev);
            $http.post("/api/sqs/usersign",userev).success(function(response){
                deferred.resolve(response);


            });
            console.log(deferred.promise);
            return deferred.promise;

        }

        var playVideo = false;

        vm.videoPlay = function(){
            vm.searchresponse=null;
            vm.movie= null;
            console.log("video played");
            var vid = document.getElementById("myVideo");

            playVideo = !playVideo;

            console.log(playVideo);

            if(playVideo) {
                console.log("playing");
                var d = new Date();
                var getDatetime = Math.floor(d.getTime()/1000);

                var vidplayed;
                if(vm.userdata.userid!=null) {
                    vidplayed = {
                        userid: vm.userdata.userid,
                        timeStamp: getDatetime,
                        eventType : 301,
                        movieid: vm.recommendedMovies.movies[0].mv[0]._source.key, //vm.movie.key,
                        genreid: null
                    };
                    console.log(vidplayed);
                    sendObjToSQS(vidplayed);
                }
                vid.play();
            }

            if(!playVideo) {
                console.log("paused");
                var d1 = new Date();
                var gettime = Math.floor(d1.getTime()/1000);

                var vidpaused;
                if(vm.userdata.userid!=null) {
                    vidpaused = {
                        userid: vm.userdata.userid,
                        timeStamp: gettime,
                        eventType : 302,
                        movieid: vm.recommendedMovies.movies[0].mv[0]._source.key, //vm.movie.key,
                        genreid: null
                    };
                    console.log(vidpaused);
                    sendObjToSQS(vidpaused);
                }
                vid.pause();
            }

        };

        function getMovieData(obj) {
            vm.searchresponse=null;
            vm.movie= null;
            var deferred = $q.defer();
            $.ajax({
                url: 'http://tweetygooglemap-dev.v3a2wmjgrc.us-west-2.elasticbeanstalk.com/post/',
                type : 'POST',
                data : obj,
                success: function (response) {
                    console.log("recommend");
                    console.log(response);
                   try {
                       console.log("Final data is ");
                       deferred.resolve(response)
                   }
                   catch(err){
                   }
                }
            });
            return deferred.promise;
        }

    }

})();