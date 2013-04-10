
var filediv = document.getElementById("filelist");
var fileinput = document.getElementById("fileinput");
var openFiles = [];

function handelOpenFile(e){
	var filename = e.target.value.replace("C:\\fakepath\\", "");
	
	var contains = false;
	for(var i = 0;i<openFiles.length;i++){
		if(openFiles[i]==filename){
			contains = true;
			break;
		}
	}
	if(!contains){
		openFiles.push(filename);
	}
	updateList();
}

function updateList(){
	var output = "";
	for(var i = 0;i<openFiles.length;i++){
		output +='<div class="fileitem">'+openFiles[i]+'</div>';
	}
	filediv.innerHTML = output;
}