import socketserver
import re
from base64 import b64encode
from hashlib import sha1

inited = 0

class MyTCPHandler(socketserver.BaseRequestHandler):

	def handle(self):
		global inited
		if(inited==0):
			print(dir(self.server))
			text = self.request.recv(1024).strip()
			self.upgradeConnection(text)
			self.request.send("your face bitch!".encode("utf-8"));
			inited = 1
		else:
			text = self.request.recv(1024).strip()
			self.request.sendall("piss off!".encode("utf-8"));

	def upgradeConnection(self,text):
		#print("Client wants to upgrade:")
		#print(text);
		websocket_answer = (
			'HTTP/1.1 101 Switching Protocols',
			'Upgrade: websocket',
			'Connection: Upgrade',
			'Sec-WebSocket-Accept: {key}\r\n\r\n',
		)

		GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
		#print(re.search(b'Sec-WebSocket-Key:\s+(.*?)[\n\r]+', text))
		key = (re.search(b'Sec-WebSocket-Key:\s+(.*?)[\n\r]+', text)
			.groups()[0]
			.strip())
		
		#print(key.decode("utf-8"))
		#print(key.decode("utf-8") + GUID)
		#print(sha1((key.decode("utf-8") + GUID).encode("utf-8")))
		
		response_key = b64encode(sha1((key.decode("utf-8") + GUID).encode("utf-8")).digest()).decode("utf-8")
		#print(response_key)
		response = '\r\n'.join(websocket_answer).format(key=response_key)
		self.request.send(response.encode("utf-8"));
	
		


HOST, PORT = "localhost", 9999
server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)
server.serve_forever()