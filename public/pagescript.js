


//	Node socket stuff

var socket = io.connect();

socket.on("disconnect", function() {
	setTitle("Disconnected");
});

socket.on("connect", function() {
	setTitle("Connected");
	// loadSequence();
});

socket.on("loopStart", function() {
	// start loop playing!
	startLoop();
	// I feel like I don't need these bits here...
	//setTimeout(10);
	//startLoop(0);
});

socket.on("seqChanged", function(array){ // When the seqChanged event is listened to/heard, change the selectedsequencer accordingly.

	var x = array[0];
	var y = array[1];
	var phrase = array[2];
	var seq = array[3];
	if (seq == 1){
	sequencerOne.changeSequencer(x,y,phrase,seq);
	} else if (seq == 4){
		sequencerFour.changeSequencer(x,y,phrase,seq);
	}
});


socket.on("sequencerOne", function(message) {// initial loading of the sequencer state
	sequencerOne.sequencerArray = message;
});

socket.on("sequencerOnePhrase", function(message) {// initial loading of the sequencer state
	sequencerFour.sequencerArray = message;
});

var firstPlay = 0; // set up a variable for the firstPlay of the loop, turned on by the server.

function startLoop(){ // starts the loop only on the first go round.
	
	if (firstPlay == 0){
		firstPlay = 1;
		melodyLoop.start(); 
		percLoop.start();
		fmLoop.start();
		sequencerOnePhraseSequencer.start();
	}
};

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


/*
function loadSequence(message){ // initial loading of the sequencer - needs work!
	sequencerOne.sequencerArray = message;
}
*/

function setTitle(title) {
    document.querySelector("h1").innerHTML = title;
}


/* 
// Sends the information in the textbox to the server as event 'chat'
document.forms[0].onsubmit = function () {
    var input = document.getElementById("message");
    printMessage(input.value);
    socket.emit("chat", input.value);
    input.value = '';
};

*/




/*function printMessage(message) {
    var p = document.createElement("p");
    p.innerText = message;
    document.querySelector("div.messages").appendChild(p);
}

*/


	/* TO DO
	Scaling - make sure the input is responsive or figure something out there! Mobile needs to work!
	Array input & output system (save file etc?)
	Node Socket integration
	Make all the sequencers!
	front end stuff, make it look good!
	
	
	The larger plan:
	End goal - a multi-sequencer workstation utilising websockets (and node.js) for many connections to the same workspace.
	
	Client-side sequencer stuff:
	EASY BITS: 
		Make the sequencers change through the css display:hide element and buttons. 
		Make the sequencers look nice and stuff with colours.
		Title, footer, links... all the standard making a website bullshit.
		Make the sliders look nicer and open when you press an 'advanced' button
	Slightly harder:
		Slider 'go' button for fake automation - slider moves over the course of one sequence like throught the line~ object in max.
		Multiple sequencer states! This is where shit gets real!
			- the sequencer's arrays need to be numbered so we can change between them.
			- the numbered arrays will then, at the end of each sequence, change accordingly (or not at all)
			- For each instrument there will be a master array switching out each sequencerArray (for purposes here we shall call these 'phrases'.)
			- Decision: should we have the ability to edit individualphrases and listen to them alone? Or would it be better to make it so aphrase can only be edited whilst it is being played?
			- 
		
	
	Client-side audio stuff:
		- Sampled percussion feels like the right way to go, seeing as the synthesised stuff in tone.js isn't so great.
		- 
	
	
	Phrase Sequencer:
	- Each of the 4/5 sequencers has a phrase sequencer
	- the sequencer shown on screen is just the 'current view', which can be either a live view or a phrase view.
	- The live view follows the current playing part of the sequence
	- The phrase view shows (and allows editing) of the selected phrase.
	- When the phrase in view becomes live, the play head appears but only for that one phrase.
	- The phrase sequencer will be slightly different functionally to the regular sequencer: it will only have one bean allowed on at a time on a column. 
	- 
	
	*/
	
	// Create canvas context
	var c = document.getElementById("sequencerOne");
	var ctx=c.getContext("2d");
	
	var cTwo = document.getElementById("sequencerTwo");
	var ctxTwo=cTwo.getContext("2d");
	
	var cThree = document.getElementById("sequencerThree");
	var ctxThree=cThree.getContext("2d");
	
	var cFour = document.getElementById("sequencerFour");
	var ctxFour=cFour.getContext("2d");
	
	function sequencerObject(sequencerNumber, buttonsX, buttonsY, squareSize, gapSize){ // Constructor for the sequencer object
		// Declare important variables (well we're in an object, properties)
		this.squareSize = squareSize || 20;
		this.gapSize = gapSize || 1;
		this.buttonsX = buttonsX;
		this.buttonsY = buttonsY;
		this.totalPatterns = 10;
		this.sequencerArray = [];
		this.currentPhrase = 0;
		
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
		
		// NOTE: sequencerArray[p][x][y] works as follows: sequencerArray[phrase][x][y]

		
		this.serverSequencer = function(newArray){ // recieve server side array... needs work!
			sequencerArray = newArray;
		}
		
		this.changeSequencer = function(x,y){
			if (this.sequencerArray[0][x][y] == 1){
				this.sequencerArray[0][x][y] = 0;
			} else {
				this.sequencerArray[0][x][y] = 1;
			}
		}
		
		this.sequencerNumber = sequencerNumber;
		
	} // end object constructor
	
	
	// Create the sequencers as needed
	var sequencerOne = new sequencerObject(1,16,16);
	var sequencerTwo = new sequencerObject(2,16,4);
	var sequencerThree = new sequencerObject(3,16,6);
	var sequencerFour = new sequencerObject(4,16,10,18,2);

	
	
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
	

