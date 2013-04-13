


url = "ws://127.0.0.1:9999/";

var sk = new WebSocket(url);


sk.onopen = function(e){
	console.log("open. Message sent");
	sk.send(JSON.stringify({c:"works!",d:""}));
}
sk.onmessage = function(e){
	console.log("message: "+e.data);
}
sk.onerror = function(e){
	console.log("error");
}
sk.onclose = function(e){
	console.log("closed");
	console.log(e);
}
