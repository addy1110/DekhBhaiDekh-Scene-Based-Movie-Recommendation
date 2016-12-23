module.exports = function(app, model) {

    //----------------------------- PASSPORT -------------------------
    var passport         = require('passport');
    var LocalStrategy    = require('passport-local').Strategy;
//----------------------------------------------------------------

    var user_model = model;

    var auth = authorized;


    //-----------------------------  login/register NEW CODE -------------------------

    app.post  ('/api/project/login', passport.authenticate('assignment'), login);
    app.post  ('/api/project/logout',         logout);
    app.post  ('/api/project/register',       register);
    app.get   ('/api/project/loggedin',       loggedin);




    /*-------------------------- NEW REQUESTS NEW CODE -------------------------*/
    app.get   ('/api/project/user/projects/:id/type/:type',     auth ,findAllProjects)
    app.put('/api/project/user/:id', auth, updateuser)
    app.put('/api/project/NgoProject/:id',     auth ,deleteProjectById)
    app.post("/api/project/NgoProject/",     auth ,createProject)
    app.put("/api/project/NgoProject/",     auth ,updateProject)
    app.put("/api/project/Volunteer/:userId/Project/:projectId", auth ,deleteVolunteerProjectById )
    //------------ Sona-------------
    app.post("/api/project/user",auth , getVolunteers)
    app.put("/api/project/NGO/request",auth, changeRequestStatus)
    app.post("/api/project/NGO/invite",auth,inviteVolunteers)
    app.post("/api/project/NGO/probProjects",auth,getProbProjects)
    app.put("/api/project/NGO/sendInvite",auth,sendInvite)
    app.post("/api/project/NGO/getAllInvitations",auth,getAllInvitations)
    //----------------------------------------------------------------------------------------------
    passport.use('assignment',new LocalStrategy({passReqToCallback: true},localassignmentstrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function localassignmentstrategy(req, username, password, done) {

        user_model
            .findUserByCredentials(username,password)
            .then(
                function(user) {
                    if (!user) { return done(null, false);
                        console.log(" user not found at local")
                    }
                    console.log(" user found at local"+user)
                    return done(null, user);
                },
                function(err) {
                    console.log("error at local")
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        console.log("in serialize",user)
        done(null, user);
    }

    function deserializeUser(user, done) {
        var id=user[0].userid
        console.log("in deserialize",id)
        //done(null, user);
        user_model.FindById(id)
            .then(
                function(user){

                    console.log("in deserial after finding")
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    function login(req, res) {
        console.log("In login user"+req.user);
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {

        console.log("In loggedin value"+req.user);
        if(req.isAuthenticated() )
        {
            console.log("auth done");
            res.send(req.user);
        }

        else{
            res.sendStatus(403);
            console.log("auth not done")
        }
    }

    function logout(req, res) {
        req.logOut();
        res.send(null);
    }


//------------------------------------- old CODE ----------------------------------------------------

//--------------- SONA ---------------------------------------------------------


    function getAllInvitations(req,res) {

        var user= req.body;
        console.log("In getAllInvitations service")
        console.log(user)
        //res.sendStatus(200);

        user_model.getAllInvitations(user)
            .then(function (invitations) {
                    console.log("In getAllInvitations service result")
                    console.log(invitations)
                    res.json(invitations)
                }, function (error) {
                    console.log("in getAllInvitations reject value")
                    res.json(error)
                }
            );
    }

    function sendInvite(req,res) {

        var vol= req.body;
        console.log("In getProbProjects service")
        console.log(vol)
        //res.sendStatus(200);

        user_model.sendInvite(vol)
            .then(function (projects) {
                    console.log("In sendInvite service result")
                    console.log(projects)
                    res.sendStatus(200)
                }, function (error) {
                    console.log("in sendInvite reject value")
                    res.json(error)
                }
            );

    }

    function getProbProjects(req,res) {

        var vol= req.body;
        console.log("In getProbProjects service")
        console.log(vol)
        //res.sendStatus(200);

        user_model.getProbProjects(vol)
            .then(function (projects) {
                    console.log("In getProbProjects service result")
                    console.log(projects)
                    res.json(projects)
                }, function (error) {
                    console.log("in getProbProjects reject value")
                    res.json(error)
                }
            );
    }

    function inviteVolunteers(req,res) {

        var user= req.body;
        console.log("In inviteVolunteers service")
        console.log(user)
        //res.sendStatus(200);

        user_model.inviteVolunteers(user)
            .then(function (vol) {
                    console.log("In inviteVolunteers service result")
                    console.log(vol)
                    res.json(vol)
                }, function (error) {
                    console.log("in inviteVolunteers reject value")
                    res.json(error)
                }
            );
    }

    function changeRequestStatus(volunteer,res){

        console.log("In get accept request Server.js")
        console.log(volunteer.body)

        user_model.changeRequestStatus(volunteer.body)
            .then(function (volunteer) {
                    console.log("In accept request service result")
                    console.log(volunteer)
                    res.sendStatus(200)
                },function(error){
                    console.log("in accept request reject value")
                    res.json(error);
                }
            );

    }

    function getVolunteers(user,res) {
        console.log("In get Volunteers Server.js")
        console.log(user.body)

        user_model.getVolunteers(user.body)
            .then(function (volunteers) {
                    console.log("In volunteers service result")
                    console.log(volunteers)
                    res.json(volunteers)
                },function(error){
                    console.log("in volunteers reject value")
                    res.json(error);
                }
            );

    }


//----------- SONA ---------------------------------------
    function deleteVolunteerProjectById(req, res){

        var userId = req.params.userId;
        var projectId = req.params.projectId;


        var project= req.body;
        console.log("In createPdeleteVolunteerProjectByIdroject service")
        console.log(userId,projectId)
        //res.sendStatus(200);

        user_model.deleteVolunteerProjectById(userId,projectId)
            .then(function (status) {
                    console.log("In createProject service result")
                    console.log(status)
                    res.sendStatus(200)
                }, function (error) {
                    console.log("in createProject reject value")
                    res.json(0)
                }
            );


    }






    function updateuser(req, res) {

        var user = req.body;

        console.log("XXXXXXXXXXXXXX")
        console.log(user)
        //var userId = req.params.id;
        user_model
            .Update(user)
            .then(function(newuser){
                console.log(newuser)
                res.json(newuser)}, function (error) {
                    console.log("in createProject reject value")
                    res.sendStatus(400)
                }
                );

    }




    function updateProject(req, res) {

        var project= req.body;
        console.log("In createProject service")
        console.log(project)
        //res.sendStatus(200);

        user_model.updateProject(project)
            .then(function (status) {
                    console.log("In createProject service result")
                    console.log(status)
                    res.sendStatus(200)
                }, function (error) {
                    console.log("in createProject reject value")
                    res.sendStatus(400)
                }
            );
    }



    function createProject(req, res) {

        var project= req.body;
        console.log("In createProject service")
        console.log(project)
        //res.sendStatus(200);

        user_model.createProject(project)
            .then(function (status) {
                    console.log("In createProject service result")
                    console.log(status)
                    res.sendStatus(200)
                }, function (error) {
                    console.log("in createProject reject value")
                    res.sendStatus(400)
                }
            );
    }



    function deleteProjectById(req, res) {

        var projectId = req.params.id;
        console.log("In deleteProjectById service")
        console.log(projectId)
        //res.sendStatus(200);

        user_model.deleteProjectById(projectId)
            .then(function (status) {
                    console.log("In deleteProjectById service result")
                    console.log(status)
                    res.sendStatus(200)
                }, function (error) {
                    console.log("in deleteProjectById reject value")
                    res.sendStatus(400)
                }
            );
    }
    function findAllProjects(req, res)
    {

        var userId = req.params.id;
        var type = req.params.type

        console.log("In findAllProjects service")
        console.log(userId,type)
        //res.sendStatus(200);

        user_model.findAllProjects(userId,type)
            .then(function (Projects) {
                console.log("In findAllProjects service result")
                console.log(Projects)
                res.json(Projects)
            },function(error){
                    console.log("in findAllProjects reject value")
                    res.json(error);
                }
            );
            /*console.log(userId,type)
        if(isAdmin(req.user)) {
            var sort=req.body
            console.log("sort in user service:",sort)
            user_model.FindAll(sort)
                .then(function (users) {
                    res.json(users)
                });
        }
        else
            res.send(403)*/
    }

    function register(req,res) {

        console.log("rahul register");
        console.log(req.body);

        user_model.addUser(req.body)
            .then(function (user){
                    console.log("in service model recieved value");
                    console.log(user);
                    if(user!=null){

                                res.json({status:"OK"});
                    }
                    else{
                        console.log("User exists")
                        res.json({status:"NOTOK"})

                    }

                },function(error){

                    console.log("in service model reject value");
                    res.json(error);
                }
            );

    }
    //------------------------------- LOGIN AUTH FUNCTIONS--------------------------------------------------------


};