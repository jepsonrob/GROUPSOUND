
var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(3000);
var io = require("socket.io")(server);
var interval = 0;
var seqArray = [];

randomizeSequencerArray = function(){ // randomizes Sequencer on/offs when called
	seqArray = [];
	for (x=0;x< 16;x++){
		seqArray.push([]);
		for (y=0;y<16;y++){
			var randomizer = Math.floor(Math.random() * 10);
				if (randomizer == 1){
					seqArray[x].push(1);
				} else {
					seqArray[x].push(0);
				}	
		}
	}
}

randomizeSequencerArray();

console.log(seqArray);

setInterval(function(){
	interval = 1;
	console.log(interval);
	setTimeout(function(){interval = 0; console.log(interval)}, 10);
	// every time 1 bar of the loop finishes this will emit a 'loopStart' event which will trigger the Tone.js sequencer starting on initial startup (or when someone restarts the loop!)
	
	
}, 2000);



app.use(express.static("./public"));



io.on("connection", function(socket) {
	console.log('Socket Connected!');

    socket.on("seqChange", function(array) { //when recieving the chat event, broadcast the message to everyone!
    	socket.broadcast.emit("seqChanged", array);
    });

	socket.emit("sequencer", seqArray);

	socket.emit("loopStart", 1);
	
	while (interval == 1){
		socket.emit("loopStart", 1);
		console.log('timer on!')
}
	

});

console.log("Starting Socket App - http://localhost:3000");



