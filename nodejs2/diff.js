exports.diff = function(s1,s2){
	
	var a = s1.split(",");
	var b = s2.split(",");
	
	var mapb = [];
	var mapa =[];
	var failcount = 0;
	for(var i = 0;i<a.length;i++){
		for(var j = 0;j<b.length;j++){
			if(a[i]==b[j]){
				mapb.push(j);
				mapa.push(i);
			}
		}
	}
	
	mapb.sort(function(a,b){return a-b;});
	
	var ins = b.slice();

	for(var i=0, j=0;i<b.length;i++){
		if(j<mapa.length && mapb[j]==i){
			ins[i]=mapa[j];
			j++;
		}
	}
	
	var result = [];
	var end = 0;
	var i = 0;
	while(i<ins.length){
		if(typeof ins[i] == "string"){
			result.push(ins[i]);
		}else{
			if(i+2<ins.length && typeof ins[i+1] == "number" && typeof ins[i+2] == "number"){
				end = i;
				
				while(end<ins.length-1 && typeof ins[end] == "number" && ins[end] == ins[end+1]-1){
					end++;
				}
				
				if(end-i>2){
					result.push([ins[i],ins[end]]);
					i=end;
				}else{
					result.push(ins[i]);
				}
				
			}else{
				result.push(ins[i]);
			}
		}
		i++;
	}
	return result;
}