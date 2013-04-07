s1="a,b,c,d,e,f";
s2="a,b,d,e,f";
s3="a,nux,b,c,d,e,f";
s4="a,b,pux,d,e,f";
s5="a,b,gux,c,e,lux,f";
s6="b,b,a,a,b,c,a,b,c,d";

def diff(sa,sb):
	
	a = sa.split(",");
	b = sb.split(",");
	
	print(a);
	print(b);
	
	mapa = [];
	mapb = [];
	
	failcount = 0;
	
	
	for j in range(0,len(b)):
		for i in range(0,len(a)):
			if(a[i]==b[j]):
				mapa.append(i);
				mapb.append(j);
	
	mapb.sort();
	print("MAPS")
	print(mapa);
	print(mapb);
	ins = list(b);
	j=0;
	for i in range(0,len(b)):
		if(j<len(mapa) and mapb[j]==i):
			ins[i] = mapa[j];
			j+=1;
		else:
			ins[i]=b[i];
	
	print("INS\n", ins)
	result = "";
	end = 0;
	i=0
	while (i<len(ins)):
		if(type(ins[i]) == str):
			result+=ins[i]
		else:
			if(i+2<len(ins) and type(ins[i+1]) == int and type(ins[i+2]) == int):
				end = i;
				while(end<len(ins)-1 and type(ins[end]) == int and ins[end] == ins[end+1]-1):
					end+=1;
				
				if(end-i>=2):
					result+=str(ins[i])+"-"+str(ins[end]);
					i=end;
				else:
					result+=str(ins[i]);
			else:
				result+=str(ins[i]);
		
		if(i!=len(ins)-1):
			result+=".";
		i+=1;
			
	return (result);
