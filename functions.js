// Admin's Bot is written by YouTubeAdmin [https://github.com/YouTubeAdmin], with a little help from open-source projects [check credit.txt].

window.getAllUrlParams = function getAllUrlParams(url) {

	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	var obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		var arr = queryString.split('&');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

			// (optional) keep case consistent

			paramName = paramName;
			if (typeof paramValue === 'string') paramValue = paramValue;

			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {

				// create key if it doesn't exist
				var key = paramName.replace(/\[(\d+)?\]/, '');
				if (!obj[key]) obj[key] = [];

				// if it's an indexed array e.g. colors[2]
				if (paramName.match(/\[\d+\]$/)) {
					// get the index value and add the entry at the appropriate position
					var index = /\[(\d+)\]/.exec(paramName)[1];
					obj[key][index] = paramValue;
				}
				else {
					// otherwise add the value to the end of the array
					obj[key].push(paramValue);
				}
			}
			else {
				// we're dealing with a string
				if (!obj[paramName]) {
					// if it doesn't exist, create property
					obj[paramName] = paramValue;
				}
				else if (obj[paramName] && typeof obj[paramName] === 'string') {
					// if property does exist and it's a string, convert it to an array
					obj[paramName] = [obj[paramName]];
					obj[paramName].push(paramValue);
				}
				else {
					// otherwise add the property
					obj[paramName].push(paramValue);
				}
			}
		}
	}

	return obj;
};
if (getAllUrlParams().banned) {
	window.onload = function() {};
	document.all[0].innerHTML = '<h1>You have been banned from using this bot. If you think this is incorrect, feel free to email support at The.O.C.L.P.Group@outlook.com</h1>';
	window.refresh = function() {};
	window.restart = function() {};
}

window.getAllSocketParams = function getAllSocketParams(data) {

	var queryString;
	// get query string from WebSocket
	if (data.startsWith("@")) {
		queryString = data.split('@')[1];
	}
	else if (data.startsWith(":")) {
		return { "Message": false, "original": data };
	}

	// we'll store the parameters here
	var obj = {};
	obj.Message = true;
	obj.original = data;
	obj["badge-list"] = [];
	// if query string exists
	if (queryString) {

		if (data.includes("PRIVMSG")) {
			obj.message = data.split(/PRIVMSG\s#[a-z0-9\-_]*\s:/i)[1].trim();
			var msg = obj.message;
			var $A;
			if (msg.indexOf(" ") === -1) {
				$A = msg.length;
			}
			else {
				$A = msg.indexOf(" ");
			}
			obj.caller = msg.substring(0, $A).toLowerCase();
			obj.value = msg.substring($A).trim();
		}
		else {
			// obj.message = "undefined ";
			return { "Message": false, "original": data };
		}

		//if (queryString.indexOf(/\s:[a-z0-9\-_]*\![a-z0-9\-_]*@[a-z0-9\-_]*\.tmi\.twitch.tv/i) === 0) {
		queryString = queryString.split(/\s:[a-z0-9\-_]*\![a-z0-9\-_]*@[a-z0-9\-_]*\.tmi\.twitch.tv/i)[0];
		//} else {

		//}

		// split our query string into its component parts
		var arr = queryString.split(';');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {

				// create key if it doesn't exist
				var key = paramName.replace(/\[(\d+)?\]/, '');
				if (!obj[key]) obj[key] = [];

				// if it's an indexed array e.g. colors[2]
				if (paramName.match(/\[\d+\]$/)) {
					// get the index value and add the entry at the appropriate position
					var index = /\[(\d+)\]/.exec(paramName)[1];
					obj[key][index] = paramValue;
				}
				else {
					// otherwise add the value to the end of the array
					obj[key].push(paramValue);
				}
			}
			else {
				// we're dealing with a string
				if (!obj[paramName]) {
					// if it doesn't exist, create property
					obj[paramName] = paramValue;
				}
				else if (obj[paramName] && typeof obj[paramName] === 'string') {
					// if property does exist and it's a string, convert it to an array
					obj[paramName] = [obj[paramName]];
					obj[paramName].push(paramValue);
				}
				else {
					// otherwise add the property
					obj[paramName].push(paramValue);
				}
			}
		}
		if (obj.badges) { // vip subscriber partner premium moderator
			if (obj.badges.includes("vip")) {
				obj["badge-list"].push("vip");
			}
			if (obj.badges.includes("subscriber")) {
				obj["badge-list"].push("subscriber");
			}
			if (obj.badges.includes("partner")) {
				obj["badge-list"].push("partner");
			}
			if (obj.badges.includes("premium")) {
				obj["badge-list"].push("premium");
			}
			if (obj.badges.includes("moderator")) {
				obj["badge-list"].push("moderator");
			}
		}
	}

	return obj;
};

window.shuffle = function(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

window.devSet = false;
window.isDev =(localStorage.getItem("Developer Mode") === "true" && getAllUrlParams().dev !== "false") ? true : false;

window.butt = function(message) {
	var imessage = message;
	console.log(imessage);
	for (var i = 0; i < words.length; i++) {
		if (imessage.includes(words[i])) {
			imessage = imessage.replace(RegExp(words[i], "gi"), "butt");
			return imessage;
		}
	}
	return false;
};

(function() {
	var http = new XMLHttpRequest();
	http.open("GET", "curse_words.json");
	http.onloadend = function(e) {
		window.badWords = JSON.parse(e.srcElement.response);
	};
	http.send();
})();

window.ban = function(user, reason = "") {
	window.message(`/ban ${user} ${reason}`);
};

window.unban = function(user) {
	window.message(`/unban ${user}`);
};

window.clear = function() {
	window.message(`/clear`)
}

window.say = function(text, me = false) {
	window.message(text, me);
}

window.DATE = new Date();
var chatLog = "CHAT LOG: \n" + DATE.toLocaleDateString() + " " + DATE.toLocaleTimeString() + "\n\n\tDATE\tTIME\t\tUSER ID\t\tUSERNAME\tMESSAGE";

window.saveLog = function(stream) {
	var d = new Date();
	var n = d.toLocaleTimeString().replace(/:/g, ".");
	var n1 = d.toLocaleDateString().replace(/\//g, "-");
	var textToSave = chatLog;
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
	hiddenElement.target = '_blank';
	hiddenElement.download = stream + ` Chatlog [${n1} ${n}].json`;
	hiddenElement.click();
	log("The log files has been saved to \"" + stream + ` Chatlog [${n1} ${n}].json` + "\"", "ATTENTION:", "info");
}

window.lurkBox = document.querySelector("#isTrue");

window.lurk = function() {
	window.lurking = !window.lurking;
	lurkBox.checked = lurking;
	if (window.lurking) {
		console.log("%cLurking enabled", "color: white");
	}
	else {
		console.log("%cLurking disabled", "color: white")
	}
};

lurkBox.onchange = function (e) {
	e.preventDefault();
	lurking = lurkBox.checked;
	if (window.lurking) {
		console.log("%cLurking enabled", "color: white");
		log("Lurk mode ENABLED", "ATTENTION:", "info");
	}
	else {
		console.log("%cLurking disabled", "color: white");
		log("Lurk mode DISABLED", "ATTENTION:", "info");
	}
}


// ---------------------------------    Variables    ---------------------------------

	window.eightBall = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];





var BadFolk = []; // PLANNING TO MAKE AN ANTI SPAM FEATURE ADDING SPAMMERS TO THIS LIST...
