var express = require('express');
http = require('http');
require('express-resource');
var emr =require('express-mongoose-resource');

var mongoose = require('mongoose');
var restdoc = require('../');

var app = express();


// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/restdoc');
 
var models = [
  require('./schemas/users')(),
  require('./schemas/messages')(),
  require('./schemas/groups')(),
  require('./schemas/houses')(),
  require('./schemas/sticks')(),
  require('./schemas/cars')(),
]; 

 
app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  
  app.use( '/', express.static(__dirname + '/public') );
  app.use( '/doc', express.static(__dirname + '/../lib/public') );
  
  //app.use(require('stylus').middleware(__dirname + '/public'));
  //app.use(express.static(path.join(__dirname, 'public')));
});

models.forEach( function(model) {
  
  var dCtrl = new emr.ModelController(app,null,model,{trace:false});
  dCtrl._register_schema_action();
  var res = app.resource(dCtrl.name,dCtrl.getExpressResourceActions(),{model: model});
  dCtrl.resource = res;
  
});
restdoc(app, '/doc', 'RESTDOC');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});