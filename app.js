window.onload = function() {
	var oauth = "YOUR_TOKEN";
	var user = "YOUR_USERNAME"; // make sure this is all lowercase
	var preName = getAllUrlParams().name;
	var preCmds = getAllUrlParams().cmds;
	if (preName !== undefined) {
		window.reqName = decodeURIComponent(preName);
	}
	
	var xml = new XMLHttpRequest();
	xml.open("GET", "preferences.json");
	xml.send();
	xml.onreadystatechange = function (e) {
		console.log(e);
	};
	
	if (preCmds !== undefined) {
		window.cmds = decodeURIComponent(preCmds);
	}
	if (window.reqName === undefined) {
		window.reqName = window.prompt("Chat Name:");
		window.reqName = window.reqName.toLowerCase();
	}
	// Get references to elements on the page.
	var form = document.getElementById('message-form');
	var messageField = document.getElementById('message');
	var messagesList = document.getElementById('messages');
	var socketStatus = document.getElementById('status');
	var closeBtn = document.getElementById('close');


	// Create a new WebSocket.
	window.socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
	window.cmds = [{ "name": "-example", "return": "This is an example." }];

	// Handle any errors that occur.
	socket.onerror = function(error) {
		console.log('WebSocket Error: ' + error);
	};

	window.log = function log(message, pre, id) {
		for (var i = 0; i; i++) {
			if (message.includes("\n") || message.includes(decodeURI("%0A"))) {
				message = message.replace(/\r|\n/g, "\\n");
			}
			else {
				break;
			}
		}
		if (messages.scrollHeight - messages.clientHeight <= messages.scrollTop + 1) {
			messagesList.innerHTML += `<li class="${id}"><span>${pre}</span>` + message + '</li>';
			messages.scrollTop = messages.scrollHeight;
		}
		else {
			messagesList.innerHTML += `<li class="${id}"><span>${pre}</span>` + message + '</li>';
		}
	};

	window.newKey = function() {
		var tempKey = String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)).split("");
		tempKey = shuffle(tempKey);
		window.Session_Key = Number(tempKey.join(""));
		log(Session_Key, "Session Key:", "sent");
		document.querySelector("#key").textContent = "Session Key: " + Session_Key;
		console.log(Session_Key);
	};

	window.checkKey = function(test) {
		if (Number(test) === Session_Key) {
			return true;
		}
		else {
			return false;
		}
	};

	window.sendError = function(message, color = "red") {
		message(`/color ${color}`);
		message(message, true);
		message("/color blue");
	};

	// Show a connected message when the WebSocket is opened.
	socket.onopen = function(event) {
		window.startTime = new Date().getTime();
		socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.URL;
		socketStatus.className = 'open';
		socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
		socket.send(`PASS oauth:${oauth}`);
		socket.send(`NICK ${user}`);
		socket.send(`USER ${ user } 8 * :${ user }`);
		socket.send(`JOIN #${window.reqName}`);
		newKey();
	};

	window.message = function message(message, action) {
		if (action === true) {
			message = decodeURIComponent(`%01ACTION ${message}%01`);
		}
		// Send the message through the WebSocket.
		socket.send(`PRIVMSG #${ reqName } :` + message);

		// Add the message to the messages list.
		// console.log(messages.scrollHeight - messages.clientHeight <= messages.scrollTop + 1);
		log(("Message: " + message), "Sent:", "sent");

		// Clear out the message field.
		messageField.value = '';
	};

	// Handle messages sent by the server.
	socket.onmessage = function(event) {
		var msg = event.data;
		log(msg, "Received:", "received");
		if (String(msg).includes("PING")) {
			log("PONG", "Sent:", "sent");
			console.log("PONG");
		}
		var VvV = msg.split(`PRIVMSG #${ window.reqName } :`);
		VvV = VvV[(VvV.length - 1)].trimStart(); // Here VvV is left with only the sent chat string
		var Vi;
		if (VvV.indexOf(" ") === -1) {
			Vi = VvV.length;
		}
		else {
			Vi = VvV.indexOf(" ");
		}
		var calr = VvV.replace(decodeURIComponent("%0D%0A"), "").substring(0, Vi).toLowerCase();
		var val = VvV.replace(decodeURIComponent("%0D%0A"), "").substring(Vi).trim();
		switch (calr) {
			case "-ping":
				message("Pong!", true);
				break;
				/*
				case "-test":
					message("Test Complete! " + Math.floor(Math.random() * (1000 - 1 + 1) + 1)); // Needs random number to be able to not get caught by duplication... (I know this is a stupid fix)
					break;
				*/
			case "-about":
				message("Admin's Bot Project [V0.0.1] This is a Git-Hub Project created by YouTubeAdmin. This is a work in progress. :) " + Math.floor(Math.random() * (1000 - 1 + 1) + 1), true);
				break;
			case "-link":
				message("https://github.com/YouTubeAdmin/twitch-bot", true);
				break;
			case "-time":
				var d = new Date();
				var n = d.toLocaleTimeString() + " in " + Intl.DateTimeFormat().resolvedOptions().timeZone;
				message("The current time is " + n, true);
				break;
			case "-8ball":
				window.eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
				message(eightBall[(Math.floor(Math.random() * (19 - 0 + 1) + 0))], true);
				break;
			case "-roll":
				message(Math.floor(Math.random() * (10 - 1 + 1) + 1), true);
				break;
				// Command Commands
			case "-cmd":
				switch (String(val)) {
					case "list":
						message("Command List: '-ping', '-about', '-link', '-time', '-8ball', '-roll', '-cmd [COMMAND]'", true);
						break;
					case "ping":
						message("The command '-ping' is used to test the connection of the bot.");
						break;
					case "about":
						message("The command '-about' explains what this project is.", true);
						break;
					case "link":
						message("The command '-link' responds with the Git-Hub repo link.", true);
						break;
					case "time":
						message("The command '-time' responds with the local time of the bot.", true);
						break;
					case "8ball":
						message("The command '-8ball' is an 8ball... What did you expect?", true);
						break;
					case "roll":
						message("The command '-roll' returns with a random number between 1 & 10.", true);
						break;
					case "cmd":
						message("The command '-cmd [COMMAND]' explains what said command is meant to do.", true);
						break;
					case "say":
						message("The command '-say [Session-Key] [Message]' announces the given message.");
						break;
				}
				break;
			case "-say":
				if (!val.startsWith(Session_Key)) {
					break;
				}
				else {
					val = val.replace(String(Session_Key), "").trim();
				}
				message(val);
				newKey();
				break;
			case "-add":
				if (checkKey(val.substring(0, val.indexOf(" ")))) {
					val = val.trim();
					val = val.substring(val.indexOf(" "));
					val = val.trim();
				}
				else {
					sendError("You do not have access to this command.")
					break;
				}
				var cmd = val.substring(0, val.indexOf(" "));
				var say = val.substring(val.indexOf(" "));
				cmds.push({ "name": cmd, "return": say });
				message(`The command ${cmd} has been successfully added!`);
				break;
			case "-uptime":
				var seconds = new Date().getTime() - startTime;
				var date = new Date(seconds * 100);
				var hh = date.getUTCHours();
				var mm = date.getUTCMinutes();
				var ss = date.getSeconds();
				// If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
				// if (hh > 12) {hh = hh % 12;}
				// These lines ensure you have two-digits
				// if (hh < 10) { hh = "0" + hh; }
				// if (mm < 10) { mm = "0" + mm; }
				// if (ss < 10) { ss = "0" + ss; }
				var t = hh + " hours, " + mm + " minutes, and " + ss + " seconds.";
				message("Bot uptime is " + t);
				// SECRET COMMANDS:
			case "-shutdown":
				if (!checkKey(val)) {
					sendError("You do not have access to this command.");
					break;
				}
				newKey();
				sendError("Shutting down...");
				window.onload = function() {};
				socket.close();
				log("The session has ended successfully!", "ATTENTION:", "received");
				console.log("%cThe session has ended.", 'color: rgb(255, 0, 0)');
				break;
			case "-clear":
				if (checkKey(val)) {
					sendError("You do not have access to this command.");
					break;
				}
				message("/clear");
				newKey();
				break;
				// DEFAULT (for "hot loaded" commands)
			default:
				for (var i = 0; i < cmds.length; i++) {
					if (cmds[i].name == String(calr)) {
						message(cmds[i].return);
					}
				}
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
		if (message.toLowerCase().includes("key")) {
			newKey();
		};

		socket.send(message);

		// Add the message to the messages list.
		log(message, "Sent", "sent");

		// Clear out the message field.
		messageField.value = '';
	};


	// Close the WebSocket connection when the close button is clicked.
	closeBtn.onclick = function(e) {
		e.preventDefault();
		window.onload = function() {};
		socket.close();
		log("The session has ended successfully!", "ATTENTION:", "received");
		console.log("%cThe session has ended.", 'color: rgb(255, 0, 0)');
	};
	window.refresh = function refresh() {
		window.location.href = location.origin + location.pathname + `?name=${encodeURIComponent(reqName)}&cmds=${encodeURIComponent(cmds)}`;
	};
	window.restart = function restart() {
		window.location.href = location.origin + location.pathname;
	};
	document.querySelector("#refresh").onclick = function(e) {
		e.preventDefault();
		refresh();
	}
	document.querySelector("#restart").onclick = function(e) {
		e.preventDefault();
		restart();
	}
};
