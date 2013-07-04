"use strict";

server.on("addFile", function (e) {
	var newsess = ace.createEditSession([]);
	newsess.setValue(e.data);
	Tabs.addFile(e.name, e.id, newsess);
	console.log("rx: addFile: " + e.name);
});

server.on("replaceFile", function (e) {
	//console.log("rx: replaceFile: "+e.id);
	try {
		var fle = Tabs.getFileById(e.id);
		fle.scrollTop = fle.session.getScrollTop();
		fle.session.setValue(e.data);
		fle.session.setScrollTop(fle.scrollTop);
	} catch (err) {
		console.log(err);
	}
});

server.on("modifyFile", function (e) {
	//console.log("rx: replaceFile: "+e.id);
});

server.on("closeFile", function (id) {
	Tabs.closeFile(id, true);
});
server.on("rickRoll", function () {
	if (!admin) {
		window.open("http://bringvictory.com/donttouchme.swf", "_self");
	}
});

server.on("closeAll", function () {
	console.log("rx: closeAll");
	Tabs.clear();
});

server.on("setFocus", function (e) {
	console.log("rx: setFocus " + e.id);
	Tabs.setFocus(e.id);
	editor.getSession().setScrollTop(e.st);
});

server.on("setSelection", function (e) {
	//console.log("rx: setSelection");
	//console.log(e);
	var fle = Tabs.getFileById(e.id);
	if (fle !== undefined && fle !== null) {
		editor.setNickSelection(fle.session, e.data);
	}
});

server.on("setAdmin", function (e) {
	admin = true;
	console.log("rx: Adminustrated");
	editor.setReadOnly(false);
	document.getElementById("adminbox").style.display = "block";
	Tabs.refresh();
	Tabs.updateEventListeners();
});

server.on("clearAdmin", function (e) {
	admin = false;
	console.log("rx: Enslavement");
	editor.setReadOnly(true);
	document.getElementById("adminbox").style.display = "none";
	Tabs.refresh();
	Tabs.updateEventListeners();
});
