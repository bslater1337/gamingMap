const uuid = require('uuid/v4');

exports.board = class Board {
    constructor() {
        this.mapByTiles = new Map();
        this.mapByCoords = new Map();
        this._nullTile = new exports.NullTile();
        this.UUID = this.hash = uuid();
    }

    equals(aBoard)  {
        return this.hash === aBoard.hash;
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
        let xmap = this.mapByCoords.get(x);
        if (xmap === undefined) {
            xmap = new Map();
            this.mapByCoords.set(x, xmap);
        }
        xmap.set(y, tile);
    }

    removeTileAt(x, y){
      let tile = this.mapByCoords.get(x).get(y);
      this.mapByTiles.delete(tile);
      this.mapByCoords.get(x).delete(y);
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
    constructor()  {}

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
        super();
        this.board = board;
        this.board.addTileAt(x, y, this);
        this.difficultTurrain = false;
        this.color = null;
        this.transparent = true;
        this.canMoveThrough = true;
        this.size = 1;
        this.token = null;
        this.UUID = uuid();
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
    constructor(name, type) {
        this.name = name;
        this.type = type;
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
    constructor(name, type, movementSpeed)  {
        super(name, type);
        this.movementSpeed = movementSpeed;
    }

    canMove(arrayOfTiles){
        var isLegal = true;
        for(let i = 0; i < arrayOfTiles.length; i++){
            if (!arrayOfTiles[i].canMoveThrough ||
            (i < arrayOfTiles.length-2 && arrayOfTiles[i].isNeighbor(arrayOfTiles[i+1])))   {
                isLegal = false;
                break;
            }
        }
        return isLegal;
   }

    move(arrayOfTiles){
        if(this.canMove(arrayOfTiles)){
            arrayOfTiles[0].token = null;
            arrayOfTiles[arrayOfTiles.length -1].token = this;
        }
    }
}
exports.token = new exports.MovableToken("unnamed token", "dumb token", 5);
