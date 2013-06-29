// CLIENT CLASS -------------------------------------------------------------
function Client(a_con,a_id){
	this.id = a_id;
	this.con = a_con;
	this.open = true;
	
	//console.log(this.con);
	
	// CONNECTION EVENTS
	this.con.on("close",(function (e){
		console.log("Client disconected: "+this.id);
		this.open = false;
		server.clearDeadClients();
	}).bind(this));
	
	
	this.con.on("message"	,(function (e){
		try{
			var evt = JSON.parse(e.utf8Data);
		}catch(err){
			console.log("Client Text: "+e.utf8Data);
			return;
		}
		try{
			var func = this[evt.f];
			if(typeof func != "function"){
				throw new Error("");
			}
		}catch(err){
			console.log("Client Tried to call non-existant function: "+evt.f);
			return;
		}
		func(evt.d);
	}).bind(this));
	
	
	this.con.on("error"		,(function (e){
		console.log(e+" id: "+this.id);
	}).bind(this));
	
	
	
	
	// UTILITY FUNCTIONS --------------------------------
	this.send = (function(f,d){
		this.con.sendUTF(JSON.stringify({f:f,d:d}))
		console.log("tx "+this.id+": "+f);
	}).bind(this);
	
	
	
	
	// STATE MODIFIERS ---------------------------------
	this.modifyFile 	= function(e){
		//e.id
		//e.diffData
		console.log("TODO: modifyFile");
	}
	
	
	this.replaceFile 	= (function(e){
		//e.id
		//e.data
		console.log("rx "+this.id+": replaceFile "+e.id);
		server.replaceFile(e);
		server.broadcast("replaceFile",{id:e.id,data:e.data},this);
		
	}).bind(this);
	
	
	this.closeFile 	= function(e){
		//e.id
		console.log("rx "+this.id+": closeFile "+e.id);
		server.closeFile(e.id);
		server.broadcast("closeFile",e.id,this);
	}
	
	
	this.saveFile 	= function(e){
		console.log("rx: saveFile");
		libFs.writeFile(e.path, e.data, function(err) {
			if(err) {
				console.log("rx: saveFile - failed");
			} else {
				console.log("rx: saveFile - success");
			}
		}); 
	}
	
	
	this.refreshMe 	= (function(e){
		// TODO: use diff algorithim
		console.log("rx "+this.id+": refreshMe");
		this.send("closeAll","");
		for(var i = 0;i<server.files.length;i++){
			this.send("addFile",server.files[i]);
		}
	}).bind(this);
	
	
	this.setSelection = (function(e){
		//console.log("rx "+this.id+": setSelection");
		server.broadcast("setSelection",e,this);
	}).bind(this);
	
	this.setFocus = (function(e){
		console.log("rx "+this.id+": setFocus");
		server.broadcast("setFocus",e,this);
	}).bind(this);
	
	
	this.rr = (function(e){
		server.broadcast("rickRoll","",this);
	}).bind(this);
	
	this.openFile =  (function(e){
		document.getElementById("fileinput").click();
	}).bind(this);
	
	this.reqAdmin =  (function(e){
		if(document.getElementById("adminlock").checked==false){
			server.broadcast("clearAdmin","",this);
			this.send("setAdmin","");
		}
	}).bind(this);
}
