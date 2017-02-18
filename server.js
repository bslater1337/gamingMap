
var map = [][];

function reportErr(errString){
  console.log(errString);
}

function addTile(x, y, tile){
  if(map[x][y] === null){
    map[x][y] = tile;
  }
  else{
    reportErr("cannot add tile");
  }
}

function removeTile(x, y){
  if(map[x][y] === null){
    reportErr("cannot remove tile");
  }
  else{
    map[x][y] = null;
  }
}

function changeTile(x, y, tile){
  if(map[x][y] === null){
    reportErr("cannot add tile");
  }
  else{
    map[x][y] = tile;
  }
}
