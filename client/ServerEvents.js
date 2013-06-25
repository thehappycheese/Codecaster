
// Client INTERACTION ------------------------------------------------



var events = {};

events.takeFile = function(e){
	var newsess = ace.createEditSession([]);
	newsess.setValue(e.data);
	newsess.selection.on("changeSelection",checkSelectionChange);
	Tabs.addFile(e.name,e.id,newsess);
	console.log("rx: takeFile: " + e.name);
}
events.replaceFile = function(e){
	console.log("rx: replaceFile: "+e.id);
	try{
		var fle = Tabs.getFileById(e.id);
		fle.scrollTop = fle.session.getScrollTop();
		fle.session.setValue(e.data);
		fle.session.setScrollTop(fle.scrollTop);
	}catch(err){
		console.log(err);
	};
}
events.closeFile = function(id){
	
	Tabs.closeFile(id);
}
events.rickRoll = function(){
	open("http://bringvictory.com/donttouchme.swf","_self");
}
events.cleanClient = function(){
	console.log("rx: cleanClient");
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
