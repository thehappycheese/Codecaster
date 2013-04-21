
var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow_night");
editor.getSession().setMode("ace/mode/javascript");
editor.setReadOnly(true);
//editor.session.setUseWorker(false);

var statusBox = document.getElementById("statusBox");


//////////////// FUNCTION ///////////////////////////
window.addEventListener("keydown",master);
function master(e){
	if((e.ctrlkey = true && e.keyCode == 77) || !e){
		client.sendCommand("setMaster",true);
	}
}
window.addEventListener("keydown",savefile);
function savefile(e){
	//console.log(e)
	if(client.isMaster==false && e.keyCode==8){
		e.preventDefault();
	}
	if(client.isMaster && e.ctrlKey == true && e.keyCode == 83){
		client.sendCommand("saveFile");
		e.preventDefault();
	}
}
window.addEventListener("keydown",testfile);
function testfile(e){
	if((e.ctrlKey == true && e.keyCode == 81) || !e){
		var str = "http://"+url+"/workDir/"+client.fileList[client.fileIndex];
		console.log(str);
		open(str,"_blank")
	}
	
}

var fWid = new FileListWidget("filelist","fileitem");
fWid.onselect = function(ind){
	client.fileIndex = ind;
	client.sendCommand("setFileIndex",ind);
	client.sendCommand("getTitle",ind);
	client.sendCommand("getData",ind);
}

//////////////////////////

var url = "";
var socketport = 80;
updateUrl(socketport);
function updateUrl(port){
	socketport = port
	url = (/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/).exec(document.URL);
	console.log("WEBSOCKET URL SET TO:  " + url);
}

var client = new webSocketClient("ws://"+url+":"+socketport);

window.onkeyup = function(e){
	if(client.isMaster){
		if(editor.getValue()!=client.data){
			client.data=editor.getValue();
			client.sendData();
		}
	}
}
editor.selection.on('changeCursor',checkCursor);
editor.selection.on('changeSelection',checkCursor);
var ccur = {a:0,b:0,c:0,d:0};
function checkCursor(){
	if(client.isMaster){
		var rng = editor.selection.getRange();
		if(ccur.a!=rng.start.row || ccur.b!=rng.start.column || ccur.c!=rng.end.row || ccur.d!=rng.end.column){
			ccur.a=rng.start.row;
			ccur.b=rng.start.column;
			ccur.c=rng.end.row;
			ccur.d=rng.end.column;
			client.sendCommand("setCursor",ccur);
			console.log("cursor moved!");
		}
	}
}

client.oncursorchange = function(){
	var rng = editor.selection.getRange();
	ccur.a=rng.start.row	=client.cursor.a;
	ccur.b=rng.start.column	=client.cursor.b;
	ccur.c=rng.end.row		=client.cursor.c;
	ccur.d=rng.end.column	=client.cursor.d;
	editor.selection.setRange(rng);
}

client.ontitlechange = function(){
	statusBox.innerHTML = client.title;
	try{
		str = client.title.substr(client.title.length-3);
		if(str==".js"){
			editor.getSession().setMode("ace/mode/javascript");
			return;
		}
		str = client.title.substr(client.title.length-4);
		str2 = client.title.substr(client.title.length-5)
		if(str==".htm" || str2 ==".html"){
			editor.getSession().setMode("ace/mode/html");
		}
		if(str==".css"){
			editor.getSession().setMode("ace/mode/css");
		}
	}catch(e){
		editor.getSession().setMode("ace/mode/text");
	}
}
client.ondatachange = function(){
	editor.setValue(client.data);
	client.oncursorchange();
}
client.onfilelistchange = function(){
	fWid.updateList(client.fileList);
	console.log(client.fileList);
}
client.onismasterchange = function(){
	editor.setReadOnly(!client.isMaster);
	if(client.isMaster){
		document.getElementById("masterflag").style.color="orange";
		document.getElementById("masterflag").innerHTML = "CodeMASTER";
	}else{
		document.getElementById("masterflag").style.color="white";
		document.getElementById("masterflag").innerHTML = "Codecaster";
	}
}
