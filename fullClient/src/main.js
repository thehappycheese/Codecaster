var username = ((+new Date()) & 0xFFFFFF)+"";
var icode = ace.edit("icode");
icode.setTheme("ace/theme/twilight");
icode.getSession().setMode("ace/mode/javascript");
icode.setReadOnly(true);
icode.session.setUseWorker(false);

var stsp = document.getElementById("stsp");
var output = document.getElementById("status");


var client = null;


setStatus("  ");

//////////////// FUNCTION ///////////////////////////
function setStatus(str){
	output.innerHTML = str
}
function startSocket(){
	var url = document.URL.substring(4);
	url = url.substring(0,url.length-1);
	url = "ws"+url+":9999/";
	console.log(url);
	
	client = new webSocketClient(url);
}



