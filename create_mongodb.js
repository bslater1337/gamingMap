var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const token = require('./token.js');
const tile = require("./tiles.js");

setupMap = function(token){
  var map = new tile.board();
  for(var i = 0; i < 12; i++){
    if (map[i] === undefined) {
      map[i] = [];
    }
    for(var j = 0; j < 12; j++){
      _ = new token(i, j, map);
    }
  }
  return map;
};

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "test", password: "123456" };
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

  // dbo.collection("users").updateOne({name: 'bslater'}, { $set: {name: 'bslater', password: "bananas"}}, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document inserted");
  //   db.close();
  // });

  game_map = setupMap(tile.basicGround);
  // console.log('\n');
  let wall_1 = new tile.basicWall(1, 0, game_map);
  let wall_2 = new tile.basicWall(1, 1, game_map);
  let wall_3 = new tile.basicWall(1, 2, game_map);
  let portal = new tile.basicGround(0, 0, game_map);
  let startTile = new tile.basicGround(5, 5, game_map, [portal]);
  let test_token = new token.MovableToken("TOKEN", "test token", game_map.tileAtPosition(3, 3), 3);
  let bat_token = new token.MovableToken("batman", "test token", game_map.tileAtPosition(0, 0), 5);
  var serial_map = game_map.serialized;
  var obj = { name: 'test_map', serial_map}
  dbo.collection("maps").insertOne(obj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
