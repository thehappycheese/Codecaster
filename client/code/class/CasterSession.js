define(["class/CasterFile","FileListRenderer"], function(CasterFile, renderFileList){

	var CasterSession = function(a_wsclient){
	
		this.wsclient = a_wsclient;
		this.files=[];
		this.selected = 0;
		this.currentFileId = null;
		
		
		
		this.addFile = (function (name,id,session){
		
			session.setNickLang(name);
			session.selection.on("changeSelection",this.checkSelectionChange);
			this.files.push(new CasterFile(name,id,session));
			this.currentFileId = id;
			this.refresh();
		}).bind(this);

		this.saveCurrentFile = (function(){
			this.saveFileById(this.getCurrentFile().id);
		}).bind(this);
		
		this.saveFileById = (function(id){
			if(this.wsclient.admin){
				var fle = casterSession.getFileById(id);
				if(fle != undefined){
					wsclient.send("saveFile",{path:fle.path,data:fle.session.getValue()});
				}
			}
		}).bind(this);
		
		this.confirmCloseFile = (function(id){
			if(this.wsclient.admin){
				var fle = casterSession.getFileById(id);
				
				if(confirm("Save? "+fle.name)){
					this.saveFileById(id);
					this.closeFile(fle.id);
					wsclient.send("closeFile",id);
				}else{
					wsclient.send("closeFile",id);
					this.closeFile(fle.id);
					wsclient.send("closeFile",id);
				}
				console.log("rm: file " + fle.name);
			}
		}).bind(this);
		
		
		this.closeFile = (function(id,fromServer){
			var success = false;
			for(var i=0;i<this.files.length;i++){
				if(this.files[i].id == id){
					this.files.splice(i,1);
					success = true;
					break;
				}
			}
			if(!success){
				return;
			}
			if(this.currentFileId == id){
				if(this.files.length>0){
					this.currentFileId = this.files[this.files.length-1].id
				}else{
					this.currentFileId = null;
				}
			}
			this.refresh();
		}).bind(this);



		this.getFileById = (function(id){
			for(var i =0;i<this.files.length;i++){
				if(this.files[i].id==id){
					return this.files[i];
				}
			}
			return null;
		}).bind(this);



		this.getCurrentFile = (function(){
			return this.getFileById(this.currentFileId);
		}).bind(this);



		this.setFocus = (function(id){
			this.currentFileId = id;
			
			this.refresh();
		}).bind(this);



		this.clear = (function(){
			this.files =[];
			this.currentFileId=null;
			try{
				editor.setSession(ace.createEditSession([]));
			}catch(err){}
			this.refresh();
		}).bind(this);

		
		
		this.refresh = (function(){
			if(this.files.length==0){
				try{
					editor.setSession(ace.createEditSession([]));
				}catch(err){}
			}else{
				editor.setSession(this.getCurrentFile().session);
			}
			renderFileList(this);
			
			editor.focus();
		}).bind(this);
		
		
		// window events
		
		this.checkSelectionChange = (function(e) {
			
			if (this.wsclient.admin) {
				var fle = this.getCurrentFile();
				if (fle === undefined){
					return;
				}
				sel = fle.session.getSelection().getNickSelection();
				if (fle.oldSel[0] !== sel[0] || fle.oldSel[1] !== sel[1]) {
					fle.oldSel[0] = sel[0];
					fle.oldSel[1] = sel[1];
					this.wsclient.send("setSelection", {
						id : fle.id,
						data : sel
					}, true);
				}
			}
		}).bind(this);
		window.addEventListener("keyup", this.checkSelectionChange);
		window.addEventListener("mousedown", this.checkSelectionChange);
		window.addEventListener("mouseup", this.checkSelectionChange);
		
		this.checkDataChange = (function(e) {
			if (this.wsclient.admin) {
				var fle = this.getCurrentFile();
				if (fle !== undefined && fle.oldData !== fle.session.getValue()) {
					console.log("ch doc"+fle.id);
					fle.oldData = fle.session.getValue();
						this.wsclient.send("replaceFile", {
							id : fle.id,
							data : fle.session.getValue()
						});
				}
			}
		}).bind(this);
		window.addEventListener("keyup", this.checkDataChange);
		
	}

	
	
	

	return CasterSession
});
