function EditorSession(){


	this.files=[];
	this.selected = 0;
	


	this.addFile = (function (name,id,session){
		editor.setNickLang(name,session);
		this.files.push(new FileData(name,id,session));
		this.updateEventListeners();
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

	this.tabCloseFile = (function(id){
		if(admin){
			e.cancelBubble=true;
			
			if(confirm("Save the file?")){
				saveFile();
			}
			
			var fle = this.getFileById(id);
			
			console.log("rm: file " + fle.name);
			server.send("closeFile",{fle:id});
			
			this.closeFile(fle.id);
		}
	}).bind(this);
	
	
	this.closeFile = (function(id){
		
		for(var i=0;i<this.files.length;i++){
			if(this.files[i].id == id){
				this.files.splice(i,1);
				break;
			}
		}
		while(this.selected>=this.files.length && this.selected>0){
			this.selected--;
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
		return this.files[this.selected];
	}).bind(this);



	this.setFocus = (function(id){
		for(var i=0;i<this.files.length;i++){
			if(this.files[i].id == id){
				this.selected = i;
				break;
			}
		}
		this.refresh();
	}).bind(this);



	this.clear = (function(){
		this.files =[];
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
			editor.setSession(this.files[0].session);// TODO: remove this lazy patch.
		}
		renderTabs(this);
		
		editor.focus();
	}).bind(this);
}

