/**
  Export all the models that should be accessible by Ground.

*/

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

//
// Sessions
//
var Session = {
  sessionId: {type: String, index: {unique: true}},
  copyright: String,
  eventType: Number,
  cars: [{ type: Schema.ObjectId, ref: 'Car' }],
  comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
};

module.exports.sessions = mongoose.model('Session', new Schema(Session));

var Comment = {
  comment: String
}

module.exports.comments = mongoose.model('Comment', new Schema(Comment));

var Car = {
  carId: {type: String, index: true},
  driver: String,
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

module.exports.cars = mongoose.model('Car', new Schema(Car));
