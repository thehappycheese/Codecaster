



function renderTabs(castSess){
	var div = document.getElementById("explorer");
	div.innerHTML = "";
		
	var root = renderTabs_decompse(castSess.files);
	root.render(div, castSess);
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
				currentFolder.files.push(files[i])
			}else{
				if(currentFolder.folders[fold]==undefined){
					currentFolder.folders[fold] = new Folder(fold);
					
				}
				currentFolder = currentFolder.folders[fold];
			}
			depth++;
		}
	}
	// simplify folder tree
	
	root.simplify();
	return root;
}


function Folder(arg_name){
	this.name = arg_name;
	
	this.folders = {};
	this.files = [];
	
	this.render = (function(div,castSess){
		if(this.name!="root"){
			div.appendChild(makeDivFolderName(this.name));
		}
			
		for(var i = 0;i<this.files.length;i++){
			div.appendChild( makeFileItem(this.files[i], castSess) );
		}
		
		for(var f in this.folders){
			var sdiv = document.createElement("div");
			sdiv.className = "folderDiv";
			this.folders[f].render(sdiv, castSess);
			div.appendChild(sdiv);
		}
	}).bind(this);
	
	this.simplify = (function(){
		var deletedSomething = true;
		while(deletedSomething){
			deletedSomething = false;
			for(var f in this.folders){
				var subfolder = this.folders[f];
				
				if(subfolder.files.length==0){
					for(var q in subfolder.folders){
						this.folders[q] = subfolder.folders[q];
					}
					deletedSomething = true;
					delete this.folders[f];
				}
			}
			
		}
		
		
	}).bind(this);
	
}

function makeFileItem(file, castSess){
	var div = document.createElement("div");
	var child = document.createTextNode(file.name);
	div.appendChild(child);
	div.id = file.id;
	div.castSess = castSess;
	div.addEventListener("mousedown",(function(e){
		if(e.button==0){
			this.castSess.setFocus(this.id);
		}else if(e.button ==1){
			this.castSess.confirmCloseFile(this.id);
			console.log(e.button);
		}
	}).bind(div))

	div.className = "fileNameDiv"
	
	if(file.id == castSess.currentFileId){
		div.className += " fileNameDiv-selected"
	}
	return div;
}

function makeDivFolderName(str){
	var div = document.createElement("div");
	var child = document.createTextNode(str);
	div.appendChild(child);
	div.className = "folderNameDiv"
	return div;
}














