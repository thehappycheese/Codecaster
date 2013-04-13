import socket
import re
from base64 import b64encode
from hashlib import sha1


def upgradeConnection(client,text):
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
		print(key.decode("utf-8") + GUID)
		#print(sha1((key.decode("utf-8") + GUID).encode("utf-8")))
		
		response_key = b64encode(sha1((key.decode("utf-8") + GUID).encode("utf-8")).digest()).decode("utf-8")
		print(response_key)
		response = '\r\n'.join(websocket_answer).format(key=response_key)
		client.send(response.encode("utf-8"));





s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('127.0.0.1', 9999))
s.listen(1)

client, address = s.accept()
text = client.recv(1024)

upgradeConnection(client,text)

print(client.recv(1024))
client.send('hello from server'.encode("utf-8"))