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

function createUser(db, userName, passWord, callback){ //we don't have to check for uniqueness in UN here
	var collection = db.collection("users");
	collection.insertOne({name : userName, password: passWord}, function(err, result){
		if (err!=null) callback("error");
		else callback(result);
	});
}


io.on('connection', function(socket){
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
  socket.on('client map update', function(msg){
    io.emit('server map update', msg);
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
