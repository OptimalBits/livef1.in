define(['gnd', 'models/car'], function(Gnd, Car){
  var Session = Gnd.Model.extend('sessions');
  
  _.extend(Session.prototype, {
    init: function(){
      var _this = this;
      return Gnd.Model.prototype.init.call(this).then(function(){
        _this.all(Car).then(function(cars){
          _this.cars = cars;
        });
        return _this;
      });
    }
  });
  
  return Session;
});
