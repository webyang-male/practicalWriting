/* Demo Note:  This demo uses a FileProgress class that handles the UI for displaying the file name and percent complete.
The FileProgress class is not part of SWFUpload.
*/


/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
function fileQueued(file) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("等待上传...");
		progress.toggleCancel(true, this);
	} catch (ex) {
		this.debug(ex);
	}
}

function fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			alert("您上传的文件太多了。\n" + (message === 0 ? "您已经达到了上传的上限。" : "您可以选择" + (message > 1 ? "至多" + message + "文件。" : "一个文件。")));
			return;
		}

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			progress.setStatus("文件过大。");
			this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			progress.setStatus("不能上传空文件。");
			this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			progress.setStatus("文件类型不正确。");
			this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		default:
			if (file !== null) {
				progress.setStatus("未知的错误。");
			}
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
		$(this.customSettings.progressTarget).show();
	} catch (ex) {
        this.debug(ex);
    }
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		if (numFilesSelected > 0) {
			$(this.customSettings.cancelButtonId).show();
		}
		/* I want auto start the upload and I can do that here */
		this.startUpload();
	} catch (ex)  {
        this.debug(ex);
	}
}

function uploadStart(file) {
	$(this.customSettings.progressTarget).show();
	try {
		/* I don't want to do any file validation or anything,  I'll just update the UI and
		return true to indicate that the upload should start.
		It's important to update the UI here because in Linux no uploadProgress events are called. The best
		we can do is say we are uploading.
		 */
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("上传中...");
		progress.toggleCancel(true, this);
		
		if($('pageId') != null && ($('pageId').attr('data')=='EDIT_PAGE_2' || $('pageId').attr('data')=='EDIT_PAGE_3')) {
			hasChanged = true;
		}
	}
	catch (ex) {}
	return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		
		progress.setProgress(percent);
		progress.setStatus("已上传 " + percent+ "%");
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setComplete();
		progress.setStatus("完成。");
		progress.toggleCancel(false);
		
		if($('pageId') != null && ($('pageId').attr('data')=='EDIT_PAGE_2' || $('pageId').attr('data')=='EDIT_PAGE_3')) {
			hasChanged = false;
		}
		if($('pageId') != null && $('pageId').attr('data')=='CLAZZ_RES') {
			//$pageFresh();
			addNewUploadResItem(serverData, $('tchGeneralResList'));
		}
		if($('pageId') != null && $('pageId').attr('data')=='NODE_DETAIL_RES') {
			//$pageFresh();
			addNewUploadResItemAtNodeDetailPage(serverData);
		}
		//后台传递回来的内容
		if($("resList")){
			uploadResItem(serverData);
		}else{
			uploadAttachmentFile(serverData, file);
		}
	} catch (ex) {
		this.debug(ex);
	}
}

function showUploadSuccessInfo() {
	var progress = new FileProgress(file, this.customSettings.progressTarget);
	progress.setComplete();
	progress.setStatus("完成。");
	progress.toggleCancel(false);
}

function uploadError(file, errorCode, message) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			progress.setStatus("上传错误：" + message);
			this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			progress.setStatus("上传失败");
			this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			progress.setStatus("服务器错误：" + message);
			this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			progress.setStatus("服务器错误：" + message);
			this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			progress.setStatus("上传到达上限。");
			this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			progress.setStatus("验证失败，上传取消。");
			this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			// If there aren't any files left (they were all cancelled) disable the cancel button
			if (this.getStats().files_queued === 0) {
				$(this.customSettings.cancelButtonId).out();
			}
			progress.setStatus("已取消");
			progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			progress.setStatus("已停止");
			break;
		default:
			progress.setStatus("未知错误：" + errorCode);
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
		if($('pageId') != null && ($('pageId').attr('data')=='EDIT_PAGE_2' || $('pageId').attr('data')=='EDIT_PAGE_3')) {
			hasChanged = false;
		}
	} catch (ex) {
        this.debug(ex);
    }
}

function uploadComplete(file) {
	if($('newEditPage') != null){
		$('newEditPage').out();
	}
	if (this.getStats().files_queued === 0) {
		document.getElementById(this.customSettings.cancelButtonId).out();
	}
}

// This event comes from the Queue Plugin
function queueComplete(numFilesUploaded) {
	$(this.customSettings.cancelButtonId).out();
}

var formatSizeFn = function(bytes){
    var i = -1;
    do {
        bytes = bytes / 1024;
        i++;  
    } while (bytes > 99);
    return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
};

