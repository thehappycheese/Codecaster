

function FileListWidget(arg_id,arg_class){
	this.onselect = function(ind){}
	this.filediv = document.getElementById(arg_id);
	this.cssclass = arg_class;
	this.updateList = (function(arg_arr){
		
		this.filediv.innerHTML = "";
		var d;
		for(var i = 0;i<arg_arr.length;i++){
			d = document.createElement("div");
			d.innerHTML = arg_arr[i];
			d.className = this.cssclass;
			d.setAttribute("order",i);
			d.onmousedown = this.handel;
			this.filediv.appendChild(d);
		}
		
	}).bind(this);
	this.handel = (function(e){
		this.onselect(e.target.getAttribute("order"));
	}).bind(this);
	this.updateList([]);
}