var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe');

var recipes = [];

// Index- show all recipes
router.get('/recipes', function(req, res) {
  var recipes = []
  //Get all recipes from database
  Recipe.find({}, function(err, allRecipes) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {recipes: allRecipes});
    }
  });
});

//var recipes = [];



//Create- add new recipe to DB
router.post('/recipes', isLoggedIn, function(req, res) {
  // Get data from form and add to recipes array
  var dish = req.body.dish;
  var name = req.body.name;
  var newRecipe = {
    user: req.user,
    dish: dish,
    name: name
  };
  // recipes.push(newRecipe);
  // res.redirect('/recipes');
  //Create a new recipe and save to database
  Recipe.create(newRecipe, function(err, newlyCreated) {
    if(err) {
      console.log(err);
      } else {
        // Recipe.create(req.body.recipe, function(err, recipe) {
        //   if(err) {
        //     console.log(err);
        //  } else {
            // Recipe.name.id = req.user._id;
            // Recipe.name.username = req.user.username;
            // Recipe.save();
            // recipes.Recipe.push(recipe);
            // recipes.save();
          //   res.redirect('/recipes');
          // }
      //  })
        // Redirect back to recipes page
        res.redirect('/recipes');
      }
    });
  });


// New Recipe Form
router.get('/recipes/new', function(req, res) {
  res.render('new.ejs');
});


//Show more informtation about one recipe
router.get('/recipes/:id', function(req, res, next) {
  console.log('req.params.id:', req.params.id);
 Recipe.findById(req.params.id).populate('user')
 .then(function(foundRecipe) {
    res.render('show', {recipe: foundRecipe});
  })
  .catch(function(err) {
    return next(err);
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
