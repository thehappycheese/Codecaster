var diff	= require("./diff.js");
var fs 		= require("fs");


// STATE MACHINE -------------------------

var users = [];

var title = "";
var data = [];
var fileList = [];
var cursor = [];
var folder = "../workDir";

exports.init = function(){
	fileList = fs.readdirSync(folder);
	for(var i=0;i<fileList.length;i++){
		data.push(fs.readFileSync(folder+"/"+fileList[i],{encoding:"utf8"}));
	}
	console.log(data);
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
	this.fileIndex = 0;
	this.data = data[this.fileIndex];
	this.isMaster = false;
	
	
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
				this.sendCommand("setMaster",true);
				this.isMaster = true;
				for(var i = 0; i<users.length;i++){
					if(users[i].id != this.id){
						users[i].sendCommand("setMaster",false);
						users[i].isMaster = false;
					}
				}
				this.isMaster = true;
				break;
			case "setFileIndex":
				this.fileIndex = m.d;
				this.data = data[this.fileIndex];
				break;
			case "saveFile":
				fs.writeFileSync(folder+"/"+fileList[this.fileIndex],this.data)
				break;
			case "getFileList":
				this.sendCommand("setFileList",fileList);
				break;
			case "setCursor":
				for(var i = 0;i<users.length;i++){
					if(users[i].id!=this.id && users[i].fileIndex == this.fileIndex){
						users[i].sendCommand("setCursor",m.d);
					}
				}
				break;
			case "getTitle":
				this.sendCommand("setTitle",fileList[this.fileIndex]);
				break;
			case "getData":
				this.sendCommand("setData",this.data);
				console.log(this.data);
				break;
			case "setData":
				data[this.fileIndex] = m.d;
				this.data = m.d;
				for(var i = 0;i<users.length;i++){
					if(users[i].id!=this.id){
						users[i].sendCommand("updateData",diff.diff(users[i].data,data[users[i].fileIndex]));
						users[i].data = data[users[i].fileIndex];
					}
				}
				break;
			default:
				console.log(">> Unrecognised command.");
		}
		
	}).bind(this));
}

/*
connection.remoteAddress
connection.sendUTF(
*/