//INITIATING INFORMATION
// Require the Express Module
var express = require ("express");
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Require path
var path = require("path");
//need it for the db connection
var mongoose = require('mongoose');
//Mike was using this to troubleshoot that working in the correct file
//console.log("this is my server");

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
mongoose.connect('mongodb://localhost/quote_mongoose');

//CREATE SCHEMA aka create db
var QuoteSchema = new mongoose.Schema({
 name: String,
 quote: String,
 date: { type: Date, default: Date.now } //creatimng a date type and assigning a default current value to it
})
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'Quote'
var Quote = mongoose.model('Quote');

//ROUTES
//Root request
app.get('/', function (req, res){
	// This is where we will retrieve the users from the database and include them in the view page we will be rendering.
	res.render("index");
});

// Add the new qoutes Request 
app.post('/quote', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    //I need to create a new object to use it to insert into a database - it can be doen with out it as well, but would be very hard
    //I need a new because creating a new object.
    //var quote = new Quote ({name: req.body.name, quote: req.body.quote });
    var quote = new Quote ({name: req.body.name, quote: req.body.quote});
    console.log(quote);

    quote.save(function(err){
    	if (err){
    		console.log("something went wrong");
    	}
    	else {
    		console.log("record is added to db");
    		res.redirect('/');
    	}
    });
    
});

app.get('/quotes', function(req, res){
	var quotee = new Quote();
	Quote.find({}, function (err, quotee){
		if (err){
			console.log("Could not retrive the data");
		}
		else{
		console.log("Able to read data.");
		console.log(quotee);
		console.log(quotee.name);
		//console.log(quotee.quote);
		// console.log(quote.date);
		res.render("quotes", {quotes:quotee});
		}
	});

	// res.render("quotes", {quotes:quotee});
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