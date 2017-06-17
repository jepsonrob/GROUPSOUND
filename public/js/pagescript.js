

// Socket.io stuff

StartAudioContext(Tone.context, "#playButton", function(){
	console.log('context online!');
})


var socket = io.connect();
var firstPlay = 0; // set up a variable for the firstPlay of the loop, turned on by the server.

// server functions

function setTitle(title) {
    document.querySelector("h1").innerHTML = title;
}

function sequencerChanges(x,y,phrase,sequencer){
	var array = [x,y,phrase,sequencer];
	socket.emit("seqChangeToServer", array);
}

function seqChanged(array){
	var x = array[0];
	var y = array[1];
	var seq = array[2];
	sequencerOne.changeSequencer(x,y,phrase,seq);
}

// event listeners

socket.on("disconnect", function() { 
	setTitle("Disconnected");
});

socket.on("connect", function() {
	setTitle("Connected");
	// loadSequence();
});

socket.on("loopStart", function() {
	// start loop playing! ... hopefully at the correct time!
	//start();
		
});


socket.on("seqServerEdit", function(array){ // When the server broadcasts an array change, change the arrays!

	var x = array[0];
	var y = array[1];
	var phrase = array[2];
	var seq = array[3];
	switch (seq){ // takes the sequencer's number into the switch and sends the info to the right sequencer.
	case 1:
		sequencerOne.changeSequencer(x,y,phrase); 
		break;
	case 2: 
		sequencerOnePhrase.changeSequencer(x,y,phrase,'phrase');
		break;
	case 3:
		sequencerTwo.changeSequencer(x,y,phrase); 
		break;
	case 4: 
		sequencerTwoPhrase.changeSequencer(x,y,phrase,'phrase');
		break;
	case 5:
		sequencerThree.changeSequencer(x,y,phrase); 
		break;
	case 6: 
		sequencerThreePhrase.changeSequencer(x,y,phrase,'phrase');
		break;
	case 7:
		sequencerFour.changeSequencer(x,y,phrase); 
		break;
	case 8: 
		sequencerFourPhrase.changeSequencer(x,y,phrase,'phrase');
		break;
	}
});

// initial sequencer state loaders
socket.on("sequencerOne", function(message) {
	sequencerOne.sequencerArray = message;
});

socket.on("sequencerOnePhrase", function(message) {
	sequencerOnePhrase.sequencerArray = message;
});

socket.on("sequencerTwo", function(message) {
	sequencerTwo.sequencerArray = message;
});

socket.on("sequencerTwoPhrase", function(message) {
	sequencerTwoPhrase.sequencerArray = message;
});

socket.on("sequencerThree", function(message) {
	sequencerThree.sequencerArray = message;
});

socket.on("sequencerThreePhrase", function(message) {
	sequencerThreePhrase.sequencerArray = message;
});

socket.on("sequencerFour", function(message) {
	sequencerFour.sequencerArray = message;
});

socket.on("sequencerFourPhrase", function(message) {
	sequencerFourPhrase.sequencerArray = message;
});



