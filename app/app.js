define(['gnd', 'models/session', 'models/car', 'views/table'], 
function(Gnd, Session, Car, Table){
'use strict';

Gnd.use.historyApi(false);

//
// Establish a socket.io connection.
//
var connectPromise = new Gnd.Promise();
var socket = io.connect();

socket.on('connect', function(){
  connectPromise.resolve();
})

//
// Create Local and Remote storages
//
var localStorage = new Gnd.Storage.Local();
var remoteStorage = new Gnd.Storage.Socket(socket);

//
// Configure the storage queue.
//
Gnd.use.storageQueue(localStorage, remoteStorage);

//
// Configure the sync manager.
//
Gnd.use.syncManager(socket);

// 
// Listen to available routes. Only used for selecting filters
//
connectPromise.then(function(){

Gnd.Route.listen(function(req) {
  req.get(function(pool) {

    // Handle routes
    req.render('assets/templates/main.html');
    
    req.after(function(done){
      Session.all().then(function(sessions){
        sessions.keepSynced();
        
        var sessionsVM = 
          new Gnd.ViewModel('#sessions',
            {sessions: sessions}, 
            {sessionUrl: function(){
              return 'sessions/'+this._id;
            }});
        
        done();
        pool.autorelease(sessionsVM);
      });
    });
    
    req.get(':id', '#session-details', function(pool){
      
      req.after(function(done){
        // Load Session
        Session.findById(req.params.id).then(function(session){          
          // Create View model an populate session
          var sessionVM =
            new Gnd.ViewModel('#session-details', {session: session});
          
          var leaderBoard = createLeaderBoard('#leaderboard', 
                                              session, 
                                              session.all(Car));
          leaderBoard.render();

          pool.autorelease(sessionVM, leaderBoard);
          done();
        });
      });
    });
  });
});

function createLeaderBoard(selector, session, cars){
  var tableOptions;
  
  switch(session.eventType){
    case 1: tableOptions = raceLeaderBoard(); break;
    case 2: tableOptions = practiceLeaderBoard(); break;
    case 3: tableOptions = qualifyingLeaderBoard(); break;
    default: tableOptions = practiceLeaderBoard();
  }
  
  cars.set('sortByFn', function(car){
    return car.position;
  })
  
  return new Table(selector, cars, tableOptions);
}

function raceLeaderBoard(){
  return {
    columns:[
      {header:'Pos', field: 'position', sortable: true, width: '2%'},
      {header:'Driver', field: 'driver', sortable: true, width: '10%'},
      {header:'Lap Time', field: 'lapTime', sortable: true, width: '5%'},
      {header:'Sector 1', field: 'sector1', sortable: true, width: '5%'},
      {header:'Sector 2', field: 'sector2', sortable: true, width: '5%'},
      {header:'Sector 3', field: 'sector3', sortable: true, width: '5%'},
      {header:'Num Pits', field: 'numPits', sortable: true, width: '5%'},
    ],
    };
}

function practiceLeaderBoard(){
  return {
    columns:[
      {header:'Pos', field: 'position', sortable: true, width: '10%'},
      {header:'Driver', field: 'driver', sortable: true, width: '40%'},
      {header:'Sector 1', field: 'sector1', sortable: true, width: '18%'},
      {header:'Sector 2', field: 'sector2', sortable: true, width: '18%'},
      {header:'Sector 3', field: 'sector3', sortable: true, width: '18%'},
      {header:'Laps', field: 'lapCount', sortable: true, width: '5%'},
    ],
      //selectedId : 0
    };
}

function qualifyingLeaderBoard(session){
  return {
    columns:[
      {header:'Pos', field: 'position', sortable: true, width: '10%'},
      {header:'Driver', field: 'driver', sortable: true, width: '40%'},
      {header:'Period 1', field: 'period1', sortable: true, width: '18%'},
      {header:'Period 2', field: 'period2', sortable: true, width: '18%'},
      {header:'Period 3', field: 'period3', sortable: true, width: '18%'},
      {header:'Sector 1', field: 'sector1', sortable: true, width: '5%'},
      {header:'Sector 2', field: 'sector2', sortable: true, width: '5%'},
      {header:'Sector 3', field: 'sector3', sortable: true, width: '5%'},
      {header:'Laps', field: 'lapCount', sortable: true, width: '5%'},
    ],
      //selectedId : 0
    };
}

});

});
