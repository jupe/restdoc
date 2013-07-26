var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Sticks = function() {
  var self = this;
  this.schema = new Schema({
    name: {type: String}
  });
  this.model = mongoose.model('sticks', this.schema);
  
  return model;
}
module.exports = Sticks;