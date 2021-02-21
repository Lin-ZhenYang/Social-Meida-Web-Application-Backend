const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const profile = require('./src/profile');
const following = require('./src/following');
const auth = require('./src/auth');
const articles = require('./src/articles');
const upCloud = require('./src/uploadCloudinary.js');

const hello = (req, res) => res.send({ hello: 'world' });

let corsOption={
	origin:true,
	credentials:true,
	optionsSuccessStatus:200
}
const cors = require("cors");

const enableCORS = (req,res,next) => {
	res.header('Access-Control-Allow-Origin',req.headers.origin);
	res.header('Access-Control-Allow-Credentials',true);
	res.header('Access-Control-Allow-Headers','Authorization, Content-Type, Origin, X-Requested-With');
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id');
	if (req.method == 'OPTIONS')
    {
        res.sendStatus(200);
    }
    else{
        next();
    }
}

const app = express();
app.use(cookieParser());
app.use(enableCORS);
app.use(bodyParser.json());
app.use(cors(corsOption));
app.get('/', hello);

auth(app);
upCloud.setup(app);
profile(app);
following(app);
articles(app);
// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});