//“跟知识点相关”的下拉框(trigger需要添加名为clazzId的attr，存放clazzId值)
var nodeDownListFun = function(ele){
	if($isEle(ele)){
		if($isArr($$(".class_dcnav_del"))&&$$(".class_dcnav_del").length>0){
			$$(".class_dcnav_del").addEvent("click", function(){
				this.getParent().getParent().dispose();
			});
		}
		ele.addEvent("click", function(){
			if (caNavItemBox.html().trim() != ''){
				caNavItemBox.hide().html("");
			} else {
				caNavItemBox.h(document.documentElement.clientHeight / 2 - 110);
				caNavItemBox.show().html('<div class="mt15 tc"><span class="loading mr10 vm"></span>正在加载，请稍后...</div>');
				var selectedIds = "";
				if($$(".class_dcnav_checked").length>0){
					$$(".class_dcnav_checked").each(function(item){
						selectedIds += item.attr("data")+",";
					});
				}
				new AjaxPost(this,{
					url: '/GroupController/jsonAddDiscussChapters',
					data: {
						clazzId:ele.attr("clazzId"), 
						selectedIds:selectedIds
					},
					callback: function(json){
						if (json.succ){
							caNavItemBox.html(json.html+'<div class="tc"><a id="closeItemBox" href="javascript:;" class="btn_s bkbtn auto">确定</a></div>');
							// 悬浮checkbox效果
							$$(".class_dcnav_list").each(function(item){
								item.addEvents({
									mouseover: function() {
										var checkBox = $(item.attr("rel"));
										if(!checkBox.isInto() && !checkBox.getElement('input').checked)
											checkBox.into();
									},
									mouseout: function() {
										var checkBox = $(item.attr("rel"));
										if(checkBox.isInto() && !checkBox.getElement('input').checked)
											checkBox.out();
									}
								});
							});
							$("closeItemBox").addEvent("click", function(){
								ele.click();
							});
							$$(".associateCnChk").addEvent("click", function(){
								var id = this.attr("data"), caNavCheekedBox = $("caNavCheekedBox");
								if(this.checked){
									new Element('div').attr("class", "mb10 mt10")
										.html('<span class="class_dcnav_checked" data="'+id+'">'+
												'<span class="mr10 f14">'+$("caNavNo_" +id).txt() +'</span>'+
												'<span>'+ $("caNavTitle_" +id).txt() +'</span>'+
												'<a id="caNavDel_'+ id +'" href="javascript:;" title="删除"><i class="i i_37"></i></a>'+
											'</span>')
										.inject(caNavCheekedBox,'bottom');
									$("caNavDel_"+ id).addEvent("click", function(){
										this.getParent().getParent().dispose();
									});
								}else{
									$("caNavDel_"+ id).click();
								}
							});
						}
					}
				}).send();
			}
		});
	}
};