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
        vm.recommendedMoviesData = null;
        vm.movie= null;
        vm.interMovie = null;

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

                vm.recommendedMovies = response;
                getRecommendedMoviesData(vm.recommendedMovies,1);

          })

        };


        init();

        /*if(vm.movie == null){
            vm.videoSrc =  "/videos/1.mp4"
            console.log("video : "+vm.videoSrc);
        }
        else{
            vm.videoSrc =  vm.movie._source["video_urls"]["s3_url"] || vm.movie._source["video_urls"]["youtube_url"] || "/videos/1.mp4";
            console.log("video : "+vm.videoSrc);
        }*/

        vm.imgClick = function(movieObj){
            var movieselect;
            var d = new Date();
            var getDatetime = Math.floor(d.getTime()/1000);

            console.log(movieObj);

            console.log(vm.userdata.userid);


            /*if(vm.userdata.userid!=null) {
                movieselect = {
                    userid: vm.userdata.userid,
                    timeStamp: getDatetime,
                    eventType : 200,
                    movieid: movieObj.mv[0]._source.key,
                    genreid: null
                };
                console.log(movieselect);
                sendObjToSQS(movieselect);
            }*/
            vm.movie= null;
            console.log("movie selected " + movieObj.key);

            $http.get("/api/es/moviekey/" + movieObj.key).success(
                function (response) {

                    console.log("movie received is ");
                    console.log(response);
                    if(response.length!=0){
                        vm.movie = response;
                    }else{
                        vm.movie = ["error"];
                    }

                });

            var moviequery = {
                code: eventype[2],  //user selects a movie
                userId : vm.userdata.userid,
                movieId : movieObj.key,
                genre : vm.userdata.genre
            };
            console.log("querrying for recommendation : ");
            console.log(moviequery);
            vm.recommendedMovies=null;
            vm.recommendedMoviesData=null;

            getMovieData(moviequery).then(function (response) {

                vm.recommendedMovies= response;
                getRecommendedMoviesData(vm.recommendedMovies, 2);

            })
        };

        $scope.go = function ( path ) {
            vm.searchresponse=null;
            vm.movie= null;
            vm.recommendedMoviesData = null;
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

                getRecommendedMoviesData(vm.recommendedMovies, 1);
            });

            //$location.path( path );
        };

        function sendObjToSQS(userev)
        {
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
                        movieid: vm.movie._source.key, //vm.movie.key,
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
                        movieid: vm.movie._source.key, //vm.movie.key,
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
                    if(response.movies.length == 0){
                        console.log("no recommendations received");
                    }else{
                        console.log("everything is ok");
                    }
                    deferred.resolve(response)
                }
            });
            return deferred.promise;
        }

        function getAllMovieData(query){
            var deferred = $q.defer();
            $http.get("/api/es/" + query).success(
                function (response) {

                    console.log(response);
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getRecommendedMoviesData(recommendedMovies, code){
            console.log("init display:",recommendedMovies);
            console.log("init display length :",recommendedMovies.movies.length);
            console.log(recommendedMovies.movies[0]);

            var searchKey="key| ";
            for(var i=0;i<vm.recommendedMovies.movies.length;i++){
                searchKey += vm.recommendedMovies.movies[i]+", ";
            }

            console.log(searchKey);
            vm.recommendedMoviesData=null;
            getAllMovieData(searchKey).then(function (result){

                if(result.length!=0){
                    vm.recommendedMoviesData = result;
                }else{
                    vm.recommendedMoviesData = ["error"];
                }
                console.log("movie data received is ");
                console.log(vm.recommendedMoviesData);
                console.log("code is ");
                console.log(code);
                if(code == 1){
                    vm.movie = vm.recommendedMoviesData[0];
                }


            });
        }


    }

})();