const mocha = require('mocha');
const assert = require('assert');
const testHelper = require('./testHelper.js');
//const serverHelper = require("../serverHelper");
const tile = require("../tiles.js");

let setupMap = testHelper.setupMap;
let createChangesArray = testHelper.createChangesArray;

function distance(x1, y1, x2, y2)   {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

describe("Token tests", function(){

  it("should be able to determine all possible destination tiles (simple case)", function(){
      let map = new tile.board();
      for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 7; j++) {
              _ = new tile.Tile(i, j, map);
          }
      }
      let token = new tile.MovableToken("Gabe", "test", map.tileAtPosition(3, 3), 3);
      let a = token.possibleDestinations;
      assert.equal(25, a.length);
      for (let dest of a)   {
          assert(distance(3, 3, ...dest.coords) <= 3);
          if (dest.x < 2 && dest.y < 2)   {
              assert(false);
          }
      }
  });
});
