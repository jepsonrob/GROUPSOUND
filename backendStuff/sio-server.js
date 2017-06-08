var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(3000);
var io = require("socket.io")(server);
var fs = require("fs");

app.use(express.static("./public"));



io.on("connection", function(socket) {

    socket.on("chat", function(message) { //when recieving the chat event, broadcast the message to everyone!
    	socket.broadcast.emit("message", message);
    });

	socket.emit("message", "Hurray!");

});

console.log("Starting Socket App - http://localhost:3000");

setInterval(function(){
	// every time 1 bar of the loop finishes this will emit a 'loopStart' event which will trigger the Tone.js sequencer starting on initial startup (or when someone restarts the loop!)
	socket.emit("loopStart", 1);
}, 2000);