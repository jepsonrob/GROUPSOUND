
/*
    o__ __o      o__ __o__/_       o__ __o        o         o    o__ __o__/_   o          o        o__ __o     o__ __o__/_   o__ __o       
   /v     v\    <|    v           /v     v\      <|>       <|>  <|    v       <|\        <|>      /v     v\   <|    v       <|     v\      
  />       <\   < >              />       <\     / \       / \  < >           / \\o      / \     />       <\  < >           / \     <\     
 _\o____         |             o/           \o   \o/       \o/   |            \o/ v\     \o/   o/              |            \o/     o/     
      \_\__o__   o__/_        <|             |>   |         |    o__/_         |   <\     |   <|               o__/_         |__  _<|      
            \    |             \\           //   < >       < >   |            / \    \o  / \   \\              |             |       \     
  \         /   <o>              \       \o/      \         /   <o>           \o/     v\ \o/     \         /  <o>           <o>       \o   
   o       o     |                o       |        o       o     |             |       <\ |       o       o    |             |         v\  
   <\__ __/>    / \  _\o__/_      <\__   / \       <\__ __/>    / \  _\o__/_  / \        < \      <\__ __/>   / \  _\o__/_  / \         <\ 
                                                                                                                                           
                                                                                                                                           
                                                                                                                                           
	  									o              o   __o__  ____o__ __o____   o         o  
	  									 <|>            <|>    |     /   \   /   \   <|>       <|> 
	  									 / \            / \   / \         \o/        < >       < > 
	  									 \o/            \o/   \o/          |          |         |  
	  									  |              |     |          < >         o__/_ _\__o  
	  									 < >            < >   < >          |          |         |  
	  									  \o    o/\o    o/     |           o         <o>       <o> 
	  									   v\  /v  v\  /v      o          <|          |         |  
	  									    <\/>    <\/>     __|>_        / \        / \       / \ 
                                                           


	 												o          o    o__ __o__/_   
													<|\        /|>  <|    v        
  	 												/ \\o    o// \  < >            
  	 												\o/ v\  /v \o/   |             
 	 												|    <\/>   |    o__/_         
 	 												/ \        / \   |            
 	 												\o/        \o/  <o>                 
 	 												|          |    |             
 	 												/ \        / \  / \  _\o__/_  
                                     
                                     												by Rob Jepson
																							(www.robjepson.com)
                                                                                                                                                                                                                                                                                                                       
   /////////////////////// /////////////////////// /////////////////////// /////////////////////// /////////////////////// ///////////////////////                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                   
  ____     ___     ____   _  __  _____   _____       ___    ___  
 / ___|   / _ \   / ___| | |/ / | ____| |_   _|     |_ _|  / _ \ 
 \___ \  | | | | | |     | ' /  |  _|     | |        | |  | | | |
  ___) | | |_| | | |___  | . \  | |___    | |    _   | |  | |_| |
 |____/   \___/   \____| |_|\_\ |_____|   |_|   (_) |___|  \___/ 
    
	
	                                                             
*/


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
    // console.log('server timer!')
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

/*
  _____   _   _   _____     ____    _____    ___    _   _   _____   _   _    ____   _____   ____  
 |_   _| | | | | | ____|   / ___|  | ____|  / _ \  | | | | | ____| | \ | |  / ___| | ____| |  _ \ 
   | |   | |_| | |  _|     \___ \  |  _|   | | | | | | | | |  _|   |  \| | | |     |  _|   | |_) |
   | |   |  _  | | |___     ___) | | |___  | |_| | | |_| | | |___  | |\  | | |___  | |___  |  _ < 
   |_|   |_| |_| |_____|   |____/  |_____|  \__\_\  \___/  |_____| |_| \_|  \____| |_____| |_| \_\
                                                                                                  

*/

var seqCanvasElement = document.getElementById("sequencerOne");
var seqCanvasContext = seqCanvasElement.getContext("2d");

var phraseCanvasElement = document.getElementById("sequencerOnePhrase");
var phraseCanvasContext = phraseCanvasElement.getContext("2d");



function invertRGB(rgb, alpha) {	// Stuff to invert RGB! ... not my own work, found it at https://gist.github.com/Xordal/9bf24bc6cbc5a39f62cd ... did manage to make it have an alpha channel though.
    rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
    for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
	var rgbaOutput = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")"
    return rgbaOutput;
}	//end stuff to invert RGB


// the sequencer object

function sequencerObject(sequencerNumber, buttonsX, buttonsY, squareSize, gapSize, colourArray, canvasElement, canvasContext) { // Constructor for the sequencer object
    // Declare important variables (well we're in an object, properties)
	this.canvasElement = canvasElement;
	this.canvasContext = canvasContext;
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
	
	
	// colour stuff!
	
	this.colour = "rgb(" + colourArray[0] + "," + colourArray[1] + "," + colourArray[2] + ")";
	
	this.colourDarkBright = function(darkBright){
		var bgArray = [0,0,0]
		for(var x=0;x<colourArray.length;x++){
			bgArray[x] = colourArray[x] + darkBright;
			if (bgArray[x]<0){
				bgArray[x] = 0;
			} else if (bgArray[x]>255){
				bgArray[x] = 255;
			}
		}
		var rgbConstructor = "rgb(" + bgArray[0] + "," + bgArray[1] + "," + bgArray[2] + ")";
		return rgbConstructor;
	}
	
	// background colouring
	this.backgroundColour = this.colourDarkBright(-230);
	this.backgroundHighlightColour = this.colourDarkBright(-140);
	// velocity colours
	this.velOne = this.colourDarkBright(80);
	this.velTwo = this.colourDarkBright(60);
	this.velThree = this.colourDarkBright(30);
	this.velFour = this.colourDarkBright(0);
	this.triggeredNote = invertRGB(this.colourDarkBright(130),"0.5");
	//playhead colour
	this.playheadColour = "rgba(0,220,0,0.6)";
	
	// radio button/settings stuff
		// One
	this.selectedValueOne = 0; // selected value from either server or user
	this.isTriggeredOne = 0; // similar to isTriggered of sliders: is 1 when user, 2 when server.
	this.triggeredValueOne = 0; //value set at point where go is pressed or the server sends a value.
	this.settingsNameArrayOne = [];
		// Two
	this.selectedValueTwo = 0; // selected value from either server or user
	this.isTriggeredTwo = 0; // similar to isTriggered of sliders: is 1 when user, 2 when server.
	this.triggeredValueTwo = 0; //value set at point where go is pressed or the server sends a value.
	// this.settingsNameArrayTwo = [];
	
	
	this.noteOffset; // for the samplers
	
} // end object constructor


// Create the sequencers as needed
var sequencerOne = new sequencerObject(1, 16, 16, 15, 1, [255,3,3],seqCanvasElement,seqCanvasContext); // red!
var sequencerOnePhrase = new sequencerObject(2, 16, 10, 15, 1, [255,3,3],phraseCanvasElement,phraseCanvasContext);
var sequencerTwo = new sequencerObject(3, 16, 16, 15, 1, [150,40,255],seqCanvasElement,seqCanvasContext); // blue!
var sequencerTwoPhrase = new sequencerObject(4, 16, 10, 15, 1, [150,40,255],phraseCanvasElement,phraseCanvasContext);
var sequencerThree = new sequencerObject(5, 16, 16, 15, 1,[60,240,50],seqCanvasElement,seqCanvasContext); // green!
var sequencerThreePhrase = new sequencerObject(6, 16, 10, 15, 1,[60,240,50],phraseCanvasElement,phraseCanvasContext);
var sequencerFour = new sequencerObject(7, 16, 16, 15, 1,[255, 120, 0],seqCanvasElement,seqCanvasContext); // orange! 
var sequencerFourPhrase = new sequencerObject(8, 16, 10, 15, 1,[255, 120, 0],phraseCanvasElement,phraseCanvasContext);

/*
// set initial radio buttons states for each sequencer:
sequencerOne.settingsNameArrayOne = ['squ',];
sequencerOne.settingsNameArrayTwo = [''];
sequencerTwo.settingsNameArrayOne = [''];
sequencerTwo.settingsNameArrayTwo = [''];
sequencerThree.settingsNameArrayOne = [''];
sequencerFour.settingsNameArrayOne = [''];
*/



// set the mode on the phrase sequencers
sequencerOnePhrase.mode = 'phrase';
sequencerTwoPhrase.mode = 'phrase';
sequencerThreePhrase.mode = 'phrase';
sequencerFourPhrase.mode = 'phrase';

sequencerThree.playheadColour = "rgba(255,10,0,0.4)";
sequencerThreePhrase.playheadColour = "rgba(255,10,0,0.4)";


