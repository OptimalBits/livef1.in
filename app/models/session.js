define(['gnd', 'models/car'], function(Gnd, Car){
 
  var SessionSchema = {
    sessionId: {type: String, index: {unique: true}},
    copyright: String,
    eventType: Number,
    cars: [{ type: Gnd.Schema.ObjectId, ref: 'Car' }],
    comments: [{ type: Gnd.Schema.ObjectId, ref: 'Comment' }],
  };
 
  return Gnd.Model.extend('sessions', SessionSchema);
});
