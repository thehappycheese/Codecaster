"use strict";
var ace;
var wsclient;
var Tabs;
var editor;
var dummySession;

define("main", ["ace/ace", "class/WSClient", "class/CasterSession"], function (race, WSClient, CasterSession) {
	
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

	wsclient.on("connect", function (e) {
		wsclient.send("refreshMe", "");
	});

	require(["EventsServer"], function () {});
	
	Tabs = new CasterSession(wsclient);
	
});

//editor = ace.edit("editor");
