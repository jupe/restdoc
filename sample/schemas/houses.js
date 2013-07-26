var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Houses = function() {
  var self = this;
  this.schema = new Schema({
    name: {type: String}
  });
  this.model = mongoose.model('houses', this.schema);
  
  return model;
}
module.exports = Houses;