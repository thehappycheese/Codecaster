

// Define server --------------------------------------------------
var server = {};
server.socket = null;
server.address = ""
server.conattempt = null;
// Maintain connection to the server --------------------------------------------------
server.trytoconnect = function(){
	server.address = (/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/).exec(document.URL)[0];
	console.log("retrying connection on "+server.address);
	if(server.socket==null || server.socket.readyState==server.socket.CLOSED){
		
		server.socket = new WebSocket("ws://"+server.address+":80");
		
		server.onmessage = function onWsMessage(e){
			try{
				var evt = JSON.parse(e.data);
				
			}catch(err){
				console.log("Server text: "+e.data);
				return;
			}
			events[evt.f](evt.d);
		};
		
		server.socket.onopen = function (e){
			console.log("conneciton opened");
			status("connected");
			clearInterval(server.conattempt);
			server.conattempt = null;
			server.socket.onmessage = server.onmessage;
			server.sendEvent("refreshMe","");
		};
		
		server.socket.onclose = function(e){
			console.log("conneciton failed...");
			status("disconnected");
			server.socket = null;
			if(server.conattempt == null){
				server.conattempt = setInterval(server.trytoconnect,5000);
			}
		};
	}
}
server.sendEvent = (function (funcname,data){
	this.socket.send(JSON.stringify({f:funcname,d:data}));
}).bind(server);
server.trytoconnect();

