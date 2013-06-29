

function FileData(a_name,a_id,a_session){

	this.getFileName = (function(num){
		var result = "";
		var inc=0;
		for(var i = this.path.length-1;i>=0;i--){
			if(this.path[i]!="\\"){
				result = this.path[i] + result;
			}else{
				if(inc==num){
					break;
				}else{
					inc++;
					result = this.path[i] + result;
				}
			}
		}
		return result;
	}).bind(this);
	
	
	this.getFolder = (function(rank){
		var result = "";
		var inc=0;
		for(var i = this.path.length-1;i>=0;i--){
			if(this.path[i]=="\\"){
				inc++;
			}else if(inc==rank+1){
				result = this.path[i] + result;
			}else if(inc==rank+2){
				break;
			}
		}
		return result;
	}).bind(this);

	this.path 		= a_name;
	this.name		= this.getFileName(0);
	this.longname	= this.getFileName(1);
	this.folder	= this.getFolder(0);
	this.id 		= a_id;
	this.session 	= a_session;
	this.oldData	= this.session.getValue();
	this.oldSel		= [0,0];
	this.scrollTop	= 0;
}


