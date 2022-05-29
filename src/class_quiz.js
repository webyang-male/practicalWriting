/*测验编辑部分*/
//editor初始化
var ue = null;
var $initUE = function(flag,width){
	Ext.destroy(editor);
	var editor=null,editor_container = $('editor-container_'+flag), editor_data = $('editor-data_'+flag);
	if(editor_container){
		var origin_data = editor_data.html();
		if(editor_container.attr('info') == 'init'){
			editor = Ext.create("ananas.Editor", {
				renderTo : 'editor-container_'+flag,
				width :width,
				ueditorConfig : {
					UEDITOR_HOME_URL : "/ananas/ueditor/",
					imageUrl:"/Application/uploadByUEditor",
					imagePath:"",
					initialContent:origin_data,
					zIndex : 98,
					langPath:"/ananas/ueditor/lang/",
					autoClearinitialContent:true,
					topOffset:205,
					toolbarTopOffset:200,
					autoHeightEnabled:false,
	                scrollEl : 'courseContent'
				}
			});
		}else{
			editor = Ext.create("ananas.Editor", {
				renderTo : 'editor-container_'+flag,
				width :width,
				ueditorConfig : {
					UEDITOR_HOME_URL : "/ananas/ueditor/",
					imageUrl:"/Application/uploadByUEditor",
					imagePath:"",
					initialContent:origin_data,
					zIndex : 98,
					langPath:"/ananas/ueditor/lang/",
					topOffset:205,
					toolbarTopOffset:200,					
					autoHeightEnabled:false,
	                scrollEl : 'courseContent'
				}
			});
		}
		ue = editor.getUEditor();
	}
};

//设置测验
var $showSetQuiz = function(ele){
	if ($isEle(ele)){
		ele.addEvent("click",function(){
			new AjaxPost(this, {
				url: '/QuestionController/getSetQuiz',
				data:{
					quizId: $("quizEdit").attr("quizId")
				},
				callback: function(json){
					if (json.succ){
						$("setQuizDiv").html(json.html);
						$("passScoreInput").addEvent("keydown", function(e){
							if(e.code != 8 && e.code != 46 && (e.code < 37 || e.code > 40) && (e.code < 48 || e.code > 57) && (e.code < 96 || e.code > 105)){
								e.preventDefault()
							};
						});
						$("setQuiz").addEvent("click",function(){ 
							new AjaxPost(this, {
								url: '/QuestionController/setQuiz',
								data:{
									quizId: $("quizEdit").attr("quizId"),
									isPublish:$("isPublish").checked,
									passScore:$("passScoreInput").val(),
									upPassStatus:$getRadioValue($$(".upPassStatus"))
								},
								callback: function(json){
									if (json.succ){
										$("setQuizDiv").html("");
									}
								}
							}).send()
						});
					}
				}
			}).send()
		});
	}
}
$showSetQuiz($("showSetQuiz"));

//添加试题
var $getAddQuestion= function(ele){
	if ($isEle(ele)){
		ele.addEvent("click",function(){
			new AjaxPost(ele, {
				url: '/QuestionController/getAddQuestion',
				data:{
					quizId: $("quizEdit").attr("quizId")
				},
				callback: function(json){
					if (json.succ){
						ele.addClass("abs_out");
						$("questionDiv").html(json.html);
						$initUE($("addQuestionDiv").attr("flag"),Number($("addQuestionDiv").attr("editorWidth")));
						$initAddQuestionJS();
					}
				}
			}).send()
		});
	}
}
$getAddQuestion($("getAddQuestion"));

