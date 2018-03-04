
$(function () {
  var socket = io();
  // var canvas = document.getElementById("myCanvas");
  // var ctx = canvas.getContext("2d");
  // ctx.fillStyle = "#FF0000";
  // ctx.fillRect(0,0,70,70);
  var canvas = new fabric.Canvas('c', { selection: false });
  var grid = 50;

  // create grid
  for (var i = 0; i < (600 / grid); i++) {
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#ccc', selectable: false }));
    canvas.add(new fabric.Line([ 0, i * grid, 600, i * grid], { stroke: '#ccc', selectable: false }))
  }

  // add objects
  canvas.add(new fabric.Rect({
    left: 100,
    top: 100,
    width: 50,
    height: 50,
    fill: '#faa',
    originX: 'left',
    originY: 'top',
    centeredRotation: true
  }));
  // snap to grid

  canvas.on('object:moving', function(options) {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid
    });
  });

  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

});
