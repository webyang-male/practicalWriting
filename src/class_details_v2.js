var chapterSelected = $("courseChapterSelected"), courseImg = $("courseImg"), nodeTitleEle = $("nodeTitleEle"), chapterId = null, currCourseId=0, currClazzId=0, currContentType=null, currPersonId=0;
if ($isEle(chapterSelected)){
	chapterId = chapterSelected.attr("data");
}
if($isEle(courseImg)){
	currCourseId = courseImg.attr("data").split("|")[0];
	currClazzId = courseImg.attr("data").split("|")[1];
	currContentType = courseImg.attr("data").split("|")[2]; 
	currPersonId = courseImg.attr("data").split("|")[3];
}
if($isEle($("nodeTitleEle"))){
	currClazzId = nodeTitleEle.attr("clazzId");
	chapterId = nodeTitleEle.attr("nodeId");
	currPersonId = nodeTitleEle.attr("createrId");
}

// 知识点搜索
var nodeSearchBtn = $('nodeSearchBtn'), nodeSearchCloseBtn = $('nodeSearchCloseBtn'), keywordIpt = $('keywordIpt'), schResultBox = $('schResultBox'), schResultContent = $("schResultContent"), caNavContent = $('caNavContent'), chapterList = $isEle(caNavContent) ? caNavContent.getElements("a") : null;
if($isEle(nodeSearchBtn)){
	nodeSearchBtn.addEvent('click', function(){
		if(!$isEmpty(keywordIpt)){
			schResultContent.html('<div class="tc"><img src="/public/img/loading.gif"/></div>');
			caNavContent.out();
			schResultBox.into();
			new AjaxPost(nodeSearchBtn, {
				url: "/NodeDetailController/searchNodes",
				data: {
					courseId: null == currCourseId ? 0 : currCourseId,
					clazzId: currClazzId,
					searchKey: keywordIpt.val().trim(),
					currType: currContentType
				},
				callback: function(json){
					if(json.succ){
						schResultContent.html(json.html);
						schResultNum.txt(schResultContent.getElements("li").length);
					}
				}
			}).send();
		}else{
			caNavContent.into();
			schResultBox.out();
		}
	});
}
if($isEle(nodeSearchCloseBtn)){
	nodeSearchCloseBtn.addEvent('click', function(){
		keywordIpt.val('');
		nodeSearchCloseBtn.out();
		nodeSearchBtn.into();
		caNavContent.into();
		schResultBox.out();
	});
}
if($isEle(keywordIpt)){
	$autoRemind(keywordIpt);
	keywordIpt.addEvent("keyup", function(e){
		if(e.key === "enter"){
			this.blur();
			nodeSearchBtn.click();
		}
		if($isEmpty(keywordIpt)){
			nodeSearchCloseBtn.click();
		}else{
			nodeSearchCloseBtn.into();
			nodeSearchBtn.out();
		}
	});
}

// 拓展资源搜索
var searchFun = function(){
	if($isEle($("searchBtn"))){
		$("searchBtn").addEvent("click", function(){
			if($isEmpty($("searchInput"))){
				$testRemind($("searchInput"), "检索词不能为空", 1);
				setTimeout('$testRemind.hide()',3000);
			}else{
				new AjaxPost(this,{
					url: "/DetailPageController/jsonForSearchExpandResource",
					loading: true,
					data: {keyWord: $("searchInput").val().trim()},
					callback: function(json){
						if(json.succ){
							$("searchResult").html(''===json.html?"您输入的关键字当前没有结果对应，请试试其他关键字。":json.html);
							if(json.msg)
								Ibox.alert(json.msg);
						}
					}
				}).send();
			}
		})
	}
};
searchFun();
if($isEle($("searchBtn"))){
	$("searchBtn").click();
}


//=======================================================================

var addClick_nodeItem = function(btn){
	if($isEle(btn)){
//		btn.addEvent('click', function(){
//			new AjaxPost(this,{
//				url:'/NodeDetailController/jsonNodeDetail',
//				data:{
//					nextNodeId : btn.attr('data'),
//					currNodeId : $('nodeIdInput').val(),
//					clazzId : currClazzId,
//					contentType : currContentType,
//					anchor : 'courseChapterSelected'
//				},
//				callback: function(json){
//					if(json.succ){
//						if(json.html == 'NODE_LOCKED'){
//							Ibox.alert('<div class="f14 b">本课程要严格按照章节顺序学习，必须看完章节的学习内容，并完成测验，才能继续下一章节的学习。</div>');
//						}
//					}
//				}
//			}).send()
//		});
	}
};
var nodeItems = $$('.nodeItem');
if(nodeItems.length > 0){
	nodeItems.each(function(btn){
		//已改为使用链接方式
		//addClick_nodeItem(btn);
	});
}

