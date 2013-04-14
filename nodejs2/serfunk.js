var diff  = require("./diff.js");
var users = [];

var title = "";
var data = "";
var fileList = [];
var folder = "";

exports.addUser = function(request){
	var con = request.accept(null, request.origin);
	var newUser = new exports.User(con,+new Date())
	users.push(newUser);
	console.log("-- User Added. ID: "+newUser.id);
	console.log("-- Users: "+users.length);
}

exports.User = function(arg_con,arg_id){
	this.id = arg_id
	this.con = arg_con;
	this.data = "";
	this.isMaster = false;
	
	
	this.send = function (str){
		this.con.sendUTF(str);
	}
	
	
	this.makeMaster = function(){
		this.sendCommand("setMaster",true);
		this.isMaster = true;
		for(var i = 0; i<users.length;i++){
			if(users[i].id != this.id){
				users[i].sendCommand("setMaster",false);
				users[i].isMaster = false;
			}
		}
		this.isMaster = true;
	}
	
	this.sendCommand = function(cmd,dat){
		console.log(">Send User "+this.id+" command: "+cmd);
		return this.con.sendUTF(JSON.stringify({c:cmd,d:dat}));
	}
	this.con.on('message', (function(message){
		try{
			var m = JSON.parse(message.utf8Data);
			console.log(">Rved User "+this.id+" command: "+m.c);
		}catch(e){
			console.log("non JSON message:");
			console.log(message.utf8Data);
		}
		if(!m.c){
			console.log(">>Message contained no command.");
		}
		switch(m.c){
			case "setMaster":
				this.makeMaster();
				break;
			case "getData":
				this.data = data;
				this.sendCommand("setData",data);
				break;
			case "setData":
				data = m.d;
				this.data = m.d;
				for(var i = 0;i<users.length;i++){
					if(users[i].id!=this.id){
						users[i].sendCommand("updateData",diff.diff(users[i].data,data));
						users[i].data = data;
					}
				}
				break;
			default:
				console.log(">> Unrecognised command.");
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