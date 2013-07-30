/** 
  RESTFUL DOCUMENTATION GENERATOR FOR EXPRESSJS
*/
var express = require('express');


var RestDoc = function(_app, url, title, mongoose){
  var self = this;
  if( !title ) title = "RestDoc";
  this.url = url;
  var modelNames = [];
  if( mongoose ) {
    modelNames = mongoose.modelNames();
    var findModel = function(modelName){
      for(var i=0;i<modelNames.length;i++){
        console.log(modelNames[i]);
        if( modelNames[i] === modelName ) {
          return mongoose.model(modelName);
        }
      }
    }
    _app.get(url+'/model.json', function(req, res){
      res.json(modelNames);
    });
    _app.get(url+'/model/:model.json', function(req, res){
      var model = findModel(req.params.model);
      if( model ) {
        res.json( model.schema );
      } else res.json(404, {error: 'Model not found'});
    });
  }
  
  //_app.use(url, express.static(__dirname + '/public'));  //this line need to be app configuration
  
  _app.use( url, express.directory(__dirname + '/public') );
  _app.get(url+'/routes.json', function(req, res){
    res.json( {title: title, routes: req.app.routes, __dirname: __dirname} );
  });
}

module.exports = RestDoc;