//试题类型切换
var $switchType = function(){
	if($isArr($$(".switchType"))&&$$(".switchType").length>0){
		$$(".switchType").addEvent("click",function(){
			var ele=this;
	 		var questionType=ele.html();		
			$$(".switchType").each(function(item,n){
				item.swapClass("g9","g5");
			});
			ele.swapClass("g5","g9");
			var htmlStr="";
			if(questionType==="选择题"){
				for(var i=0;i<4;i++){
					htmlStr+='<li>'+
								'<input class="input pct80 optionInput" type="text"/>'+
								'<input class="ques_al_checkbox optionCheck" type="checkbox" name="optionCheck" '+(i==0?"checked":"")+'/>'+
							'</li>';
				}
				$("quesAnswerList").html(htmlStr);
				$("questionAnswer").html("");
			}else if(questionType==="判断题"){
				for(var i=0;i<2;i++){
					htmlStr+='<li>'+
								'<input class="input pct80 optionInput" type="text" value="'+(i==0?"正确":"错误")+'" disabled/>'+
								'<input class="ques_al_checkbox optionCheck" type="radio" name="optionCheck" '+(i==0?"checked":"")+'/>'+
							'</li>';
				}
				$("quesAnswerList").html(htmlStr);
				$("questionAnswer").html("");
			}else if(questionType==="简答题"){
				htmlStr+='<strong class="l ml5">答案：</strong>'+
						 '<div class="cell">'+
	               		 	'<textarea id="correctOption" class="pct80 input" rows="2"></textarea>'+
	            		 '</div>';
				$("questionAnswer").html(htmlStr);
				$("quesAnswerList").html("");
			}
		});
	}
} 

//试题分数设置
var $questionScore=function(){
	if($isEle($("addQuestion"))){
		$("adviceScore").addEvent("keydown", function(e){
			if(e.code != 8 && e.code != 46 && (e.code < 37 || e.code > 40) && (e.code < 48 || e.code > 57) && (e.code < 96 || e.code > 105)){
				e.preventDefault()
			};
		});
	}
}
 
//添加试题 
var $addQuestion= function(){
	if($isEle($("addQuestion"))){
		$("addQuestion").addEvent("click",function(){
			var quizId=$("quizEdit").attr("quizId");
			var courseId=$("quizEdit").attr("courseId");
			var subjectTitle=ue.getContent();
			var content=ue.getContent();
			var diffcultyLevel=$getRadioValue($$(".diffcultyLevelRadio"));
			var adviceScore=$("adviceScore").val();
			var subjectType;
			var correctOption="";
			var options=[],names=["A","B","C","D"];
			var i=0,j=0;
			if($isEle($("quesAnswerList"))){
				$("quesAnswerList").getElements("li").each(function(item,n){
					if(item.getElement(".optionCheck").checked){
						j++;
						correctOption+=(names[n]+",");
					}
					i++;
					options.push(item.getElement(".optionInput").val());
				});
			}
			if(i==0){//填空题
				subjectType=3;
				correctOption=$("correctOption").val();
				subjectTitle="";
			}else if(i==2){//判断题
				subjectType=2;
				content="";
			}else if(i==4){//选择题
				if(j==1){//单选题
					subjectType=1;
				}else if(j>1){//多选题
					subjectType=4;
				}else {
					return;
				}
				content="";
			}else{
				return;
			}
			new AjaxPost(this, {
				url: "/QuestionController/addQuestion",
				data: {
					quizId:quizId,
					"question.courseId":courseId,
					"question.subjectTitle":subjectTitle,
					"question.content":content, 
					"question.diffcultyLevel":diffcultyLevel,
					"question.adviceScore":adviceScore,
					"question.subjectType":subjectType,
					"question.correctOption":correctOption,
					options:options
				},
				callback: function(json){
					if(json.succ){
						$pageFresh();
					}
				}
			}).send();  
		});
	}
};

//取消添加试题
var $cancelAddQuestion = function(){
	$$(".cancelAddQuestion").addEvent("click",function(){
		$("getAddQuestion").removeClass("abs_out");
		$("questionDiv").html("");
	})
}

