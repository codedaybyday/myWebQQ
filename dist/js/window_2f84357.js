function Window(i){this.height=400,this.width=560,this.popWinClass="popWin",this.win=null,this.json=i,this.init()}Window.prototype={init:function(){var i=this;i.createWin(),i.winDrag(),i.doMax(),i.doMin(),i.closeWin()},createWin:function(){var i=this,t=document.createElement("div"),n='<h2 class="win_title"><span class="win_text">'+i.json.title+'</span><span class="close" title="关闭">关闭</span><span class="max" title="最大化">最大化</span><span class="min" title="最小化">最小化</span></h2><div class="frame_wrap"><iframe src="'+i.json.href+'"></iframe></div>';t.innerHTML=n,t.setAttribute("class","popWin"),document.getElementById("desk-top").appendChild(t),t.style.left=(viewW()-t.offsetWidth)/2+"px",i.win=t,startMove(i.win,{top:(viewH()-i.win.offsetHeight)/2},600,"Back easeInOut")},winDrag:function(){var i=this;drag(i.win,null,!1)},doMax:function(){var i=this,t=i.win.getElementsByClassName("max")[0];t.onclick=function(){startMove(i.win,{height:viewH(),width:viewW(),left:0,top:0},300,"Linear")}},doMin:function(){var i=this,t=i.win.getElementsByClassName("min")[0];t.onclick=function(){startMove(i.win,{left:(viewW()-i.width)/2,top:(viewH()-i.height)/2,height:i.height,width:i.width},300,"Linear")}},closeWin:function(){var i=this,t=i.win.getElementsByClassName("close")[0];t.onclick=function(){startMove(i.win,{opacity:0},300,"Quad easeOut",function(){document.getElementById("desk-top").removeChild(i.win)})}}};