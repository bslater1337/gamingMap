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

describe("tiles", function(){
  it("should be a board filled with null tiles", function(){
    var map = setupMap(null);

    for(var i = 0; i < 100; i++){
      for(var j = 0; j < 100; j++){
        assert(map.tileAtPosition(i,j) == null);
      }
    }
  });

  it("should have the correct properties when added", function(){
    var map = setupMap(null);
    map.addTileAt(1,1, tile.basicGround);
    map.addTileAt(2,1, tile.basicWall);
    //console.log(map.tileAtPosition(1,1));
    //console.log(map.mapByCoords);
    //assert for basic ground

    assert(map.tileAtPosition(1,1).difficultTurrain == false);
    assert(map.tileAtPosition(1,1).transparent == true);
    assert(map.tileAtPosition(1,1).canMoveThrough == true);
    assert(map.tileAtPosition(1,1).size == 1);
    assert(map.tileAtPosition(1,1).token == null);
    //assert for basic wall
    assert(map.tileAtPosition(2,1).difficultTurrain == false);
    assert(map.tileAtPosition(2,1).transparent == false);
    assert(map.tileAtPosition(2,1).canMoveThrough == false);
    assert(map.tileAtPosition(2,1).size == 1);
    assert(map.tileAtPosition(2,1).token == null);

  });

  it("should be able to hold a token", function(){
    var map = setupMap(null);
    map.addTileAt(1,1, tile.basicGround);
    var tok = tile.token
    map.tileAtPosition(1,1).token = tok;
    assert(map.tileAtPosition(1,1).token == tok);
  });

  it("should be able to move a token to a position with correct tiles", function(){
    var map = setupMap(tile.basicGround);
    var moveArr = [map.tileAtPosition(0,0), map.tileAtPosition(1,1)];
    var tok =  tile.token;
    map.tileAtPosition(0,0).token = tok;
    tok.move(moveArr);
    assert(map.tileAtPosition(1,1).token == tok);
  });

  it("should not be able to move token to a new position with incorrect tiles", function(){
    var map = setupMap(tile.basicWall);
    var moveArr = [map.tileAtPosition(0,0), map.tileAtPosition(1,1)];
    var tok = tile.token;
    map.changeTileAt(0,0,tile.basicGround);
    map.tileAtPosition(0,0).token = tok;
    tok.move(moveArr);
    assert(map.tileAtPosition(1,1) != tok);
  });

});
