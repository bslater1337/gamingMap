const uuid = require('uuid/v4');

exports.board = class Board {
    constructor() {
        this.mapByTiles = new Map();
        this.mapByCoords = new Map();
        this.mapByHashes = new Map();
        this._nullTile = new exports.NullTile(this);
        this.UUID = this.hash = uuid();
    }

    equals(aBoard)  {
        return this.hash === aBoard.hash;
    }

    getTileByHash(hash) {
        return this.mapByHashes.get(hash);
    }

    whereIsTile(tile) {
        return this.mapByTiles.get(tile);
    }

    tileAtPosition(x, y)  {
        try   {
            return this.mapByCoords.get(x).get(y) || this._nullTile;
        } catch(e)  {
            return this._nullTile;
        }
    }

    addTileAt(x, y, tile) {
        this.mapByTiles.set(tile, [x, y]);
        if (tile !== null && tile !== undefined)    {
            this.mapByHashes.set(tile.hash, tile);
        }
        let xmap = this.mapByCoords.get(x);
        if (xmap === undefined) {
            xmap = new Map();
            this.mapByCoords.set(x, xmap);
        }
        xmap.set(y, tile);
    }

    removeTileAt(x, y){
      if(this.mapByCoords.get(x) === undefined){
        return this._nullTile;
      }
      let tile = this.mapByCoords.get(x).get(y);
      this.mapByTiles.delete(tile);
      this.mapByCoords.get(x).delete(y);
      if (tile !== null && tile !== undefined)  {
          this.mapByHashes.delete(tile.hash);
      }
      if (this.mapByCoords.get(x).size === 0) {
          this.mapByCoords.delete(x);
      }
      return tile;
    }

    changeTileAt(x, y, tile){
      this.removeTileAt(x, y);
      this.addTileAt(x, y, tile);
    }

    changeTiles(arrayOfTilesChanges){
      arrayOfTilesChanges.map(function(each){
        if(this.tileAtPosition(each.x, each.y) === null){
          this.addTileAt(each.x, each.y, each.tile);
        }
        else{
          this.changeTileAt(each.x, each.y, each.tile);
        }
      });
    }

    findNeighbors(tile){
      let coords = this.whereIsTile(tile);
      let modifiers = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ];
      let neighbors = [];
      for (let mod of modifiers)  {
        if(this.tileAtPosition(coords[0] + mod[0], coords[1] + mod[1]) !== undefined){
          neighbors.push(this.tileAtPosition(coords[0] + mod[0], coords[1] + mod[1]));
        }
      }
      return neighbors;
    }
}

const NullUUID = uuid();

exports.NullTile = class NullTile {
    constructor(board)  {
        this.board = board;
    }

    get neighbors() {
        return [];
    }

    get hash()  {
        return this.UUID || NullUUID;
    }

    equals(aTile)   {
        return this.hash === aTile.hash;
    }

    isNeighbor()  {
      return false;
    }
}

exports.Tile = class Tile extends exports.NullTile {
    constructor(x, y, board, special_neighbors) {
        super(board);
        this.UUID = uuid();
        this.board.addTileAt(x, y, this);
        this.difficultTurrain = false;
        this.color = null;
        this.transparent = true;
        this.canMoveThrough = true;
        this.size = 1;
        this.token = null;
        this.special_neighbors = special_neighbors || [];
        for (let neighbor of this.special_neighbors) {
            if (neighbor.special_neighbors !== undefined)   {
                neighbor.special_neighbors.push(this);
            }
        }
    }

    get coords()  {
        return this.board.whereIsTile(this);
    }

    get x() {
        return this.coords[0];
    }

    get y() {
        return this.coords[1];
    }

    get neighbors() {
        let neighbors = this.board.findNeighbors(this);
        return this.special_neighbors.concat(neighbors);
    }

    isNeighbor( possibleNeighbor){
        for (let neighbor of this.neighbors)   {
            if (neighbor instanceof exports.NullTile && possibleNeighbor instanceof exports.NullTile)   {
                if (possibleNeighbor.equals(neighbor))  {
                    return true;
                }
            }
        }
        return false;
    }
}

exports.basicGround = class basicGround extends exports.Tile {

}
exports.basicWall = class basicWall extends exports.Tile {
  constructor(x, y, board, special_neighbors)  {
      super(x, y, board, special_neighbors);
      this.canMoveThrough = false;
  }
  /*
   difficultTurrain : false,
   color : "gray",
   transparent : false,
   canMoveThrough : false,
   size : 1,
   token : null
   */
}

exports.Token = class Token {
    constructor(name, type, tile) {
        this.name = name;
        this.type = type;
        this.tile = tile;
        // this.tile.addToken(this);
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
        // let visited = new Set([this.tile.hash]);
        // let this_time = this.tile.neighbors;
        // let next_time = [];
        // let range = this.movementSpeed;
        //
        // while (this_time.size && range) {
        //     for (let tile of this_time) {
        //         for (let neighbor of tile.neighbors)    {
        //             if (!visited.has(neighbor.hash))    {
        //                 next_time.push(tile);
        //             }
        //         }
        //         visited.add(tile.hash);
        //     }
        //     range--;
        //     this_time = next_time;
        //     next_time = [];
        // }
        // for (let tile of this_time) {
        //     visited.add(tile.hash);
        // }
        // return visited;
    }
}
exports.token = new exports.MovableToken("unnamed token", "dumb token", undefined, 5);
