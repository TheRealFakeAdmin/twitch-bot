window.onload = function() {
	var oauth = "YOUR_TOKEN";
	var user = "YOUR_USERNAME"; // make sure this is all lowercase
	if (window.reqName === undefined) {
		window.reqName = window.prompt("Chat Name:");
		window.reqName = window.reqName.toLowerCase();
	};
	// Get references to elements on the page.
	var form = document.getElementById('message-form');
	var messageField = document.getElementById('message');
	var messagesList = document.getElementById('messages');
	var socketStatus = document.getElementById('status');
	var closeBtn = document.getElementById('close');


	// Create a new WebSocket.
	window.socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');


	// Handle any errors that occur.
	socket.onerror = function(error) {
		console.log('WebSocket Error: ' + error);
	};


	// Show a connected message when the WebSocket is opened.
	socket.onopen = function(event) {
		socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.URL;
		socketStatus.className = 'open';
		socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
		socket.send(`PASS oauth:${oauth}`);
		socket.send(`NICK ${user}`);
		socket.send(`USER ${ user } 8 * :${ user }`);
		socket.send(`JOIN #${window.reqName}`);
	};

	window.message = function message(message) {
		// Send the message through the WebSocket.
		socket.send(`PRIVMSG #${ reqName } :` + message);

		// Add the message to the messages list.
		messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + "Message: " + message +
			'</li>';

		// Clear out the message field.
		messageField.value = '';

		return false;
	};

	// Handle messages sent by the server.
	socket.onmessage = function(event) {
		var msg = event.data;
		messagesList.innerHTML += '<li class="received"><span>Received:</span>' +
			msg + '</li>';
		if (event.data == "PING :tmi.twitch.tv") {
			socket.send("PONG");
			messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + "PONG" +
				'</li>';
			console.log("PONG");
		};
		var VvV = msg.split(`PRIVMSG #${ window.reqName } :`);
		switch (VvV[(VvV.length - 1)].toLowerCase().replace(decodeURIComponent("%0D%0A"), "")) {
			case "!test":
				message("Test Complete! " + Math.floor(Math.random() * (1000 - 1 + 1) + 1)); // Needs random number to be able to not get caught by duplication... (I know this is a stupid fix)
				break;
		}
	};


	// Show a disconnected message when the WebSocket is closed.
	socket.onclose = function(event) {
		socketStatus.innerHTML = 'Disconnected from WebSocket.';
		socketStatus.className = 'closed';
		window.onload();
	};


	// Send a message when the form is submitted.
	form.onsubmit = function(e) {
		e.preventDefault();

		// Retrieve the message from the textarea.
		var message = messageField.value;

		// Send the message through the WebSocket.
		socket.send(message);

		// Add the message to the messages list.
		messagesList.innerHTML += '<li class="sent"><span>Sent:</span>' + message +
			'</li>';

		// Clear out the message field.
		messageField.value = '';

		return false;
	};


	// Close the WebSocket connection when the close button is clicked.
	closeBtn.onclick = function(e) {
		e.preventDefault();

		// Close the WebSocket.
		socket.close();

		return false;
	};
};