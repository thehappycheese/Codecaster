var soc = new WebSocket("ws://127.0.0.1:1337");

soc.onerror = function(e){
	console.log(e);
}
soc.onmessage = function(e){
	console.log(e.data);
}