function drawGrid(canvas, sequencer, phrase, colourOff, colourOn){ // Draws the grid and changes the colour of any buttons that are currently 'on'
	for (var x=0; x<sequencer.buttonsX; x++){
		for (var y=0; y<sequencer.buttonsY;y++){
			var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
			var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;
			
				if (sequencer.sequencerArray[phrase][x][y] == 1){
					// fill with 'on' colour
					canvas.fillStyle= colourOn || "rgb(255,60,60)"; 
					canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);
					
				} else {
				// Fill with regular colour
					canvas.fillStyle = colourOff || "rgb(60,60,60)";
					canvas.fillRect(loopX,loopY,sequencer.squareSize,sequencer.squareSize);
			}
		}
	}
}

drawGrid(ctx, sequencerOne, 0);
drawGrid(ctxTwo, sequencerTwo, 0);
drawGrid(ctxThree, sequencerThree, 0);
drawGrid(ctxFour, sequencerFour, 0);


c.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	arrayEdit(e.layerX,e.layerY,ctx,sequencerOne,sequencerOne.currentPhrase);
});

cTwo.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	arrayEdit(e.layerX,e.layerY,ctxTwo,sequencerTwo,0);
});

cThree.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	arrayEdit(e.layerX,e.layerY,ctxThree,sequencerThree,0);
});

cFour.addEventListener("click", function(e){ // when the canvas is clicked, call the draw function and give it the coordinates.
	arrayEdit(e.layerX,e.layerY,ctxFour,sequencerFour,0);
});


