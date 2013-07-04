"use strict";

window.addEventListener("keydown", function (e) {
	if (e.keyCode === 8 && !admin) {
		e.preventDefault();
	}
	if (e.ctrlKey === true && e.keyCode === 83) {
		if (admin) {
			uisaveFile();
		}
		e.preventDefault();
	}
});

window.addEventListener("keyup", checkDataChange);
function checkDataChange(e) {
	if (admin) {
		var fle = Tabs.getCurrentFile();
		if (fle !== undefined && fle.oldData !== fle.session.getValue()) {
			//console.log("ch document: "+fle.id);
			fle.oldData = fle.session.getValue();
				server.send("replaceFile", {
					id : fle.id,
					data : fle.session.getValue()
				});
		}
	}
}
window.addEventListener("keyup", checkSelectionChange);
function checkSelectionChange(e) {
	if (admin) {
		var fle = Tabs.getCurrentFile();
		if (fle === undefined){
			return;
		}
		sel = editor.getNickSelection(fle.session);
		if (fle.oldSel[0] !== sel[0] || fle.oldSel[1] !== sel[1]) {
			//console.log("ch selection");
			fle.oldSel[0] = sel[0];
			fle.oldSel[1] = sel[1];
			server.send("setSelection", {
				id : fle.id,
				data : sel
			}, true);
		}
	}
}
