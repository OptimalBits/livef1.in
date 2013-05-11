"use strict";

var Gnd = require('gnd')
  , config = require('./config')
  , models = require('./models/models')
  , cabinet = require('cabinet')
  , http = require('http')
  , app = require('connect').createServer()
  , server = http.createServer(app)
  , sio = require('socket.io').listen(server)
  , redis = require('redis')
  , mongoose = require('mongoose')
  , staticDir = __dirname
  , path = require('path')
  , livef1 = require('livef1');
  
server.listen(config.APP_PORT);

app.use(cabinet(path.join(__dirname, 'app'), {
  ignore: ['.git', 'node_modules', '*~'],
  files: {
    '/lib/gnd.js': Gnd.debug, // Gnd.lib
    '/lib/curl.js': Gnd.third.curl,
    '/lib/underscore.js': Gnd.third.underscore
  }
}));

mongoose.connect(config.MONGODB_URI);

var mongooseStorage = new Gnd.MongooseStorage(models, mongoose)
  , pubClient = redis.createClient(config.REDIS_PORT, config.REDIS_ADDR)
  , subClient = redis.createClient(config.REDIS_PORT, config.REDIS_ADDR)
  , syncHub = new Gnd.Sync.Hub(pubClient, subClient, sio.sockets)
  , sessionManager =  new Gnd.SessionManager()
  , gndServer = new Gnd.Server(mongooseStorage, sessionManager, syncHub)
  , socketServer = new Gnd.SocketBackend(sio.sockets, gndServer);

console.log("Started server at port: %d in %s mode", config.APP_PORT, config.MODE);

//
// Live F1 listener. Get Packets and generate Models and Collections accordingly.
//
livef1(config.LIVEF1_USER, config.LIVEF1_PASSWD, function(packet){
  // All packets correspond to some session.
  // We have a public collection of Sessions.
  // Every session is a Model that has a Collection of cars.

  processPacket(packet);
  
}).then(null, function(err){
  console.log("Error processing packets:"+err);
})


//
// We process packets by creating and updating documents an by notifying 
// the synchronization hub.
//
function processPacket(packet){
  var Session = models.sessions;
  var Car = models.cars;
    
  if(packet.carId){
    // First upsert the car object using the pair carId, sessionId (we want unique carIds per sessionId)
    try{
      Car.findOneAndUpdate({carId: packet.carId, sessionId: packet.sessionId}, packet, {upsert: true}, function(err, car){
        if(!err){
          // Check if car is not in session, then add it.
          Session.update({sessionId: packet.sessionId}, {$addToSet: {cars:{$each:[car._id]}}}, function(err, session){
            // How do we know if a car was added, or not?
          });
      
          syncHub.update(null, ['cars', car._id], packet);
        }
      });
    } catch(err){
      console.log(err);
    }
  }else if(packet.sessionId){
    Session.findOneAndUpdate({sessionId:packet.sessionId}, packet, {upsert: true}, function(err, session){
      if(!err){
        syncHub.update(null, ['sessions', session._id], packet);
      }else{
        console.log("Error:"+err);
      }
    });
  }
}
