//保存讨论
var saveDiscussFun = function(ele, clazzId, articleId){
	ele.addEvent("click", function(){
		$autoRemind.hide();
		var disTitleInput = $("disTitleInput"), disContentArea = $("disContentArea");
		if ($isEmpty(disTitleInput)){
			$testRemind(disTitleInput, "写点东西吧，主题不能为空哦", 1)
		} else if ($isEmpty(disContentArea)){
			$testRemind(disContentArea, "写点东西吧，不能为空哦", 1)
		} else if (disTitleInput.val().trim().length>30){
			$testRemind(disTitleInput, "标题长度不能超过30位，请检查", 1)
		} else {
			var selectedIds = "", ajaxUrl = "discuss" == this.attr("info") ? "/GroupController/saveOrUpdateClazzDiscuss" : "/GroupController/saveOrUpdateClazzQA";
			$$(".class_dcnav_checked").each(function(item){
				selectedIds += item.attr("data")+",";
			});
			new AjaxPost(this,{
				url: ajaxUrl,
				data: {
					articleId: (null == articleId ? 0 : articleId),
					title: disTitleInput.val().trim(),
					content: disContentArea.val().trim(),
					clazzId: clazzId,
					selectedIds: selectedIds,
					currNodeId: ele.attr("knowledgeId"),
					reward: $isEle($("questionRewardInput"))?$("questionRewardInput").val():0
				},callback: function(json){
					if(json.succ){
						if(json.html == "REFRESH_CONTENT_TAB"){
							if($isEle($('contentTypeInput')) && $isFun(refreshTabContent)){
								refreshTabContent();
								Ibox.close();
							}else{
								$pageFresh();
							}
						}
					}
				}
			}).send();
		}
	});
};
var addOrEditDiscussFun = function(ele, initFun){
	if($isEle(ele)){
		var clazzId = ele.attr("clazzId"), articleId = ele.attr("data");
		ele.addEvent("click", function(){
			new AjaxPost(this, {
				url: "/GroupController/jsonAddDiscussArea",
				data: {
					clazzId: clazzId, 
					isQA: ele.attr("info") === "qa", 
					hasInitNode: $isEle($("initNodeId"))
				},
				callback: function(json){
					if(json.succ){
						Ibox.open({
							url: json.html,
							title: ele.attr("info")==="qa" ? '我要提问' : "发起讨论", 
							width: 596,
							onShow : function(){
								var disTitleInput = $("disTitleInput"), caNavItemBox = $("caNavItemBox");
								$autoRemind(disTitleInput);
								
								if(initFun){initFun();}
								nodeDownListFun($("addCnavBtn"));// 下拉链接知识章节
								saveDiscussFun($("saveAddDiscuss"), clazzId, articleId);// 保存讨论
								
//								$("cancelAddDiscussn").addEvent("click", function(){$autoRemind.hide();Ibox.close();});
							}
						});
					}
				}
			}).send();
		});
	}
};
// 编辑按钮
var addDiscussBtn = $("addDiscussBtn");
if($isEle(addDiscussBtn)){
	// 初始化原有数据
	var initSelectedNodeFun = function(){
		var nodesHtml = "", initNodeIdInput = $("initNodeId"), initNodeTitleInput = $("initNodeTitle");
		if($isEle(initNodeIdInput)){
			nodesHtml += '<div class="mt10 mb10">'+
				'<span class="class_dcnav_checked" data="'+initNodeIdInput.val()+'">'+
				'<span class="mr10 f14">'+ initNodeTitleInput.val() +'</span>'+
				($isEle($("initNodeId")) ? '' : '<a id="caNavDel_'+ initNodeIdInput.val() +'" class="class_dcnav_del" href="javascript:;" title="删除"><i class="i i_37"></i></a>')+
				'</span>'+
				'</div>';
			$("caNavCheekedBox").html(nodesHtml);
			$("caNavCheekedBox").into();
			$$(".class_dcnav_del").addEvent("click", function(){
				this.getParent().getParent().dispose();
			});
		}
	};
	if(addDiscussBtn.isInto()){
		addOrEditDiscussFun(addDiscussBtn, initSelectedNodeFun);
	}else{
		initSelectedNodeFun();
		nodeDownListFun($("addCnavBtn"));
		saveDiscussFun($("saveAddDiscuss"), $("saveAddDiscuss").attr("data"), 0);// 保存
	}
}
var editDiscussBtn = $("editDiscussBtn");
if($isEle(editDiscussBtn)){
	addOrEditDiscussFun(
		editDiscussBtn, function(){
			// 初始化原有数据
			var nodesHtml = "", articleId = editDiscussBtn.attr("data");
			$$(".currNode").each(function(item){
				nodesHtml += '<div class="mt10 mb10">'+
				'<span class="class_dcnav_checked" data="'+item.attr("data")+'">'+
				'<span class="mr10 f14">'+ item.txt() +'</span>'+
				($isEle($("initNodeId")) ? '' : '<a id="caNavDel_'+ item.attr("data") +'" class="class_dcnav_del" href="javascript:;" title="删除"><i class="i i_37"></i></a>')+
				'</span>'+
				'</div>';
			});
			$("caNavCheekedBox").html(nodesHtml);
			$("caNavCheekedBox").into();
			$$(".class_dcnav_del").addEvent("click", function(){
				this.getParent().getParent().dispose();
			});
			disTitleInput.val($("disTitle_"+articleId).txt());
			$("disContentArea").val($("disContent_"+articleId).txt());
			disTitleInput.focus();
		}
	);
}
//悬赏
if($isArr($$(".jsForReward"))){
	$$(".jsForReward").addEvent("click", function(){
		var ele = this;
		new AjaxPost(ele,{
			url: "/GroupController/awardQAReply",
			data:{replyId: ele.attr("data")}
		}).send();
	});
}
//加入精品库
if($isEle($("toggleDelicate"))){
	$("toggleDelicate").addEvent("click", function(){
		var ele = this, articleId = ele.attr("data");
		new AjaxPost(ele,{
			url: "/GroupController/saveIsDelicate",
			data:{articleId: ele.attr("data")},
			callback: function(json){
				if(json.succ){
					if(json.html === "true"){
						$("delicateMark").attr('class', 'tips_red2');
					}else{
						$("delicateMark").attr('class', 'tips_gray');
					}
				}
			}
		}).send();
	});
}
// 回复讨论
if($isEle($("addReply"))){
	$("addReply").addEvent("click", function(){
		$autoRemind.hide();
		var ele = this;
		if ($isEmpty(replyTextArea)){
			$testRemind(replyTextArea, "写点东西吧，不能为空哦", 1);
			return;
		}
		new AjaxPost(ele,{
			url: "/GroupController/addQAAndDiscussReply",
			data:{articleId: ele.attr("data"), content: replyTextArea.val().trim()},
			callback: function(json){
				if(!json.succ){
					Ibox.alert("该帖已被删除！");
				}
			}
		}).send();
	});
}
var replyTextArea = $("replyTextArea");
if($isEle(replyTextArea)){
	var originContent = replyTextArea.val();
	$("cancelReply").addEvent("click", function(){
		replyTextArea.val(originContent);
	});
}
// 切换tab
$tabSwitch($$(".jsForArticleTab"),{classAdd: "bluebtn",classRemove: "graybtn"});
$tabSwitch($$(".jsForArticleTypeTab"),{classAdd: "qa_tab_on",classRemove: "qa_tab_off",switchCall:function(){
		$$('.qa_tab_txt_on').each(function(item){
			item.swapClass('qa_tab_txt_on', 'qa_tab_txt_off');
			item.getNext('.tabCor').out();
		})
		this.getElement('div.tabTxt').swapClass('qa_tab_txt_off', 'qa_tab_txt_on');
		this.getElement('div.tabCor').into();
	}
});
// “更多”
var showMoreFun = function(showMoreBtn){
	if($isEle(showMoreBtn)){
		var tabBox = showMoreBtn.getParent('.jsForTabBox'), datas = tabBox.attr('data').split('|');
		showMoreBtn.addEvent("click", function(){
			new AjaxPost(showMoreBtn, {
				url: '/GroupController/jsonShowMoreList',
				data: {
					initNodeId: $isEle($("initNodeId")) ? $("initNodeId").val() : null,
					clazzId: datas[0],
					dtype: datas[1],
					pageNo: showMoreBtn.attr("data"),
					tabType: tabBox.attr("id"),
					orderKey: tabBox.getElement('.jsForArticleOrderSel').val()
				},
				callback: function(json){
					if(json.succ){
						var pageNo = new Number(json.pageNo), pageCount = new Number(tabBox.getElement('.jsForArticleCount').attr('pageCount'));
						showMoreBtn.dispose();
						tabBox.getElement('.qaItemsBox').appendHTML(json.html);
						bindNodeVisitFun();
						if(pageNo < pageCount){
							tabBox.appendHTML(
								'<div class="bgwh lh30 tc">'+
									'<a class="g5 b jsForShowMoreArticles" href="javascript:;" data="'+(pageNo+1)+'">更多<span class="ml5 char_corb">◆</span></a>'+
								'</div>');
							showMoreFun(tabBox.getElement('.jsForShowMoreArticles'));
						}else{
							tabBox.getElement('.qaItemsBox').getLast('.articleItem').removeClass('bbc');
						}
					}
				}
			}).send();
		});
	}
};
$$(".jsForShowMoreArticles").each(function(item){
	showMoreFun(item);
	item.click();
});
// 讨论答疑排序筛选器
$$(".jsForArticleOrderSel").addEvent('change', function(){
	var ele = this, tabBox = ele.getParent('.jsForTabBox'), datas = tabBox.attr('data').split('|');
	new AjaxPost(ele, {
		url: '/GroupController/switchOrderKey',
		data: {
			initNodeId: $isEle($("initNodeId")) ? $("initNodeId").val() : null,
			clazzId: datas[0],
			dtype: datas[1],
			tabType: tabBox.attr("id"),
			orderKey: ele.val()
		},
		callback: function(json){
			if(json.succ){
				var totalCount = new Number(json.html), counterEle = tabBox.getElement('.jsForArticleCount'), qaItemsBox = tabBox.getElement('.qaItemsBox');
				counterEle.txt(totalCount);
				counterEle.attr("pageCount", parseInt((totalCount - 1)/10) + 1);
				if(totalCount == 0){
					qaItemsBox.html('<div class="mt10 pt10 pb10 pl20 bgeb f14">亲，当前版块还没有任何人进行发表，等待您来发起哦~</div>');
				}else{
					qaItemsBox.html(
						'<div class="pb15 qaItemsBox">'+
							'<div class="lh30 tc">'+
								'<a class="g5 b jsForShowMoreArticles" href="javascript:;" data="1">更多<span class="ml5 char_corb">◆</span></a>'+
							'</div>'+
						'</div>');
					showMoreFun(tabBox.getElement('.jsForShowMoreArticles'));
					tabBox.getElement('.jsForShowMoreArticles').click();
				}
			}
		}
	}).send();
});