// stick all the sequencers in an array to make life a little easier
var sequencerObjectArray = [sequencerOne,sequencerOnePhrase,sequencerTwo,sequencerTwoPhrase,sequencerThree,sequencerThreePhrase,sequencerFour,sequencerFourPhrase,]


/*
   ____      _      _   _  __     __     _      ____  
  / ___|    / \    | \ | | \ \   / /    / \    / ___| 
 | |       / _ \   |  \| |  \ \ / /    / _ \   \___ \ 
 | |___   / ___ \  | |\  |   \ V /    / ___ \   ___) |
  \____| /_/   \_\ |_| \_|    \_/    /_/   \_\ |____/ 
                                                      
*/	

// the sequencer in view at the moment. Quite an important value that'll likely come up a fair bit.
var currentSequencer = 0; 

/* TO MAKE A WONDERFUL CANVAS SWAPOUT SYSTEM!

- Only need TWO canvases for the sequencers: seqCanvasElement + seqCanvasContext & phraseCanvasElement + phraseCanvasContext

- Need a drawgrid loop function, something like:

var gridDrawLoop = setInterval(function(){
	currentSequencer
}, 100)

*/


// Canvas & UI functions
function clearCanvas(canvas) {
    canvas.clearRect(0, 0, 500, 500);
    canvas.fillStyle = 'rgba(255,255,255,1)'; // fill with white
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




function drawGrid(sequencer, canvas) { // Draws the grid and changes the colour of any buttons that are currently 'on'

    clearCanvas(canvas); // Delete previous canvas for redraw! (DELETE ME!)

	// changes what view (live or phrase mode) is drawn according to sequencer.viewType
    if (sequencer.viewType == 'live') { // select the view type
        var currentPhrase = sequencer.currentPhrase;
    } else if (sequencer.viewType == 'phrase') {
        currentPhrase = sequencer.currentView;
    }
		

    for (var x = 0; x < sequencer.buttonsX; x++) { // draws the grid with 2 loops
        for (var y = 0; y < sequencer.buttonsY; y++) {
            var loopX = ((sequencer.gapSize * 2) + sequencer.squareSize) * x;
            var loopY = ((sequencer.gapSize * 2) + sequencer.squareSize) * y;
				
			// BELOW:
					// 
		if (sequencer.mode=='phrase' && sequencer.sequencerArray[currentPhrase][x][y] == 1){
           canvas.fillStyle = sequencer.velFour; 
           canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
		} else if (sequencer.sequencerArray[currentPhrase][x][y] >= 1) { // TRUE when the array bean is on.
                if (currentPhrase == sequencer.currentPhrase && sequencer.currentBeat != x) { // TRUE when it is not the beat and ... you know what? I trial'd and error's this conditional. I'm a hack. I don't know how it works, but it does. Let's just let that go and get on with our lives.
                    switch (sequencer.sequencerArray[currentPhrase][x][y]) { // change opacity according to velocity
                        case 1:
                            canvas.fillStyle = sequencer.velOne; // fill with 'on' colour (Velocity 1)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 2:
                            canvas.fillStyle = sequencer.velTwo; // fill with 'on' colour (Velocity 2)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 3:
                            canvas.fillStyle = sequencer.velThree; // fill with 'on' colour (Velocity 3)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 4:
                            canvas.fillStyle = sequencer.velFour; // fill with 'on' colour (Velocity 4)
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                    }

                } else if (currentPhrase != sequencer.currentPhrase) {
                    switch (sequencer.sequencerArray[currentPhrase][x][y]) { // change opacity according to velocity
                        case 1:
                            canvas.fillStyle = sequencer.velOne; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 2:
                            canvas.fillStyle = sequencer.velTwo; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 3:
                            canvas.fillStyle = sequencer.velThree; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                        case 4:
                            canvas.fillStyle = sequencer.velFour; // fill with 'on' colour
                            canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                            break;
                    }
                }

            } else if (sequencer.sequencerArray[currentPhrase][x][y] == 1 && sequencer.currentBeat == x) {

                canvas.fillStyle = "rgb(255,255,255)"; // fill with colour on the beat
                canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);

            } else {
                if (x == 0 || x == 4 || x == 8 || x == 12) {
                    canvas.fillStyle = sequencer.backgroundHighlightColour; // Fill with colour every 4th beat
                    canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                } else {
                    canvas.fillStyle = sequencer.backgroundColour; // Fill with regular colour
                    canvas.fillRect(loopX, loopY, sequencer.squareSize, sequencer.squareSize);
                }
            }
        }
    }

    if (currentPhrase == sequencer.currentPhrase) {
        // Draw the playhead according to the beat.
        var visualTempo = sequencer.currentBeat * ((sequencer.gapSize * 2) + sequencer.squareSize); // size of the playhead
        canvas.fillStyle = sequencer.playheadColour;
        canvas.fillRect(visualTempo, 0, (sequencer.gapSize + sequencer.squareSize), (sequencer.squareSize + (sequencer.gapSize * 2)) * sequencer.buttonsY);

    }
}

// Draw the canvas elements fo' the first time. Defaulting at Beat 1, Phrase 1.


drawGrid(sequencerObjectArray[0],sequencerObjectArray[0].canvasContext);
drawGrid(sequencerObjectArray[1],sequencerObjectArray[1].canvasContext);






/*
  _   _   ____    _____   ____      ___   _   _   ____    _   _   _____ 
 | | | | / ___|  | ____| |  _ \    |_ _| | \ | | |  _ \  | | | | |_   _|
 | | | | \___ \  |  _|   | |_) |    | |  |  \| | | |_) | | | | |   | |  
 | |_| |  ___) | | |___  |  _ <     | |  | |\  | |  __/  | |_| |   | |  
  \___/  |____/  |_____| |_| \_\   |___| |_| \_| |_|      \___/    |_|  
                                                                        
*/

seqCanvasElement.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	
	var clickPosition = getMousePos(seqCanvasElement, e);
	var sequencerClicker = sequencerObjectArray[currentSequencer * 2];
	
    clickEdit(clickPosition.x, clickPosition.y, seqCanvasContext, sequencerClicker, sequencerClicker.currentView);
	//drawGrid(sequencerClicker, sequencerClicker.canvasContext);
});