// Stuff below is for making a chat room
/*
function loadSequence(message){ // initial loading of the sequencer - needs work!
	sequencerOne.sequencerArray = message;
}



/* 
// Sends the information in the textbox to the server as event 'chat'
document.forms[0].onsubmit = function () {
    var input = document.getElementById("message");
    printMessage(input.value);
    socket.emit("chat", input.value);
    input.value = '';
};



/*function printMessage(message) {
    var p = document.createElement("p");
    p.innerText = message;
    document.querySelector("div.messages").appendChild(p);
}

*/


	/* TO DO

		CLEAN EVERYTHING UP!

	
	The larger plan:
	End goal - a multi-sequencer workstation utilising websockets (and node.js) for many connections to the same workspace.


	Front end:
		- make it look good!
		- make it responsive & working on mobile!
		- Make the sequencers change through the css display:hide element and buttons. 
		- Make the sequencers look nice and stuff with colours.
		- Title, footer, links... all the standard making a website bullshit.
		- Make the sliders look nicer and open when you press an 'advanced' button

	Client Code:
		- The wonderful notes function doesn't work... fix it!
		- Slider 'go' button for fake automation - slider moves over the course of one sequence like throught the line~ object in max.
		- Encapsulate this script so there are no global variables, and make sure all buttons are pressed with event listeners/jQuery selectors.
		- Switch out sequencers within the canvas! ... Through it may be easier to CSS 'show' and 'hide'.

	Server Code:
		- Save and load sequencer JSON files on server on/off
		- How to make them start at the same time!?
		- Get the synth settings changes input and then broadcast!
			(Number recieved will be the number to go to, client side then automates current number to move towards it at the rate of 1 bar.)
		- Make the chat room.

	
	Client audio plan:

		Sequencer design: ALLOW FOR DYNAMICS! :D 
			- Four dynamic ranges (1,2,3,4), amount of presses on a sequencer button adds to velocity until it turns off. This also changes the colour of the button and makes it darker.

		FOUR SEQUENCERS (with 4 phrase sequencers):
			- Percusson / Bass / Samples / Synthesizer
	
		Percussion: sampled
		Kicks / Snare / Hats / Other
		Bass / Harmony / Melody: Synthesized.

		Harmony: Sampled (w/ bank switching)
		Piano / Violin (switch out note length, when at lowest become pizzicato) / Harp / E. Piano(?) / 

	Effects for each: Distortion, Reverb, Delay, Bitcrush, Chorus, Tremolo.

	Synthesizers:
		2 Oscillators	[Sine/Square/Sawtooth/Noise]
		1 FM Oscillator [Sine/Square/Sawtooth/Noise]
		Oscillator level/gain
		Pitch change - Octave, Semitone, Detune
		Pitch Envelope

		2 Filters [ "lowpass", "highpass", "bandpass", "notch"]
		
		


	
	
	*/
	
	// Create canvas contexts for all 8 sequencers
	var c = document.getElementById("sequencerOne");
	var ctx=c.getContext("2d");
	
	var cTwo = document.getElementById("sequencerOnePhrase");
	var ctxTwo=cTwo.getContext("2d");
	
	var cThree = document.getElementById("sequencerTwo");
	var ctxThree=cThree.getContext("2d");
	
	var cFour = document.getElementById("sequencerTwoPhrase");
	var ctxFour=cFour.getContext("2d");
	
	var cFive = document.getElementById("sequencerThree");
	var ctxFive=cFive.getContext("2d");
	
	var cSix = document.getElementById("sequencerThreePhrase");
	var ctxSix=cSix.getContext("2d");
	
	var cSeven = document.getElementById("sequencerFour");
	var ctxSeven=cSeven.getContext("2d");
	
	var cEight = document.getElementById("sequencerFourPhrase");
	var ctxEight=cEight.getContext("2d");
	
	function sequencerObject(sequencerNumber, buttonsX, buttonsY, squareSize, gapSize){ // Constructor for the sequencer object
		// Declare important variables (well we're in an object, properties)
		this.squareSize = squareSize || 20;
		this.gapSize = gapSize || 1;
		this.buttonsX = buttonsX;
		this.buttonsY = buttonsY;
		this.totalPatterns = 10;
		this.currentPhrase = 0;
		this.currentBeat = 0;
		this.currentView = 0; // current user phrase view.
		this.viewType = 'live'; // other option is 'phrase'. Live is default.
		this.mode = 'poly';
		this.sequencerArray = [];
		
		
		this.makeSequencerArray = function(){ // Makes the 2d array of 0's to represent the sequencer
			for (var p=0;p<this.totalPatterns;p++){
				this.sequencerArray.push([]);
					for (var x=0;x< this.buttonsX;x++){
						this.sequencerArray[p].push([]);
						for (var y=0;y<this.buttonsY;y++){
						this.sequencerArray[p][x].push(0)
					}	
				}
			}
		} // end function ...
			
		this.makeSequencerArray(); // ... and immediately call it!

		
		this.changeSequencer = function(x,y,phr,mode){
			if (mode == 'phrase'){
				for (var f=0;f<this.buttonsY; f++){ 
					
					if (this.sequencerArray[phr][x][f] == 1){ // turn everything on the row to 0, then...
						this.sequencerArray[phr][x][f] = 0;
					} 
					if (this.sequencerArray[phr][x][y] == 0){ // turn ON the selected one!
						this.sequencerArray[phr][x][y] = 1;
					} 
				} // end of 'f' loop
			} else {
				if (this.sequencerArray[phr][x][y] == 1){
					this.sequencerArray[phr][x][y] = 0;
				} else {
					this.sequencerArray[phr][x][y] = 1;
			}
			}
		} // LIKELY BUG! When the sequencer is in phrase mode and only has one on a colum at a time, this will fuck it up! Watch out!
		
		this.sequencerNumber = sequencerNumber; // numbers the sequencers in a hacky tech-debt way! Yay!
	
		
	} // end object constructor
	
	
	// Create the sequencers as needed
	var sequencerOne = new sequencerObject(1,16,16,15,1);
	var sequencerOnePhrase = new sequencerObject(2,16,10,15,1);
	var sequencerTwo = new sequencerObject(3,16,16,15,1);
	var sequencerTwoPhrase = new sequencerObject(4,16,10,15,1);
	var sequencerThree = new sequencerObject(5,16,16,15,1);
	var sequencerThreePhrase = new sequencerObject(6,16,10,15,1);
	var sequencerFour = new sequencerObject(7,16,16,15,1);
	var sequencerFourPhrase = new sequencerObject(8,16,10,15,1);
	
	// set the mode on the phrase sequencers
	sequencerOnePhrase.mode = 'phrase';
	sequencerTwoPhrase.mode = 'phrase';
	sequencerThreePhrase.mode = 'phrase';
	sequencerFourPhrase.mode = 'phrase';
	
	
	
	
	// Canvas & UI functions
	function clearCanvas(canvas){
		canvas.clearRect(0,0,500,500);    
		canvas.fillStyle = 'rgba(255,255,255,1)';  
		canvas.fillRect(0,0,500,500); 
	}
	
	function clearGrid(canvas, sequencer, phrase){
		for (var x=0; x<sequencer.buttonsX; x++){
			for (var y=0; y<sequencer.buttonsY;y++){
				sequencer.sequencerArray[phrase][x][y] = 0;
			}
		}
		clearCanvas(canvas);
		drawGrid(canvas, sequencer, phrase);
	}
	

