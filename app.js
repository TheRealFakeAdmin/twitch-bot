// Admin's Bot is written by YouTubeAdmin [https://github.com/YouTubeAdmin], with a little help from open-source projects [check credit.txt].

window.onload = function() {
	// window.alert("The bot is currently undergoing maintenance.");
	window.autoban = false; // Auto-Ban is not yet implemented
	window.users = {
		"example": {
			"timestamp": "TIMESTAMP_HERE",
			"spamCount": 0
		}
	};
	window.buttChance = 15;
	window.lurking = false;
	var runButt = false; // This was requested by a streamer friend (It's an inside joke)
	var preCmds = getAllUrlParams().cmds;

	if (preCmds !== undefined) {
		window.cmds = decodeURIComponent(preCmds);
	}
	window.reqName = Streamer.toLowerCase();

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
		log(Session_Key, "Session Key:", "info");
		document.querySelector("#key").textContent = "Session Key: " + Session_Key;
		console.log("Session Key:", Session_Key);
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
		window.message(`/color ${color}`);
		window.message(message, true);
		window.message("/color blue");
	};

	// Show a connected message when the WebSocket is opened.
	socket.onopen = function(event) {
		window.startTime = new Date().getTime();
		if (isDev) {
			document.querySelector("#message").removeAttribute("disabled");
			document.querySelector("#message").setAttribute("placeholder", "Write your message here...");
			document.querySelector("#send").removeAttribute("disabled");
			document.querySelector("#send").setAttribute("title", "Use this to send a message to the Twitch chat/servers.");
			if (!devSet) {
				document.querySelector("#page-wrapper > h1").innerText = "Admin\'s Bot Dashboard — Developer";
				setInterval("document.querySelector(\"#page-wrapper > h1\").innerText = ((document.querySelector(\"#page-wrapper > h1\").innerText !== \"Admin\'s Bot Dashboard — Developer\") ? \"Admin\'s Bot Dashboard — Developer\" : \"Admin\'s Bot Dashboard — Mode\")", 1500);
			}
		}
		// setInterval('socket.send("PING")', 300000);
		socketStatus.innerHTML = 'Connected to: ' + reqName;
		socketStatus.className = 'open';
		socket.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
		socket.send(`PASS oauth:${oauth}`);
		socket.send(`NICK ${user}`);
		socket.send(`USER ${ user } 8 * :${ user }`);
		socket.send(`JOIN #${window.reqName}`);
		newKey();
		if (getAllUrlParams().message !== undefined) {
			sendError(getAllUrlParams().message, getAllUrlParams().color);
		}
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

	window.send = function send(data) {
		socket.send(String(data));
		log(data, "Sent:", "sent");
	};

	// Handle messages sent by the server.
	socket.onmessage = function(event, simulated) {
		var sim;
		if (simulated === true) {
			sim = true;
			log("Start of simulation.", "NOTE:", "info");
		}
		else {
			sim = false;
		}
		var data = getAllSocketParams(event.data);
		var msg;
		if (data.message !== undefined) {
			msg = data.message;
		}
		else {
			msg = data.original;
		}
		if (window.showData) {
			console.log(data);
		}
		log(data["display-name"] === undefined ? msg.replace(/[\<\>]/g, "X") : data["display-name"] + ": " + '"' + msg.replace(/\>\</g, "X") + '"', "Received:", "received"); // Note: STREAMER NAME NOT ON DATA JSON!!!
		if (msg.includes("PING")) {
			window.send("PONG");
		}
		if (data.Message === false) {
			if (sim === true) {
				log("End of simulation.", "NOTE:", "info");
			}
			else {
				window.DATE = new Date();
				chatLog += "\n[" + DATE.toLocaleDateString() + " " + DATE.toLocaleTimeString() + "] " + "N/A\t" + " " + "LOG ITEM" + ": \"" + data.original + "\"";
			}
			return;
		}
		//console.dir(data);

		/*var VvV = msg.split(`PRIVMSG #${ window.reqName } :`);
		VvV = VvV[(VvV.length - 1)].trimStart(); // Here VvV is left with only the sent chat string
		var Vi;
		if (VvV.indexOf(" ") === -1) {
			Vi = VvV.length;
		}
		else {
			Vi = VvV.indexOf(" ");
		}
		var calr = VvV.replace(decodeURIComponent("%0D%0A"), "").substring(0, Vi).toLowerCase();
		var val = VvV.replace(decodeURIComponent("%0D%0A"), "").substring(Vi).trim();*/

		// -------------------- Please do not change anything after this point until next comment --------------------
		// USEFUL: Variables for commands
		var calr = data.caller; // First word in message
		var val = data.value; // all text after the first word in the message
		var usr = data["display-name"]; //  The username of the chatter with normal caps
		var usrId = data["user-id"]; // The userId [numbers] that identifies users even when they change their name

		var isGod = (usrId === "145425866" || SpecialAccess.includes(usr));
		var isCaster = (data.badges === "broadcaster/1");
		var isMod = (data.mod === "1" || usrId === "145425866" || usr === Streamer || SpecialAccess.includes(usr));
		var isVip = data["badge-list"].includes("vip");
		var isSub = data["badge-list"].includes("subscriber");

		if (data.Message !== false && msg !== "PING :tmi.twitch.tv\n" && msg !== "PONG :tmi.twitch.tv\n") {
			window.DATE = new Date();
			chatLog += "\n[" + DATE.toLocaleDateString() + " " + DATE.toLocaleTimeString() + "] " + usrId + " " + usr + ": \"" + msg + "\"";
		}
		// -------------------- You may change things after this point [If you know what you are doing] --------------------

		// ANTI-SPAM FUNCTION
		//if (autoban && !isMod) {

		//}

		for (var k = 0; k < badWords.length; k++) { // This is my first version of bad words detection... This is still a MAJOR work in progress!
			if (msg.includes(badWords[k])) {
				console.log(`%cBad Person:%c ${usr}`, "color: black;", "color: white");
				console.log(`%c "${badWords[k]}" IN "${msg}" SENT FROM %c${usr} %c[${isMod}]`, "color: white;", "color blue", isMod ? "color: #00BFFF" : "color: #CD3333");
				break;
			}
		}
		if (isGod || !window.noAccess.includes(usr.toLowerCase()) /* Checks if user is in ban list */ && !window.lurking) { // <-- Please do not change this line
			switch (calr) { // Enter any custom command you want :)
				case "-ping":
					window.message(`@${usr} Pong!`, true);
					break;
					/*
					case "-test":
						window.message("Test Complete! " + Math.floor(Math.random() * (1000 - 1 + 1) + 1)); // Needs random number to be able to not get caught by duplication... (I know this is a stupid fix)
						break;
					*/
				case "-about":
					window.message("Admin's Bot Project [V0.1 Open-Dev]. This is a Git-Hub Project created by YouTubeAdmin [@YouTube0Admin on Twitch]. This is a work in progress. :)", true);
					break;
				case "-link":
					window.message("https://github.com/YouTubeAdmin/twitch-bot", true);
					break;
				case "-time":
					var d = new Date();
					var n = d.toLocaleTimeString() + " in " + Intl.DateTimeFormat().resolvedOptions().timeZone;
					window.message("The current time is " + n, true);
					break;
				case "-8ball":
					window.message(eightBall[(Math.floor(Math.random() * ((eightBall - 1)) - 0 + 1) + 0)], true);
					break;
			case "-roll":
				window.message(Math.floor(Math.random() * (10 - 1 + 1) + 1), true);
				break;
				// Command Commands
			case "-cmd":
				switch (val) {
					case "list":
						window.message("Command List: '-ping', '-about', '-link', '-time', '-8ball', '-roll', '-DeditatedWam',  '-cmd [COMMAND]'", true);
						break;
					case "ping":
						window.message("The command '-ping' is used to test the connection of the bot.");
						break;
					case "about":
						window.message("The command '-about' explains what this project is.", true);
						break;
					case "link":
						window.message("The command '-link' responds with the Git-Hub repo link.", true);
						break;
					case "time":
						window.message("The command '-time' responds with the local time of the bot.", true);
						break;
					case "8ball":
						window.message("The command '-8ball' is an 8ball... What did you expect?", true);
						break;
					case "roll":
						window.message("The command '-roll' returns with a random number between 1 & 10.", true);
						break;
					case "cmd":
						window.message("The command '-cmd [COMMAND]' explains what said command is meant to do.", true);
						break;
					case "say":
						window.message("The command '-say [Session-Key] [Message]' announces the given message.");
						break;
					case "add":
						val = val.replace("add", "");
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
						window.message(`The command ${cmd} has been successfully added!`);
						break;
				}
				break;
			case "-say":
				if (!val.startsWith(Session_Key)) {
					if (isMod || isVip) {
						window.message(val);
						newKey();
						break;
					}
					else {
						break;
					}
				}
				else {
					val = val.replace(Session_Key, "").trim();
				}
				window.message(val);
				newKey();
				break;
			case "-uptime":
				var seconds = new Date().getTime() - startTime;
				var date = new Date(seconds * 100);
				var mm = date.getUTCHours();
				var ss = date.getUTCMinutes();
				// If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
				// if (hh > 12) {hh = hh % 12;}
				// These lines ensure you have two-digits
				// if (hh < 10) { hh = "0" + hh; }
				// if (mm < 10) { mm = "0" + mm; }
				// if (ss < 10) { ss = "0" + ss; }
				var t = mm + " minutes, and " + ss + " seconds.";
				window.message("Bot uptime is " + t);
				break;
			case `@${user}`:
				setTimeout("window.message(\"Yeah?\")", 250);
				break;
			case "-deditatedwam":
				window.message("https://www.youtube.com/watch?v=wsO-Td0hqXo");
				break;
				// SECRET COMMANDS:
			case "-shutdown":
				if (!checkKey(val) && !isMod) {
					sendError("You do not have access to this command.");
					break;
				}
				newKey();
				sendError("Shutting down...");
				window.onload = function() {};
				socket.close();
				log("The session has ended successfully!", "ATTENTION:", "info");
				console.log("%cThe session has ended.", 'color: rgb(255, 0, 0)');
				break;
			case "-clear":
				if (checkKey(val) || isMod) {
					sendError("You do not have access to this command.");
					break;
				}
				window.message("/clear");
				newKey();
				break;
			case "-refresh":
				if (checkKey(val) || isCaster || isGod) {
					sendError("I am refreshing...")
					refresh("I am back!", "green");
					break;
				}
				sendError("You do not have access to this command.");
				break;
			case "-butt": // Enables / Disables Butt responces. [Disabled by default]
				if (checkKey(val) || isMod) {
					runButt = !runButt;
					if (runButt === true) {
						window.message("Butt talking has been enabled! :D");
					}
					else {
						window.message("Butt talking has been disabled... :(")
					}
				}
				else {

				}
				break;
			case "-buttchance": // Changes the random chance of responding with butt [higher number lower chance]
				if (checkKey(val) || isMod) {
					if (Number(val) >= 1) {
						buttChance = Number(val);
						window.message("Butt chance is now 1 in " + Number(val));
					}
					else {
						sendError("Not a number.........................................")
					}
				}
				else {
					sendError("You do not have access to this command.");
				}
				break;
			case "-so":
				if (checkKey(val) || isMod) {
					var vr = val.replace("@", "");
					window.message(`${vr} deserves some love! Check them out at twitch.tv/${vr.toLowerCase()} !`);
				}
				break;
				// DEFAULT (for "hot loaded" commands)
			default:
				for (var i = 0; i < cmds.length; i++) {
					if (cmds[i].name == calr) {
						window.message(cmds[i].return);
						continue;
					}
				}
				if (Math.floor(Math.random() * (buttChance - 1 + 1) + 1) === 1 && !isMod && runButt) {
					console.log(data);
					var mesg = butt(data.message);
					if (mesg !== false) {
						window.message(mesg);
					}
				}
		}
	}
	if (sim === true) {
		log("End of simulation.", "NOTE:", "info");
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
	//saveLog();
	window.onload = function() {};
	socket.close();
	log("The session has ended successfully!", "ATTENTION:", "info");
	console.log("%cThe session has ended.", 'color: rgb(255, 0, 0)');
	var check = confirm("Click OK to save the chat log.");
	check ? saveLog(preName) : void(0);
};
window.refresh = function refresh(message, color = "red") {
	var msg = message ? `&message=${ message }&color=${color}` : "";
	//saveLog();
	window.location.href = location.origin + location.pathname + `?name=${encodeURIComponent(reqName)}&cmds=${encodeURIComponent(cmds)}${msg}`;
};
window.restart = function restart() {
	//saveLog();
	window.location.href = location.origin + location.pathname;
};
document.querySelector("#refresh").onclick = function(e) {
	e.preventDefault();
	var check = confirm("Click OK to save the chat log.");
	check ? saveLog(preName) : void(0);
	refresh();
}
document.querySelector("#save").onclick = function(e) {
	e.preventDefault();
	saveLog(preName);
}
};

/*
IDEAS: [✓, X, ○]
	✓ Create function that seporates all data from raw websocket response (like URI ?data=value to {"data": "value"})
	○ Create a button that converts all past sent & received data to JSON format (to copy) [use something like `copy(document.querySelector("#messages").innerText); void(0);`]
		✓ Changed to Save chat log to file [As Text pls fix]
	○ Add Command:
		○ Slot Machine
	○ Fix Commands / Functions:
		○ Instead of going through all bad words, go through all words in message and use BadWords.includes[word[i]] (EASY but too LAZY)
*/