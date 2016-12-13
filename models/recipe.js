var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
  dish: String,
  name: String,

});

module.exports = mongoose.model('Recipe', recipeSchema);
