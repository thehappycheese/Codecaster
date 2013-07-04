define(["main"],function(){
	
	wsclient.on("addFile", function (e) {
		var newsess = ace.createEditSession([]);
		newsess.setValue(e.data);
		Tabs.addFile(e.name, e.id, newsess);
	});

	wsclient.on("replaceFile", function (e) {
		try {
			var fle = Tabs.getFileById(e.id);
			fle.scrollTop = fle.session.getScrollTop();
			fle.session.setValue(e.data);
			fle.session.setScrollTop(fle.scrollTop);
		} catch (err) {
			// Fail quitetly, like a fish.
		}
	});

	wsclient.on("modifyFile", function (e) {
		// Fail quitetly, like a fish.
	});

	wsclient.on("closeFile", function (id) {
		Tabs.closeFile(id, true);
	});
	
	wsclient.on("rickRoll", function () {
		if (!admin) {
			window.open("http://bringvictory.com/donttouchme.swf", "_self");
		}
	});

	wsclient.on("closeAll", function () {
		console.log("rx: closeAll");
		Tabs.clear();
	});

	wsclient.on("setFocus", function (e) {
		console.log("rx: setFocus " + e.id);
		Tabs.setFocus(e.id);
		editor.getSession().setScrollTop(e.st);
	});

	wsclient.on("setSelection", function (e) {
		//console.log("rx: setSelection");
		//console.log(e);
		var fle = Tabs.getFileById(e.id);
		if (fle !== undefined && fle !== null) {
			editor.setNickSelection(fle.session, e.data);
		}
	});

	wsclient.on("setAdmin", function (e) {
		admin = true;
		console.log("rx: Adminustrated");
		editor.setReadOnly(false);
		document.getElementById("adminbox").style.display = "block";
		Tabs.refresh();
		Tabs.updateEventListeners();
	});

	wsclient.on("clearAdmin", function (e) {
		admin = false;
		console.log("rx: Enslavement");
		editor.setReadOnly(true);
		document.getElementById("adminbox").style.display = "none";
		Tabs.refresh();
		Tabs.updateEventListeners();
	});

});


