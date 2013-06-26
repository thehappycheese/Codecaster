using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;
using Alchemy;
using Alchemy.Classes;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace CodecasterServer {
	public partial class Form1 : Form {
		WebSocketServer server;
		public Form1() {
			server = new WebSocketServer(81, IPAddress.Any) {
				OnReceive = OnReceive,
				OnSend = OnSend,
				OnConnect = OnConnect,
				OnConnected = OnConnected,
				OnDisconnect = OnDisconnect,
				TimeOut = new TimeSpan(0, 5, 0)
			};
			server.Start();
			InitializeComponent();
		}
		private void OnReceive(UserContext user) {

			Console.WriteLine("Recieve : " + user.DataFrame.ToString());
			JObject result = JsonConvert.DeserializeObject(user.DataFrame.ToString());
			result.Children.
		}
		private void OnSend(UserContext user) {

		}
		private void OnConnect(UserContext user) {
			Console.WriteLine("Connect : " + user.ClientAddress.ToString());
		}
		private void OnConnected(UserContext user) {

		}
		private void OnDisconnect(UserContext user) {

		}
		private void button1_Click(object sender, EventArgs e) {
			openFileDialog1.ShowDialog();
		}

		private void openFileDialog1_FileOk(object sender, CancelEventArgs e) {
			Console.WriteLine(openFileDialog1.FileName);
		}
	}
}
