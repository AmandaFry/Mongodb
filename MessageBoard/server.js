var mongoose = require('mongoose');
var express  = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(8000,function(){
	console.log("Server is listening an 8000");
});

var io = require('socket.io').listen(server);


mongoose.connect('mongodb://localhost/messageBoard');
var Schema = mongoose.Schema; 
//var Schema = new mongoose.Schema;

var messageSchema = new mongoose.Schema({
	name: {type: String, required: true},
	message: {type: String, required: true},
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]

},{timestamps: true});

mongoose.model('Message', messageSchema);

var CommentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	message: {type: String, required: true},
	// _message: [{type: Schema.Types.ObjectId, ref: 'Message'}]
	_message: {type: Schema.Types.ObjectId, ref: 'Message'}
	
},{timestamps: true});

mongoose.model(CommentSchema, 'Comment');


app.get('/', function(req, res){
	res.render('index');
});

app.post('/create_message', function(req,res){
	res.json(req.body);
});

app.post('/create_comment', function(req,res){
	res.json(req.body);
});

