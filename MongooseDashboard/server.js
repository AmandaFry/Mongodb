//INITIATING INFORMATION
// Require the Express Module
var express = require ("express");
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Require path
var path = require("path");
// required for db connection:
var mongoose = require("mongoose");

//FOLDER STRUCTURE
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Integrate body-parser with our App
app.use(bodyParser.urlencoded());


//DATABASE and its components
mongoose.connect('mongodb://localhost/dashboard');
//this way I can see the feedback from the server
// mongoose.set("debug", true);

var DashboardSchema = new mongoose.Schema({
	name: String,
	type: String,
	breed: String,
	color: String,
	age: Number
});

// Setting this Schema in our Models as 'Animal' - creating a the table
mongoose.model('Animal', DashboardSchema);
// We are retrieving this Schema from our Models, named 'Animal' - accessing table
var Animal = mongoose.model('Animal');

//ROUTES
//Root request, display all animals - DONE
app.get('/', function (req, res){
	 Animal.find({}, function(err, animals){
	 	if(err){
	 		console.log("Something went wrong.");
	 	}
	 	else{
	 		console.log("Find all animals were successful.");
	 		//console.log(animals);
	 	}
		res.render("index", {animals: animals});
	 });
});

//displays a form to add a new animal - DONE
app.get('/animal/new', function(req, res){
	console.log('I am /animla.new rout');
	res.render('new');
});

//Display one animal (id has to be last otherwise it will serve it up first and does not look for anything else)
//to get around it make it root/show/:id that way it will the id one more path away the others. 
//I had this above anima/new and it stopped working /new was treated as while card string like any other id
//- DONE
app.get('/animal/:id', function(req, res){
	console.log('I AM in animal/id GET');
	Animal.findOne({_id: req.params.id}, function (err, oneAnimal){
		//console.log("bringing back just one animal", oneAnimal);
		res.render('animal', {animal: oneAnimal});
	});
});


//show a form to edit current animal - DONE
app.get('/animal/:id/edit', function (req,res){
	Animal.findOne({_id: req.params.id}, function (err, editAnimal){
		//console.log("to be edited I am /animla/:id/edit", editAnimal);
		res.render('edit', {animal: editAnimal});
	});
});

//takes the infromation from '/animal/new' and enter it to the db - DONE
app.post('/animal', function(req,res){
	// console.log("post data to input - I am /animal", req.body);
	var animal = new Animal({name: req.body.name, type: req.body.type, breed: req.body.breed, color: req.body.color, age: req.body.age});
	//console.log(animal);
	animal.save(function(err){
		if(err){
			console.log("Something went wrong.");
		}
		else{
			console.log("Animal was successfully inserted to db.");
	 		//console.log(animal);
	 		res.redirect('/');
		}
	});

});

//updated the db from form '/animal/:id/edit' - DONE
app.post('/animal/:id', function(req,res){
	console.log("I AM IN POST animal/:id");
	//first {} is search, {} second is set/update, ()third is callback
	//I need the call back beacuse it will not execute the redirect until it is done. It is like a coffee shop
	//I placed my order, but ht ecahsier will take other orders and once mine doen than I get a call back that my coffee is done.
	Animal.update({_id: req.params.id}, {name: req.body.name, type: req.body.type, breed: req.body.breed,color: req.body.color,age: req.body.age}, function (err, animall){
		if(err){
			console.log("Something went wrong.");
		}
		else{
			console.log("Animal was successfully updated in the db.");
			res.redirect('/animal/'+req.params.id); //this is how I pass id with in routes
		}
	});
});

//delete the selected item from db - DONE
app.post('/animal/:id/destroy', function (req,res){
	//console.log("IM IN THE DESTROY SECTION", {_id: req.params.id});
	Animal.remove({_id: req.params.id}, function(err, animal){
		if(err){
			console.log("Something went wrong.");
		}
		else{
			console.log("Animal was successfully deleted from the db.");
			res.redirect('/');
		}
	});
	
});


//this is for the server to listen, it is good to give it name to use it later
var server =app.listen(8001, function(){
	//good practice to let the user know what port to listen to
	console.log("listening on 8001");
});
