$(function () {
  
  var sidebar;
  var docurl = '/doc';
  var apiurl = '/routes.json';
  var api;

  $('#layout').w2layout({
      name: 'layout',
      panels: [
          { type: 'left', size: 250, resizable: true, style: 'background-color: #F5F6F7;', content: '<div id="sidebar" style="height: 730px; width: 250px;"></div>' },
          { type: 'top',  size: 50, style: 'background-color: #F5F6F7; padding: 5px;', content: '<div id="title">RestDoc</div>' },
          { type: 'main', style: 'background-color: #F5F6F7; padding: 5px;', content: ''  }
      ]
  });
  
  var generateBody = function(details){
    return ;
  }
  
  var getResourceDescription = function( resource, cb){
    var converter = new Showdown.converter(/*{ extensions: 'twitter' }*/);
    $.get( docurl+resource+'.md', function(md) {
      cb( converter.makeHtml(md) );
    });
  }
  var getResourceModel = function( resource, cb){
    $.getJSON( docurl+resource+'.json', null, cb);
  }
  var getResourceMethod = function( resource, method, cb){
    var converter = new Showdown.converter(/*{ extensions: 'twitter' }*/);
    $.get( docurl+resource+'.'+method+'.md', function(md) {
      cb( converter.makeHtml(md) );
    });
  }
  var generateResourceOverview = function( id, cb ){
    getResourceDescription(w2ui['sidebar'].get(id).resource, cb);
  }
  var generatePathOverview = function( div, details)
  {
    div.html( JSON.stringify(details) );
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
    
    getResourceModel(  w2ui['sidebar'].get(id).resource, function(model){
      var body = '<pre id="editor">';
      //body += 'TEST';
      body += JSON.stringify(model, null, "\t");
      body += '</pre>';
      div.html(body);
      var editor = ace.edit("editor");
      editor.setTheme("ace/theme/twilight");
      editor.getSession().setMode("ace/mode/javascript");
    });
  }
  var onClickResource = function(sidebaritem) {
    var body = 'There is no documentation for this section. You can create it by create new file "'+docurl+sidebaritem.resource+'.md"  -file.'
    w2ui['layout'].content('main', body);
    generateResourceOverview(sidebaritem.id, function(body){
        w2ui['layout'].content('main', body);
      });
  }
  var onClickMethod = function(sidebaritem) {
    var body = 'There is no documentation for this section. You can create it by create new file "'+docurl+sidebaritem.resource+'.'+sidebaritem.method+'.md"  -file.'
    w2ui['layout'].content('main', body);
    getResourceMethod( sidebaritem.resource, sidebaritem.method, function(md){
        w2ui['layout'].content('main', md);
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
        { id: 'tab_req', caption: 'Request' },
        { id: 'tab_resp', caption: 'Response' },
        { id: 'tab_model', caption: 'Model' },
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
  
  
  RestDoc(docurl+apiurl, function(api){
    
    w2ui['layout'].content('top', '<div id="title">'+api.title+'</div>');
    
    parentNodes = api.generateSideBarNodes();
    sidebar = $('#sidebar').w2sidebar({
      topHTML    : '<div style="background-color: #eee; padding: 10px 5px; border-bottom: 1px solid silver">Resources</div>',
      //bottomHTML : '<div style="background-color: #eee; padding: 10px 5px; border-top: 1px solid silver">Resources</div>',
      name: 'sidebar',
      nodes: parentNodes,
      //onExpand: onExpand,
      onClick: onClick
    });
  });
});