//编辑试题
var $getEditQuestion = function(){
	if($isEle($("getEditQuestion"))){
		$("getEditQuestion").addEvent("click", function(){
			var questionId = $("showQuestionDiv").attr("questionId");
			var indexOrder = $("showQuestionDiv").attr("indexOrder");
			new AjaxPost(this, {
				url: '/QuestionController/getEditQuestion',
				data: {
					questionId: questionId,
					indexOrder:indexOrder,
					courseId: $("quizEdit").attr("courseId")
				},
				callback: function(json){
					if(json.succ){
						$("questionDiv").html(json.html);
						$initUE($("editQuestionDiv").attr("flag"),Number($("editQuestionDiv").attr("editorWidth")));
						$initEditQuestionJS(); 
					}
				}
			}).send()
		});
	}
};

//编辑试题
var $editQuestion = function(){
	if($isEle($("editQuestion"))){
		$("editQuestion").addEvent("click",function(){
			var questionId=$("editQuestionDiv").attr("questionId");
			var quizId=$("quizEdit").attr("quizId");
			var courseId=$("quizEdit").attr("courseId");
			var subjectTitle=ue.getContent();
			var content=ue.getContent();
			var diffcultyLevel=$getRadioValue($$(".diffcultyLevelRadio"));
			var adviceScore=$("adviceScore").val();
			var subjectType;
			var correctOption="";
			var options=[],names=["A","B","C","D"];
			var i=0,j=0;
			if($isEle($("quesAnswerList"))){
				$("quesAnswerList").getElements("li").each(function(item,n){
					if(item.getElement(".optionCheck").checked){
						j++;
						correctOption+=(names[n]+",")
					}
					i++;
					options.push(item.getElement(".optionInput").val());
				});
			}
			if(i==0){//填空题
				subjectType=3;
				correctOption=$("correctOption").val();
				subjectTitle="";
			}else if(i==2){//判断题
				subjectType=2;
				content="";
			}else if(i==4){//选择题
				if(j==1){//单选题
					subjectType=1;
				}else if(j>1){//多选题
					subjectType=4;
				}else {
					return;
				}
				content="";
			}else{
				return;
			}
			new AjaxPost(this, {
				url: "/QuestionController/editQuestion",
				data: {
					"question.id":questionId,
					"question.courseId":courseId,
					"question.subjectTitle":subjectTitle,
					"question.content":content, 
					"question.diffcultyLevel":diffcultyLevel,
					"question.adviceScore":adviceScore,
					"question.subjectType":subjectType,
					"question.correctOption":correctOption,
					options:options
				},
				callback: function(json){
					if(json.succ){
						$("getShowQuestion_"+questionId).click(); 
					}
				}
			}).send();  
		});
	}
};
 
//取消编辑试题
var $cancelEditQuestion = function(){
	if($isEle($("cancelEditQuestion"))){ 
		$("cancelEditQuestion").addEvent("click", function(){
			var questionId = $("editQuestionDiv").attr("questionId");
			$("getShowQuestion_"+questionId).click(); 
		});
	}
};

//删除试题
var $delQuestion = function(){
	if($isEle($("delQuestion"))){
		$("delQuestion").addEvent("click", function(){
			var ele=this;
			var questionId = $("showQuestionDiv").attr("questionId");
			Ibox.confirm('<span class="f16">您确定要删除这道题目？</span>', function() {
				new AjaxPost(ele, {
					url: '/QuestionController/delQuestion',
					data:{
						questionId: questionId,
						courseId: $("quizEdit").attr("courseId"),
						quizId: $("quizEdit").attr("quizId")
					},
					callback: function(json){
						if(json.succ){
							$pageFresh(); 
						}
					}
				}).send()
			},"",{title : "删除本题"});
		});
	}
};
	
