exports.board = class Board {
    constructor() {
        this.mapByTiles = new Map();
        this.mapByCoords = new Map();
    }

    whereIsTile(tile) {
        return this.mapByTiles.get(tile);
    }

    tileAtPosition(x, y)  {
        try   {
            return this.mapByCoords.get(x).get(y);
        } catch(e)  {
            return undefined;
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
    }
}

exports.Tile = class Tile {
    constructor(x, y, board, special_neighbors)  {
        this.board = board;
        this.board.addTileAt(x, y, this);
        this.special_neighbors = special_neighbors || [];
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
      let neighbors = this.neighbors;
      if(neighbors.indexOf(possibleNeighbor) != -1){
        return true;
      }
      return false;
    }
}

var basicGround = {
   difficultTurrain : false,
   color : "green",
   transparent : true,
   canMoveThrough : true,
   size : 1,
   token : null
}
 var basicWall = {
   difficultTurrain : false,
   color : "gray",
   transparent : false,
   canMoveThrough : false,
   size : 1,
   token : null
}
exports.basicGround =  basicGround;
exports.basicWall =  basicWall;

var basicToken = {
   name : "unnamed token",
   movementSpeed : 5,
   canMove : function(arrayOfTiles){
    var isLegal = true;
    arrayOfTiles.map(function(each){
      if(!each.canMoveThrough){
        isLegal = false;
      }
    });
    return isLegal;
  },
  move : function(arrayOfTiles){
    if(this.canMove(arrayOfTiles)){
      arrayOfTiles[0].token = null;
      arrayOfTiles[arrayOfTiles.length -1].token = this;
    }
  }
}
exports.token =  basicToken;
