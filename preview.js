/*
*author : maqiang
*date : 2014/4/18 9:52
*topic : 图片上传浏览
*description : 这是原生实现的直接使用就可
*/
var ImagePreview = function(file, img, options) {
	this.file = file;
	this.img = img;
	this._data = null; //图片数据
	this.ratio = options.ratio;
	this.maxWidth = options.maxWidth;
	this.maxHeight = options.maxHeight;
	this._preload= null; //预加载对象用于获取数据
}
ImagePreview.prototype = {
	//客户端调用
	preview : function() {
		var Sys = this._userAgent();
		//首先判断ie,减少代码执行。按照使用量排序
		if ((Sys.ie) && (Sys.ie == 7.0 || Sys.ie == 8.0))
		{
			alert(111111111111);
			this._data = this._filterData();
			this._filterProcess();
		}else if(Sys.firefox || Sys.chrome)  
		{
			this._data = this._commonData();
			this._commonProcess();
		}else{
			this._data = this._simpleData();
			this._commonProcess();
		}
	},

	//滤镜显示
	_filterProcess : function() {
		var dataPath = this._data;
		this._filterPreload();
		var preload = this._preload;
		try{
			preload.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataPath;
		}catch(e){
			alert("滤镜错误");
			return;
		}
		this.img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + dataPath + "\")";
		var alpha = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
		this._imgShow(alpha, preload.offsetWidth, preload.offsetHeight);

	},

	//google与 firefox 显示方式
	_commonProcess : function() {
		var dataPath = this._data;
		var preload = this._preload = new Image();
		var oThis = this;
		var onload = function(){
				oThis._imgShow(dataPath, this.width, this.height);
		};
		preload.onload = onload;
		preload.onerror = function() {oThis._error("加载过程中发生错误")};
		this._preload.src = dataPath;
	},
	
	//远程获取处理
	_remoteProcess : function() {
		//暂不实现有需求再实现
	},

	_imgShow : function(src, width, height){
		var img = this.img;
		var style = img.style;
		var ratio = Math.max( 0, this.ratio ) || Math.min( 1,
				Math.max( 0, this.maxWidth ) / width  || 1,
				Math.max( 0, this.maxHeight ) / height || 1
			);
		//设置预览尺寸
		style.width = Math.round( width * ratio ) + "px";
		style.height = Math.round( height * ratio ) + "px";
		//设置src
		img.src = src;
	},
	
	//滤镜数据获取方式ie7, ie8
	_filterData : function() {
		this.file.select();
		try{
			return document.selection.createRange().text;
		}finally{
			document.selection.empty();
		}
	},

	//一般数据获取程序(google&&firefox)
	_commonData : function() {
		return window.URL.createObjectURL(this.file.files.item(0));
	},
	
	// 简单获取数据方式ie10 
	_simpleData : function() {
		return this.file.value;	
	},

	//设置滤镜预载图片对象用于获取图片大小
	_filterPreload : function() {
		if (!this._preload)
		{
			var preload = this._preload = document.createElement("div");
			preload.style.width = "1px";
			preload.style.height = "1px";
			preload.style.visibility = "hidden";
			preload.style.position ="absolute";
			preload.style.left = "-9999px";
			preload.style.top = "-9999px";
			preload.style.filter ="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image')";
			var body = document.body; 
			body.insertBefore( preload, body.childNodes[0]);
		}
	},
	
	_error : function(err) {
		alert(err);
		return;
	},

	_userAgent : function() {
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		return Sys;
	}
}