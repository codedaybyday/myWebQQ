/*
时间版运动框架
obj 运动对象
json 属性目标值
times 运动时间
fx 运动形式
fn 回调函数
 */
function startMove(obj,json,times,fx,fn){
	var fxArr = fx.split(' ');
	var fx1 = fxArr[0];
	var fx2 = fxArr[1];
	var cur = {};
	for( var attr in json){
		if(attr == 'opacity'){
			var val = parseInt(getStyle(obj,attr))*100;
		}else{
			var val = parseInt(getStyle(obj,attr));
		}
		//alert(val)
		cur[attr] = val;
	}
    //console.log(cur,json);
	var startTime = (new Date()).getTime();
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var changeTime = (new Date()).getTime();
		var t = changeTime - startTime;
		t = t>=times?times:t;
		for(var attr in json){
			if(attr == 'opacity'){
				var value = fxArr.length == 1?Tween[fx1](t,cur[attr],json[attr]*100-cur[attr]*100,times):Tween[fx1][fx2](t,cur[attr],json[attr]*100-cur[attr]*100,times);
			}else{
				var value = fxArr.length == 1?Tween[fx1](t,cur[attr],json[attr]-cur[attr],times):Tween[fx1][fx2](t,cur[attr],json[attr]-cur[attr],times);
			}
			if(attr == 'opacity'){
				obj.style.opacity = value/100;
				obj.style.filter = 'alpha(opacity='+value+')';
			}else{
				obj.style[attr] = value +'px';
                //console.log(value);
			}
		}
		//console.log(t,times);
		if(t == times){
			clearInterval(obj.timer);
			fn && fn.call(obj);
		}
	},20);
}
// Tween类
/*
t time 时间
b begin 初始值
c change 变化范围
d duration 总时间
 */
var Tween = {
    Linear: function(t,b,c,d){ return c*t/d + b; },
    Quad: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t,b,c,d){
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t,b,c,d){
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t,b,c,d){
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t,b,c,d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t,b,c,d){
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
        },
        easeInOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        }
    },
    Back: {
        easeIn: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158; 
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t,b,c,d){
            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t,b,c,d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOut: function(t,b,c,d){
            if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
            else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    }
};
/*
获取元素的css样式
 */
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:window.getComputedStyle(obj,null)[attr];
}
/*
获得可视区高度
 */
function viewH(){
	return document.documentElement.clientHeight;
}
/*
获得可视区宽度
 */
function viewW(){
	return document.documentElement.clientWidth;
}
/*
添加事件
 */
function addEvent(obj,type,fn){
	if(obj.attachEvent){
		obj.attachEvent('on'+type,function(){
            fn.call(obj);
        });
	}else{
		obj.addEventListener(type,fn,false);
	}
}
/*
移除事件
 */
function removeEvent(obj,type,fn){
	if(obj.detachEvent){
		obj.detachEVent('on'+type,fn);
	}else{
		obj.removeEventListener(type,fn);
	}
}
/*
获取制定的元素距离制定祖先元素的left值
 */
