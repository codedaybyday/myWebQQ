/*
桌面类
*/
function Desk(){
	this.desk_main = document.getElementsByClassName('desk_main')[0];
	this.desk_top_navbar = document.getElementsByClassName('desk_top_navbar')[0];//顶部导航
	this.sub_desk = document.getElementsByClassName('sub_desk');//子桌面
	//alert(desk_main);
	this.desk_num = 5;//子桌面个数
	this.desk_index = this.desk_oldindex = 0;//当前字桌面索引
	this.pageNumber = document.getElementsByClassName('pageNumber')[0];
	this.aA = this.pageNumber.getElementsByTagName('a');//顶部导航数字按钮
	this.desk_top_navbar_wrap = document.getElementsByClassName('desk_top_navbar_wrap')[0];
	this.tool = document.getElementsByClassName('tool')[0];
	this.user = document.getElementsByClassName('user')[0];
	this.iTop = 30;
	this.iRight = 40;
	this.appSelector = 'desk_app';
	this.appHeight = 88;
	this.appWidth = 88;
	this.sortType = 0;//图标排列方式0竖排 1横排
	this.deskHeight = this.sub_desk[0].offsetHeight;
	this.deskWidth = this.sub_desk[0].offsetWidth;
	this.minZIndex = 100;
	this.textMenuHtml = '';//暂时不用
	this.textMenu = document.getElementsByClassName('textMenu')[0];//右键菜单
	this.appTextMenu = document.getElementsByClassName('appTextMenu')[0];//app右键菜单
	this.appName = 'app_name';
	this.appImg = 'app_img';
	this.sideBar = document.getElementsByClassName('side_bar')[0];
	//this.skinDiv = document.getElementsByClassName('skin')[0];	//皮肤设置区域
	//this.skinSetBtn = document.getElementsByClassName('pannel')[0];//皮肤设置按钮
	this.isAcitive = false;//用来判断背景设置弹窗是否被激活
	this.scrollBar_item = null;//背景设置弹窗滚动条
	this.bg = null;//背景设置弹窗滚动条控制区域
	this.scrollSpeed = 10;
	//console.log(this)
	this.doInit();
}
Desk.prototype = {
	constructor:'Desk',
	doInit:function(){
		this.setLayer();
		this.setNumNavBar();
		this.setScroll();
		this.setAppPos();
		this.setAppDrag();
		this.setTextMenu();
		this.blind();
		this.setSkin();
		this.sideBarPop();
	},
	/*
	桌面整体布局
	 */
	setLayer:function(){
		//布局转换
		var _this = this;
		var top = _this.desk_main.offsetTop;
		with(_this.desk_main.style){
			position = 'absolute';
			width = this.desk_num*100+'%';
			left = 0;
			top = top + 'px';
			height = viewH() - _this.desk_top_navbar.offsetHeight-_this.desk_top_navbar.offsetTop + 'px';
		}
		var width = parseInt(1/_this.desk_num*100);
		for(var i=0;i<_this.sub_desk.length;i++){
			_this.sub_desk[i].style.width = width +'%';
		}
		//for()
	},
	/*
	设置app的排列方式
	 */
	setAppPos:function(){
		var _this = this;
		var rows = Math.floor(_this.deskHeight/(_this.iTop+_this.appHeight));
		var cols = Math.floor(_this.deskWidth/(_this.iRight+_this.appWidth));
		for(var i=0;i<_this.sub_desk.length;i++){
			var apps = _this.sub_desk[i].getElementsByClassName(_this.appSelector);
			//console.log(apps);
			var pos = [];
			for(var j=0;j<apps.length;j++){
				apps[j].style.position = 'absolute';
				//drag(apps[j]);
				if(_this.sortType == 0){
					pos.push({
						'left':Math.floor(j/rows)*(_this.appWidth+_this.iRight),
						'top':(j%rows)*(_this.appHeight+_this.iTop)
					});
				}else{
					pos.push({
						'left':(j%cols)*(_this.appWidth+_this.iRight),
						'top':Math.floor(j/cols)*(_this.appHeight+_this.iTop)
					});
				}
			}
			for(var j=0;j<apps.length;j++){
				startMove(apps[j],pos[j],300,'Linear');
			}
		}
			//console.log(pos)
	},
	/*
	顶部导航设置
	 */
	setNumNavBar:function(){
		var _this = this;
		//顶部导航长度实现自适应
		_this.desk_top_navbar_wrap.style.width = _this.user.offsetWidth + _this.pageNumber.offsetWidth+_this.tool.offsetWidth + 'px';
		/*
		数字导航点击事件
		 */
		for(var i=0;i<_this.aA.length;i++){
			_this.aA[i].onclick = (function(i){
				return function(){
					//alert(i)
					_this.aA[_this.desk_oldindex].className = '';
					_this.aA[i].className = 'on';
					_this.desk_index = i;
					_this.desk_oldindex = _this.desk_index;
					startMove(_this.desk_main,{
						'left':-viewW()*i
					},300,'Linear');
				}
			})(i);
		}
	},
	/*
	桌面滚动
	 */
	setScroll:function(){
		var _this = this;
		/*
		添加滚轮事件
		 */
		addEvent(document,'mousewheel',function(e){
			if(_this.isAcitive){
				scrollEvent(e);
			}else{
				delay_till_last('id',function(){
					scrollEvent(e);
				},300);
			}
		});
		addEvent(document,'DOMMouseScroll',function(e){
			if(_this.isAcitive){
				scrollEvent(e);
			}else{
				delay_till_last('id',function(){
					scrollEvent(e);
				},300);
			}
		});
		/*
		滚轮事件函数
		 */
		function scrollEvent(e){
			var e = e || window.event;
			var cur = 0;
			//alert(e.wheelDelta)
			var detail = -e.wheelDelta/120 || e.detail/3;
			//console.log(detail);
			if(_this.isAcitive){
				//背景设置弹窗滚轮事件
				console.log(detail)
				cur = _this.scrollBar_item.offsetTop;
				if(detail>0){
					cur += _this.scrollSpeed;
					//scrollBar_item.sty
					//_this.bg.style.top = 
				}else{
					cur -= _this.scrollSpeed;
				}
				if(cur<0){
						cur=0
				}else if(cur>_this.scrollBar_item.parentNode.offsetHeight-_this.scrollBar_item.offsetHeight){
					cur = _this.scrollBar_item.parentNode.offsetHeight-_this.scrollBar_item.offsetHeight
				}
				var scale = cur/(_this.scrollBar_item.parentNode.offsetHeight-_this.scrollBar_item.offsetHeight);
                _this.bg.style.top = -(_this.bg.offsetHeight-_this.scrollBar_item.parentNode.offsetHeight)*scale+'px';
				_this.scrollBar_item.style.top = cur+'px';
			}else{
				if(detail>0){
					_this.desk_index++;
					if(_this.desk_index==_this.desk_num){
						_this.desk_index = 0;
					}
				}else{
					_this.desk_index--;
					if(_this.desk_index<0){
						_this.desk_index = _this.desk_num-1;
					}
				}
				_this.aA[_this.desk_oldindex].className = '';
				_this.aA[_this.desk_index].className = 'on';
				_this.desk_oldindex = _this.desk_index;
				startMove(_this.desk_main,{
					'left':-viewW()*_this.desk_index
				},300,'Back easeOut');
			}
		}
		/*
		防止某一事件连续触发
		 */
		var _timer = {};
		function delay_till_last(id,fn,wait){
			if(_timer[id]){
				clearTimeout(_timer[id]);
				delete _timer[id];
			}
			return _timer[id] = setTimeout(function(){
				fn();
				delete _timer[id];
			},wait);
		}
	},
	setAppDrag:function(){
		var _this = this;
		for(var i=0;i<_this.sub_desk.length;i++){
			var apps = _this.sub_desk[i].getElementsByClassName(_this.appSelector);
			var pos = [];
			for(var j=0;j<apps.length;j++){
				drag(apps[j],apps,true);
			}
		}
	},
	setTextMenu:function(){
		var _this = this;
		document.oncontextmenu = function(e){
			//alert(1);
			var e = e || window.event;
			var target = e.target || e.srcElement;
			console.log(target);
			var x = e.clientX;
			var y = e.clientY;

			if(target.parentNode.className == _this.appImg || target.className == _this.appName){
				_this.textMenu.style.display = 'none';
				_this.appTextMenu.style.display = 'block';
				_this.appTextMenu.style.left = x+'px';
				_this.appTextMenu.style.top = y+'px';
				_this.appTextMenu.style.zIndex = _this.minZIndex++;
			}else{
				_this.appTextMenu.style.display = 'none';
				_this.textMenu.style.display = 'block';
				_this.textMenu.style.left = x+'px';
				_this.textMenu.style.top = y+'px';
				_this.textMenu.style.zIndex = _this.minZIndex++;
			}
			return false;
		};
	},
	blind:function(){
		var _this = this;
		document.onclick = function(e){
			var e = e || window.event;
			var target = e.target || e.srcElement;
			
			if(target != _this.textMenu){
				_this.textMenu.style.display = 'none';
			}
			if(target != _this.appTextMenu){
				_this.appTextMenu.style.display = 'none';
			}
		};
	},
	/*
	设置背景图片
	 */
	setSkin:function(){
		var _this = this;
		var skinDiv = document.getElementsByClassName('skin')[0];	//皮肤设置区域
		var skinSetBtn = document.getElementsByClassName('pannel')[0];//皮肤设置按钮
		var items = skinDiv.getElementsByClassName('bg_item');
		var oClose = skinDiv.getElementsByClassName('close')[0];
		var scrollBar = skinDiv.getElementsByClassName('scrollBar')[0];
		_this.scrollBar_item = skinDiv.getElementsByClassName('scrollBar_item')[0];
		_this.bg = skinDiv.getElementsByClassName('bg')[0];
		var pos = [];
		//布局转换
		for(var i=0;i<items.length;i++){
			pos.push({
				'left':items[i].offsetLeft,
				'top':items[i].offsetTop
			});
		}
		//垂直和水平居中
		//一定不能用css直接控制.skin{width:540px;height:380px;position:absolute;left:50%;margin-left:-270px;top:50%;margin-top:-190px;overflow:hidden;一定要在js中进行布局转换} 
		//skinDiv.style.top = (viewH()-skinDiv.offsetHeight)/2 + 'px';
		
		skinDiv.style.left = (viewW()-skinDiv.offsetWidth)/2 + 'px';//重新布局，因为后面调用drag函数设置的left，top的值
		skinDiv.style.top = (viewW()+skinDiv.offsetWidth) + 'px';
		skinSetBtn.onclick = function(){
			startMove(skinDiv,{
				//'left':(viewW()-skinDiv.offsetWidth)/2,
				'top':(viewH()-skinDiv.offsetHeight)/2
			},300,'Back easeInOut',function(){
				_this.isAcitive = true;//滚轮效果出现在弹窗上
			});
		};
		oClose.onclick = function(){
			startMove(skinDiv,{
				//'left':skinDiv.offsetLeft,
				'top':(viewW()+skinDiv.offsetHeight)
			},300,'Back easeInOut',function(){
				_this.isAcitive = false;
			});
		};
		//背景预览图片布局转换
		for(var i=0;i<items.length;i++){
			with(items[i].style){
				position = 'absolute';
				left = pos[i].left + 'px';
				top = pos[i].top + 'px';
			}
			/*图片放大，层级增大*/
			items[i].onmouseover = function(){
				this.style.zIndex = _this.minZIndex++;
			};
		}
		_this.bg.style.height = items[items.length-1].offsetHeight+items[items.length-1].offsetTop+'px';
		drag(skinDiv,null,false,function(){
			_this.isAcitive = true;//背景弹窗被激活
		});
		/*drag(scrollBar_item,null,false,true,{
			'direction':'vertical',
			'from':0,
			'to':scrollBar.offsetHeight-scrollBar_item.offsetHeight
		});*/
		//滚动条拖动
		_this.scrollBar_item.onmousedown = function(e){
			var e = e || window.event;
            var disX = e.clientX - this.offsetLeft;
            var disY = e.clientY - this.offsetTop;

            _this.isAcitive = true;//背景弹窗被激活
            stopBubble();//阻止事件冒泡，防止拖拽的时候拖动整个框
            document.onmousemove = function(e){
            	var e = e || window.event;
            	var l = e.clientX - disX;
                var t = e.clientY - disY;

                if(t<0){
                	t = 0;
                }else if(t>scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight){
                	t = scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight;
                }
                scale = t/(scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight);
                _this.bg.style.top = -(_this.bg.offsetHeight-scrollBar.offsetHeight)*scale+'px';
                //scrollBar_item.style.left = l + 'px';
                _this.scrollBar_item.style.top = t + 'px';
            };
            document.onmouseup = function(){
            	this.onmousemove = null;
            	this.onmouseup = null;
            }
		};
	},
	sideBarPop:function(){
		var _this = this;
		var btn = _this.sideBar.getElementsByClassName('q')[0];
		var popMenu = _this.sideBar.getElementsByClassName('side_bar_menu')[0];
		var oExit = _this.sideBar.getElementsByClassName('exit')[0];

		btn.onclick = function(){
			startMove(popMenu,{
				'left':popMenu.parentNode.offsetWidth + 10
			},300,'Back easeInOut');
		};
		oExit.onclick = function(){
			startMove(popMenu,{
				'left':-popMenu.offsetWidth
			},300,'Back easeInOut');
		};
	}
}