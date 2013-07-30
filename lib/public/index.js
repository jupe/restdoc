$(function () {
  
  var sidebar;
  var docurl = '/doc';
  var apiurl = '/routes.json';
  var api;
  
  var get = function(url, cb){
     $.ajax({ 
      url: url, 
      dataType: 'text', 
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

  $('#layout').w2layout({
      name: 'layout',
      panels: [
          { type: 'left', size: 250, resizable: true, style: 'background-color: #F5F6F7;', content: '<div id="sidebar" style="height: 100%; width: 100%;"></div>' },
          { type: 'top',  size: 50, style: 'background-color: #F5F6F7; padding: 5px;', content: '<div id="title">RestDoc</div>' },
          { type: 'main', style: 'background-color: #F5F6F7; padding: 5px;', content: ''  },
          { type: 'bottom', style: 'background-color: #F5F6F7; height: 25px; text-align: right', content: '<div id="bottom" style="font-size: 12px;"><a href="http://github.com/jupe/restdoc">RestDoc 0.1.0</a></div>'  }
      ]
  });
  
  var generateBody = function(details){
    return ;
  }
  
  var getResourceDescription = function( resource, cb){
    var converter = new Showdown.converter(/*{ extensions: 'twitter' }*/);
    get( docurl+resource+'.md', function(error, md) {
      if(error) cb(error);
      else cb( null, converter.makeHtml(md) );
    });
  }
  var getResourceModel = function( resource, cb){
    getJSON( docurl+'/model'+resource+'.json', cb);
  }
  var getResourceMethod = function( resource, method, cb){
    var converter = new Showdown.converter(/*{ extensions: 'twitter' }*/);
    get( docurl+resource+'.'+method+'.md', function(error, md) {
      if(error) cb(error);
      else cb( null, converter.makeHtml(md) );
    });
  }
  var generateResourceOverview = function( id, cb ){
    getResourceDescription(w2ui['sidebar'].get(id).resource, cb);
  }
  var generatePathOverview = function( div, details)
  {
    var body = JSON.stringify(details);
    body  = '<h1>'+details.method.toUpperCase() + ' ' + details.path+'</h1>';
    body += '<h2>Keys</h2>';
    for(var i=0;i<details.keys.length;i++){
      body += '<ul>'+details.keys[i].name+'</ul>';
    }
    body += '<h2>Params</h2>';
    for(var i=0;i<details.params.length;i++){
      body += '<ul>'+details.keys[i].name+'</ul>';
    }
    div.html( body );
    /*
    var body = '<div id="grid" style="height: 450px"></div>';
    div.html(body);
    $('#grid').w2grid({ 
      name: 'grid', 
      columns: [				
        { field: 'path', caption: 'Path', size: '30%' },
        { field: 'method', caption: 'Method', size: '30%' }
      ],
      records: [
        { recid: 1, path: details.path, method: details.method }
      ]
    });
    */
  }
  
  var generateModel = function( div, id)
  {
    
    getResourceModel(  w2ui['sidebar'].get(id).resource, function(error, model){
      var body = '<pre id="editor">';
      //body += 'TEST';
      body += JSON.stringify(model.paths, null, "\t");
      body += '</pre>';
      div.html(body);
      var editor = ace.edit("editor");
      editor.setReadOnly(true);
      editor.setTheme("ace/theme/twilight");
      editor.getSession().setMode("ace/mode/javascript");
    });
  }
  var onClickResource = function(sidebaritem) {
    var body = 'There is no documentation for this section. You can create it by create new file "'+docurl+sidebaritem.resource+'.md"  -file.'
    w2ui['layout'].content('main', body);
    generateResourceOverview(sidebaritem.id, function(error, body){
        w2ui['layout'].content('main', body);
      });
  }
  var onClickMethod = function(sidebaritem) {
    
    getResourceMethod( sidebaritem.resource, sidebaritem.method, function(error, md){
      if(error){
        var body = 'There is no documentation for this section. You can create it by create new file "'+docurl+sidebaritem.resource+'.'+sidebaritem.method+'.md"  -file.'
        w2ui['layout'].content('main', body);
      } else {
        w2ui['layout'].content('main', md);
      }
    });
  }
  var onClickPath = function(sidebaritem) {
    var details = getDetailsById(sidebaritem.id);
    if(!details) return;
    
    w2ui['layout'].content('main', '<div id="tabs" style="width: 100%;"></div><div id="selected-tab" style="padding: 10px 0px"></div>');
    $('#tabs').w2tabs({
      name: 'tabs',
      tabs: [
        { id: 'tab_overview', caption: 'Overview' },
        { id: 'tab_model', caption: 'Model' },
        { id: 'tab_resp', caption: 'Try' }
      ],
      onClick: function (target, data) {
        $().w2destroy('grid');
        $('#selected-tab').html('');
        switch(target){
          case('tab_overview'): generatePathOverview( $('#selected-tab'), details); break;
          case('tab_model'): generateModel( $('#selected-tab'), sidebaritem.id);
          default: 
          break;
        }
      }
    });
    
    w2ui['tabs'].doClick('tab_overview')
  }
  var onClick = function(id, data) {
    var body;
    
    $().w2destroy('grid');
    $().w2destroy('tabs');
    var sidebaritem = w2ui['sidebar'].get(id);
    switch( sidebaritem.type ) {
      case('resource'): onClickResource(sidebaritem); break;
      case('method'): onClickMethod(sidebaritem); break;
      case('path'): onClickPath(sidebaritem); break;
      default: break;
    }
  }
  
  
  RestDoc(docurl+apiurl, function(error, api){
    
    if(error){
      w2ui['layout'].content('main', JSON.stringify(error) );
      return;
    }
    w2ui['layout'].content('top', '<div id="title">'+api.title+'</div>');
    
    parentNodes = api.generateSideBarNodes();
    sidebar = $('#sidebar').w2sidebar({
      topHTML    : '<div style="background-color: #eee; padding: 10px 5px; border-bottom: 1px solid silver;">Resources</div>',
      //bottomHTML : '<div style="background-color: #eee; padding: 10px 5px; border-top: 1px solid silver">Resources</div>',
      name: 'sidebar',
      nodes: parentNodes,
      //onExpand: onExpand,
      onClick: onClick
    });
  });
});