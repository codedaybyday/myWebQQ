//单例模式
var desk = (function(){
	var unique;
	function getInstance(jsonData){
		if(unique === undefined){
			unique = new Desk(jsonData);
		}
		return unique;
	}

	/*
	桌面类
	 */
	function Desk(jsonData){
		this.jsonData = jsonData;
		this.deskTop = document.getElementById('desk-top');
		this.desk_main = this.deskTop.getElementsByClassName('desk_main')[0];
		this.desk_top_navbar = this.deskTop.getElementsByClassName('desk_top_navbar')[0];//顶部导航
		this.sub_desk = null;//子桌面
		this.desk_num = this.jsonData.aDeskMap.length;//子桌面个数
		this.desk_index = this.desk_oldindex = 0;//当前字桌面索引
		this.pageNumber = this.deskTop.getElementsByClassName('pageNumber')[0];
		this.aA = this.pageNumber.getElementsByTagName('a');//顶部导航数字按钮
		this.desk_top_navbar_wrap = this.deskTop.getElementsByClassName('desk_top_navbar_wrap')[0];
		this.tool = this.deskTop.getElementsByClassName('tool')[0];
		this.user = this.deskTop.getElementsByClassName('user')[0];
		this.iTop = 30;
		this.iRight = 40;
		this.appSelector = 'desk_app';
		this.appHeight = 88;
		this.appWidth = 88;
		this.sortType = 0;//图标排列方式0竖排 1横排,2自由排列
		this.iconType = 0;//0默认，1小，2大
		this.deskHeight = 0;
		this.deskWidth = 0;
		this.minZIndex = 1000;
		this.textMenuHtml = '';//暂时不用
		this.textMenu = this.deskTop.getElementsByClassName('textMenu')[0];//右键菜单
		this.appTextMenu = this.deskTop.getElementsByClassName('appTextMenu')[0];//app右键菜单
		this.appName = 'app_name';
		this.appImg = 'app_img';
		this.sideBar = this.deskTop.getElementsByClassName('side_bar')[0];
		this.isAcitive = false;//用来判断背景设置弹窗是否被激活
		this.scrollBar_item = null;//背景设置弹窗滚动条
		this.bg = null;//背景设置弹窗滚动条控制区域
		this.defaultSkin = '';//默认皮肤
		this.scrollSpeed = 10;
		this.clock = null; // 时钟
		this.audioPlayer = null;
		this.hasSubNode = [];//存放含有子节点的元素的类名
		this.iconConfig = [//图标配置信息
			{
				iW: 88,
                iH: 88,
                iR: 40,
                iT: 30,
                iMarT: 8,
                iPadLR: 6,
                iHeight: 20,
                iLineH: 18
            },
            {
				iW: 78,
                iH: 78,
                iR: 30,
                iT: 20,
                iMarT: 8,
                iPadLR: 4,
                iHeight: 18,
                iLineH: 16
            },
            {
				iW: 108,
                iH: 108,
                iR: 50,
                iT: 30,
                iMarT: 8,
                iPadLR: 8,
                iHeight: 20,
                iLineH: 18
            },
		];

		this.doInit();
	}
	Desk.prototype = {
		constructor:'Desk',
		doInit:function(){
			this.createSubDesk();
			this.setLayer();
			this.setNumNavBar();
			this.setSideBar();
			this.setScroll();
			this.setAppPos();
			this.setAppDrag();
			this.setTextMenu();
			//this.setAppTextMenu();
			this.bind();
			this.setSkin();
			this.sideBarPop();
			this.createAppWin();
			this.createSideAppWin();
			this.createClock();
			this.initAudioPlayer();
			this.resize();
		},
		/**
		 * [resize 窗口变化时，重新渲染页面]
		 * @return {[type]} [description]
		 */
		resize:function(){
			var _this = this;
			document.body.onresize = function(){
				//alert(1)
				_this.setLayer();
				_this.createSubDesk();
				_this.setAppPos();
			};
		},
		/**
		 * [createSubDesk 读取json数据，创建自桌面DOM节点]
		 * @return {[type]} [description]
		 */
		createSubDesk:function(){
			var _this = this;
			var aDeskMap = _this.jsonData.aDeskMap;

			var oFrag1 = document.createDocumentFragment();
			for(var i=0;i<_this.desk_num;i++){

				var oFrag2 = document.createDocumentFragment();
				var aDeskData = aDeskMap[i].aDeskData;
				var length = aDeskMap[i].aDeskData.length;
				for(var j=0;j<length;j++){
					var oLi = document.createElement('li');
					oLi.setAttribute('class','desk_app');
					oLi.setAttribute('_href',aDeskData[j].deskOpenUrl);
					oLi.setAttribute('title',aDeskData[j].deskAppName);
					oLi.innerHTML = '<div class="mask"></div><div class="app"><div class="app_img"><img src="'+aDeskData[j].deskAppUrl+'"/></div><span class="app_name">'+aDeskData[j].deskAppName+'</span></div>';
					oFrag2.appendChild(oLi);
				}

				var oDiv = document.createElement('div');
				var oUl = document.createElement('ul');

				oDiv.setAttribute('class','sub_desk');
				oUl.setAttribute('class','sub_desk_wrap');
				oUl.appendChild(oFrag2);
				oDiv.appendChild(oUl);
				oFrag1.appendChild(oDiv);
			}
			_this.desk_main.appendChild(oFrag1);
			_this.sub_desk = document.getElementsByClassName('sub_desk');
			_this.deskHeight = viewH()-_this.sub_desk[0].getBoundingClientRect().top;
			_this.deskWidth = _this.sub_desk[0].offsetWidth;
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
			for(var i=0;i<_this.desk_num;i++){
				_this.sub_desk[i].style.width = width +'%';
			}
			//for()
		},
		/*
		设置app的排列方式
		 */
		setAppPos:function(){
			var _this = this;

			if(getCookies('iconType')===null){
				setCookies('iconType',_this.iconType);//如果图标大小没有存入。就存入默认的
			}
			if(getCookies('sortType')===null){
				setCookies('sortType',_this.sortType);//如果排序没有存入。就存入默认的
			}
			var sortType = getCookies('sortType');
			var iconType = parseInt(getCookies('iconType'));
			var jsonIconConf = _this.iconConfig[iconType];
			//console.log(jsonIconConf)
			var iH = parseInt(jsonIconConf.iH);
			var iW = parseInt(jsonIconConf.iW);
			var iR = parseInt(jsonIconConf.iR);
			var iT = parseInt(jsonIconConf.iT);
			var rows = Math.floor(_this.deskHeight/(iH+iT));
			var cols = Math.floor(_this.deskWidth/(iW+iR));
			
			for(var i=0;i<_this.sub_desk.length;i++){
				var apps = _this.sub_desk[i].getElementsByClassName(_this.appSelector);
				//console.log(apps);
				var pos = [];
				for(var j=0;j<apps.length;j++){
					var app_img = apps[j].getElementsByClassName('app_img')[0];
					var app_name = apps[j].getElementsByClassName('app_name')[0];
					with(apps[j].style){
						width =jsonIconConf.iW+'px';
						height =jsonIconConf.iH+'px';
						position = 'absolute';
					}
					with(app_name.style){
						//marginTop = jsonIconConf.iMarT+'px';
						paddingLeft = jsonIconConf.iPadLR+'px';
						paddingRight = jsonIconConf.iPadLR+'px';
						height = jsonIconConf.iHeight+'px';
						lineHeight = jsonIconConf.iLineH+'px';
						//marginRight = (jsonIconConf.iW-app_name.offsetWidth)/2+'px';
						//width = app_name.offsetWidth+'px';
					}
					//alert(jsonIconConf.iW)
					with(app_img.style){
						width = jsonIconConf.iH - 28-app_name.offsetHeight+ 'px';
						height = jsonIconConf.iH - 28-app_name.offsetHeight+ 'px';
						//height = jsonIconConf.iH- jsonIconConf.
						//marginTop = jsonIconConf.iT+'px';
						//marginRight = jsonIconConf.iR+'px';
						//width = (jsonIconConf.iW-2*jsonIconConf.iR)+'px';
					}
					if(sortType == 0){
						pos.push({
							'left':Math.floor(j/rows)*(iW+iR),
							'top':(j%rows)*(iH+iT)
						});
					}else{
						pos.push({
							'left':(j%cols)*(iW+iR),
							'top':Math.floor(j/cols)*(iH+iR)
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

			//动态生成a标签
			var oFrag = document.createDocumentFragment();

			for(var i=0;i<_this.desk_num;i++){
				var oA = document.createElement('a');
				oA.setAttribute('href','javascript:void(0);');
				oA.innerHTML = i+1;
				oFrag.appendChild(oA);
			}
			_this.pageNumber.appendChild(oFrag);

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
		/**
		 * [setSideBar 设置侧栏，动态添加数据]
		 */
		setSideBar:function(){
			var _this = this;
			var side_bar_app = _this.sideBar.getElementsByClassName('side_bar_app')[0];
			var aSideNavData = _this.jsonData.aSideNavData;
			var sideBarAppNum = _this.jsonData.aSideNavData.length;
			var oFrag = document.createDocumentFragment();
			for(var i=0;i<sideBarAppNum;i++){
				var oDiv = document.createElement('div');
				oDiv.setAttribute('class','side_bar_app_ico_wrap');
				oDiv.setAttribute('_href',aSideNavData[i].openUrl);
				oDiv.setAttribute('title',aSideNavData[i].appName);
				oDiv.innerHTML = '<div class="mask"></div><img class="side_bar_app_ico" src="'+aSideNavData[i].imgUrl+'"/>';
				oFrag.appendChild(oDiv);
			}
			side_bar_app.appendChild(oFrag);
			//side_bar_app.style.height = oDiv.offsetHeight+oDiv.offsetTop+'px';
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
		/*
		app详情页面
		 */
		createAppWin:function(){
			var _this = this;
			for(var i=0;i<_this.sub_desk.length;i++){
				var apps = _this.sub_desk[i].getElementsByClassName(_this.appSelector);
				var pos = [];
				for(var j=0;j<apps.length;j++){
					apps[j].ondblclick = function(){
						var json = {
							'title':this.title,
							'href':this.getAttribute('_href')
						};
						console.log(json);
						var win = new Window(json);
						win.win.style.zIndex = ++_this.minZIndex;
					};
				}
			}
		},
		/**
		 * [createSideAppWin 侧栏弹窗]
		 * @return {[type]} [description]
		 */
		createSideAppWin:function(){
			var _this = this;

			var side_bar_app_ico_wrap = _this.sideBar.getElementsByClassName('side_bar_app_ico_wrap');
			var length = side_bar_app_ico_wrap.length;
			for(var i=0;i<length;i++){
				side_bar_app_ico_wrap[i].ondblclick = function(){
					var json = {
						'title':this.title,
						'href':this.getAttribute('_href')
					};
					var win = new Window(json);
				};
			}
		},
		/**
		 * [setAppDrag 设置app拖拽]
		 */
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
		/**
		 * [setTextMenu 右键菜单]
		 */
		setTextMenu:function(){
			var _this = this;
			//排序方式写入cookie
			if(getCookies('sortType')===null){
				setCookies('sortType',_this.sortType);
			}
			//图标类型
			if(getCookies('iconType') ===null){
				setCookies('iconType',_this.iconType);
			}
			//创建列表
			var menuData = _this.jsonData.menuData;
			var oFrag = document.createDocumentFragment();
			for(var i=0;i<menuData.length;i++){

				var oFrag1 = document.createDocumentFragment();
				for(var j=0;j<menuData[i].length;j++){
					var oLi = document.createElement('li');
					oLi.innerHTML = menuData[i][j].name;
					oLi.setAttribute('class','textMenu_item');
					addClass(oLi,menuData[i][j].clas);

					if(menuData[i][j].arrow){
						var oSpan = document.createElement('span');
						_this.hasSubNode.push(menuData[i][j].clas);
						oSpan.setAttribute('class','icon-point-right');
						addClass(oSpan,'arrow');
						oLi.appendChild(oSpan);

						var subNode = menuData[i][j].subNode;
						var oFrag2 = document.createDocumentFragment();
						var ol = document.createElement('ol');

						ol.setAttribute('class','subNode');
						for(var k=0;k<subNode.length;k++){
							var oSubNodeLi = document.createElement('li');
							oSubNodeLi.innerHTML = subNode[k].name;
							if(menuData[i][j].clas == 'sort'){
								if(k == parseInt(getCookies('sortType'))){
									//alert(parseInt(getCookies('sortType')))
									addClass(oSubNodeLi,'selected');
								}
							}else if(menuData[i][j].clas == 'icon'){
								if(k == parseInt(getCookies('iconType'))){
									//alert(parseInt(getCookies('sortType')))
									addClass(oSubNodeLi,'selected');
								}
							}
							oFrag2.appendChild(oSubNodeLi);
						}
						ol.appendChild(oFrag2);
						oLi.appendChild(ol);
						oLi.onmouseover = (function(ol){
							return function(){
								ol.style.display = 'block';
							}
						})(ol);
						oLi.onmouseout = (function(ol){
							return function(){
								ol.style.display = 'none';
							}
						})(ol);
					}
					if(j==menuData[i].length-1){
						addClass(oLi,'line');
					}
					oFrag.appendChild(oLi);
					console.log(getCookies('sortType'))
				}
			}
			_this.textMenu.appendChild(oFrag);

			//子菜单点击事件
			var subNodeClass = _this.hasSubNode;
			var parents = [];
			for(var i=0;i<subNodeClass.length;i++){
				var parent = document.getElementsByClassName(subNodeClass[i])[0].getElementsByTagName('ol')[0];
				parents.push(parent);
				for(var j=0;j<parent.childNodes.length;j++){
					parent.childNodes[j].onclick = (function(i,j){
						return function(){
							removeClass(parents[i].childNodes,'selected');
							addClass(parents[i].childNodes[j],'selected');
							if(this.parentNode.parentNode.className.match('sort')){
								setCookies('sortType',j);
								_this.setAppPos();
							}
							if(this.parentNode.parentNode.className.match('icon')){
								setCookies('iconType',j);
								_this.setAppPos();
							}
						};
					})(i,j);
				}
			}
			//console.log(typeof parent.getElementsByTagName('li'));
			
		},
		setAppTextMenu:function(target,x,y,zIndex){
			var _this = this;
			var appTextMenu = jsonData.menuData2;

			removeAllChildren(_this.appTextMenu);
			var oFrag = document.createDocumentFragment();
			for(var i=0;i<appTextMenu.length;i++){
				for(var k=0;k<appTextMenu[i].length;k++){
					var oLi = document.createElement('li');
					oLi.setAttribute('class','textMenu_item');
					addClass(oLi,appTextMenu[i][k].clas);
					oLi.innerHTML = appTextMenu[i][k].name;

					if(appTextMenu[i][k].clas == 'openApp'){
						var json = {
							'title':target.getAttribute('title'),
							'href':target.getAttribute('_href')
						};
							
						oLi.onclick = function(){
							new Window(json);
						};	
					}
					if(appTextMenu[i][k].clas == 'delApp'){
						
						oLi.onclick = function(){
							_this.sub_desk[_this.desk_index].children[0].removeChild(target);
							_this.setAppPos();
							_this.setAppDrag();
						}
					}

					if(appTextMenu[i][k].arrow){
						var oSpan = document.createElement('span');
						oSpan.setAttribute('class','icon-point-right');
						addClass(oSpan,'arrow');
						oLi.appendChild(oSpan);
						oLi.onmouseover = function(){
							var subNode = this.getElementsByClassName('subNode')[0];
							subNode.style.display = 'block';
						};
						oLi.onmouseout = function(){
							var subNode = this.getElementsByClassName('subNode')[0];
							subNode.style.display = 'none';
						};
						var oFrag1 = document.createDocumentFragment();
						var subNode = appTextMenu[i][k].subNode;
						var ol = document.createElement('ol');
						ol.setAttribute('class','subNode');

						for(var j=0;j<subNode.length;j++){
							var oSubNodeLi = document.createElement('li');
							oSubNodeLi.innerHTML = subNode[j].name;
							addClass(oSubNodeLi,subNode[j].clas);
							if(j == _this.desk_index){
								addClass(oSubNodeLi,'no-select');
							}else{
								oSubNodeLi.onclick = (function(j){
									return function(){
										_this.sub_desk[j].getElementsByClassName('sub_desk_wrap')[0].appendChild(target);
										//_this.sub_desk[_this.desk_index].removeChild(target);
										_this.setAppPos();
										_this.setAppDrag();
									}
								})(j);
									
							}

							oFrag1.appendChild(oSubNodeLi);
							
						}
						ol.appendChild(oFrag1);
						oLi.appendChild(ol);
					}
					oFrag.appendChild(oLi);
				}
			}
			_this.appTextMenu.appendChild(oFrag);
			_this.appTextMenu.style.left = x+'px';
			_this.appTextMenu.style.top = y+'px';
			_this.appTextMenu.style.zIndex = zIndex;
		}, 
		bind:function(){
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
			document.oncontextmenu = function(e){
				//alert(1);
				var e = e || window.event;
				var target = e.target || e.srcElement;
				//console.log(target);
				var x = e.clientX;
				var y = e.clientY;

				if(target.parentNode.className == _this.appImg || target.className == _this.appName){
					_this.textMenu.style.display = 'none';
					_this.appTextMenu.style.display = 'block';
					/*_this.appTextMenu.style.left = x+'px';
					_this.appTextMenu.style.top = y+'px';
					_this.appTextMenu.style.zIndex = ++_this.minZIndex;*/
					var obj = parentUntill(target,'.desk_app');
					console.log(obj)
					_this.setAppTextMenu(obj,x,y,++_this.minZIndex);
				}else{
					_this.appTextMenu.style.display = 'none';
					_this.textMenu.style.display = 'block';
					_this.textMenu.style.left = x+'px';
					_this.textMenu.style.top = y+'px';
					_this.textMenu.style.zIndex = ++_this.minZIndex;
				}
				return false;
			};
		},
		/*
		设置背景图片
		 */
		setSkin:function(){
			var _this = this;
			var skinDiv = document.getElementsByClassName('skin')[0];	//皮肤设置区域
			var skinSetBtn = document.getElementsByClassName('pannel')[0];//皮肤设置按钮
			var oClose = skinDiv.getElementsByClassName('close')[0];
			var scrollBar = skinDiv.getElementsByClassName('scrollBar')[0];
			_this.scrollBar_item = skinDiv.getElementsByClassName('scrollBar_item')[0];
			_this.bg = skinDiv.getElementsByClassName('bg')[0];
			var pos = [];

			//添加数据
			var bgWinData = _this.jsonData.bgWinData;
			var length = bgWinData.length;
			_this.defaultSkin = bgWinData[0].imgUrl;
			if(getCookies('skin') === null){
				setCookies('skin',_this.defaultSkin);
			}
			var skin = getCookies('skin');
			_this.deskTop.style.background = 'url('+skin+') no-repeat center center';
			_this.deskTop.style.backgroundSize = 'cover';
			//_this.deskTop.style.background = 'url('+src+') no-repeat center center';
			var oFrag = document.createDocumentFragment();
			for(var i=0;i<length;i++){
				var oDl = document.createElement('dl');
				oDl.setAttribute('class','bg_item');
				oDl.setAttribute('_src',bgWinData[i].imgUrl);
				oDl.innerHTML = '<dd class="bg_pic"><img src="'+bgWinData[i].imgUrl+'"/></dd><dt class="bg_name">'+bgWinData[i].name+'</dt>';
				oFrag.appendChild(oDl);
			}
			_this.bg.appendChild(oFrag);
			var items = skinDiv.getElementsByClassName('bg_item');
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
					this.style.zIndex = ++_this.minZIndex;
				};
				items[i].onclick = function(){
					var src = this.getAttribute('_src');
					//console.log(_this.desk_main.parentNode);
					setCookies('skin',src);
					_this.deskTop.style.background = 'url('+src+') no-repeat center center';
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
	            stopBubble(e);//阻止事件冒泡，防止拖拽的时候拖动整个框
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
				popMenu.style.zIndex = ++_this.minZIndex;
				startMove(popMenu,{
					'left':popMenu.parentNode.offsetWidth + 10
				},300,'Back easeInOut');
			};
			oExit.onclick = function(){
				startMove(popMenu,{
					'left':-popMenu.offsetWidth
				},300,'Back easeInOut');
			};
		},
		initAudioPlayer:function(){
			var _this = this;
			var musicData = _this.jsonData.musicData;
			var json = {
				'num':musicData.length,
				'list':musicData
			}
			_this.audioPlayer = new AudioPlayer(json);

		},
		/**
		 * [createClock 创建时钟]
		 * @return {[type]} [description]
		 */
		createClock:function(){
			var _this = this;
			var originX = 110;
			var originY = 110;
			var height = 240;
			var width = 240;
			//var radius = 100;

			_this.clock = document.getElementById('clock');
			var ctx = _this.clock.getContext('2d');
			var timer = null;

			drawClock();
			timer = setInterval(function(){
				ctx.clearRect(0,0,height,width);
				drawClock();
			},1000);
			drag(_this.clock,null,false);
			/**
			 * [drawClock 绘制时钟]
			 * @return {[type]} [description]
			 */
			function drawClock(){
				drawShell();
				drawMark();
				drawHand();
				ctx.save();
				ctx.beginPath();
				ctx.arc(originY,originY,5,0,2*Math.PI);
				ctx.fillStyle = '#E35959';
				ctx.fill();
				ctx.restore();
			}
			/**
			 * [drawShell 绘制外壳]
			 * @return {[type]} [description]
			 */
			function drawShell(){
				ctx.beginPath();
				ctx.arc(originX,originY,100,0,2*Math.PI);
				ctx.save();
				ctx.shadowColor = 'black';
				ctx.shadowBlur = 10;
				ctx.fillStyle = '#84E0F9';
				ctx.fill();
				ctx.restore();

				ctx.beginPath();
				ctx.arc(originX,originY,80,0,2*Math.PI);
				ctx.fillStyle = '#7DA9B3';
				ctx.fill();

				ctx.save();
				for(var i=0;i<60;i++){
					ctx.beginPath();
					var startX = originX + 80*Math.cos(6*i*Math.PI/180);
					var startY = originY + 80*Math.sin(6*i*Math.PI/180);
					if(i%5 == 0){
						var endX = originX + 72*Math.cos(6*i*Math.PI/180);
						var endY = originY + 72*Math.sin(6*i*Math.PI/180);
					}else{
						var endX = originX + 77*Math.cos(6*i*Math.PI/180);
						var endY = originY + 77*Math.sin(6*i*Math.PI/180);
					}
					ctx.moveTo(startX,startY);
					ctx.lineWidth = 3;
					//ctx.lineCap = 'round';
					ctx.strokeStyle = '#5F5F5F';
					ctx.lineTo(endX,endY);
					ctx.stroke();
				}
				ctx.restore();
			}
			/**
			 * [drawMark 绘制刻度]
			 * @return {[type]} [description]
			 */
			function drawMark(){
				ctx.save();
				//画刻度
				for(var i=0;i<12;i++){
					ctx.beginPath();
					var startX = originX + 60*Math.cos((30*i-60)*Math.PI/180);
					var startY = originY + 60*Math.sin((30*i-60)*Math.PI/180);
					ctx.fillStyle = '#5AF11F';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.font = '12px 微软雅黑';
					ctx.fillText(i+1,startX,startY,8);
					ctx.fill();
				}
				ctx.restore();
			}
			/**
			 * [drawHand 绘制指针]
			 * @return {[type]} [description]
			 */
			function drawHand(){
				var myDate = new Date();
				var hours = myDate.getHours();
				var minutes = myDate.getMinutes();
				var seconds = myDate.getSeconds(); 

				ctx.save();
				//时针
				ctx.beginPath();
				var posX = originX + 30*Math.cos((hours*30-90)*Math.PI/180);
				var posY = originY + 30*Math.sin((hours*30-90)*Math.PI/180);
				ctx.moveTo(originX,originY);
				ctx.lineTo(posX,posY);
				ctx.strokeStyle = '#F7F4F4';
				ctx.lineWidth = 4;
				ctx.stroke();
				ctx.restore();

				ctx.save();
				//分针
				ctx.beginPath();
				var posX = originX + 40*Math.cos((minutes*6-90)*Math.PI/180);
				var posY = originY + 40*Math.sin((minutes*6-90)*Math.PI/180);
				ctx.moveTo(originX,originY);
				ctx.lineTo(posX,posY);
				ctx.strokeStyle = '#F7F4F4';
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.restore();

				ctx.save();
				//秒针
				ctx.beginPath();
				var posX = originX + 55*Math.cos((seconds*6-90)*Math.PI/180);
				var posY = originY + 55*Math.sin((seconds*6-90)*Math.PI/180);
				ctx.moveTo(originX,originY);
				ctx.lineTo(posX,posY);
				ctx.strokeStyle = '#C82C2C';
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.restore();
			}
		}
	};

	return {
        getInstance:getInstance
    };
})();