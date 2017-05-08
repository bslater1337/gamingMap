const mocha = require('mocha');
const assert = require('assert');
const testHelper = require('./testHelper.js');
const tokenHelper = require('../token.js');
const tile = require("../tiles.js");
const attackHelper = require('../attacks.js');

let setupMap = testHelper.setupMap;
let createChangesArray = testHelper.createChangesArray;

describe("Attacks", function(){
  it("should be able to damage another token", function(){
    let map = setupMap(tile.basicGround);
    let attackTile = map.tileAtPosition(5,5);
    let defendTile = map.tileAtPosition(5,1);
    let attacker = new tokenHelper.AttackingToken("Attack Tester", "attacker", attackTile, 3, 10);
    let defender = new tokenHelper.AttackingToken("Defending Tester", "defender",defendTile, 3, 10);
    let rangeAbstractAttack = new attackHelper.AbstractAttack(1, 5, 0);
    attacker.addAttack("testAttack", rangeAbstractAttack);
    assert.equal(10, defender.health);
    attacker.hit("testAttack", defender);
    assert.equal(9, defender.health);
  });
});
