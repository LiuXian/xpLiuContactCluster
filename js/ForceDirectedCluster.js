;(function() {
	
    (function ($) {
    	var _weightPerLength = [20,10,8,4];
    	var _baseLineLen = [80,40,20,10];
        brite.registerView("ForceDirectedCluster",  {
        	emptyParent : true,
			parent:".MainScreen-main"
		}, {
            create:function (data, config) {
            	var $html = app.render("tmpl-ForceDirectedCluster");
               	var $e = $($html);
                return $e;
            },
            
            postDisplay:function (data, config) {
            	var view = this;
                var $e = view.$el;
                var canvas = $e.find("#demoCanvas")[0];
                var cWidth = $(canvas).parent().width();
                var cHeight = $(canvas).parent().height();
                transX = cWidth/2;
                transY = cHeight/2;
                canvas.width = cWidth;
                canvas.height = cHeight;
				var stage = new createjs.Stage("demoCanvas");
				stage.enableMouseOver();
				view.stage = stage;
				$("#level-slider").slider({
					value:1,
					min: 1,
					max: 4,
					step: 1,
					stop: function(event, ui) {
						$("#level").val(ui.value);
						view.level = ui.value;
 						view.showGraphic(view.chartData);
			    		var newContainer = view.stage.getChildByName("new");
			    		view.stage.removeChild(newContainer);
			    		view.stage.update();
					}
				});
				
				view.level = $("#level-slider").slider("value")*1;
				
			    $("#level").val($("#level-slider").slider("value"));
			    
			    //zoom the graph
			    $("#zoom-slider").slider({
					value:100,
					min: 10,
					max: 200,
					step: 10,
					stop: function(event, ui) {
						$("#zoom").val(ui.value + "%");
						zoom.call(view, ui.value);
						if(ui.value >= 150) {
						    view.level = 1;
                            view.showGraphic(view.chartData);
                            var newContainer = view.stage.getChildByName("new");
                            view.stage.removeChild(newContainer);
                            view.stage.update();
						}
						
						if(ui.value < 150) {
                            view.level = 2;
                            view.showGraphic(view.chartData);
                            var newContainer = view.stage.getChildByName("new");
                            view.stage.removeChild(newContainer);
                            view.stage.update();
                        }
                        
                        if(ui.value < 100) {
                            view.level = 3;
                            view.showGraphic(view.chartData);
                            var newContainer = view.stage.getChildByName("new");
                            view.stage.removeChild(newContainer);
                            view.stage.update();
                        }
                        
                        if(ui.value < 50) {
                            view.level = 3;
                            view.showGraphic(view.chartData);
                            var newContainer = view.stage.getChildByName("new");
                            view.stage.removeChild(newContainer);
                            view.stage.update();
                        }
                        
                        $("#level").val(view.level);
                        
                        $("#level-slider").slider("value",  view.level);
				
					}
				});
				
			    $("#zoom").val($("#zoom-slider").slider("value") + "%");
			    
				app.ContactDao.get().done(function(chartData){
                	view.chartData = chartData;                	
                	view.showGraphic(chartData);
				});
            	
            },
            
            showGraphic: function(chartData, rx, ry,level,angleVal) {
            	var view = this;
            	view.rx = rx || 0;
            	view.ry = ry || 0;
            	var stage = view.stage;
            	view.rootName = chartData.name;
            	view.originPoint = {x:0, y: 0};
                createjs.Ticker.setFPS(60);
                if(!angleVal)
                	angleVal = 0;
			    var container = createContainer.call(view, chartData, view.originPoint, view.level, angleVal);
			    container.x = transX + view.rx;
				container.y = transY + view.ry;
				var zoomValue = $("#zoom-slider").slider("value")/100;
				container.scaleX = zoomValue; 
                container.scaleY = zoomValue; 
			    container.name = "new";
			    view.container = container;
			    stage.addChild(container);
			    stage.update();
            },
            
        });
        
        
        //generate line
	    function genLine(start, end, level) {
	        var view = this;
	    	var line = new createjs.Shape();
	    	color = ["#E1B57C", "#DDE17C", "#7CE1C8", "#BC7CE1"];
	    	var index = view.level - level;
			line.graphics.beginStroke(color[index]).moveTo(start.x,start.y).lineTo(end.x, end.y);
			return line;
	    }
	    
	    //generate circle
	    function genCircle(r, pos, name) {
	    	var circle = new createjs.Shape();
	    	circle.graphics.beginStroke("#969DA7").beginFill("#E7FEFF").drawCircle(pos.x, pos.y, r);
	        circle.name = name;
	    	circle.cx = pos.x;
	    	circle.cy = pos.y;
	    	circle.angleVal = pos.angleVal;
	    	return circle;
	    }
	    
	    //generate center
	    function genCenter(pos, name) {
	    	var circleCen = new createjs.Shape();
	    	circleCen.name = name;
	    	circleCen.cx = pos.x;
	    	circleCen.cy = pos.y;
			circleCen.graphics.beginStroke("#969DA7").beginFill("#FFF7D0").drawCircle(pos.x, pos.y, 5);
			return circleCen;
	    }
	    
		//the click event method
		function handlerMethod(event) {
			var view = $("body").bFindComponents("ForceDirectedCluster")[0];
			var $e = view.$el;
			view.oldRootName = view.rootName;
			view.rootName = event.target.name;
			var userName = event.target.name;
			 var boolean = false;
			    if((view.level - level) > 0 ){
			    	view.rootName = event.target.parent.name;
			    	boolean = false;
			    }else{
			    	view.rootName = event.target.name;
			    	boolean = true;
			    }
		 	view.container.name = "old";
		 	app.ContactDao.getByName(userName).done(function(userData){
		 		view.showGraphic(userData, event.target.cx, event.target.cy, level, (Math.PI+event.target.angleVal), boolean);
		 	});
			view.rx = event.target.cx;
			view.ry = event.target.cy;
			//duration 
            var animationSpeed = $e.find("#speed").val() || 500;
            useRAF = $e.find("#RAF")[0].checked;
            createjs.Ticker.useRAF = useRAF;
            if(useRAF) {
                createjs.Ticker.setFPS(60);     
            }
            
            //check the input value of the animate speed
            var pattern  = /^\d+$/;
            
            if(!pattern.test(animationSpeed)) {
            	$e.find("#speed").val(500);
            	animationSpeed = 500;
            }
             
			animate(animationSpeed);
	    }
	    
	
	    function zoom(value) {
	        var view = this;
	        view.stage.getChildByName("new").scaleX = value/100; 
            view.stage.getChildByName("new").scaleY = value/100; 
            view.stage.update();
	    }
	    
	    function animate(animationSpeed) {
	    	var view = $("body").bFindComponents("ForceDirectedCluster")[0];
	    	var stage = view.stage;
	    	view.s = (new Date()).getTime();
	    	view.stage.getChildByName("old").alpha = 1;
	    	createjs.Ticker.addEventListener("tick", handleTick);
	    	
	    	//the animation of the movment
		    function handleTick() {
				var oldContainer = view.stage.getChildByName("old");
		    	var newContainer = view.stage.getChildByName("new");
		    	var	t = (new Date()).getTime() - view.s;
				var	b = 1;
				var	d = animationSpeed;
	            var c1 = adv(view.rx, b) * 100;
	            var c2 = adv(view.ry, b) * 100;
		    	oldContainer.alpha = oldContainer.alpha - 0.05;
		        newContainer.alpha = newContainer.alpha + 0.05;
				var dx = tween(t, (view.rx * b), c1, d) / 100;
				var dy = tween(t, (view.ry * b), c2, d) / 100;
				newContainer.x =  transX + view.rx - dx;
				newContainer.y =  transY + view.ry - dy;
				oldContainer.x =  transX - dx;
				oldContainer.y =  transY - dy;
				stage.update(event);
				if(t > d ){
					createjs.Ticker.removeEventListener("tick",handleTick);
		        	stage.removeChild(oldContainer);
		        	newContainer.alpha = 1;
		        	stage.update(event);
				}
	             
		    } 
	    }
	    
	    function tween(t, b, c, d){
	    	return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b
	    }
			    
	    function adv(val, b){
           var va, re= /^([+-\\*\/]=)([-]?[\d.]+)/ ;
                if (re.test(val)){
                    var reg = val.match(re);
                        reg[2] = parseFloat(reg[2]);
                        switch ( reg[1] ){
                                case '+=':
                                    va = reg[2];
                                    break;
                                case '-=':
                                    va = -reg[2];
                                    break;
                                case '*=':
                                    va = b*reg[2] - b;
                                    break;
                                case '/=':
                                    va = b/reg[2] - b;
                                    break;
                            }
                        return va;
                    } 
                return parseFloat(val) - b;
        }
        
        function createContainer(data, originPoint, level, exAngle, isRecreate){
        		var view = this;
        		var parentName = data.name;
				var childrenData = data.children;
				//put the root data as the first one
				childrenData = app.transformDataFirst( childrenData,isRecreate?view.rootName:view.oldRootName);
      			var stage = view.stage;
      			var angle = Math.PI * 2 / childrenData.length ;
      			var rx = originPoint.x;
				var ry = originPoint.y;
     			var containerRoot = new createjs.Container();
     			var fpos =getPos.call(view, childrenData, originPoint, level, exAngle);
        		//draw the nodes and line
        		$.each(childrenData,function(i, item){
        			if(level != view.level && i == 0) return;
        			var cx = fpos[i].x;
			        var cy = fpos[i].y;
			        var angleVal = fpos[i].angleVal;
			        var cData = childrenData[i];
			        var line = genLine.call(view, {x: rx, y: ry}, {x: cx, y: cy}, level);
			        var node = genCircle.call(view, 5, {x: cx, y: cy,angleVal:angleVal}, cData.name);
			        containerRoot.addChild(line);
			        containerRoot.addChild(node);
			        node.parent.name = data.name;
			     
			       	//add the click event for node
					node.addEventListener("click", handlerMethod);
					
					//show the label
					if((view.level - level) < 2) {
					   var text = createText.call(view, cx, cy, cData.name);
                        containerRoot.addChild(text);    
					}
			        
			        //show the children level
					if((level-1) > 0){
						var newData = app.transformData(app.dataSet, cData.name, parentName);
						var newContainer = createContainer.call(view, newData, {x:cx, y:cy}, level-1, (Math.PI + angle* i)+exAngle);
						containerRoot.addChild(newContainer);
					}
				});
				
				var cenCircle = genCenter({x: rx, y: ry}, data.name); 
				cenCircle.children = childrenData.length;
				
				if((view.level - level) < 2) {
				    var text = createText.call(view, rx, ry, data.name);
                    containerRoot.addChild(text);    
				}
				
			    containerRoot.addChild(cenCircle);
			    cenCircle.addEventListener("click", handlerMethod);
			    
			    return containerRoot;
        	}
        	
        	function getPos(childrenData,originPoint,level,exAngle){
        		var view = this;
        		var rx = originPoint.x;
				var ry = originPoint.y;
				var weightPerLength = _weightPerLength[view.level - level];
      			var baseLineLen = _baseLineLen[view.level - level];
      			var angle = Math.PI * 2 / childrenData.length ;
        		var fpos = [];
		      	for(var i = 0; i < childrenData.length; i++){
			        var cData = childrenData[i];
			      
			        var weight = cData.weight;
					//the higher weight, the closer the length
					weight = 10 - weight;
			        var l = weight * weightPerLength + baseLineLen;
			        var cx = rx + l * Math.sin(angle * i + exAngle);
			        var cy = ry + l * Math.cos(angle * i + exAngle);
			        fpos.push({x:cx, y:cy, angleVal:(angle * i + exAngle)});
			    }
			    return fpos;
        	}
        	
        	
        	 function createText(x0, y0, name){
        	    var view = this;
                var text = new createjs.Text(name, "10px Arial, #000");
                text.addEventListener("mouseover", function(event) {
                    event.target.color = "#6AD144";
                    view.stage.update();
                });
                
                text.addEventListener("mouseout", function(event) {
                    event.target.color = "#000";
                    view.stage.update();
                });
                
                text.cursor = "pointer";
                text.x = x0 - 10;
                text.y = y0 + 10;
                return text;
            }
     
        	
        
    })(jQuery);


})();
