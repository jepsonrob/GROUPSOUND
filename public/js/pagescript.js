




						// Socket.io stuff


var socket = io.connect();
var phraseOffset = 0; // offset given by server connection initial start up
var buffersLoaded = 0; // 1 when all buffers are loaded.

// event listeners

socket.on("disconnect", function() {
    setTitle("Disconnected");
});

socket.on("connect", function() {
    setTitle("Connected");
    // loadSequence();
});

Tone.Buffer.on('load', function() {
    buffersLoaded = 1;
})


var firstPlay = 0; // set up a variable for the firstPlay of the loop, turned on by the server.
var startPressed = 0; // 1 when the start button has been pressed to trigger loop, 0 when looping.

socket.on("loopStart", function() {
    console.log('server timer!')
    // start loop playing! ... hopefully at the correct time!

    if (firstPlay == 0 && buffersLoaded == 1) {
        start('event');
        firstPlay = 1;
    }
    // call the function 'start' when the button has been pressed.
    if (firstPlay == 1 && startPressed == 1) {
        start('button');
        startPressed = 0;
    }
});

// initial sequencer state loaders (also drawing the arrays!)
socket.on("sequencerOne", function(message) {
    sequencerOne.sequencerArray = message;
    drawGrid(ctx, sequencerOne, 0, 0);

});

socket.on("sequencerOnePhrase", function(message) {
    sequencerOnePhrase.sequencerArray = message;
    drawGrid(ctxTwo, sequencerOnePhrase, 0, 0);

});

socket.on("sequencerTwo", function(message) {
    sequencerTwo.sequencerArray = message;
    drawGrid(ctxThree, sequencerTwo, 0, 0);

});

socket.on("sequencerTwoPhrase", function(message) {
    sequencerTwoPhrase.sequencerArray = message;
    drawGrid(ctxFour, sequencerTwoPhrase, 0, 0);

});


socket.on("sequencerThree", function(message) {
    sequencerThree.sequencerArray = message;
    drawGrid(ctxFive, sequencerThree, 0, 0);

});

socket.on("sequencerThreePhrase", function(message) {
    sequencerThreePhrase.sequencerArray = message;
    drawGrid(ctxSix, sequencerThreePhrase, 0, 0);

});

socket.on("sequencerFour", function(message) {
    sequencerFour.sequencerArray = message;
    drawGrid(ctxSeven, sequencerFour, 0, 0);
});

socket.on("sequencerFourPhrase", function(message) {
    sequencerFourPhrase.sequencerArray = message;
    drawGrid(ctxEight, sequencerFourPhrase, 0, 0);
});


socket.on("phraseStarter", function(message) { // gives the current phrase!
    phraseOffset = message;
});

socket.on("seqServerEdit", function(array) { // When the server broadcasts an array change, change the arrays!

    var x = array[0];
    var y = array[1];
    var phrase = array[2];
    var seq = array[3];
    switch (seq) { // takes the sequencer's number into the switch and sends the info to the right sequencer.
        case 1:
            sequencerOne.changeSequencer(x, y, phrase);
            break;
        case 2:
            sequencerOnePhrase.changeSequencer(x, y, phrase, 'phrase');
            break;
        case 3:
            sequencerTwo.changeSequencer(x, y, phrase);
            break;
        case 4:
            sequencerTwoPhrase.changeSequencer(x, y, phrase, 'phrase');
            break;
        case 5:
            sequencerThree.changeSequencer(x, y, phrase);
            break;
        case 6:
            sequencerThreePhrase.changeSequencer(x, y, phrase, 'phrase');
            break;
        case 7:
            sequencerFour.changeSequencer(x, y, phrase);
            break;
        case 8:
            sequencerFourPhrase.changeSequencer(x, y, phrase, 'phrase');
            break;
    }
});

// server functions

function setTitle(title) {
    document.querySelector("h1").innerHTML = title;
}

function sequencerChanges(x, y, velocity, phrase, sequencer) {
    var array = [x, y, velocity, phrase, sequencer,];
    socket.emit("seqChangeToServer", array);
}

function seqChanged(array) {
    var x = array[0];
    var y = array[1];
    var seq = array[2];
    sequencerOne.changeSequencer(x, y, phrase, seq);
}


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






// the sequencer object

function sequencerObject(sequencerNumber, buttonsX, buttonsY, squareSize, gapSize) { // Constructor for the sequencer object
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


    this.makeSequencerArray = function() { // Makes the 2d array of 0's to represent the sequencer
        for (var p = 0; p < this.totalPatterns; p++) {
            this.sequencerArray.push([]);
            for (var x = 0; x < this.buttonsX; x++) {
                this.sequencerArray[p].push([]);
                for (var y = 0; y < this.buttonsY; y++) {
                    this.sequencerArray[p][x].push(0)
                }
            }
        }
    } // end function ...

    this.makeSequencerArray(); // ... and immediately call it!


    this.changeSequencer = function(x, y, phr, mode) {
        if (mode == 'phrase') {
            for (var f = 0; f < this.buttonsY; f++) {

                if (this.sequencerArray[phr][x][f] == 1) { // turn everything on the row to 0, then...
                    this.sequencerArray[phr][x][f] = 0;
                }
                if (this.sequencerArray[phr][x][y] == 0) { // turn ON the selected one!
                    this.sequencerArray[phr][x][y] = 1;
                }
            } // end of 'f' loop
        } else {	
			if (this.sequencerArray[phr][x][y] == 0 || this.sequencerArray[phr][x][y] < 4){
		this.sequencerArray[phr][x][y] = this.sequencerArray[phr][x][y] + 1;
				} else {
		this.sequencerArray[phr][x][y] = 0;
			}	
        }
    } // LIKELY BUG! When the sequencer is in phrase mode and only has one on a colum at a time, this will fuck it up! Watch out!

    this.sequencerNumber = sequencerNumber; // numbers the sequencers in a hacky tech-debt way! Yay!


} // end object constructor


