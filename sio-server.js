

/* TO DO!

Keep track of changes - save every bean change and timestamp it!
Allow all sequencers and parameters to be shared!
Create all sequencers
LOADING SCREEN!

THINGS ONLY SEEM TO HAPPEN EACH BAR, THIS IS NOT GOOOOOD!


*/


var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(8080);
var io = require("socket.io")(server);
var interval = 0;


function sequencerObject(sequencerNumber, buttonsX, buttonsY){ // Constructor for the sequencer object
	// Declare important variables (well seeing as we're in an object, properties)
	this.buttonsX = buttonsX;
	this.buttonsY = buttonsY;
	this.totalPatterns = 10;
	this.sequencerArray = [];
	this.currentPhrase = 0; // current phrase of the sequencer.
	
	this.makeSequencerArray = function(){ // Makes the 2d array of 0's to represent the sequencer
		for (var p=0;p<this.totalPatterns;p++){
			this.sequencerArray.push([]);
				for (var x=0;x< this.buttonsX;x++){
					this.sequencerArray[p].push([]);
					for (var y=0;y<this.buttonsY;y++){
						var randomizer = Math.floor(Math.random() * 10);
							if (randomizer == 1){
								this.sequencerArray[p][x].push(1); // change this 1 to 0 to make it generate blank sequences!
							} else {
								this.sequencerArray[p][x].push(0);
							}	
				}	
			}
		}
	} // end function ...
		
	this.makeSequencerArray(); // ... and immediately call it!
	
	// NOTE: sequencerArray[p][x][y] works as follows: sequencerArray[phrase][x][y]
	
	this.changeSequencer = function(x,y){ //changes the sequencer's array according to current phrase
		if (this.sequencerArray[this.currentPhrase][x][y] == 1){
			this.sequencerArray[this.currentPhrase][x][y] = 0;
		} else {
			this.sequencerArray[this.currentPhrase][x][y] = 1;
		}
	}
	
	this.sequencerNumber = sequencerNumber; // a glorified label!
	
} // end object constructor

var sequencerOne = new sequencerObject(1,16,16);
var sequencerOnePhrase = new sequencerObject(2,16,10);


/*
// Working version of the sequencer array builder... but only works for the global variable seqArray!
randomizeSequencerArray = function(){ // randomizes Sequencer on/offs when called
	seqArray = [];
	for (var p=0;p<10;p++){ // 10 phrases
		seqArray.push([]);
	for (var x=0;x< 16;x++){ // 16 columns
		seqArray[p].push([]);
			for (var y=0;y<16;y++){ // 16 rows
				var randomizer = Math.floor(Math.random() * 10);
					if (randomizer == 1){
						seqArray[p][x].push(0); // change this 1 to 0 to make it generate blank sequences!
					} else {
						seqArray[p][x].push(0);
					}	
				}
			}
		}
	}

randomizeSequencerArray();
*/



app.use(express.static("./public"));



io.on("connection", function(socket) {
	socket.emit("sequencerOne", sequencerOne.sequencerArray);
	socket.emit("sequencerOnePhrase", sequencerOnePhrase.sequencerArray);
	console.log('Socket Connected!');

    socket.on("seqChangeToServer", function(array) { //when recieving the seqChangeToServer, broadcast the message to everyone!
    	socket.broadcast.emit("seqChanged", array); // send the array of changes to everyone!
		// this code below changes the current server-side sequencer.
		var x = array[0];
		var y = array[1];
		var phrase = array[2];
		var sequencer = array[3];
		console.log(sequencer);
		
		if (sequencer==1){
		if (sequencerOne.sequencerArray[phrase][x][y] == 1){
			sequencerOne.sequencerArray[phrase][x][y] = 0;
			console.log("Sequencer One Change:",x,y,"= 0");
		} else {
			sequencerOne.sequencerArray[phrase][x][y] = 1;
			console.log("Sequencer One Change:",x,y,"= 1");
		}
		} else if (sequencer==4){ // 4 is the phrase sequencer on the client-side, confusingly.
			if (sequencerOnePhrase.sequencerArray[phrase][x][y] == 1){
				sequencerOnePhrase.sequencerArray[phrase][x][y] = 0;
				console.log("Phrase Change:",x,y,"= 0");
			} else {
				sequencerOnePhrase.sequencerArray[phrase][x][y] = 1;
				console.log("Phrase Change:", x,y,"= 1");
		}
	}
    });

	
	
});

setInterval(function(){

	io.sockets.emit("loopStart", 1);
	console.log('timer')
	
}, 2000);

console.log("Starting Socket App - http://localhost:8080");



