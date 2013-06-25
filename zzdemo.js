var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow_night")
editor.getSession().setMode("ace/mode/javascript");
//editor.setReadOnly(true);
//editor.setHighlightActiveLine(false);
editor.setShowPrintMargin(false);
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