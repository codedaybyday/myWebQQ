function Window(json){
	this.height = 400;
	this.width = 560;
	this.popWinClass = 'popWin';
	this.win = null;
	this.json = json;
	this.init();
}
Window.prototype = {
	init:function(){
		var _this = this;

		_this.createWin();
		_this.winDrag();
		_this.doMax();
		_this.doMin();
		_this.closeWin();
	},
	/**
	 * [createWin 创建弹窗]
	 * @return {[type]} [description]
	 */
	createWin:function(){
		var _this = this;
		var oDiv = document.createElement('div');
		var html = '<h2 class="win_title"><span class="win_text">'+_this.json.title+'</span><span class="close" title="关闭">关闭</span><span class="max" title="最大化">最大化</span><span class="min" title="最小化">最小化</span></h2><div class="frame_wrap"><iframe src="'+_this.json.href+'"></iframe></div>';
		oDiv.innerHTML = html;
		oDiv.setAttribute('class','popWin');
		document.getElementById('desk-top').appendChild(oDiv);
		oDiv.style.left = (viewW()-oDiv.offsetWidth)/2+'px';
		_this.win = oDiv;
		startMove(_this.win,{
			'top':(viewH()-_this.win.offsetHeight)/2
		},600,'Back easeInOut');
	},
	/**
	 * [winDrag 窗口拖拽]
	 * @return {[type]} [description]
	 */
	winDrag:function(){
		var _this = this;
		drag(_this.win,null,false);
	},
	/**
	 * [doMax 窗口最大化]
	 * @return {[type]} [description]
	 */
	doMax:function(){
		var _this = this;
		var oMax = _this.win.getElementsByClassName('max')[0];

		oMax.onclick = function(){
			startMove(_this.win,{
				'height':viewH(),
				'width':viewW(),
				'left':0,
				'top':0
			},300,'Linear');
		};
	},
	/**
	 * [doMin 窗口最小化]
	 * @return {[type]} [description]
	 */
	doMin:function(){
		var _this = this;
		var oMin = _this.win.getElementsByClassName('min')[0];

		oMin.onclick = function(){
			startMove(_this.win,{
				'left':(viewW()-_this.width)/2,
				'top':(viewH()-_this.height)/2,
				'height':_this.height,
				'width':_this.width
			},300,'Linear');
		};
	},
	closeWin:function(){
		var _this = this;
		var oClose = _this.win.getElementsByClassName('close')[0];

		oClose.onclick = function(){
			startMove(_this.win,{
				'opacity':0
			},300,'Quad easeOut',function(){
				document.getElementById('desk-top').removeChild(_this.win);
			});
		};
	}
}