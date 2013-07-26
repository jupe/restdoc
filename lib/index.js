/** 
  RESTFUL DOCUMENTATION GENERATOR FOR EXPRESSJS
*/
var express = require('express');


var RestDoc = function(_app, url, title){
  var self = this;
  if( !title ) title = "RestDoc";
  this.url = url;
  
  //_app.use(url, express.static(__dirname + '/public'));  //this line need to be app configuration
  
  _app.use( url, express.directory(__dirname + '/public') );
  _app.get(url+'/routes.json', function(req, res){
    res.json( {title: title, routes: req.app.routes, __dirname: __dirname} );
  });
}

module.exports = RestDoc;