function offsetLeftUtill(obj,ancestor){
    var left = 0;
    do{
        left += obj.offsetLeft;
        obj = obj.parentNode;
        //alert(1)
    }while(obj == ancestor)
    console.log(obj,ancestor);
    return left;
}
/*
拖拽修改版
*/
var drag=(function(){
    var zindex = 100;
    return function(obj,map,isBack,callBack){
        obj.onmousedown = function(e){
            var e = e || window.event;
            var disX = e.clientX - obj.offsetLeft;
            var disY = e.clientY - obj.offsetTop;
            var pos = [];
            var collision = false;//是否碰撞到
            var indexArr = [];//记录与obj碰撞到的对象的索引
            //取消事件冒泡
            /*if(cancelBubble){
                stopBubble();
            }*/
            //console.log(obj.offsetLeft,obj.offsetTop);
            if(map){
                for(var i=0;i<map.length;i++){
                    map[i].index = i;
                    pos.push({
                        'left':map[i].offsetLeft,
                        'top':map[i].offsetTop
                    });
                }
            }
            obj.style.zIndex = zindex++;
            if(obj.setCapture){
                //console.log(1)
                obj.setCapture();
                obj.onmousemove = mouseMove
                obj.onmouseup = mouseUp;
            }else{
                document.onmousemove = mouseMove;
                document.onmouseup = mouseUp;
            }
            //e.preventDefault();
            return false;   

            function mouseMove(e){
                var e = e || window.event;
                var l = e.clientX - disX;
                var t = e.clientY - disY;
                if(obj.setCapture){
                    obj.setCapture();
                }
                //console.log(e.clientX,l,obj);
                if(l<=-obj.parentNode.getBoundingClientRect().left){
                    l = -obj.parentNode.getBoundingClientRect().left;
                }else if(l>= viewW()- obj.offsetWidth- obj.parentNode.getBoundingClientRect().left){
                    l = viewW()- obj.offsetWidth - obj.parentNode.getBoundingClientRect().left;
                }

                if(t<=-obj.parentNode.getBoundingClientRect().top){
                    t = -obj.parentNode.getBoundingClientRect().top;
                }else if(t>= viewH()- obj.offsetHeight- obj.parentNode.getBoundingClientRect().top){
                    t = viewH()- obj.offsetHeight - obj.parentNode.getBoundingClientRect().top;
                }
                /*if(limit){
                    if(limit.direction == 'vertical'){
                        if(t<parseInt(limit.from)){
                            t = parseInt(limit.from);
                        }else if(t>parseInt(limit.to)){
                            t = parseInt(limit.to)
                        }
                        obj.style.top = t + 'px';
                    }else if(limit.direction == 'horizantal'){
                        if(l<parseInt(limit.from)){
                            l = parseInt(limit.from);
                        }else if(l>parseInt(limit.to)){
                            l = parseInt(limit.to)
                        }
                        obj.style.left = l + 'px';
                    }
                }else{
                    obj.style.left = l + 'px';
                    obj.style.top = t + 'px';
                }*/
                obj.style.left = l + 'px';
                obj.style.top = t + 'px';
                //console.log(disX,obj.offsetLeft);
                if(map){
                    collision = false;
                    indexArr = [];
                    for(var i=0;i<map.length;i++){
                        if(map[i] != obj){
                            var l = obj.offsetLeft;
                            var t = obj.offsetTop;
                            var w = obj.offsetWidth;
                            var h = map[i].offsetHeight;
                            var l1 = map[i].offsetLeft;
                            var t1 = map[i].offsetTop;
                            var w1 = map[i].offsetWidth;
                            var h1 = map[i].offsetHeight;

                            if(l<l1&&l+w>l1&&t<t1&&t+h>t1 || l<l1+w1&&l+w>l1+w1&&t<t1&&t+h>t1 || l<l1&&l+w>l1&&t<t1+h1&&t+h>t1+h1 || l<l1+w1&&l+w>l1+w1&&t<t1+h1&&t+h>t1+h1){
                                collision = true;
                                //console.log(obj,map[i])
                                if(!inArray(indexArr,i)){
                                    indexArr.push(i);
                                }
                            }
                        }
                    }
                    //var json = {'left':200};
                    //console.log(typeof json)
                }
            }
            function mouseUp(){
                //console.log(pos[obj.index].left,pos[obj.index].top);
                if(collision&&map){
                    var oNearest = findNearest(obj,map,indexArr);
                    //console.log(oNearest.index,obj.index,pos[oNearest.index],pos[obj.index]);

                    //swap(pos[oNearest.index],pos[obj.index]);
                    //swap(oNearest.index,obj.index);
                    var json = {};
                    for(var attr in pos[oNearest.index]){
                        json[attr] = pos[oNearest.index][attr];
                    }
                    for(var attr in pos[obj.index]){
                        pos[oNearest.index][attr] = pos[obj.index][attr];
                    }
                    for(var attr in json){
                        pos[oNearest.index][attr] = json[attr];
                    }
                    var tmp = oNearest.index;
                    oNearest.index = obj.index;
                    obj.index = tmp;

                    //console.log(oNearest.index,obj.index,pos[oNearest.index],pos[obj.index]);
                    startMove(obj,{
                        'left':pos[obj.index].left,
                        'top':pos[obj.index].top
                    },300,'Linear');
                    startMove(oNearest,{
                        'left':pos[oNearest.index].left,
                        'top':pos[oNearest.index].top
                    },300,'Linear');
                }else{
                    if(isBack){
                        startMove(obj,{
                            'left':pos[obj.index].left,
                            'top':pos[obj.index].top
                        },300,'Linear');
                    }
                }
                if(obj.releaseCapture){
                    obj.releaseCapture();
                }
                callBack&&callBack();
                this.onmousemove = null;
                this.onmouseup = null;
            }
        };
    }
})(document);
/**
 * [findNearest 找到与obj碰撞到并且距离最近的元素]
 * @param  {[obj]} obj      [d当前对象]
 * @param  {[arr]} map      [与obj碰撞到的元素集合]
 * @param  {[arr]} indexArr [记录与obj碰撞到的元素的下标索引]
 * @return {[obj]}          [description]
 */
function findNearest(obj,map,indexArr){
    var minDis = 99999;
    var index = 0;
    var temp = 0;
    var where = -1;

    for(var i=0;i<indexArr.length;i++){
        index = indexArr[i];
        if(obj != map[index]){
            var x = obj.offsetLeft+obj.offsetWidth/2;
            var y = obj.offsetTop+obj.offsetHeight/2;
            var x1 = map[index].offsetLeft+map[index].offsetWidth/2;
            var y1 = map[index].offsetTop+map[index].offsetHeight/2;

            temp = Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1));
            if(temp<minDis){
                minDis = temp;
                where = index;
            }
        }
    }
    return map[where];

}
/*
检测数组中是否含该元素
 */