//----------------------------------------------------------------------
//教学资源弹出菜单操作
var attachmentOptBox = $('attachmentOptBox'), attachmentOptDown = $("attachmentOptDown"), attachmentOptPreview = $("attachmentOptPreview"), attachmentOptRemark = $('attachmentOptRemark');
var addClick_resItem = function(btn){
	if($isEle(btn)){
		$powerFloat(btn, {
			position: '4-1',
			eventType: 'click',
			offsets: {x: 350, y: 0},
			target: attachmentOptBox,
			showCall: function(){
				var arrData = btn.attr("data").split("|");
				if(arrData[0] == "#"){
					attachmentOptDown.addClass("abs_out");
				}else{
					attachmentOptDown.removeClass("abs_out");
					attachmentOptDown.href = arrData[0];
				}
				if(arrData[1] == "#"){
					attachmentOptPreview.addClass("abs_out");
				}else{
					attachmentOptPreview.removeClass("abs_out");
					attachmentOptPreview.href = arrData[1];
				}
				attachmentOptRemark.attr("rel", arrData[2]);
			}
		});
	}
}
var addClick_resOptBox = function(){
	$$('.attachment_opt_a').addEvent('click', function(){
		setTimeout('attachmentOptBox.out();',200);
	});
	if ($isEle(attachmentOptRemark)){
		attachmentOptRemark.addEvent("click", function(){
			var ele = this, id = ele.attr("rel"), eleRemark = $("remark_" +id);
			if(id != '#'){
				Ibox.open({
					url:'<div class="p10"><div><input id="remarkEditInput" class="input pct95" type="text" value="'+ eleRemark.txt().trim() +'" /></div><div class="mt10 tc"><a id="saveRemarkEdit" class="bluebtn btn_s bdrad3" href="javascript:;">保存</a></div></div>',
					width: 320,
					title : "编辑备注",
					onShow: function(){
						$("saveRemarkEdit").addEvent("click", function(){
							var valRemark = $("remarkEditInput").val().trim();
							if (valRemark !== eleRemark.txt().trim()){
								new AjaxPost(this,{
									url:'/CourseController/editRemark',
									data:{
										akId : id,
										remarkVal: valRemark
									},
									callback: function(json){
										if(json.succ){
											eleRemark.txt(valRemark)
											Ibox.close();
										}
									}
								}).send();
							} else {
								Ibox.close();
							}
						});
					}
				});
			}
		})
	}
}
addClick_resOptBox();
$$('.attachmentItem').each(function(btn){
	addClick_resItem(btn);
});

//文件上传
var resSwfUploader, resUploaderDiv = $('resUploaderDiv');
window.onload = function() {
	if($isEle($('resourceUploader'))){
		resSwfUploader = new SWFUpload({
			flash_url : "/public/js/swfupload/swfupload.swf",
			upload_url: "/Application/swfUploadForClazzNodeResource",
			post_params: {"clazzId": currClazzId, "nodeId": chapterId, "createrId": currPersonId},
			file_types : "*.*",
			file_types_description : "All Files",
			file_queue_limit : 0,
			file_size_limit : "2000000000B",
			custom_settings : {
				progressTarget : "fsUploadProgress",
				cancelButtonId : "btnCancel"
			},
			debug: false,
			
			// Button settings
			button_image_url: "/public/js/swfupload/images/upload_res.jpg",
			button_placeholder_id: "resourceUploader",
			button_width: "80",
			button_height: "24",
			button_cursor: SWFUpload.CURSOR.HAND,
			button_window_mode: SWFUpload.WINDOW_MODE.OPAQUE,
			
			// The event handler functions are defined in handlers.js
			file_queued_handler : fileQueued,
			file_queue_error_handler : fileQueueError,
			file_dialog_complete_handler : fileDialogComplete,
			upload_start_handler : uploadStart,
			upload_progress_handler : uploadProgress,
			upload_error_handler : uploadError,
			upload_success_handler : uploadSuccess,
			upload_complete_handler : uploadComplete,
			queue_complete_handler : queueComplete	// Queue plugin event
		})
	}
};

