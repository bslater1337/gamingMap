
var map = [];
exports.map = map;

function reportErr(errString){
  console.log(errString);
}

exports.addTile = function (x, y, tile){
  if(map[x][y] === null){
    map[x][y] = tile;
  }
  else{
    reportErr("cannot add tile");
  }
}

exports.removeTile = function(x, y){
  if(map[x][y] === null){
    reportErr("cannot remove tile");
  }
  else{
    map[x][y] = null;
  }
}

exports.changeTile = function(x, y, tile){
  if(map[x][y] === null){
    reportErr("cannot add tile");
  }
  else{
    map[x][y] = tile;
  }
}

exports.changeTiles = function(arrayOfPositions){
  arrayOfPositions.map(function(each){
    if(each == null){
      exports.addTile(each.x, each.y, each.tile);
    }
    else{
      exports.changeTile(each.x, each.y, each.tile);
    }
  });
}
