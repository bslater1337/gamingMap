
$(function () {
  var socket = io();
  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d");
  //ctx.fillStyle = "#FF0000";
  //ctx.fillRect(0,0,70,70);
  var canvas = new fabric.Canvas('c', { selection: false });
  var grid = 50;
  var squares = [];
  // create grid
  function createGrid(){
    for (var i = 0; i < (600 / grid); i++) {
      canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#ccc', selectable: false }));
      canvas.add(new fabric.Line([ 0, i * grid, 600, i * grid], { stroke: '#ccc', selectable: false }))
    }
  }
  createGrid();
  // add objects This for loop will create test objects for the GUI
  for(i=0; i < 4; i++){
    let test = new fabric.Rect({
      left: i * 100,
      top: i * 100,
      width: 50,
      height: 50,
      fill: '#faa',
      originX: 'left',
      originY: 'top',
      centeredRotation: true,
      id: i
    });
    squares.push(test);
    test = null;
  }

  //console.log(canvas);
  squares.forEach(function(element){
    canvas.add(element)
  });
  // snap to grid
  function updateCanvas(grid){
    //console.log(grid);
    let items = [];
    grid._objects.forEach(function(element){

      if('id' in element){
        items.push({left: element.left, top: element.top, id: element.id});
      }
    });
    console.log(items)
    socket.emit('client map update', items);
  }
  canvas.on('object:modified', function(options) {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid
    });
    updateCanvas(this)
  });


  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
  socket.on('server map update', function(msg){
    var test = msg
    canvas.clear()
    createGrid();
    console.log(test)
    test.forEach(function(element){
      let new_rect = new fabric.Rect({
        left: element.left,
        top: element.top,
        width: 50,
        height: 50,
        fill: '#faa',
        originX: 'left',
        originY: 'top',
        centeredRotation: true,
        id: element.id
      });
      canvas.add(new_rect)
    });
  });

});
