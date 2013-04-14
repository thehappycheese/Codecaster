
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/javascript");
//editor.setReadOnly(true);
editor.session.setUseWorker(false);

var statusBox = document.getElementById("statusBox");





//////////////// FUNCTION ///////////////////////////



var fWid = new FileListWidget("filelist","fileitem");
fWid.onselect = function(ind){
	client.sendCommand("setFileIndex",ind);
	client.sendCommand("getTitle",ind);
	client.sendCommand("getData",ind);
}

//////////////////////////
var url = document.URL.substring(4);
url = url.substring(0,url.length-1);
url = "ws"+url+":9999/";
console.log(url);

var client = new webSocketClient(url);



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
	}catch(e){
		editor.getSession().setMode("ace/mode/text");
	}
}
client.ondatachange = function(){
	editor.setValue(client.data);
}
client.onfilelistchange = function(){
	fWid.updateList(client.fileList);
	console.log(client.fileList);
}
