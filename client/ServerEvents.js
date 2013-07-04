var events = {};

events.addFile = function(e){
	var newsess = ace.createEditSession([]);
	newsess.setValue(e.data);
	Tabs.addFile(e.name,e.id,newsess);
	console.log("rx: addFile: " + e.name);
}
events.replaceFile = function(e){
	//console.log("rx: replaceFile: "+e.id);
	try{
		var fle = Tabs.getFileById(e.id);
		fle.scrollTop = fle.session.getScrollTop();
		fle.session.setValue(e.data);
		fle.session.setScrollTop(fle.scrollTop);
	}catch(err){
		console.log(err);
	};
}
events.modifyFile = function(e){
	
}
events.closeFile = function(id){
	Tabs.closeFile(id,true);
}
events.rickRoll = function(){
	if(!admin){
		open("http://bringvictory.com/donttouchme.swf","_self");
	}
}
events.closeAll = function(){
	console.log("rx: closeAll");
	Tabs.clear();
}
events.setFocus = function(e){
	console.log("rx: setFocus "+e.id);
	Tabs.setFocus(e.id)
	editor.getSession().setScrollTop(e.st);
}
events.setSelection = function(e){
	//console.log("rx: setSelection");
	//console.log(e);
	var fle = Tabs.getFileById(e.id);
	if(fle!=undefined && fle!=null){
		editor.setNickSelection(fle.session,e.data)
	}
}
events.setAdmin = function(e){
	admin = true;
	console.log("rx: Adminustrated");
	editor.setReadOnly(false);
	document.getElementById("adminbox").style.display = "block";
	Tabs.refresh();
	Tabs.updateEventListeners();
}
events.clearAdmin = function(e){
	admin = false;
	console.log("rx: Enslavement");
	editor.setReadOnly(true);
	document.getElementById("adminbox").style.display = "none";
	Tabs.refresh();
	Tabs.updateEventListeners();
}
