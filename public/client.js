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
  function escapeHTML(theString) {
	return theString
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\//g, "&#47;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
  createGrid();
  //add objects This for loop will create test objects for the GUI
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
    console.log('change');
    grid._objects.forEach(function(element){
      //check for token moving
      if('tile' in element){
        items.push({
          left: element.left,
          top: element.top,
          tile: element.tile,
          uuid: element.uuid,
          old_coords: element.original_coords
        });
      }

    });
    items.forEach(function(each){
        console.log(each.old_coords);
      if(each.top !== each.old_coords[1] * 50 || each.left !== each.old_coords[0] * 50){
        move_obj = {
          tile: each.tile,
          old_coords: each.old_coords,
          new_coords: [each.top / 50, each.left / 50]
        };
        canvas.clear()
        socket.emit('move token', move_obj);
      }
    });
    //console.log(items)
    socket.emit('client map update', items);
  }

  canvas.on('object:modified', function(options) {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid
    });
    updateCanvas(this)
  });

  canvas.on('mouse:down', function(e){
    if('tile' in e.target){
      console.log('mousedown on tile ' + e.target.tile);
      socket.emit('token selected', [e.target.top / 50, e.target.left / 50]);
    }
  });

  socket.on("possible moves", function(msg){
    for(var each in canvas._objects){
        msg.forEach(function(element){
           if(canvas._objects[each].uuid === element){
               //console.log(canvas._objects[each]);
               let thing = new fabric.Rect({
                   left: canvas._objects[each].left,
                   top: canvas._objects[each].top ,
                   width: 50,
                   height: 50,
                   fill: "FFFFFF",
                   originX: 'left',
                   originY: 'top',
                   centeredRotation: true,
                   id: i
               });
               canvas.add(thing);
               //canvas._objects[each].fill = "FFFFFF";
               //console.log(canvas._objects[each]);
               //canvas.renderAll();
               //updateCanvas()
           }
        });
    }
    canvas.renderAll();
  });

  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  socket.on("loginValidation", function(msg){  //server returns boolean - success
 		if(msg){ //this should only happen on a valid login
 			$("#loginScreen").hide();
 		  //$("#rules").hide();
 			//$(".userTable").show();
 			//$("#ready").show();
 		}
 		else{
 			alert("Username may be taken or password may be incorrect, try again.");
 		}
 	});

  socket.on('server map update', function(msg){
    test = null;
    test = msg.map;
    canvas.clear()
    createGrid();
    tokens_to_write = []
    console.log('clearing canvas');
    //console.log(test);
    Object.keys(test).forEach(function(element){
        //console.log(test[element]);
        //console.log(test[element].uuid);
        let new_rect = null;
        if(test[element].type === "basicWall"){
            new_rect = new fabric.Rect({
                left: test[element].coords[1] * 50,
                top: test[element].coords[0] * 50,
                width: 50,
                height: 50,
                fill: '#888888',
                originX: 'left',
                originY: 'top',
                centeredRotation: true,
                uuid: test[element].uuid
            });
        }
        else {
            new_rect = new fabric.Rect({
                left: test[element].coords[1] * 50,
                top: test[element].coords[0] * 50,
                width: 50,
                height: 50,
                fill: '#ADFF2F',
                originX: 'left',
                originY: 'top',
                centeredRotation: true,
                uuid: test[element].uuid
            });
        }

      squares.push(new_rect);
      new_rect.hasControls = false;
      canvas.add(new_rect);
      if ('tokens' in test[element]){
        //console.log(test[element].tokens);
        new_circle = new fabric.Circle({
          radius: 25,
          fill: 'red',
          left: test[element].coords[1] * 50,
          top: test[element].coords[0] * 50,
          uuid: test[element].tokens[0].uuid,
          tile: element,
          original_coords: test[element].coords
        });
        tokens_to_write.push(new_circle);
        //canvas.add(new_circle);
      }
      new_rect = null;
    });
    tokens_to_write.forEach(function(element){
        canvas.add(element);
    })
  });

  function login(message){
 		user = $("#username").val();
 		var userCredentials = {
 			username: user,
 			password: $("#password").val()
 		};
 		userCredentials.username = escapeHTML(userCredentials.username); //sanitize the input username before sending it to the server
 		userCredentials.password = escapeHTML(userCredentials.password); //sanitize the input password before sending it to the server
 		userCredentials.message = message;
 		socket.emit("login", userCredentials);
 	}
 	$("#loginButton").click(function(){
    login("login");
    console.log('clicked login button');
  });
 	$("#createButton").click(function(){
    login("create");
    console.log('clicked create button');
  });
});
