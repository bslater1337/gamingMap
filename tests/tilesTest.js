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
      new token(i, j, map);
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
    var map = setupMap(tile.NullTile);

    for(var i = 0; i < 100; i++){
      for(var j = 0; j < 100; j++){
        assert(map.tileAtPosition(i,j) instanceof tile.NullTile);
      }
    }
  });

  it("should have the correct properties when added", function(){
    var map = setupMap(tile.NullTile);
    new tile.basicGround(1, 1, map);
    new tile.basicWall(2,1, map);
    //assert for basic ground
    assert(map.tileAtPosition(1,1).difficultTurrain === false);
    assert(map.tileAtPosition(1,1).canMoveThrough == true);
    assert(map.tileAtPosition(1,1).size == 1);
    assert(map.tileAtPosition(1,1).token == null);
    //assert for basic wall
    assert(map.tileAtPosition(2,1).difficultTurrain == false);
    assert(map.tileAtPosition(2,1).canMoveThrough == false);
    assert(map.tileAtPosition(2,1).size == 1);
    assert(map.tileAtPosition(2,1).token == null);

  });

  it("should be able to hold a token", function(){
    var map = setupMap(tile.NullTile);
    map.addTileAt(1,1, tile.basicGround);
    var tok = tile.token
    map.tileAtPosition(1,1).token = tok;
    assert(map.tileAtPosition(1,1).token == tok);
  });

  it("should find the neighbors of a tile",function(){
/*
  00|10|20
  01|11|21
  02|12|22
*/
    let map = setupMap(tile.NullTile);
    let portal = new tile.Tile(17, 17, map);
    let startTile = new tile.Tile(1, 1, map, [portal]);
    let upTile = new tile.Tile(1, 0, map);
    let downTile = new tile.Tile(1, 2, map);
    let leftTile = new tile.Tile(0, 1, map);
    let rightTile = new tile.Tile(2, 1, map);
    let diagonal = new tile.Tile(2,0, map);
    assert(startTile.isNeighbor(upTile));
    assert(startTile.isNeighbor(downTile));
    assert(startTile.isNeighbor(leftTile));
    assert(startTile.isNeighbor(rightTile));
    assert(!startTile.isNeighbor(startTile));
    assert(!startTile.isNeighbor(diagonal));
    assert(!upTile.isNeighbor(downTile));
    assert(portal.isNeighbor(startTile));  // if neighborness is not associative, reverse the order of these tiles
    assert(!portal.isNeighbor(upTile));
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
