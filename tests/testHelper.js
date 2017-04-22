const tile = require("../tiles.js");

exports.setupMap = function(token){
  var map = new tile.board;
  for(var i = 0; i < 100; i++){
    if (map[i] === undefined) {
      map[i] = [];
    }
    for(var j = 0; j < 100; j++){
      _ = new token(i, j, map);
    }
  }
  return map;
}

exports. createChangesArray = function(length, token){
  var arr = []
  for(var i = 0; i < length; i++){
    var temp = {
      x : Math.floor(Math.random()*100),
      y : Math.floor(Math.random()*100),
      tile : token
    }
  }
  return arr;
}
