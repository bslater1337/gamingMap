const uuid = require('uuid/v4');

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

    equals(aToken)  {
        return this.hash === aToken.hash;
    }

    canMove()   {
        return false;
    }
}

exports.MovableToken = class MovableToken extends exports.Token {
    constructor(name, type, tile, movementSpeed)  {
        super(name, type, tile);
        this.movementSpeed = movementSpeed;
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

    move(arrayOfTiles){
        if(this.canMove(arrayOfTiles)){
            arrayOfTiles[0].token = null;
            this.tile = arrayOfTiles[arrayOfTiles.length -1];
            this.tile.token = this;
        }
    }

    get possibleDestinations()  {
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

        let arr = visit(this.tile, this.movementSpeed);
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
}
exports.token = new exports.MovableToken("unnamed token", "dumb token", undefined, 5);
