var express = require('express');
var app = express();
var server  = require('http').createServer(app);
var port    = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Recipe = require('./models/recipe');
var User = require('./models/user');

//Requiring routes
var recipeRoutes = require('./routes/recipes');
var authRoutes = require('./routes/auth')


// Connect to database
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect('mongodb://localhost/express-movies');
}
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
  }
);
mongoose.connection.once('open', function() {
  console.log("Mongoose has connected to MongoDB!");
});

//mongoose.connect('mongodb://localhost/project2');


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

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



app.use(authRoutes);
app.use(recipeRoutes);

app.listen(port);
  console.log("Server up and running on " + port);

console.log('Server started on ' + port);

// function quit() {
//   mongoose.disconnect();
//   console.log('Quitting!');
// }
