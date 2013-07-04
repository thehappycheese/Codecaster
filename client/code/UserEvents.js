// ADMIN FUNCTIONS ---------------------------------------------


window.addEventListener("keydown",function(e){
	if(e.keyCode == 8 && !admin){
		e.preventDefault();
	}
	if(e.ctrlKey ==true && e.keyCode == 83){
		if(admin){
			uisaveFile();
		}
		e.preventDefault();
	}
});


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


// EDITOR INTERACTION --------------------------------------------------

window.addEventListener("keyup",checkDataChange);
function checkDataChange(e){
	if(admin){
		var fle = Tabs.getCurrentFile();
		if(fle!=undefined && fle.oldData != fle.session.getValue()){
			//console.log("ch document: "+fle.id);
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













