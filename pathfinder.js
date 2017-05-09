// push startNode onto openList
// while(openList is not empty) {
//  currentNode = find lowest f in openList
//  if currentNode is final, return the successful path
//  push currentNode onto closedList and remove from openList
//  foreach neighbor of currentNode {
//      if neighbor is not in openList {
//             save g, h, and f then save the current parent
//             add neighbor to openList
//      }
//      if neighbor is in openList but the current g is better than previous g {
//              save g and f, then save the current parent
//      }
//  }

exports.pathfinding = function(possibleNodes, startNode, finalNode){
  if(!finalNode.canMoveThrough){
    return [];
  }
  let currentNode = startNode;
  let path = []
  let finalDestination = finalNode.board.whereIsTile(finalNode);
  while(possibleNodes.length !== 0){
    path.push(currentNode);
    let index;
    possibleNodes.findIndex(function(element, i, array){
      if(element.hash === currentNode.hash){
        index = i;
        return true;
      }
    });
    possibleNodes.splice(index, 1);
    //I might need to remove the start node
    if(currentNode === finalNode){
      return path;
    }
    //get currentNode.neighbors
    let nextPossibleNodes = currentNode.neighbors;
    //add g and h values where g is the cost and h is the manhatten distance. add these to get f. Choose the lowest f value.
    nextPossibleNodes.map(function(each){
      let position = each.board.whereIsTile(each);
      let g = each.cost;
      let h = Math.abs(finalDestination[0] - position[0]) + Math.abs(finalDestination[1] - position[1]);
      each.f = g + h;
    });
    nextPossibleNodes.sort(function (a, b){
      return a.f - b.f;
    });
    for(let i = 0; i < nextPossibleNodes.length; i++){
      if(nextPossibleNodes[i].canMoveThrough){
        currentNode = nextPossibleNodes[i];
        break;
      }
    }
  }
}
