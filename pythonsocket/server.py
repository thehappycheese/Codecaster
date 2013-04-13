import time
import http.server
import os
import datetime
from diff import diff
from User import User

contentupdated = datetime.datetime.now()

data = ""
users = [];
later = [];

def getUser(strname):
	user = None
	for i in users:
		if(i.name==strname):
			user = i
			break
	if(user is None):
		print("Username: ",strname," has logged on.");
		user = User()
		user.name = strname
		user.lastrequest = datetime.datetime.now();
		users.append(user)
	return(user);
class MyHandler(http.server.BaseHTTPRequestHandler):
	
	def do_HEAD(s):
		s.send_response(200)
		#s.send_header("Content-type", "text/html")
		s.send_header("Content-type", "text/html")
		s.send_header("Access-Control-Allow-Origin","*")
		s.end_headers()
	def do_GET(s):
		s.do_HEAD()
		s.sendStr("fuck you");
		global later
		
		later.append(s);
		print("get was made"+str(dir(s)));
	def sendStr(s,str):
		s.wfile.write(str.encode("utf-8"));
	#def log_message(self,format,*args):
		#pass
		#os.system("cls")
		#super(MyHandler,self).log_message(format,*args)
		

httpd = http.server.HTTPServer(('127.0.0.1', 80), MyHandler)

print (time.asctime() + "  Started.")
try:
	httpd.serve_forever()
except KeyboardInterrupt:
	pass

httpd.server_close()
print(time.asctime() + "  Stopped.")




s.wfile.write("SUCCESS".encode("utf-8"))