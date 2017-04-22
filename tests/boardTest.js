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
      _ = new token(i, j, map);
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
    var map = setupMap(tile.NullTile);

    for(var i = 0; i < 100; i++){
      for(var j = 0; j < 100; j++){
        assert(map.tileAtPosition(i,j) instanceof tile.NullTile);
      }
    }
  });

  it("should add a tile to a map", function(){
    var map = setupMap(tile.NullTile);
    map.constructTileAt(1, 1, tile.basicGround);
    //map.addTileAt(1,1,"testTile");
    assert(map.tileAtPosition(1, 1) instanceof tile.basicGround);
  });

  it("should fail to remove a tile from a map", function(){
    var map = setupMap(tile.NullTile);
    var smallMap = new tile.board;
    _ = new tile.basicGround(1,0, smallMap);

    map.removeTileAt(1,1);
    assert(map.tileAtPosition(1, 1) instanceof tile.NullTile);
    smallMap.removeTileAt(0,1);
  });

  it("should remove a tile from a map", function(){
    var map = setupMap(tile.NullTile);

    //map.addTileAt(1,1,tile.basicGround);
    _ = new tile.basicGround(1,1,map);
    assert(map.tileAtPosition(1, 1) instanceof tile.basicGround);

    map.removeTileAt(1,1);
    assert(map.tileAtPosition(1, 1) instanceof tile.NullTile);
  });

  it("should change a tile on the map", function(){
    var map = setupMap(tile.NullTile);
    map.addTileAt(1,1,tile.basicGround);
    assert(map.tileAtPosition(1, 1) === tile.basicGround);

    map.changeTileAt(1,1,tile.basicWall);
    assert(map.tileAtPosition(1, 1) === tile.basicWall);
  });


  it("should change multiple tiles on a map", function(){
    var map = setupMap(tile.NullTile);
    var startTiles = createChangesArray(100, tile.basicGround);
    var secondTiles = createChangesArray(100, tile.basicWall);

    map.changeTiles(startTiles);
    for (let each of map.mapByTiles.keys()) {
      if (each !== map._nullTile)
        assert(map.tileAtPosition(each.x, each.y)=== tile.basicGround);
    }

    map.changeTiles(secondTiles);
    for (let each of map.mapByTiles.keys()) {
      if (each !== map._nullTile)
        assert(map.tileAtPosition(each.x, each.y)=== tile.basicWall);
    }
  });

});