function arrayEdit(xClick,yClick, canvas, sequencer,phrase){ // Draws the grid and changes the colour of any buttons that are currently 'on'
	for (var x=0; x<sequencer.buttonsX; x++){
		for (var y=0; y<sequencer.buttonsY;y++){
			var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
			var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;
			// Yeah I'm pretty sure there's a better way of doing this bit above but oh well.
			
			if (xClick > loopX && xClick < (loopX + sequencer.squareSize) && yClick > loopY && yClick < (loopY + sequencer.squareSize)){
				sequencerChanges(x,y,phrase, sequencer.sequencerNumber); // sends changes direct to server to broadcast
					if (sequencer.sequencerArray[phrase][x][y] == 0){
						sequencer.sequencerArray[phrase][x][y] = 1;
					} else {
						sequencer.sequencerArray[phrase][x][y] = 0;
					}		
			}
		}
	}
	
	drawGrid(canvas, sequencer, phrase);
}	
	
	
	
	/* AUDIO STUFF FROM THIS POINT ON! */
	
	function reverseRange(num, min, max){
		return (max + min) - num;
	}
	

	
	//setup a synth
	var reverb = new Tone.Freeverb();
	var distortion = new Tone.Distortion();
	var delay = new Tone.PingPongDelay()
	var synth = new Tone.PolySynth(12, Tone.FMSynth).chain(distortion, reverb, delay, Tone.Master);
	
	synth.set({
		"envelope" : {
			"attack" : 0.25,
			"decay" : 0,
			"sustain" : 10,
			"release" : 0.5,
		}
	});
	
	delay.wet.value = 0.5;
	distortion.wet.value = 0.5;
	reverb.wet.value = 0.5;
	
	// setup percussion
	var kick = new Tone.MembraneSynth().toMaster(); //Kick Drum
	var hat = new Tone.NoiseSynth().toMaster(); // Noise-r
	var metal = new Tone.MetalSynth().toMaster(); // I have no idea
	var snare = new Tone.NoiseSynth().chain(distortion,Tone.Master); // Noise-r
	
	snare.set({"envelope" : {
			"attack" : 0.01,
			"decay" : 0.1
	}})
	
	hat.set({"envelope" : {
			"decay" : 0.05
	}})
	
	
	
	
	//the notes
	function notes (startNote, scale, offset){
		// to do!
		// Make it so passing in a number gives you a musical note value, and allow for scales!
	}
	
	var noteNames = ["A3", "C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6", "G6", "A6"];
	// c c# d d# e f f# g g# a a# b 
	var ratios = [1, 1.122, 1.259,1.498,1.681, 2];
	var realRatios = [1, 1.059, 1.122, 1.189, 1.259, 1.334, 1.414, 1.498, 1.587, 1.681, 1.781, 1.888, 2];
	/* Sequencer - anonymous function is callback. What is a callback? It's simple! It's just a function within a function's () that gets called when the main function is done with the previous task (say, loading). Or something! I don't know!
	*/
	
	var sequencerOnePhraseSequencer = new Tone.Sequence(function(time, col){ // Phrase sequencer (sequencerOne)
		
		var s = sequencerFour;
		var visualTempo = col * ((s.gapSize * 2) + s.squareSize);
		var visualTempoBehind = (col - 1) * ((s.gapSize * 2) + s.squareSize)
		clearCanvas(ctxFour);
		drawGrid(ctxFour,s,0);
		ctxFour.fillStyle="rgba(0,100,0,0.3)";
		ctxFour.fillRect(visualTempo , 0, ((s.gapSize * 2) + s.squareSize),500);
		var column = s.sequencerArray[0][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[i] == 1){
				sequencerOne.currentPhrase = i;
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");
	
	
	
	var melodyLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerOne;
		var visualTempo = col * ((s.gapSize * 2) + s.squareSize);
		var visualTempoBehind = (col - 1) * ((s.gapSize * 2) + s.squareSize)
		clearCanvas(ctx);
		drawGrid(ctx, s,sequencerOne.currentPhrase);
		ctx.fillStyle="rgba(0,100,0,0.3)";
		ctx.fillRect(visualTempo , 0, ((s.gapSize * 2) + s.squareSize),500);
		var column = s.sequencerArray[sequencerOne.currentPhrase][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[reverseRange(i, -1, s.buttonsX)] == 1){
				synth.triggerAttackRelease(noteNames[i], "4n");
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
	
	var fmLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerThree;
		var visualTempo = col * ((s.gapSize * 2) + s.squareSize);
		var visualTempoBehind = (col - 1) * ((s.gapSize * 2) + s.squareSize)
		clearCanvas(ctxThree);
		drawGrid(ctxThree, s, 0);
		ctxThree.fillStyle="rgba(0,100,0,0.3)";
		ctxThree.fillRect(visualTempo , 0, ((s.gapSize * 2) + s.squareSize),500);
		var column = s.sequencerArray[sequencerOne.currentPhrase][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[reverseRange(i, -1, s.buttonsY)] == 1){
				synth.set('harmonicity', ratios[i]);
				console.log(ratios[i])
			}
		}
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "8n");
	
	
	
	var percLoop = new Tone.Sequence(function(time, col){
		
		var s = sequencerTwo;
		var visualTempo = col * ((s.gapSize * 2) + s.squareSize);
		var visualTempoBehind = (col - 1) * ((s.gapSize * 2) + s.squareSize)
		clearCanvas(ctxTwo);
		drawGrid(ctxTwo, s, 0);
		ctxTwo.fillStyle="rgba(0,100,0,0.3)";
		ctxTwo.fillRect(visualTempo , 0, ((s.gapSize * 2) + s.squareSize),500);
		var column = s.sequencerArray[0][col];
		for (var i = 0; i < s.buttonsX; i++){
			if (column[i] == 1){
				console.log("something is certainly happening, at least. Also, 'i' is ", i)
				switch(i){
			case 0:
				metal.triggerAttackRelease("8n");
				break;
			case 1:
				hat.triggerAttackRelease("8n");
				break;
			case 2:
				snare.triggerAttackRelease("8n");
				break;
			case 3:
				kick.triggerAttackRelease("C2", "8n");
			}
		}
	}
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "8n");
	
	Tone.Transport.bpm.value = 120;
	Tone.Transport.start();
	
	
	
	
	
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
		socket.on("loopStart", function() {
			melodyLoop.start(); 
			percLoop.start();
			fmLoop.start();
			sequencerOnePhraseSequencer.start();
		});
	}
	
	
	function stop(){
		fmLoop.stop();
		melodyLoop.stop();
		percLoop.stop();
		sequencerOnePhraseSequencer.stop();
	}
	
	// End of audio stuff
	
