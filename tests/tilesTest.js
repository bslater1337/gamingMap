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

describe("tiles", function(){
  it("should be a null map", function(){
    var map = setupMap(null);

    for(var i = 0; i < 100; i++){
      for(var j = 0; j < 100; j++){
        assert(map[i][j] == null);
      }
    }
  });

  it("should have the correct properties when added", function(){
    var map = setupMap(null);
    serverHelper.addTile(1,1, tile.basicGround);
    serverHelper.addTile(2,1, tile.basicWall);
    //assert for basic ground
    assert(map[1][1].difficultTurrain == false);
    assert(map[1][1].transparent == true);
    assert(map[1][1].canMoveThrough == true);
    assert(map[1][1].size == 1);
    assert(map[1][1].token == null);
    //assert for basic wall
    assert(map[2][1].difficultTurrain == false);
    assert(map[2][1].transparent == false);
    assert(map[2][1].canMoveThrough == false);
    assert(map[2][1].size == 1);
    assert(map[2][1].token == null);
  });

  it("should be able to hold a token", function(){
    var map = setupMap(null);
    serverHelper.addTile(1,1, tile.basicGround);
    var tok = tile.token
    map[1][1].token = tok;
    assert(map[1][1].token == tok);
  });

  it("should be able to move a token to a position", function(){
    var map = setupMap(tile.basicGround);
    var moveArr = [map[0][0], map[1][1]];
    var tok =  tile.token;
    tok.move(moveArr);
    assert(map[1][1].token == tok);
  });

});
