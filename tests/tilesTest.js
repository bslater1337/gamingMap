const mocha = require('mocha');
const assert = require('assert');
const testHelper = require('./testHelper.js');
const tokenHelper = require('../token.js');
const tile = require("../tiles.js");

let setupMap = testHelper.setupMap;
let createChangesArray = testHelper.createChangesArray;

describe("tiles", function(){

  it("should have the correct properties when added", function(){
    let map = setupMap(tile.NullTile);
    _ = new tile.basicGround(1, 1, map);
    _ = new tile.basicWall(2,1, map);
    //assert for basic ground
    assert(map.tileAtPosition(1,1).difficultTurrain === false);
    assert(map.tileAtPosition(1,1).canMoveThrough === true);
    assert(map.tileAtPosition(1,1).size === 1);
    assert(map.tileAtPosition(1,1).token === null);
    //assert for basic wall
    assert(map.tileAtPosition(2,1).difficultTurrain === false);
    assert(map.tileAtPosition(2,1).canMoveThrough === false);
    assert(map.tileAtPosition(2,1).size === 1);
    assert(map.tileAtPosition(2,1).token === null);

  });

  it("should be able to change a tile using the constructor", function(){
    let map = setupMap(tile.basicGround);
    assert(map.tileAtPosition(1,1) instanceof tile.basicGround);
    let wall = new tile.basicWall(1,1,map);
    assert(map.tileAtPosition(1,1) instanceof tile.basicWall);
  });

  it("should be able to hold a token", function(){
    let map = setupMap(tile.NullTile);
    let island = new tile.basicGround(1,1, map);
    let tok = new tokenHelper.Token("testToken", "dumbToken", map.tileAtPosition(1,1));
    //map.tileAtPosition(1,1).token = tok;
    assert(map.tileAtPosition(1,1).token.name === "testToken");
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

  it("should be able to get from serialized",function(){
/*
  00|10|20
  01|11|21
  02|12|22
*/
    let test_map = setupMap(tile.NullTile);
    let ground = new tile.basicGround(0, 0, test_map);
    let tok = new tokenHelper.MovableToken("testToken", "dumbToken", test_map.tileAtPosition(0,0));
    serial_map = test_map.serialized;
    new_map = tile.fromSerialized(serial_map);
    assert(new_map instanceof tile.board );
    assert(new_map.tileAtPosition(0,0) instanceof tile.basicGround);

  });

});