//使用本题
var $setQuestionPublish = function(){
	if($isEle($("setQuestionPublish"))){
		$("setQuestionPublish").addEvent("click", function(){
			var questionId = $("showQuestionDiv").attr("questionId");
			var isPublic=this.checked;
			new AjaxPost(this, {
				url: '/QuestionController/setQuestionPublish',
				data: {
					questionId: questionId,
					quizId: $("quizEdit").attr("quizId"),
					isPublic: isPublic
				},
				callback: function(json){
					if(json.succ){
						if(isPublish){
							$("getShowQuestion_"+questionId).attr("originClass","ques_c_wh");
						}else{
							$("getShowQuestion_"+questionId).attr("originClass","ques_c_gray");
						}
					}
				}
			}).send()
		});
	}
};

//查看试题
var $getShowQuestion = function(eles){
	if($isArr(eles)&&eles.length>0){
		eles.addEvent("click",function(){
			var ele=this;
			$$(".getShowQuestion").each(function(item,n){ 
				var originClass = item.attr("originClass");
				item.attr("class",originClass+" getShowQuestion");
			})
			ele.attr("class","ques_c_blue getShowQuestion");
			var questionId=ele.attr("questionId");
			new AjaxPost(ele, {
				url: '/QuestionController/getShowQuestion',
				data:{
					questionId: questionId,
					indexOrder:ele.html(),
					courseId: $("quizEdit").attr("courseId"),
					quizId: $("quizEdit").attr("quizId"),
					isMapping:$("quizEdit").attr("isMapping")
				},
				callback: function(json){
					if (json.succ){
						$("questionDiv").html(json.html);
						$initShowQuestionJS();
					}
				}
			}).send()
		});
	}
};
$getShowQuestion($$(".getShowQuestion"));

//查看试题时切换上一题
var $getShowPreQuestion = function(){
	if($isEle($("getShowPreQuestion"))){
		$("getShowPreQuestion").addEvent("click",function(){ 
			var questionId = $("showQuestionDiv").attr("questionId");
			var num;
			$$(".getShowQuestion").each(function(item,n){
				if(item.attr("questionId")==questionId){
					 num=n;
				 }
				if(num>0){
					$$(".getShowQuestion")[num-1].click();
				}
			}) 
		});
	}
};

//查看试题时切换下一题
var $getShowNextQuestion = function(){
	if($isEle($("getShowNextQuestion"))){
		$("getShowNextQuestion").addEvent("click",function(){ 
			var questionId = $("showQuestionDiv").attr("questionId");
			var num;
			$$(".getShowQuestion").each(function(item,n){
				 if(item.attr("questionId")==questionId){
					 num=n;
				 }
			}) 
			if(num<$$(".getShowQuestion").length-1){
				$$(".getShowQuestion")[num+1].click();
			}
		});
	}
};


//获取单选框值
var $getRadioValue = function(eles){
	var radioValue=null;
	eles.each(function(item,n){
		if(item.checked){
			radioValue=item.value;
		}
	});
	return radioValue;
}

//获取当前选中试题Id
var $getSelectQuestionId = function(){
	var questionId=0;
	if($$(".getShowQuestion").length>0){
		questionId=$$(".getShowQuestion")[$$(".getShowQuestion").length-1].attr("questionId");
		$$(".getShowQuestion").each(function(item,n){
			if(item.hasClass("ques_c_blue")){
				questionId=item.attr("questionId");
			}
		})
	}
	return questionId;
}

//添加试题时初始化
var $initAddQuestionJS=function(){ 
	$switchType();
	$questionScore();
	$addQuestion();
	$cancelAddQuestion();
};

//查看试题时初始化
var $initShowQuestionJS=function(){
	uParse(".ans-question");
	$getShowPreQuestion();
	$getShowNextQuestion();
	$getEditQuestion();
	$delQuestion();
	$setQuestionPublish();
	if($isEle($("getAddQuestion"))){
		$("getAddQuestion").removeClass("abs_out")
	}
};

//编辑试题时初始化
var $initEditQuestionJS=function(){
	$questionScore();
	$editQuestion();
	$cancelEditQuestion();
};

