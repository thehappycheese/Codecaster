function renderTabs(editor){
	var div = document.getElementById("tabs");
	div.innerHTML = "";
		
	var f = renderTabs_decompse(editor.files);
	console.log(f);
	for(var folder in f){
	
		var files = f[folder];
		
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
			}*/
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
	}
	
}

function renderTabs_decompse(files){
	// make folder tree:
	var folders = {};
	for(var i=0;i<files.length;i++){// for every filename
		
		var first  = files[i].getFolder(0);
		var second = files[i].getFolder(1);
		
		if(folders[second]==undefined){
			folders[second] = {};
		}
		if(folders[second][first]==undefined){//first order
			folders[second][first] = {};
		}
		folders[second][first][files[i].name]=files[i];
	}
	return folders;
}