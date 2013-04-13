

url = "http://127.0.0.1:9999/";

var req = null;

function refreshRequest(){
	if(req!=null){
		return;
	}
	req = new XMLHttpRequest();
	
	req.onreadystatechange = function(e){
		console.log("readyStateChange: "+stateStr(e.target));
	}
	req.onloadend = function(e){
		console.log("data: "+e.target.responseText);
		//req=null;
	}
	req.onerror = function (e){
		console.log(e);
	}
	req.open("GET",url);
	req.send();
}

refreshRequest();

function stateStr(req){
	switch(req.readyState){
		case req.DONE:
			return "DONE";
		case req.HEADERS_RECEIVED:
			return "HEADERS_RECEIVED";
		case req.LOADING:
			return "LOADED";
		case req.OPENED:
			return "OPENED";
		case req.UNSENT:
			return "UNSENT";
		default:
			return req.readyState;
	}

}