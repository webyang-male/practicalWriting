
	function nofind(event){
		event = event ? event : window.event;
		var img = event.srcElement ? event.srcElement : event.target; 
		var imgurl=img.getAttribute("imagedata");
		img.src=imgurl;
		img.onerror=null; 
	}
	
