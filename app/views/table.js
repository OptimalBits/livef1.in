define(['gnd'], function(Gnd){
'use strict';

//
// columns = [{header:'name', field:'field', sortable:true, width:20%}, ...]
// TODO: save sort order in every column.
// formatters
// 
return Gnd.Util.extend(Gnd.View, function(_super){
  return {
    constructor: function(selector, collection, options){
      _super.constructor.call(this, {
        templateUrl: 'views/templates/table.html',
        templateEngine: _.template
      });
        
      this.parent(selector);
      this.options = options = options || {};

      this.collection = collection;
      this.animateOnSelect = options.animateOnSelect;
      this.selectedId = options.selectedId;
      this.formatters = options.formatters || {};
      
      this.addedFn = Gnd.Util.noop;
    },
    render: function(){
      var context = this.options; // TODO: clone
      
      _.defaults(context,{
        pretable: false,
        classname: false,
        footer: false
      });
      
      var _this = this;
      _super.render.call(this, context).then(function(){
        _this.viewModel = 
          new Gnd.ViewModel(_this.selector,
                            {
                              collection: _this.collection,
                              table: _this
                            },
                            _this.formatters);
      });
      return this;
    },
    /*
    selectHandler: function(el){
      var classname = 'gnd-table-row-selected';
      $('.'+classname, this.root).removeClass(classname);
      $(el).addClass(classname);
      
      if(this.animateOnSelect) {
        var tableWrapper = $('.gnd-table-contentwrapper',this.root);
        _.defer(function(){
          if (tableWrapper[0].scrollHeight > tableWrapper[0].clientHeight ) {
            var index = $('tr', tableWrapper).index(el);
            var selectedRowHeight = $(el).height()*index;
            tableWrapper.stop().animate({
              scrollTop: selectedRowHeight - (tableWrapper.height()/2)
            }, 'fast');
          }
        })
      }
      this.selectedId = el.dataset.item;

      this.emit('selected:', el['gnd-obj']);
    },
    */
    sortHandler: function(el, ev){
      var field = el.dataset.field.toLowerCase();
      this.collection.set('sortByFn', function(item){
        return item[field];
      })
      this.collection.sortOrder = 
        this.collection.sortOrder == 'asc' ? 'desc' : 'asc';
    },
    selectById : function(id){
      var $row = $("tr[data-item='" + id +"']")[0];
      if($row) {
        this.selectHandler($row);
      }
    },
  }
});

});
