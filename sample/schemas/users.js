var mongoose = require('mongoose');

/* Implementation */   
var Schema = mongoose.Schema;

var Users = function() {
  var self = this;
  this.schema = new Schema({
    name:  {type: String},
    
  });
  this.model = mongoose.model('users', this.schema);
  
  return this.model;
};
module.exports = Users;