// 测试编辑页面初始化
var $initQuizPage = function(){
	$showSetQuiz($("showSetQuiz"));
	$getAddQuestion($("getAddQuestion"));
	$getShowQuestion($$(".getShowQuestion"));
};



/*测验展示部分*/   


/*用户展示部分*/
//获取当前选中试题Id
var $getPersonSelectQuestionId = function(eles){
	var questionId=0;
	if(eles.length>0){
		eles.each(function(item,n){
			if(item.hasClass("circle_blue")){
				questionId=item.attr("questionId");
			}
		})
	}
	return questionId;
}

//展开所有试题
var $getPersonShowQuestionAll = function(ele){
	if($isEle(ele)){
		ele.addEvent("click",function(){
			if(ele.checked){
				new AjaxPost(ele, {
					url: '/QuestionController/getPersonShowQuestionAll',
					data:{
						courseId:$("personQuizDiv").attr("courseId"),
						clazzId:$("personQuizDiv").attr("clazzId"),
						quizId: $("personQuizDiv").attr("quizId"),
						personType:$("personQuizDiv").attr("personType"),
						studentId:$("personQuizDiv").attr("studentId")
					},
					callback: function(json){
						if (json.succ){
							$("personQuestionDiv").html(json.html);
							uParse(".ans-question");
							$initPersonShowQuestionJS();
						}
					}
				}).send()
			}else{
				$("personQuestionDiv").html("");
				var selectQuestionId=$getPersonSelectQuestionId($$(".getPersonShowQuestion"));
				if(selectQuestionId>0){
					$("getPersonShowQuestion_"+selectQuestionId).click();
				}
			}
		});
	}
};

//试题切换
var $getPersonShowQuestion = function(eles){
	if($isArr(eles)&&eles.length>0){
		eles.addEvent("click",function(){
			var ele=this;
			$$(".getPersonShowQuestion").each(function(item,n){  
				item.attr("class",item.attr("originClass")+" c56 mr18 getPersonShowQuestion");
			})
			ele.attr("class","circle_blue c56 mr18 getPersonShowQuestion");
			if(!getPersonShowQuestionAll.checked){
				new AjaxPost(ele, {
					url: '/QuestionController/getPersonShowQuestion',
					data:{
						courseId:$("personQuizDiv").attr("courseId"),
						clazzId:$("personQuizDiv").attr("clazzId"),
						quizId:$("personQuizDiv").attr("quizId"),
						questionId: ele.attr("questionId"),
						personType:$("personQuizDiv").attr("personType"),
						studentId:$("personQuizDiv").attr("studentId"),
						indexOrder:ele.attr("indexOrder")
					},
					callback: function(json){
						if (json.succ){
							$("personQuestionDiv").html(json.html);
							uParse(".ans-question");
							$initPersonShowQuestionJS();
						}
					}
				}).send()
			}
		});
	}
};

//查看试题时有无上下题的显示
var $freshPersonPreAndNextStatus = function(pres,nexts,questions){
	if($isArr(pres)&&$isArr(nexts)&&pres.length>0&&nexts.length>0){
		var questionId = $("personShowQuestionDiv").attr("questionId");
		var num;
		questions.each(function(item,n){ 
			if(item.attr("questionId")==questionId){
				num=n;
			}
		})
		if(num<=0){
			pres.each(function(item,n){ 
				item.addClass("abs_out");
			})
		}
		if(num>=questions.length-1){
			nexts.each(function(item,n){ 
				item.addClass("abs_out");
			})
		}
	}
}

//查看试题时切换上一题
var $getPersonShowPreQuestion = function(eles){
	if($isArr(eles)&&eles.length>0){
		eles.addEvent("click",function(){ 
			var ele=this;
			var questionId = $("personShowQuestionDiv").attr("questionId"); 
			var num;
			$$(".getPersonShowQuestion").each(function(item,n){ 
				if(item.attr("questionId")==questionId){
					num=n;
				}
			})
			if(num>0){
				$$(".getPersonShowQuestion")[num-1].click();
			}
		});
	} 
};

