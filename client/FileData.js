

function FileData(a_name,a_id,a_session){
	this.path 		= a_name;
	this.name		= getFileName(this.path,0);
	this.longname	= getFileName(this.path,1);
	this.id 		= a_id;
	this.session 	= a_session;
	this.oldData	= this.session.getValue();
	this.oldSel		= [0,0];
	this.scrollTop	= 0;
}

function getFileName(path,num){
	var result = "";
	var inc=0;
	for(var i = path.length-1;i>=0;i--){
		if(path[i]!="\\"){
			result = path[i] + result;
		}else{
			if(inc==num){
				break;
			}else{
				inc++;
				result = path[i] + result;
			}
		}
	}
	return result;
}