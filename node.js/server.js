var http = require('http'),
      fs = require('fs'),
     url = require('url');
var server = http.createServer(function (req, res) {
	
	reqs.push(new lateResponse(req,res));
	console.log("got one");
});
server.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');


var reqs = [];

// ----------------------------------------


function lateResponse(req,res){
	this.req = req;
	this.res = res;
	this.path = url.parse(req.url).pathname;
	this.respond = function(data){
		this.res.writeHead(200, {
			'Content-Type'   : 'text/plain',
			'Access-Control-Allow-Origin' : '*'
		});
		this.res.end(data+" "+this.path);
	}
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
 
process.stdin.on('data', function (chunk) {
 process.stdout.write('data: ' + chunk);
	while(reqs.length>0){
		reqs.shift().respond(chunk);
	}
});