//查看试题时切换下一题
var $getPersonShowNextQuestion = function(eles){
	if($isArr(eles)&&eles.length>0){
		eles.addEvent("click",function(){ 
			var ele=this;
			var questionId = $("personShowQuestionDiv").attr("questionId");
			var indexOrder=  $("personShowQuestionDiv").attr("indexOrder");
			var num;
			$$(".getPersonShowQuestion").each(function(item,n){ 
				if(item.attr("questionId")==questionId){
					num=n;
				}
			})
			if(num<$$(".getPersonShowQuestion").length-1){
				$$(".getPersonShowQuestion")[num+1].click();
			}
		});
	} 
};


/*学生答题部分*/

//学生开始测验
var $studentBeginQuiz = function(ele){
	if($isEle(ele)){
		ele.addEvent("click",function(){  
			new AjaxPost(ele, {
				url: '/QuestionController/studentBeginQuiz',
				data:{
					clazzId:$("personQuizDiv").attr("clazzId"),
					quizId: $("personQuizDiv").attr("quizId")
				},
				callback: function(json){
					if (json.succ){
						$pageFresh();
					}else{
						Ibox.alert('请先完成其他学习内容再进行测验。');
					}
//						$("node_"+$("personQuizDiv").attr("nodeId")).click();
//						$("courseChapterSelected").getElement(".nodeItem").click();
				}
			}).send()
		});
	}
};

//学生保存测验 实际已保存 仅提示用户已保存
var $studentSaveQuiz = function(ele){
	if($isEle(ele)){
		ele.addEvent("click",function(){  
			$testRemind(ele,"保存成功",1);
			setTimeout('$testRemind.hide()',2000)
		});
	}
};

//学生提交测验
var $studentSubmitQuiz = function(ele){
	if($isEle(ele)){
		ele.addEvent("click",function(){  
			new AjaxPost(ele, {
				url: '/QuestionController/studentSubmitQuiz',
				data:{
					clazzId:$("personQuizDiv").attr("clazzId"),
					quizId: $("personQuizDiv").attr("quizId")
				},
				callback: function(json){
					if (json.succ){
						if(json.html == 'QUIZ_WAITING'){
							Ibox.alert('测验未通过，等待30分钟后再次进行测验', function(){$pageFresh();}, null);
						}else{
							$pageFresh();
						}
//						if(json.html == 'QUIZ_START'){
//							Ibox.alert('测验未通过');
//						}else if(json.html == 'QUIZ_FINISH'){
//							Ibox.alert('恭喜你通过测验');
//						}else if(json.html == 'QUIZ_WAITING'){
//							Ibox.alert('测验未通过，等待30分钟后再次进行测验', function(){$pageFresh();}, null);
//						}
//						$("node_"+$("personQuizDiv").attr("nodeId")).click();
//						$("courseChapterSelected").getElement(".nodeItem").click();
					}
				}
			}).send()
		});
	}
};

var $studentReAnswerQuiz = function(ele){
	if($isEle(ele)){
		ele.addEvent("click",function(){  
			new AjaxPost(ele, {
				url: '/QuestionController/studentReAnswerQuiz',
				data:{
					clazzId:$("personQuizDiv").attr("clazzId"),
					quizId: $("personQuizDiv").attr("quizId")
				},
				callback: function(json){
					if (json.succ){
//						$("node_"+$("personQuizDiv").attr("nodeId")).click();
//						$("courseChapterSelected").getElement(".nodeItem").click();
						$pageFresh();
					}
				}
			}).send()
		});
	}
}

