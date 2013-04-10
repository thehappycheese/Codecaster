import time
import http.server
import os
import datetime
from diff import diff
from User import User

contentupdated = datetime.datetime.now()

data = ""
users = [];

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
class MyHandler(http.server.SimpleHTTPRequestHandler):
	
	def do_HEAD(s):
		s.send_response(200)
		s.send_header("Content-type", "text/html")
		s.end_headers()
	def sendHead(s):
		s.send_response(200)
		s.send_header("Content-type", "text/html")
		s.end_headers()
	def do_GET(s):
		global data
		global contentupdated
		tdelt = datetime.datetime.now()-contentupdated
		#print (tdelt.total_seconds())
		
		if(len(s.path)>0):
			if (len(s.path)>4 and s.path[:4]=="/put"):
				s.do_HEAD()
				data = s.path[5:]
				contentupdated = datetime.datetime.now()
				s.wfile.write("SUCCESS".encode("utf-8"))
			elif (s.path[:4]=="/get"):
				#Write full response
				s.do_HEAD()
				s.wfile.write(data.encode("utf-8"))
				
				currentuser = getUser(s.path[5:])
				
				tdelt = currentuser.lastrequest - contentupdated
				tdelt2 = currentuser.lastrequest - datetime.datetime.now()
				currentuser.lastrequest = datetime.datetime.now();
				print ("Client:",currentuser.name," Ping:", tdelt2.total_seconds());
				if(tdelt.total_seconds()<-10):
					#user very out of date
					pass;
				elif(tdelt.total_seconds()<0):
					#user out of date
					pass;
				else:
					s.do_HEAD()
					s.wfile.write("".encode("utf-8"));
			else:
				super(MyHandler,s).do_GET()
	
	def log_message(self,format,*args):
		pass
		#os.system("cls")
		#super(MyHandler,self).log_message(format,*args)
		

httpd = http.server.HTTPServer(('0.0.0.0', 80), MyHandler)

print (time.asctime() + "  Started.")
try:
	httpd.serve_forever()
except KeyboardInterrupt:
	pass

httpd.server_close()
print(time.asctime() + "  Stopped.")