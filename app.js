var express = require('express');
var app = express();
var server  = require('http').createServer(app);
var port    = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/project2');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


var recipeSchema = new mongoose.Schema({
  name: String
});

var Recipe = mongoose.model('Recipe', recipeSchema);


var recipes = [
  { name: 'Ham' },
  { name: 'Macarroni' },
  { name: 'Deviled Eggs' }
];


app.get('/', function(req, res) {
  res.render('main.ejs', { title: 'Potluck' });
});


// Index
app.get('/recipes', function(req, res) {
  //Get all recipes from database
  Recipe.find({}, function( err, allRecipes) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {recipes: allRecipes});
    }
  });
});

//Create
app.post('/recipes', function( req, res) {
  // Get data from form and add to recipes array
  var name = req.body.name;
  var newRecipe = {name: name}
  //Create a new recipe and save to database
  // Recipe.create(newRecipe, function(err, newlyCreated) {
  //   if(err) {
  //     console.log(err);
  //     } else {
  //       // Redirect back to recipes page
  //       res.redirect('/recipes');
  //     }
  //   });
  });


// New Recipe Form
app.get('/recipes/new', function(req, res) {
  res.render('new');
})


//Show more informtation about one recipe
app.get('/recipes/:id', function(req, res) {
  Recipe.findById(req.params.id, function( err, foundRecipe) {
    if(err) {
      console.log(err);
    } else {
      //res.render('partials/show' {recipes: foundRecipe});
    console.log(banana);
    }
  });
});

function quit() {
  mongoose.disconnect();
  console.log('Quitting!');
}

app.listen(port);
  console.log("Server up and running on " + port);

console.log('Server started on ' + port);
