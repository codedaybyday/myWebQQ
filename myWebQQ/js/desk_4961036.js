var desk=function(){function getInstance(e){return void 0===unique&&(unique=new Desk(e)),unique}function Desk(e){this.jsonData=e,this.deskTop=document.getElementById("desk-top"),this.desk_main=this.deskTop.getElementsByClassName("desk_main")[0],this.desk_top_navbar=this.deskTop.getElementsByClassName("desk_top_navbar")[0],this.sub_desk=null,this.desk_num=this.jsonData.aDeskMap.length,this.desk_index=this.desk_oldindex=0,this.pageNumber=this.deskTop.getElementsByClassName("pageNumber")[0],this.aA=this.pageNumber.getElementsByTagName("a"),this.desk_top_navbar_wrap=this.deskTop.getElementsByClassName("desk_top_navbar_wrap")[0],this.tool=this.deskTop.getElementsByClassName("tool")[0],this.user=this.deskTop.getElementsByClassName("user")[0],this.iTop=30,this.iRight=40,this.appSelector="desk_app",this.appHeight=88,this.appWidth=88,this.sortType=0,this.iconType=0,this.deskHeight=0,this.deskWidth=0,this.minZIndex=1e3,this.textMenuHtml="",this.textMenu=this.deskTop.getElementsByClassName("textMenu")[0],this.appTextMenu=this.deskTop.getElementsByClassName("appTextMenu")[0],this.appName="app_name",this.appImg="app_img",this.sideBar=this.deskTop.getElementsByClassName("side_bar")[0],this.isAcitive=!1,this.scrollBar_item=null,this.bg=null,this.defaultSkin="",this.scrollSpeed=10,this.clock=null,this.audioPlayer=null,this.hasSubNode=[],this.iconConfig=[{iW:88,iH:88,iR:40,iT:30,iMarT:8,iPadLR:6,iHeight:20,iLineH:18},{iW:78,iH:78,iR:30,iT:20,iMarT:8,iPadLR:4,iHeight:18,iLineH:16},{iW:108,iH:108,iR:50,iT:30,iMarT:8,iPadLR:8,iHeight:20,iLineH:18}],this.doInit()}var unique;return Desk.prototype={constructor:"Desk",doInit:function(){this.createSubDesk(),this.setLayer(),this.setNumNavBar(),this.setSideBar(),this.setScroll(),this.setAppPos(),this.setAppDrag(),this.setTextMenu(),this.bind(),this.setSkin(),this.sideBarPop(),this.createAppWin(),this.createSideAppWin(),this.createClock(),this.initAudioPlayer(),this.resize()},resize:function(){var e=this;document.body.onresize=function(){e.setLayer(),e.createSubDesk(),e.setAppPos()}},createSubDesk:function(){for(var e=this,t=e.jsonData.aDeskMap,s=document.createDocumentFragment(),i=0;i<e.desk_num;i++){for(var n=document.createDocumentFragment(),a=t[i].aDeskData,o=t[i].aDeskData.length,l=0;o>l;l++){var r=document.createElement("li");r.setAttribute("class","desk_app"),r.setAttribute("_href",a[l].deskOpenUrl),r.setAttribute("title",a[l].deskAppName),r.innerHTML='<div class="mask"></div><div class="app"><div class="app_img"><img src="'+a[l].deskAppUrl+'"/></div><span class="app_name">'+a[l].deskAppName+"</span></div>",n.appendChild(r)}var d=document.createElement("div"),c=document.createElement("ul");d.setAttribute("class","sub_desk"),c.setAttribute("class","sub_desk_wrap"),c.appendChild(n),d.appendChild(c),s.appendChild(d)}e.desk_main.appendChild(s),e.sub_desk=document.getElementsByClassName("sub_desk"),e.deskHeight=viewH()-e.sub_desk[0].getBoundingClientRect().top,e.deskWidth=e.sub_desk[0].offsetWidth},setLayer:function(){var _this=this,top=_this.desk_main.offsetTop;with(_this.desk_main.style)position="absolute",width=100*this.desk_num+"%",left=0,top+="px",height=viewH()-_this.desk_top_navbar.offsetHeight-_this.desk_top_navbar.offsetTop+"px";for(var width=parseInt(1/_this.desk_num*100),i=0;i<_this.desk_num;i++)_this.sub_desk[i].style.width=width+"%"},setAppPos:function(){var _this=this;null===getCookies("iconType")&&setCookies("iconType",_this.iconType),null===getCookies("sortType")&&setCookies("sortType",_this.sortType);for(var sortType=getCookies("sortType"),iconType=parseInt(getCookies("iconType")),jsonIconConf=_this.iconConfig[iconType],iH=parseInt(jsonIconConf.iH),iW=parseInt(jsonIconConf.iW),iR=parseInt(jsonIconConf.iR),iT=parseInt(jsonIconConf.iT),rows=Math.floor(_this.deskHeight/(iH+iT)),cols=Math.floor(_this.deskWidth/(iW+iR)),i=0;i<_this.sub_desk.length;i++){for(var apps=_this.sub_desk[i].getElementsByClassName(_this.appSelector),pos=[],j=0;j<apps.length;j++){var app_img=apps[j].getElementsByClassName("app_img")[0],app_name=apps[j].getElementsByClassName("app_name")[0];with(apps[j].style)width=jsonIconConf.iW+"px",height=jsonIconConf.iH+"px",position="absolute";with(app_name.style)paddingLeft=jsonIconConf.iPadLR+"px",paddingRight=jsonIconConf.iPadLR+"px",height=jsonIconConf.iHeight+"px",lineHeight=jsonIconConf.iLineH+"px";with(app_img.style)width=jsonIconConf.iH-28-app_name.offsetHeight+"px",height=jsonIconConf.iH-28-app_name.offsetHeight+"px";pos.push(0==sortType?{left:Math.floor(j/rows)*(iW+iR),top:j%rows*(iH+iT)}:{left:j%cols*(iW+iR),top:Math.floor(j/cols)*(iH+iR)})}for(var j=0;j<apps.length;j++)startMove(apps[j],pos[j],300,"Linear")}},setNumNavBar:function(){for(var e=this,t=document.createDocumentFragment(),s=0;s<e.desk_num;s++){var i=document.createElement("a");i.setAttribute("href","javascript:void(0);"),i.innerHTML=s+1,t.appendChild(i)}e.pageNumber.appendChild(t),e.desk_top_navbar_wrap.style.width=e.user.offsetWidth+e.pageNumber.offsetWidth+e.tool.offsetWidth+"px";for(var s=0;s<e.aA.length;s++)e.aA[s].onclick=function(t){return function(){e.aA[e.desk_oldindex].className="",e.aA[t].className="on",e.desk_index=t,e.desk_oldindex=e.desk_index,startMove(e.desk_main,{left:-viewW()*t},300,"Linear")}}(s)},setSideBar:function(){for(var e=this,t=e.sideBar.getElementsByClassName("side_bar_app")[0],s=e.jsonData.aSideNavData,i=e.jsonData.aSideNavData.length,n=document.createDocumentFragment(),a=0;i>a;a++){var o=document.createElement("div");o.setAttribute("class","side_bar_app_ico_wrap"),o.setAttribute("_href",s[a].openUrl),o.setAttribute("title",s[a].appName),o.innerHTML='<div class="mask"></div><img class="side_bar_app_ico" src="'+s[a].imgUrl+'"/>',n.appendChild(o)}t.appendChild(n)},setScroll:function(){function e(e){var e=e||window.event,t=0,i=-e.wheelDelta/120||e.detail/3;if(s.isAcitive){console.log(i),t=s.scrollBar_item.offsetTop,i>0?t+=s.scrollSpeed:t-=s.scrollSpeed,0>t?t=0:t>s.scrollBar_item.parentNode.offsetHeight-s.scrollBar_item.offsetHeight&&(t=s.scrollBar_item.parentNode.offsetHeight-s.scrollBar_item.offsetHeight);var n=t/(s.scrollBar_item.parentNode.offsetHeight-s.scrollBar_item.offsetHeight);s.bg.style.top=-(s.bg.offsetHeight-s.scrollBar_item.parentNode.offsetHeight)*n+"px",s.scrollBar_item.style.top=t+"px"}else i>0?(s.desk_index++,s.desk_index==s.desk_num&&(s.desk_index=0)):(s.desk_index--,s.desk_index<0&&(s.desk_index=s.desk_num-1)),s.aA[s.desk_oldindex].className="",s.aA[s.desk_index].className="on",s.desk_oldindex=s.desk_index,startMove(s.desk_main,{left:-viewW()*s.desk_index},300,"Back easeOut")}function t(e,t,s){return i[e]&&(clearTimeout(i[e]),delete i[e]),i[e]=setTimeout(function(){t(),delete i[e]},s)}var s=this;addEvent(document,"mousewheel",function(i){s.isAcitive?e(i):t("id",function(){e(i)},300)}),addEvent(document,"DOMMouseScroll",function(i){s.isAcitive?e(i):t("id",function(){e(i)},300)});var i={}},createAppWin:function(){for(var e=this,t=0;t<e.sub_desk.length;t++)for(var s=e.sub_desk[t].getElementsByClassName(e.appSelector),i=0;i<s.length;i++)s[i].ondblclick=function(){var t={title:this.title,href:this.getAttribute("_href")};console.log(t);var s=new Window(t);s.win.style.zIndex=++e.minZIndex}},createSideAppWin:function(){for(var e=this,t=e.sideBar.getElementsByClassName("side_bar_app_ico_wrap"),s=t.length,i=0;s>i;i++)t[i].ondblclick=function(){{var e={title:this.title,href:this.getAttribute("_href")};new Window(e)}}},setAppDrag:function(){for(var e=this,t=0;t<e.sub_desk.length;t++)for(var s=e.sub_desk[t].getElementsByClassName(e.appSelector),i=0;i<s.length;i++)drag(s[i],s,!0)},setTextMenu:function(){var e=this;null===getCookies("sortType")&&setCookies("sortType",e.sortType),null===getCookies("iconType")&&setCookies("iconType",e.iconType);for(var t=e.jsonData.menuData,s=document.createDocumentFragment(),i=0;i<t.length;i++)for(var n=(document.createDocumentFragment(),0);n<t[i].length;n++){var a=document.createElement("li");if(a.innerHTML=t[i][n].name,a.setAttribute("class","textMenu_item"),addClass(a,t[i][n].clas),t[i][n].arrow){var o=document.createElement("span");e.hasSubNode.push(t[i][n].clas),o.setAttribute("class","icon-point-right"),addClass(o,"arrow"),a.appendChild(o);var l=t[i][n].subNode,r=document.createDocumentFragment(),d=document.createElement("ol");d.setAttribute("class","subNode");for(var c=0;c<l.length;c++){var p=document.createElement("li");p.innerHTML=l[c].name,"sort"==t[i][n].clas?c==parseInt(getCookies("sortType"))&&addClass(p,"selected"):"icon"==t[i][n].clas&&c==parseInt(getCookies("iconType"))&&addClass(p,"selected"),r.appendChild(p)}d.appendChild(r),a.appendChild(d),a.onmouseover=function(e){return function(){e.style.display="block"}}(d),a.onmouseout=function(e){return function(){e.style.display="none"}}(d)}n==t[i].length-1&&addClass(a,"line"),s.appendChild(a),console.log(getCookies("sortType"))}e.textMenu.appendChild(s);for(var h=e.hasSubNode,u=[],i=0;i<h.length;i++){var m=document.getElementsByClassName(h[i])[0].getElementsByTagName("ol")[0];u.push(m);for(var n=0;n<m.childNodes.length;n++)m.childNodes[n].onclick=function(t,s){return function(){removeClass(u[t].childNodes,"selected"),addClass(u[t].childNodes[s],"selected"),this.parentNode.parentNode.className.match("sort")&&(setCookies("sortType",s),e.setAppPos()),this.parentNode.parentNode.className.match("icon")&&(setCookies("iconType",s),e.setAppPos())}}(i,n)}},setAppTextMenu:function(e,t,s,i){var n=this,a=jsonData.menuData2;removeAllChildren(n.appTextMenu);for(var o=document.createDocumentFragment(),l=0;l<a.length;l++)for(var r=0;r<a[l].length;r++){var d=document.createElement("li");if(d.setAttribute("class","textMenu_item"),addClass(d,a[l][r].clas),d.innerHTML=a[l][r].name,"openApp"==a[l][r].clas){var c={title:e.getAttribute("title"),href:e.getAttribute("_href")};d.onclick=function(){new Window(c)}}if("delApp"==a[l][r].clas&&(d.onclick=function(){n.sub_desk[n.desk_index].children[0].removeChild(e),n.setAppPos(),n.setAppDrag()}),a[l][r].arrow){var p=document.createElement("span");p.setAttribute("class","icon-point-right"),addClass(p,"arrow"),d.appendChild(p),d.onmouseover=function(){var e=this.getElementsByClassName("subNode")[0];e.style.display="block"},d.onmouseout=function(){var e=this.getElementsByClassName("subNode")[0];e.style.display="none"};var h=document.createDocumentFragment(),u=a[l][r].subNode,m=document.createElement("ol");m.setAttribute("class","subNode");for(var f=0;f<u.length;f++){var g=document.createElement("li");g.innerHTML=u[f].name,addClass(g,u[f].clas),f==n.desk_index?addClass(g,"no-select"):g.onclick=function(t){return function(){n.sub_desk[t].getElementsByClassName("sub_desk_wrap")[0].appendChild(e),n.setAppPos(),n.setAppDrag()}}(f),h.appendChild(g)}m.appendChild(h),d.appendChild(m)}o.appendChild(d)}n.appTextMenu.appendChild(o),n.appTextMenu.style.left=t+"px",n.appTextMenu.style.top=s+"px",n.appTextMenu.style.zIndex=i},bind:function(){var e=this;document.onclick=function(t){var t=t||window.event,s=t.target||t.srcElement;s!=e.textMenu&&(e.textMenu.style.display="none"),s!=e.appTextMenu&&(e.appTextMenu.style.display="none")},document.oncontextmenu=function(t){var t=t||window.event,s=t.target||t.srcElement,i=t.clientX,n=t.clientY;if(s.parentNode.className==e.appImg||s.className==e.appName){e.textMenu.style.display="none",e.appTextMenu.style.display="block";var a=parentUntill(s,".desk_app");console.log(a),e.setAppTextMenu(a,i,n,++e.minZIndex)}else e.appTextMenu.style.display="none",e.textMenu.style.display="block",e.textMenu.style.left=i+"px",e.textMenu.style.top=n+"px",e.textMenu.style.zIndex=++e.minZIndex;return!1}},setSkin:function(){var _this=this,skinDiv=document.getElementsByClassName("skin")[0],skinSetBtn=document.getElementsByClassName("pannel")[0],oClose=skinDiv.getElementsByClassName("close")[0],scrollBar=skinDiv.getElementsByClassName("scrollBar")[0];_this.scrollBar_item=skinDiv.getElementsByClassName("scrollBar_item")[0],_this.bg=skinDiv.getElementsByClassName("bg")[0];var pos=[],bgWinData=_this.jsonData.bgWinData,length=bgWinData.length;_this.defaultSkin=bgWinData[0].imgUrl,null===getCookies("skin")&&setCookies("skin",_this.defaultSkin);var skin=getCookies("skin");_this.deskTop.style.background="url("+skin+") no-repeat center center",_this.deskTop.style.backgroundSize="cover";for(var oFrag=document.createDocumentFragment(),i=0;length>i;i++){var oDl=document.createElement("dl");oDl.setAttribute("class","bg_item"),oDl.setAttribute("_src",bgWinData[i].imgUrl),oDl.innerHTML='<dd class="bg_pic"><img src="'+bgWinData[i].imgUrl+'"/></dd><dt class="bg_name">'+bgWinData[i].name+"</dt>",oFrag.appendChild(oDl)}_this.bg.appendChild(oFrag);for(var items=skinDiv.getElementsByClassName("bg_item"),i=0;i<items.length;i++)pos.push({left:items[i].offsetLeft,top:items[i].offsetTop});skinDiv.style.left=(viewW()-skinDiv.offsetWidth)/2+"px",skinDiv.style.top=viewW()+skinDiv.offsetWidth+"px",skinSetBtn.onclick=function(){startMove(skinDiv,{top:(viewH()-skinDiv.offsetHeight)/2},300,"Back easeInOut",function(){_this.isAcitive=!0})},oClose.onclick=function(){startMove(skinDiv,{top:viewW()+skinDiv.offsetHeight},300,"Back easeInOut",function(){_this.isAcitive=!1})};for(var i=0;i<items.length;i++){with(items[i].style)position="absolute",left=pos[i].left+"px",top=pos[i].top+"px";items[i].onmouseover=function(){this.style.zIndex=++_this.minZIndex},items[i].onclick=function(){var e=this.getAttribute("_src");setCookies("skin",e),_this.deskTop.style.background="url("+e+") no-repeat center center",_this.deskTop.style.backgroundSize="cover"}}_this.bg.style.height=items[items.length-1].offsetHeight+items[items.length-1].offsetTop+"px",drag(skinDiv,null,!1,function(){_this.isAcitive=!0}),_this.scrollBar_item.onmousedown=function(e){var e=e||window.event,t=e.clientX-this.offsetLeft,s=e.clientY-this.offsetTop;_this.isAcitive=!0,stopBubble(e),document.onmousemove=function(e){var e=e||window.event,i=(e.clientX-t,e.clientY-s);0>i?i=0:i>scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight&&(i=scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight),scale=i/(scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight),_this.bg.style.top=-(_this.bg.offsetHeight-scrollBar.offsetHeight)*scale+"px",_this.scrollBar_item.style.top=i+"px"},document.onmouseup=function(){this.onmousemove=null,this.onmouseup=null}}},sideBarPop:function(){var e=this,t=e.sideBar.getElementsByClassName("q")[0],s=e.sideBar.getElementsByClassName("side_bar_menu")[0],i=e.sideBar.getElementsByClassName("exit")[0];t.onclick=function(){s.style.zIndex=++e.minZIndex,startMove(s,{left:s.parentNode.offsetWidth+10},300,"Back easeInOut")},i.onclick=function(){startMove(s,{left:-s.offsetWidth},300,"Back easeInOut")}},initAudioPlayer:function(){var e=this,t=e.jsonData.musicData,s={num:t.length,list:t};e.audioPlayer=new AudioPlayer(s)},createClock:function(){function e(){t(),s(),i(),d.save(),d.beginPath(),d.arc(o,o,5,0,2*Math.PI),d.fillStyle="#E35959",d.fill(),d.restore()}function t(){d.beginPath(),d.arc(a,o,100,0,2*Math.PI),d.save(),d.shadowColor="black",d.shadowBlur=10,d.fillStyle="#84E0F9",d.fill(),d.restore(),d.beginPath(),d.arc(a,o,80,0,2*Math.PI),d.fillStyle="#7DA9B3",d.fill(),d.save();for(var e=0;60>e;e++){d.beginPath();var t=a+80*Math.cos(6*e*Math.PI/180),s=o+80*Math.sin(6*e*Math.PI/180);if(e%5==0)var i=a+72*Math.cos(6*e*Math.PI/180),n=o+72*Math.sin(6*e*Math.PI/180);else var i=a+77*Math.cos(6*e*Math.PI/180),n=o+77*Math.sin(6*e*Math.PI/180);d.moveTo(t,s),d.lineWidth=3,d.strokeStyle="#5F5F5F",d.lineTo(i,n),d.stroke()}d.restore()}function s(){d.save();for(var e=0;12>e;e++){d.beginPath();var t=a+60*Math.cos((30*e-60)*Math.PI/180),s=o+60*Math.sin((30*e-60)*Math.PI/180);d.fillStyle="#5AF11F",d.textAlign="center",d.textBaseline="middle",d.font="12px 微软雅黑",d.fillText(e+1,t,s,8),d.fill()}d.restore()}function i(){var e=new Date,t=e.getHours(),s=e.getMinutes(),i=e.getSeconds();d.save(),d.beginPath();var n=a+30*Math.cos((30*t-90)*Math.PI/180),l=o+30*Math.sin((30*t-90)*Math.PI/180);d.moveTo(a,o),d.lineTo(n,l),d.strokeStyle="#F7F4F4",d.lineWidth=4,d.stroke(),d.restore(),d.save(),d.beginPath();var n=a+40*Math.cos((6*s-90)*Math.PI/180),l=o+40*Math.sin((6*s-90)*Math.PI/180);d.moveTo(a,o),d.lineTo(n,l),d.strokeStyle="#F7F4F4",d.lineWidth=2,d.stroke(),d.restore(),d.save(),d.beginPath();var n=a+55*Math.cos((6*i-90)*Math.PI/180),l=o+55*Math.sin((6*i-90)*Math.PI/180);d.moveTo(a,o),d.lineTo(n,l),d.strokeStyle="#C82C2C",d.lineWidth=2,d.stroke(),d.restore()}var n=this,a=110,o=110,l=240,r=240;n.clock=document.getElementById("clock");var d=n.clock.getContext("2d"),c=null;e(),c=setInterval(function(){d.clearRect(0,0,l,r),e()},1e3),drag(n.clock,null,!1)}},{getInstance:getInstance}}();