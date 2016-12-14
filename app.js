var express = require('express');
var app = express();
var server  = require('http').createServer(app);
var port    = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Recipe = require('./models/recipe');
var User = require('./models/user')

mongoose.connect('mongodb://localhost/project2');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'This is a secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})



var recipes = [
  // { name: 'Ham' },
  // { name: 'Macarroni' },
  // { name: 'Deviled Eggs' }
];



app.get('/', function(req, res) {
  res.render('main.ejs', { title: 'Potluck' });
});


// Index- show all recipes
app.get('/recipes', function(req, res) {
  //Get all recipes from database
  Recipe.find({}, function(err, allRecipes) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {recipes: allRecipes});
    }
  });
});


//Create- add new recipe to DB
app.post('/recipes', isLoggedIn, function(req, res) {
  // Get data from form and add to recipes array
  var dish = req.body.dish;
  var name = req.body.name;
  var newRecipe = {dish: dish, name: name}
  //Create a new recipe and save to database
  Recipe.create(newRecipe, function(err, newlyCreated) {
    if(err) {
      console.log(err);
      } else {
        // Redirect back to recipes page
        res.redirect('/recipes');
      }
    });
  });


// New Recipe Form
app.get('/recipes/new', function(req, res) {
  res.render('new');
});


//Show more informtation about one recipe
app.get('/recipes/:id', function(req, res) {
 Recipe.findById(req.params.id, function( err, foundRecipe) {
    if(err) {
      console.log(err);
    } else {
      res.render('show', {recipes: foundRecipe});
    //console.log('banana');
    }
  });
});

function quit() {
  mongoose.disconnect();
  console.log('Quitting!');
}

// AUTH ROUTES

//Show register form
app.get('/register', function(req, res){
  res.render('register');
});

//Handle signup logic
app.post('/register', function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/recipes');
    });
  });
});

//handling login logic
app.post('/login', passport.authenticate('local',
  {successRedirect: '/recipes',
  failureRedirect: '/login'
  }), function(req, res) {
});

//Show login form
app.get('/login', function(req, res) {
  res.render('login');
});

//logout router
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/recipes');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.listen(port);
  console.log("Server up and running on " + port);

console.log('Server started on ' + port);
