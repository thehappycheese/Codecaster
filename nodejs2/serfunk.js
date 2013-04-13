var diff  = require("./diff.js");
var users = [];
var data = {title:"",body:""};




exports.onopen = function(request){
	var con = request.accept(null, request.origin);
	var newUser = new exports.User(con,+new Date())
	users.push(newUser);
	console.log("-- User Added. ID: "+newUser.id);
	console.log("-- Users: "+users.length);
}

exports.User = function(connection,iidd){
	this.id = iidd
	this.con = connection;
	this.data = {title:"",body:""};
	this.ismaster = false;
	
	
	this.send = function (str){
		this.con.sendUTF(str);
	}
	
	
	this.makeMaster = function(){
		for(var i = 0; i<users.length;i++){
			if(users[i].id != this.id){
				users[i].send("youareslave");
				users[i].ismaster = false;
			}
		}
		this.ismaster = true;
		
	}
	
	this.sendCommand = function(cmd,dat){
		return JSON.stringify({c:cmd,d:dat});
	}
	this.con.on('message', (function(message){
		try{
			var m = JSON.parse(message.utf8Data);
			switch(m.c){
				case "setMaster":
					this.makeMaster();
					this.sendCommand("setMaster",null);
					console.log()
					break;
				case "getData":
					this.data = data;
					this.sendCommand("setData",data);
					break;
				case "setData":
					data = m.d;
					for(var i = 0;i<users.length;i++){
						users[i].sendCommand("updateData","noop");
					}
					break;
			}
		}catch(e){
			console.log("non JSON message:");
			console.log(message.utf8Data);
		}
	}).bind(this));
	
	
	this.con.on('close', (function(connection){
		for(var i = 0; i<users.length;i++){
			if(users[i].id == this.id){
				users.splice(i,1);
				break;
			}
		}
		console.log("-- User Left. ID: "+this.id);
		console.log("-- Users: "+users.length);
	}).bind(this));
	
}

/*
connection.remoteAddress
connection.sendUTF(
*/