function inArray(arr,j){
    for(var i=0;i<arr.length;i++){
        if( j == arr[i]){
            return true;
        }
    }
    return false;
}
/*
两个引用类型的数据交换值,javascript里面不是按引用传递参数
 */
/*function swap(para1,para2){
    var temp;
    //console.log(para1,para2)
    if( 'object' == typeof para1 && 'object' == typeof para2){
        var json = {};
        for(attr in para1){
            json[attr] = para1[attr];
        }
        for(attr in para2){
            para1[attr] = para2[attr];
            //console.log(attr,para2[attr])
        }
        for(attr in json){
            para2[attr] = json[attr];
        }
    }
}*/
/*
将para2的内容复制到para1
 */
/*function copy(para1,para2){
    if( 'object' == typeof para1 && 'object' == typeof para2){
        for(attr in para2){
            para1[attr] = para2[attr];
            //console.log(attr,para2[attr])
        }
    }
}*/
/*
取消事件冒泡
 */
function stopBubble(e){
    var e = e || window.event;
    if(e&&e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble();
    }
}
/**
 * [addClass 给对象添加一个类]
 * @param {[type]} obj       [description]
 * @param {[type]} className [description]
 */
function addClass(obj,className){
    //var patt1=new RegExp("e");
    if(obj.length&&obj.length>0){
        for(var i=0;i<obj.length;i++){
            addClass(obj[i],className);//利用递归
        }
    }else{
        var allClass = obj&&obj.getAttribute('class');
        if(allClass){
            if(!allClass.match(className)){
                allClass += ' '+className+' ';
            }
            
        }else{
            allClass = className;
        }
        //console.log(allClass)
        obj.className = allClass;
    }
    //console.log(allClass)
}
/**
 * [removeClass 移除某个类]
 * @param  {[type]} obj       [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
function removeClass(obj,className){
    //var patt1=new RegExp("e");
    if(obj.length&&obj.length>0){
        for(var i=0;i<obj.length;i++){
            removeClass(obj[i],className);
        }
    }else{
        var allClass = obj.getAttribute('class');
        if(allClass&&allClass.match(className)){
            allClass = allClass.replace(className,'');
            obj.className = allClass;
        }
        //alert(allClass)
        //obj.setAttribute('class',allClass);
    }
}
/**
 * [setCookies 写入cookie]
 * @param {[type]} name  [description]
 * @param {[type]} value [description]
 */
function setCookies(name,value){
    var exp = new Date();
    exp.setTime(exp.getTime()+24*60*60*1000);
    document.cookie = name+'='+decodeURI(value)+';expires='+exp.toGMTString();
}
/**
 * [getCookies 读取cookie]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getCookies(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return decodeURIComponent(arr[2]);
    else
    return null;
}
/**
 * [find 查找后代子元素]
 * @param  {[type]} obj      [description]
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
function find(obj,selector){
    var type = selector.substring(0,1);
    var selectorStr = selector.substring(1);
    var elements = [];
    switch(type){
        case '.':
        elements = obj.getElementsByClassName(selectorStr);
        return elements.length>0?elements:null;
        break;
        case '#':
        elements = document.getElementById(selectorStr);
        while(elements.parentNode){
            console.log(elements.parentNode,obj);
            if(elements.parentNode == obj){
                return elements;
            }
            elements = elements.parentNode;
        }
        return null;
        break;
        default:
        elements = obj.getElementsByTagName(selector);
        return elements.length>0?elements:null;

    }
}
function parentUntill(child,pSelector){
    var type = pSelector.substring(0,1);
    var selectorStr = pSelector.substring(1);
    //var elements = null;
    //console.log(child,selectorStr)
    switch(type){
        case '.':
        while(child.parentNode){
            if(child.parentNode.className == selectorStr){
                return child.parentNode;
            }
            child = child.parentNode;
        }
        return null;
        break;
        case '#':
        while(child.parentNode){
            if(child.parentNode.getAttribute('id') == selectorStr){
                return child.parentNode;
            }
            child = child.parentNode;
        }
        return null;
        break;
        default:
        while(child.parentNode){
            if(child.parentNode.tagName == pSelector){
                return child.parentNode;
            }
            child = child.parentNode;
        }
        return null;

    }
}
/**
 * [removeAllChildren 移除所有的子节点]
 * @param  {[type]} parent [description]
 * @return {[type]}        [description]
 */
function removeAllChildren(parent){
    /*var length = parent.children.length;
    for(var i=0;i<length;i++){
        parent.removeChild(parent.children[0]);
    }*/
    parent.innerHTML = '';
}