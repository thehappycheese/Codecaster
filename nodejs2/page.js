// interface

var noox = document.getElementById("textArea");

function tchange(e){
	
	if(data===e.target.value){
		return;
	}
	console.log(e.target.value)
	sk.sendCommand("setData",e.target.value)
	data = e.target.value
}



// setup server.

url = "ws://127.0.0.1:9999/";

var sk = new WebSocket(url);

sk.sendCommand = function(cmd,dat){
	console.log(">Sent Command: "+cmd);
	return this.send(JSON.stringify({c:cmd,d:dat}));
}

sk.onopen = function(e){
	console.log(">Network Connected.");
	this.sendCommand("getData","");
}
sk.onmessage = function(e){
	try{
		var m = JSON.parse(e.data);
		console.log(">Rved command: "+m.c);
	}catch(e){
		console.log(">>Could not interpret message recieved:");
		console.log(e.data);
		return;
	}
	if(!m.c){
		console.log(">>Message contained no command.")
		console.log(e);
		return;
	}
	switch(m.c){
		case "setMaster":
			setMaster(m.d);
			break;
		case "setData":
			setData(m.d);
			break;
		case "updateData":
			updateData(m.d);
			break;
	}

}
sk.onerror = function(e){
	console.log("Network Error: "+e.code);
}
sk.onclose = function(e){
	console.log(">Connection Closed: "+e.code+" clean?: "+e.wasClean);
}




// STATE VARIABLES
var isMaster = false;
var data = "";

// STATE COMMAND

function setMaster(t){
	if(t){
		isMaster = true;
	}else{
		isMaster = false;
	}
}
function setData(dat){
	data = dat;
	noox.value = dat;
}
function updateData(dat){
	console.log(JSON.stringify(dat))
	var cur = noox.value.split("");
	var res = [];
	for(var i = 0; i<dat.length;i++){
		if(typeof dat[i]=="object"){
			for(var j = dat[i][0];j<=dat[i][1];j++){
				res.push(cur[j]);
			}
		}else if(typeof dat[i]=="string"){
			res.push(dat[i]);
		}else{
			res.push(cur[dat[i]]);
		}
	}
	setData(res.join(""));
}

