// line 864
// U:\Nicholas Archer\GitHub\Codecaster\client\code\ace\selection.js
	Selection.prototype.getNickSelection = function(){
		var sel = this.getRange();
		var doc = this.doc;
		var start = sel.start.column;
		var end = sel.end.column;
		for(var i = 0;i<sel.start.row;i++){
			start+=doc.$lines[i].length+1;
		}
		for(var i = 0;i<sel.end.row;i++){
			end+=doc.$lines[i].length+1;
		}
		return [start,end];
	};
	
	
	// line 878
// U:\Nicholas Archer\GitHub\Codecaster\client\code\ace\selection.js
	Selection.prototype.setNickSelection = function(arr){
		var doc = this.doc;

		var rng = {start:{row:0,column:0},end:{row:0,column:0}};
		
		var curr = 0;
		
		for(var i = 0;i<this.doc.$lines.length;i++){
			if(arr[0] > curr+this.doc.$lines[i].length){
				rng.start.row++;
				curr += this.doc.$lines[i].length+1;
			}else{
				break;
			}
		}
		rng.start.column = arr[0]-curr;
		
		var curr = 0;
		
		for(var i = 0;i<this.doc.$lines.length;i++){
			if(arr[1] > curr+this.doc.$lines[i].length){
				rng.end.row++;
				curr += this.doc.$lines[i].length+1;
			}else{
				break;
			}
		}
		rng.end.column = arr[1]-curr;

		this.setRange(rng);
	};

// line 2405
// U:\Nicholas Archer\GitHub\Codecaster\client\code\ace\edit_session.js
	this.setNickLang = function (name){
		var map = [
			[".as","actionscript"],
			[".css","css"],
			[".htm","html"],
			[".html","html"],
			[".js","javascript"],
			[".json","javascript"],
			[".cs","csharp"],
			[".py","python"],
			[".php","php"],
			[".xml","xml"],
			[".yaml","yaml"],
			[".svg","svg"],
			[".c","c_cpp"],
			[".cpp","c_cpp"],
			[".bat","powershell"],
		];
		var result = "text";
		var tmp = "";
		for(var i=0;i<map.length;i++){
			tmp = name.substr(name.length - map[i][0].length, map[i][0].length);
			if(tmp==map[i][0]){
				result = map[i][1];
				break;
			}
		}
		this.setMode("ace/mode/"+result);
	};