var addNewUploadResItemAtNodeDetailPage = function(jsonStr){
	var json = JSON.parse(jsonStr), res;
	if(json.succ){
		res = JSON.parse(json.msg);
		var newResItem = new Element('div',{'id': 'resTr_'+res.akId, 'class': 'pt10 pb5 pt5 fix '}).html(
	  		'<div class="attachmet_box pb5 bdrad3 attachmentItem '+(res.playUrl == '#' ? '' : ' poi')+'" data="'+res.downloadUrl+'|'+res.playUrl+'|'+res.akId+'">'+
//	  			'<img class="ml10 pt5 mr5" src="'+res.fileIconPath+'"/>'+
	  			'<i class="i '+res.fileIconPath+'"></i>'+
				'<span class="inline_three pct43 pl2 pt2 pb2 "><span class="cblue f14">'+res.fileName+'</span></span>'+
				'<span class="inline_six pct10 g9 pt5 ml5">'+res.createTimeStr+'</span>'+
				'<span class="inline_six g9 pt5">观看次数：0</span>'+
				'<span class="inline_six g9 pt5">备注：<span id="remark_'+res.akId+'"></span></span>'+
			'</div>'	
			);
		newResItem.inject($('resListContainer'), 'bottom');
		var resItem = $('resTr_'+res.akId);
		resItem.getElements('.attachmentItem').each(function(btn){
			addClick_resItem(btn);
		});
		$("rscCount").txt(new Number($("rscCount").txt())+1);
		if($isEle($("noRscTipBox"))){
			$("noRscTipBox").out();
		}
	}
};
// 30min等待重新测验
var nodeContent = $isEle($('nodeContentInput')) ? $('nodeContentInput').val() : "";
var finishQuizWaitingTimer = function(){
	new AjaxPost(this, {
		url: "/NodeDetailController/finishQuizWaitingTimer",
		data: {
			clazzId : currClazzId,
			nodeId : chapterId
		},
		callback: function(json) {
			if (json.succ) {
				nodeContent = 'QUIZ_START';
				Ibox.alert('30分钟学习已过，你可以继续测验。');
			}else{
				setTimeout('finishQuizWaitingTimer()', 60 * 1000);
			}
		}
	}).send();
}
var initQuizWaitingTimer = function(){
	if(nodeContent == 'QUIZ_WAITING'){
		setTimeout('finishQuizWaitingTimer()', 30 * 60 * 1000);
	}
}
var bgColorPicker = $('bgColorPicker'), bgColorBox = $('bgColorBox');
if($isEle(bgColorPicker)){
	$powerFloat(bgColorPicker, {
		position: "3-2",
		offsets: {x: 0, y: 5
		},
		target: bgColorBox,
		showCall: function(){
		},
		hideCall: function(){
		}
	});
}
//内容区域章节内容背景色
var addClick_knowledgeBgColor = function(){
	var jsChangeCb = $$(".jsChangeCb");
	if (jsChangeCb.length > 0){
		jsChangeCb.removeEvents("click");
		jsChangeCb.addEvent("click", function(){
			var ele = this, eleTarget = this.getParent("#caContentBox"), bgColorVal = this.css('backgroundColor'), fontColorVal, colorType = ele.attr("data-type");
			if (colorType < 3){
				fontColorVal = '#555';
			} else {
				fontColorVal = '#fff';
			}
			eleTarget.css("backgroundColor", bgColorVal);
			$('contentDescriptionBox').css("backgroundColor", bgColorVal);
			eleTarget.css("color", fontColorVal);
			$('contentDescriptionBox').css("color", fontColorVal);
			new AjaxPost(ele,{
				url:'/CourseController/setKnowledgeColor',
				data:{
					knowledgeId : chapterId,
					bgColor: bgColorVal,
					fontColor: fontColorVal
				},
				callback : function(json) {
					if (json.succ) {
						$testRemind(ele,"已保存", 1);
						setTimeout('$testRemind.hide()',1000);
					}
				}
			}).send()
		})
	}
};
addClick_knowledgeBgColor();

$$(".jsForSearchTag").addEvent("click", function(){
	var searchInput = $("searchInput"), searchBtn = $("searchBtn");
	if($isEle(searchInput)){
		searchInput.val(this.txt().trim());
		searchBtn.click();
	}
});
var tchResBtn = $('tchResBtn'), resListContainer = $('resListContainer');
if($isEle(tchResBtn)){
	if(!($isEle(resListContainer))){
		tchResBtn.addClass('abs_out');
	}
}
var bindNodeVisitFun = function(eles){
	$$(".jsForVisitNode").removeEvents('click');
	$$(".jsForVisitNode").addEvent('click', function(){
		new AjaxPost(this, {
			url: '/NodeDetailController/visitQuoteNode',
			data: {
				nodeId: this.attr('nodeId'),
				clazzId: this.attr('clazzId')
			},
			callback: function(json){
				if(!json.succ){
					Ibox.alert(json.msg);
				}
			}
		}).send();
	});
};
bindNodeVisitFun();
var addBookMark = $("addBookMark");
if($isEle(addBookMark)){
	addBookMark.addEvent('click', function(){
		new AjaxPost(addBookMark,{
			url: '/PersonController/add2MyBookMark',
			data: {knowledgeId: addBookMark.attr("data")},
			callback: function(json){
				if(json.succ){
					addBookMark.txt(json.html);
				}
			}
		}).send();
	})
}