function drawGrid(canvas, sequencer, beat, phrase, colourOff, colourOn){ // Draws the grid and changes the colour of any buttons that are currently 'on'
	
	clearCanvas(canvas); // Delete previous canvas for redraw!
	
	if (sequencer.viewType == 'live'){ // select the view type
		var currentPhrase = sequencer.currentPhrase;
	} else if (sequencer.viewType == 'phrase') {
		currentPhrase = sequencer.currentView;
	}
	
	for (var x=0; x<sequencer.buttonsX; x++){ // draws the grid with 2 loops
		for (var y=0; y<sequencer.buttonsY;y++){
			var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
			var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;
			
				if (sequencer.sequencerArray[currentPhrase][x][y] == 1){ // TRUE when the array bean is on.
					if (currentPhrase == sequencer.currentPhrase && beat!=x){ // TRUE when it is not the beat and ... you know what? I trial'd and error's this conditional. I'm a hack. I don't know how it works, but it does. Let's just let that go and get on with our lives.
					canvas.fillStyle= colourOn || "rgb(255,60,60)"; // fill with 'on' colour
					canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);
					} else if (currentPhrase != sequencer.currentPhrase) {
						canvas.fillStyle= colourOn || "rgb(255,60,60)"; // fill with 'on' colour
						canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);
					}
					
				} else if (sequencer.sequencerArray[currentPhrase][x][y] == 1 && beat==x){
					
						canvas.fillStyle= "rgb(255,255,255)"; // fill with colour on the beat
						canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);

				} else {
					if (x == 0 || x == 4 || x ==8 || x ==12){
					canvas.fillStyle = "rgb(100,100,100)"; // Fill with regular colour
					canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);
					} else {
					canvas.fillStyle = colourOff || "rgb(60,60,60)"; // Fill with regular colour
					canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);
					}
				}  
		}
	}
	
	if (currentPhrase == sequencer.currentPhrase){
		// Draw the playhead according to the beat.
		var visualTempo = beat * ((sequencer.gapSize * 2) + sequencer.squareSize); // size of the playhead
		canvas.fillStyle="rgba(102,255,51,0.5)";
		canvas.fillRect(visualTempo, 0, (sequencer.gapSize + sequencer.squareSize),(sequencer.squareSize + (sequencer.gapSize * 2)) * sequencer.buttonsY);
	
	}
}

