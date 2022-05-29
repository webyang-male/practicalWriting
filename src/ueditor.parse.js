/**
 * 镜像中只需要修改这个文件中的host,其它不用动
 */
Ext.define('ananas.ServerHosts',{
	alternateClassName : 'ServerHosts',
	singleton : true,
	constructor : function(){
		var me = this;
        me.callParent(arguments);
		var domain = document.domain;
		var topDomain = "";
		try {
			topDomain = top.location.host;
		} catch(e) {
			try {
				topDomain = parent.location.host;
			} catch (e) {
				topDomain = document.domain;
			}
		}
		me.MASTER_HOST ='http://'+ topDomain;
		me.CLOUD_HOST = 'http://cloud.ananas.chaoxing.com';
		me.CS_HOST = 'http://cs.ananas.' + domain;
		me.FANYA_HOST = 'http://course.fanya.' + domain;
		me.PAN_HOST = 'http://pan.ananas.' + domain;
		me.CXLIVE_HOST = 'http://cxlive.' + domain;
		me.ERYA_TSK_HOST = 'http://erya.tsk.' + domain;
		me.QUESTIONNAIRE_HOST = 'http://surveyapp.fy.' + domain;
	}
});
var currentLanguage = (function (){
	function getcookie(objname){
		var arrstr = document.cookie.split("; ");
		for(var i = 0;i < arrstr.length;i ++){
			var temp = arrstr[i].split("=");
			if(temp[0] == objname){
				return unescape(temp[1]);
			}
		}
	}
	var en = getcookie('browserLocale');
	return en && en == 'en_US' ? "en" : "zh-cn"
})();
Ext.define('ananas.ModuleOutput',{
	alternateClassName : 'MO',
	singleton : true,
	
	baseUrl : '/ananas/',
	
	constructor : function(){
		var me = this;
        me.callParent(arguments);
		me.tpls = {};
		var lujing = "zt";
		var isEn = currentLanguage == "en" ? "job-icon-en" : "";
		var replaceComma = function(values) {
			values = values || '';
			return Ext.encode(values).replace(/\'/g, '`');
		}
		Ext.apply(me.tpls,{
			'insertbook-pad' : new Ext.XTemplate(
					'<div class="ans-book">',
					'<tpl if="readurl">',
						'<div class="ans-book-cover"><a href="{[this.createHref(values)]}" class="as-ref-link" ><img src="{coverurl}"/></a></div>',
					'</tpl>',
					
					'<tpl if="Ext.isEmpty(values.readurl)">',
						'<div class="ans-book-cover"><img src="{coverurl}"/></div>',
					'</tpl>',

					'<div class="ans-book-info">',
					'<div class="ans-ref-bookname">{bookname}</div>',
					
					'<tpl if="author"><div class="ans-ref-author">{author}</div></tpl>',
					'<tpl if="publishdate"><div class="ans-ref-publish">{publishdate}</div></tpl>',
					'</div>',
					{
						createHref: function(data) {
							var agent = navigator.userAgent || '';
							
							if (agent.indexOf('ChaoXingStudy') == -1) {
								return data.readurl + '&unitid=7719';
							}
							
							var readurl = data.readurl + '&unitid=7719&showpdg=true';
							readurl= readurl.replace("https", "http");
							return 'javascript: MO.openBook(\''+ data.bookname +'\', \'' + readurl + '\');';
						}
					}
				),
				'insertdoc-online-doc-pad' : new Ext.XTemplate(
						'<div class="ans-attach-ct">',
						'<iframe src="'+me.baseUrl+'modules/'+lujing+'/doc/index.html?v=2018-0126-1905" height="70px" class="ans-zt-attach-online" objectid="{objectid}" frameborder="0" scrolling="no"></iframe>',
						'</div>'
			),
			
			'insertdoc-online-pdf-pad' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="'+me.baseUrl+'modules/'+lujing+'/pdf/index.html?v=2020-0322-2201" height="70px" class="ans-zt-attach-online" objectid="{objectid}" frameborder="0" scrolling="no"></iframe>',
				'</div>'
			),
			'insertdoc-online-xls-pad' : new Ext.XTemplate(
					'<div class="ans-attach-ct">',
					'<iframe src="'+me.baseUrl+'modules/'+lujing+'/xls/index.html?v=2018-0126-1905" height="70px" class="ans-zt-attach-online" objectid="{objectid}" frameborder="0" scrolling="no"></iframe>',
					'</div>'
			),
		'insertdoc-online-ppt-pad' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="'+me.baseUrl+'modules/'+lujing+'/ppt/index.html?v=2018-0126-1905" height="70px" class="ans-zt-attach-online" objectid="{objectid}" frameborder="0" scrolling="no"></iframe>',
				'</div>'
		),
		'insertbook-online-pad' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '">任务点</div>',
				'</tpl>',
				'</div>',
				'<div class="ans-book">',
				'<tpl if="readurl">',
					'<div class="ans-book-cover"><a href="{[this.createHref(values)]}" class="as-ref-link" ><img src="{coverurl}"/></a></div>',
				'</tpl>',
				
				'<tpl if="Ext.isEmpty(values.readurl)">',
					'<div class="ans-book-cover"><img src="{coverurl}"/></div>',
				'</tpl>',

				'<div class="ans-book-info">',
				'<div class="ans-ref-bookname">{bookname}</div>',
				
				'<tpl if="author"><div class="ans-ref-author">{author}</div></tpl>',
				'<tpl if="publishdate"><div class="ans-ref-publish">{publishdate}</div></tpl>',
				'</div>',
				{
					createHref: function(data) {
						var agent = navigator.userAgent || '';
						
						if (agent.indexOf('ChaoXingStudy') == -1) {
							return data.readurl + '&unitid=7719';
						}
						
						var readurl = data.readurl + '&unitid=7719&showpdg=true';
						readurl= readurl.replace("https", "http");
						return 'javascript: MO.openBook(\''+ data.bookname +'\', \'' + readurl + '\');';
					}
				}
			),
			'insertbook' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="'+me.baseUrl+'modules/innerbook/simple.html?v=2018-0126-1905" ',
                'data = \'{[this.values(values)]}\'',
				'{[this.jobid(values)]} readurl="{readurl}" coverurl="{coverurl}" bookname="{bookname}" author="{author}" publisher="{publisher}" publishdate="{publishdate}" start="{start}" end="{end}" innerurl="{[this.url(values)]}" class="ans-attach-online ans-book-simple" frameborder="0" scrolling="no">',
				'</iframe>',
				'</div>',
				{
					url : function(values){
						var url = values.readurl.replace("realRead","innerurl");
						
						if(values.start){
							url+="&start="+values.start;
						}
						
						if(values.end){
							url+="&end="+values.end;
						}
						
						return url + "&unitid=7719";
					}
				},
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					}
				},
				{
					values : replaceComma
				}
			),
			
			'insertbook-online' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<div class="ans-book-title">{bookname}&nbsp;-&nbsp;{author}</div>',
				'<iframe src="'+me.baseUrl+'modules/innerbook/index.html?v=2021-1230-1905" ',
				'data = \'{[this.values(values)]}\'',
				'{[this.jobid(values)]} start="{start}" end="{end}" innerurl="{[this.url(values)]}" class="ans-attach-online ans-book" frameborder="0" scrolling="no">',
				'</iframe>',
				'</div>',
				{
					url : function(values){
						var url = values.readurl.replace("realRead","innerurl");
						
						if(values.start){
							url+="&start="+values.start;
						}
						
						if(values.end){
							url+="&end="+values.end;
						}
						
						return url + "&unitid=7719";
					}
				},
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					}
				},
				{
					values : replaceComma
				}
			),
			'insertvideo-online-pad' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '" style="margin-left:10px;">任务点</div>',
				'</tpl>',
				'<iframe src="'+me.baseUrl+'modules/video/index_wap.html?v=2018-0126-1905" class="ans-insertwork-online" style="height:180px;" objectid="{objectid}" jobid="{jobid}" fastforward="{fastforward}" switchwindow="{switchwindow}" vbegin="{vbegin}" vend="{vend}" mid="{mid}" level="{level}" frameborder="0" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>',
				'<tpl if="jobid">',
				'</tpl>',
				'</div>'
			),
			
			'insertvideo-pad' : new Ext.XTemplate(
				'<div class="ans-attach ans-attach-{[values.type.slice(1)]}">',		
					'<a target="_blank" href="'+me.baseUrl+'modules/zt/video/preview.html?objectid={objectid}" class="ans-attach-title">{name}</a>',
					'<span class="ans-attach-size">{hsize}</span>',
				'</div>'
			),
			'insertvideo-online' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
			
				'<iframe src="'+me.baseUrl+'modules/video/index.html?v=2022-0406-1945" ',
					'class="ans-attach-online ans-insertvideo-online" ',
					'data = \'{[this.values(values)]}\' ',
					'objectid="{objectid}" fastforward="{fastforward}" switchwindow="{switchwindow}" vbegin="{vbegin}" vend="{vend}" mid="{mid}" {[this.jobid(values)]} frameborder="0" scrolling="no" {[this.danmu(values)]} allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">',
				'</iframe>',
				'<div id="topicList"><div id="topicType"></div><div id="topicContent"></div></div>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					danmu : function(d){
						if(d.danmaku == 1){
							return 'style="height:610px;"';
						}
						return '';
					},
					values : replaceComma
				}
			),

			'richvideo' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',			
				'<iframe src="'+me.baseUrl+'modules/richvideo/index.html?v=2018-0126-1905" ',
					'class="ans-attach-online ans-insertvideo-online" ',
					'objectid="{objectid}" fastforward="{fastforward}" switchwindow="{switchwindow}" vbegin="{vbegin}" vend="{vend}" mid="{mid}" frameborder="0" scrolling="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">',
				'</iframe>',
				'</div>'
			),
			
			'insertvideo' : new Ext.XTemplate(
				'<span class="ans-attach ans-attach-{[values.type.slice(1)]}" data = \'{[this.values(values)]}\'>',
					'<a target="_blank" href="',
						me.baseUrl,
						'modules/video/single.html?objectid={objectid}&vbegin={vbegin}&vend={vend}&mid={mid}&fastforward={fastforward}&switchwindow={switchwindow}',
					'" class="ans-attach-title">{name}</a>',
					'<span class="ans-attach-size">{hsize}</span>',
				'</span>',
                {
                    values : replaceComma
                }
			),
			
			'insertdoc-online-ppt' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="' + me.baseUrl + 'modules/pdf/index.html?v=2022-0218-1135" {[this.jobid(values)]} data=\'{[this.values(values)]}\' class="ans-attach-online insertdoc-online-ppt" objectid="{objectid}" download="{download}" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>',
				'<div id="topicList"><div id="topicType"></div><div id="topicContent"></div></div>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					values : replaceComma
				}
			),
			
			'insertzhuanti' : new Ext.XTemplate(
					'<div class="ans-attach-ct">',
					'<iframe src="'+me.baseUrl+'modules/fxzt/index.html?v=2018-0126-1905" data = \'{[this.values(values)]}\'  frameborder="0" scrolling="no"  width="650" style="margin-left:0em;"></iframe>',
					'</div>',
					{
						values : replaceComma
					}
				),

			'insertcxjour' : new Ext.XTemplate(
					'<div class="ans-attach-ct">',
					'<iframe src="'+me.baseUrl+'modules/cxjour/index.html?v=2020-0417-1856" data = \'{[this.values(values)]}\'  frameborder="0" scrolling="no"  width="650" height="76"></iframe>',
					'</div>',
					{
						values : replaceComma
					}
				),
			'insertdoc-online-doc' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="' + me.baseUrl + 'modules/doc/index.html?v=2020-1030-1427" class="ans-attach-online insertdoc-online-doc" objectid="{objectid}" download="{download}" frameborder="0" scrolling="no"></iframe>',
				'<div id="topicList"><div id="topicType"></div><div id="topicContent"></div></div>',
				'</div>'
			),
			
			'insertdoc-online-pdf' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="' + me.baseUrl + 'modules/pdf/index.html?v=2022-0218-1135" {[this.jobid(values)]} data=\'{[this.values(values)]}\' class="ans-attach-online insertdoc-online-pdf" objectid="{objectid}" download="{download}" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>',
				'<div id="topicList"><div id="topicType"></div><div id="topicContent"></div></div>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					values : replaceComma
				}
			),
			
			'insertdoc-doc' : new Ext.XTemplate(
				'<span class="ans-attach ans-attach-doc">',		
					'<a target="_blank" href="' + ServerHosts.CS_HOST + '/download/{objectid}" class="ans-attach-title">{name}</a>',
					'<span class="ans-attach-size">{hsize}</span>',
				'</span>'
			),
			
			'insertdoc-pdf' : new Ext.XTemplate(
				'<span class="ans-attach ans-attach-pdf">',		
					'<a target="_blank" href="' + ServerHosts.CS_HOST + '/download/{objectid}" class="ans-attach-title">{name}</a>',
					'<span class="ans-attach-size">{hsize}</span>',
				'</span>'
			),
			
			'insertdoc-ppt' : new Ext.XTemplate(
				'<span class="ans-attach ans-attach-ppt">',		
					'<a target="_blank" href="' + ServerHosts.CS_HOST + '/download/{objectid}" class="ans-attach-title">{name}</a>',
					'<span class="ans-attach-size">{hsize}</span>',
				'</span>'
			),
			'downloadfile' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="' + me.baseUrl + 'modules/downloadfile/index-pc.html?v=2020-1113-1413"  data=\'{[this.values(values)]}\' module="downloadfile" class="downloadfile" objectid="{objectid}" frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
            'insertdoc-download' : new Ext.XTemplate(
                '<div class="ans-attach-ct">',
                '<iframe src="' + me.baseUrl + 'modules/downloadfile/index-pc.html?v=2020-1113-1413"  data=\'{[this.values(values)]}\' class="downloadfile" module="insertdoc" objectid="{objectid}" frameborder="0" scrolling="no" width="650" height="76"></iframe>',
                '</div>',
                {
                    values : replaceComma
                }
            ),
			'insertcxvideo' : new Ext.XTemplate(
				'<iframe src="'+me.baseUrl+'modules/cxvideo/index.html?v=2018-0126-1905" class="ans-attach-online" d={itemid} frameborder="0" scrolling="no"></iframe>'
			),
			
			'insertmooc' : new Ext.XTemplate(
				'<tpl if="type==\'knowledge\'">',
				'<span class="ans-mooc-link ans-knowledge">',
				'<a href="/nodedetailcontroller/visitnodedetail?clazzId=0&knowledgeId={id}#courseChapterSelected" target="_mooc">{label} {name}</a>',
				'</span>',
				'</tpl>',
				
				'<tpl if="type==\'discuss\'">',
				'<span class="ans-mooc-link ans-discuss">',
				'<a href="/groupcontroller/fullscreenqaqnddiscuss?articleId={id}" target="_mooc">{title}</a>',
				'</span>',
				'</tpl>',
				
				'<tpl if="type==\'qa\'">',
				'<span class="ans-mooc-link ans-qa">',
				'<a href="/groupcontroller/fullscreenqa?qaId={id}" target="_mooc">{title}</a>',
				'</span>',
				'</tpl>'
			),
			
			'ballchart' : new Ext.XTemplate(
				'<iframe src="/ananas/dialog/ballchart?kw={[this.encodekeyword(values)]}" class="ans-ballchart-module" frameborder="0" scrolling="no"></iframe>',
					{
						encodekeyword : function(d){
							return encodeURIComponent(d.keyword);
						}
					}
			),
						
			'erya' : new Ext.XTemplate(
				'<iframe src="'+me.baseUrl+'modules/erya/index.html?v=2018-0126-1905" class="ans-attach-online ans-insertvideo-online" videoid="{videoid}" courseid="{eryaid}" frameborder="0" scrolling="no"></iframe>'
			),
			
			'work' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',				
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',				
				'<iframe src="' + me.baseUrl + 'modules/work/index.html?v=2021-0927-1700&castscreen={[window.castscreen || 0]}" {[this.jobid(values)]} ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					values : replaceComma
				}
			),
			'insertlive' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="' + me.baseUrl + 'modules/live/index.html?v=2022-0426-1538" {[this.jobid(values)]} ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="120"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					values : replaceComma
				}
			),
				'insertread' : new Ext.XTemplate(
						'<div class="ans-attach-ct">',				
						'<tpl if="jobid">',
						'<div class="ans-job-icon ' + isEn + '"></div>',
						'</tpl>',				
						'<iframe src="' + me.baseUrl + 'modules/read/index.html?v=2020-0709-1844" {[this.jobid(values)]} ',
						'data = \'{[this.values(values)]}\'',
						' frameborder="0" scrolling="no" width="650"></iframe>',
						'</div>',
						{
							jobid : function(d){
								if(d.jobid){
									return 'jobid="'+d.jobid+'"';
								}
								return '';
							},
							values : replaceComma
						}
					),
					'insertreadV2' : new Ext.XTemplate(
						'<div class="ans-attach-ct">',				
						'<tpl if="jobid">',
						'<div class="ans-job-icon ' + isEn + '"></div>',
						'</tpl>',				
						'<iframe src="' + me.baseUrl + 'modules/read/indexV2.html?v=2018-0314-1726" {[this.jobid(values)]} ',
						'data = \'{[this.values(values)]}\'',
						' frameborder="0" scrolling="no" width="650"></iframe>',
						'</div>',
						{
							jobid : function(d){
								if(d.jobid){
									return 'jobid="'+d.jobid+'"';
								}
								return '';
							},
							values : replaceComma
						}
			  ),
			 'insertvote' : new Ext.XTemplate(
							'<div class="ans-attach-ct">',				
							'<tpl if="jobid">',
							'<div class="ans-job-icon ' + isEn + '"></div>',
							'</tpl>',	
							'<iframe src="' + me.baseUrl + 'modules/zt/vote/index-pc.html?v=2020-0523-0103" {[this.jobid(values)]} ',
							'data = \'{[this.values(values)]}\'',
							' frameborder="0" scrolling="no" width="650"></iframe>',
							'</div>',
		 	 				{
								jobid : function(d) {
									if (d.jobid) {
										return 'jobid="' + d.jobid + '"';
									}
									return '';
								},
								values : replaceComma,
						   }
			),
			'insertnote' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',				
				'<iframe src="' + me.baseUrl + 'modules/zt/note/index-pc.html?v=2021-1230-1542" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'insertchapter' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',				
				'<iframe src="' + me.baseUrl + 'modules/zt/chapter/index-pc.html?v=2021-1230-1418" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'insertsubject' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',				
				'<iframe src="' + me.baseUrl + 'modules/zt/subject/index-pc.html?v=2021-0302-1909" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'realplay': new Ext.XTemplate(
				'<iframe src="'+me.baseUrl+'modules/realplay/index.html?v=2018-0126-1905" ',
				'class="ans-realplay" ',
				'objectid="{objectid}" mid="{mid}" realplayurl="{realplayurl}" frameborder="0" scrolling="no">',
				'</iframe>'
			),

			'insertflash-online': new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="'+me.baseUrl+'modules/flash/index.html?v=2020-1117-2045" class="downloadfile" objectid="{objectid}" data=\'{[this.values(values)]}\' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),

			'insertflash': new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="'+me.baseUrl+'modules/flash/index.html?v=2020-1117-2045" class="downloadfile" objectid="{objectid}" data=\'{[this.values(values)]}\' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'insertaudio-online': new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="'+me.baseUrl+'modules/audio/index.html?v=2018-0620-1705" data = \'{[this.values(values)]}\' {[this.jobid(values)]} class="ans-attach-online ans-insertaudio" module="insertaudio" objectid="{objectid}"  fastforward="{fastforward}" name="{name}" frameborder="0" scrolling="no"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					}
				},
                {
                    values : replaceComma
                }
			),
		    'insertaudio-online-pad': new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="'+me.baseUrl+'modules/audio/index_wap.html?v=2018-0518-1206" {[this.jobid(values)]} class="ans-attach-online ans-insertaudio" objectid="{objectid}" name="{name}" frameborder="0" scrolling="no"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					}
				}
			 ),
			'insertvoice-online' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="' + me.baseUrl + 'modules/audio/index.html?v=2018-0620-1705" data = \'{[this.values(values)]}\' {[this.jobid(values)]} class="ans-attach-online ans-insertaudio" module="insertvoice" objectid="{objectid}" fastforward="{fastforward}" name="{name}" frameborder="0" scrolling="no"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					}
				},
                {
                    values : replaceComma
                }
			),
			'questionnaire' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',				
				'<iframe src="' + me.baseUrl + 'modules/questionnaire/index.html?v=2018-1227-1905" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'insertaddresource' : new Ext.XTemplate(
					'<a href="{[this.geturl(values)]}">{[this.geturl(values)]}',				
					'</a>',
					{
						geturl : function(values) {
							values = values || '';
							
							if(values.link.indexOf("http") != 0){
								values.link = "http://"+values.link;
							}
							
							if(values.link){
								values.link = values.link.replace(/[<>"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&;','"':'&quot;'}[c];});
							}
							
							if(values.link.indexOf("zhuanti.chaoxing.com/mobile/mooc/tocourse/") != -1){
								return values.link.replace("zhuanti.chaoxing.com/mobile/mooc/tocourse/", "mooc1.chaoxing.com/course/")+".html";
							}else if(values.link.indexOf("special.zhexuezj.cn/mobile/mooc/tocourse/") != -1){
								return values.link.replace("special.zhexuezj.cn/mobile/mooc/tocourse/", "mooc1.chaoxing.com/course/")+".html";
							} else if(values.link.indexOf("special.rhky.com/mobile/mooc/tocourse/") != -1){
								return values.link.replace("special.rhky.com/mobile/mooc/tocourse/", "mooc1.chaoxing.com/course/")+".html";
							}else{
								return values.link;
							}
						}
					}
				),
			'insertbbs' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',			
				'<iframe src="' + me.baseUrl + 'modules/insertbbs/index.html?v=2018-0821-1905&castscreen={[window.castscreen || 0]}" ',
				'data = \'{[this.values(values)]}\'',
				'module="insertbbs" frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'inserttopic' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',			
				'<iframe src="' + me.baseUrl + 'modules/insertbbs/index.html?v=2018-0821-1905&castscreen={[window.castscreen || 0]}" ',
				'data = \'{[this.values(values)]}\'',
				'module="inserttopic" frameborder="0" scrolling="no" width="650"  height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'insertmicroCourse' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',	
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="' + me.baseUrl + 'modules/zt/microCourse/index-pc.html?v=2020-0911-1822" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="500"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					values : replaceComma
				}
			),
			'insertlink' : new Ext.XTemplate(
					'<div class="ans-attach-ct" style="margin-bottom:10px;">',				
					'<iframe src="' + me.baseUrl + 'modules/zt/insertlink/index-pc.html?v=2019-0409-1150" ',
					'data = \'{[this.values(values)]}\'',
					' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
					'</div>',
					{
						values : replaceComma
					}
		   ),
			'resource3d' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',
				'<iframe src="' + me.baseUrl + 'modules/zt/resource3d/index-pc.html?v=2020-0911-1822" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="676" height="500"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'resourceQj' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',
				'<iframe src="' + me.baseUrl + 'modules/zt/resourceQj/index-pc.html?v=2021-0825-1800" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="676" height="500"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'insertclasstask' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',
				'<tpl if="jobid">',
				'<div class="ans-job-icon ' + isEn + '"></div>',
				'</tpl>',
				'<iframe src="' + me.baseUrl + 'modules/zt/classTask/index-pc.html?v=2021-0421-1749" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="676" height="120"></iframe>',
				'</div>',
				{
					jobid : function(d){
						if(d.jobid){
							return 'jobid="'+d.jobid+'"';
						}
						return '';
					},
					values : replaceComma
				}
			),
			'experience' : new Ext.XTemplate(
				'<div class="ans-attach-ct">',
				'<iframe src="' + me.baseUrl + 'modules/experience/index.html?v=2021-0917-1810"',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="80"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'sizhenglink' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',
				'<iframe src="' + me.baseUrl + 'modules/sizhenglink/index.html?version=3" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="676" height="500"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
			'iSearch' : new Ext.XTemplate(
				'<div class="ans-attach-ct" style="margin-bottom:10px;">',
				'<iframe src="' + me.baseUrl + 'modules/zt/iSearch/index-pc.html" ',
				'data = \'{[this.values(values)]}\'',
				' frameborder="0" scrolling="no" width="650" height="76"></iframe>',
				'</div>',
				{
					values : replaceComma
				}
			),
		});
	},
	
	getTpl : function (module, data, iframe){
		
		var tpl;
		if (data && data.jobid) {
			iframe.setAttribute('type', 'online');
		}
		if (module == 'insertdoc') {
			if (data.type == "" && data.name && data.name.toString().indexOf(".") != -1) {
				data.type = data.name.toString().substring(data.name.toString().indexOf("."))
			}
			var type = data.type.slice(1);

			type = type.toLowerCase();
			data.download = iframe.getAttribute("download");
			switch (type) {
				case 'pptx' :
				case 'ppt' :
					type = 'ppt';
					break;

				case 'docx' :
				case 'doc' :
				case 'xlsx' :
				case 'xls' :
					type = 'pdf';
					break;
			}
			try {
				if (iframe.getAttribute('type') == 'online') {
					tpl = 'insertdoc-online-' + type;
				} else {
					//tpl = 'insertdoc-' + type;
					tpl = 'insertdoc-download';
				}
			} catch (e) {
				tpl = 'insertdoc-online-' + type;
			}
			var agent = navigator.userAgent || '';
			if (agent.indexOf('chaoxing_wisdomclass') != -1) {
				tpl = 'insertdoc-download';
			}
		} else if (module == 'insertvideo') {
			try {
				if (iframe.getAttribute('type') == 'online') {
					tpl = 'insertvideo-online';
				} else {
					tpl = 'insertvideo';
				}
			} catch (e) {
				if (data.jobid) {
					tpl = 'insertvideo-online';
				} else {
					tpl = 'insertvideo';
				}
			}
			var agent = navigator.userAgent || '';
			if (agent.indexOf('chaoxing_wisdomclass') != -1) {
				tpl = tpl + "-pad";
			}
		} else if (module == 'insertbook') {
			// ie7 无权限
			try {
				if (iframe.getAttribute('type') == 'online') {
					tpl = 'insertbook-online';
				} else {
					tpl = 'insertbook';
				}
			} catch (e) {
				if (data.jobid) {
					tpl = 'insertbook-online';
				} else {
					tpl = 'insertbook';
				}
			}
			var agent = navigator.userAgent || '';
			if (agent.indexOf('chaoxing_wisdomclass') != -1) {
				tpl = tpl + "-pad";
			}
		} else if (module == 'insertaudio') {
			tpl = 'insertaudio-online';
			var agent = navigator.userAgent || '';
			if (agent.indexOf('chaoxing_wisdomclass') != -1) {
				tpl = tpl + "-pad";
			}
		} else if (module == 'insertvoice') {
			tpl = 'insertvoice-online';
		} else if (module == 'insertsubject') {
			tpl = 'insertsubject';
		} else if (module == 'insertflash') {
			try {
				if (iframe.getAttribute('type') == 'online') {
					tpl = 'insertflash-online';
				} else {
					tpl = 'insertflash';
				}
			} catch (e) {
				tpl = 'insertflash-online';
			}
		} else if (module == 'experience') {
			tpl = 'experience';
		}else {
			tpl = module;
		}
		
		return this.tpls[tpl];
	}
});

Ext.define('ananas.JobCounter',{
	alternateClassName : 'JC',
	singleton : true,
	
	mixins: {
        observable: 'Ext.util.Observable'
    },
	
	jobcounter : 0,
	
	attachments : null,
	
	constructor: function () {
		var me = this;
		me.mixins.observable.constructor.call(me);
		me.addEvents('completed');
    },
	
	completed : function(index){
		var me = this;
		
		if(me.jobcounter<=0 && !me.attachments){
			return;	
		}
		
		if(me.attachments[index].job){
			me.jobcounter--;
			me.attachments[index].job = false;
		
			//if(me.jobcounter==0){
				me.fireEvent('completed');
			//}
		}
	}
});

var $UE = {};
$UE.ajax = function() {
    var fnStr = 'XMLHttpRequest()';
    try {
        new ActiveXObject("Msxml2.XMLHTTP");
        fnStr = 'ActiveXObject(\'Msxml2.XMLHTTP\')';
    } catch (e) {
        try {
            new ActiveXObject("Microsoft.XMLHTTP");
            fnStr = 'ActiveXObject(\'Microsoft.XMLHTTP\')'
        } catch (e) {
        }
    }
    var creatAjaxRequest = new Function('return new ' + fnStr);

    function json2str(json) {
        var strArr = [];
        for (var i in json) {
            //忽略默认的几个参数
            if(i=="method" || i=="timeout" || i=="async") continue;
            //传递过来的对象和函数不在提交之列
            if (!((typeof json[i]).toLowerCase() == "function" || (typeof json[i]).toLowerCase() == "object")) {
                strArr.push( encodeURIComponent(i) + "="+encodeURIComponent(json[i]) );
            }
        }
        return strArr.join("&");

    }

    return {
		request:function(url, ajaxOptions) {
            var ajaxRequest = creatAjaxRequest(),
                //是否超时
                timeIsOut = false,
                //默认参数
                defaultAjaxOptions = {
                    method:"POST",
                    timeout:5000,
                    async:true,
                    data:{},//需要传递对象的话只能覆盖
                    onsuccess:function() {
                    },
                    onerror:function() {
                    }
                };

			if (typeof url === "object") {
				ajaxOptions = url;
				url = ajaxOptions.url;
			}
			if (!ajaxRequest || !url) return;
			var ajaxOpts = ajaxOptions ? Ext.apply(defaultAjaxOptions, ajaxOptions) : defaultAjaxOptions;

			var submitStr = json2str(ajaxOpts);  // { name:"Jim",city:"Beijing" } --> "name=Jim&city=Beijing"
			//如果用户直接通过data参数传递json对象过来，则也要将此json对象转化为字符串
			if (ajaxOpts.data){
                submitStr += (submitStr? "&":"") + json2str(ajaxOpts.data);
			}
            //超时检测
            var timerID = setTimeout(function() {
                if (ajaxRequest.readyState != 4) {
                    timeIsOut = true;
                    ajaxRequest.abort();
                    clearTimeout(timerID);
                }
            }, ajaxOpts.timeout);

			var method = ajaxOpts.method.toUpperCase();
            var str = url + (url.indexOf("?")==-1?"?":"&") + (method=="POST"?"":submitStr+ "&noCache=" + +new Date);
			ajaxRequest.open(method, str, ajaxOpts.async);
			ajaxRequest.onreadystatechange = function() {
				if (ajaxRequest.readyState == 4) {
					if (!timeIsOut && ajaxRequest.status == 200) {
						ajaxOpts.onsuccess(ajaxRequest);
					} else {
						ajaxOpts.onerror(ajaxRequest);
					}
				}
			};
			if (method == "POST") {
				ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajaxRequest.send(submitStr);
			} else {
				ajaxRequest.send(null);
			}
		}
	};
}();

//by zhanyi
function uParse(selector,opt,params){
	
	var unlock = function(){
		var p = window;	
		while(p){
		    try {
                if(p.onReadComplete){

                    if(typeof console == 'object')
                        console.log('call uParse to onReadComplete');

                    p.onReadComplete();
                    break;
                }
                if(p.parent==p){
                    break;
                }
                p = p.parent;
            } catch(e) {
		    	break;
            }
		}
	},jobcounter=0,attachments;
		
	window.AttachmentSetting = params;
	
	if(params && params.control && params.attachments){
		attachments = params.attachments;
		
		for(var i=0;i<attachments.length;i++){
			m = attachments[i];
			
			if(m.job===true){
				jobcounter++;
			}
		}
	}
	//console.log('jobcounter='+jobcounter);
	if(jobcounter==0){
		unlock();
	}else{
		JC.jobcounter=jobcounter;
		JC.attachments = attachments;
		JC.on('completed',unlock);
	}
	
    var ie = !!window.ActiveXObject,
        cssRule = ie ? function(key,style,doc){
            var indexList,index;
            doc = doc || document;
            if(doc.indexList){
                indexList = doc.indexList;
            }else{
                indexList = doc.indexList =  {};
            }
            var sheetStyle;
            if(!indexList[key]){
                if(style === undefined){
                    return '';
                }
                sheetStyle = doc.createStyleSheet('',index = doc.styleSheets.length);
                indexList[key] = index;
            }else{
                sheetStyle = doc.styleSheets[indexList[key]];
            }
            if(style === undefined){
                return sheetStyle.cssText;
            }
            sheetStyle.cssText = sheetStyle.cssText + '\n' + (style || '');
        } : function(key,style,doc){
            doc = doc || document;
            var head = doc.getElementsByTagName('head')[0],node;
            if(!(node = doc.getElementById(key))){
                if(style === undefined){
                    return '';
                }
                node = doc.createElement('style');
                node.id = key;
                head.appendChild(node);
            }
            if(style === undefined){
                return node.innerHTML;
            }
            if(style !== ''){
                node.innerHTML = node.innerHTML + '\n' + style;
            }else{
                head.removeChild(node);
            }
        },
	
        _each = function(obj, iterator, context) {
            if (obj == null) return;
            if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if(iterator.call(context, obj[i], i, obj) === false)
                        return false;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if(iterator.call(context, obj[key], key, obj) === false)
                            return false;
                    }
                }
            }
        },
		
        inArray = function(arr,item){
            var index = -1;
            _each(arr,function(v,i){
                if(v === item){
                    index = i;
                    return false;
                }
            });
            return index;
        },
        pushItem = function(arr,item){
            if(inArray(arr,item)==-1){
                arr.push(item);
            }
        },
        loadFile = function () {
            var tmpList = [];
            function getItem(doc,obj){
                try{
                    for(var i= 0,ci;ci=tmpList[i++];){
                        if(ci.doc === doc && ci.url == (obj.src || obj.href)){
                            return ci;
                        }
                    }
                }catch(e){
                    return null;
                }

            }
            return function (doc, obj, fn) {
                var item = getItem(doc,obj);
                if (item) {
                    if(item.ready){
                        fn && fn();
                    }else{
                        item.funs.push(fn);
                    }
                    return;
                }
                tmpList.push({
                    doc:doc,
                    url:obj.src||obj.href,
                    funs:[fn]
                });
                if (!doc.body) {
                    var html = [];
                    for(var p in obj){
                        if(p == 'tag')continue;
                        html.push(p + '="' + obj[p] + '"');
                    }
                    doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></'+obj.tag+'>');
                    return;
                }
                if (obj.id && doc.getElementById(obj.id)) {
                    return;
                }
                var element = doc.createElement(obj.tag);
                delete obj.tag;
                for (var p in obj) {
                    element.setAttribute(p, obj[p]);
                }
                element.onload = element.onreadystatechange = function () {
                    if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                        item = getItem(doc,obj);
                        if (item.funs.length > 0) {
                            item.ready = 1;
                            for (var fi; fi = item.funs.pop();) {
                                fi();
                            }
                        }
                        element.onload = element.onreadystatechange = null;
                    }
                };
                element.onerror = function(){
                    throw Error('The load '+(obj.href||obj.src)+' fails,check the url');
                };
                doc.getElementsByTagName("head")[0].appendChild(element);
            };
        }();

    var defaultOption = {
        liiconpath : 'http://bs.baidu.com/listicon/',
        listDefaultPaddingLeft : '20',
        'highlightJsUrl':'',
        'highlightCssUrl':'',
        customRule:function(content){}
    };
    if(opt){
        for(var p in opt){
            defaultOption[p] = opt[p];
        }
    }
	
    (function(){
        var contents;
        if(document.querySelectorAll){
            contents = document.querySelectorAll(selector);
        }else{
            if(/^#/.test(selector)){
                contents = [document.getElementById(selector.replace(/^#/,''))];
            }else if(/^\./.test(selector)){
                var contents = [];
                _each(document.getElementsByTagName('*'),function(node){
                    if(node.className && new RegExp('\\b' + selector.replace(/^\./,'') + '\\b','i').test(node.className)){
                        contents.push(node);
                    }
                });
            }else{
                contents = document.getElementsByTagName(selector);
            }
        }
        _each(contents,function(content){
            if(content.tagName.toLowerCase() == 'textarea'){
                var tmpNode = document.createElement('div');
                if(/^#/.test(selector)){
                    tmpNode.id = selector.replace(/^#/,'');
                }else if(/^\./.test(selector)){
                    tmpNode.className = selector.replace(/^\./,'');
                }
                content.parentNode.insertBefore(tmpNode,content);
                tmpNode.innerHTML = content.value;
                content.parentNode.removeChild(content);
                content = tmpNode;
            }

            function fillNode(nodes){
                _each(nodes,function(node){
                    if(!node.firstChild){
                        node.innerHTML = '&nbsp;';
                    }
                });
            }
			
			function replaceModule(iframes){
				
				var items = [];
				for(var i=0,len = iframes.length;i<len;i++){					
					items.push(iframes[i]);
				}
				 
				for(var i=0,len = items.length;i<len;i++){
					var iframe = items[i],
						module = iframe.getAttribute('module'),
						data = Ext.decode(iframe.getAttribute("data")),
						tpl = MO.getTpl(module,data,iframe);

					var topType = "Course";
					try {
						topType = top.dtype;
					} catch(e){
						topType = "Course";
					}
					if(tpl && !((topType =="ZT" || topType =="HB" || topType =="MAG") && module == 'insertbbs')){
						tpl.insertBefore(iframe,data);
						iframe.parentNode.removeChild(iframe);
					}
					 if( module == 'insertbbs' && (topType =="ZT" || topType =="HB" || topType =="MAG") ){
						 iframe.parentNode.removeChild(iframe);
					}
				}
			}
			
			function addHandler(nodes){				
				_each(nodes,function(node){					
					if(node.className =='cmd-autoblockquote'){
					
						var wrapper = Ext.fly(node).wrap({'class':'blockquote-wrap'}),
							initHtml = node.innerHTML,
							initText = Ext.String.ellipsis(node.childNodes[0].textContent?node.childNodes[0].textContent:(node.childNodes[0].innerText?node.childNodes[0].innerText:''),100); 
							handler = Ext.DomHelper.append(wrapper,{
								cls :'ans-blockquote-handle',
								tag : 'a',
								href : '#',
								html:'&nbsp;'
							});
						
						var el = Ext.get(handler),
							cls = 'open';
							
						el.targetEl = Ext.get(node);
						
						el.on('click',function(e){
							if(e)
								e.preventDefault();
								
							wrapper.toggleCls(cls);
							
							if(wrapper.hasCls(cls)){
								el.targetEl.setHTML(initHtml);
							}else{
								el.targetEl.setHTML(initText);
							}
						});
													
						el.targetEl.setHTML(initText);
					}
                });
			}
			
			function addTray(nodes){
				var agent = navigator.userAgent || '';
				if(agent.indexOf('chaoxing_wisdomclass') != -1){
					var clearSize= {style:{width:'',height:''},width:undefined,height:undefined,float:undefined} ;
					for(var i=0,len = images.length;i<len;i++){					
						Ext.fly(nodes[i]).set(clearSize);
					}
					return;
				}
				
				 _each(nodes,function(node){
					if(!node.title)
						return;
					
					var f = node.style.float,
						config = {tag:'span','cls':'ans-img-wrap'};
					
					if(f){
						config.cls = "ans-img-wrap float-"+f;						
						node.style.float = '';
					}
					
					var wrapper = Ext.fly(node).wrap(config);
					
					/*
					Ext.DomHelper.append(wrapper,{
						cls :'ans-img-title',
						tag : 'span',
						html:node.title
					});
					*/
				});
			}
			
			function showTips(content) {
				function Tips(ele) {
					this.oZlayerRe = document.createElement('span');
					this.oZlayerArrow = document.createElement('span');
					this.oZlayerAbs = this.oZlayerArrow.cloneNode(false);
					
					this.oZlayerRe.style.cssText  = 'position:absolute; display:none; vertical-align:top; background-color:#fff; display:none; top: 2px;z-Index:9999;';
					this.oZlayerArrow.style.cssText = 'display:inline-block; position:absolute; left:-115px; top:22px; padding:10px; border:1px #ccc solid; border-radius:3px; background-color:#fff; font-size:12px; line-height:18px; color:#333;text-align:left;min-width:160px;max-width:600px;';
					this.oZlayerAbs.style.cssText = 'display:inline-block; position:absolute; left:-75px; top:14px; width:180px; height:9px; background:url(/ananas/css/arrow.gif) center 0 no-repeat; z-index:9;';
				
					this.oZlayerRe.appendChild(this.oZlayerArrow);
					this.oZlayerRe.appendChild(this.oZlayerAbs);
					this._init(ele);
				}
				
				Tips.prototype = {
					show : function() {
						this.oZlayerRe.style['display'] = 'inline-block';
					},
					hide : function() {
						this.oZlayerRe.style['display'] = 'none';
					},
					setContent : function(con) {
						this.oZlayerArrow.innerHTML = con;
					},
					getContent : function() {
						return this.oZlayerArrow.innerHTML;
					}, 
					_init : function(ele) {
						ele.appendChild(this.oZlayerRe);
					}
				};
				
	    		_each(content.getElementsByTagName('a'), function(node){
	    			var type = node.getAttribute('type');
	    			var data = node.getAttribute('data');
	    			var href = node.getAttribute('href');
	    			if (href && href.indexOf("cs.ananas.chaoxing.com/download") != -1) {
	    				var objId = href.split("?")[0].split("download/")[1];
						if (objId) {
							$UE.ajax.request('/ananas/status/' + data, {
								method: "GET",
								timeout: 5000,
								async: true,
								onsuccess: function (response) {
									var oData = eval('(' + response.responseText + ')');
									if (oData.download) {
										href = oData.download;
										if (top.location.protocol.indexOf("https:") != -1 && href.indexOf("http:") != -1) {
											href = href.replace("http:", "https:");
										} else if (top.location.protocol.indexOf("http:") != -1 && href.indexOf("https:") != -1) {
											href = href.replace("https:", "http:");
										}
									}
									node.setAttribute("href", href);
								}
							})
						} else {
							if (href.indexOf("http:") != -1 && top.location.protocol.indexOf("https") != -1) {
								href = href.replace("cs.ananas.chaoxing.com","cs-ans.chaoxing.com");
								href = href.replace("http:","https:");
								node.setAttribute("href", href);
							}
						}
					}
	    			if (type && data) {
	    				node.style['position'] = 'relative';
	    				node.innerHTML = '<span style="color:#00f;">' + node.innerHTML + '</span>';
		    			node.tips = new Tips(node);
		    			
		    			var filetype = node.title.substring(node.title.lastIndexOf('.')).toLocaleLowerCase();
		    			
		    			if ('.txt' == filetype) {
		    				node.href = "javascript:void(0)";
		    			}
		    			
		    			node.onmouseover = function() {
		    				if (!node.tips.getContent()) {
		    					if (type == 'text') {
//		    						node.tips.setContent(data);
//		    						node.tips.show();
		    						node.setAttribute("title",data);
		    					} else if (type == 'resource' && data) {
		    						$UE.ajax.request('/ananas/status/' + data, {
		    						    method:"GET",
	    			                    timeout:5000,
	    			                    async:true,
	    			                    onsuccess:function(response) {
	    			                    	var oData = eval('(' + response.responseText + ')');
	    			                    	var src = oData.screenshot || oData.download;
	    			                    	var aAudio = [".aac", ".ac3", ".aif", ".amr", ".ape", ".flac", ".m4a", ".m4r", ".mka", ".mid", ".mmf", ".mpa", ".mpc", ".ogg", ".pcm",
	    			                    	  			".mp3", ".ra", ".tta", ".voc", ".wav", ".wv", ".wma"];
	    			                    	var aImg = [".gif", ".jpeg", ".png", ".jpg", ".bmp"];
	    			                    	
	    			                    	
	    			                    	if ('.txt' == filetype) {
	    			          
	    			                    		$UE.ajax.request('/ananas/file/read?key=' + oData.key + '&url=' + oData.download, {
	    			    						    method:"GET",
	    		    			                    timeout: 1000 * 60 * 5,
	    		    			                    async:true,
	    		    			                    onsuccess: function(txtresponse) {
	    		    			                    	var oTxtData = eval('(' + txtresponse.responseText + ')');
	    		    			                    	node.tips.setContent('<div style="height :400px; width:600px; overflow-x: hidden;overflow-y: auto;background: #fff;word-wrap:break-word; word-break:break-all; white-space:nowrap;">' + oTxtData.con + '</div>');
	    		    			                    },
	    		    			                    onerror: function() {}
	    			                    		});
	    			                    		return;
	    			                    	} 
	    			                    	
	    			                    	var isAudio = false, isImg = false;
	    			                    	
	    			                    	for (var i = 0, len = aAudio.length; i < len; i++) {
	    			                    		if (aImg[i] == filetype) {
	    			                    			isImg = true;
	    			                    			break;
	    			                    		}
	    			                    	}
	    			                    	
	    			                    	for (var i = 0, len = aAudio.length; i < len; i++) {
	    			                    		if (aAudio[i] == filetype) {
	    			                    			isAudio = true;
	    			                    			break;
	    			                    		}
	    			                    	}
	    			                    	
	    			                    	var videoBg = '';
	    			                    	
	    			                    	if (!isImg) {
	    			                    		if (isAudio) {
		    			                    		src = '/ananas/css/music.png';
		    			                    	} else {
		    			                    		videoBg = '/ananas/css/video.png';
		    			                    	}
	    			                    	}
	    			                    	
	    			                    	var sImg = '';
	    			                    	
	    			                    	if (videoBg) {
	    			                    		sVideoBg = '<img src="' + videoBg + '" style="width:270px;margin:0; padding:0; float:left;display:inline-block;" />';
	    			                    		sImg = '<img src="' + src + '" style="margin: 0px; padding: 0px; float: left; width: 270px; height:180px; position: absolute; left: 10px; top: 9px;" />';
	    			                    		sImg = '<div style="clear:both;">' + sVideoBg + sImg + '</div>';
	    			                    	} else {
	    			                    		sImg = '<img src="' + src + '" style="margin:0; padding:0; float:left;width:270px;" />';
	    			                    	}
	    			                    	
	    			                    	node.tips.setContent(sImg);
	    			                    	node.tips.show();
	    			                    },
	    			                    onerror:function() {
	    			                    }
		    						});
		    					}
		    				} else {
		    					node.tips.show();
		    				}
		    			};
		    			
		    			node.onmouseout = function() {
		    				node.tips.hide();
		    			};
	    			}
	    			var target = node.getAttribute('target');
					function GetQueryString(name) {
						var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
						var r = top.window.location.search.substr(1).match(reg);
						if(r!=null)return  unescape(r[3]); return null;
					}
	    			if (target == "readbook") {
						function getCookie(objname){
							var arrstr = document.cookie.split("; ");
							for(var i = 0;i < arrstr.length;i ++){
								var temp = arrstr[i].split("=");
								if(temp[0] == objname){
									return unescape(temp[1]);
								}
							}
						}
						if (/\/studentstudy/.test(top.location.pathname)) {
							var setting = AttachmentSetting;
							var isFiled=setting.defaults.isFiled;
							var state=setting.defaults.state;
							if (!(isFiled || state)) {
								href = href + "&_from_=" + window._from;
							}
							href = href + "&uid=" + getCookie("_uid");
							node.setAttribute("href", href);
						}
					} else {
						var from = GetQueryString("(from|_from_)");
						var rtag = GetQueryString("(rtag)");
						if (from) {
							if (href.indexOf("?") > -1) {
								href = href + "&_from_=" + from;
							} else {
								href = href + "?_from_=" + from;
							}
						}
						if (rtag) {
							rtag = rtag.replace(/<\/?[^>]+>/g,"").trim();
							if (href.indexOf("?") > -1) {
								href = href + "&rtag=" + rtag;
							} else {
								href = href + "?rtag=" + rtag;
							}
						}
						node.setAttribute("href", href);
					}
	            });
			}
			
            function checkList(nodes){
                var customCss = [],
                    customStyle = {
                        'cn'    :   'cn-1-',
                        'cn1'   :   'cn-2-',
                        'cn2'   :   'cn-3-',
                        'num'   :   'num-1-',
                        'num1'  :   'num-2-',
                        'num2'  :   'num-3-',
                        'dash'  :   'dash',
                        'dot'   :   'dot'
                    };
                _each(nodes,function(list){
                    if(list.className && /custom_/i.test(list.className)){
                        var listStyle = list.className.match(/custom_(\w+)/)[1];
                        if(listStyle == 'dash' || listStyle == 'dot'){
                            pushItem(customCss,selector +' li.list-' + customStyle[listStyle] + '{background-image:url(' + defaultOption.liiconpath +customStyle[listStyle]+'.gif)}');
                            pushItem(customCss,selector +' ul.custom_'+listStyle+'{list-style:none;} '+ selector +' ul.custom_'+listStyle+' li{background-position:0 3px;background-repeat:no-repeat}');

                        }else{
                            var index = 1;
                            _each(list.childNodes,function(li){
                                if(li.tagName == 'LI'){
                                    pushItem(customCss,selector + ' li.list-' + customStyle[listStyle] + index + '{background-image:url(' + defaultOption.liiconpath  + 'list-'+customStyle[listStyle] +index + '.gif)}');
                                    index++;
                                }
                            });
                            pushItem(customCss,selector + ' ol.custom_'+listStyle+'{list-style:none;}'+selector+' ol.custom_'+listStyle+' li{background-position:0 3px;background-repeat:no-repeat}');
                        }
                        switch(listStyle){
                            case 'cn':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:25px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:40px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-3{padding-left:55px}');
                                break;
                            case 'cn1':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:30px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:40px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-3{padding-left:55px}');
                                break;
                            case 'cn2':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:40px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:55px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-3{padding-left:68px}');
                                break;
                            case 'num':
                            case 'num1':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:25px}');
                                break;
                            case 'num2':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-1{padding-left:35px}');
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft-2{padding-left:40px}');
                                break;
                            case 'dash':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft{padding-left:35px}');
                                break;
                            case 'dot':
                                pushItem(customCss,selector + ' li.list-'+listStyle+'-paddingleft{padding-left:20px}');
                        }
                    }
                });

                customCss.push(selector +' .list-paddingleft-1{padding-left:0}');
                customCss.push(selector +' .list-paddingleft-2{padding-left:'+defaultOption.listDefaultPaddingLeft+'px}');
                customCss.push(selector +' .list-paddingleft-3{padding-left:'+defaultOption.listDefaultPaddingLeft*2+'px}');
                //
                cssRule('list', selector + ' ol,' + selector + ' ul{margin:0;padding:0;}' + selector + ' li{clear:both;}' + customCss.join('\n'), document);
            }
            //
            var needParseTagName = {
                'table' : function(){
                    cssRule('table',
                        selector +' table.noBorderTable td,'+selector+' table.noBorderTable th,'+selector+' table.noBorderTable caption{border:1px dashed #ddd !important}' +
                            //
                            selector +' table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
                            selector +' td,'+selector+' th{ background:white; padding: 5px 10px;border: 1px solid #DDD;}' +
                            selector +' caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
                            selector +' th{border-top:2px solid #BBB;background:#F7F7F7;}' +
                            selector +' td p{margin:0;padding:0;}',
                        document);
                },
                'ol' : checkList,
                'ul' : checkList,
                /*'pre': function(nodes){
                    if(typeof XRegExp == "undefined"){
                        loadFile(document,{
                            id : "syntaxhighlighter_js",
                            src : defaultOption.highlightJsUrl,
                            tag : "script",
                            type : "text/javascript",
                            defer : "defer"
                        },function(){
                            _each(nodes,function(pi){
                                if(/brush/i.test(pi.className)){
                                    SyntaxHighlighter.highlight(pi);
                                    var tables = document.getElementsByTagName('table');
                                    for(var t= 0,ti;ti=tables[t++];){
                                        if(/SyntaxHighlighter/i.test(ti.className)){
                                            var tds = ti.getElementsByTagName('td');
                                            for(var i=0,li,ri;li=tds[0].childNodes[i];i++){
                                                ri = tds[1].firstChild.childNodes[i];
                                                if(ri){
                                                    ri.style.height = li.style.height = ri.offsetHeight + 'px';
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
					
                    if(!document.getElementById("syntaxhighlighter_css")){
                        loadFile(document,{
                            id : "syntaxhighlighter_css",
                            tag : "link",
                            rel : "stylesheet",
                            type : "text/css",
                            href : defaultOption.highlightCssUrl
                        });
                    }
                },*/
                'td':fillNode,
                'th':fillNode,
                'caption':fillNode,
				'iframe':replaceModule,
				'blockquote' : addHandler,
				'img' : addTray
            };

            for(var tag in needParseTagName){
                var nodes = content.getElementsByTagName(tag);
                if(nodes.length){
                    needParseTagName[tag](nodes);
                }
            }
            defaultOption.customRule(content);
            showTips(content);
        });
    })();
}