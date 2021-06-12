const express = require('express');
const mongoose = require('mongoose');
const app = express();
const auth = require('./Route/users_router');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
		useNewUrlParser: true,
	})
);
app.use(cors());
mongoose
//	.connect('mongodb+srv://poornatha:poornatha@01@cluster0.oprt7.mongodb.net/lms?retryWrites=true&w=majority')
.connect(
		'mongodb://poornatha:poornatha%4001@cluster0-shard-00-00.oprt7.mongodb.net:27017,cluster0-shard-00-01.oprt7.mongodb.net:27017,cluster0-shard-00-02.oprt7.mongodb.net:27017/lms?ssl=true&replicaSet=atlas-rdityo-shard-0&authSource=admin&retryWrites=true&w=majority',
		{ useNewUrlParser: true , useUnifiedTopology: true} 
	)
	.then(() => console.log('Connected to Mongo DB'))
	.catch((err) => console.error('Could not connect to MongoDB', err));

const port = process.env.PORT | 10000;
console.log('Listening on Port:', port);

app.get('/Home', (req, res) => {
	res.send('Home Page Loaded');
});

app.use('/auth',auth );

app.get('/', (req, res) => {
	res.send('No routes called');
	console.log('Server Started at Port:', { port });
}).listen({ port });