// 赞和倒彩的按钮
var addClick_answerBtn = function(btn){
	btn.addEvent('click', function(){
		var isBlueBtn = btn.getChildren('div')[0].hasClass('bluebtn'),
			blueBtnDivs = btn.getParent().getParent().getElements('.bluebtn');
		new AjaxPost(this,{
			url: "/GroupController/addReplyFollower",
			data:{
				replyId: btn.attr("data"), 
				personType: btn.attr('info')
			},callback : function(json){
				if(json.succ){
					if(blueBtnDivs.length > 0){
						blueBtnDivs.each(function(blueBtnDiv){
							blueBtnDiv.swapClass('bluebtn', 'graybtn');
							blueBtnDiv.getElement('#count').txt(parseInt(blueBtnDiv.getElement('#count').txt()) - 1);
						});
					}
					if(!isBlueBtn){
						btn.getChildren('div')[0].swapClass('graybtn', 'bluebtn');
						btn.getElement('#count').txt(parseInt(btn.getElement('#count').txt()) + 1);
					}
				}
			}
		}).send();
	});
};
var answerBtns = $$('.jsAnswer');
if(answerBtns.length > 0){
	answerBtns.each(function(btn){
		addClick_answerBtn(btn);
	});
}
// 删除
if($isArr($$(".jsForRemoveQAAndDiscuss"))){
	$$(".jsForRemoveQAAndDiscuss").addEvent("click", function(){
		var ele = this, datas = ele.attr('data').split('|');
		Ibox.confirm("确认删除吗？", function(){
			new AjaxPost(ele, {
				url: "/GroupController/removeQAAndDiscuss",
				data: {clazzId: datas[1], id: datas[0]},
				callback: function(json){
					if(json.succ){
						setTimeout('Ibox.alert("'+json.msg+'");', 20000);
						var counterEle = $("articleDiv_"+datas[0]).getParent('.jsForTabBox').getElement(".jsForArticleCount");
						counterEle.txt(counterEle.txt()-1);
						$("articleDiv_"+datas[0]).dispose();
					}
				}
			}).send();
		});
	});
}
var deleteDiscussBtn = $("deleteDiscussBtn");
if($isEle(deleteDiscussBtn)){
	deleteDiscussBtn.addEvent("click", function(){
		Ibox.confirm("确认删除本帖吗？", function(){
			var datas = deleteDiscussBtn.attr('data').split('|');
			new AjaxPost(deleteDiscussBtn, {
				url: "/GroupController/removeQAAndDiscuss",
				data: {clazzId: datas[1], id: datas[0]},
				callback: function(json){
					if(json.succ){
						if(json.succ){
							setTimeout('Ibox.alert("'+json.msg+'");', 20000);
							$("fullScreenTitle").click();
						}							
					}
				}
			}).send();
		});
	});
}
// 删除回复
if($isArr($$(".jsForRemoveClazz"))){
	$$(".jsForRemoveClazz").addEvent("click", function(){
		var ele = this, datas = ele.attr("data").split("|");
		Ibox.confirm("确认删除吗？", function(){
			new AjaxPost(ele, {
				url: "/GroupController/removeReply",
				data: {clazzId: datas[1], id: datas[0]},
				callback: function(json){
					if(!json.succ){
						Ibox.alert(json.msg);
					}else{
						$("replyItem_"+datas[0]).dispose();
						$("replyCount").txt($("replyCount").txt()-1);
						Ibox.close();
					}
				}
			}).send();
		});
	});
}