phraseCanvasElement.addEventListener("click", function(e) { // when the canvas is clicked, call the draw function and give it the coordinates.
	var clickPosition = getMousePos(phraseCanvasElement, e);
	var phraseClicker = sequencerObjectArray[(currentSequencer * 2) + 1];
	
    clickEdit(clickPosition.x, clickPosition.y, phraseCanvasContext, phraseClicker, 0);
	drawGrid(phraseClicker,phraseClicker.canvasContext);
	
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


} // end of function



/*
var drawSeqGridLoop = setInterval(function(){
	drawGrid(sequencerObjectArray[currentSequencer],sequencerObjectArray[currentSequencer].canvasContext);
}, 100)
*/



/*
	
     _      _   _   ____    ___    ___  
    / \    | | | | |  _ \  |_ _|  / _ \ 
   / _ \   | | | | | | | |  | |  | | | |
  / ___ \  | |_| | | |_| |  | |  | |_| |
 /_/   \_\  \___/  |____/  |___|  \___/ 
                                        
										
 /////////////////////// /////////////////////// /////////////////////// /////////////////////// /////////////////////// ///////////////////////                                                                                                                                                                                                                                                

										
						                                                                                                                       	
*/


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

/*
  ____   __   __  _   _   _____   _   _   ____         __    ____       _      __  __   ____    _       _____   ____    ____  
 / ___|  \ \ / / | \ | | |_   _| | | | | / ___|       / /   / ___|     / \    |  \/  | |  _ \  | |     | ____| |  _ \  / ___| 
 \___ \   \ V /  |  \| |   | |   | |_| | \___ \      / /    \___ \    / _ \   | |\/| | | |_) | | |     |  _|   | |_) | \___ \ 
  ___) |   | |   | |\  |   | |   |  _  |  ___) |    / /      ___) |  / ___ \  | |  | | |  __/  | |___  | |___  |  _ <   ___) |
 |____/    |_|   |_| \_|   |_|   |_| |_| |____/    /_/      |____/  /_/   \_\ |_|  |_| |_|     |_____| |_____| |_| \_\ |____/ 
      
*/

//setup effects
// Synth One Effects
// var reverbOne = new Tone.Freeverb();
// var distOne = new Tone.Distortion();
var delayOne = new Tone.PingPongDelay();
var crushOne = new Tone.BitCrusher();
var eqOne = new Tone.EQ3();
// Synth Two Effects
//var reverbTwo = new Tone.Freeverb();
// var distTwo = new Tone.Distortion();
var delayTwo = new Tone.PingPongDelay();
var crushTwo = new Tone.BitCrusher();
var eqTwo = new Tone.EQ3();


// Synth Three Effects
//var reverbThree = new Tone.Freeverb();
// var distThree = new Tone.Distortion();
var delayThree = new Tone.PingPongDelay();
var crushThree = new Tone.BitCrusher();
var eqThree = new Tone.EQ3();


// Percussion Effects
// Perc
//var reverbFour = new Tone.Freeverb();
// var distFour = new Tone.Distortion();
var delayFour = new Tone.PingPongDelay();
var crushFour = new Tone.BitCrusher();
var eqFour = new Tone.EQ3();

eqOne.low.value = -100;
eqTwo.low.value = -100;
eqThree.low.value = -100;
eqFour.low.value = -100;

eqOne.high.value = -100;
eqTwo.high.value = -100;
eqThree.high.value = -100;
eqFour.high.value = -100;

eqOne.lowFrequency.value = 19;
eqTwo.lowFrequency.value = 19;
eqThree.lowFrequency.value = 19;
eqFour.lowFrequency.value = 19;

eqOne.highFrequency.value = 20000;
eqTwo.highFrequency.value = 20000;
eqThree.highFrequency.value = 20000;
eqFour.highFrequency.value = 20000;


//setup a synth

var synth = new Tone.PolySynth(2, Tone.FMSynth).chain(crushOne, eqOne, delayOne, Tone.Master);

synth.set({
    "envelope": {
        "attack": 0.01,
        "decay": 0,
        "sustain": 10,
        "release": 0.5,
    }
});



//synth two
var synthTwo = new Tone.PolySynth(2, Tone.MonoSynth).chain(crushTwo,eqTwo,  delayTwo, Tone.Master);

synthTwo.set({
    "envelope": {
        "attack": 0.01,
        "decay": 0.5,
        "sustain": 10,
        "release": 0.5,
    }
});


var synthThree = new Tone.MultiPlayer({
	"piano0": "audio/piano0.wav",
	"piano1": "audio/piano1.wav",
	"piano2": "audio/piano2.wav",
	"piano3": "audio/piano3.wav",
	"piano4": "audio/piano4.wav",
	"piano5": "audio/piano5.wav",
	"piano6": "audio/piano6.wav",
	"piano7": "audio/piano7.wav",
	"piano8": "audio/piano8.wav",
	"piano9": "audio/piano9.wav",
	"piano10": "audio/piano10.wav",
	"piano11": "audio/piano11.wav",
	"piano12": "audio/piano12.wav",
	"piano13": "audio/piano13.wav",
	"piano14": "audio/piano14.wav",
	"piano15": "audio/piano15.wav",
	"harp0" : "audio/harp_0.wav",
	"harp1" : "audio/harp_1.wav",
	"harp2" : "audio/harp_2.wav",
	"harp3" : "audio/harp_3.wav",
	"harp4" : "audio/harp_4.wav",
	"harp5" : "audio/harp_5.wav",
	"harp6" : "audio/harp_6.wav",
	"harp7" : "audio/harp_7.wav",
	"harp8" : "audio/harp_8.wav",
	"harp9" : "audio/harp_9.wav",
	"harp10" : "audio/harp_10.wav",
	"harp11" : "audio/harp_11.wav",
	"harp12" : "audio/harp_12.wav",
	"harp13" : "audio/harp_13.wav",
	"harp14" : "audio/harp_14.wav",
	"harp15" : "audio/harp_15.wav",
	"violin0" : "audio/violin_0.wav",
	"violin1" : "audio/violin_1.wav",
	"violin2" : "audio/violin_2.wav",
	"violin3" : "audio/violin_3.wav",
	"violin4" : "audio/violin_4.wav",
	"violin5" : "audio/violin_5.wav",
	"violin6" : "audio/violin_6.wav",
	"violin7" : "audio/violin_7.wav",
	"violin8" : "audio/violin_8.wav",
	"violin9" : "audio/violin_9.wav",
	"violin10" : "audio/violin_10.wav",
	"violin11" : "audio/violin_11.wav",
	"violin12" : "audio/violin_12.wav",
	"violin13" : "audio/violin_13.wav",
	"violin14" : "audio/violin_14.wav",
	"violin15" : "audio/violin_15.wav",
	"sample0" : "audio/a.wav",
	"sample1" : "audio/b.wav",
	"sample2" : "audio/c.wav",
	"sample3" : "audio/d.wav",
	"sample4" : "audio/e.wav",
	"sample5" : "audio/f.wav",
	"sample6" : "audio/g.wav",
	"sample7" : "audio/h.wav",
	"sample8" : "audio/i.wav",
	"sample9" : "audio/j.wav",
	"sample10" : "audio/k.wav",
	"sample11" : "audio/l.wav",
	"sample12" : "audio/m.wav",
	"sample13" : "audio/n.wav",
	"sample14" : "audio/o.wav",
	"sample15" : "audio/p.wav",
}, function() {
    // call function when samples are loaded
}).chain(crushThree,eqThree,  delayThree, Tone.Master);

var synthThreeSampleArray = [
	"piano0","piano1","piano2","piano3","piano4","piano5","piano6","piano7","piano8","piano9","piano10","piano11","piano12","piano13","piano14","piano15",
	"harp0","harp1","harp2","harp3","harp4","harp5","harp6","harp7","harp8","harp9","harp10","harp11","harp12","harp13","harp14","harp15",
	"violin0","violin1","violin2","violin3","violin4","violin5","violin6","violin7","violin8","violin9","violin10","violin11","violin12","violin13","violin14","violin15",
	"sample0","sample1","sample2","sample3","sample4","sample5","sample6","sample7","sample8","sample9","sample10","sample11","sample12","sample13","sample14","sample15",
];



//setup perc (toms)
var synthFour = new Tone.MultiPlayer({
    "percOneBankOne": "audio/tomOneBankOne.wav",
    "percTwoBankOne": "audio/tomTwoBankOne.wav",
    "percThreeBankOne": "audio/tomThreeBankOne.wav",
    "percFourBankOne": "audio/tomFourBankOne.wav",
    "hatOneBankOne": "audio/hatOneBankOne.wav",
    "hatTwoBankOne": "audio/hatTwoBankOne.wav",
    "hatThreeBankOne": "audio/hatThreeBankOne.wav",
    "hatFourBankOne": "audio/hatFourBankOne.wav",
    "snareOneBankOne": "audio/snareOneBankOne.wav",
    "snareTwoBankOne": "audio/snareTwoBankOne.wav",
    "snareThreeBankOne": "audio/snareThreeBankOne.wav",
    "snareFourBankOne": "audio/snareFourBankOne.wav",
    "kickOneBankOne": "audio/kickOneBankOne.wav",
    "kickTwoBankOne": "audio/kickTwoBankOne.wav",
    "kickThreeBankOne": "audio/kickThreeBankOne.wav",
    "kickFourBankOne": "audio/kickFourBankOne.wav",
    "percOneBankTwo": "audio/tomOneBankTwo.wav",
    "percTwoBankTwo": "audio/tomTwoBankTwo.wav",
    "percThreeBankTwo": "audio/tomThreeBankTwo.wav",
    "percFourBankTwo": "audio/tomFourBankTwo.wav",
    "hatOneBankTwo": "audio/hatOneBankTwo.wav",
    "hatTwoBankTwo": "audio/hatTwoBankTwo.wav",
    "hatThreeBankTwo": "audio/hatThreeBankTwo.wav",
    "hatFourBankTwo": "audio/hatFourBankTwo.wav",
    "snareOneBankTwo": "audio/snareOneBankTwo.wav",
    "snareTwoBankTwo": "audio/snareTwoBankTwo.wav",
    "snareThreeBankTwo": "audio/snareThreeBankTwo.wav",
    "snareFourBankTwo": "audio/snareFourBankTwo.wav",
    "kickOneBankTwo": "audio/kickOneBankTwo.wav",
    "kickTwoBankTwo": "audio/kickTwoBankTwo.wav",
    "kickThreeBankTwo": "audio/kickThreeBankTwo.wav",
    "kickFourBankTwo": "audio/kickFourBankTwo.wav",
    "percOneBankThree": "audio/tomOneBankThree.wav",
    "percTwoBankThree": "audio/tomTwoBankThree.wav",
    "percThreeBankThree": "audio/tomThreeBankThree.wav",
    "percFourBankThree": "audio/tomFourBankThree.wav",
    "hatOneBankThree": "audio/hatOneBankThree.wav",
    "hatTwoBankThree": "audio/hatTwoBankThree.wav",
    "hatThreeBankThree": "audio/hatThreeBankThree.wav",
    "hatFourBankThree": "audio/hatFourBankThree.wav",
    "snareOneBankThree": "audio/snareOneBankThree.wav",
    "snareTwoBankThree": "audio/snareTwoBankThree.wav",
    "snareThreeBankThree": "audio/snareThreeBankThree.wav",
    "snareFourBankThree": "audio/snareFourBankThree.wav",
    "kickOneBankThree": "audio/kickOneBankThree.wav",
    "kickTwoBankThree": "audio/kickTwoBankThree.wav",
    "kickThreeBankThree": "audio/kickThreeBankThree.wav",
    "kickFourBankThree": "audio/kickFourBankThree.wav",
    "percOneBankFour": "audio/tomOneBankFour.wav",
    "percTwoBankFour": "audio/tomTwoBankFour.wav",
    "percThreeBankFour": "audio/tomThreeBankFour.wav",
    "percFourBankFour": "audio/tomFourBankFour.wav",
    "hatOneBankFour": "audio/hatOneBankFour.wav",
    "hatTwoBankFour": "audio/hatTwoBankFour.wav",
    "hatThreeBankFour": "audio/hatThreeBankFour.wav",
    "hatFourBankFour": "audio/hatFourBankFour.wav",
    "snareOneBankFour": "audio/snareOneBankFour.wav",
    "snareTwoBankFour": "audio/snareTwoBankFour.wav",
    "snareThreeBankFour": "audio/snareThreeBankFour.wav",
    "snareFourBankFour": "audio/snareFourBankFour.wav",
    "kickOneBankFour": "audio/kickOneBankFour.wav",
    "kickTwoBankFour": "audio/kickTwoBankFour.wav",
    "kickThreeBankFour": "audio/kickThreeBankFour.wav",
    "kickFourBankFour": "audio/kickFourBankFour.wav",
}, function() {
    // call function when samples are loaded
}).chain(crushFour,eqFour,  delayFour, Tone.Master);

var synthFourSampleArray = [
	"kickOneBankOne", "kickTwoBankOne", "kickThreeBankOne", "kickFourBankOne", 
	"snareOneBankOne", "snareTwoBankOne", "snareThreeBankOne", "snareFourBankOne",
	"hatOneBankOne", "hatTwoBankOne", "hatTwoBankOne", "hatTwoBankOne",
	"percOneBankOne", "percTwoBankOne", "percThreeBankOne", "percFourBankOne", 
	"kickOneBankTwo", "kickTwoBankTwo", "kickThreeBankTwo", "kickFourBankTwo", 
	"snareOneBankTwo", "snareTwoBankTwo", "snareThreeBankTwo", "snareFourBankTwo",
	"hatOneBankTwo", "hatTwoBankTwo", "hatTwoBankTwo", "hatTwoBankTwo",
	"percOneBankTwo", "percTwoBankTwo", "percThreeBankTwo", "percFourBankTwo", 
	"kickOneBankThree", "kickTwoBankThree", "kickThreeBankThree", "kickFourBankThree", 
	"snareOneBankThree", "snareTwoBankThree", "snareThreeBankThree", "snareFourBankThree",
	"hatOneBankThree", "hatTwoBankThree", "hatTwoBankThree", "hatTwoBankThree",
	"percOneBankThree", "percTwoBankThree", "percThreeBankThree", "percFourBankThree", 
	"kickOneBankFour", "kickTwoBankFour", "kickThreeBankFour", "kickFourBankFour", 
	"snareOneBankFour", "snareTwoBankFour", "snareThreeBankFour", "snareFourBankFour",
	"hatOneBankFour", "hatTwoBankFour", "hatTwoBankFour", "hatTwoBankFour",
	"percOneBankFour", "percTwoBankFour", "percThreeBankFour", "percFourBankFour", 
	]

/*
  ____    _____    ___    _   _   _____   _   _    ____   _____   ____      _        ___     ___    ____    ____  
 / ___|  | ____|  / _ \  | | | | | ____| | \ | |  / ___| | ____| |  _ \    | |      / _ \   / _ \  |  _ \  / ___| 
 \___ \  |  _|   | | | | | | | | |  _|   |  \| | | |     |  _|   | |_) |   | |     | | | | | | | | | |_) | \___ \ 
  ___) | | |___  | |_| | | |_| | | |___  | |\  | | |___  | |___  |  _ <    | |___  | |_| | | |_| | |  __/   ___) |
 |____/  |_____|  \__\_\  \___/  |_____| |_| \_|  \____| |_____| |_| \_\   |_____|  \___/   \___/  |_|     |____/ 
                                                                                                                  
																												  
*/

// melody sequencer
var drawGridLoop = new Tone.Sequence(function(time, col) {
	drawGrid(sequencerObjectArray[currentSequencer*2],sequencerObjectArray[currentSequencer*2].canvasContext); // note sequencer
	drawGrid(sequencerObjectArray[currentSequencer*2+1],sequencerObjectArray[currentSequencer*2+1].canvasContext); // phrase sequencer
	
	var selector = ".radioText" + (sequencerObjectArray[currentSequencer*2].currentPhrase + 1);
	$(".phraser").removeClass("pulsate");
	$(selector).addClass("pulsate");

}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// melody sequencer
var melodyLoop = new Tone.Sequence(function(time, col) {
	// drawGrid(sequencerObjectArray[currentSequencer*2],sequencerObjectArray[currentSequencer*2].canvasContext);
	// gotta check to see if it's the right one to draw, then draw it!
	
    var s = sequencerOne;
    sequencerOne.currentBeat = col;
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
    //drawGrid(ctxTwo, s, s.currentBeat, 0);
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
    //drawGrid(ctxThree, s, col, s.currentPhrase);
    var column = s.sequencerArray[s.currentPhrase][col];
    var counter = 0;
    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1 && counter < 4) {

            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
            counter++;
            synthTwo.triggerAttackRelease(notes(9, 'minor', i, 21), "8n", "+0.05", vel);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// harmony phrase sequencer
var sequencerTwoPhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerTwoPhrase;
    s.currentBeat = (col + phraseOffset) % 16;
    //drawGrid(ctxFour, s, s.currentBeat, 0);
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
    //drawGrid(ctxFive, s, col, s.currentPhrase);
    var column = s.sequencerArray[s.currentPhrase][col];
    var counter = 0;
    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1) {
            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
			sequencerThree.Gain = vel;
            // trigger note - select note is 'i'
			console.log("sequencerThree Offset = ", sequencerFour.noteOffset);
			var x = i + sequencerThree.noteOffset;
            synthThree.start(synthThreeSampleArray[x], undefined, undefined,undefined,undefined, vel);

        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// bass phrase sequencer
var sequencerThreePhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerThreePhrase;
    s.currentBeat = (col + phraseOffset) % 16;
   // drawGrid(ctxSix, s, s.currentBeat, 0);
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
   // drawGrid(ctxSeven, s, col, s.currentPhrase);
    var column = s.sequencerArray[s.currentPhrase][col];

    for (var i = 0; i < s.buttonsX; i++) {
        var currentBean = column[reverseRange(i, -1, s.buttonsX)];
        if (currentBean >= 1) {
            var vel = (currentBean * 0.25) + (Math.random() * 0.25);
			sequencerFour.Gain = vel;
            // trigger note - select note is 'i'
			var x = i + sequencerFour.noteOffset;
            synthFour.start(synthFourSampleArray[x], undefined, undefined,undefined,undefined, vel);

        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");


// percussion phrase sequencer
var sequencerFourPhraseSequencer = new Tone.Sequence(function(time, col) { // Phrase sequencer (sequencerOne)

    var s = sequencerFourPhrase;
    s.currentBeat = (col + phraseOffset) % 16;
    //drawGrid(ctxEight, s, s.currentBeat, 0);
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




/*	Radio Buttons
  ____       _      ____    ___    ___      ____    _   _   _____   _____    ___    _   _   ____  
 |  _ \     / \    |  _ \  |_ _|  / _ \    | __ )  | | | | |_   _| |_   _|  / _ \  | \ | | / ___| 
 | |_) |   / _ \   | | | |  | |  | | | |   |  _ \  | | | |   | |     | |   | | | | |  \| | \___ \ 
 |  _ <   / ___ \  | |_| |  | |  | |_| |   | |_) | | |_| |   | |     | |   | |_| | | |\  |  ___) |
 |_| \_\ /_/   \_\ |____/  |___|  \___/    |____/   \___/    |_|     |_|    \___/  |_| \_| |____/ 
                                                                                                  
*/ 



// event listeners for radio buttons
var phraseRadio = document.phraseButtons.radioGroupOne;
var seqRadio = document.sequencerButtons.radioGroupTwo;
var settingsOne = document.settingsButtonsOne.radioGroupThree;
var settingsTwo = document.settingsButtonsTwo.radioGroupFour;

var settingsValueOne = 0;
var settingsValueTwo = 0;

function clientRadioButton(buttonElement, type){
	var rad = buttonElement;
	var prev = null;
    for(var i = 0; i < rad.length; i++) {
        rad[i].onclick = function() {
			
            //(prev)? // console.log(prev.value):null;
            if(this !== prev) {
                prev = this;
            }
            var sequencerToSend = sequencerObjectArray[currentSequencer * 2];
			if (type == "phrase"){ // change phrase
			if (this.value == 'live'){
				viewChanger(sequencerToSend, 'live', 0);
			} else {
				viewChanger(sequencerToSend, 'phrase', this.value - 1);	
			}
		} else if (type =='seqSelect'){ //change sequencer
			changeSequencer(this.value);
		} else if (type == 'settingsOneChange'){
			// console.log('settingsChanger function (1,value) called')
			
			settingsChanger(1, this.value);
		} else if (type == 'settingsTwoChange'){
			// console.log('settingsChanger function (2,value) called')
			settingsChanger(2, this.value);
		}
					
		}
    }
}

function viewChanger(sequencer, viewType, viewPhrase) { // used to change the current sequencer view. (changes phrase/live etc.)
    sequencer.viewType = viewType;
    sequencer.currentView = viewPhrase;

}

viewChanger(sequencerOne,"live",0);


function changeSequencer(num){ // Use to change what sequencer we're editing... 
	currentSequencer = parseInt(num); 
	
	// change view to live
	viewChanger(currentSequencer,"live");
	document.getElementById("radio0").checked = true;
	
	buttonViewChanger()
	
	// switch out colours in the sprite sheet according to selected sequencer
	var phraseColourArray = ["red","blue","green","orange"];
	$("#phraseRadioButtons").removeClass("red blue green orange").addClass(phraseColourArray[currentSequencer]);
	$("#settingsOne").removeClass("red blue green orange").addClass(phraseColourArray[currentSequencer]);
	$("#settingsTwo").removeClass("red blue green orange").addClass(phraseColourArray[currentSequencer]); // changes all the colours to look pretty n shit
	
	// TO DO!
	// we have to change the words on the settings here, too. And hide/show the elements that come with each sequencer.
	var settingsOneTitleArray = ["Osc Type", "Osc Type", "Bank", "Bank"];
	var settingsTwoTitleArray = ["Mod Osc", "Filter Type", "Bank", "Bank"];
	$("#settingsOneTitle").text(settingsOneTitleArray[num]);
	$("#settingsTwoTitle").text(settingsTwoTitleArray[num]);
	
	
	var nameArray = ['Lead ', 'Bass ', 'Sampler ', 'Percussion ']
	$('#sequencerHeader').text(nameArray[num]);
	
	var oscArray = ["squ", "pulse", "saw", "pwm"];
	var filtArray = ["lp", "hp", "bp", "notch"];
	var bankOneArray = ["piano", "harp", "violin", "misc."];
	var bankTwoArray = ["1", "2", "3", "4"] // maybe worth naming perc. banks? 
	
	for(var x = 0;x<4;x++){
		var namerTwo = ".radioTextTwo" + x;
		var namerThree = ".radioTextThree" + x;
			switch (currentSequencer){
			case 0:
				$(namerTwo).text(oscArray[x]);
				$(namerThree).text(oscArray[x]);
				break;
			case 1:
				$(namerTwo).text(oscArray[x]);
				$(namerThree).text(filtArray[x]);
				break;
			case 2:
				$(namerTwo).text(bankOneArray[x]);
				$(namerThree).text(bankOneArray[x]);
				break;
			case 3:
				$(namerTwo).text(bankTwoArray[x]);
				$(namerThree).text(bankTwoArray[x]);
				break;
			} 
	}
	
	// drawGrid to make the change instant.
	drawGrid(sequencerObjectArray[currentSequencer*2],sequencerObjectArray[currentSequencer*2].canvasContext); // yes, this looks ridiculous. 
	drawGrid(sequencerObjectArray[currentSequencer*2+1],sequencerObjectArray[currentSequencer*2+1].canvasContext); // but it's just selecting the current sequencer
}

changeSequencer(0); // set initial sequencer state to first sequencer!


function settingsChanger(settingNumber, value){ // changes the right sequencer's 'selectedValue(s)' for when 'go' is triggered
	switch (currentSequencer){
	case 0:
		
		if (settingNumber == 1){
			sequencerOne.selectedValueOne = value;
		} else if (settingNumber == 2){
			sequencerOne.selectedValueTwo = value;
		}
		break;
	case 1:
		if (settingNumber == 1){
			sequencerTwo.selectedValueOne = value;
		} else if (settingNumber == 2){
			sequencerTwo.selectedValueTwo = value;
		}
		break;
	case 2:
		
		if (settingNumber == 1 || settingNumber == 2){
			sequencerThree.selectedValueOne = value;
			sequencerThree.selectedValueTwo = value; // sequencerThree.selectedValueTwo isn't actually used, but it's here anyway because why not.
		}
		break;
	case 3:
		
		if (settingNumber == 1 || settingNumber == 2){
			sequencerFour.selectedValueOne = value;
			sequencerFour.selectedValueTwo = value;
		}
		break;
	}
}



clientRadioButton(phraseRadio, 'phrase');
clientRadioButton(seqRadio, 'seqSelect');
clientRadioButton(settingsOne, 'settingsOneChange');
clientRadioButton(settingsTwo, 'settingsTwoChange');

function buttonViewChanger(){
	// make the currently selected effect's text pulsate
	$(".setting").removeClass("pulsate"); // removes pulsate from all, clearing it!
	var firstSetting = ".radioTextTwo" + sequencerObjectArray[currentSequencer*2].triggeredValueOne;
	var secondSetting = ".radioTextThree" + sequencerObjectArray[currentSequencer*2].triggeredValueTwo;
	
	$(firstSetting).addClass("pulsate"); // adds it to the current setting.
	$(secondSetting).addClass("pulsate"); // adds it to the current setting.
	
}

$('#synthSettingsOneGo').click(function(){
	if(sequencerObjectArray[currentSequencer*2].isTriggeredOne == 0){
		var emitArray = [(currentSequencer*2),sequencerObjectArray[currentSequencer*2].selectedValueOne]; // IMPORTANT FOR MAKING SERVER BUTTONS WORK (LOOK AT THE KEY/VALUE PAIR!)
		socket.emit("settingsOneChangeToServer", emitArray);
		sequencerObjectArray[currentSequencer*2].isTriggeredOne = 1;
		sequencerObjectArray[currentSequencer*2].triggeredValueOne = sequencerObjectArray[currentSequencer*2].selectedValueOne;
	}
})

$('#synthSettingsTwoGo').click(function(){
	if(sequencerObjectArray[currentSequencer*2].isTriggeredTwo == 0){
		var emitArray = [(currentSequencer*2+1),sequencerObjectArray[currentSequencer*2].selectedValueTwo];
		socket.emit("settingsTwoChangeToServer", emitArray);
		sequencerObjectArray[currentSequencer*2].isTriggeredTwo = 1;
		sequencerObjectArray[currentSequencer*2].triggeredValueTwo = sequencerObjectArray[currentSequencer*2].selectedValueTwo;
	}
})


socket.on("settingsStatus", function(array){ // gets settings at startup!
	for (var x=0;x<array.length;x++){
		var initialValue = parseInt(array[x]);
		switch (x){
		case 0:
			sequencerOne.triggeredValueOne = initialValue;
			break;
		case 1:
			sequencerOne.triggeredValueTwo = initialValue;
			break;
		case 2:
			sequencerTwo.triggeredValueOne = initialValue;
			break;
		case 3:
			sequencerTwo.triggeredValueTwo = initialValue;
			break;
		case 4:
			sequencerThree.triggeredValueOne = initialValue;
			sequencerThree.noteOffset = initialValue * 16;
			console.log(initialValue);
			console.log(sequencerThree.noteOffset);
			break;
		case 6:
			sequencerFour.triggeredValueOne = initialValue;
			sequencerFour.noteOffset = initialValue * 16;
			break;
		}
	}

})


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
  ____    _       ___   ____    _____   ____    ____  
 / ___|  | |     |_ _| |  _ \  | ____| |  _ \  / ___| 
 \___ \  | |      | |  | | | | |  _|   | |_) | \___ \ 
  ___) | | |___   | |  | |_| | | |___  |  _ <   ___) |
 |____/  |_____| |___| |____/  |_____| |_| \_\ |____/ 
                                                      
*/



var volElement = document.getElementById("volumeAll");
var volCanvas = volElement.getContext("2d");

var synthSettingOneElement = document.getElementById("synthSettingOne");
var synthSettingOneCanvas = synthSettingOneElement.getContext("2d");

var synthSettingTwoElement = document.getElementById("synthSettingTwo");
var synthSettingTwoCanvas = synthSettingTwoElement.getContext("2d");

var attackElement = document.getElementById("attack");
var attackCanvas = attackElement.getContext("2d");

var decayElement = document.getElementById("decay");
var decayCanvas = decayElement.getContext("2d");

var sustainElement = document.getElementById("sustain");
var sustainCanvas = sustainElement.getContext("2d");

var releaseElement = document.getElementById("release");
var releaseCanvas = releaseElement.getContext("2d");

var attackModElement = document.getElementById("attackMod");
var attackModCanvas = attackModElement.getContext("2d");

var decayModElement = document.getElementById("decayMod");
var decayModCanvas = decayModElement.getContext("2d");

var sustainModElement = document.getElementById("sustainMod");
var sustainModCanvas = sustainModElement.getContext("2d");

var releaseModElement = document.getElementById("releaseMod");
var releaseModCanvas = releaseModElement.getContext("2d");

var delayElement = document.getElementById("delay");
var delayCanvas = delayElement.getContext("2d");

var delayFeedbackElement = document.getElementById("delayFeedback");
var delayFeedbackCanvas = delayFeedbackElement.getContext("2d");

var delayTimeElement = document.getElementById("delayTime");
var delayTimeCanvas = delayTimeElement.getContext("2d");

var crushElement = document.getElementById("crush");
var crushCanvas = crushElement.getContext("2d");

var hiPassElement = document.getElementById("hiPass");
var hiPassCanvas = hiPassElement.getContext("2d");

var lowPassElement = document.getElementById("lowPass");
var lowPassCanvas = lowPassElement.getContext("2d");



// making a UI slider in Canvas.


function drawLine(canvas){
	canvas.fillStyle = 'rgb(0,0,0)';
	canvas.fillRect(0,14,200,2);	
}

function drawHead(canvas, x){
	canvas.fillStyle = 'rgb(10,10,10)';
	canvas.fillRect(x,5,6,20);
}

function ghostHead(canvas, x, colour){
	drawLine(canvas);
	canvas.fillStyle = colour;
	canvas.fillRect(x,5,6,20);
}

function drawSlider(slider, colour){
	clearCanvas(slider.canvas);
	ghostHead(slider.canvas,slider.ghostPosition,colour);
	drawHead(slider.canvas,slider.floatingHeadPosition);
}

function logSlider(position, minp, maxp, minv, maxv, inv) { // this is not my function, because I cannot maths this well. DON'T STICK NEGATIVE NUMBERS/ZERO INTO ME!

  // The result should be between 100 an 10000000
  var minz = Math.log(minv);
  var maxz = Math.log(maxv);
  
  // calculate adjustment factor
  var scale = (maxz-minz) / (maxp-minp);
  
  var logNormal = Math.exp(minz + scale*(position-minp));
  var logInverted= minp + (Math.log(position) - minz) / scale; // I have literally no idea how these work, but they do!
  
  if(inv == 1){
	  return logInverted;
	  
  } else {
	  return logNormal;
	}
}



function sliderObject (effect, canvas, canvasElement, value, min, max, effectName, seq, mode){
	
	this.mode = mode;
	this.logarithmic = 0;
	this.sequencerNumber = seq;
	this.colour
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
		if (this.logarithmic == 1){
			this.floatingHeadPosition = pixel;
			var value = logSlider(pixel,0,194,this.minValue,this.maxValue,0);
			//// console.log(logSlider(pixel,0,194,this.minValue,this.maxValue,1))
			this.floatingHeadValue = value;
			// console.log('floatingHeadPixelToValue: ', value)
		} else {
		this.floatingHeadPosition = pixel;
		var value = ((this.valueRange / 194) * pixel) + this.minValue;
		// var value = logSlider()
		this.floatingHeadValue = value;
	}
		return value;
	}
	
	
	this.ghostPixelToValue = function(pixel){ 
		if (this.logarithmic == 1){
			this.ghostValue = pixel;
			var value = logSlider(pixel,0,194,this.minValue,this.maxValue,0);
			this.ghostValue = value;
			// console.log('ghostPixelToValue: ', pixel)
			
		} else {
		this.ghostPosition = pixel;		
		var value = ((this.valueRange / 194) * pixel) + this.minValue;
		this.ghostValue = value;
	}
		return value;
	}
	
	
	this.floatingHeadValueToPixel = function(values){
		var pixel;
		if (this.logarithmic == 1){
			this.floatingHeadValue = values;
			pixel = logSlider(values,0,194,this.minValue,this.maxValue,1);
			this.floatingHeadValue = pixel;
			
		} else {
		this.floatingHeadValue = values;
		pixel =  ((194 / this.valueRange) * values) - ((194 / this.valueRange) * this.minValue);
		this.floatingHeadPosition = pixel;
		}	
		return pixel;
	}
	
	this.floatingHeadValueToPixel(value);
	
	
	this.ghostValueToPixel = function(values){
		if (this.logarithmic == 1){
			this.ghostValue = values;
			var pixel = logSlider(values,0,194,this.minValue,this.maxValue,1);
			this.ghostValue = pixel;
			// console.log('ghostValueToPixel: ', pixel)
		} else {
		this.ghostValue = values;
		var pixel =  ((194 / this.valueRange) * values) - ((194 / this.valueRange) * this.minValue);
		this.ghostPosition = pixel;	
	}
		return pixel;
	}
	
	this.ghostValueToPixel(value);
	
	
	this.canvas = canvas;
	this.canvasElement = canvasElement;
	this.isClicked = 0;
	
	this.buttonName;
}
/*

	
	//	//	//		//		//////	//////	//////	//////	//	//
	//	//	////  ////		//		//	//	//	//	//	//	//	//
	//		//	//	//		//////	//	//	//	//	//	//	//	//
	//		//		//			//	//	//	/////	/////	//////			(for the next 600 lines or so... I mean, it does work! So there's that!)
	//		//		//			//	//	//	//	//	//	//		//
	//		//		//		//////	//////	//	//	//	//	//////
		
*/


// volume sliders
var volSliderOne = new sliderObject(synth.volume, volCanvas,volElement,-80,-80,0, 'volumeAll', 0,'value');
var volSliderTwo = new sliderObject(synthTwo.volume, volCanvas,volElement,-80,-80,0, 'volumeAll', 1,'value');
var volSliderThree = new sliderObject(synthThree.volume, volCanvas,volElement,-80,-80,0, 'volumeAll', 2,'value');
var volSliderFour = new sliderObject(synthFour.volume, volCanvas,volElement,-80,-70,10, 'volumeAll', 3,'value');

// synth settings sliders (first)
var synthOneModValue = new sliderObject(synth, synthSettingOneCanvas,synthSettingOneElement,0,0,100, 'synthSettingOne', 0,'ModValue');
var synthTwoFilterFreq = new sliderObject(synthTwo, synthSettingOneCanvas,synthSettingOneElement,0,20,10000, 'synthSettingOne', 1,'FilterFreq');

var synthOneHarmonicity = new sliderObject(synth, synthSettingTwoCanvas,synthSettingTwoElement,0,0.25,6, 'synthSettingTwo', 0,'Harmonicity');
var synthTwoFilterQ = new sliderObject(synthTwo, synthSettingTwoCanvas,synthSettingTwoElement,1,1,10, 'synthSettingTwo', 1,'FilterQ');


	// main envelopes
// attack
var attackOne = new sliderObject(synth, attackCanvas,attackElement,0,0.001,1,'attack',0,'envelope');
var attackTwo = new sliderObject(synthTwo, attackCanvas,attackElement,0,0.001,1,'attack',1,'envelope');
var attackThree = new sliderObject(synthTwo, attackCanvas,attackElement,0,0.001,1,'attack',2,'envelope');
var attackOneMod = new sliderObject(synth, attackModCanvas,attackModElement,0,0.001,1,'attackMod',0,'envelope');
var attackTwoMod = new sliderObject(synthTwo, attackModCanvas,attackModElement,0,0.001,1,'attackMod',1,'envelope');

// decay
var decayOne = new sliderObject(synth, decayCanvas,decayElement,0,0.001,1,'decay',0,'envelope');
var decayTwo = new sliderObject(synthTwo, decayCanvas,decayElement,0,0.001,1,'decay',1,'envelope');
var decayOneMod = new sliderObject(synth, decayModCanvas,decayModElement,0,0.001,1,'decayMod',0,'envelope');
var decayTwoMod = new sliderObject(synthTwo, decayModCanvas,decayModElement,0,0.001,1,'decayMod',1,'envelope');
// sustain
var sustainOne = new sliderObject(synth, sustainCanvas,sustainElement,0,0.001,1,'sustain',0,'envelope');
var sustainTwo = new sliderObject(synthTwo, sustainCanvas,sustainElement,0,0.001,1,'sustain',1,'envelope');
var sustainOneMod = new sliderObject(synth, sustainModCanvas,sustainModElement,0,0.001,1,'sustainMod',0,'envelope');
var sustainTwoMod = new sliderObject(synthTwo, sustainModCanvas,sustainModElement,0,0.001,1,'sustainMod',1,'envelope');
// release
var releaseOne = new sliderObject(synth, releaseCanvas,releaseElement,0,0.001,1,'release',0,'envelope');
var releaseTwo = new sliderObject(synthTwo, releaseCanvas,releaseElement,0,0.001,1,'release',1,'envelope');
var releaseOneMod = new sliderObject(synth, releaseModCanvas,releaseModElement,0,0.001,1,'releaseMod',0,'envelope');
var releaseTwoMod = new sliderObject(synthTwo, releaseModCanvas,releaseModElement,0,0.001,1,'releaseMod',1,'envelope');

	// effects
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
var delayTimeOne = new sliderObject(delayOne.delayTime, delayTimeCanvas,delayTimeElement,0,0.01,0.4,'delayTime',0,'value');
var delayTimeTwo = new sliderObject(delayTwo.delayTime, delayTimeCanvas,delayTimeElement,0,0.01,0.4,'delayTime',1,'value');
var delayTimeThree = new sliderObject(delayThree.delayTime, delayTimeCanvas,delayTimeElement,0,0.01,0.4,'delayTime',2,'value');
var delayTimeFour = new sliderObject(delayFour.delayTime, delayTimeCanvas,delayTimeElement,0,0.01,0.4,'delayTime',3,'value');

// bitcrush wet/dry
var crushOne = new sliderObject(crushOne.wet, crushCanvas,crushElement,0,0,1,'crush',0,'value');
var crushTwo = new sliderObject(crushTwo.wet, crushCanvas,crushElement,0,0,1,'crush',1,'value');
var crushThree = new sliderObject(crushThree.wet, crushCanvas,crushElement,0,0,1,'crush',2,'value');
var crushFour = new sliderObject(crushFour.wet, crushCanvas,crushElement,0,0,1,'crush',3,'value');

// filter hipass
var hiPassOne = new sliderObject(eqOne.highFrequency, hiPassCanvas,hiPassElement,20000,5000,20000,'hiPass',0,'value');
var hiPassTwo = new sliderObject(eqTwo.highFrequency, hiPassCanvas,hiPassElement,20000,5000,20000,'hiPass',1,'value');
var hiPassThree = new sliderObject(eqThree.highFrequency, hiPassCanvas,hiPassElement,20000,5000,20000,'hiPass',2,'value');
var hiPassFour = new sliderObject(eqFour.highFrequency, hiPassCanvas,hiPassElement,20000,5000,20000,'hiPass',3,'value');

// lowpass
var lowPassOne = new sliderObject(eqOne.lowFrequency, lowPassCanvas,lowPassElement,20,20,5000,'lowPass',0,'value');
var lowPassTwo = new sliderObject(eqTwo.lowFrequency, lowPassCanvas,lowPassElement,20,20,5000,'lowPass',1,'value');
var lowPassThree = new sliderObject(eqThree.lowFrequency, lowPassCanvas,lowPassElement,20,20,5000,'lowPass',2,'value');
var lowPassFour = new sliderObject(eqFour.lowFrequency, lowPassCanvas,lowPassElement,20,20,5000,'lowPass',3,'value');

// Just so you know, (because I am not a smart man), the lowPass filters are actually high pass filters. And vice-versa. Oops.


var effectArray = [ // all the line breaks may cause problems
	volSliderOne, volSliderTwo, volSliderThree, volSliderFour,
	synthOneModValue,synthTwoFilterFreq,synthOneHarmonicity,synthTwoFilterQ,
	attackOne,attackTwo,attackOneMod,attackTwoMod,
	decayOne,decayTwo,decayOneMod,decayTwoMod,
	sustainOne,sustainTwo,sustainOneMod,sustainTwoMod,
	releaseOne,releaseTwo,releaseOneMod,releaseTwoMod, 
	delaySliderOne, delaySliderTwo, delaySliderThree, delaySliderFour, 
	delayFeedbackOne,delayFeedbackTwo,delayFeedbackThree,delayFeedbackFour,
	delayTimeOne,delayTimeTwo,delayTimeThree,delayTimeFour,
	crushOne,crushTwo,crushThree,crushFour,
	hiPassOne,hiPassTwo,hiPassThree,hiPassFour,
	lowPassOne,lowPassTwo,lowPassThree,lowPassFour,
	]; // an array of all the slider objects (makes for easy looping, though may be a massive issues in the future!) 
	

	
function addNumbersToSliderObjects(){ // does what it says on the tin! Adds a number value to each slider.
	for(var x = 0; x<effectArray.length; x++){
		effectArray[x].number = x;
	}
}
addNumbersToSliderObjects(); // this is a really hacky way of doing things, I think. 

socket.on("effectStatus", function(serverArray) {

	// here we set all the values for the effects and stuff... Yeah, this is not pretty. Seems I like arrays. It's also kinda tricky to change stuff in tone.js, sometimes. Or maybe it's me being dumb. It's probably me.
	for (var x = 0; x<effectArray.length; x++){
		
				
		if (effectArray[x].mode == "ModValue"){
						effectArray[x].effect.set({ 
							"modulationIndex": serverArray[x]
						});
						effectArray[x].ghostValueToPixel(serverArray[x]);
						effectArray[x].floatingHeadValueToPixel(serverArray[x]);
		} else if (effectArray[x].mode == "Harmonicity"){
						effectArray[x].effect.set({
							"harmonicity": serverArray[x]
						});
						effectArray[x].ghostValueToPixel(serverArray[x]);
						effectArray[x].floatingHeadValueToPixel(serverArray[x]);
		} else if (effectArray[x].mode == "FilterFreq"){
						effectArray[x].effect.set({
							"filterEnvelope": {
								"baseFrequency": serverArray[x]
							}
						});
						effectArray[x].ghostValueToPixel(serverArray[x]);
						effectArray[x].floatingHeadValueToPixel(serverArray[x]);
		} else if (effectArray[x].mode == "FilterQ"){
						effectArray[x].effect.set({
							"filterEnvelope": {
								"octave": serverArray[x]
							}
						});
						effectArray[x].ghostValueToPixel(serverArray[x]);
						effectArray[x].floatingHeadValueToPixel(serverArray[x]);		
		}
					
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
			} else if (effectArray[x].effectName == "attackMod"){
				if (effectArray[x].sequencerNumber == 0){
					effectArray[x].effect.set({
						"modulationEnvelope": {
							"attack": serverArray[x]
						}
					});
				} else if (effectArray[x].sequencerNumber == 1){
					effectArray[x].effect.set({
						"filterEnvelope": {
							"attack": serverArray[x]
						}
					});
				}
			
			} else if (effectArray[x].effectName == "decayMod"){
				if (effectArray[x].sequencerNumber == 0){
					effectArray[x].effect.set({
						"modulationEnvelope": {
							"decay": serverArray[x]
						}
					});

				} else if (effectArray[x].sequencerNumber == 1){
					effectArray[x].effect.set({
						"filterEnvelope": {
							"decay": serverArray[x]
						}
					});
				}
			} else if (effectArray[x].effectName == "sustainMod"){
				if (effectArray[x].sequencerNumber == 0){
					effectArray[x].effect.set({
						"modulationEnvelope": {
							"sustain": serverArray[x]
						}
					});
			
				} else if (effectArray[x].sequencerNumber == 1){
					effectArray[x].effect.set({
						"filterEnvelope": {
							"sustain": serverArray[x]
						}
					});
				}	
			} else if (effectArray[x].effectName == "releaseMod"){
				if (effectArray[x].sequencerNumber == 0){
					effectArray[x].effect.set({
						"modulationEnvelope": {
							"release": serverArray[x]
						}
					
					});
				} else if (effectArray[x].sequencerNumber == 1){
					effectArray[x].effect.set({
						"filterEnvelope": {
							"release": serverArray[x]
						}
					});
			}
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

var synthOneArray = [volSliderOne, synthOneModValue, synthOneHarmonicity, attackOne, decayOne, sustainOne, releaseOne, attackOneMod, decayOneMod, sustainOneMod, releaseOneMod, delaySliderOne, delayTimeOne, delayFeedbackOne, crushOne, hiPassOne, lowPassOne];
var synthTwoArray = [volSliderTwo, synthTwoFilterFreq, synthTwoFilterQ, attackTwo, decayTwo, sustainTwo, releaseTwo, attackTwoMod, decayTwoMod, sustainTwoMod, releaseTwoMod, delaySliderTwo, delayTimeTwo, delayFeedbackTwo, crushTwo, hiPassTwo, lowPassTwo];
var synthThreeArray = [volSliderThree, delaySliderThree, delayTimeThree, delayFeedbackThree, crushThree, hiPassThree, lowPassThree];
var synthFourArray = [volSliderFour, delaySliderFour, delayTimeFour, delayFeedbackFour, crushFour, hiPassFour, lowPassFour];

var synthArrayHolder = [synthOneArray, synthTwoArray, synthThreeArray, synthFourArray];



var colourArray = [sequencerOne.colour,sequencerTwo.colour,sequencerThree.colour,sequencerFour.colour]



var sliderLoop = setInterval(function(){ // draws the sliders every 100ms
	var sequencerNumberLoop = synthArrayHolder[currentSequencer];
	var currentColour = colourArray[currentSequencer];
	
	for (var x = 0;x<sequencerNumberLoop.length;x++){ // loops through all effect sliders
		drawSlider(sequencerNumberLoop[x], currentColour); // draws all effect sliders
	}
}, 100); 





function sliderClicks(slider){ // sorts out all the event listeners for the canvases
	
	slider.canvasElement.addEventListener("click", function(e) {
		// console.log(slider)
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
});

socket.on("settingsOneServerEdit", function(arrayFromServer){
	// console.log("arrayFromServer[1] (the value to change to) = ", arrayFromServer[1]);
	// console.log("sequencerObjectArray[arrayFromServer[0]] = ", sequencerObjectArray[arrayFromServer[0]]);
	
	sequencerObjectArray[arrayFromServer[0]].isTriggeredOne = 2;
	// console.log(sequencerObjectArray[arrayFromServer[0]].isTriggeredOne);
	var serverValue = parseInt(arrayFromServer[1]);
	sequencerObjectArray[arrayFromServer[0]].triggeredValueOne = serverValue;
});

socket.on("settingsTwoServerEdit", function(arrayFromServer){
	sequencerObjectArray[arrayFromServer[0]].isTriggeredTwo = 2;
	var serverValue = parseInt(arrayFromServer[1]);
	sequencerObjectArray[arrayFromServer[0]].triggeredValueTwo = serverValue;
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
	
	if (slider.mode == "ModValue"){
		var automationInterval = setInterval(function() { 
			slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
			slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
			slider.effect.set({ 
				"modulationIndex": slider.ghostValue
				}); 
		}, 100);
		
	} else if (slider.mode ==  "Harmonicity"){
		var automationInterval = setInterval(function() { 
			slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
			slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
			slider.effect.set({ 
				"harmonicity": slider.ghostValue
				}); 
		}, 100);
	} else if (slider.mode ==  "FilterFreq"){
		var automationInterval = setInterval(function() { 
			slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
			slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
			slider.effect.set({ 
				"filterEnvelope":{
					"baseFrequency" : slider.ghostValue
					} 
				}); 
		}, 100);
	} else if (slider.mode == "FilterQ"){
		var automationInterval = setInterval(function() { 
			slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
			slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
			slider.effect.set({ 
				"filterEnvelope":{
					"octave": slider.ghostValue
				}
				}); 
			// // console.log(slider.effect.get("filterEnvelope".octave))
		}, 100);
	}
		
	if(slider.mode == 'envelope'){ // if mode is 'envelope' (because envelopes are annoying and need to be right, so we've got to repeat ourselves a bit)

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
		
		if (slider.effectName == 'attackMod' && slider.sequencerNumber == 0){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "modulationEnvelope": {
		                "attack": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'decayMod' && slider.sequencerNumber == 0){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "modulationEnvelope": {
		                "decay": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'sustainMod' && slider.sequencerNumber == 0){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "modulationEnvelope": {
		                "sustain": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'releaseMod' && slider.sequencerNumber == 0){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "modulationEnvelope": {
		                "decay": slider.ghostValue
		            }
		        })) 
			}, 100);
		} 
		
		if (slider.effectName == 'attackMod' && slider.sequencerNumber == 1){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "filterEnvelope": {
		                "attack": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'decayMod' && slider.sequencerNumber == 1){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "filterEnvelope": {
		                "decay": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'sustainMod' && slider.sequencerNumber == 1){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "filterEnvelope": {
		                "sustain": slider.ghostValue
		            }
		        })) 
			}, 100);
		} else if (slider.effectName == 'releaseMod' && slider.sequencerNumber == 1){
			var automationInterval = setInterval(function() { 
				slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
				slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
				slider.effect.set(({
		            "filterEnvelope": {
		                "decay": slider.ghostValue
		            }
		        })) 
			}, 100);
		}
	
		
	} else if (slider.mode =='value') { // if the synth is set to 'value': changing effects or volume
		
	
	var automationInterval = setInterval(function() { 
		slider.ghostValue = slider.ghostValue + changeChunk; // adds a chunk OF VALUE every run through
		slider.ghostValueToPixel(slider.ghostValue); // changes the value to the correct pixel and as the canvas is looping it draws this automagically
		slider.effect.value = slider.ghostValue; // change the effect value
		// console.log('slider name: ', slider.effectName, slider.sequencerNumber, ', slider red value: ', slider.ghostValue, ', effect value: ',slider.effect.value);
	}, 100);
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

var oscArray = ["square","pulse","sawtooth","pwm"];
var filterArray = ["lowpass","highpass","bandpass","notch"];

var effectLoop = new Tone.Loop(function(time) {
	
	buttonViewChanger()
	
	for (var x = 0;x<effectArray.length;x++){ // loops through all effect sliders to see if any have been called
		if (effectArray[x].goTriggered == 1){ // 1 is for user pressing the button (takes the value from the current floating head!);
		
			effectAutomation(effectArray[x]); // if goTriggered is true, call the effectAutomation function for this object.
		} else if (effectArray[x].goTriggered == 2){
			effectAutomation(effectArray[x]); // if goTriggered is true, call the effectAutomation function for this object.
		}
	}

		// READY FOR ANOTHER CONDITIONAL MESS?! OH BOY, HERE WE GOOOooooOOOOO!
		if (sequencerOne.isTriggeredOne == 1 || sequencerOne.isTriggeredOne == 2){// sequencer one setting one
			synth.set(({
	            "oscillator": {
	                "type": oscArray[sequencerOne.triggeredValueOne]
	            }
	        }))
			sequencerOne.isTriggeredOne = 0;
		} else if (sequencerOne.isTriggeredTwo == 1 || sequencerOne.isTriggeredTwo == 2){// sequencer one setting two
			synth.set(({
	            "modulation": {
	                "type": oscArray[sequencerOne.triggeredValueOne]
	            }
	        }))
			sequencerOne.isTriggeredTwo = 0;
		} else if (sequencerTwo.isTriggeredOne == 1 || sequencerTwo.isTriggeredOne == 2){// sequencer two setting one
			synthTwo.set(({
	            "oscillator": {
	                "type": oscArray[sequencerTwo.triggeredValueOne]
	            }
	        }))
			sequencerTwo.isTriggeredOne = 0;
		} else if (sequencerTwo.isTriggeredTwo == 1 || sequencerTwo.isTriggeredTwo == 2){// sequencer two setting two
			synthTwo.set(({
	            "filter": {
	                "type": filterArray[sequencerTwo.triggeredValueTwo]
	            }
	        }))
			sequencerTwo.isTriggeredTwo = 0;
		} else if (sequencerThree.isTriggeredOne == 1 || sequencerTwo.isTriggeredOne == 2){// sequencer three setting 
			sequencerThree.noteOffset = sequencerThree.triggeredValueOne * 16;
			console.log(sequencerThree.noteOffset)
			sequencerThree.isTriggeredOne = 0;
			sequencerThree.isTriggeredTwo = 0;
			
		} else if (sequencerFour.isTriggeredOne == 1 || sequencerFour.isTriggeredOne == 2){// sequencer four setting one
			sequencerFour.noteOffset = sequencerFour.triggeredValueOne * 16;
			sequencerFour.isTriggeredOne = 0;
			sequencerThree.isTriggeredTwo = 0;
			
			
		}

}, "1m").start(0);


/* HELPFUL STUFF
	// radio button/settings stuff
		// One
	this.selectedValueOne = 0; // selected value from user
	this.isTriggeredOne = 0; // similar to isTriggered of sliders: is 1 when user, 2 when server.
	this.triggeredValueOne = 0; //value set at point where go is pressed or the server sends a value.
	this.settingsNameArrayOne = [];
		// Two
	this.selectedValueTwo = 0; // selected value from either server or user
	this.isTriggeredTwo = 0; // similar to isTriggered of sliders: is 1 when user, 2 when server.
	this.triggeredValueTwo = 0; //value set at point where go is pressed or the server sends a value.
	// this.settingsNameArrayTwo = [];
*/





document.getElementById('playButton').addEventListener("click", function(e) {
    startPressed = 1;
})

function start() {
    Tone.Transport.start("+0.1");
	drawGridLoop.start();
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
    // console.log('context online!');
})