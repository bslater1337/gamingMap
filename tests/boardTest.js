const mocha = require('mocha');
const assert = require('assert');
//const serverHelper = require("../serverHelper");
const tile = require("../tiles.js");

function setupMap(token){
  var map = new tile.board;
  for(var i = 0; i < 100; i++){
    if (map[i] === undefined) {
      map[i] = [];
    }
    for(var j = 0; j < 100; j++){
      map.addTileAt(i, j, token);
    }
  }
  return map;
}

function createChangesArray(length, token){
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

describe("Board Functions", function(){
  it("it should be a null map", function(){
    var map = setupMap(null);

    for(var i = 0; i < 100; i++){
      for(var j = 0; j < 100; j++){
        assert(map.addTileAt(i, j) == null);
      }
    }
  });

  it("should add a tile to a map", function(){
    var map = setupMap(null);
    new tile.basicGround(1,1, map);
    //map.addTileAt(1,1,"testTile");
    assert(map.tileAtPosition(1, 1) instanceof tile.basicGround);
  });

  it("should fail to remove a tile from a map", function(){
    var map = setupMap(null);

    map.removeTileAt(1,1);
    assert(map.tileAtPosition(1, 1) instanceof tile.NullTile);
  });

  it("should remove a tile from a map", function(){
    var map = setupMap(null);

    //map.addTileAt(1,1,tile.basicGround);
    new tile.basicGround(1,1,map);
    assert(map.tileAtPosition(1, 1) instanceof tile.basicGround);

    map.removeTileAt(1,1);
    assert(map.tileAtPosition(1, 1) instanceof tile.NullTile);
  });

  it("should change a tile on the map", function(){
    var map = setupMap(null);
    map.addTileAt(1,1,tile.basicGround);
    assert(map.tileAtPosition(1, 1) == tile.basicGround);

    map.changeTileAt(1,1,tile.basicWall);
    assert(map.tileAtPosition(1, 1) == tile.basicWall);
  });


  it("should change multiple tiles on a map", function(){
    var map = setupMap(null);
    var startTiles = createChangesArray(100, tile.basicGround);
    var secondTiles = createChangesArray(100, tile.basicWall);

    map.changeTiles(startTiles);
    for (let each of map.mapByTiles.keys()) {
      if (each !== null)
        assert(map.tileAtPosition(each.x, each.y)== tile.basicGround);
    }

    map.changeTiles(secondTiles);
    for (let each of map.mapByTiles.keys()) {
      if (each !== null)
        assert(map.tileAtPosition(each.x, each.y)== tile.basicWall);
    }
  });

});
