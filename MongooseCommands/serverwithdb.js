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
  })
});

// CREATE A SCHEMA for Users
var UserSchema = new mongoose.Schema({
 name: {type: String},
 age: {type: Number}
}, {timestamps: true})
// Store the Schema under the name 'User'
mongoose.model('User', UserSchema);
// Retrieve the Schema called 'User' and store it to the variable User
var User = mongoose.model('User');

//FIND ALL users
// Using the User Schema...
// ...retrieve all records matching {}
User.find({}, function(err, users) {
 // Retrieve an array of users
 // This code will run when the DB is done attempting to retrieve all matching 
 //records to {}
});

// FIND ALL BASED ON REQUIRMENT
// ...retrieve all records matching {name:'Jessica'}
User.find({name:'Jessica'}, function(err, user) {
 // Retrieve an array of users matching the name. Even if 1 record is found, 
 //the result will be an array the size of 1, with 1 object inside. 
 //(Notice, if we are expecting to retrieve one record, we may want to use findOne 
 // and retrieve the object as oppose to an array the size of one.
 // This code will run when the DB is done attempting to retrieve all matching records 
 //to {name:'Jessica'}
})
//FIND ONE
// ...retrieve 1 record (the first record found) matching {} 
User.findOne({}, function(err, user) {
 // Retrieve 1 object
 // This code will run when the DB is done attempting to retrieve 1 record.
})

// sam[ple user
// ...create a new instance of the User Schema and save it to the DB.
var userInstance = new User()
userInstance.name = 'Andriana'
userInstance.age = 29
userInstance.save(function(err){
 // This code will run when Mongo has attempted to save the record.
 // If (err) exists, the record was not saved, and (err) contains validation errors.
 // If (err) does not exist (undefined), Mongo saved the record successfully.
})

//DELETE ALL users
// ...delete all records of the User Model
User.remove({}, function(err){
 // This code will run when the DB has attempted to remove all matching records to {}
})

//DELETE One user
// ...delete 1 record by a certain key/vaue.
User.remove({_id: 'insert record unique id here'}, function(err){
 // This code will run when the DB has attempted to remove all matching records to {_id: 'insert record unique id here'}
})
//UPDATE
// ...update any records that match the query
User.update({name:'Andrinnna'}, {name:'Andriana'}, function(err){
 // This code will run when the DB has attempted to update the matching record.
})
// another way to update a record
User.findOne({name: 'Andriana'}, function(err, user){
 user.name = 'Andri'
 user.save(function(err){
     // if save was successful awesome!
 })
})



// Associations
//Post Model
var postSchema = new mongoose.Schema({
 text: { type: String, required: true }, 
 _comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, { timestamps: true });
//  notice the _comments property is an array populated with objects.  
//The 'type' property of the object
//  inside of the array is an attribute that tells Mongoose what to look for.


//Comment Model
var commentSchema = new mongoose.Schema({
 // since this is a reference to a different document, the _ is the naming convention!
 _post: {type: Schema.Types.ObjectId, ref: 'Post'},
 text: { type: String, required: true },
}, {timestamps: true });


// Here is how to get the comments for one post:
// just an example route, your routes may look different
app.get('/posts/:id', function (req, res){
// the populate method is what grabs all of the comments using their IDs stored in the 
// comment property array of the post document!
 Post.findOne({_id: req.params.id})
 .populate('comments')
 .exec(function(err, post) {
      res.render('post', {post: post});
        });
});


//Adding a comment
//  just a sample route.  Post request to update a post.
 //  your routes will probably look different.
 app.post('/posts/:id', function (req, res){
    Post.findOne({_id: req.params.id}, function(err, post){
        // data from form on the front end
        var comment = new Comment(req.body);
        //  set the reference like this:
        comment._post = post._id;
        // now save both to the DB
        comment.save(function(err){
                post.comments.push(comment);
                post.save(function(err){
                     if(err) {
                          console.log('Error');
                     } else {
                          res.redirect('/');
                     }
                 });
         });
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