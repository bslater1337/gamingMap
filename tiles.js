

exports.basicGround = {
  var difficultTurrain = false;
  var color = "green";
  var transparent = true;
  var canMoveThrough = true;
  var size = 1;
  var hasToken = false;
}

exports.basicWall = {
  var difficultTurrain = false;
  var color = "gray";
  var transparent = false;
  var canMoveThrough = false;
  var size = 1;
  var hasToken = false;
}

exports.token = {
  var name = "needs name";
  var movementSpeed = 5;
  var x = 0;
  var y = 0;
  var move = function(arrayOfTiles){
    var isLegal = true;
    isLegal = arrayOfTiles.map(function(each){
      if(each.canMoveThrough){

      }
      else{
        isLegal = false;
      }
    });
    return isLegal;
  }
}
