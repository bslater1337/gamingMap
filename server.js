let path = require('path');
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
const token = require('./token.js');
const tile = require("./tiles.js");
const attacks = require('./attacks.js');
const SHA256 = require("crypto-js/sha256");

//use SHA256 encryption by doing the following SHA256("Message")

let url = "mongodb://localhost:27017/";
let players = [];
let dbo;
let game_map;


setupMap = function(thing){
  let map = new tile.board();
  for(let i = 0; i < 12; i++){
    for(let j = 0; j < 12; j++){
      _ = new tile.basicGround(i, j, map);
    }
  }
  return map;
};


app.use(express.static(path.join(__dirname, 'public')));

function userQuery(db, userName, callback) {
	let collection = db.collection("users");
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
	let collection = db.collection("maps");
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
	let collection = db.collection("users");
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
	// 			let serialmap = result[0].serial_map
	// 			game_map = tile.fromSerialized(serialmap);
	// 			io.emit('server map update', game_map.serialized);
	// 		}
	// });
	game_map = setupMap(tile.basicGround);
	console.log('\n');
	let wall_1 = new tile.basicWall(1, 0, game_map);
    let wall_2 = new tile.basicWall(1, 1, game_map);
    let wall_3 = new tile.basicWall(1, 2, game_map);
    let portal = new tile.basicGround(0, 0, game_map);
    let startTile = new tile.basicGround(5, 5, game_map, [portal]);
	let test_token = new token.MovableToken("TOKEN", "test token", game_map.tileAtPosition(3, 3), 3);
}
  function getPlayerIndexBySocket(socket){
		return players.map(function(e) { return e.socketid; }).indexOf(socket);
	}
	function getPlayerIndexByName(name){
		return players.map(function(e) { return e.name; }).indexOf(name);
	}
  console.log('a user connected');

  socket.on('chat message', function(msg){
      let message = '';
      if(getPlayerIndexBySocket(socket) < 0){
          message = 'somebody' + ": "+ msg;
      }
    else{
          message = players[getPlayerIndexBySocket(socket)].name + ": "+ msg;
      }
    io.emit('chat message', message);
    console.log(message)
  });

	socket.on('move token', function(move_obj){
		console.log('moving token')
		console.log(move_obj.old_coords);
		console.log(move_obj.new_coords);
		let old_tile = game_map.tileAtPosition(move_obj.old_coords[0], move_obj.old_coords[1]);
		let new_tile = game_map.tileAtPosition(move_obj.new_coords[0], move_obj.new_coords[1]);
		let move_array = [old_tile, new_tile];
		//console.log(move_array);
		if ('token' in old_tile && old_tile.token != null){
			let token_obj = old_tile.token;
			let dest = old_tile.token.possibleDestinations;
			let uuids = []
			dest.forEach(function(element){
				uuids.push(element.UUID)
			});
			if(uuids.includes(new_tile.UUID)){
				console.log(true)
				token_obj.tile = new_tile;
				new_tile.token = token_obj;
				old_tile.token = null;
				game_map = game_map;
			}


			//old_tile.token.move(move_array);
			//console.log('new tile token is')
			//console.log(new_tile.token);
		}
		else if(!('token' in old_tile) || old_tile.token ===null){
		    console.log('no token')

        }
		io.emit('server map update', game_map.serialized);
  });

	socket.on('token selected', function(tile_coords){
		console.log('mousedown');
		//console.log(move_obj);
		let current_tile = game_map.tileAtPosition(tile_coords[0], tile_coords[1])
		console.log(current_tile)
		let moves_obj = current_tile.token.possibleDestinations;
		let move_uuids = [];
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
				let indexOfUser = getPlayerIndexByName(credentials.username);
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
