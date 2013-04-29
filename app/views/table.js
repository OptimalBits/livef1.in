define(['gnd', 'text!views/templates/table.html'], function(Gnd, tableTmpl){
'use strict';

//
// columns = [{header:'name', field:'field', sortable:true, width:20%}, ...]
// formatters
// 
return Gnd.Util.extend(Gnd.View, function(_super){
  return {
    constructor: function(collection, options, formatters){
      _super.constructor.call(this);
      _.defaults(options,{
        pretable: false,
        classname: false,
        selectedId:null,
        animateOnSelect:true
      });

      this.html = _.template(tableTmpl, options);
      this.collection = collection;
      this.formatters = formatters || {};
      this.selectedId = options.selectedId;
      this.animateOnSelect = options.animateOnSelect;
    },
    render: function(selector){
      this.selector = selector;
      _super.render.call(this);
      this.viewModel = 
        new Gnd.ViewModel(Gnd.$(selector)[0],
                          {
                            collection: this.collection,
                            table: this
                          },
                          this.formatters);
      /*
      if(this.selectedId){
        this.selectById(this.selectedId);
      } else {
        var item = this.collection.first();
        this.selectById(item && item._id);
      }
      */
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
