var RestDoc = function(url, cb){
  var self = this;
  this.cache = {}
  this.url = url;
  this.title = 'REST API DOCUMENTATION';
  var getJSON = function(url, cb){
     $.ajax({ 
      url: url, 
      dataType: 'json', 
      type: 'GET',
      timeout: 1500, //1.5 second timeout, 
      success: function(data){
        cb(null, data);
      }, 
      error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
         //do something 
         cb({status: status, jqXHR: jqXHR, errorThrown: errorThrown});
      } 
    }); 
  }
  getJSON(url, function(error, data){
    if(error){
      cb(error);
      return;
    }
    self.cache = data.routes;
    self.title = data.title;
    var i=0, j=0, meth, path;
    for(meth in self.cache){
      i++;
      for(path in self.cache[meth]){
        j++;
        self.cache[meth][path].id = 'node_'+i+'.'+j;
      }
    }
    cb(null, self);
  });
  this.getResource = function(path){
    var i;
    i = path.substr(1).indexOf('/');
    if( i>0 ) return path.substr( 0, i+1 );
    i = path.substr(1).indexOf('.');
    if( i>0 ) return path.substr( 0, i+1 );
    else return path;
  }
  this.getResUrl = function(resource, path){
    var i;
    i = path.indexOf(resource);
    return path.substr( i+resource.length );
  }
  this.getResources = function(){
    var method, path, list = [];
    for(method in self.cache){
      for(path in self.cache[method]){
        resource = getResource(self.cache[method][path].path);
        if( list.indexOf(resource)==-1) list.push(resource);
      }
    }
    return list;
  }
  this.getResourcePaths = function(resource, method){
    var meth, path, res, list = [];
    for(meth in self.cache){
      if(meth === method){
        for(path in self.cache[meth]){
          res = getResource(self.cache[meth][path].path);
          if( res === resource ) {
            list.push(self.cache[meth][path]);
          }
        }
      }
    }
    return list;
  }
  this.getResourceMethods = function(resource){
    var method, path, res, list = [];
    for(method in self.cache){
      for(path in self.cache[method]){
        res = getResource(self.cache[method][path].path);
        if( res === resource ) {
          if(list.indexOf(method)==-1) list.push(method);
        }
      }
    }
    return list;
  }
  this.getDetailsById = function(id){
    for(method in self.cache){
      for(path in self.cache[method]){
        if(self.cache[method][path].id === id ) return self.cache[method][path];
      }
    }
  }
  
  this.generateSideBarNodes = function(){
    console.log(self.cache);
    var resources, parentNodes = [], methodNodes, pathNodes;
    resources = self.getResources();
    var i, j, resource, method, path;
    for(i=0;i<resources.length;i++){
      resource = resources[i];
      methods = self.getResourceMethods(resource);
      methodNodes = [];
      for(j=0;j<methods.length;j++){
        method = methods[j];
        paths = self.getResourcePaths(resource, method);
        pathNodes = [];
        for(k=0;k<paths.length;k++){
          path = paths[k];
          pathNodes.push({ 
              id: path.id, 
              text: path.path,
              resource: resource,
              type: 'path',
              data: path,
              img: 'icon-page' 
          });
        }
        var icon;
        switch(method){
          case('delete'): icon = 'icon-delete'; break;
          case('get'): icon = 'icon-search'; break;
          case('put'): icon = 'icon-save'; break;
          case('post'): icon = 'icon-add'; break;
          default: icon = 'icon-page'; break;
        }
        
        methodNodes.push({ 
            id: 'idxx'+i+'_'+j, 
            text: method.toUpperCase(), 
            method: method.toUpperCase(), 
            nodes: pathNodes,
            type: 'method',
            resource: resource,
            count: pathNodes.length,
            img: icon
        });
      }
      parentNodes.push({
        id: 'resource_'+i,
        text: resource,
        type: 'resource',
        resource: resource,
        nodes: methodNodes,
        img: 'icon-folder', 
        //expanded: false, plus: true, group: true
      });
    }
    return parentNodes;
  }
  
}