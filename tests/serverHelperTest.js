const mocha = require('mocha');
const assert = require('assert');
const serverHelper = require("../serverHelper");
const tile = require("../tiles.js");

function setupMap(token){
  var map = serverHelper.map;
  for(var i = 0; i < 100; i++){
    if (map[i] === undefined) {
      map[i] = [];
    }
    for(var j = 0; j < 100; j++){
      map[i][j] = token;
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

describe("serverHelper", function(){
  it("it should be a null map", function(){
    var map = setupMap(null);

    for(var i = 0; i < 100; i++){
      for(var j = 0; j < 100; j++){
        assert(map[i][j] == null);
      }
    }
  });

  it("should add a tile to a map", function(){
    var map = setupMap(null);
    serverHelper.addTile(1,1,tile.basicGround);
    //serverHelper.addTile(1,1,"testTile");
    assert(map[1][1] == tile.basicGround);
  });

  it("should fail to remove a tile from a map", function(){
    var map = setupMap(null);

    serverHelper.removeTile(1,1);
    assert(map[1][1] == null);
  });

  it("should remove a tile from a map", function(){
    var map = setupMap(null);

    serverHelper.addTile(1,1,tile.basicGround);
    assert(map[1][1] == tile.basicGround);

    serverHelper.removeTile(1,1);
    assert(map[1][1] == null);
  });

  it("should change a tile on the map", function(){
    var map = setupMap(null);
    serverHelper.addTile(1,1,tile.basicGround);
    assert(map[1][1] == tile.basicGround);

    serverHelper.changeTile(1,1,tile.basicWall);
    assert(map[1][1] == tile.basicWall);
  });


  it("should change multiple tiles on a map", function(){
    var map = setupMap(null);
    var startTiles = createChangesArray(100, tile.basicGround);
    var secondTiles = createChangesArray(100, tile.basicWall);

    serverHelper.changeTiles(startTiles);
    startTiles.map(function(each){
      assert(map[each.x][each.y] == each.tile);
    });

    serverHelper.changeTiles(secondTiles);
    secondTiles.map(function(each){
      assert(map[each.x][each.y] == each.tile);
    });
  });
});