// Create the sequencers as needed
var sequencerOne = new sequencerObject(1, 16, 16, 15, 1);
var sequencerOnePhrase = new sequencerObject(2, 16, 10, 15, 1);
var sequencerTwo = new sequencerObject(3, 16, 16, 15, 1);
var sequencerTwoPhrase = new sequencerObject(4, 16, 10, 15, 1);
var sequencerThree = new sequencerObject(5, 16, 16, 15, 1);
var sequencerThreePhrase = new sequencerObject(6, 16, 10, 15, 1);
var sequencerFour = new sequencerObject(7, 16, 16, 15, 1);
var sequencerFourPhrase = new sequencerObject(8, 16, 10, 15, 1);

// set the mode on the phrase sequencers
sequencerOnePhrase.mode = 'phrase';
sequencerTwoPhrase.mode = 'phrase';
sequencerThreePhrase.mode = 'phrase';
sequencerFourPhrase.mode = 'phrase';

// the sequencer in view at the moment. Quite an important value that'll likely come up a fair bit.
var currentSequencer = 0; 



				// CANVAS STUFF	


// Create canvas contexts for all 8 sequencers
var c = document.getElementById("sequencerOne");
var ctx = c.getContext("2d");

var cTwo = document.getElementById("sequencerOnePhrase");
var ctxTwo = cTwo.getContext("2d");

var cThree = document.getElementById("sequencerTwo");
var ctxThree = cThree.getContext("2d");

var cFour = document.getElementById("sequencerTwoPhrase");
var ctxFour = cFour.getContext("2d");

var cFive = document.getElementById("sequencerThree");
var ctxFive = cFive.getContext("2d");

var cSix = document.getElementById("sequencerThreePhrase");
var ctxSix = cSix.getContext("2d");

var cSeven = document.getElementById("sequencerFour");
var ctxSeven = cSeven.getContext("2d");

var cEight = document.getElementById("sequencerFourPhrase");
var ctxEight = cEight.getContext("2d");

// Canvas & UI functions
function clearCanvas(canvas) {
    canvas.clearRect(0, 0, 500, 500);
    canvas.fillStyle = 'rgba(255,255,255,1)';
    canvas.fillRect(0, 0, 500, 500);
}

function clearGrid(canvas, sequencer, phrase) {
    for (var x = 0; x < sequencer.buttonsX; x++) {
        for (var y = 0; y < sequencer.buttonsY; y++) {
            sequencer.sequencerArray[phrase][x][y] = 0;
        }
    }
    clearCanvas(canvas);
    drawGrid(canvas, sequencer, phrase);
}


function drawGrid(canvas, sequencer, beat, phrase, colourOff, colourOn) { // Draws the grid and changes the colour of any buttons that are currently 'on'

    clearCanvas(canvas); // Delete previous canvas for redraw!

    if (sequencer.viewType == 'live') { // select the view type
        var currentPhrase = sequencer.currentPhrase;
    } else if (sequencer.viewType == 'phrase') {
        currentPhrase = sequencer.currentView;
    }

    for (var x = 0; x < sequencer.buttonsX; x++) { // draws the grid with 2 loops
        for (var y = 0; y < sequencer.buttonsY; y++) {
            var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
            var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;

            if (sequencer.sequencerArray[currentPhrase][x][y] >= 1) { // TRUE when the array bean is on.
                if (currentPhrase == sequencer.currentPhrase && beat != x) { // TRUE when it is not the beat and ... you know what? I trial'd and error's this conditional. I'm a hack. I don't know how it works, but it does. Let's just let that go and get on with our lives.
                    switch (sequencer.sequencerArray[currentPhrase][x][y]) { // change opacity according to velocity
                        case 1:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 0.75)"; // fill with 'on' colour (Velocity 1)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 2:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 0.83)"; // fill with 'on' colour (Velocity 2)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 3:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 0.94)"; // fill with 'on' colour (Velocity 3)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 4:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 1)"; // fill with 'on' colour (Velocity 4)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                    }

                } else if (currentPhrase != sequencer.currentPhrase) {
                    switch (sequencer.sequencerArray[currentPhrase][x][y]) { // change opacity according to velocity
                        case 1:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 0.75)"; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 2:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 0.83)"; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 3:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 0.94)"; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 4:
                            canvas.fillStyle = colourOn || "rgba(255,60,60, 1)"; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                    }
                }

            } else if (sequencer.sequencerArray[currentPhrase][x][y] == 1 && beat == x) {

                canvas.fillStyle = "rgb(255,255,255)"; // fill with colour on the beat
                canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);

            } else {
                if (x == 0 || x == 4 || x == 8 || x == 12) {
                    canvas.fillStyle = "rgb(100,100,100)"; // Fill with regular colour
                    canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                } else {
                    canvas.fillStyle = colourOff || "rgb(60,60,60)"; // Fill with regular colour
                    canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                }
            }
        }
    }

    if (currentPhrase == sequencer.currentPhrase) {
        // Draw the playhead according to the beat.
        var visualTempo = beat * ((sequencer.gapSize * 2) + sequencer.squareSize); // size of the playhead
        canvas.fillStyle = "rgba(102,255,51,0.5)";
        canvas.fillRect(visualTempo, 0, (sequencer.gapSize + sequencer.squareSize), (sequencer.squareSize + (sequencer.gapSize * 2)) * sequencer.buttonsY);

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




// Canvas user-input event listeners (on click!)

c.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cOne, e);
	
    clickEdit(clickPosition.x, e.layerY, ctx, sequencerOne, sequencerOne.currentView);
});

cTwo.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cTwo, e);
	
    clickEdit(clickPosition.x, e.layerY, ctxTwo, sequencerOnePhrase, 0);
});


cThree.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cThree, e);
	
    clickEdit(clickPosition.x, e.layerY, ctxThree, sequencerTwo, sequencerTwo.currentView);
});

cFour.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cFour, e);
	
    clickEdit(clickPosition.x, e.layerY, ctxFour, sequencerTwoPhrase, 0);
});