// Draw the canvas elements fo' the first time. Defaulting at Beat 1, Phrase 1.
drawGrid(ctx, sequencerOne, 0, 0);
drawGrid(ctxTwo, sequencerOnePhrase, 0, 0);

drawGrid(ctxThree, sequencerTwo, 0, 0);
drawGrid(ctxFour, sequencerTwoPhrase, 0, 0);

drawGrid(ctxFive, sequencerThree, 0, 0);
drawGrid(ctxSix, sequencerThreePhrase, 0, 0);

drawGrid(ctxSeven, sequencerFour, 0, 0);
drawGrid(ctxEight, sequencerFourPhrase, 0, 0);


c.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctx,sequencerOne,sequencerOne.currentView);
});

cTwo.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxTwo,sequencerOnePhrase,0);
});


cThree.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxThree,sequencerTwo,sequencerTwo.currentView);
});

cFour.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxFour,sequencerTwoPhrase,0);
});

cFive.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxFive,sequencerThree,sequencerThree.currentView);
});

cSix.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxSix,sequencerThreePhrase,0);
});

cSeven.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxSeven,sequencerFour,sequencerFour.currentView);
});

cEight.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	clickEdit(e.layerX,e.layerY,ctxEight,sequencerFourPhrase,0);
});



function clickEdit(xClick,yClick, canvas, sequencer, phrase){ // Draws the grid and changes the colour of any buttons that are currently 'on'
		// Changed from arrayEdit() to clickInput() for modular-ity
	for (var x=0; x<sequencer.buttonsX; x++){
		for (var y=0; y<sequencer.buttonsY;y++){
				var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
				var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;
				// Yeah I'm pretty sure there's a better way of doing this bit above but oh well.
				
			if (xClick > loopX && xClick < (loopX + sequencer.squareSize) && yClick > loopY && yClick < (loopY + sequencer.squareSize)){
				arrayEdit(canvas, sequencer,x,y,phrase)
			}
		} // end of y loop
	} // end of x loop
} // end of function
	

function arrayEdit(canvas, sequencer, x, y, phrase){

	if (sequencer.mode == 'poly'){
		sequencerChanges(x,y,phrase, sequencer.sequencerNumber); // sends changes direct to server to broadcast
			if (sequencer.sequencerArray[phrase][x][y] == 0){
			sequencer.sequencerArray[phrase][x][y] = 1;
			} else {
				sequencer.sequencerArray[phrase][x][y] = 0;
			}		
		} else if (sequencer.mode == 'phrase') {
			sequencerChanges(x,y,phrase, sequencer.sequencerNumber); // sends changes direct to server to broadcast
			
			for (var f=0;f<sequencer.buttonsY; f++){ // loop through array to see what is on! Turn EVERYTHING (other than the clicked button) off.
					
				if (sequencer.sequencerArray[phrase][x][f] == 1){ // turn everything on the row to 0, then...
					sequencer.sequencerArray[phrase][x][f] = 0;
				} 
				if (sequencer.sequencerArray[phrase][x][y] == 0){ // turn ON the selected one!
					sequencer.sequencerArray[phrase][x][y] = 1;
				} 
			} // end of 'f' loop
		} // end of else if
	
	drawGrid(canvas, sequencer, sequencer.currentBeat, phrase);
	
}	// end of function

