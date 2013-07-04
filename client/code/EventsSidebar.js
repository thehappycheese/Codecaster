"use strict";
// ADMIN FUNCTIONS ---------------------------------------------

function uigetAttention(){
	var fle = Tabs.getCurrentFile();
	server.send("setFocus",{id:fle.id,st:fle.session.getScrollTop()});
}
function uisaveFile(){
	var fle = Tabs.getCurrentFile();
	server.send("saveFile",{path:fle.path,data:fle.session.getValue()});
}
function uicloseFile(){
	var fle = Tabs.getCurrentFile();
	Tabs.confirmCloseFile(fle.id);
}

// SIDEBAR Interaction --------------------------------------------------

function uisetEditorTextSize(e){
	editor.setFontSize(e.target.value);
}
function uisetEditorColorScheme(e){
	editor.setTheme(e.target.value);
}
function uistatus(txt){
	document.getElementById("statusBox").innerHTML = txt;
}











