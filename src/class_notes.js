//写笔记
var writeNotesBtn = $("writeNotesBtn"), fnSaveNotes = function(ele, contentEle, isPublic, showCall){
	var notesTxt = contentEle.val().trim();
	$testRemind.hide();
	if ($isEmpty(contentEle)){
		$testRemind(contentEle, "写点东西吧，笔记内容不能为空哦", 1)
	} else {
		new AjaxPost(ele,{
			url: '/GroupController/saveClazzNote',
			data: {
				noteId: ele.attr("data"),
				content: notesTxt,
				isPublic: isPublic,
				clazzId: $("courseMainBox").attr("clazzId"),
				nodeId: $("courseChapterSelected").attr("data")
			},
			callback: function(json){
				if (json.succ == true){
					$("notesEditDate").txt(json.html);
					$testRemind(contentEle, "保存成功", 1);
					setTimeout('$testRemind.hide()',3000);
					if($isFun(showCall)){showCall()}
				}
			}
		}).send()
	}
};
if ($isEle(writeNotesBtn)){
	var courseNotesTextarea = $("courseNotesTextarea"), publicNotesChk = $("publicNotesChk"), notesOldChk, notesOldTxt;
	writeNotesBtn.addEvent("click", function(){
		this.getNext("div").show();
		if($("saveNotesBtn").attr("data") === '0'){
			notesOldChk=false;
			notesOldTxt='';
		}else{
			notesOldChk = $("publicNotesChk").checked;
			notesOldTxt = $("courseNotesTextarea").val();
		}
	});
	$("closeNotesBox").addEvent("click", function(){
		this.getParent(".jsNotesBox").hide();
	});
	
	$("saveNotesBtn").addEvent("click", function(){
			fnSaveNotes(this, $("courseNotesTextarea"), publicNotesChk.checked);
	});
}

//编辑笔记
var editNotesBtn = $("editNoteBtn");
if ($isEle(editNotesBtn)){
	var editNoteTextarea = $("editNoteTextarea"), publicNotesChk = $("EditNotePublicChk"), myNotesTxt = $("myNoteTxt"), myNotesTextarea = $("myNoteTextarea"), myNotesBox = $("myNoteBox"), notesOldChk, notesOldTxt;
	editNotesBtn.addEvent("click", function(){
		notesOldTxt = myNotesTxt.txt().trim();
		notesOldChk = publicNotesChk.checked;
		editNoteTextarea.val(notesOldTxt);
		myNotesTextarea.into();
		myNotesBox.out();
		this.out();
		this.getNext("div").into();
		$cursorToEnd(editNoteTextarea);
	});
	$("saveEditNoteBtn").addEvent("click", function(){
		if ((editNoteTextarea.val().trim() === notesOldTxt) && (notesOldChk === publicNotesChk.checked)){
			myNotesTextarea.out();
			myNotesBox.into();
			editNotesBtn.into();
			editNotesBtn.getNext("div").out();
		} else {
			fnSaveNotes(this, editNoteTextarea, publicNotesChk.checked, function(){
				myNotesTxt.html(editNoteTextarea.val().trim().replace(/\n/g,"<br>"));
				myNotesTextarea.out();
				myNotesBox.into();
				editNotesBtn.into();
				editNotesBtn.getNext("div").out();
			});
		}
	});
}

//笔记-查全部、隐藏,
var showAllNotesTxt = $$(".showAllNotesTxt"), hideAllNotesTxt = $$(".hideAllNotesTxt");
if(showAllNotesTxt.length > 0){
	showAllNotesTxt.addEvent("click", function(){
		var target = this.getParent(".notesPreviewBox");
		target.out();
		target.getNext('div').into();
	});
}
if(hideAllNotesTxt.length > 0){
	hideAllNotesTxt.addEvent("click", function(){
		var target = this.getParent(".notesFullyBox");
		target.out();
		target.getPrevious("div").into();
	});
}

//笔记-喜欢
var othersNotesHearts = $$(".othersNotesHearts");
if(othersNotesHearts.length > 0){
	othersNotesHearts.addEvent("click", function(){
		var ele = this, eleTitle = this.attr("title");
		if (eleTitle == '喜欢笔记'){
			new AjaxPost(ele,{
				url: '/GroupController/doFavorNoteArticle',
				data:{
					noteId : ele.attr("data"), clazzId: $("courseMainBox").attr("clazzId")
				},
				callback: function(json){
					if(json.succ == true){
						ele.attr("title","取消喜欢");
						ele.getElement("i").swapClass("i_34", "i_35");
						ele.getNext("span").getElement(".notesHeartsNums").txt(json.html);
					}
				}
			}).send()
		} else if(eleTitle == '取消喜欢'){
			new AjaxPost(ele,{
				url: '/GroupController/donotFavorNoteArticle',
				data:{
					noteId : ele.attr("data"), clazzId: $("courseMainBox").attr("clazzId")
				},
				callback: function(json){
					if(json.succ == true){
						ele.attr("title","喜欢笔记");
						ele.getElement("i").swapClass("i_35", "i_34");
						ele.getNext("span").getElement(".notesHeartsNums").txt(json.html);
					}
				}
			}).send()
		}
	});
}