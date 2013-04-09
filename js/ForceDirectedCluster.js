;(function() {
	
    (function ($) {
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
				var stage = new createjs.Stage("demoCanvas");
				view.stage = stage;
				
				$("#level-slider").slider({
					value:2,
					min: 1,
					max: 3,
					step: 1,
					slide: function(event, ui) {
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
					slide: function(event, ui) {
						$("#zoom").val(ui.value + "%");
						view.stage.getChildByName("new").scaleX = ui.value/100; 
						view.stage.getChildByName("new").scaleY = ui.value/100; 
						stage.update();
					}
				});
				
			    $("#zoom").val($("#zoom-slider").slider("value") + "%");
			    
				app.ContactDao.get().done(function(chartData){
                	view.chartData = chartData;                	view.showGraphic(chartData);
				});
            	
            },
            
            showGraphic: function(chartData, rx, ry) {
            	var view = this;
            	view.rx = rx || 0;
            	view.ry = ry || 0;
            	
            	var stage = view.stage;
            	
			    var container = createContainer.call(view, chartData, genCenter({x:0, y:0}), view.level);
			    
			    container.x = 500 + view.rx;
				container.y = 500 + view.ry;
			    container.name = "new";
			    view.container = container;
			    
			    stage.addChild(container);
			    stage.update();
			    
            }
        });
        
        
        //generate line
	    function genLine(start, end) {
	    	var line = new createjs.Shape();
			line.graphics.beginStroke("#969DA7").moveTo(start.x,start.y).lineTo(end.x, end.y);
			return line;
	    }
	    
	    //generate circle
	    function genCircle(r, pos, name) {
	    	var circle = new createjs.Shape();
	    	circle.graphics.beginStroke("#969DA7").beginFill("#E7FEFF").drawCircle(pos.x, pos.y, r);
	        circle.name = name;
	    	circle.cx = pos.x;
	    	circle.cy = pos.y;
	    	return circle;
	    }
	    
	    //generate center
	    function genCenter(pos) {
	    	var circleCen = new createjs.Shape();
	    	circleCen.cx = pos.x;
	    	circleCen.cy = pos.y;
			circleCen.graphics.beginStroke("#969DA7").beginFill("#FFF7D0").drawCircle(pos.x, pos.y, 5);
			return circleCen;
	    }
	    
	    //get the node's position
		function getPos(chartData, level, cenCircle) {
			var length = chartData.children.length;
			var rx = cenCircle.cx;
			var ry = cenCircle.cy;
			
			if(level == 1) {
				var distance = 30;
			} else if(level == 2) {
				var distance = 100;
			} else if(level == 3) {
				var distance = 100;
			}
			
			
			for(var i = 0; i < length; i++) {
				var r = distance + chartData.children[i].weight*1;
				chartData.children[i].level = level;
		    	chartData.children[i].cx = rx + r*Math.cos(2*Math.PI*((i+1)/(length+1)));
		    	chartData.children[i].cy = ry + r*Math.sin(2*Math.PI*((i+1)/(length+1)));
	    	}
	    	
	    	return chartData;
		}
		
		//the click event method
		function handlerMethod(event) {
			var view = $("body").bFindComponents("ForceDirectedCluster")[0];
			var userName = event.target.name;
		 	view.container.name = "old";
		 	app.ContactDao.getByName(userName).done(function(userData){ 
		 		view.showGraphic(userData, event.target.cx, event.target.cy);
		 	})
			
			view.rx = event.target.cx;
			view.ry = event.target.cy;
			animate();
	    }
	    
	    function createText(x0, y0, name){
	      	var text = new createjs.Text(name, "10px Arial, #000");
	      		text.x = x0 - 10;
	      		text.y = y0 + 10;
	      	return text;
	    }
	    
	    
	    function createContainer(data, originPoint, level){
    		var view = this;
    		var parentName = data.name;
			var childrenData = data.children;
			
 			var containerRoot = new createjs.Container();
 			originPoint.level = level;
 			
 			var data = getPos(data, level, originPoint);
 			
 			originPoint.name = data.name;
 			var childrenData = data.children;
		    
		   
    		//draw the nodes and line
    		$.each(childrenData,function(i,item){
    			if(level != view.level && i == 0) return;
    			var cx = childrenData[i].cx;
		        var cy = childrenData[i].cy;
		        var cData = childrenData[i];
		        
		        var line = genLine({x: originPoint.cx, y: originPoint.cy}, {x:cx, y:cy});
		        var circle = genCircle(5, {x: cx, y: cy}, cData.name);
		        circle.level = level;
		        containerRoot.addChild(line);
		        containerRoot.addChild(circle);
		        
	       		//add the click event for node
				circle.addEventListener("click", handlerMethod);
				var text = createText.call(view, cx, cy, cData.name);
			    containerRoot.addChild(text);

		        //show the children level
				 if((level-1) > 0){
					 var newData = app.transformData(app.dataSet, cData.name, parentName);
					 var newContainer = createContainer.call(view, newData, genCenter({x: cx, y: cy}), level-1);
					 containerRoot.addChild(newContainer);
				 }

			});
			
		    containerRoot.addChild(originPoint);
		    var text = createText.call(view, originPoint.cx, originPoint.cy, data.name);
			containerRoot.addChild(text);
		    
		    return containerRoot;
    	}
	    
	    function animate() {
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
				var	d = 500;
	            var c1 = adv(view.rx, b) * 100;
	            var c2 = adv(view.ry, b) * 100;
	            var c3 = adv(1, b) * 100;
	            
		    	oldContainer.alpha = oldContainer.alpha - 0.05;
		        newContainer.alpha = newContainer.alpha + 0.05;
		        
				var dx = tween(t, (view.rx * b), c1, d) / 100;
				var dy = tween(t, (view.ry * b), c2, d) / 100;
		        
				newContainer.x =  500 + view.rx - dx;
				newContainer.y =  500 + view.ry - dy;
		       
				oldContainer.x =  500 - dx;
				oldContainer.y =  500 - dy;
		        
				stage.update(event);
				
				if(t > d ){
					createjs.Ticker.removeEventListener("tick",handleTick);
		        	stage.removeChild(oldContainer);
		        	newContainer.alpha = 1;
		        	stage.update(event);
				}
	             
		    } 
	    }
	    
	    function tween(t, b, c, d){ return - c * (t /= d) * (t - 2) + b}
			    
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
        
    })(jQuery);


})();
