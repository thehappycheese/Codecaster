"use strict";
var ace;
var wsclient;
var casterSession;
var editor;
var dummySession;

define([
	"ace/ace",
	"class/WSClient",
	"class/CasterSession",
	"EventsServer",
	"EventsSidebar"
	], function (race, WSClient, CasterSession, EventsServer, EventsSidebar) {
	
	ace = race;
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/tomorrow_night");
	editor.dummySession = editor.getSession();
	editor.dummySession.setMode("ace/mode/text");
	//editor.setReadOnly(true);
	editor.setFontSize("14pt");
	//editor.setHighlightActiveLine(false);
	editor.setShowPrintMargin(false);

	wsclient = new WSClient((/[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*/).exec(document.URL)[0]);
	wsclient.on("connect", function (e) { wsclient.send("refreshMe", ""); });
	
	casterSession = new CasterSession(wsclient);
	
	EventsSidebar();
	EventsServer();
	
	
	
	window.addEventListener("keydown", function (e) {
		if (e.keyCode === 8 && !wsclient.admin) {
			e.preventDefault();
		}
		if (e.ctrlKey === true && e.keyCode === 83) {
			casterSession.saveCurrentFile();
			e.preventDefault();
		}
	});
	
});

//editor = ace.edit("editor");
