var express = require('express');
var router = express.Router();
var Recipe = require('../models/recipe');
var methodOverride = require('method-override');

var recipes = [];








// Index- show all recipes
router.get('/recipes', function(req, res, next) {
  var recipes = []
  //Get all recipes from database
  Recipe.find({}).populate('user')
  .then(function(allRecipes) {
    res.render('index', {recipes: allRecipes});
  })
  .catch(function(err) {
    return next(err);
  });
});





//Create- add new recipe to DB
router.post('/recipes', isLoggedIn, function(req, res) {
  // Get data from form and add to recipes array
  var dish = req.body.dish;
  var name = req.body.name;
  var description = req.body.description;
  var newRecipe = {
    user: req.user,
    dish: dish,
    name: name,
    description: description
  };

  //Create a new recipe and save to database
  Recipe.create(newRecipe, isLoggedIn, function(err, newlyCreated) {
    if(err) {
      console.log(err);
      } else {
        res.redirect('/recipes');
      }
    });
  });

  //EDIT RECIPE ROUTE
router.get('/recipes/:id/edit', function(req, res, next) {
  Recipe.findById(req.params.id, function(err, foundRecipe) {
    if(err) {
      res.redirect('/recipes')
    } else {
      res.render('./edit', {recipe: foundRecipe});
    }
  });
});

//UPDATE RECIPE ROUTE
router.put('/recipes/:id', function(req, res, next) {
  //find and update the correct recipe
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe) {
    if(err) {
      res.redirect('/recipes');
    } else {
      res.redirect('/recipes/' + req.params.id);
    }
  });
});

//DESTROY RECIPE ROUTE
router.delete('/recipes/:id', function(req, res) {
  Recipe.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect('/recipes');
    } else {
      res.redirect('/recipes');
    }
  });
});



// New Recipe Form
router.get('/recipes/new', function(req, res, next) {
  res.render('new.ejs');
});


//Show more informtation about one recipe
router.get('/recipes/:id', isLoggedIn, function(req, res, next) {
  console.log('req.params.id:', req.params.id);
 Recipe.findById(req.params.id).populate('user')
 .then(function(foundRecipe) {
    res.render('show', {recipe: foundRecipe});
  })
  .catch(function(err) {
    return next(err);
  });
});

//Middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