function viewChanger(sequencer,viewType,viewPhrase){ // used to change the current sequencer view.
	sequencer.viewType = viewType;
	console.log(viewPhrase);
	sequencer.currentView = viewPhrase;
	console.log(sequencer.currentView);
}
	
	
	
	// AUDIO STUFF FROM THIS POINT ON!
	
	function reverseRange(num, min, max){ // pretty sure this guy has caused me a lot of grief. Fuck this guy. He reverses ranges given.
		return (max + min) - num;
	}
	
	
	//setup effects
	// Synth One Effects
	var reverbOne = new Tone.Freeverb();
	var distOne = new Tone.Distortion();
	var delayOne = new Tone.PingPongDelay();
	// Synth Two Effects
	var reverbTwo = new Tone.Freeverb();
	var distTwo = new Tone.Distortion();
	var delayTwo = new Tone.PingPongDelay();
	// Synth Three Effects
	var reverbThree = new Tone.Freeverb();
	var distThree = new Tone.Distortion();
	var delayThree = new Tone.PingPongDelay();
	// Percussion Effects
		// Perc
	var reverbPerc = new Tone.Freeverb();
	var distPerc = new Tone.Distortion();
	var delayPerc = new Tone.PingPongDelay();
		// Hat
	var reverbHat = new Tone.Freeverb();
	var distHat = new Tone.Distortion();
	var delayHat = new Tone.PingPongDelay();
		// Snare
	var reverbSnare = new Tone.Freeverb();
	var distSnare = new Tone.Distortion();
	var delaySnare = new Tone.PingPongDelay();
		// Kick
	var reverbKick = new Tone.Freeverb();
	var distKick = new Tone.Distortion();
	var delayKick = new Tone.PingPongDelay();
	
	
	
	// set effect values
	delayOne.wet.value = 0.2;
	distOne.wet.value = 0.4;
	reverbOne.wet.value = 0.2;
	
	delayTwo.wet.value = 0.4;
	distTwo.wet.value = 0.4;
	reverbTwo.wet.value = 0.3;
	
	delayThree.wet.value = 0;
	distThree.wet.value = 0;
	reverbThree.wet.value = 0;
	
	delayPerc.wet.value = 0;
	distPerc.wet.value = 0;
	reverbPerc.wet.value = 0;
	
	delayHat.wet.value = 0;
	distHat.wet.value = 0;
	reverbHat.wet.value = 0;
	
	delaySnare.wet.value = 0;
	distSnare.wet.value = 0;
	reverbSnare.wet.value = 0;
	
	delayKick.wet.value = 0;
	distKick.wet.value = 0;
	reverbKick.wet.value = 0;

	
	//setup a synth
	
	var synth = new Tone.PolySynth(4, Tone.FMSynth).toMaster();
	
	synth.set({
		"envelope" : {
			"attack" : 0.25,
			"decay" : 0,
			"sustain" : 10,
			"release" : 0.5,
		}
	});
	
	synth.volume.value = -30;

	
	//synth two
	var synthTwo = new Tone.PolySynth(4, Tone.DuoSynth).toMaster();
	
	synthTwo.set({
		"envelope" : {
			"attack" : 0.25,
			"decay" : 0.5,
			"sustain" : 10,
			"release" : 0.5,
		}
	});
	
	synthTwo.volume.value = -1000;
	
	var synthThree = new Tone.PolySynth(4, Tone.FMSynth).toMaster();
	
	synthThree.set({
		"envelope" : {
			"attack" : 0.05,
			"decay" : 0.3,
			"sustain" : 10,
			"release" : 0.5,
		}
	});
	
	synth.volume.value = -30;
	
	

		//setup perc (toms)
	var perc = new Tone.MultiPlayer(
		{
				"percOne" : "audio/tomOne.wav",
				"percTwo" : "audio/tomTwo.wav",
				"percThree" : "audio/tomThree.wav",
				"percFour" : "audio/tomFour.wav",
			}, function(){
	// call function when samples are loaded
	}).toMaster();
		// hats
	var hat = new Tone.MultiPlayer(
		{
				"hatOne" : "audio/hatOne.wav",
				"hatTwo" : "audio/hatTwo.wav",
				"hatThree" : "audio/hatThree.wav",
				"hatFour" : "audio/hatFour.wav",
			}, function(){
	// call function when samples are loaded
	}).toMaster();
		//snare
	var snare = new Tone.MultiPlayer(
		{
				"snareOne" : "audio/snareOne.wav",
				"snareTwo" : "audio/snareTwo.wav",
				"snareThree" : "audio/snareThree.wav",
				"snareFour" : "audio/snareFour.wav",
			}, function(){
	// call function when samples are loaded
	}).toMaster();
		//kick
	var kick = new Tone.MultiPlayer(
		{
				"kickOne" : "audio/kickOne.wav",
				"kickTwo" : "audio/kickTwo.wav",
				"kickThree" : "audio/kickThree.wav",
				"kickFour" : "audio/kickFour.wav",
			}, function(){
	// call function when samples are loaded
	}).toMaster();
		
		
		
		
	
	// all interval ratios for notes. Maybe won't be used, but it's interesting and useful nonetheless!
	var realRatios = [1, 1.059, 1.122, 1.189, 1.259, 1.334, 1.414, 1.498, 1.587, 1.681, 1.781, 1.888, 2]; 
	
