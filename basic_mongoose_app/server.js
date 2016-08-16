//INITIATING INFORMATION
// Require the Express Module
var express = require ("express");
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Require path
var path = require("path");
//if not working put it after the app.....
var mongoose = require('mongoose');

//FOLDER STRUCTURE
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Integrate body-parser with our App
app.use(bodyParser.urlencoded());

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
/*Note: If you create a model, mongoose WILL create the appropriate collection in your 
database for you! Even with the appropriate naming (plural for collection names)!
*/



//ROUTES
//Root request
app.get('/', function (req, res){
	// This is where we will retrieve the users from the database and include them in the view page we will be rendering.
	User.find({}, function(err,users){
	// This is the method that finds all of the users from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the users
    // Keep in mind that everything you want to do AFTER you get the users from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error

		if(err) {
	      console.log('something went wrong');
	    } else { // else console.log that we did well and then redirect to the root route
	      console.log('successfully brought back a user!');
	      console.log(users);
	    }
	    //needs to be inside the User.find function
		res.render("index", {users: users});
	});
	

});



// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
 	// create a new User with the name and age corresponding to those from req.body
  	var user = new User({name: req.body.name, age: req.body.age});
  	console.log(user);
  	// Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  	user.save(function(err) {
  	// if there is an error console.log that something went wrong!
  	console.log("I did get here");
	    if(err) {
	      console.log('something went wrong');
	    } else { // else console.log that we did well and then redirect to the root route
	      console.log('successfully added a user!');
	      res.redirect('/');
	    }
     });
    //res.redirect('/');
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