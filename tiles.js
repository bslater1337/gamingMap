const uuid = require('uuid/v4');

exports.board = class Board {
    constructor() {
        this.mapByTiles = new Map();
        this.mapByCoords = new Map();
        this.mapByHashes = new Map();
        this._nullTile = new exports.NullTile(this);
        this.UUID = this.hash = uuid();
    }

    get serialized() {
        let ret = {};
        ret['nullID'] = this._nullTile.hash;
        let map = ret['map'] = {};
        for (let tile of this.mapByTiles.keys())   {
            map[tile.hash] = tile.serialized;
        }
        return ret;
    }

    get weakSerialized()    {
        let ret = {};
        ret['nullID'] = this._nullTile.hash;
        let mapByHashes = ret['mapByHashes'] = {};
        let mapByCoords = ret['mapByCoords'] = {};
        for (let tile of this.mapByTiles.keys())   {
            if (mapByCoords[tile.x] === undefined)  {
                mapByCoords[tile.x] = {};
            }
            mapByCoords[tile.x][tile.y] = tile.hash;
            mapByHashes[tile.hash] = tile.coords;
        }
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

    constructTileAt(x, y, tileType, ...args)  {
      _ = new tileType(x, y, this, ...args);
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

    get weakSerialized()    {
        let ret = {
            'board': this.board.hash,
            'uuid': this.UUID,
            'color': this.color,
            'difficultTurrain': this.difficultTurrain,
            'transparent': this.transparent,
            'canMoveThrough': this.canMoveThrough,
            'size': this.size
        };
        if (this.token !== null)    {
            ret['tokens'] = [this.token.weakSerialized];
        }
        if (this.special_neighbors.length)  {
            ret['special_neighbors'] = [];
            for (let neighbor of this.special_neighbors)    {
                ret['special_neighbors'].push(neighbor.weakSerialized);
            }
        }
        return ret;
    }

    get serialized()    {
        let ret = this.weakSerialized;
        if (this.token !== null)    {
            ret['tokens'] = [this.token.serialized];
        }
        return ret;
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
    addToken(token){
      this.token = token;
    }

    removeToken(token){
      this.token = null;
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
