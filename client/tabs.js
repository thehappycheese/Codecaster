var Tabs = {};


Tabs.list=[];
Tabs.selected = 0;
Tabs.div = document.getElementById("tabs");


Tabs.addFile = (function (name,id,session){
	this.list.push(new FileData(name,id,session));
	
	this.refresh();
}).bind(Tabs);



Tabs.closeFile = (function(id){
	
	for(var i=0;i<this.list.length;i++){
		if(this.list[i].id == id){
			this.list.splice(i,1);
			break;
		}
	}
	while(this.selected>=this.list.length && this.selected>0){
		this.selected--;
	}
	this.refresh();
}).bind(Tabs);



Tabs.getFileById = (function(id){
	for(var i =0;i<this.list.length;i++){
		if(this.list[i].id==id){
			return this.list[i];
		}
	}
	return null;
}).bind(Tabs);



Tabs.getCurrentFile = (function(){
	return this.list[this.selected];
}).bind(Tabs);



Tabs.setFocus = (function(id){
	for(var i=0;i<this.list.length;i++){
		if(this.list[i].id == id){
			this.selected = i;
			break;
		}
	}
	this.refresh();
}).bind(Tabs);



Tabs.clear = (function(){
	this.list =[];
	try{
		editor.setSession(ace.createEditSession([]));
	}catch(err){}
	this.refresh();
}).bind(Tabs);



Tabs.refresh = (function(){
	this.div.innerHTML = "";
	
	try{
		editor.setSession(ace.createEditSession([]));
	}catch(err){}
	
	for(var i = 0;i<this.list.length;i++){
		var cross = document.createElement("div");
		cross.className = "tab-cross";
		cross.indx = i;
		cross.onclick = (function(e){
			e.cancelBubble=true;
			
			if(confirm("Save the file?")){
				saveFile();
			}
			
			var fle = this.list[e.target.indx];
			
			console.log("rm: file " + fle.name);
			server.send("closeFile",{id:fle.id});
			
			this.closeFile(fle.id)
		}).bind(Tabs);
		
		var tabDiv = document.createElement("div");
		tabDiv.className="tab";
		tabDiv.indx=i;
		tabDiv.onclick = (function(e){
			Tabs.selected = e.target.indx;
			Tabs.refresh();
		}).bind(Tabs);
		if(i==this.selected){
			tabDiv.className+=" tab-selected";
			editor.setSession(this.list[i].session);
			setEditorLangFileName(this.list[i].name);
		}
		tabDiv.appendChild(document.createTextNode(this.list[i].name));
		tabDiv.setAttribute("title",this.list[i].path)
		if(admin){
			tabDiv.appendChild(cross);
		}
		this.div.appendChild(tabDiv);
	}
	
	editor.focus();
}).bind(Tabs);





Tabs.refresh();