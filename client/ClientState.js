
// Client INTERACTION ------------------------------------------------
admin = true;

var events = {};

events.takeFile = function(e){
	var newsess = ace.createEditSession([]);
	newsess.setValue(e.data);
	Tabs.addFile(e.name,e.id,newsess);
	console.log("Recieved File " + e.name);
}
events.replaceFile = function(e){
	console.log("Rplaced files:");
	Tabs.getFileById(e.id).session.setValue(e.data);
}
events.closeFile = function(id){
	Tabs.closeFile(id);
}
events.rickRoll = function(){
	open("http://bringvictory.com/donttouchme.swf","_self");
}
events.cleanClient = function(){
	Tabs.clear();
}
events.setClientFocus = function(id){
	Tabs.setFocus()
}
