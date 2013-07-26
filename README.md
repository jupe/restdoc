! IMPLEMENTATION ONGOING - NOT READY YET !

restdoc
=======

Node.js library for expressjs RESTful app API documentation. Library uses directly app.routes, so it should be allways up to date!
All resources can be documented as well as methods (GET/POST/PUT/DELETE) and paths. Documentation files goes under /public/doc/ -folder this way ->

 * :resource.md   Resource doc
 * :resource.GET.md   Resource GET method doc
 * :resource.POST.md   Resource POST method doc
 * :resource.PUT.md   Resource PUT method doc
 * :resource.DELETE.md   Resource DELETE method doc
 * :resource.json   Resource model structure.

See more from sample -application with restdoc.
 
![Page] (screenshots/page.png)

License
-------
MIT - see LICENSE - file.

Usage
-----
```
var express = require('express'),
    restdoc = require('restdoc');


var app = express();
app.configure(function(){
  ....
  app.use( '/doc', express.static(__dirname + '/node_modules/restdoc/lib/public') );
  ...
  routes
  ...
});

restdoc(app, '/doc', 'DOC TITLE');
app.listen();
```
