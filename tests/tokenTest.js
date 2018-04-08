const mocha = require('mocha');
const assert = require('assert');
const testHelper = require('./testHelper.js');
const tokenHelper = require('../token.js');
const tile = require("../tiles.js");
const attackHelper = require('../attacks.js');

let setupMap = testHelper.setupMap;
let createChangesArray = testHelper.createChangesArray;

function distance(x1, y1, x2, y2)   {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

describe("Token tests", function(){

  it("should be able to move a token to a position with correct tiles", function(){
    let map = setupMap(tile.basicGround);
    let moveArr = [map.tileAtPosition(0,0), map.tileAtPosition(1,1)];
    let secondMove = [map.tileAtPosition(1,1), map.tileAtPosition(0,0)];
    let tok = new tokenHelper.MovableToken("testToken", "dumbToken", map.tileAtPosition(0,0));
    tok.move(moveArr);
    assert(map.tileAtPosition(1,1).token === tok);
    tok.move(secondMove);
    assert(map.tileAtPosition(1,1).token !== tok);
    assert(map.tileAtPosition(0,0).token === tok);
  });

  it("should not be able to move token to a new position with incorrect tiles", function(){
    let map = setupMap(tile.basicWall);
    let moveArr = [map.tileAtPosition(0,0), map.tileAtPosition(1,1)];
    let tok = new tokenHelper.MovableToken("testToken", "dumbToken", map.tileAtPosition(0,0));
    map.changeTileAt(0,0,tile.basicGround);
    tok.move(moveArr);
    assert(map.tileAtPosition(1,1).token !== tok);
  });

  it("should be able to determine all possible destination tiles (simple case)", function(){
      let map = new tile.board();
      for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 7; j++) {
              _ = new tile.Tile(i, j, map);
          }
      }
      let token = new tokenHelper.MovableToken("Gabe", "test", map.tileAtPosition(3, 3), 3);
      let a = token.possibleDestinations;
      assert.equal(25, a.length);
      for (let dest of a)   {
          assert(distance(3, 3, ...dest.coords) <= 3);
          if (dest.x < 2 && dest.y < 2)   {
              assert(false);
          }
      }
  });

  it("should be able to have possible attacks and movement that are different", function(){
    let map = setupMap(tile.basicGround);
    let startTile = map.tileAtPosition(5,5);
    let attacker = new tokenHelper.AttackingToken("Attack Tester", "attacker", startTile, 3, 10);
    let rangeAbstractAttack = new attackHelper.AbstractAttack(1, 5, 0);
    attacker.addAttack("testAttack", rangeAbstractAttack);
    let possibleAttacks = attacker.getPossibleAttacks(attacker.attack["testAttack"]);
    let possibleDestinations = attacker.possibleDestinations;

    assert.equal(61, possibleAttacks.length);
    assert.equal(25, possibleDestinations.length);
    for (let each of possibleAttacks)   {
        assert(distance(5, 5, ...each.coords) <= 5);
    }
  });

});
