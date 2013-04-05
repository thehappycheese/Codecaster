



import time
import http.server
import os

count = 0
content = ""


class MyHandler(http.server.SimpleHTTPRequestHandler):
	
	def do_HEAD(s):
		s.send_response(200)
		s.send_header("Content-type", "text/html")
		s.end_headers()
	def do_GET(s):
		"""Respond to a GET request."""
		global content;
		
		
		
		if(len(s.path)>0):
			if (len(s.path)>4 and s.path[1:4]=="put"):
				s.send_response(200)
				s.send_header("Content-type", "text/html")
				s.end_headers()
				content = s.path[5:]
				s.wfile.write("SUCCESS".encode("utf-8"))
			elif (s.path=="/get"):
				s.send_response(200)
				s.send_header("Content-type", "text/html")
				s.end_headers()
				s.wfile.write(content.encode("utf-8"))
			else:
				super(MyHandler,s).do_GET()
				#s.wfile.write(s.path.encode("utf-8"))
				#f = open(s.path,"r")
				#s.wfile.write(f.read().encode("utf-8"))
				
	def log_message(self,format,*args):
		global count
		count+=1
		if(count>50):
			count=0
			#os.system("cls")
		
		#super(MyHandler,self).log_message(format,*args)

		
HOST_NAME = '0.0.0.0' # !!!REMEMBER TO CHANGE THIS!!!
PORT_NUMBER = 80 # Maybe set this to 9000.

server_class = http.server.HTTPServer
httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)

print (time.asctime() + "  Started on %s:%s" % (HOST_NAME, PORT_NUMBER))
try:
	httpd.serve_forever()
except KeyboardInterrupt:
	pass

httpd.server_close()
print(time.asctime() + "  Stopped.")