//学生回答试题
var $studentAnswerQuestion = function(ele,eles){
	//简答题
	if($isEle(ele)){
		ele.addEvent("blur",function(){
			var ele=this;
			var questionId = $("personShowQuestionDiv").attr("questionId");
			new AjaxPost(ele, {
				url: '/QuestionController/studentAnswerQuestion',
				data:{					
					clazzId:$("personQuizDiv").attr("clazzId"),
					courseId:$("personQuizDiv").attr("courseId"),
					quizId:$("personQuizDiv").attr("quizId"),
					questionId: questionId,
					answerContent:ele.val()
				},
				callback: function(json){
					if (json.succ){
						$("getPersonShowQuestion_"+questionId).attr("originClass","circle_yellow");
					}
				}
			}).send()
		});
	}
	//非简答题
	if($isArr(eles)&&eles.length>0){
		eles.addEvent("click",function(){
			var ele=this;
			var questionId = $("personShowQuestionDiv").attr("questionId");
			var answerContent="",names=["A","B","C","D"];
			eles.each(function(item,n){
				if(item.checked){
					answerContent+=(names[n]+",")
				}
			});
			new AjaxPost(ele, {
				url: '/QuestionController/studentAnswerQuestion',
				data:{					
					clazzId:$("personQuizDiv").attr("clazzId"),
					courseId:$("personQuizDiv").attr("courseId"),
					quizId:$("personQuizDiv").attr("quizId"),
					questionId: questionId,
					answerContent:answerContent
				},
				callback: function(json){
					if (json.succ){
						$("getPersonShowQuestion_"+questionId).attr("originClass","circle_yellow");
					}
				}
			}).send()
		});
	}
}

//查看试题时初始化
var $initPersonShowQuestionJS=function(){	
	$freshPersonPreAndNextStatus($$(".getPersonShowPreQuestion"),$$(".getPersonShowNextQuestion"),$$(".getPersonShowQuestion"));
	$getPersonShowPreQuestion($$(".getPersonShowPreQuestion"));
	$getPersonShowNextQuestion($$(".getPersonShowNextQuestion"));
	//学生答题部分
	$studentAnswerQuestion($("answerContent"),$$(".answerContent"));
};

// 初始化测验相关事件
var initQuizEventFn = function(){
	$getPersonShowQuestionAll($("getPersonShowQuestionAll"));
	$getPersonShowQuestion($$(".getPersonShowQuestion"));
	
	//默认显示第一题 初始化查看试题函数
	$initPersonShowQuestionJS();
	
	//学生开始保存提交测验函数
	$studentBeginQuiz($("studentBeginQuiz"));
	$studentSaveQuiz($("studentSaveQuiz"));
	$studentSubmitQuiz($("studentSubmitQuiz"));
	$studentReAnswerQuiz($("studentReAnswerQuiz"));
	//rebindTestRemind();
};
initQuizEventFn();


/*测验统计部分*/   

//查看试题统计
var $getPersonShowQuestionOptions = function(eles){
	if($isArr(eles)&&eles.length>0){
		eles.addEvent("click",function(){
			var ele=this;
			var questionId=ele.attr("questionId");
			new AjaxPost(ele, {
				url: '/QuestionController/getPersonShowQuestionOptions',
				data:{					
					courseId:$("personQuizStatisticsDiv").attr("courseId"),
					clazzId:$("personQuizStatisticsDiv").attr("clazzId"),
					quizId:$("personQuizStatisticsDiv").attr("quizId"),
					studentId:$("personQuizStatisticsDiv").attr("studentId"),
					questionId: questionId,
					indexOrder: ele.attr("indexOrder")
				},
				callback: function(json){
					if (json.succ){
						$("questionTR_"+questionId).html(json.html);
						$("closeQuestionDetail_"+questionId).addEvent("click",function(){
							$(this.attr("rel")).html("");
						});
					}
				}
			}).send()
		});
	}
}
$getPersonShowQuestionOptions($$(".getPersonShowQuestionOptions"));

