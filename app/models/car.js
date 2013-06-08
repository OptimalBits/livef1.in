define(['gnd'], function(Gnd){
  
  var CarSchema = {
    carId: {type: String, index: true},
    driver: String,
    interval: String,
    gap: String,
    position: Number,
    period1: String,
    period2: String,
    period3: String,
    sector1: String,
    sector2: String,
    sector3: String,
    lapTime: String,
    numPits: Number,
    lapCount: Number
  }
  
  return Gnd.Model.extend('cars', CarSchema);
});
