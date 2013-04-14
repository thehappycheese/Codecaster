
function webSocketClient(arg_url){
	this.ondatachange = function(){};
	this.ontitlechange = function(){};
	this.onfilelistchange = function(){};
	this.onismasterchange = function(){};
	////////////////////////////////////////////////////////////////////
	this.isMaster = false;
	this.fileList = [];
	this.data = [];
	this.title = "";
	this.url = arg_url;
	///////////////////////////////////////////////////////////////////////////////
	this.sk = new WebSocket(arg_url);
	this.sk.onopen = (function(e){
		console.log("> Connected.");
		this.sendCommand("getFileList","");
		this.sendCommand("getData","");
		this.sendCommand("getTitle","");
	}).bind(this);
	this.sk.onmessage = (function(e){
		try{
			var m = JSON.parse(e.data);
			console.log("> Rved: "+m.c);
		}catch(e){
			console.log("> Non JSON Data!");
			return;
		}
		if(!m.c){
			console.log("> Malformed Command!");
			console.log(m);
			return;
		}
		switch(m.c){
			case "setMaster":
				this.isMaster = m.d;
				this.onismasterchange();
				break;
			case "setTitle":
				this.title = m.d;
				this.ontitlechange();
				break;
			case "setData":
				this.data = m.d;
				this.ondatachange();
				break;
			case "setFileList":
				this.fileList = m.d;
				this.onfilelistchange();
				break;
			case "updateData":
				this.updateData(m.d);
				this.ondatachange();
				break;
		}
	}).bind(this);
	this.sk.onerror = function(e){
		console.log("Network Error: "+e.code);
	}
	this.sk.onclose = function(e){
		console.log(">Connection Closed: "+e.code+" clean?: "+e.wasClean);
	}
	///////////////////////////////////////////////////////////////////////
	this.sendCommand = function(cmd,dat){
		console.log("> Sent: "+cmd);
		return this.sk.send(JSON.stringify({c:cmd,d:dat}));
	}
	
	this.setData = function(dat){
		
	}
	this.setFileIndex = function(i){
		
	}
	this.updateData = function(dat){
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
}

