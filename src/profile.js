const mongoose = require('mongoose');
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('Profile',profileSchema);
const connectionString = 'mongodb+srv://lzymdb:lzymdbmima@cluster0.2zfoz.mongodb.net/social_web_backend_db?retryWrites=true&w=majority';
mongoose.connect(connectionString,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true}); 

function putHeadline(req,res){
    Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            userObj.headline=req.body.headline;
            userObj.save();
            res.send({username:req.username,headline:userObj.headline});
        }
    });

}

function getHeadline(req,res){
    let user = req.params.user? req.params.user : req.username;
    Profile.findOne({username:user},  function(err,userObj) {
        res.send({username:user, headline: userObj.headline});
    })	
}

function getEmail(req,res){
	let user = req.params.user? req.params.user : req.username;
    Profile.findOne({username:user},  function(err,userObj) {
        res.send({username:user, email: userObj.email});
    })  
}

function putEmail(req,res){
    Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            userObj.email=req.body.email;
            userObj.save();
            res.send({username:req.username,email:userObj.email});
        }
    });
}

function getDob(req,res){
	let user = req.params.user? req.params.user : req.username;
    Profile.findOne({username:user},  function(err,userObj) {
        res.send({username:user, dob: userObj.dob});
    })  
}

function putDob(req,res){
    Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            userObj.dob=req.body.dob;
            userObj.save();
            res.send({username:req.username,dob:userObj.dob});
        }
    });
}

function getZipcode(req,res){
	let user = req.params.user? req.params.user : req.username;
    Profile.findOne({username:user},  function(err,userObj) {
        res.send({username:user, zipcode: userObj.zipcode});
    })  
}

function putZipcode(req,res){
	Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            userObj.zipcode=req.body.zipcode;
            userObj.save();
            res.send({username:req.username,zipcode:userObj.zipcode});
        }
    });
}

function getAvatar(req,res){
	let user = req.params.user? req.params.user : req.username;
    Profile.findOne({username:user},  function(err,userObj) {
        if (!userObj.avatar){
            res.send({username:user, avatar: 'https://static.toiimg.com/thumb/msid-67586673,width-800,height-600,resizemode-75,imgsize-3918697,pt-32,y_pad-40/67586673.jpg'})
        } else {
            res.send({username:user, avatar: userObj.avatar});
        }
    })  
}

function putAvatar(req,res){
	Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            userObj.avatar=req.body.avatar;
            userObj.save();
            res.send({username:req.username,avatar:userObj.avatar});
        }
    });
}

function getPhone(req,res){
    let user = req.params.user? req.params.user : req.username;
    Profile.findOne({username:user},  function(err,userObj) {
        res.send({username:user, phone: userObj.phone});
    })  
}

function putPhone(req,res){
    Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            userObj.phone=req.body.phone;
            userObj.save();
            res.send({username:req.username,phone:userObj.phone});
        }
    });
}

module.exports = (app) => {
	app.get('/headline/:user?',getHeadline);
	app.put('/headline',putHeadline);
	app.get('/email/:user?',getEmail);
	app.put('/email',putEmail);
	app.get('/dob/:user?',getDob);
    app.put('/dob',putDob);
	app.get('/zipcode/:user?',getZipcode);
	app.put('/zipcode',putZipcode);
	app.get('/avatar/:user?',getAvatar);
	app.put('/avatar',putAvatar);
    app.get('/phone/:user?',getPhone);
    app.put('/phone',putPhone);
}