cFive.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cFive, e);
	
    clickEdit(clickPosition.x, e.layerY, ctxFive, sequencerThree, sequencerThree.currentView);
});

cSix.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cSix, e);	
    clickEdit(clickPosition.x, e.layerY, ctxSix, sequencerThreePhrase, 0);
});

cSeven.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cSeven, e);
    clickEdit(clickPosition.x, e.layerY, ctxSeven, sequencerFour, sequencerFour.currentView);
});

cEight.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	clickPosition = getMousePos(cEight, e);
    clickEdit(clickPosition.x, clickPosition, ctxEight, sequencerFourPhrase, 0); 
});

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function clickEdit(xClick, yClick, canvas, sequencer, phrase) { // Draws the grid and changes the colour of any buttons that are currently 'on'
    // Changed from arrayEdit() to clickInput() for modular-ity
    for (var x = 0; x < sequencer.buttonsX; x++) {
        for (var y = 0; y < sequencer.buttonsY; y++) {
            var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
            var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;
            // Yeah I'm pretty sure there's a better way of doing this bit above but oh well.

            if (xClick > loopX && xClick < (loopX + sequencer.squareSize) && yClick > loopY && yClick < (loopY + sequencer.squareSize)) {
                arrayEdit(canvas, sequencer, x, y, phrase)
            }
        } // end of y loop
    } // end of x loop
} // end of function


function arrayEdit(canvas, sequencer, x, y, phrase) {

    if (sequencer.mode == 'poly') {
        sequencerChanges(x, y, phrase, sequencer.sequencerNumber); // sends changes direct to server to broadcast
        if (sequencer.sequencerArray[phrase][x][y] == 0 || sequencer.sequencerArray[phrase][x][y] < 4) {
            sequencer.sequencerArray[phrase][x][y] = sequencer.sequencerArray[phrase][x][y] + 1;
        } else {
            sequencer.sequencerArray[phrase][x][y] = 0;
        }
    } else if (sequencer.mode == 'phrase') {
        sequencerChanges(x, y, phrase, sequencer.sequencerNumber); // sends changes direct to server to broadcast

        for (var f = 0; f < sequencer.buttonsY; f++) { // loop through array to see what is on! Turn EVERYTHING (other than the clicked button) off.

            if (sequencer.sequencerArray[phrase][x][f] == 1) { // turn everything on the row to 0, then...
                sequencer.sequencerArray[phrase][x][f] = 0;
            }
            if (sequencer.sequencerArray[phrase][x][y] == 0) { // turn ON the selected one!
                sequencer.sequencerArray[phrase][x][y] = 1;
            }
        } // end of 'f' loop
    } // end of else if

    drawGrid(canvas, sequencer, sequencer.currentBeat, phrase);

} // end of function

function viewChanger(sequencer, viewType, viewPhrase) { // used to change the current sequencer view.
    sequencer.viewType = viewType;
    console.log(viewPhrase);
    sequencer.currentView = viewPhrase;
    console.log(sequencer.currentView);
}




// PLEASE REMOVE THE BIT BELOW AT SOME POINT

function changeSequencer(num){ // get rid of this later, but for now it's to test switching out sequencers etc.
	currentSequencer = num;
	document.getElementById('currentSeq').innerHTML = "Current Sequencer: " + (num + 1);
}

changeSequencer(0);

// PLEASE REMOVE THE BIT ABOVE AT SOME POINT





// AUDIO STUFF!


Tone.Transport.bpm.value = 120;
Tone.context.latencyHint = 'fastest';


function reverseRange(num, min, max) { // Useful little reverse range function.
    return (max + min) - num;
}

// all interval ratios for notes. Maybe won't be used, but it's interesting and useful nonetheless!
var realRatios = [1, 1.059, 1.122, 1.189, 1.259, 1.334, 1.414, 1.498, 1.587, 1.681, 1.781, 1.888, 2];


