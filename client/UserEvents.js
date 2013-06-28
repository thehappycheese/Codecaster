// ADMIN FUNCTIONS ---------------------------------------------

admin = false;



function getAttention(){
	var fle = Tabs.getCurrentFile();
	server.send("setFocus",{id:fle.id,st:fle.session.getScrollTop()});
}
function saveFile(){
	var fle = Tabs.getCurrentFile();
	server.send("saveFile",{path:fle.path,data:fle.session.getValue()});
}


// SIDEBAR Interaction --------------------------------------------------
var statusBox = document.getElementById("statusBox");
function getEditorLangFileName(name){
	var map = [
		[".css","css"],
		[".htm","html"],
		[".html","html"],
		[".js","javascript"],
		[".json","javascript"],
		[".cs","csharp"],
		[".py","python"],
		[".php","php"],
		[".xml","xml"],
		[".yaml","yaml"],
		[".svg","svg"],
		[".c","c_cpp"],
		[".cpp","c_cpp"],
		[".bat","powershell"],
	];
	var result = "text";
	var tmp = "";
	for(var i=0;i<map.length;i++){
		tmp = name.substr(name.length - map[i][0].length, map[i][0].length);
		if(tmp==map[i][0]){
			result = map[i][1];
			break;
		}
	}
	return "ace/mode/"+result;
}
function setEditorTextSize(e){
	editor.setFontSize(e.target.value);
	// TODO: This is an admin command... make everyone else follow suit
}
function setEditorColorScheme(e){
	editor.setTheme(e.target.value);
	// TODO: remember color scheme for user
}
function status(txt){
	document.getElementById("statusBox").innerHTML = txt;
}







// Setup EDITOR --------------------------------------------------

var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow_night")
editor.getSession().setMode("ace/mode/javascript");
editor.setReadOnly(true);
//editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false);


editor.getNickSelection = (function(sess){
	var sel = sess.selection.getRange();
	var doc = sess.doc;
	var start = sel.start.column;
	var end = sel.end.column;
	for(var i = 0;i<sel.start.row;i++){
		start+=doc.$lines[i].length+1;
	}
	for(var i = 0;i<sel.end.row;i++){
		end+=doc.$lines[i].length+1;
	}
	return [start,end];
}).bind(editor);



editor.setNickSelection = (function(sess,arr){

	var rng = {start:{row:0,column:0},end:{row:0,column:0}};
	
	var curr = 0;
	
	for(var i = 0;i<sess.doc.$lines.length;i++){
		if(arr[0] > curr+sess.doc.$lines[i].length){
			rng.start.row++;
			curr += sess.doc.$lines[i].length+1;
		}else{
			break;
		}
	}
	rng.start.column = arr[0]-curr;
	
	var curr = 0;
	
	for(var i = 0;i<sess.doc.$lines.length;i++){
		if(arr[1] > curr+sess.doc.$lines[i].length){
			rng.end.row++;
			curr += sess.doc.$lines[i].length+1;
		}else{
			break;
		}
	}
	rng.end.column = arr[1]-curr;

	sess.selection.setRange(rng);
}).bind(editor);



// EDITOR INTERACTION --------------------------------------------------


window.addEventListener("keyup",checkDataChange);
function checkDataChange(e){
	if(admin){
		var fle = Tabs.getCurrentFile();
		if(fle!=undefined && fle.oldData != fle.session.getValue()){
			console.log("ch document: "+fle.id);
			fle.oldData = fle.session.getValue()
			server.send("replaceFile",{id:fle.id,data:fle.session.getValue()});
		}
	}
}
window.addEventListener("keyup",checkSelectionChange);
function checkSelectionChange(e){
	if(admin){
		var fle = Tabs.getCurrentFile();
		if(fle==undefined) return;
		sel = editor.getNickSelection(fle.session);
		if(fle.oldSel[0]!=sel[0] || fle.oldSel[1]!=sel[1]){
			//console.log("ch selection");
			fle.oldSel[0] = sel[0];
			fle.oldSel[1] = sel[1];
			server.send("setSelection",{id:fle.id,data:sel},true);
		}
	}
}













