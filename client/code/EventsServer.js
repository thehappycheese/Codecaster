define(["ace/ace", "class/WSClient","class/CasterSession"],function(){
	
	var register = function(){
	
	wsclient.on("addFile", function (e) {
		var newsess = ace.createEditSession([]);
		newsess.setValue(e.data);
		casterSession.addFile(e.name, e.id, newsess);
	});

	wsclient.on("replaceFile", function (e) {
		try {
			var fle = casterSession.getFileById(e.id);
			var old = fle.session.selection.getNickSelection();
			fle.scrollTop = fle.session.getScrollTop();
			fle.session.setValue(e.data);
			fle.session.setScrollTop(fle.scrollTop);
			fle.session.selection.setNickSelection(old);
		} catch (err) {
			// Fail quitetly, like a fish.
		}
	});

	wsclient.on("modifyFile", function (e) {
		// Fail quitetly, like a fish.
	});

	wsclient.on("closeFile", function (id) {
		casterSession.closeFile(id, true);
	});
	
	wsclient.on("rickRoll", function () {
		if (!wsclient.admin) {
			window.open("http://bringvictory.com/donttouchme.swf", "_self");
		}
	});

	wsclient.on("closeAll", function () {
		casterSession.clear();
	});

	wsclient.on("setFocus", function (e) {
		casterSession.setFocus(e.id);
		editor.getSession().setScrollTop(e.st);
	});

	wsclient.on("setSelection", function (e) {
		//console.log(e);
		var fle = casterSession.getFileById(e.id);
		if (fle !== undefined && fle !== null) {
			fle.session.selection.setNickSelection(e.data);
		}
	});

	wsclient.on("setAdmin", function (e) {
		wsclient.admin = true;
		editor.setReadOnly(false);
		document.getElementById("adminbox").style.display = "block";
	});

	wsclient.on("clearAdmin", function (e) {
		wsclient.admin = false;
		editor.setReadOnly(true);
		document.getElementById("adminbox").style.display = "none";
	});
	
	}
	
	return register;

});


