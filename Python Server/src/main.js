var username = ((+new Date()) & 0xFFFFFF)+"";
var icode = ace.edit("icode");
icode.setTheme("ace/theme/twilight");
icode.getSession().setMode("ace/mode/javascript");
icode.setReadOnly(true);
icode.session.setUseWorker(false);

var stsp = document.getElementById("stsp");
var output = document.getElementById("status");


var getstuffID=-1;


status("  ");

//////////////// FUNCTION ///////////////////////////

function toggle(){
	if(getstuffID<0){
		status("Running...");
		stsp.value="STOP";
		getstuffID = setInterval(getstuff,1000);
	}else{
		status("Stopped.");
		stsp.value="START";
		clearInterval(getstuffID);
		getstuffID=-1;
	}
}

function getstuff(){
	var ipaddress = document.URL.replace("viewer.htm","");
	if(loaded){
		try{
			var xhtml = new XMLHttpRequest();
			xhtml.open("GET",ipaddress+"get/"+username,true);
			xhtml.send();
			xhtml.onload = ondataload;
			loaded=false;
		}catch(e){
			toggle();
			status("ERROR");
		}
	}
}

function ondataload(event){
	if(event.currentTarget.responseText.length>0){
		updateCode(event.currentTarget.responseText);
		//document.getElementById("munt").innerHTML=event.currentTarget.responseText;
	}
	loaded=true;
}

function updateCode(str){
	var obj = [];
	var arr = str.split("&");
	var pair
	for(var i = 0;i<arr.length;i++){
		pair = arr[i].split("=")
		obj[pair[0]] = unescape(pair[1].replace(/\+/g,"%20"));
	}
	//console.log(obj)
	icode.setValue(obj["content"]);
	status(obj["title"]);
	icode.selection.clearSelection();
	icode.selection.moveCursorTo(obj["r1"],obj["c1"]);
	icode.selection.selectTo(obj["r2"],obj["c2"]);
	
	icode.scrollToLine(Math.max(parseInt(obj["r1"])-10,0))
	//icode.selection.setSelectionRange(String.valueOf(obj["hoff"]),String.valueOf(obj["hlen"]))
}
function status(str){
	output.innerHTML = str
}