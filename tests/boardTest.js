const mocha = require('mocha');
const assert = require('assert');
const testHelper = require('./testHelper.js');
//const serverHelper = require("../serverHelper");
const tile = require("../tiles.js");

let setupMap = testHelper.setupMap;
let createChangesArray = testHelper.createChangesArray;

describe("Board Functions", function(){
  it("it should be a null map", function(){
    let map = setupMap(tile.NullTile);

    for(let i = 0; i < 100; i++){
      for(let j = 0; j < 100; j++){
        assert(map.tileAtPosition(i,j) instanceof tile.NullTile);
      }
    }
  });

  it("should add a tile to a map", function(){
    let map = setupMap(tile.NullTile);
    map.constructTileAt(1, 1, tile.basicGround);
    //map.addTileAt(1,1,"testTile");
    assert(map.tileAtPosition(1, 1) instanceof tile.basicGround);
  });

  it("should fail to remove a tile from a map", function(){
    let map = setupMap(tile.NullTile);
    let smallMap = new tile.board;
    _ = new tile.basicGround(1,0, smallMap);

    map.removeTileAt(1,1);
    assert(map.tileAtPosition(1, 1) instanceof tile.NullTile);
    smallMap.removeTileAt(0,1);
  });

  it("should remove a tile from a map", function(){
    let map = setupMap(tile.NullTile);

    //map.addTileAt(1,1,tile.basicGround);
    _ = new tile.basicGround(1,1,map);
    assert(map.tileAtPosition(1, 1) instanceof tile.basicGround);

    map.removeTileAt(1,1);
    assert(map.tileAtPosition(1, 1) instanceof tile.NullTile);
  });

  it("should change a tile on the map", function(){
    let map = setupMap(tile.NullTile);
    map.addTileAt(1,1,tile.basicGround);
    assert(map.tileAtPosition(1, 1) === tile.basicGround);

    map.changeTileAt(1,1,tile.basicWall);
    assert(map.tileAtPosition(1, 1) === tile.basicWall);
  });


  it("should change multiple tiles on a map", function(){
    let map = setupMap(tile.NullTile);
    let startTiles = createChangesArray(100, tile.basicGround);
    let secondTiles = createChangesArray(100, tile.basicWall);

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