function notes(rootNote, scale, scaleNote, offset) { // real handy function to turn note numbers into scales, give them names & octaves... it's really perfect and I love it.
    // rootNote is the MIDI root of the scale
    // scale is the scale type
    // scaleNote is the difference from the root note
    // offset makes the scaleNote higher or lower.

    // the scales
    var majorScale = [0, 2, 4, 5, 7, 9, 11];
    var minPentScale = [0, 3, 5, 7, 10];
    var majPentScale = [0, 4, 5, 7, 11];
    var minorScale = [0, 2, 3, 5, 7, 8, 10];
    var chromaticScale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // the note letters to make the scale 
    var noteLetters = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", ];
    // empty array to build the current scale	
    var currentScale = [];
    // current root note with modulo
    var realRoot = rootNote % noteLetters.length;

    // this means that noteLetters[rootNote % noteLetters.length] gives us the correct starting note to build the scale.

    if (scale == 'major') {
        var tempScale = majorScale; // tempScale holds the correct values for the current scale
    } else if (scale == 'minor') {
        tempScale = minorScale;
    } else if (scale == 'minorPent') {
        tempScale = minPentScale;
    } else if (scale == 'majorPent') {
        tempScale = majPentScale;
    } else {
        tempScale = chromaticScale;
    }

    for (var x = 0; x < tempScale.length; x++) { // loop through the tempScale
        currentScale[x] = noteLetters[(tempScale[x] + realRoot) % noteLetters.length]; // puts the note letters in the currentScale array using the tempScale pattern.		
    }

    // adds scale note to the offset given
    var offsetNote = (scaleNote + offset) % currentScale.length;
    var octaveNum = Math.floor((scaleNote + offset - realRoot) / currentScale.length);
    var noteString = currentScale[offsetNote] + octaveNum;
    return noteString;
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
var reverbFour = new Tone.Freeverb();
var distFour = new Tone.Distortion();
var delayFour = new Tone.PingPongDelay();





//setup a synth

var synth = new Tone.PolySynth(3, Tone.FMSynth).chain(delayOne, Tone.Master);

synth.set({
    "envelope": {
        "attack": 0.01,
        "decay": 0,
        "sustain": 10,
        "release": 0.5,
    }
});



//synth two
var synthTwo = new Tone.PolySynth(2, Tone.DuoSynth).chain(delayTwo, Tone.Master);

synthTwo.set({
    "envelope": {
        "attack": 0.01,
        "decay": 0.5,
        "sustain": 10,
        "release": 0.5,
    }
});


var synthThree = new Tone.PolySynth(1, Tone.MonoSynth).chain(delayTwo, Tone.Master);



//setup perc (toms)
var synthFour = new Tone.MultiPlayer({
    "percOne": "audio/tomOne.wav",
    "percTwo": "audio/tomTwo.wav",
    "percThree": "audio/tomThree.wav",
    "percFour": "audio/tomFour.wav",
    "hatOne": "audio/hatOne.wav",
    "hatTwo": "audio/hatTwo.wav",
    "hatThree": "audio/hatThree.wav",
    "hatFour": "audio/hatFour.wav",
    "snareOne": "audio/snareOne.wav",
    "snareTwo": "audio/snareTwo.wav",
    "snareThree": "audio/snareThree.wav",
    "snareFour": "audio/snareFour.wav",
    "kickOne": "audio/kickOne.wav",
    "kickTwo": "audio/kickTwo.wav",
    "kickThree": "audio/kickThree.wav",
    "kickFour": "audio/kickFour.wav",
}, function() {
    // call function when samples are loaded
}).chain(delayFour, Tone.Master);


/*
//setup perc (toms)
var perc = new Tone.MultiPlayer({
    "percOne": "audio/tomOne.wav",
    "percTwo": "audio/tomTwo.wav",
    "percThree": "audio/tomThree.wav",
    "percFour": "audio/tomFour.wav",
}, function() {
    // call function when samples are loaded
}).toMaster();
// hats
var hat = new Tone.MultiPlayer({
    "hatOne": "audio/hatOne.wav",
    "hatTwo": "audio/hatTwo.wav",
    "hatThree": "audio/hatThree.wav",
    "hatFour": "audio/hatFour.wav",
}, function() {
    // call function when samples are loaded
}).toMaster();
//snare
var snare = new Tone.MultiPlayer({
    "snareOne": "audio/snareOne.wav",
    "snareTwo": "audio/snareTwo.wav",
    "snareThree": "audio/snareThree.wav",
    "snareFour": "audio/snareFour.wav",
}, function() {
    // call function when samples are loaded
}).toMaster();
//kick
var kick = new Tone.MultiPlayer({
    "kickOne": "audio/kickOne.wav",
    "kickTwo": "audio/kickTwo.wav",
    "kickThree": "audio/kickThree.wav",
    "kickFour": "audio/kickFour.wav",
}, function() {
    // call function when samples are loaded
}).toMaster();
*/



// melody sequencer
var melodyLoop = new Tone.Sequence(function(time, col) {

    var s = sequencerOne;
    sequencerOne.currentBeat = col;
    drawGrid(ctx, s, col, sequencerOne.currentPhrase);
    var column = s.sequencerArray[sequencerOne.currentPhrase][col];
    var counter = 0;
    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1 && counter < 4) {
            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
            counter++;
            synth.triggerAttackRelease(notes(9, 'minor', i, 28), "4n", "+0.05", vel);

        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// melody phrase sequencer
var sequencerOnePhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerOnePhrase;
    s.currentBeat = (col + phraseOffset) % 16;
    drawGrid(ctxTwo, s, s.currentBeat, 0);
    var column = s.sequencerArray[0][s.currentBeat];
    for (var i = 0; i < s.buttonsX; i++) {
        if (column[i] == 1) {
            sequencerOne.currentPhrase = i;
            if (sequencerOne.viewType == 'live') {
                sequencerOne.currentView = i;
            }
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");


// harmony sequencer
var harmonyLoop = new Tone.Sequence(function(time, col) {

    var s = sequencerTwo;
    s.currentBeat = col;
    drawGrid(ctxThree, s, col, s.currentPhrase);
    var column = s.sequencerArray[s.currentPhrase][col];
    var counter = 0;
    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1 && counter < 4) {

            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
            counter++;
            synthTwo.triggerAttackRelease(notes(9, 'minor', i, 28), "8n", "+0.05", vel);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// harmony phrase sequencer
var sequencerTwoPhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerTwoPhrase;
    s.currentBeat = (col + phraseOffset) % 16;
    drawGrid(ctxFour, s, s.currentBeat, 0);
    var column = s.sequencerArray[0][s.currentBeat];
    for (var i = 0; i < s.buttonsX; i++) {
        if (column[i] == 1) {
            sequencerTwo.currentPhrase = i;
            if (sequencerTwo.viewType == 'live') {
                sequencerTwo.currentView = i;
            }
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");

// bass sequencer
var bassLoop = new Tone.Sequence(function(time, col) {

    var s = sequencerThree;
    s.currentBeat = col;
    drawGrid(ctxFive, s, col, s.currentPhrase);
    var column = s.sequencerArray[s.currentPhrase][col];
    var counter = 0;
    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1 && counter < 4) {
            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
            counter++;
            synthThree.triggerAttackRelease(notes(9, 'minor', i, 28), "2n", "+0.05", vel);

        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// bass phrase sequencer
var sequencerThreePhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerThreePhrase;
    s.currentBeat = (col + phraseOffset) % 16;
    drawGrid(ctxSix, s, s.currentBeat, 0);
    var column = s.sequencerArray[0][s.currentBeat];
    for (var i = 0; i < s.buttonsX; i++) {
        if (column[i] == 1) {
            sequencerThree.currentPhrase = i;
            if (sequencerThree.viewType == 'live') {
                sequencerThree.currentView = i;
            }
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");



// percussion sequencer
var percLoop = new Tone.Sequence(function(time, col) {

    var s = sequencerFour;
    s.currentBeat = col;
    drawGrid(ctxSeven, s, col, s.currentPhrase);
    var column = s.sequencerArray[s.currentPhrase][col];

    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1) {
            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
			console.log(sequencerFour.Gain)
			sequencerFour.Gain = vel
            // trigger note - select note is 'i'

            switch (i) {
                case 0:
                    synthFour.start("kickOne", undefined, undefined,undefined,undefined, vel);
                    break;
                case 1:
                    synthFour.start("kickTwo", undefined, undefined,undefined,undefined, vel);
                    break;
                case 2:
                    synthFour.start("kickThree", undefined, undefined,undefined,undefined, vel);
                    break;
                case 3:
                    synthFour.start("kickFour", undefined, undefined,undefined,undefined, vel);
                    break;
                case 4:
                    synthFour.start("snareOne", undefined, undefined,undefined,undefined, vel);
                    break;
                case 5:
                    synthFour.start("snareTwo", undefined, undefined,undefined,undefined, vel);
                    break;
                case 6:
                    synthFour.start("snareThree", undefined, undefined,undefined,undefined, vel);
                    break;
                case 7:
                    synthFour.start("snareFour", undefined, undefined,undefined,undefined, vel);
                    break;
                case 8:
                    synthFour.start("hatOne", undefined, undefined,undefined,undefined, vel);
                    break;
                case 9:
                    synthFour.start("hatTwo", undefined, undefined,undefined,undefined, vel);
                    break;
                case 10:
                    synthFour.start("hatThree", undefined, undefined,undefined,undefined, vel);
                    break;
                case 11:
                    synthFour.start("hatFour", undefined, undefined,undefined,undefined, vel);
                    break;
                case 12:
                    synthFour.start("percOne", undefined, undefined,undefined,undefined, vel);
                    break;
                case 13:
                    synthFour.start("percOne", undefined, undefined,undefined,undefined, vel);
                    break;
                case 14:
                    synthFour.start("percOne", undefined, undefined,undefined,undefined, vel);
                    break;
                case 15:
                    synthFour.start("percOne", undefined, undefined,undefined,undefined, vel);
                    break;
            }
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// percussion phrase sequencer
var sequencerFourPhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerFourPhrase;
    s.currentBeat = (col + phraseOffset) % 16;
    drawGrid(ctxEight, s, s.currentBeat, 0);
    var column = s.sequencerArray[0][s.currentBeat];
    for (var i = 0; i < s.buttonsX; i++) {
        if (column[i] == 1) {
            sequencerFour.currentPhrase = i;
            if (sequencerFour.viewType == 'live') {
                sequencerFour.currentView = i;
            }
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "1n");







// Slider Stuff!

// setting up a slider: a messy spaghetti piece of shit.

// .... now this has changed. So ignore instructions below and when change is stable it needs to be deleted / edited.

// ZERO: (yes I'm starting from zero because I forgot this rule, fuck you.) Create canvas in HTML for slider, set up the contexts here (just below!)
// ZERO POINT FIVE: (shut up) add a button to the HTML and label it effectName + 'Button'.
// ONE: Set up it's slider object as: sliderObject(effect to change, canvas, canvas element, first value(defunct due to server), minimum, maximum, effect name)
// TWO: Put the object into effectArray to make my life a fair bit easier.
// THREE: Go into sio-server.js and follow those instructions!

// slider canvases
/*
var volOneElement = document.getElementById("volumeOne");
var volOne = volOneElement.getContext("2d");

var volTwoElement = document.getElementById("volumeTwo");
var volTwo = volTwoElement.getContext("2d");
*/

var volElement = document.getElementById("volumeAll");
var volCanvas = volElement.getContext("2d");

var delayElement = document.getElementById("delay");
var delayCanvas = delayElement.getContext("2d");

var delayFeedbackElement = document.getElementById("delayFeedback");
var delayFeedbackCanvas = delayFeedbackElement.getContext("2d");

var delayTimeElement = document.getElementById("delayTime");
var delayTimeCanvas = delayTimeElement.getContext("2d");

var attackElement = document.getElementById("attack");
var attackCanvas = attackElement.getContext("2d");

var decayElement = document.getElementById("decay");
var decayCanvas = decayElement.getContext("2d");

var sustainElement = document.getElementById("sustain");
var sustainCanvas = sustainElement.getContext("2d");

var releaseElement = document.getElementById("release");
var releaseCanvas = releaseElement.getContext("2d");


//var volAllElement = document.getElementById("volumeAll");
//var volAll = volAllElement.getContext("2d");


// making a UI slider in Canvas.


function drawLine(canvas){
	canvas.fillStyle = 'rgb(0,0,0)';
	canvas.fillRect(0,14,200,2);	
}

function drawHead(canvas, x){
	canvas.fillStyle = 'rgb(10,10,10)';
	canvas.fillRect(x,5,6,20);
}

function ghostHead(canvas, x){
	drawLine(canvas);
	canvas.fillStyle = 'rgb(140,90,90)';
	canvas.fillRect(x,5,6,20);
}

function drawSlider(slider){
	clearCanvas(slider.canvas);
	ghostHead(slider.canvas,slider.ghostPosition);
	drawHead(slider.canvas,slider.floatingHeadPosition);
}

function logSlider(position, minp, maxp, minv, maxv) { // this is not my function, because I cannot maths this well

  // The result should be between 100 an 10000000
  var minz = Math.log(minv);
  var maxz = Math.log(maxv);

  // calculate adjustment factor
  var scale = (maxz-minz) / (maxp-minp);

  return Math.exp(minz + scale*(position-minp));
}

function sliderObject (effect, canvas, canvasElement, value, min, max, effectName, seq, mode){
	this.mode = mode;
	this.logarithmic = 0;
	this.sequencerNumber = seq;
	this.effectName = effectName;
	this.buttonName = this.effectName + "Button";
	this.effect = effect;
	// automation stuffs
	this.goTriggered = 0;
	this.goTrigger = function(){
		if (this.goTriggered == 0){
			this.goTriggered = 1;
		}
	}
	this.valueAtTrigger = 0;
	this.positionAtTrigger = 0;
	this.ghostValue = value;
	this.floatingHeadValue = value; // server sends initial value 
	
	this.maxValue = max;
	this.minValue = min;
	this.valueRange = this.maxValue - this.minValue
	
	this.floatingHeadPixelToValue = function(pixel){
		this.floatingHeadPosition = pixel;
		var value = ((this.valueRange / 194) * pixel) + this.minValue;
		// var value = logSlider()
		this.floatingHeadValue = value;
		return value;
	}
	
	
	this.ghostPixelToValue = function(pixel){ 
		this.ghostPosition = pixel;		
		var value = ((this.valueRange / 194) * pixel) + this.minValue;
		this.ghostValue = value;
		return value;
	}
	
	
	this.floatingHeadValueToPixel = function(values){
		this.floatingHeadValue = values;
		var pixel =  ((194 / this.valueRange) * values) - ((194 / this.valueRange) * this.minValue);
		this.floatingHeadPosition = pixel;	
		return pixel;
	}
	
	this.floatingHeadValueToPixel(value);
	
	this.ghostValueToPixel = function(values){
		this.ghostValue = values;
		var pixel =  ((194 / this.valueRange) * values) - ((194 / this.valueRange) * this.minValue);
		this.ghostPosition = pixel;	
//		console.log(this.ghostValue, ': ghostValue in valuetopixel function')
		return pixel;
	}
	
	this.ghostValueToPixel(value);
	
	
	this.canvas = canvas;
	this.canvasElement = canvasElement;
	this.isClicked = 0;
	
	this.buttonName;
}

// volume sliders
var volSliderOne = new sliderObject(synth.volume, volCanvas,volElement,-80,-80,0, 'volumeAll', 0,'value');
var volSliderTwo = new sliderObject(synthTwo.volume, volCanvas,volElement,-80,-80,0, 'volumeAll', 1,'value');
var volSliderThree = new sliderObject(synthThree.volume, volCanvas,volElement,-80,-80,0, 'volumeAll', 2,'value');
var volSliderFour = new sliderObject(synthFour.volume, volCanvas,volElement,-80,-70,10, 'volumeAll', 3,'value');
// delay (wet/dry)
var delaySliderOne = new sliderObject(delayOne.wet, delayCanvas,delayElement,0,0,1,'delay',0,'value');
var delaySliderTwo = new sliderObject(delayTwo.wet, delayCanvas,delayElement,0,0,1,'delay',1,'value')
var delaySliderThree = new sliderObject(delayThree.wet, delayCanvas,delayElement,0,0,1,'delay',2,'value')
var delaySliderFour = new sliderObject(delayFour.wet, delayCanvas,delayElement,0,0,1,'delay',3,'value')
// delay feedback
var delayFeedbackOne = new sliderObject(delayOne.feedback, delayFeedbackCanvas,delayFeedbackElement,0,0,0.8,'delayFeedback',0,'value');
var delayFeedbackTwo = new sliderObject(delayTwo.feedback, delayFeedbackCanvas,delayFeedbackElement,0,0,0.8,'delayFeedback',1,'value');
var delayFeedbackThree = new sliderObject(delayThree.feedback, delayFeedbackCanvas,delayFeedbackElement,0,0,0.8,'delayFeedback',2,'value');
var delayFeedbackFour = new sliderObject(delayFour.feedback, delayFeedbackCanvas,delayFeedbackElement,0,0,0.8,'delayFeedback',3,'value');
// delay time
var delayTimeOne = new sliderObject(delayOne.delayTime, delayTimeCanvas,delayTimeElement,0,0,1,'delayTime',0,'value');
var delayTimeTwo = new sliderObject(delayTwo.delayTime, delayTimeCanvas,delayTimeElement,0,0,1,'delayTime',1,'value');
var delayTimeThree = new sliderObject(delayThree.delayTime, delayTimeCanvas,delayTimeElement,0,0,1,'delayTime',2,'value');
var delayTimeFour = new sliderObject(delayFour.delayTime, delayTimeCanvas,delayTimeElement,0,0,1,'delayTime',3,'value');
// attack
var attackOne = new sliderObject(synth, attackCanvas,attackElement,0,0,1,'attack',0,'envelope');
var attackTwo = new sliderObject(synthTwo, attackCanvas,attackElement,0,0,1,'attack',1,'envelope');
var attackThree = new sliderObject(synthThree, attackCanvas,attackElement,0,0,1,'attack',2,'envelope');
var attackFour = new sliderObject(synthFour, attackCanvas,attackElement,0,0,1,'attack',3,'envelope');
// decay
var decayOne = new sliderObject(synth, decayCanvas,decayElement,0,0,1,'decay',0,'envelope');
var decayTwo = new sliderObject(synthTwo, decayCanvas,decayElement,0,0,1,'decay',1,'envelope');
var decayThree = new sliderObject(synthThree, decayCanvas,decayElement,0,0,1,'decay',2,'envelope');
var decayFour = new sliderObject(synthFour, decayCanvas,decayElement,0,0,1,'decay',3,'envelope');
// sustain
var sustainOne = new sliderObject(synth, sustainCanvas,sustainElement,0,0,1,'sustain',0,'envelope');
var sustainTwo = new sliderObject(synthTwo, sustainCanvas,sustainElement,0,0,1,'sustain',1,'envelope');
var sustainThree = new sliderObject(synthThree, sustainCanvas,sustainElement,0,0,1,'sustain',2,'envelope');
var sustainFour = new sliderObject(synthFour, sustainCanvas,sustainElement,0,0,1,'sustain',3,'envelope');
// release
var releaseOne = new sliderObject(synth, releaseCanvas,releaseElement,0,0,1,'release',0,'envelope');
var releaseTwo = new sliderObject(synthTwo, releaseCanvas,releaseElement,0,0,1,'release',1,'envelope');
var releaseThree = new sliderObject(synthThree, releaseCanvas,releaseElement,0,0,1,'release',2,'envelope');
var releaseFour = new sliderObject(synthFour, releaseCanvas,releaseElement,0,0,1,'release',3,'envelope');

var effectArray = [volSliderOne, volSliderTwo, volSliderThree, volSliderFour, delaySliderOne, delaySliderTwo, delaySliderThree, delaySliderFour, delayFeedbackOne, delayFeedbackTwo,delayFeedbackThree,delayFeedbackFour,delayTimeOne,delayTimeTwo,delayTimeThree,delayTimeFour,attackOne,attackTwo,attackThree,attackFour,decayOne,decayTwo,decayThree,decayFour,sustainOne,sustainTwo,sustainThree,sustainFour,releaseOne,releaseTwo,releaseThree,releaseFour]; // an array of all the slider objects (makes for easy looping, though may be a massive issues in the future!)

function addNumbersToSliderObjects(){ // does what it says on the tin! Adds a number value to each slider.
	for(var x = 0; x<effectArray.length; x++){
		effectArray[x].number = x;
	}
}
addNumbersToSliderObjects(); // this is a really hacky way of doing things, I think. 

socket.on("effectStatus", function(serverArray) {
	// here we set all the values for the effects and stuff... Yeah, this is not pretty. Seems I like arrays.
	for (var x = 0; x<effectArray.length; x++){
		console.log(effectArray[x]);
		if (effectArray[x].mode == 'envelope'){
			if (effectArray[x].effectName == "attack"){
				var envelopeToUse = effectArray[x].effectName;
				effectArray[x].effect.set({
					"envelope": {
						"attack": serverArray[x]
					}
				});
			} else if (effectArray[x].effectName == "decay"){
				var envelopeToUse = effectArray[x].effectName;
				effectArray[x].effect.set({
					"envelope": {
						"decay": serverArray[x]
					}
				});
			} else if (effectArray[x].effectName == "sustain"){
				var envelopeToUse = effectArray[x].effectName;
				effectArray[x].effect.set({
					"envelope": {
						"sustain": serverArray[x]
					}
				});
			} else if (effectArray[x].effectName == "release"){
				var envelopeToUse = effectArray[x].effectName;
				effectArray[x].effect.set({
					"envelope": {
						"release": serverArray[x]
					}
				});
			}
			effectArray[x].ghostValueToPixel(serverArray[x]);
			effectArray[x].floatingHeadValueToPixel(serverArray[x]);
			
		
			
		} else if (effectArray[x].mode == 'value'){
		effectArray[x].effect.value = serverArray[x];
		effectArray[x].ghostValueToPixel(serverArray[x]);
		effectArray[x].floatingHeadValueToPixel(serverArray[x]);
	}
		
	}
});

var sliderLoop = setInterval(function(){ // draws the sliders every 100ms

	for (var x = currentSequencer;x<effectArray.length;x=x+4){ // loops through all effect sliders
		drawSlider(effectArray[x]); // draws all effect sliders
	}
}, 100); 





function sliderClicks(slider){ // sorts out all the event listeners for the canvases
	
	slider.canvasElement.addEventListener("click", function(e) {
		if(slider.sequencerNumber == currentSequencer){
			var clickPosition = getMousePos(slider.canvasElement, e);
			if (clickPosition.x<195){
				slider.floatingHeadPixelToValue(clickPosition.x);
			} if (clickPosition.x>195){
				slider.floatingHeadPixelToValue(194);
			}
		}
	});
	
	slider.canvasElement.addEventListener("mousedown", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
		if(slider.sequencerNumber == currentSequencer){
		
    		slider.isClicked = 1;
			slider.canvasElement.addEventListener("mousemove", function(move) {
				var clickPosition = getMousePos(slider.canvasElement, move);
				
				
				if (slider.isClicked == 1 && clickPosition.x<194){
					slider.floatingHeadPixelToValue(clickPosition.x);
				}
				if (slider.isClicked == 1 && clickPosition.x>195){
							slider.floatingHeadPixelToValue(194);
						}
			})
		}
		});
	slider.canvasElement.addEventListener("touchstart", function(e) {
		if(slider.sequencerNumber == currentSequencer){
		slider.isClicked = 1;
	}
	});
	
	slider.canvasElement.addEventListener("touchmove", function(e) {
		if(slider.sequencerNumber == currentSequencer){
		
		var clickPosition = getMousePos(slider.canvasElement, move);
		
		
		if (isClicked == 1 && clickPosition.x<194){
			slider.floatingHeadPixelToValue(clickPosition.x);
		}
	}
	});
	slider.canvasElement.addEventListener("mouseup", function(e) {
		if(slider.sequencerNumber == currentSequencer){
		slider.isClicked = 0;
	}
	});
	slider.canvasElement.addEventListener("mouseleave", function(e){
		if(slider.sequencerNumber == currentSequencer){
		slider.isClicked = 0;
	}
	});

	// var serverEffectSendArray = [effectNumber, effectValue]

	document.getElementById(slider.buttonName).addEventListener("click", function(e) { // when the button is clicked, change the bool to 'on'
	  if(slider.sequencerNumber == currentSequencer){
		if (slider.goTriggered != 1 && slider.goTriggered != 2 && slider.goTriggered != 3){
	   	 	slider.goTriggered = 1;
			slider.valueAtTrigger = slider.floatingHeadValue;
			var arrayToServer = [slider.number,	slider.floatingHeadValue]
			socket.emit("effectChangeToServer", arrayToServer);
		}
	}
	});

}

socket.on("effectServerEdit", function(arrayFromServer){
		
	effectArray[arrayFromServer[0]].goTriggered = 2; // the correct slider object selected! Changes the state of the Go! button to server input.
	effectArray[arrayFromServer[0]].valueAtTrigger = arrayFromServer[1]; // change selected slider's value at trigger to server-recieved number.
	console.log(arrayFromServer[1]);
});

function sliderClickStarter(){ // start reading input for all sliders in the effectArray.
	for (var x = 0;x<effectArray.length;x++){ // loops through all effect sliders
		sliderClicks(effectArray[x]); // starts reading input on all sliders
	}
}

sliderClickStarter();

/*
Automation procedure:
set initial value from server & store as effect value.
draw slider accordingly, with ghost & main head at initial value.
when server recieves value (from the 'go!' button), broadcast to all clients.
when client revieves a 'go!' event, set a bool to 1 and on the next loop change the effect value to new value, over one bar.
(reset bool to 0. if bool is already at 1, just change value. This will prevent crazy glitchiness!);
Same applies when user presses 'go' button - bool is set to 1 and effect changes to value at time of press.
*/




function effectAutomation(slider){ // to be called whenever selected effect is to be automated.
		
	
	slider.goTriggered = 3; // when goTriggered is 3, it is in 'in progress' mode and this function cannot be called until it is not 3.
	var totalChange = slider.valueAtTrigger - slider.ghostValue; // get the amount of change between current value (ghostValue) and value when triggered
	var changeChunk = totalChange / 80 //amount of change needed every 100ms (as 1 bar = 2000ms & we're using 4 bars, this means totalChange / 80)
		
	// for a logarithmic slider. Not yet implemented.
	if(slider.mode == 'envelope'){ // if mode is 'envelope' (because envelopes are annoying and need to be right, so we've got to repeat ourselves a bit)
		var attackValue = slider.effect.get("envelope".attack);
		var decayValue =slider.effect.get("envelope".decay);
		
		if (slider.effectName == 'attack'){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "envelope": {
		                "attack": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'decay'){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "envelope": {
		                "decay": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'sustain'){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "envelope": {
		                "sustain": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'release'){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "envelope": {
		                "decay": slider.ghostValue
		            }
		        })) 
			}, 100);
		} 
	
		
	} else if (slider.mode =='value') { // if the synth is set to 'value': changing effects or volume
		
	if(slider.logarithmic == 1){
	var automationInterval = setInterval(function() { 
		slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
		slider.ghostValueToPixelLog(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
		slider.effect.value = slider.ghostValue; // change the effect value
		console.log('slider name: ', slider.effectName, slider.sequencerNumber, ', slider red value: ', slider.ghostValue, ', effect value: ',slider.effect.value);
	}, 100);
	
	} else {	
	var automationInterval = setInterval(function() { 
		slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
		slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
		slider.effect.value = slider.ghostValue; // change the effect value
		console.log('slider name: ', slider.effectName, slider.sequencerNumber, ', slider red value: ', slider.ghostValue, ', effect value: ',slider.effect.value);
	}, 100);
	}
} else {
	console.log('ERROR!')
}
		
	setTimeout(function() {
		clearInterval(automationInterval);
		slider.goTriggered = 0;
	}, 8000)
	

}

/*
document.getElementById('volumeChangerOne').addEventListener("click", function(e) { // when the button is clicked, change the bool to 'on'
	var s = volSliderOne;
	if (s.goTriggered != 1 && s.goTriggered != 2 && s.goTriggered != 3){
    volSliderOne.goTriggered = 1;
	}
});

document.getElementById('volumeChangerTwo').addEventListener("click", function(e) { // when the button is clicked, change the bool to 'on'
	var s = volSliderTwo;
	if (s.goTriggered != 1 && s.goTriggered != 2 && s.goTriggered != 3){
    volSliderOne.goTriggered = 1;
	}
});
*/

var effectLoop = new Tone.Loop(function(time) {
	
	for (var x = 0;x<effectArray.length;x++){ // loops through all effect sliders to see if any have been called
		if (effectArray[x].goTriggered == 1){ // 1 is for user pressing the button (takes the value from the current floating head!);
		
			effectAutomation(effectArray[x]); // if goTriggered is true, call the effectAutomation function for this object.
		} else if (effectArray[x].goTriggered == 2){
			effectAutomation(effectArray[x]); // if goTriggered is true, call the effectAutomation function for this object.
		}
	}

}, "1m").start(0);







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

function synthChanger(effectName, val) {
    formattingName = '#' + effectName;
    if (effectName == 'harmonicity') {
        synth.set(effectName, val * 0.03)
        document.querySelector(formattingName).value = val * 0.03;
    } else if (effectName == 'modulationIndex') {
        synth.set(effectName, val);
        document.querySelector(formattingName).value = val;
    } else if (effectName == 'attack') {
        synth.set({
            "envelope": {
                "attack": val * 0.01
            }
        })
        document.querySelector(formattingName).value = val * 0.01;
    } else if (effectName == 'decay') {
        synth.set({
            "envelope": {
                "decay": val * 0.01
            }
        })
        document.querySelector(formattingName).value = val * 0.01;
    } else if (effectName == 'sustain') {
        synth.set({
            "envelope": {
                "sustain": val * 0.01
            }
        })
        document.querySelector(formattingName).value = val * 0.01;
    } else if (effectName == 'release') {
        synth.set({
            "envelope": {
                "release": val * 0.01
            }
        })
        document.querySelector(formattingName).value = val * 0.01;
    }
}



document.getElementById('playButton').addEventListener("click", function(e) {
    startPressed = 1;
})

function start() {
    Tone.Transport.start("+0.1");
    melodyLoop.start();
    harmonyLoop.start();
    bassLoop.start();
    percLoop.start();
    sequencerOnePhraseSequencer.start();
    sequencerTwoPhraseSequencer.start();
    sequencerThreePhraseSequencer.start();
    sequencerFourPhraseSequencer.start();
}


function stop() {
    harmonyLoop.stop();
    melodyLoop.stop();
    bassLoop.stop();
    percLoop.stop();
}

// End of audio stuff

// for iOS
StartAudioContext(Tone.context, "#playButton", function() {
	Tone.startMobile()
    console.log('context online!');
})