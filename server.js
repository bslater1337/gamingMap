
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

function makeLineOfTiles(x1, y1, x2, y2, tile){
  var smaller, larger;
  if(y1 == y2){
    //find the smaller x value
    if(x1 < x2){
      smaller = x1;
      larger = x2;
    }
    else{
      smaller = x2;
      larger = x1;
    }
    //create loop to change tiles or add tiles
    while(smaller < larger){
      if(map[smaller][y1] == null){
        addTile(smaller, y1);
        smaller++;
      }
      else{
        changeTile(smaller, y1);
        smaller++;
      }
    }
  }
  else if(x1 == x2){
    //find the smaller y value
    if(y1 < y2){
      smaller = y1;
      larger = y2;
    }
    else{
      smaller = y2;
      larger = y1;
    }
    while(smaller < larger){
      if(map[smaller][y1] == null){
        addTile(x1, smaller);
        smaller++;
      }
      else{
        changeTile(x1, smaller);
        smaller++;
      }
    }
  }
  else{
    reportErr("line not in bounds");
  }
}
