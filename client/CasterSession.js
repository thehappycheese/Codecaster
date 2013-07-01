function CasterSession(){


	this.files=[];
	this.selected = 0;
	
	this.currentFileId = null;

	this.addFile = (function (name,id,session){
		editor.setNickLang(name,session);
		this.files.push(new CasterFile(name,id,session));
		this.updateEventListeners();
		this.currentFileId = id;
		this.refresh();
	}).bind(this);


	this.updateEventListeners = (function (){
		for(var i =0;i<this.files.length;i++){
			if(admin){
				this.files[i].session.selection.on("changeSelection",checkSelectionChange);
			}else{
				this.files[i].session.selection.removeAllListeners()
			}
		}
	}).bind(this);

	this.confirmCloseFile = (function(id){
		if(admin){
			
			if(confirm("Save the file?")){
				saveFile();
			}
			
			var fle = this.getFileById(id);
			
			console.log("rm: file " + fle.name);
			
			
			this.closeFile(fle.id);
		}
	}).bind(this);
	
	
	this.closeFile = (function(id){
		for(var i=0;i<this.files.length;i++){
			if(this.files[i].id == id){
				this.files.splice(i,1);
				success = true;
				break;
			}
		}
		server.send("closeFile",id);
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
		renderTabs(this);
		
		editor.focus();
	}).bind(this);
}

