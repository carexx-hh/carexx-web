

(function($){
	B = null, C = null, $win = $(window),$t=$(this),CC = null;
    //class为.wBox_close为关闭
    $.fn.HXBox = function(options){
    	
        var defaults = {
            opacity: 0.3,//背景透明度
            callBack: null,
            calPositionId:null, //点击后需要重置div位置的id
            noTitle: false,
			show:false,
			title :'',
			timeout:0,
			target:null,
			drag:true,
			scroll:true, //滚动页面，弹框是否跟随页面滚动
            html: '',
            idSp :true,
            closeCls :null,  //关闭按钮的cls 设置此值，点击对应cls的按钮可关闭弹框
            closeId :null, //关闭按钮的id 设置此值，点击对应cls的按钮可关闭弹框
            dblclose :true, //双击弹框后遮罩是否关闭弹框
            stayOther :false, //保持其他窗口的显示状态
            isSetPostion:true//增加用于 选择是否自动定位
        },_this=this;
		this.HXC = $.extend(defaults, options);
        this.showBox=function (){
        	var ori_cc = $('#HXBox_content').html();
        	
        	if(ori_cc != null){
        		$(ori_cc).appendTo('body').hide();
        	}

        	if(!_this.HXC.stayOther){
        		 $("#HXBox_overlay").remove();
     			$("#HXBox").remove();
        	}
            var divBoxHtml ='<div id="HXBox" '+(_this.HXC.width?'style="Z-INDEX: 10001;width:'+_this.HXC.width+'px;"':'style="Z-INDEX: 10001;"')+'><div id="HXBox_content"></div></div>',
            domTxt = '(document).documentElement';
            var b_html = '<div id="HXBox_overlay" style="width: 100%; height: 100%; position: fixed; z-index: 10000; top: 0px; left: 0px; overflow: hidden;"><div style="height: 100%; background: none repeat scroll 0% 0% #000000; filter: alpha(opacity=30); opacity: 0.3;"></div></div>';
            
            jQuery.browser={};(function(){jQuery.browser.msie=false; jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)./)){ jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();
            var _isIe6 = $.browser.msie && ($.browser.version == "6.0");
            if(_isIe6){
            	b_html='<DIV id="HXBox_overlay" style="Z-INDEX: 10000; LEFT: 0px; ; LEFT: expression((document).documentElement.scrollLeft); OVERFLOW: hidden; WIDTH: 956px; ; WIDTH: expression((document).documentElement.clientWidth); POSITION: absolute; TOP: 0px; ; TOP: expression((document).documentElement.scrollTop); HEIGHT: 504px; ; HEIGHT: expression((document).documentElement.clientHeight)"><DIV style="BACKGROUND: #000; FILTER: alpha(opacity=30); ZOOM: 1; HEIGHT: 100%; opacity: 0" @cache1357453304937="3"><IFRAME style="Z-INDEX: -1; FILTER: alpha(opacity=0); LEFT: 0px; WIDTH: 100%; POSITION: absolute; TOP: 0px; HEIGHT: 100%" src="about:blank"></IFRAME></DIV></DIV>';
            }

        	B = $(b_html).dblclick(function(){
            	if(_this.HXC.dblclose)
            		_this.close();
            }).appendTo('body').fadeIn(300);

            C = $(divBoxHtml).appendTo('body');
            handleClick();
            _this.HXC.closeCls?$('.'+_this.HXC.closeCls).click(function(){_this.close();}):$('.wBox_close').click(function(){_this.close();});
        };
        /*
         * 处理点击
         * @param {string} what
         */
        function handleClick(){
            var con = C.find('#HXBox_content');
            
			if (_this.HXC.target) {
				CC = $('#'+_this.HXC.target).clone(true).show().appendTo(con.empty());
				$('#'+_this.HXC.target).remove();
				
			}
			else if (_this.HXC.html) {
				
				con.html(_this.HXC.html);
			}else if(_this.HXC.url){
            	$.ajax({
            		url :_this.HXC.url,
            		data :_this.HXC.data,
            		success :function(data){
            			$(data).appendTo(con.empty());
            		}
            	});
            }
			else {
				$t.clone(true).show().appendTo(con.empty());
			}         
            afterHandleClick();
        }
        
        /*
         * 处理点击之后的处理
         */
        function afterHandleClick(){
            setPosition();
            C.show().find('#close').click(_this.close);
            $(document).unbind('keydown.divBox').bind('keydown.divBox', function(e){
                /* if (e.keyCode === 27) 
                   _this.close();*/
                return true;
            });
            typeof _this.HXC.callBack === 'function' ? _this.HXC.callBack() : null;
            !_this.HXC.noTitle&&_this.HXC.drag?drag():null;
			if(_this.HXC.timeout){
                setTimeout(_this.close,_this.HXC.timeout);
            }
        }
        /*
         * 设置wBox的位置
         */
        function setPosition(){
            if (!C || !defaults.isSetPostion) {
                return false;
            }
            
            var width = C.width(), height = C.find('#'+_this.HXC.target).height()?C.find('#'+_this.HXC.target).height():C.height();//C.height(), 
            height= height == 0?C.height():height;
            var lt = calPosition(width,height);
            C.css({
                left: lt[0],
                top: lt[1]
            });
            var $h = $("body").height(), $wh = $win.height(),$hh=$("html").height(),
            $w = $("body").width(),$ww = $w-1200>0?$w:1200;
            $h = Math.max($h, $wh);
        }
        /*
         * 计算wBox的位置
         * @param {number} w 宽度
         */
        function calPosition(w,h){
        	var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
            
        	l = ($win.width() - w) / 2;
            t = scrollTop + (($win.height() - h) /2);//scrollTop + $win.height() /9;
            return [l, t];
        }
        /*
         * 拖拽函数drag
         */
        function drag(){
            var dx, dy, moveout;
            var T = C.find('#divBox_title').css('cursor', 'move');
            T.bind("selectstart", function(){
                return false;
            });
            
            T.mousedown(function(e){
                dx = e.clientX - parseInt(C.css("left"));
                dy = e.clientY - parseInt(C.css("top"));
                C.mousemove(move).mouseout(out).css('opacity', 0.8);
                T.mouseup(up);
            });
            /*
             * 移动改变生活
             * @param {Object} e 事件
             */
            function move(e){
                moveout = false;
                if (e.clientX - dx < 0) {
                    l = 0;
                }
                else 
                    if (e.clientX - dx > $win.width() - C.width()) {
                        l = $win.width() - C.width();
                    }
                    else {
                        l = e.clientX - dx;
                    }
                C.css({
                    left: l,
                    top: e.clientY - dy
                });
                
            }
            /*
             * 你已经out啦！
             * @param {Object} e 事件
             */
            function out(e){
                moveout = true;
                setTimeout(function(){
                    moveout && up(e);
                }, 10);
            }
            /*
             * 放弃
             * @param {Object} e事件
             */
            function up(e){
                C.unbind("mousemove", move).unbind("mouseout", out).css('opacity', 1);
                T.unbind("mouseup", up);
            }
        }
        
        this.calPos = function (){
        	setPosition();
        };
        
        this.setTarget = function(target){
        	_this.HXC.target = target;
        	handleClick();
        };
        
        /*
         * 关闭弹出框就是移除还原
         */
        this.close=function (){
            if (C) {
                B.remove();
                C.remove();
				if(CC)CC.appendTo('body').hide();
                if(_this.HXC.closeEven){
                	_this.HXC.closeEven();
                }
                
            }
        };
        
       this.setHtml =  function (html){
        	_this.HXC.html = html;
        	handleClick();
        };
        /*
         * 触发click事件
         */		
        $win.resize(function(){
            setPosition();
        });
        if(_this.HXC.scroll){
        	$win.scroll(function(){
            	setPosition();
            });
        }
		return this;
    };
})(jQuery);