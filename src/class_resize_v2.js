var navBox = document.getElementById("navBox"),
	caNavBox = document.getElementById("caNavBox"),
	mainBox = document.getElementById("courseMainBox"),
	caNavContentV2 = document.getElementById("caNavContent"),
	foldNav = document.getElementById("foldNav"),
	zwrapH = document.getElementById("zwrap"),
	isPureVideoMode = false,
	chapListPos = document.getElementById("chapListPosInput").val(),
	winH = null, winW = null, mainBoxMl = null, mainBoxMlTmp = null, hasPinned = false,
	wordAndPdfMediaEles = new Array(),
	isImportNode = document.getElementById('isImportNodeIpt').val() == 'true';

//导航栏固定 
var fnGetSize = function(){
	winH = document.documentElement.clientHeight;
	winW = document.documentElement.clientWidth;
//	if(isImportNode){
//		mainBox.css({height: winH - 5 });
//	}
//	caNavBox.h(winH - 198 - 49);
	//navBox.h(caNavContent.h()+198);
	zwrapH.h(winH-54);
	caNavContentV2.h(winH-225);
	mainBoxMl = (winW - 960) / 2;
	if(chapListPos=='LEFT'){
		if(foldNav.attr("title") == "收起"){
			mainBoxMlTmp = mainBoxMl < 310 ? 310 : mainBoxMl;
			navBox.css({left: 0});
		}else{
			mainBoxMlTmp = winW - mainBox.w() > 0 ? (winW - mainBox.w()) / 2 : 0;
			navBox.css({left: -290});
		}
	}else if(chapListPos == 'RIGHT'){
		if(foldNav.attr("title") == "收起"){
			mainBoxMlTmp = winW - mainBox.w() - mainBoxMl < 310 ? winW - mainBox.w() - 310 : mainBoxMl;
			navBox.css({right: 0});
		}else{
			mainBoxMlTmp = winW - mainBox.w() - mainBoxMl < 0 ? winW - mainBox.w() : (winW - mainBox.w()) / 2 ;
			navBox.css({right: -290});
		}
	}
	mainBox.css({marginLeft: mainBoxMlTmp > 0 ? mainBoxMlTmp : 0 });
//	foldNav.css({top: (winH - 65 - 49) / 2});
	if(isPureVideoMode == 'true'){
		refreshMediaBoxSize();
	}else{
		refreshWordAndPdfBoxSize();
	}
};

if($isEle(foldNav)){
	foldNav.addEvent("click", function(){
		var navFx = new Fx.Tween(navBox), mainFx = new Fx.Tween(mainBox);
		if (this.attr("title") == "收起"){
			this.swapClass("nav_fold_"+this.attr('info'), "nav_unfold_"+this.attr('info')).attr("title", "展开");
			hasPinned = false;
			if(chapListPos === 'LEFT'){
				navFx.start('left', 0, -290);
				if (mainBoxMl < 310){
					mainFx.start('margin-left', 310, mainBoxMl);
				}
			}else if(chapListPos === 'RIGHT'){
				navFx.start('right', 0, -290);
				if (mainBoxMl < 310){
					mainFx.start('margin-right', 310, mainBoxMl);
				}
			}
		} else {
			this.swapClass("nav_unfold_"+this.attr('info'), "nav_fold_"+this.attr('info')).attr("title", "收起");
			if(winW - 310 < 960) hasPinned = true;
			if(chapListPos === 'LEFT'){
				navFx.start('left', -290, 0);
				if (mainBoxMl < 310){
					mainFx.start('margin-left', mainBoxMl, 310);
				}
			}else if(chapListPos === 'RIGHT'){
				navFx.start('right', -290, 0);
				if (mainBoxMl < 310){
					mainFx.start('margin-right', mainBoxMl, 310);
				}
			}
		}
		setTimeout('fnGetSize()', 500);
	});
}
var mediaBox = null, media = null, mediaMaxW = 960, mediaMaxH = mediaMaxW * 3 / 4 + 30, mediaWTmp, mediaHTmp;
var findMediaEle = function(){
	mediaBox = document.getElementById('mediaBox');
	media = null;
	if($isEle(mediaBox)){
		media = mediaBox.getElement('object');
		if($isEle(media)) return;
	}
};
var refreshMediaBoxSize = function(){
	if($isEle(media)){
		mediaHTmp = winH - 150;
		media.attr('height', mediaHTmp > 0 ? (mediaHTmp < mediaMaxH ? mediaHTmp : mediaMaxH) : 0);
		if (foldNav.attr("title") == "收起"){
			mediaWTmp = winW - foldNav.w() - navBox.w();
			
		}else{
			mediaWTmp = winW - mainBox.css('margin-left').toInt() * 2;
		}
		media.attr('width', mediaWTmp > 0 ? (mediaWTmp < mediaMaxW ? mediaWTmp : mediaMaxW) : 0);
		mediaBox.css({width: mediaWTmp > 0 ? (mediaWTmp < mediaMaxW ? mediaWTmp : mediaMaxW) : 0});
	}
};
var findWordAndPdfMediaEle = function(){
	mediaBox = document.getElementById('mediaBox');
	embedEles = null;
	if($isEle(mediaBox)){
		embedEles = mediaBox.getElements('embed');
		//console.log(embedEles.length);
		if(embedEles.length > 0){
			embedEles.each(function(ele){
				//console.log(ele.attr('src'));
				if(ele.attr('src').contains('FlexReader.swf')){
					wordAndPdfMediaEles.push(ele);
				}
			});
		}
	}
};
var refreshWordAndPdfBoxSize = function(){
	if(wordAndPdfMediaEles.length > 0){
		wordAndPdfMediaEles.each(function(ele){
			ele.attr('height', winH - 180);
		});
	}
};

if ($isEle(caNavBox)){
	window.addEvents({
		resize : function(){
			fnGetSize();
		},
		domready : function(){
			fnGetSize();
		}
	});
}

if($isEle(document.getElementById('courseStabContent')) && document.getElementById('courseStabContent').html().trim() == ''){
	document.getElementById('courseStabContent').out();
}

if(isImportNode){
	document.getElementById('go2Area').out();
}