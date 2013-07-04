
var dmp = new diff_match_patch();

function nickDiff(text1,text2) {
	dmp.Diff_Timeout = 1;
	dmp.Diff_EditCost = 4;
	var d = dmp.diff_main(text1, text2);
	dmp.diff_cleanupSemantic(d);
	dmp.diff_cleanupEfficiency(d); 
	return d;
}

function nickMakeTextPatch(text1,text2) {
	
	dmp.Diff_Timeout = 1;
	dmp.Diff_EditCost = 4;

	var diff = dmp.diff_main(text1, text2, true);
	dmp.diff_cleanupEfficiency(diff); 
	var patch_list = dmp.patch_make(text1, text2, diff);
	patch_text = dmp.patch_toText(patch_list);
	return patch_text;
}


function nicApplyTextPatch(oldtext,patchtext) {
  var patches = dmp.patch_fromText(patchtext);

  var results = dmp.patch_apply(patches, oldtext);

  return results[0];
  //sucess = results[1] appears to be an array of "sucess" markers as bools 
}