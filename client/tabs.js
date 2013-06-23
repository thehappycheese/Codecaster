var Tabs = {};


Tabs.list=[];
Tabs.selected = 0;
Tabs.div = document.getElementById("tabs");
Tabs.onselect = function(){};
Tabs.onclose = function(){};
Tabs.addFile = (function (name,id,data){
	this.list.push({name:name,id:id,data:data});
	this.refresh();
}).bind(Tabs);
Tabs.closeFile = (function(id){
	for(var i=0;i<this.list.length;i++){
		if(this.list[i].id == id){
			this.list.splice(i,1);
			break;
		}
	}
	this.refresh();
}).bind(Tabs);

Tabs.refresh = (function(){
	this.div.innerHTML = "";
	
	for(var i = 0;i<this.list.length;i++){
		var cross = document.createElement("div");
		cross.className = "tab-cross";
		cross.indx = i;
		cross.onclick = (function(e){
			Tabs.list.splice(e.target.indx,1);
			Tabs.refresh();
			e.cancelBubble=true;
			Tabs.onclose({name:Tabs.list[e.target.indx].name,id:Tabs.list[e.target.indx].id});
		}).bind(Tabs);
		
		var tabDiv = document.createElement("div");
		tabDiv.className="tab";
		tabDiv.indx=i;
		tabDiv.onclick = (function(e){
			Tabs.selected = e.target.indx;
			Tabs.refresh();
			Tabs.onselect({name:Tabs.list[e.target.indx].name,id:Tabs.list[e.target.indx].id});
		}).bind(Tabs);
		if(i==this.selected){
			tabDiv.className+=" tab-selected";
			editor.setValue(this.list[i].data);
			setEditorLangFileName(this.list[i].name);
		}
		tabDiv.appendChild(document.createTextNode(getFileName(this.list[i].name)));
		tabDiv.appendChild(cross);
		this.div.appendChild(tabDiv);
	}
}).bind(Tabs);
function getFileName(path){
	var result = "";
	var inc=0;
	for(var i = path.length-1;i>=0;i--){
		if(path[i]!="\\"){
			result = path[i] + result;
		}else{
			if(inc==1){
				break;
			}else{
				inc++;
				result = path[i] + result;
			}
		}
	}
	return result;
}
Tabs.refresh();