! IMPLEMENTATION ONGOING - NOT READY YET !

restdoc
=======

![Page] (screenshots/page.png)

Node.js library for expressjs RESTful app API documentation.

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
