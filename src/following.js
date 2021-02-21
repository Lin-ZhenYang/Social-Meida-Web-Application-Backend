const mongoose = require('mongoose');
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('Profile',profileSchema);
const connectionString = 'mongodb+srv://lzymdb:lzymdbmima@cluster0.2zfoz.mongodb.net/social_web_backend_db?retryWrites=true&w=majority';
mongoose.connect(connectionString,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true}); 

function getFollowers(req,res){
	let user = req.params.user? req.params.user : req.username;
	Profile.findOne({username:user},  function(err,userObj) {
        res.send({username:user, following: userObj.followed});
    })	
}

function addFollower(req,res){
	Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
            Profile.findOne({username:req.params.user},function(err,followerObj){
                if (err){
                    console.log(err);
                } else {
                    if (followerObj == null || req.params.user == req.username){
                        res.send({username:req.username,following:userObj.followed, notfound:"notfound"});
                    } else {
                        if (!userObj.followed.includes(req.params.user)){
                            userObj.followed.push(req.params.user);
                            userObj.save();
                        }
                        res.send({username:req.username,following:userObj.followed});
                    }
                }
            })
        }
    });
}

function deleteFollower(req,res){
	Profile.findOne({username:req.username},function(err,userObj) {
        if (err){
            console.log(err);
        } else {
			userObj.followed = userObj.followed.filter(follower => follower!=req.params.user)
            userObj.save();
            res.send({username:req.username,following:userObj.followed});
        }
    });
}

module.exports = (app) => {
	app.get('/following/:user?',getFollowers);
	app.put('/following/:user',addFollower);
	app.delete('/following/:user',deleteFollower);
}