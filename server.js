var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const token = require('./token.js');
const tile = require("./tiles.js");
const attacks = require('./attacks.js');

var url = "mongodb://localhost:27017/";
var players = [];
var dbo;
var game_map;


setupMap = function(thing){
  var map = new tile.board();
  for(var i = 0; i < 12; i++){
    for(var j = 0; j < 12; j++){
      _ = new tile.basicGround(i, j, map);
    }
  }
  return map;
};


app.use(express.static(path.join(__dirname, 'public')));

function userQuery(db, userName, callback) {
	var collection = db.collection("users");
	collection.find({name: userName}).toArray(function(err, docs) {
		if (err != null) {
			console.log("Error on attempting to find: " + err);
			callback("error"); //error on trying to query the db
		}
		else{
      callback(docs); //the docs object is null if the name doesn't exist
    }
	});
}

function mapQuery(db, map_name, callback) {
	var collection = db.collection("maps");
	collection.find({name: map_name}).toArray(function(err, docs) {
		if (err != null) {
			console.log("Error on attempting to find: " + err);
			callback("error"); //error on trying to query the db
		}
		else{
      callback(docs); //the docs object is null if the name doesn't exist
    }
	});
}


function createUser(db, userName, passWord, callback){ //we don't have to check for uniqueness in UN here
	var collection = db.collection("users");
	collection.insertOne({name : userName, password: passWord}, function(err, result){
		if (err!=null) callback("error");
		else callback(result);
	});
}

io.on('connection', function(socket){

	if(game_map == null){
	// 	mapQuery(dbo, "test_map", function(result){
	// 		if (result == "error"){
	// 			return;
	// 		}
	// 		else{
	// 			var serialmap = result[0].serial_map
	// 			game_map = tile.fromSerialized(serialmap);
	// 			io.emit('server map update', game_map.serialized);
	// 		}
	// });
	game_map = setupMap(tile.basicGround);
	console.log('\n');
  let test_token = new token.MovableToken("TOKEN", "test token", game_map.tileAtPosition(3, 3), 2);
	// console.log(test_token);
	// console.log(test_token.possibleDestinations.length)
}
  function getPlayerIndexBySocket(socket){
		return players.map(function(e) { return e.socketid; }).indexOf(socket);
	}
	function getPlayerIndexByName(name){
		return players.map(function(e) { return e.name; }).indexOf(name);
	}
  console.log('a user connected');

  socket.on('chat message', function(msg){
    var message = players[getPlayerIndexBySocket(socket)].name + ": "+ msg;
    io.emit('chat message', message);
    console.log(message)
  });

	socket.on('move token', function(move_obj){
		console.log('moving token')
		console.log(move_obj.old_coords);
		console.log(move_obj.new_coords);
		var old_tile = game_map.tileAtPosition(move_obj.old_coords[1], move_obj.old_coords[0]);
		var new_tile = game_map.tileAtPosition(move_obj.new_coords[1], move_obj.new_coords[0]);
		var move_array = [old_tile, new_tile];
		//console.log(move_array);
		if ('token' in old_tile && old_tile.token != null){
			var token_obj = old_tile.token;
			var dest = old_tile.token.possibleDestinations;
			var uuids = []
			dest.forEach(function(element){
				uuids.push(element.UUID)
			});
			if(uuids.includes(new_tile.UUID)){
				console.log(true)
				token_obj.tile = new_tile;
				new_tile.token = token_obj;
				old_tile.token = null;
			}

			//old_tile.token.move(move_array);
			//console.log('new tile token is')
			//console.log(new_tile.token);
		}
		io.emit('server map update', game_map.serialized);
  });

	socket.on('token selected', function(tile_coords){
		console.log('mousedown');
		//console.log(move_obj);
		var current_tile = game_map.tileAtPosition(tile_coords[0], tile_coords[1])
		console.log(current_tile)
		var moves_obj = current_tile.token.possibleDestinations;
		var move_uuids = [];
        moves_obj.forEach(function(element){
            move_uuids.push(element.UUID)
        });
		io.emit("possible moves", move_uuids);
	});

  socket.on('client map update', function(msg){
    io.emit('server map update', game_map.serialized);
    console.log(msg)
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // login stuff goes here
  socket.on("login", function(credentials) {
		//if the db errored trying to check / create / login didn't work return false
		//otherwise we emit true after all conditions for creation/login are met
		userQuery(dbo, credentials.username, function(result){
			if (result == "error"){
				socket.emit("loginValidation", false);
				return;
			}
			if (result.length>0 && credentials.message=="login"){
				var indexOfUser = getPlayerIndexByName(credentials.username);
				if (indexOfUser!=-1) {
					socket.emit("loginValidation", false);
				}
				else if (credentials.password == result[0].password){
					players.push({name: credentials.username, socketid: socket});
					socket.emit("loginValidation", true);
				}
				else {
					socket.emit("loginValidation", false);
				}
			}
			else if (result.length==0 && credentials.message=="create"){
				//use the db to create a user
				createUser(dbo, credentials.username, credentials.password, function(result){
					if(result.length!=0 && result!="error"){
						players.push({name: credentials.username, socketid: socket});
						console.log("Create was successful.");
						socket.emit("loginValidation", true);
					}
					else{
            socket.emit("loginValidation", false);
          } //create didn't succeed
        });
			}
			else{
				socket.emit("loginValidation", false); //couldn't login, couldn't create
			}
		});
  });
});



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("mydb");
	collection = dbo.collection("users");
	console.log("We connected to Mongo");

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
});
