var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Cars = function() {
  var self = this;
  this.schema = new Schema({
    model: {type: String}
  });
  this.model = mongoose.model('cars', this.schema);
  
  return model;
}
module.exports = Cars;