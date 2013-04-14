exports.diff = function(s1,s2){
	
	var a = s1.split("");
	var b = s2.split("");
	
	// prevent reuse of indicies from each array.
	var ua = a.splice();
	var ub = b.splice();
	for(var i = 0;i<ub.length;i++){
		ub[i]=false;
	}
	for(var i = 0;i<ua.length;i++){
		ua[i]=false;
	}
	
	// Gennerate character mapping from one array to another
	
	var mapa = [];
	var mapb = [];

	for(var j = 0;j<b.length;j++){
		for(var i = 0;i<a.length;i++){
			if(a[i]==b[j] && !ub[j] && !ua[i]){
				mapa.push(i);
				mapb.push(j);
				ua[i]=true;
				ub[j]=true;
			}
		}
	}
	
	
	// Create array same length as B
	
	var c = b.slice();

	
	// Fill in the array with data the client already has:
	
	for(var i = 0;i<mapb.length;i++){
		c[mapb[i]] = mapa[i];
	}
	//console.log(a);
	//console.log(b);
	//console.log(JSON.stringify(mapa));
	//console.log(JSON.stringify(mapb));
	//console.log(JSON.stringify(c));
	
	// compress c;

	for(i=0;i<c.length-1;i++){
		if(typeof c[i] == "object"){
			if(typeof c[i+1] == "number"){
				if(c[i+1]==c[i][1]+1){
					c[i][1]++;
					c.splice(i+1,1);
					i--;
				}
			}
		}else if(typeof c[i] == "number"){
			if(typeof c[i+1] == "number"){
				if(c[i+1]==c[i]+1){
					c[i] = [c[i],c[i+1]]
					c.splice(i+1,1);
					i--;
				}
			}
		}
	}
	
	// Further compression;
	for(var i=0;i<c.length;i++){
		if(typeof c[i] == "object"){
			if(c[i][1]==c[i][0]+1){
				c.splice(i,1,c[i][0],c[i][1]);
			}
		}
	}
	return c;
}
exports.hunksplit = function (str){
	
}

//Apply diff:
/*
function updateData(dat){
	console.log(JSON.stringify(dat))
	var cur = noox.value.split("");
	var res = [];
	for(var i = 0; i<dat.length;i++){
		if(typeof dat[i]=="object"){
			for(var j = dat[i][0];j<=dat[i][1];j++){
				res.push(cur[j]);
			}
		}else if(typeof dat[i]=="string"){
			res.push(dat[i]);
		}else{
			res.push(cur[dat[i]]);
		}
	}
	setData(res.join(""));
}
*/