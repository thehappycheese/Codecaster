// ADMIN FUNCTIONS ---------------------------------------------

admin = false;

window.addEventListener("keyup", function makeAdmin(e){
	if(e.keyCode == 192 && e.ctrlKey){
		admin = true;
		console.log("You are admin");
		editor.setReadOnly(false);
		document.getElementById("adminbox").style.display = "block";
		Tabs.refresh();
	}
});

function getAttention(){
	var fle = Tabs.getCurrentFile();
	server.send("setFocus",{id:fle.id,st:fle.session.getScrollTop()});
}
function saveFile(){
	var fle = Tabs.getCurrentFile();
	server.send("saveFile",{path:fle.path,data:fle.session.getValue()});
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









var statusBox = document.getElementById("statusBox");

// SIDEBAR Interaction --------------------------------------------------
function setEditorLangFileName(name){
	editor.getSession().setMode("ace/mode/text");
	if(			name.substr(name.length-4,4)==".css"){
		editor.getSession().setMode("ace/mode/css");
	}else if(	name.substr(name.length-4,4)==".htm" || name.substr(name.length-5,5)==".html"){
		editor.getSession().setMode("ace/mode/html");
	}else if(	name.substr(name.length-3,3)==".js"){
		editor.getSession().setMode("ace/mode/javascript");
	}
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

// TABS INTERACTION ---------------------------------------------------


// EDITOR INTERACTION --------------------------------------------------




window.addEventListener("keyup",checkDataChange);

function checkDataChange(e){
	if(admin){
		var fle = Tabs.getCurrentFile();
		if(fle.oldData != fle.session.getValue()){
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
		sel = editor.getNickSelection(fle.session);
		if(fle.oldSel[0]!=sel[0] || fle.oldSel[1]!=sel[1]){
			//console.log("ch selection");
			fle.oldSel[0] = sel[0];
			fle.oldSel[1] = sel[1];
			server.send("setSelection",{id:fle.id,data:sel});
		}
	}
}













