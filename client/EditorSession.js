function EditorSession(){


	this.files=[];
	this.selected = 0;
	this.div = document.getElementById("tabs");


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

	this.tabCloseFile = (function(index){
		if(admin){
			e.cancelBubble=true;
			
			if(confirm("Save the file?")){
				saveFile();
			}
			
			var fle = this.files[index];
			
			console.log("rm: file " + fle.name);
			server.send("closeFile",{id:fle.id});
			
			this.closeFile(fle.id);
		}
	}).bind(this);

	this.refresh = (function(){
		this.div.innerHTML = "";
		
		try{
			editor.setSession(ace.createEditSession([]));
		}catch(err){}
		
		for(var i = 0;i<this.files.length;i++){
			
			var cross = document.createElement("div");
			var tabDiv = document.createElement("div");
			
			cross.className = "tab-cross";
			cross.indx = i;
			cross.onclick = (function(e){
				this.tabCloseFile(e.target.indx);
			}).bind(this);
			
			
			tabDiv.className="tab";
			tabDiv.indx=i;
			tabDiv.onclick = (function(e){
				if(e.button==1){
					this.tabCloseFile(e.target.indx);
					return
				}
				this.selected = e.target.indx;
				this.refresh();
			}).bind(this);
			
			if(i==this.selected){
				tabDiv.className+=" tab-selected";
				editor.setSession(this.files[i].session);
			}
			
			tabDiv.appendChild(document.createTextNode(this.files[i].name));
			tabDiv.setAttribute("title",this.files[i].path);
			
			if(admin){
				tabDiv.appendChild(cross);
			}
			this.div.appendChild(tabDiv);
		}
		
		editor.focus();
	}).bind(this);
}

