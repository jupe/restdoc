var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Messages = function() {
  var self = this;
  this.schema = new Schema({
    msg: {type: String}
  });
  this.model = mongoose.model('messages', this.schema);
  
  return model;
}
module.exports = Messages;