var addClick_viewTypeSelect = function(btn){
	if($isEle(btn)){
		btn.addEvent('change', function(){
			var selectedOpt = btn.val();
			console.log(selectedOpt);
			$$('.listItem').each(function(item){
				if(selectedOpt == '全部'){
					item.removeClass('abs_out');
				}else if(selectedOpt == '我发起的'){
					if(item.hasClass('myItem')){
						item.removeClass('abs_out');
					}else{
						item.addClass('abs_out');
					}
				}else if(selectedOpt == '我参与的'){
					if(item.hasClass('notMyItem')){
						item.removeClass('abs_out');
					}else{
						item.addClass('abs_out');
					}
				}else if(selectedOpt == '与章节相关'){
					if(item.hasClass('nodeLinkedItem')){
						item.removeClass('abs_out');
					}else{
						item.addClass('abs_out');
					}
				}else if(selectedOpt == '有答案'){
					if(item.hasClass('answeredItem')){
						item.removeClass('abs_out');
					}else{
						item.addClass('abs_out');
					}
				}else if(selectedOpt == '无答案'){
					if(item.hasClass('notAnsweredItem')){
						item.removeClass('abs_out');
					}else{
						item.addClass('abs_out');
					}
				}	
			});
		});
	}
}
addClick_viewTypeSelect($('viewTypeSelect'));