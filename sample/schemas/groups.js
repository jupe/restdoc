var mongoose = require('mongoose');

/* own libraries */  

/* Implementation */   
var Schema = mongoose.Schema;

var Groups = function(){
  var self = this;
  this.schema = new Schema({
    name: {type: String},
    users: [{type: String} ]
  });
  this.model = mongoose.model('groups', schema);
  
  return this.model;
}

module.exports = Groups;
