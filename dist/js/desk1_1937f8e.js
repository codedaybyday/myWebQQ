function Desk(){this.desk_main=document.getElementsByClassName("desk_main")[0],this.desk_top_navbar=document.getElementsByClassName("desk_top_navbar")[0],this.sub_desk=document.getElementsByClassName("sub_desk"),this.desk_num=5,this.desk_index=this.desk_oldindex=0,this.pageNumber=document.getElementsByClassName("pageNumber")[0],this.aA=this.pageNumber.getElementsByTagName("a"),this.desk_top_navbar_wrap=document.getElementsByClassName("desk_top_navbar_wrap")[0],this.tool=document.getElementsByClassName("tool")[0],this.user=document.getElementsByClassName("user")[0],this.iTop=30,this.iRight=40,this.appSelector="desk_app",this.appHeight=88,this.appWidth=88,this.sortType=0,this.deskHeight=this.sub_desk[0].offsetHeight,this.deskWidth=this.sub_desk[0].offsetWidth,this.minZIndex=100,this.textMenuHtml="",this.textMenu=document.getElementsByClassName("textMenu")[0],this.appTextMenu=document.getElementsByClassName("appTextMenu")[0],this.appName="app_name",this.appImg="app_img",this.sideBar=document.getElementsByClassName("side_bar")[0],this.isAcitive=!1,this.scrollBar_item=null,this.bg=null,this.scrollSpeed=10,this.doInit()}Desk.prototype={constructor:"Desk",doInit:function(){this.setLayer(),this.setNumNavBar(),this.setScroll(),this.setAppPos(),this.setAppDrag(),this.setTextMenu(),this.blind(),this.setSkin(),this.sideBarPop()},setLayer:function(){var _this=this,top=_this.desk_main.offsetTop;with(_this.desk_main.style)position="absolute",width=100*this.desk_num+"%",left=0,top+="px",height=viewH()-_this.desk_top_navbar.offsetHeight-_this.desk_top_navbar.offsetTop+"px";for(var width=parseInt(1/_this.desk_num*100),i=0;i<_this.sub_desk.length;i++)_this.sub_desk[i].style.width=width+"%"},setAppPos:function(){for(var e=this,t=Math.floor(e.deskHeight/(e.iTop+e.appHeight)),s=Math.floor(e.deskWidth/(e.iRight+e.appWidth)),i=0;i<e.sub_desk.length;i++){for(var n=e.sub_desk[i].getElementsByClassName(e.appSelector),o=[],a=0;a<n.length;a++)n[a].style.position="absolute",o.push(0==e.sortType?{left:Math.floor(a/t)*(e.appWidth+e.iRight),top:a%t*(e.appHeight+e.iTop)}:{left:a%s*(e.appWidth+e.iRight),top:Math.floor(a/s)*(e.appHeight+e.iTop)});for(var a=0;a<n.length;a++)startMove(n[a],o[a],300,"Linear")}},setNumNavBar:function(){var e=this;e.desk_top_navbar_wrap.style.width=e.user.offsetWidth+e.pageNumber.offsetWidth+e.tool.offsetWidth+"px";for(var t=0;t<e.aA.length;t++)e.aA[t].onclick=function(t){return function(){e.aA[e.desk_oldindex].className="",e.aA[t].className="on",e.desk_index=t,e.desk_oldindex=e.desk_index,startMove(e.desk_main,{left:-viewW()*t},300,"Linear")}}(t)},setScroll:function(){function e(e){var e=e||window.event,t=0,i=-e.wheelDelta/120||e.detail/3;if(s.isAcitive){console.log(i),t=s.scrollBar_item.offsetTop,i>0?t+=s.scrollSpeed:t-=s.scrollSpeed,0>t?t=0:t>s.scrollBar_item.parentNode.offsetHeight-s.scrollBar_item.offsetHeight&&(t=s.scrollBar_item.parentNode.offsetHeight-s.scrollBar_item.offsetHeight);var n=t/(s.scrollBar_item.parentNode.offsetHeight-s.scrollBar_item.offsetHeight);s.bg.style.top=-(s.bg.offsetHeight-s.scrollBar_item.parentNode.offsetHeight)*n+"px",s.scrollBar_item.style.top=t+"px"}else i>0?(s.desk_index++,s.desk_index==s.desk_num&&(s.desk_index=0)):(s.desk_index--,s.desk_index<0&&(s.desk_index=s.desk_num-1)),s.aA[s.desk_oldindex].className="",s.aA[s.desk_index].className="on",s.desk_oldindex=s.desk_index,startMove(s.desk_main,{left:-viewW()*s.desk_index},300,"Back easeOut")}function t(e,t,s){return i[e]&&(clearTimeout(i[e]),delete i[e]),i[e]=setTimeout(function(){t(),delete i[e]},s)}var s=this;addEvent(document,"mousewheel",function(i){s.isAcitive?e(i):t("id",function(){e(i)},300)}),addEvent(document,"DOMMouseScroll",function(i){s.isAcitive?e(i):t("id",function(){e(i)},300)});var i={}},setAppDrag:function(){for(var e=this,t=0;t<e.sub_desk.length;t++)for(var s=e.sub_desk[t].getElementsByClassName(e.appSelector),i=0;i<s.length;i++)drag(s[i],s,!0)},setTextMenu:function(){var e=this;document.oncontextmenu=function(t){var t=t||window.event,s=t.target||t.srcElement;console.log(s);var i=t.clientX,n=t.clientY;return s.parentNode.className==e.appImg||s.className==e.appName?(e.textMenu.style.display="none",e.appTextMenu.style.display="block",e.appTextMenu.style.left=i+"px",e.appTextMenu.style.top=n+"px",e.appTextMenu.style.zIndex=e.minZIndex++):(e.appTextMenu.style.display="none",e.textMenu.style.display="block",e.textMenu.style.left=i+"px",e.textMenu.style.top=n+"px",e.textMenu.style.zIndex=e.minZIndex++),!1}},blind:function(){var e=this;document.onclick=function(t){var t=t||window.event,s=t.target||t.srcElement;s!=e.textMenu&&(e.textMenu.style.display="none"),s!=e.appTextMenu&&(e.appTextMenu.style.display="none")}},setSkin:function(){var _this=this,skinDiv=document.getElementsByClassName("skin")[0],skinSetBtn=document.getElementsByClassName("pannel")[0],items=skinDiv.getElementsByClassName("bg_item"),oClose=skinDiv.getElementsByClassName("close")[0],scrollBar=skinDiv.getElementsByClassName("scrollBar")[0];_this.scrollBar_item=skinDiv.getElementsByClassName("scrollBar_item")[0],_this.bg=skinDiv.getElementsByClassName("bg")[0];for(var pos=[],i=0;i<items.length;i++)pos.push({left:items[i].offsetLeft,top:items[i].offsetTop});skinDiv.style.left=(viewW()-skinDiv.offsetWidth)/2+"px",skinDiv.style.top=viewW()+skinDiv.offsetWidth+"px",skinSetBtn.onclick=function(){startMove(skinDiv,{top:(viewH()-skinDiv.offsetHeight)/2},300,"Back easeInOut",function(){_this.isAcitive=!0})},oClose.onclick=function(){startMove(skinDiv,{top:viewW()+skinDiv.offsetHeight},300,"Back easeInOut",function(){_this.isAcitive=!1})};for(var i=0;i<items.length;i++){with(items[i].style)position="absolute",left=pos[i].left+"px",top=pos[i].top+"px";items[i].onmouseover=function(){this.style.zIndex=_this.minZIndex++}}_this.bg.style.height=items[items.length-1].offsetHeight+items[items.length-1].offsetTop+"px",drag(skinDiv,null,!1,function(){_this.isAcitive=!0}),_this.scrollBar_item.onmousedown=function(e){var e=e||window.event,t=e.clientX-this.offsetLeft,s=e.clientY-this.offsetTop;_this.isAcitive=!0,stopBubble(),document.onmousemove=function(e){var e=e||window.event,i=(e.clientX-t,e.clientY-s);0>i?i=0:i>scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight&&(i=scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight),scale=i/(scrollBar.offsetHeight-_this.scrollBar_item.offsetHeight),_this.bg.style.top=-(_this.bg.offsetHeight-scrollBar.offsetHeight)*scale+"px",_this.scrollBar_item.style.top=i+"px"},document.onmouseup=function(){this.onmousemove=null,this.onmouseup=null}}},sideBarPop:function(){var e=this,t=e.sideBar.getElementsByClassName("q")[0],s=e.sideBar.getElementsByClassName("side_bar_menu")[0],i=e.sideBar.getElementsByClassName("exit")[0];t.onclick=function(){startMove(s,{left:s.parentNode.offsetWidth+10},300,"Back easeInOut")},i.onclick=function(){startMove(s,{left:-s.offsetWidth},300,"Back easeInOut")}}};