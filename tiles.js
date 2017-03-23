//classes cannot be tested with mocha at this time due to googles v8 engine not having an implimentation

class Board {
    constructor() {
        this.mapByTiles = new Map();
        this.mapByCoords = new Map();
    }

    whereIsTile(tile) {
        return this.mapByTiles(tile);
    }

    tileAtPosition(x, y)  {
        return this.mapByCoords.get([x, y]);
    }

    addTileAt(x, y, tile) {
        this.mapByTiles.set(tile, [x, y]);
        this.mapByCoords.set([x, y], tile);
    }
}

class Tile {
    constructor(board, x, y)  {
        this.board = board;
        board.addTileAt(x, y, this);
    }

    get coords  {
        return this.board.whereIsTile(this);
    }

    get x {
        return this.coords[x];
    }

    get y {
        return this.coords[1];
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
