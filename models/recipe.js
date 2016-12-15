var mongoose = require('mongoose');
var username = require('../routes/auth');

var recipeSchema = new mongoose.Schema({
  dish: String,
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
