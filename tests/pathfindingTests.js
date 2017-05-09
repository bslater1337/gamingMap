const mocha = require('mocha');
const assert = require('assert');
const testHelper = require('./testHelper.js');
const tokenHelper = require('../token.js');
const tile = require("../tiles.js");
const attackHelper = require('../attacks.js');
const pathfinder = require('../pathfinder.js');

let setupMap = testHelper.setupMap;
let createChangesArray = testHelper.createChangesArray;

describe("Pathfinding tests", function(){

  it("should be able to find the correct linear path", function(){
    let map = new tile.board();
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            _ = new tile.Tile(i, j, map);
        }
    }
    let token = new tokenHelper.MovableToken("Gabe", "test", map.tileAtPosition(3, 3), 3);
    let a = token.possibleDestinations;
    let startTile = map.tileAtPosition(3,3);
    let endTile = map.tileAtPosition(0,3);
    let path = pathfinder.pathfinding(a, startTile, endTile);
    assert(map.whereIsTile(path[0])[0] === 3 && map.whereIsTile(path[0])[1] === 3);
    assert(map.whereIsTile(path[1])[0] === 2 && map.whereIsTile(path[1])[1] === 3);
    assert(map.whereIsTile(path[2])[0] === 1 && map.whereIsTile(path[2])[1] === 3);
    assert(map.whereIsTile(path[3])[0] === 0 && map.whereIsTile(path[3])[1] === 3);
    assert(map.tileAtPosition(3, 3).hash === path[0].hash);
    assert(map.tileAtPosition(2, 3).hash === path[1].hash);
    assert(map.tileAtPosition(1, 3).hash === path[2].hash);
    assert(map.tileAtPosition(0, 3).hash === path[3].hash);
  });
});
