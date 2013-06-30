function renderTabs(editor){
	var div = document.getElementById("tabs");
	div.innerHTML = "";
		
	var root = renderTabs_decompse(editor.files);
	
	root.render(div);
	
}

function getFolderDiv(){
	
}

function renderTabs_decompse(files){
	// make folder tree:	
	var root = new Folder("root");
	
	for(var i=0; i<files.length; i++){
		var depth =0;
		var currentFolder = root;
		while(files[i].getTopFolder(depth)!=""){
			
			var fold = files[i].getTopFolder(depth);
			
			var isafile = files[i].getTopFolder(depth+1)=="";
			
			if(isafile){
				currentFolder.files.push(files[i].name)
			}else{
				if(currentFolder.folders[fold]==undefined){
					currentFolder.folders[fold] = new Folder(fold);
					
				}
				currentFolder = currentFolder.folders[fold];
			}
			depth++;
		}
		
	}
	return root;
}


function Folder(arg_name){
	this.name = arg_name;
	
	this.folders = {};
	this.files = [];
	
	this.render = (function(div){
		var tnode = document.createTextNode("+"+this.name);
		var brelm = document.createElement("br");
		div.appendChild(tnode);
		div.appendChild(brelm);
			
		for(var i = 0;i<this.files.length;i++){
			var tnode = document.createTextNode("----"+this.files[i]);
			var brelm = document.createElement("br");
			div.appendChild(tnode);
			div.appendChild(brelm);
		}
		
		for(var f in this.folders){
			var sdiv = document.createElement("div");
			sdiv.className = "tabFolder";
			this.folders[f].render(sdiv);
			div.appendChild(sdiv);
		}
	}).bind(this);
	
}









/*
var foldiv = document.createElement("div");
		foldiv.className = "tabfolder";
		foldiv.appendChild(document.createTextNode(folder+"/"));
		
		for(var file =0;file<files.length;file++){
			
			var tabDiv = document.createElement("div");
			
			tabDiv.className="tab";
			tabDiv.id = files[file].id;
			tabDiv.onclick = (function(e){
				if(e.button == 1){
					this.tabCloseFile(e.target.id);
					return;
				}
				this.selected = e.target.id;
				this.refresh();
			}).bind(editor);
			
			/*if(i==editor.selected){
				tabDiv.className+=" tab-selected";
				editor.setSession(this.files[i].session);
			}* /
			// PROMBLEM! TODO: fix this problem! lololol
			
			if(admin){
				var cross = document.createElement("div");
				cross.className = "tab-cross";
				cross.id = files[file].id;
				cross.onclick = (function(e){
					this.tabCloseFile(e.target.id);
				}).bind(editor);
				tabDiv.appendChild(cross);
			}
			tabDiv.appendChild(document.createTextNode(files[file].name));
			foldiv.appendChild(tabDiv);
		}
		div.appendChild(foldiv);
		*/