function uploadAttachmentFile(serverData, file){
	var fileListBox = $("fileListBox");
	if ($isEle(fileListBox)){
		var tbody = fileListBox.getElement("tbody");
		$testRemind.hide()
		var attrList = serverData.split("\|"), fid = attrList[1], canPlay = attrList[2], url = attrList[3], 
			isPpt = attrList[4], isVideo = attrList[5];
		new Element('tr', {'class':'fileRow'}).html(
			'<td class="vt tr tbl_btc4"><i class="i '+getFileIcon(file.name)+'"></i></td>'+
            '<td class="tbl_btc4">'+
                '<span class="dib bk c16 bk">'+file.name+'</span>'+
                '<p class="pl10 g9 mt5">'+
                	'<input type="checkbox" class="jsForHide" rel="'+fid+'"checked/>公开'+
            		'<span class="'+("true" === canPlay ? '' : 'abs_out')+'"><input type="checkbox" class="mr5 jsLiveChk" checked rel="'+ fid +'"/>在线观看</span>'+
            		'<input type="checkbox" class="ml10 jsForDownable" checked/>允许下载'+
            		'<a href="javascript:;" class="ml10 c16 jsForDelFile" rel="'+ fid +'">删除</a>'+
            		(isVideo=='false' ? '' : 
            		'<a href="javascript:;" class="ml10 c16 jsForEditHeadOffset" rel="'+ fid +'" data="0">设定起始时间</a>'+
            		'<div class="mt5">'+
            			'<a class="bluebtn btn_s bdrad18 editMedia" href="javascript:;" rel="' + fid + '" info="SYNC" style="font-size:12px; padding:4px 10px 4px 12px">编辑视频同步</a>'+
            			'<a class="bluebtn btn_s bdrad18 editMedia ml5" href="javascript:;" rel="' + fid + '" info="CUT" target="_blank" style="font-size:12px; padding:4px 10px 4px 12px">视频剪辑</a>'+
            		'</div>')+
            		(isPpt=='false' ? '' : 
            		'<div class="mt5">'+
    					'<a class="bluebtn btn_s bdrad18 editMedia" href="javascript:;" rel="' + fid + '" info="DUB_PPT" style="font-size:12px; padding:4px 10px 4px 12px">给ppt配音</a>'+
        			'</div>')+
                '</p>'+
            '</td>'+
            '<td class="tbl_btc4">'+ formatSizeFn(file.size) +'</td>'+
            '<td class="tbl_btc4"></td>'
		).inject(tbody, 'bottom');
		delFileUploadFun(tbody.getLast("tr").getElement(".jsForDelFile"));
		checkPlayFileUploadFun(tbody.getLast("tr").getElement(".jsLiveChk"));
		hideUploadedFileFun(tbody.getLast("tr").getElement(".jsForHide"));
		addClick_setVideoHeadOffset(tbody.getLast("tr").getElement(".jsForEditHeadOffset"));
		var localEditMediaBtnList = tbody.getLast("tr").getElements(".editMedia");
		if(localEditMediaBtnList.length > 0){
			localEditMediaBtnList.each(function(btn){
				addClick_editMedia(btn);
			});
		}
	}
}

function uploadResItem(serverData){
	var jsonHtml = serverData.substring(serverData.indexOf("html:\"")+6,serverData.length-3), resList = $("resList");
	var newItem = new Element('div').html(jsonHtml).getFirst();
	newItem.setStyle('');
	newItem.inject(resList, "top");
	addResItemOpt(newItem);
}

var delFileUploadFun = function(ele){
	if($isEle(ele)){
		ele.removeEvents("click");
		ele.addEvent("click", function(){
			Ibox.confirm('<span class="f16">您确定要删除？</span>', function(){
				new AjaxPost(ele, {
					url : "/CourseController/removeAttachmentKnowledge",
					data : { akId: ele.attr("rel") },
					callback : function(json) {
						if (json.succ) {
							Ibox.close();
							ele.getParent(".fileRow").dispose();
						}
					}
				}).send();
			},"",{title : "删除"});
		})
	}
};
var checkPlayFileUploadFun = function(ele){
	if($isEle(ele)){
		ele.removeEvents("click");
		ele.addEvent("click", function(){
			new AjaxPost(ele, {
				url: "/CourseController/canPlayAttachment",
				data: { akId: ele.attr("rel"), canPlay: ele.checked },
				callback : function(json) {
					if (json.succ) {
						$testRemind(ele, "保存成功", 1);
						setTimeout('$testRemind.hide()',2000);
					}
				}
			}).send();
		});
	}
};
var hideUploadedFileFun = function(ele){
	if($isEle(ele)){
		ele.removeEvents("click");
		ele.addEvent("click", function(){
			new AjaxPost(ele, {
				url: "/CourseController/hideUploadedFile",
				data: {courseId: $("courseIdInput").val(), akId: ele.attr("rel"), isHidden: !(ele.checked) },
				callback : function(json) {
					if (json.succ) {
						$testRemind(ele, "保存成功", 1);
						setTimeout('$testRemind.hide()',2000);
					}
				}
			}).send();
		});
	}
};
var setUploadedFileDownableFun = function(ele){
	if($isEle(ele)){
		ele.removeEvents("click");
		ele.addEvent("click", function(){
			new AjaxPost(ele, {
				url: "/CourseController/setUploadedFileDownable",
				data: { akId: ele.attr("rel"), isDownable: ele.checked },
				callback : function(json) {
					if (json.succ) {
						$testRemind(ele, "保存成功", 1);
						setTimeout('$testRemind.hide()',2000);
					}
				}
			}).send();
		});
	}
};

var getFileIcon = function(fileName){
	var videoFile = 'rmvb|3gp|mpg|mpeg|mov|wmv|asf|avi|mkv|mp4|flv|vob|f4v',
		audioFile = 'aac|ac3|aif|amr|ape|asf|flac|m4a|m4r|mka|mid|mmf|mpa|mpc|ogg|pcm|mp3|ra|tta|voc|wav|wv|wma',
		documentFile = 'doc|docx|ppt|pptx|pdf',
		pptFile = 'ppt|pptx',
		imageFile = 'jpg|jpeg|gif|png',
		archiveFile = 'zip|rar';
    var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '', iconStyle='i_f i_05';
    if(videoFile.split('|').contains(ext)){
    	iconStyle='i_f i_07';
    }else if(audioFile.split('|').contains(ext)){
    	iconStyle='i_f i_06';
    }else if(documentFile.split('|').contains(ext)){
    	iconStyle='i_f i_00';
    }else if(pptFile.split('|').contains(ext)){
    	iconStyle='i_f i_01';
    }else if(imageFile.split('|').contains(ext)){
    	iconStyle='i_f i_03';
    }else if(archiveFile.split('|').contains(ext)){
    	iconStyle='i_f i_04';
    }
    return iconStyle;
};
