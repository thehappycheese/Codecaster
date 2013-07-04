"use strict";

// Define server --------------------------------------------------
function WSClient(a_address, a_port) {

	EventDispatcher.call(this);
	
	this.admin = false;
	this.socket = null;
	this.address = a_address;
	this.port = a_port || "80";
	this.conattempt = null;
	
	this.onmessage = function onWsMessage(e) {
		var evt = {};
		try {
			evt = JSON.parse(e.data);
		} catch (err) {
			console.log("WSClient JSON ERROR");
		}
		if (evt.f !== undefined && evt.d !== undefined) {
			this.dispatch(evt.f, evt.d);
		}else{
			console.log("WSClient MALFORMED PACKET");
		}
	};
	
	this.trytoconnect = (function () {
		if (this.socket === null || this.socket.readyState === this.socket.CLOSED) {

			this.socket = new WebSocket("ws://" + this.address + ":" + this.port);

			

			this.socket.onopen = function (e) {
				clearInterval(this.conattempt);
				this.conattempt = null;
				this.socket.onmessage = this.onmessage;
				this.dispatch("connected","");
				this.send("refreshMe", "");
			};

			this.socket.onclose = function (e) {
				//console.log("conneciton failed...");
				this.dispatch("disconnected","");
				this.socket = null;
				if (this.conattempt === null) {
					this.conattempt = setInterval(this.trytoconnect, 5000);
				}
			};
		}
	}).bind(this);
	
	// TODO: make this the job of the user of the class to do.... just provide a send text function :)
	this.send = (function (funcname, data) {
			this.socket.send(JSON.stringify({
					f : funcname,
					d : data
				}));
	}).bind(this);
	
	this.trytoconnect();
}
