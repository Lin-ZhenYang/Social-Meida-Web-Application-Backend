//let sessionUser = {};

const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');

let cookieKey = "sid";
let userObjs = {};
let md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('User',userSchema);
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('Profile',profileSchema);
const connectionString = 'mangodb connection string';

process.env.REDIS_URL="redis url";
process.env.REDIS_TLS_URL ="redis url";
const redis = require('redis').createClient(process.env.REDIS_URL);

let fbUsers ={};

passport.serializeUser(function(user, done) {
    fbUsers[user.id] = user;
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var user = fbUsers[id];
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: 'cliendtID',
    clientSecret: 'cliendtSecret',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'name'] 
},
    function(accessToken, refreshToken, profile, done) {
        let username = profile.name.givenName + profile.name.familyName + "@fb";
        let user = {
            'name' : username,
            'id'   : profile.id,
            'token': accessToken
        };
        
        User.findOne({username:username},function(err,userObj) {
            if (err){
                console.log(err);
            } else{
                if (!userObj){              
                    let salt = username + new Date().getTime();
                    let hash = md5(salt+salt+"noRegularLogin"); 
                    
                    var newUser = new User({username:username,salt:salt,password:hash});
                    newUser.save();

                    var newProfile = new Profile(
                        {username:username,
                         zipcode:"00000",
                         dob:"01-01-1900",
                         email:"undefined@default.com", 
                         phone: "000-000-0000", 
                         avatar: "https://saturnia.bike/wp-content/uploads/2020/09/facebook-512.png",
                         followed:[]});
                    newProfile.save();
                }
            }
        });
        return done(null, user); 
    })
);

async function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        req.username = req.user.name;
        next();
    } else {
        if (!req.cookies) {
           return res.sendStatus(401);
        }

        let sid = req.cookies[cookieKey];

        if (!sid) {
            return res.sendStatus(401);
        }

        await redis.hmget('sessions',sid,function(err,Object){
            if (Object.length && Object[0]!=null){
                req.username = Object[0];
                next();
            } else {
                return res.sendStatus(401);
            }
        });
    }
    
}

async function login(req,res){
    mongoose.connect(connectionString,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true}); 
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.sendStatus(400);
    }
    User.findOne({username:username},async function(err,userObj) {
        if (err){
            console.log(err);
        } else{
            if (userObj){
                let hash = md5(userObj.salt + password);
                if (hash === userObj.password){
                    let sid = md5(username);
                    //sessionUser[sid] = username;
                    await redis.hmset('sessions',sid,username);
                    res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true, sameSite:'None', secure: true });
                    let msg = {username: username, result: 'success'};
                    res.send(msg);
                } else {
                    res.sendStatus(401);
                }
            } else {
                return res.sendStatus(401);
            }
        }
    });
}

function register(req, res) {
    mongoose.connect(connectionString,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true}); 
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.sendStatus(400);
    }
    User.findOne({username:username},function(err,userObj) {
        if (err){
            console.log(err);
        } else{
            if (userObj){
                let msg = {username: username, result: 'user existed'};
                res.send(msg);
            } else {
                let salt = username + new Date().getTime();
                let hash = md5(salt+password); 
                
                var newUser = new User({username:username,salt:salt,password:hash});
                newUser.save();

                var newProfile = new Profile({username:username,zipcode:req.body.zipcode,dob:req.body.dob,email:req.body.email, phone: req.body.phone, followed:[]});
                newProfile.save();

                let msg = {username: username, result: 'success'};
                res.send(msg);
            }
        }
    });
}

function changePassword(req,res){
    let username = req.username;
    mongoose.connect(connectionString,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true}); 
    User.findOne({username:username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            let newPassword = req.body.password;
            let salt = username + new Date().getTime();
            let hash = md5(salt+newPassword); 
            userObj.password=hash;
            userObj.salt=salt;
            userObj.save();
            let msg = {username: username, result: 'success'};
            res.send(msg);
        }
    });
}

async function logout(req,res){
    if (req.isAuthenticated()){
        delete fbUsers[req.user.id];
        req.session.destroy();
        req.logout();
        res.send("OK");
    } else {
        let sid = req.cookies[cookieKey];
        await redis.hdel('sessions',sid);
        //delete sessionUser[sid];
        res.send("OK");
    }
}

module.exports = (app) => {
    app.use(cookieParser());
    app.use(session({
        secret: 'AustinDallasHoustonSanAntonio',
        resave: false,
        saveUninitialized: true
    })); 
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}));
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: 'https://lzy-htx-social-club.surge.sh/',
        failureRedirect: 'https://lzy-htx-social-club.surge.sh/' }));
    app.post('/login',login);
    app.post('/register', register);
    app.use(isLoggedIn);
    app.put('/logout',logout);
    app.put('/password',changePassword);
}
