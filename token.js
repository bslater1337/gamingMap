const uuid = require('uuid/v4');
const attackHelper = require('./attacks.js');

exports.recreateToken = function recreateToken(tile, serialized) {
    return exports[serialized['class']].fromSerialized(tile, serialized);
}

exports.Token = class Token {
    constructor(name, type, tile) {
        this.name = name;
        this.type = type;
        this.tile = tile;
        //console.log(tile);
        if(tile !== undefined){
          this.tile.addToken(this);
        }
        this.UUID = this.hash = uuid();
    }

    get serialized()    {
        return {
            'class': 'Token',
            'name': this.name,
            'type': this.type,
            'uuid': this.UUID
        };
    }

    get weakSerialized()    {
        return {
            'class': 'Token',
            'name': this.name,
            'type': this.type,
            'uuid': this.UUID
        };
    }

    static fromSerialized(tile, serialized) {
        let token = new exports.Token(
            serialized['name'],
            serialized['type'],
            tile
        );
        token.UUID = token.hash = serialized['uuid'];
        return token;
    }

    equals(aToken)  {
        return this.hash === aToken.hash;
    }

    canMove()   {
        return false;
    }
    getRange(range){
      let visit = (tile, range)=>{
          let ret = [tile];
          if (range)  {
              for (let neighbor of tile.neighbors)    {
                  if (neighbor.canMoveThrough)    {
                      ret = ret.concat(visit(neighbor, range - 1));
                  }
              }
          }
          return ret;
      };

      let arr = visit(this.tile, range);
      let ret = [];
      let seen = new Set();
      for (let tile of arr)   {
          if (!seen.has(tile.hash))   {
              ret.push(tile);
              seen.add(tile.hash);
          }
      }
      return ret;
    }
};

exports.MovableToken = class MovableToken extends exports.Token {
    constructor(name, type, tile, movementSpeed)  {
        super(name, type, tile);
        this.movementSpeed = movementSpeed;
    }

    get serialized()    {
        let ret = super.serialized;
        ret['class'] = 'MovableToken';
        ret['movementSpeed'] = this.movementSpeed;
        return ret;
    }

    get weakSerialized()    {
        let ret = super.weakSerialized;
        ret['class'] = 'MovableToken';
        ret['movementSpeed'] = this.movementSpeed;
        return ret;
    }

    canMove(arrayOfTiles){
        let prev;
        for (let tile of arrayOfTiles)  {
            if (!tile.canMoveThrough ||
            (prev !== undefined && prev.isNeighbor(tile)))  {
                return false;
            }
            prev = tile;
        }
        return true;
   }
   static fromSerialized(tile, serialized) {
       let token = new exports.MovableToken(
           serialized['name'],
           serialized['type'],
           tile,
           serialized['movementSpeed']
       );
       token.UUID = token.hash = serialized['uuid'];
       return token;
   }

    move(arrayOfTiles){
        if(this.canMove(arrayOfTiles)){
            arrayOfTiles[0].token = null;
            this.tile = arrayOfTiles[arrayOfTiles.length -1];
            this.tile.token = this;
        }
    }

    simpleMove(destination_tile){
        let tiles_in_range = this.possibleDestinations;
        console.log(tiles_in_range.length);
        if(tiles_in_range.indexOf(destination_tile) >= 0){
            this.tile.token = null;
            this.tile = destination_tile;
            destination_tile.token = this;
        }
    }

    get possibleDestinations()  {
      let destinations = this.getRange(this.movementSpeed);
      return destinations;
    }
};


exports.AttackingToken = class AttackingToken extends exports.MovableToken {
    constructor(name, type, tile, movementSpeed, hp, attack){
        super(name, type, tile, movementSpeed);
        this.attack = {};
        //addAttack(attack);
        this.health = hp;
    }

      get serialized()  {
      let ret = super.serialized;
      ret['class'] = 'AttackingToken';
      return ret;
  }

  get weakSerialized()  {
      let ret = super.weakSerialized;
      ret['class'] = 'AttackingToken';
      return ret;
  }

    addAttack(name, attack){
        this.attack[name] = attack;
    }
    getPossibleAttacks(attack){
        let destination = this.getRange(attack.range);
        return destination;
    }
    hit(name, defender){
        this.attack[name].effects(this, defender);
    }
    takeDamage(damage){
        this.health -= damage;
    }
};
