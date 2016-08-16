//INITIATING INFORMATION
// Require the Express Module
var express = require ("express");
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Require path
var path = require("path");
// will need it for databse connection
var mongoose = require ('mongoose');

//FOLDER STRUCTURE
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Integrate body-parser with our App
app.use(bodyParser.urlencoded());
// app.use(bodyParser.urlencoded({extended:true}));

//DATABASE CONNECTION
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
// (plural for collection names and singular for model names)
//Note: If you connect to a database that doesn't exist, mongoose WILL create the DB for you!
mongoose.connect('mongodb://localhost/basic_mongoose');


//CREATE SCHEMA
var UserSchema = new mongoose.Schema({
 name: String,
 age: Number
})
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

//ROUTES
//Root request
app.get('/', function (req, res){
	// This is where we will retrieve the users from the database and include them in the view page we will be rendering.
	res.render("index");
});

// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
  	// create a new User with the name and age corresponding to those from req.body
  	var user = new User({name: req.body.name, age: req.body.age});
  	// Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  	user.save(function(err) {
    // if there is an error console.log that something went wrong!
	    if(err) {
	      console.log('something went wrong');
	    } else { // else console.log that we did well and then redirect to the root route
	      console.log('successfully added a user!');
	      res.redirect('/');
	    }
  });
});


//this is for the server to listen, it is good to give it name to use it later
var server =app.listen(8000, function(){
	//good practice to let the user know what port to listen to
	console.log("listening on 8000");
});

// // this is a new line we're adding AFTER our server listener
// // variable. Unless we have the server variable, this line will not work!!
// var io = require('socket.io').listen(server);
// var count = 0;
// //The server listeting/heard the client request
// io.sockets.on('connection', function(socket){
// 	console.log("I am server and I heard you client");
//   	console.log(socket.id);
//  	//all socket code goes here!!


// })