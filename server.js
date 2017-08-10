

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

app.use(express.static(__dirname + '/public', {
  extensions: ['html']
}));



function sequencerObject(sequencerNumber, buttonsX, buttonsY){ // Constructor for the sequencer object
	// Declare important variables (well seeing as we're in an object, properties)
	this.buttonsX = buttonsX;
	this.buttonsY = buttonsY;
	this.totalPatterns = 10;
	this.sequencerArray = [];
	this.currentPhrase = 0; // current phrase of the sequencer.
	this.currentBeat = 0 // current beat (only used with phrase sequencer)
	this.mode = 'poly'
	
	this.makeSequencerArray = function(){ // Makes the 2d array of 0's to represent the sequencer
		for (var p=0;p<this.totalPatterns;p++){
			this.sequencerArray.push([]);
				for (var x=0;x< this.buttonsX;x++){
					this.sequencerArray[p].push([]);
					for (var y=0;y<this.buttonsY;y++){
						var randomizer = Math.floor(Math.random() * 10);
							if (randomizer == 1){
								this.sequencerArray[p][x].push(0); // change this 1 to 0 to make it generate blank sequences!
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
var sequencerTwo = new sequencerObject(3,16,16);
var sequencerTwoPhrase = new sequencerObject(4,16,10);
var sequencerThree = new sequencerObject(5,16,16);
var sequencerThreePhrase = new sequencerObject(6,16,10);
var sequencerFour = new sequencerObject(7,16,16);
var sequencerFourPhrase = new sequencerObject(8,16,10);





app.use(express.static("./public"));

// we'll probably have to keep the current effect values in an array or object.
// Haha! Hear that guy?! Nope, we'll do it with a really awkward array. That'll do it!


/*
Sliders and such:

volumeOne
volumeTwo
volumeThree
volumeFour
---
volume range: -80 - 0	
--- 
delayOne
delayTwo
delayThree
delayFour
---
delay range (wet): 0 - 100
---
delayTimeOne
delayTimeTwo
delayTimeThree
delayTimeFour
---
delay time range: 0.01 - 400 (ms)
---
delayFeedbackOne
delayFeedbackTwo
delayFeedbackThree
delayFeedbackFour
---
delay feedback range: 0 - 100
---
distOne
distTwo
distThree
distFour
---
distortion range (wet): 0 - 100
---
crushOne
crushTwo
crushThree
crushFour
---
bitCrush range: 0 - 100
--- // filters can be made using the Tone.EQ3 component: .lowFrequency and .highFrequency are useful here, and have the gain set low!
hiPassOne
hiPassTwo
hiPassThree
hiPassFour
---
lowPassOne
lowPassTwo
lowPassThree
lowPassFour
---
filter range: 20 - 20,000 (logarithmic)
---

--- Synth One - FM

--- amplitude envelope
envAttackOne (0.005 - 0.5)
envDecayOne (0.005 - 0.5)
envSustainOne (0.005 - 0.5)
envReleaseOne (0.005 - 1)
--- mod osc envelope
envAttackOneMod
envDecayOneMod
envSustainOneMod
envReleaseOneMod
--- harmonicity & mod index
harmonicityOne: 1 - 10
modIndexOne: 1-100
--- Oscillator types [Sine/Square/Sawtooth/Noise]
oscTypeOne
oscTypeOneMod


--- Synth Two (FM - same as 1.)

--- amplitude envelope
envAttackTwo
envDecayTwo
envSustainTwo
envReleaseTwo
--- mod osc envelope
envAttackTwoMod
envDecayTwoMod
envSustainTwoMod
envReleaseTwoMod
--- harmonicity & mod index
harmonicityTwo
modIndexTwo
--- Oscillator types
oscTypeTwo
oscTypeTwoMod


--- Just synth three & four
envAttackThree
envDecayThree
envSustainThree
envReleaseThree
---
envAttackFour
envDecayFour
envSustainFour
envReleaseFour
--- 
bankOne // synth 3 sample bank
bankTwo // seq 4 sample banks
bankThree
bankFour
bankFive

--- 


Synth One:
Synth:

Volume (log slider)

Main osciallator (Dropdown)
Mod Oscillator (Dropdown)

Mod Value (slider)
Harmonicity (slider)

Attack (slider)
Decay (slider)
Sustain (slider)
Release (slider)

Low-pass frequency (log slider)
High-pass frequency (log slider)

Effects:

Delay wet/dry (slider)
Delay Feedback (slider)
Delay Time (slider)

Distortion wet/dry (slider)

Bitcrush wet/dry (slider)


---

*/

var effectObjectDefault = {
	volumeOne: -20,
	volumeTwo: -15,
	volumeThree: -30,
	volumeFour: -5,
	
	synthOneModValue:1,
	synthTwoFilterFreq:15000,
	
	synthOneHarmonicity:1,
	synthTwoFilterQ:1,
	
	attackOne:0.05,
	attackTwo:0.05,
	attackOneMod:0.05,
	attackTwoMod:0.05,
	decayOne:0,
	decayTwo:0,
	decayOneMod:0,
	decayTwoMod:0,
	sustainOne:1,
	sustainTwo:1,
	sustainOneMod:1,
	sustainTwoMod:1,
	releaseOne:0.5,
	releaseTwo:0.5,
	releaseOneMod:0.5,
	releaseTwoMod:0.5,
	
	delayOne:0,
	delayTwo:0,
	delayThree:0,
	delayFour:0,
	delayFeedbackOne:0,
	delayFeedbackTwo:0,
	delayFeedbackThree:0,
	delayFeedbackFour:0,
	delayTimeOne:0,
	delayTimeTwo:0,
	delayTimeThree:0,
	delayTimeFour:0,
	
	crushOne:0,
	crushTwo:0,
	crushThree:0,
	crushFour:0,
	
	hiPassOne:20000,
	hiPassTwo:20000,
	hiPassThree:20000,
	hiPassFour:20000,
	
	lowPassOne:20,
	lowPassTwo:20,
	lowPassThree:20,
	lowPassFour:20,

}

var settingsObjectDefault = {
	synthOneOscOne: 0,
	synthOneOscTwo: 0,
	synthTwoOsc: 0,
	synthTwoFilter: 0,
	synthThreeBank: 0,
	synthThreeBankRepeat: 0,
	synthFourBank: 0,
	synthFourBankRepeat: 0,
}


var effectObject = {
	volumeOne: -20,
	volumeTwo: -15,
	volumeThree: -30,
	volumeFour: -5,
	
	synthOneModValue:1,
	synthTwoFilterFreq:15000,
	
	synthOneHarmonicity:1,
	synthTwoFilterQ:1,
	
	attackOne:0.05,
	attackTwo:0.05,
	attackOneMod:0.05,
	attackTwoMod:0.05,
	decayOne:0,
	decayTwo:0,
	decayOneMod:0,
	decayTwoMod:0,
	sustainOne:1,
	sustainTwo:1,
	sustainOneMod:1,
	sustainTwoMod:1,
	releaseOne:0.5,
	releaseTwo:0.5,
	releaseOneMod:0.5,
	releaseTwoMod:0.5,
	
	delayOne:0,
	delayTwo:0,
	delayThree:0,
	delayFour:0,
	delayFeedbackOne:0,
	delayFeedbackTwo:0,
	delayFeedbackThree:0,
	delayFeedbackFour:0,
	delayTimeOne:0,
	delayTimeTwo:0,
	delayTimeThree:0,
	delayTimeFour:0,
	
	crushOne:0,
	crushTwo:0,
	crushThree:0,
	crushFour:0,
	
	hiPassOne:20000,
	hiPassTwo:20000,
	hiPassThree:20000,
	hiPassFour:20000,
	
	lowPassOne:20,
	lowPassTwo:20,
	lowPassThree:20,
	lowPassFour:20,

}

var settingsObject = {
	synthOneOscOne: 0,
	synthOneOscTwo: 0,
	synthTwoOsc: 0,
	synthTwoFilter: 0,
	synthThreeBank: 0,
	synthThreeBankRepeat: 0,
	synthFourBank: 0,
	synthFourBankRepeat: 0,
}

var settingsArray = [
	settingsObject.synthOneOscOne, settingsObject.synthOneOscTwo, 
	settingsObject.synthTwoOsc, settingsObject.synthTwoFilter, 
	settingsObject.synthThreeBank, settingsObject.synthThreeBankRepeat, 
	settingsObject.synthFourBank, settingsObject.synthFourBankRepeat
];


var effectArray = [
	effectObject.volumeOne, effectObject.volumeTwo,effectObject.volumeThree,effectObject.volumeFour, //3
	effectObject.synthOneModValue,effectObject.synthTwoFilterFreq,effectObject.synthOneHarmonicity,effectObject.synthTwoFilterQ, //7
	effectObject.attackOne,effectObject.attackTwo,effectObject.attackOneMod,effectObject.attackTwoMod, //11
	effectObject.decayOne,effectObject.decayTwo,effectObject.decayOneMod,effectObject.decayTwoMod, // 15
	effectObject.sustainOne,effectObject.sustainTwo,effectObject.sustainOneMod,effectObject.sustainTwoMod, //19
	effectObject.releaseOne,effectObject.releaseTwo,effectObject.releaseOneMod,effectObject.releaseTwoMod,
	effectObject.delayOne,effectObject.delayTwo,effectObject.delayThree,effectObject.delayFour,
	effectObject.delayFeedbackOne,effectObject.delayFeedbackTwo,effectObject.delayFeedbackThree,effectObject.delayFeedbackFour,
	effectObject.delayTimeOne,effectObject.delayTimeTwo,effectObject.delayTimeThree,effectObject.delayTimeFour,
	effectObject.crushOne,effectObject.crushTwo,effectObject.crushThree,effectObject.crushFour,
	effectObject.hiPassOne,effectObject.hiPassTwo,effectObject.hiPassThree,effectObject.hiPassFour,
	effectObject.lowPassOne,effectObject.lowPassTwo,effectObject.lowPassThree,effectObject.lowPassFour
];

var allClients = [];
var totalClients = 0;

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

io.on("connection", function(socket) {
	
	totalClients++;
	console.log("Socket Connected! Total Clients: ", totalClients)
	allClients.push(socket);
	
	io.emit('clientNumber', totalClients);
	
	socket.on('disconnect', function() {
		totalClients = totalClients - 1;
		console.log("Client disconnected! Total Clients: ", totalClients)
		var i = allClients.indexOf(socket);
		allClients.splice(i, 1);
		io.emit('clientNumber', totalClients);
	   });
	
	// socket.emit("clientNumber", totalClients);
	socket.emit("sequencerOne", sequencerOne.sequencerArray);
	socket.emit("sequencerOnePhrase", sequencerOnePhrase.sequencerArray);
	
	socket.emit("sequencerTwo", sequencerTwo.sequencerArray);
	socket.emit("sequencerTwoPhrase", sequencerTwoPhrase.sequencerArray);
	
	socket.emit("sequencerThree", sequencerThree.sequencerArray);
	socket.emit("sequencerThreePhrase", sequencerThreePhrase.sequencerArray);
	
	socket.emit("sequencerFour", sequencerFour.sequencerArray);
	socket.emit("sequencerFourPhrase", sequencerFourPhrase.sequencerArray);
	
	socket.emit("effectStatus", effectArray);
	
	socket.emit("settingsStatus", settingsArray);
	
	socket.emit("phraseStarter", currentPhraseTime);
	
	
	
    socket.on("chat", function(chatMessage) {
		if (chatMessage[0] == 'SecretUserName123'){
		var adjustedMessage = ['<large>GODKING:CREATOR OF THIS REALM</large>', chatMessage[1], 1];
		} else {
		var adjustedMessage = [encodeHTML(chatMessage[0]), encodeHTML(chatMessage[1]), 0];
		console.log(adjustedMessage)
	}
    	socket.broadcast.emit("chatMessage", adjustedMessage);
    });

	// NOTE: everything coming into the server (effects) needs to have already been formatted according to the effect, the client can't/shouldn't have to do it on the other end.
	// for effects, we'll need a similar function to the 'seqChangeToServer' below. 
	socket.on("effectChangeToServer", function(array){
		
		socket.broadcast.emit("effectServerEdit", array); // broadcast the effect changes to everyone.
		var effectChanged = array[0] // first item of array is specific effect number changed
		var changedEffectValue = array[1]; // select changed effect from second array using first array as the selector!
		effectArray[effectChanged] = changedEffectValue; // changes the server's effect array to hold the change.
		// then change the internal array
	})
	
	socket.on("settingsOneChangeToServer", function(array){// IMPORTANT FOR MAKING SERVER BUTTONS WORK! MAKE SURE THE NAME IS RIGHT
		// IMPORTANT FOR MAKING SERVER BUTTONS WORK: Make sure the array key/value is correct. Right now it sends the sequencer number, not the right array number.
		socket.broadcast.emit("settingsOneServerEdit", array); // broadcast the effect changes to everyone.
		console.log("things are changing on the server!");
		var settingsChanged = array[0] // first item of array is specific effect number changed
		var changedSettingsValue = array[1]; // select changed effect from second array using first array as the selector!
		settingsArray[settingsChanged] = changedSettingsValue; // changes the server's effect array to hold the change.
		// then change the internal array
	})
	
	socket.on("settingsTwoChangeToServer", function(array){// IMPORTANT FOR MAKING SERVER BUTTONS WORK! MAKE SURE THE NAME IS RIGHT
		// IMPORTANT FOR MAKING SERVER BUTTONS WORK: Make sure the array key/value is correct. Right now it sends the sequencer number, not the right array number.
		socket.broadcast.emit("settingsTwoServerEdit", array); // broadcast the effect changes to everyone.
		var settingsChanged = array[0] // first item of array is specific effect number changed
		var changedSettingsValue = array[1]; // select changed effect from second array using first array as the selector!
		settingsArray[settingsChanged] = changedSettingsValue; // changes the server's effect array to hold the change.
		// then change the internal array
	})
	
    socket.on("seqChangeToServer", function(array) { //when recieving the seqChangeToServer, broadcast the message to everyone!
    	socket.broadcast.emit("seqServerEdit", array); // send the array of changes to everyone!
		// this code below changes the current server-side sequencer.
		var x = array[0];
		var y = array[1];
		var phrase = array[2];
		var sequencer = array[3];
		
		
		switch(sequencer){
		case 1:
			var workingSequencer = sequencerOne;
			break;
		case 2:
			 workingSequencer = sequencerOnePhrase;
			break;
		case 3:
			 workingSequencer = sequencerTwo;
			break;
		case 4:
			 workingSequencer = sequencerTwoPhrase;
			break;
		case 5:
			 workingSequencer = sequencerThree;
			break;
		case 6:
			 workingSequencer = sequencerThreePhrase;
			break;
		case 7:
			 workingSequencer = sequencerFour;
			break;
		case 8:
			 workingSequencer = sequencerFourPhrase;
			break;
		}
		
		if (sequencer==1 || sequencer==3 || sequencer==5 || sequencer==7){ // select note sequencers
			
			if (workingSequencer.sequencerArray[phrase][x][y] == 0 || workingSequencer.sequencerArray[phrase][x][y] < 4){
		workingSequencer.sequencerArray[phrase][x][y] = workingSequencer.sequencerArray[phrase][x][y] + 1;
				} else {
		workingSequencer.sequencerArray[phrase][x][y] = 0;
			}		
			console.log("Sequencer ", sequencer, " Change:",x,y,"= ", workingSequencer.sequencerArray[phrase][x][y]);
					
		} else if (sequencer==2 || sequencer==4 || sequencer==6 || sequencer==8){// select phrase sequencers
			console.log(sequencer, " Phrase Change:" , x, y);
					for (var f=0;f<workingSequencer.buttonsY; f++){ // loop through array to see what is on! Turn EVERYTHING (other than the clicked button) off.
						
						if (workingSequencer.sequencerArray[phrase][x][f] == 1){ // turn everything on the row to 0, then...
							workingSequencer.sequencerArray[phrase][x][f] = 0;
						} 
					
						if (workingSequencer.sequencerArray[phrase][x][y] == 0){ // turn ON the selected one!
							workingSequencer.sequencerArray[phrase][x][y] = 1;
						} 
					} // end of 'f' loop
				}
			
			
			
		
    });

});

/*setInterval(function(){

	io.sockets.emit("loopStart",1);
	console.log('timer')
	
}, 2000); */
var currentPhraseTime = 0;

setInterval(() => { // Woo! I'm using arrow functions!
    io.emit('loopStart', 1);
	currentPhraseTime = (currentPhraseTime + 1) % 16;
	console.log(currentPhraseTime);
}, 2000);

setInterval(() => {
	var timerMessage = ['SERVER','Resetting Sequencers!'];

	sequencerOne = new sequencerObject(1,16,16);
	sequencerOnePhrase = new sequencerObject(2,16,10);
	sequencerTwo = new sequencerObject(3,16,16);
	sequencerTwoPhrase = new sequencerObject(4,16,10);
	sequencerThree = new sequencerObject(5,16,16);
	sequencerThreePhrase = new sequencerObject(6,16,10);
	sequencerFour = new sequencerObject(7,16,16);
	sequencerFourPhrase = new sequencerObject(8,16,10);
	
	socket.broadcast.emit("chatMessage", adjustedMessage);
	
	socket.broadcast.emit("sequencerOne", sequencerOne.sequencerArray);
	socket.broadcast.emit("sequencerOnePhrase", sequencerOnePhrase.sequencerArray);
	
	socket.broadcast.emit("sequencerTwo", sequencerTwo.sequencerArray);
	socket.broadcast.emit("sequencerTwoPhrase", sequencerTwoPhrase.sequencerArray);
	
	socket.broadcast.emit("sequencerThree", sequencerThree.sequencerArray);
	socket.broadcast.emit("sequencerThreePhrase", sequencerThreePhrase.sequencerArray);
	
	socket.broadcast.emit("sequencerFour", sequencerFour.sequencerArray);
	socket.broadcast.emit("sequencerFourPhrase", sequencerFourPhrase.sequencerArray);
	
	
	
}, 900000)

console.log("Starting Socket App - http://localhost:8080");



