const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://lzymdb:lzymdbmima@cluster0.2zfoz.mongodb.net/social_web_backend_db?retryWrites=true&w=majority';
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('Profile',profileSchema);

const commentSchema = new mongoose.Schema({
	commentId: Number,
	author: String,
	date: Date,
	body: String
})

const articleSchema = new mongoose.Schema({
	author: String,
	text: String,
	date: Date,
	image: String,
	comments: [commentSchema]
})

const Comment = mongoose.model('Comment',commentSchema);
const Article = mongoose.model('Article',articleSchema);


function getArticles(req,res){
	if (req.params.id){
		Article.findById(req.params.id, function(err,doc){
			if (doc){
			    res.send({articles:doc});
			} else{
				Article.find({author: req.params.id}, function(err,docs){
					if (docs){
					    res.send({articles:docs});
					}
				})

			}
		})

	} else{
		Profile.findOne({username:req.username},  function(err,userObj) {
			let usersToQuery = [req.username, ...userObj.followed];
			Article.find({author: usersToQuery}).sort('-date').limit(10).exec(function(err,docs){
				res.send({articles:docs});
			});
        })	
	}
}

function putArticles(req,res){
	mongoose.connect(connectionString,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true}); 
    Article.findOne({_id:req.params.id},function(err,articleObj){
    	if (err){
    		console.log(err);
    	} else {
    		if (articleObj){
				if (!req.body.commentId){
					if (articleObj.author != req.username){
						res.send("NOT OWNED");
					} else{
						articleObj.text = req.body.text;
					    articleObj.save();
					    res.send({articles:[articleObj]});
					}
				} else{
					if (!articleObj.comments){
						articleObj.comments=[];
					}
					if (req.body.commentId == -1){
						var newComment = new Comment({author:req.username,date:new Date(),body:req.body.text});
						articleObj.comments.push(newComment);
						articleObj.save();
						res.send({articles:[articleObj]});
					} else {
						articleObj.comments.forEach( comment => {
							if (comment.id==req.body.commentId){
								if (comment.author == req.username){
									comment.body = req.body.text;
									articleObj.save();
									res.send({articles:[articleObj]});
								} else{
									res.send("NOT OWNED");
								}
							}
						})
					}

				}
			
    		} else {
    			res.send("NOT FOUND");
    		}

    	}
    })
}

function postArticle(req,res){
	let currTime = new Date();
	var newArticle = new Article({author:req.username,date: currTime, text:req.body.text, image:req.body.image});
	newArticle.save();
	let msg = {articles:[newArticle]};
    res.send(msg);
}
module.exports = (app) => {
	app.get('/articles/:id?',getArticles);
	app.put('/articles/:id',putArticles);
	app.post('/article',postArticle);
}