window.onblur=function(){
	var flashToPause = $$(".jsForPause");
	if(flashToPause.length>0 && $isFun(flashToPause[0].stopWhenLeave)){
		flashToPause.each(function(e){
			e.stopWhenLeave(false);
		});
	}
}
window.onfocus=function(){
	var flashToPause = $$(".jsForPause");
	if(flashToPause.length>0 && $isFun(flashToPause[0].stopWhenLeave)){
		flashToPause.each(function(e){
			e.stopWhenLeave(true);
		});
	}
}