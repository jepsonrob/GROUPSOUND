
//	Client side!

var socket = io("http://localhost:3000");

socket.on("disconnect", function() {
	setTitle("Disconnected");
});

socket.on("connect", function() {
	setTitle("Connected");
	// loadSequence();
});

// When recieving a message, print it on the screen with the function printMessage
socket.on("message", function(message) {
	printMessage(message);
});

// Sends the information in the textbox to the server as event 'chat'
document.forms[0].onsubmit = function () {
    var input = document.getElementById("message");
    printMessage(input.value);
    socket.emit("chat", input.value);
    input.value = '';
};

function setTitle(title) {
    document.querySelector("h1").innerHTML = title;
}


function printMessage(message) {
    var p = document.createElement("p");
    p.innerText = message;
    document.querySelector("div.messages").appendChild(p);
}

function loadSequence(){
	// Load the sequencer information for first go
}

function startLoop(){
	// starting the loop at the correct time, sync'ing it with the others. This will be a challenge!
}