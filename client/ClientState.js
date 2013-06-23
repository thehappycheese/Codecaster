
// Client INTERACTION ------------------------------------------------

var client = {};

client.admin = true;

client.takeFile = function(e){
	console.log(e)
	console.log(e.name, e.id, e.data);
	Tabs.addFile(e.name,e.id,e.data);
}
client.closeFile = function(id){
	Tabs.closeFile(id);
}

//server.send("server.refreshClient","");