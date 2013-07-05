"use strict";

define(["ace/ace","class/WSClient","class/CasterSession"],function(){





var register = function(){




// ADMIN FUNCTIONS ---------------------------------------------

window.uigetAttention = function(){
	var fle = casterSession.getCurrentFile();
	if(fle != undefined){
		wsclient.send("setFocus",{id:fle.id,st:fle.session.getScrollTop()});
	}
}
window.uisaveFile = function(){
	casterSession.saveCurrentFile();
}
window.uicloseFile = function(){
	var fle = casterSession.getCurrentFile();
	casterSession.confirmCloseFile(fle.id);
}

// SIDEBAR Interaction --------------------------------------------------

window.uisetEditorTextSize = function(e){
	editor.setFontSize(e.target.value);
}
window.uisetEditorColorScheme = function(e){
	editor.setTheme(e.target.value);
}
window.uistatus = function(txt){
	document.getElementById("statusBox").innerHTML = txt;
}



}


return register




});











