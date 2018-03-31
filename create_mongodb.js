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
  // dbo.collection("users").insertOne(myobj, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document inserted");
  //   db.close();
  // });
  var map = setupMap(tile.basicGround)
  console.log(map)

  dbo.collection("maps").insertOne(map, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
