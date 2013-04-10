var net = require('net');
console.log("start");

var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  console.log(c)
  c.on('end', function() {
    console.log('server disconnected');
  });
  
  c.write('Sec-Websocket-Accept: nerp');
  c.pipe(c);
});
console.log("this far...");
server.listen(1337, function() { //'listening' listener
  console.log('server bound');
});
console.log("all the way");