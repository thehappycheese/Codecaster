package codecaster.handlers;

import java.util.Timer;
import java.util.TimerTask;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.*;


import org.eclipse.jface.text.BadLocationException;
import org.eclipse.jface.text.IDocument;
import org.eclipse.jface.text.ITextSelection;
import org.eclipse.swt.widgets.Display;
import org.eclipse.ui.IEditorPart;
import org.eclipse.ui.IWorkbenchWindow;
import org.eclipse.ui.PlatformUI;
import org.eclipse.ui.texteditor.AbstractTextEditor;

public class updateServer {
	
	Timer derk;
	TimerTask derktask;
	Runnable asynctask;
	Boolean activated;
	public AbstractTextEditor editor;
	public IWorkbenchWindow window;
	public IDocument document;
	int hoff = 0;
	int hlen = 0;
	int row1 = 0;
	int col1 = 0;
	int row2 = 0;
	int col2 = 0;
	Display display;
	
	updateServer(){
		display = PlatformUI.createDisplay();
		window = PlatformUI.getWorkbench().getActiveWorkbenchWindow();
		activated = false;
		asynctask = new Runnable(){
			@Override
			public void run() {
				ITextSelection tsel = (ITextSelection)editor.getSite().getSelectionProvider().getSelection();
				hoff = tsel.getOffset();
				hlen = tsel.getLength();
				try {
					row1 = document.getLineOfOffset(hoff);
					col1 = hoff-document.getLineOffset(row1);
					row2 = document.getLineOfOffset(hoff+hlen);
					col2 = hoff+hlen-document.getLineOffset(row2);
				} catch (BadLocationException e) {
					row1 = col1 = row2 = col2 = 0;
					System.out.println("badoff");
				}
				System.out.println(row1 +","+col1+" "+row2+","+col2+" - "+hoff+" "+hlen);
				
			}
			
		};
	}
	public void toggle(){
		if(activated){
			stop();
		}else{
			start();
		}
	}
	public void start(){
		derk = new Timer();
		derk.scheduleAtFixedRate(makeTask(), 100, 500);
		activated = true;
	}
	public void stop(){
		try{
			derk.cancel();
			derk.purge();
		}catch(Error e){
			//
		}
		activated = false;
	}
	public TimerTask makeTask(){
		return new TimerTask(){
			@Override
			public void run() {
				if(window==null){
					System.out.println("No window");
					stop();
					return;
				}
				if(window.getActivePage()==null){
					System.out.println("No active page");
					stop();
					return;
				}
				IEditorPart aed = window.getActivePage().getActiveEditor();
				if(aed==null){
					System.out.println("No active editor yet");
					return;
				}
				editor = (AbstractTextEditor) aed.getAdapter(AbstractTextEditor.class);
				if(editor==null){
					System.out.println("NO EDITOR");
					return;
				}
				document = editor.getDocumentProvider().getDocument(editor.getEditorInput());
				if(document==null){
					System.out.println("NO DOCUMENT");
					return;
				}
				display.asyncExec(asynctask);
				
				
				String content = document.get();
				String title = editor.getTitle();
				// build message:
				String mess = "";
				try {
					String encod = "ISO-8859-1";
					//encod = "UTF-8";
					mess += "/put/title="+java.net.URLEncoder.encode(title,encod);
					mess += "&content="+java.net.URLEncoder.encode(content,encod);
					mess += "&r1="+java.net.URLEncoder.encode(String.valueOf(row1),encod);
					mess += "&c1="+java.net.URLEncoder.encode(String.valueOf(col1),encod);
					mess += "&r2="+java.net.URLEncoder.encode(String.valueOf(row2),encod);
					mess += "&c2="+java.net.URLEncoder.encode(String.valueOf(col2),encod);
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
				sendMessage(mess);
			}
		};
	}
	private void sendMessage(String msgtext){
		String urlstr = "http://127.0.0.1:80"+msgtext;
		
		try{			
			URL url = new URL(urlstr);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();           
		    con.setDoOutput(true); 
		    con.setInstanceFollowRedirects(false); 
		    con.setRequestMethod("GET"); 
		    con.setRequestProperty("Content-Type", "text/plain"); 
		    con.setRequestProperty("charset", "utf-8");
		    con.connect();
		    
		    BufferedReader rd = new BufferedReader(new InputStreamReader(con.getInputStream()));
		    String line;
	        while ((line = rd.readLine()) != null) {
	        	if(line!="SUCCESS")
	        		System.out.println(line);
	        }
	        rd.close();
			
		}catch(Error e){
			// trollololol	
		} catch(ConnectException e){
			System.out.println("Connection not avaliable");
		} catch (MalformedURLException e) {
			System.out.println("Malformed url");
		} catch (IOException e) {
			System.out.println("IO Exeption");
		}
		
	}

}
