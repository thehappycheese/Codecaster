
var gui = require('nw.gui');
var win = gui.Window.get();
win.x=30;
win.y=30;
var tools;
win.showDevTools("", true);
win.on("devtools-opened", function(url) {
	tools = gui.Window.open(url,{
		position: 'center',
		width: 800,
		height: 400
	});
	
	tools.on('loaded',function(e){
		tools.x=30;
		tools.y=630;
		setTimeout(function(e){
			tools.window.WebInspector.showPanel("console");
		},200);
	});
	win.on('close',function(e){
		try{
			tools.close();
		}catch(err){}
		this.close(true);
	});
});

function updateClients(){
	var list = document.getElementById("clientList");
	list.innerHTML="";
	for(var i = 0;i<server.clients.length;i++){
		var ndiv = document.createElement("div");
		ndiv.className = "fileItem";
		ndiv.innerHTML = "id: " + server.clients[i].id;
		list.appendChild(ndiv);
	}
}
function openfile(e){
	if(e.target.value.length>0){
		var arr = e.target.value.split(";");
		for(var i = 0;i<arr.length;i++){
			server.openFile(arr[i]);
		}
		e.target.value = "";
	}
}
function updateFiles(){
	var list = document.getElementById("fileList");
	list.innerHTML="";
	for(var i = 0;i<server.files.length;i++){
		var ndiv = document.createElement("div");
		ndiv.className = "fileItem";
		ndiv.innerHTML = server.files[i].id + " - " +getFileName(server.files[i].name,1);
		list.appendChild(ndiv);
	}
}
function getFileName(path,num){
	var result = "";
	var inc=0;
	for(var i = path.length-1;i>=0;i--){
		if(path[i]!="\\"){
			result = path[i] + result;
		}else{
			if(inc==num){
				break;
			}else{
				inc++;
				result = path[i] + result;
			}
		}
	}
	return result;
}