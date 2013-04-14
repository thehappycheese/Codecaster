var diff	= require("./diff.js");
var fs 		= require("fs");


// STATE MACHINE -------------------------

var users = [];

var title = "";
var data = [];
var fileList = [];
var folder = "workDir";

exports.init = function(){
	fileList = fs.readdirSync(folder);
	for(var i=0;i<fileList.length;i++){
		data.push(fs.readFileSync(folder+"/"+fileList[i],{encoding:"utf8"}));
	}
}
exports.init();
//

exports.addUser = function(request){
	var con = request.accept(null, request.origin);
	var newUser = new exports.User(con,+new Date())
	users.push(newUser);
	console.log("-- User Added. ID: "+newUser.id);
	console.log("-- Users: "+users.length);
}

exports.User = function(arg_con,arg_id){
	// INITIALISE ---------------------------------
	this.id = arg_id
	this.con = arg_con;
	this.data = "";
	this.isMaster = false;
	this.fileIndex = 0;
	
	// DESTROY ------------------------------------
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
	// TX ----------------------------------
	this.send = function (str){
		this.con.sendUTF(str);
	}
	this.sendCommand = function(cmd,dat){
		console.log(">Send User "+this.id+" command: "+cmd);
		return this.con.sendUTF(JSON.stringify({c:cmd,d:dat}));
	}
	// RX -----------------------------------
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
			case "getFiles":
				this.sendCommand("setFiles",fileList);
				break;
			case "setFileIndex":
				this.fileIndex = m.d;
				break;
			case "saveFile":
				fs.writeFileSync(folder+"/"+fileList[this.fileIndex],this.data)
				break;
			case "getData":
				this.data = data[this.fileIndex];
				this.sendCommand("setData",data);
				break;
			case "setData":
				data[this.fileIndex] = m.d;
				this.data = m.d;
				for(var i = 0;i<users.length;i++){
					if(users[i].id!=this.id){
						users[i].updateData();
					}
				}
				break;
			default:
				console.log(">> Unrecognised command.");
		}
		
	}).bind(this));
	
	// HELPERS -----------------------------
	this.updateData = (function(){
			this.sendCommand("updateData",diff.diff(this.data,data[this.fileIndex]));
			this.data = data[this.fileIndex];
	}).bind(this);
	
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
	
	
	
	
	
	
}

/*
connection.remoteAddress
connection.sendUTF(
*/