// real handy function to turn note numbers into scales, give them names & octaves... it's really perfect and I love it.
function notes (rootNote, scale, scaleNote, offset){
	// rootNote is the MIDI root of the scale
	// scale is the scale type
	// scaleNote is the difference from the root note
	// offset makes the scaleNote higher or lower.
	
	
// the scales
	var majorScale = [0,2,4,5,7,9,11];
	var minPentScale = [0,3,5,7,10];
	var majPentScale = [0,4,5,7,11];
	var minorScale = [0,2,3,5,7,8,10];
	var chromaticScale = [0,1,2,3,4,5,6,7,8,9,10,11];
// the note letters to make the scale 
	var noteLetters = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",];
// empty array to build the current scale	
	var currentScale = [];
// current root note with modulo
	var realRoot = rootNote % noteLetters.length;
	
	// this means that noteLetters[rootNote % noteLetters.length] gives us the correct starting note to build the scale.
		
	if (scale == 'major'){
		var tempScale = majorScale;
	} else if (scale == 'minor'){
		tempScale = minorScale;
	} else if (scale == 'minorPent'){
	   	tempScale = minPentScale;
	} else if (scale == 'majorPent'){
	   	tempScale = majPentScale;
	} else {
		tempScale = chromaticScale;
	}
	// tempScale holds the correct values for the current scale
		
	for (var x=0;x<tempScale.length;x++){// loop through the tempScale
		currentScale[x] = noteLetters[(tempScale[x] + realRoot) % noteLetters.length];// puts the note letters in the currentScale array using the tempScale pattern.		
	}
		
// adds scale note to the offset given
	var offsetNote = (scaleNote + offset) % currentScale.length; 
	var octaveNum = Math.floor((scaleNote + offset - realRoot) / currentScale.length);
	var noteString = currentScale[offsetNote] + octaveNum;
	return noteString;
}


	
	// melody sequencer
	var melodyLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerOne;
		sequencerOne.currentBeat = col;
		drawGrid(ctx, s, col, sequencerOne.currentPhrase);
		var column = s.sequencerArray[sequencerOne.currentPhrase][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[reverseRange(i, -1, s.buttonsX)] == 1){
				console.log('Sequencer One: ',notes(9, 'minor',i,28));
				synth.triggerAttackRelease(notes(9, 'minor',i,28), "4n");
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
	
	
	// melody phrase sequencer
	var sequencerOnePhraseSequencer = new Tone.Sequence(function(time, col){ // Phrase sequencer (sequencerOne)
		
		var s = sequencerOnePhrase;
		sequencerOnePhrase.currentBeat = col;
		drawGrid(ctxTwo, s, col, 0);
		var column = s.sequencerArray[0][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[i] == 1){
				sequencerOne.currentPhrase = i;
				if (sequencerOne.viewType == 'live'){
					sequencerOne.currentView = i;
				}
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");
	
	
	// harmony sequencer
	var harmonyLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerTwo;
		s.currentBeat = col;
		drawGrid(ctxThree, s, col, s.currentPhrase);
		var column = s.sequencerArray[s.currentPhrase][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[reverseRange(i, -1, s.buttonsX)] == 1){
				console.log('Sequencer Two: ',notes(9, 'minor',i,28));
				
				synthTwo.triggerAttackRelease(notes(9, 'minor',i,28), "4n", '+0.05');
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
	
	
		// harmony phrase sequencer
	var sequencerTwoPhraseSequencer = new Tone.Sequence(function(time, col){ // Phrase sequencer (sequencerOne)
		
		var s = sequencerTwoPhrase;
		s.currentBeat = col;
		drawGrid(ctxFour, s, col, 0);
		var column = s.sequencerArray[0][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[i] == 1){
				sequencerTwo.currentPhrase = i;
				if (sequencerTwo.viewType == 'live'){
					sequencerTwo.currentView = i;
				}
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");
	
	// bass sequencer
	var bassLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerThree;
		s.currentBeat = col;
		drawGrid(ctxFive, s, col, s.currentPhrase);
		var column = s.sequencerArray[s.currentPhrase][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[reverseRange(i, -1, s.buttonsX)] == 1){
				synthThree.triggerAttackRelease(notes(9, 'minor',i,28), "4n");
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
	
	
	// bass phrase sequencer
	var sequencerThreePhraseSequencer = new Tone.Sequence(function(time, col){ // Phrase sequencer (sequencerOne)
		
		var s = sequencerThreePhrase;
		s.currentBeat = col;
		drawGrid(ctxSix, s, col, 0);
		var column = s.sequencerArray[0][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[i] == 1){
				sequencerThree.currentPhrase = i;
				if (sequencerThree.viewType == 'live'){
					sequencerThree.currentView = i;
				}
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");
	
	
	
	// percussion sequencer
	var percLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerFour;
		s.currentBeat = col;
		drawGrid(ctxSeven, s, col, s.currentPhrase);
		var column = s.sequencerArray[s.currentPhrase][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[reverseRange(i, -1, s.buttonsX)] == 1){
				// trigger note - select note is 'i'
				
				switch(i){
				case 0:
					kick.start("kickOne");
					break;
				case 1:
					kick.start("kickTwo");
					break;
				case 2:
					kick.start("kickThree");
					break;
				case 3:
					kick.start("kickFour");
					break;
				case 4:
					snare.start("snareOne");
					break;
				case 5:
					snare.start("snareTwo");
					break;
				case 6:
					snare.start("snareThree");
					break;
				case 7:
					snare.start("snareFour");
					break;
				case 8:
					hat.start("hatOne");
					break;
				case 9:
					hat.start("hatTwo");
					break;
				case 10:
					hat.start("hatThree");
					break;
				case 11:
					hat.start("hatFour");
					break;
				case 12:
					perc.start("percOne");
					break;
				case 13:
					perc.start("percOne");
					break;
				case 14:
					perc.start("percOne");
					break;
				case 15:
					perc.start("percOne");
					break;
				}
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
	
	
	// percussion phrase sequencer
	var sequencerFourPhraseSequencer = new Tone.Sequence(function(time, col){ // Phrase sequencer (sequencerOne)
		
		var s = sequencerFourPhrase;
		s.currentBeat = col;
		drawGrid(ctxEight, s, col, 0);
		var column = s.sequencerArray[0][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[i] == 1){
				sequencerFour.currentPhrase = i;
				if (sequencerFour.viewType == 'live'){
					sequencerFour.currentView = i;
				}
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");

	
	
	Tone.Transport.bpm.value = 120;
	Tone.Transport.start();
	Tone.context.latencyHint = 'interactive';
	
	
	
	
	// Effects and stuff that will certainly need changing!
	
	function effectChanger(effectName, val){
		formattingName = '#' + effectName;
	document.querySelector(formattingName).value = val;
	if (effectName == 'distortion'){
	distortion.wet.value = val * 0.01;
	} else if (effectName =='reverb'){
		reverb.wet.value = val * 0.01;
	} else if (effectName=='time'){
			delay.delayTime.value = val * 0.01;
	} else if (effectName=='feedback'){
		delay.feedback.value = val * 0.01;
	} else if (effectName=='delay'){
		delay.wet.value = val * 0.01;
	}
	}
	
	
	function synthChanger(effectName, val){
		formattingName = '#' + effectName;
	if (effectName == 'harmonicity'){
		synth.set(effectName, val* 0.03)
		document.querySelector(formattingName).value = val * 0.03;
	} else if (effectName=='modulationIndex'){
		synth.set(effectName, val);
		document.querySelector(formattingName).value = val;
	} else if (effectName=='attack'){
		synth.set({"envelope" : {
			"attack" : val * 0.01
	}})
	document.querySelector(formattingName).value = val * 0.01;
	} else if (effectName=='decay'){
		synth.set({"envelope" : {
			"decay" : val * 0.01
	}})
	document.querySelector(formattingName).value = val * 0.01;
	} else if (effectName=='sustain'){
		synth.set({"envelope" : {
			"sustain" : val * 0.01
	}})
	document.querySelector(formattingName).value = val * 0.01;
	} else if (effectName=='release'){
		synth.set({"envelope" : {
			"release" : val * 0.01
	}})
	document.querySelector(formattingName).value = val * 0.01;
		}
	}
	
	function volumeChanger(sequencer, val){
	
		switch(sequencer){
		case 0:
			synth.volume.value = val;
			document.querySelector('#sequencerOne').value = val;
			break;
		case 1:
			hat.volume.value = val;
			snare.volume.value = val;
			kick.volume.value = val;
			document.querySelector('#sequencerTwo').value = val;
			break;
		case 2:
			synthTwo.volume.value = val;
			document.querySelector('#sequencerThree').value = val;
		}
	}
	
	function controlChanger(selected, val){
		switch(selected){
		case 0:
			Tone.Transport.bpm.value = val;
			document.querySelector('#tempo').value = val;
		}
	}
	
	function sequencerChanger(x,y, phrase, sequencer){ // changes the sequencerArray of the given sequencer
		if (sequencer.sequencerArray[phrase][x][y] == 0){
			sequencer.sequencerArray[phrase][x][y] = 1;
		} else {
			sequencer.sequencerArray[phrase][x][y] = 0;
		}		
	}
	
	function start(){
			
		
	if (firstPlay == 0){
		melodyLoop.start(); 
		harmonyLoop.start();
		bassLoop.start();
		percLoop.start();
		sequencerOnePhraseSequencer.start();
		sequencerTwoPhraseSequencer.start();
		sequencerThreePhraseSequencer.start();
		sequencerFourPhraseSequencer.start();
		
		firstPlay = 1;
	}	
}
	
	function stop(){
		
		harmonyLoop.stop();
		melodyLoop.stop();
		bassLoop.stop();
		percLoop.stop();
		sequencerOnePhraseSequencer.stop();
		sequencerTwoPhraseSequencer.stop();
		sequencerThreePhraseSequencer.stop();
		sequencerFourPhraseSequencer.stop();
		firstPlay = 2;
	}
	
	// End of audio stuff
	
