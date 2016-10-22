function AudioPlayer(json){
	this.audioPlayer = document.getElementsByClassName('audio_player')[0];
	this.playBtn = this.audioPlayer.getElementsByClassName('icon-play3')[0];
	this.audio = this.audioPlayer.getElementsByTagName('audio')[0];
	this.audioPannel = this.audioPlayer.getElementsByClassName('audio_pannel')[0];
	this.pauseClass = 'icon-pause2';
	this.playClass = 'icon-play3';
	this.mutedClass = 'muted';
	this.audio.volume = 0.5;//默认音量
	this.index = 0;//记录当前第几首歌曲
	this.way = 3;//播放方式1--单曲循环，2---顺序播放，3---随机播放
	this.json = json;
	this.num = this.json.num;//歌曲数目
	this.List = this.audioPlayer.getElementsByClassName('list')[0];
	this.aLi = null;//歌曲列表
	this.playWayBtns = null;//播放方式按钮
	this.status_bar = this.audioPlayer.getElementsByClassName('status_bar')[0];//音量状态条
	this.volume_ctrl = this.audioPannel.getElementsByClassName('volume_ctrl')[0];
	this.dot = this.audioPlayer.getElementsByClassName('dot')[0];//音量拖拽小圆点
	this.timeShow = this.audioPlayer.getElementsByClassName('time_show')[0];
	this.liHeight = 30;
	this.flag = false;
	this.formats = ['mp3','ogg','wav'];


	this.doInit();
}
AudioPlayer.prototype = {
	doInit:function(){
		this.creatList();
		this.setAppDrag();
		this.setControllor();
		this.setDefault();
		return this;
	},
	setAppDrag:function(){
		var _this = this;
		drag(_this.audioPlayer,null,false);
	},
	setDefault:function(){
		var _this = this;

		//默认音量
		//_this.audio.volume = _this.
		_this._volumeUpdate();
		//默认播放方式
		_this._playWaySwitch();
	},
	setControllor:function(){
		var _this = this;
		var volume = _this.audioPlayer.getElementsByClassName('volume')[0];
		var time_go = _this.audioPlayer.getElementsByClassName('time_go')[0];
		var time_line = _this.audioPlayer.getElementsByClassName('time_line')[0];
		
		var preBtn =  _this.audioPlayer.getElementsByClassName('icon-backward2')[0];//上一曲按钮
		var nextBtn =  _this.audioPlayer.getElementsByClassName('icon-forward3')[0];//下一曲按钮
		//静音
		volume.onclick = function(){
			if(!_this.audio.muted){
				addClass(this,'muted');
			}else{
				removeClass(this,'muted');
			}
			_this.audio.muted = !_this.audio.muted;
		};
		_this.playBtn.onclick = function(){
			if(_this.audio.paused){
				_this.audio.play();
				this.className = _this.pauseClass;
			}else{
				_this.audio.pause();
				this.className = _this.playClass;
			}
			_this._highlightShow();
		};
		/**
		 * [onmousedown 时间线实时更新]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		var time_dot = _this.audioPlayer.getElementsByClassName('time_dot')[0];
		_this.audio.ontimeupdate = function(){
			var scale = _this.audio.currentTime/_this.audio.duration;
			var width = time_line.offsetWidth*scale;
			//console.log(_this.audio.src);
			time_go.style.width = width + 'px';
			time_dot.style.left = width - time_dot.offsetWidth/2 + 'px';
			_this._volumeUpdate();
			_this.timeShow.innerHTML = _this._timeFormat(_this.audio.currentTime)+'/'+_this._timeFormat(_this.audio.duration);
			if(_this.audio.ended){
				nextBtn.onclick();
			}
		};
		/**
		 * [onmousedown 拖拽跳转进度]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		time_dot.onmousedown = function(e){
			var e = e || window.event;
			var disX = e.clientX - this.offsetLeft;
			stopBubble(e);
			document.onmousemove = function(e){
				var e = e || window.event;
				var left = e.clientX-disX;

				if(left<0){
					left = 0;
				}else if(left > time_line.offsetWidth-time_dot.offsetWidth){
					left = time_line.offsetWidth-time_dot.offsetWidth;
				}
				time_dot.style.left = left+'px';
				var scale = left/time_line.offsetWidth;
				_this.audio.currentTime = scale*_this.audio.duration;
				time_go.style.width = time_dot.offsetWidth/2+left+'px';
			};
			document.onmouseup = function(){
				this.onmousemove = null;
				this.onmouseup = null;
			};
		};
		/**
		 * [for 点击歌曲列表播放]
		 * @param  {[type]} var i             [description]
		 * @return {[type]}     [description]
		 */
		for(var i=0;i<_this.aLi.length;i++){
			_this.aLi[i].onclick = (function(i){
				return function(){
					_this._loadSource(this.getAttribute('mdUrl'));
					_this.audio.play();
					_this.index = i;
					_this._highlightShow();
					_this.playBtn.className = _this.pauseClass;
				}
			})(i);
		}
		/**
		 * [onmousedown 音量设置]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		_this.dot.onmousedown = function(e){
			var e = e || window.event;
			var disX = e.clientX - this.offsetLeft;

			stopBubble(e);
			document.onmousemove = function(e){
				var e = e || window.event;
				var left = e.clientX-disX;

				if(left<0){
					left = 0;
				}else if(left > _this.status_bar.offsetWidth-_this.dot.offsetWidth){
					left = _this.status_bar.offsetWidth-_this.dot.offsetWidth;
				}
				if(left == 0){
					_this.audio.muted = true;
					//volume.className = _this.mutedClass;
					addClass(volume,_this.mutedClass);
				}else{
					_this.audio.muted = false;
					removeClass(volume,_this.mutedClass);
				}
				_this.dot.style.left = left+'px';
				_this.volume_ctrl.style.width = left + _this.dot.offsetWidth/2+'px';
				var scale = left/(_this.status_bar.offsetWidth-_this.dot.offsetWidth);
				//console.log(scale,left,status_bar.offsetWidth-dot.offsetWidth)
				_this.audio.volume = scale;
			};
			document.onmouseup = function(){
				this.onmousemove = null;
				this.onmouseup = null;
			};
		};
		//切换歌曲事件
			//console.log(preBtn)
		preBtn.onclick = function(){
			//alert(1)
			switch(_this.way){
				case 1:
				case 2:
				_this.index--;
				if(_this.index<0){
					_this.index = _this.num-1;
				}
				break;
				case 3:
				do{
					var index = parseInt(Math.random()*_this.num);
					_this.index = index;
				}while(index!=_this.index);
				break;
			}
			_this._loadSource( _this.aLi[_this.index].getAttribute('mdUrl') );
			_this.audio.play();
			_this._highlightShow();
		};
		nextBtn.onclick = function(){
			//alert(1)
			switch(_this.way){
				case 1:
				case 2:
				_this.index++;
				if(_this.index==_this.num){
					_this.index = 0;
				}
				break;
				case 3:
				do{
					var index = parseInt(Math.random()*_this.num);
					_this.index = index;
				}while(index!=_this.index);
				break;
			}
			_this._loadSource( _this.aLi[_this.index].getAttribute('mdUrl') );
			_this.audio.play();
			_this._highlightShow();
		};
		//播放方式选择
		var playWay = _this.audioPlayer.getElementsByClassName('play_way')[0];
		_this.playWayBtns = playWay.getElementsByTagName('li');
		playWay.onclick = function(){
			_this.way++;
			if(_this.way-1 == _this.playWayBtns.length){
				_this.way = 1;
			}
			_this._playWaySwitch();
		};
	},
	/**
	 * [_timeFormat 将时间格式化成XX:XX的形式]
	 * @param  {[type]} times [description]
	 * @return {[type]}       [description]
	 */
	_timeFormat:function(times){
		var minutes = parseInt(times/60);
		var seconds = parseInt(times%60);
		return toTwo(minutes)+':'+toTwo(seconds);
		function toTwo(num){
			return num<10?'0'+num:num;
		}
	},
	/**
	 * [_loadSource 加载资源，并且做了各种兼容，判断文件是否存在]
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	_loadSource:function(url){
		var _this = this;
		var formats = _this.formats;
		var beExist = true;
		for(var i=0;i<formats.length;i++){
			if( checkAudioCompat(formats[i]) ){
				_this.audio.src = url+'.'+formats[i];
				if(beExist){
					_this.audio.src = url+'.'+formats[i];
					return ;
				}
				_this.audio.onemptied = function(){
					beExist = false;
				}
			}
		}
		/**
		 * [checkAudioCompat 判断浏览器是否支持制定类型的音频]
		 * @param  {[type]} format [description]
		 * @return {[type]}        [description]
		 */
		function checkAudioCompat(format){
			var browser = getBrowserType();
			var supportType = {
				'Opera':['ogg','wav'],
				'Firefox':['ogg','wav'],
				'Chrome':['ogg','mp3'],
				'Safari':['mp3','wav'],
				'IE':['mp3']
			};

			if(inArray(supportType[browser],format)){
				return true;
			}
			return false;
		}
		/**
		 * [getBrowserType 判断浏览器的类型]
		 * @return {[type]} [description]
		 */
		function getBrowserType(){
			var userAgent = navigator.userAgent;
			var isOpera = false;
			if(userAgent.indexOf('Opera')>-1){
				isOpera = true;
				return 'Opera';
			}else if(userAgent.indexOf('Firefox')>-1){
				return 'Firefox';
			}else if(userAgent.indexOf('Chrome')>-1){
				return 'Chrome';
			}else if(userAgent.indexOf('Safari')>-1){
				return 'Safari';
			}else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera){
				return 'IE';
			}
		}
	},
	/**
	 * 高亮显示当前歌曲
	 */
	_highlightShow:function(){
		var _this = this;
		/*for(var i=0;i<_this.aLi.length;i++){
			removeClass(_this.aLi[i],'on');
		}*/
		removeClass(_this.aLi,'on');
		addClass(_this.aLi[_this.index],'on');
	},
	/**
	 * [_playWaySwitch 播放方式切换]
	 * @return {[type]} [description]
	 */
	_playWaySwitch:function(){
		var _this = this;
		/*for(var i=0;i<_this.playWayBtns.length;i++){
			addClass(_this.playWayBtns[i],'display_none');
		}*/
		addClass(_this.playWayBtns,'display_none');
		removeClass(_this.playWayBtns[_this.way-1],'display_none');
	},
	/**
	 * [_volumeUpdate 更新音量]
	 * @return {[type]} [description]
	 */
	_volumeUpdate:function(){
		var _this = this;
		var left = _this.audio.volume*_this.status_bar.offsetWidth;

		_this.dot.style.left = left + 'px';
		_this.volume_ctrl.style.width = left + _this.dot.offsetWidth/2+'px';
	},
	creatList:function(){
		var _this = this;
		var oCircle = _this.audioPlayer.getElementsByClassName('circle1')[0];
		var list = _this.json.list;
		var oFrag = document.createDocumentFragment();
		for(var i=0;i<_this.num;i++){
			var oLi = document.createElement('li');
			oLi.innerHTML = (i+1)+'.'+list[i].mdName;
			oLi.index = i;
			oLi.setAttribute('mdUrl',list[i].mdUrl);
			oFrag.appendChild(oLi);
		}
		_this.List.appendChild(oFrag);
		_this.aLi = _this.List.getElementsByTagName('li');

		oCircle.onclick = function(){
			var height = _this.liHeight*_this.num;
			if(!_this.flag){
				startMove(_this.List,{
					'height':height,
					'opacity':1
				},500,'Elastic easeInOut');
			}else{
				startMove(_this.List,{
					'height':0,
					'opacity':0
				},500,'Back easeInOut');
			}
			_this.flag = !_this.flag;
		};
	}
};