;(function() {
	
    (function ($) {
        brite.registerView("ContactClusterEaseljs",  {emptyParent : true}, {
            create:function (data, config) {
                return "<canvas id='demoCanvas' width='1000px' height='1000px'></canvas>";
            },
            
            postDisplay:function (data, config) {
            	var view = this;
                var $e = view.$el;
                
              	var dataSet = createDataSet(3000);
				var chartData = transformData(dataSet);
				
				var stage = new createjs.Stage("demoCanvas");
				
				view.dataSet = dataSet;
				view.stage = stage;
				
			    view.showGraphic(chartData);            	
            },
            
            showGraphic: function(chartData, rx, ry) {
            	var view = this;
            	rx = rx || 0;
            	ry = ry || 0;            	
            	var stage = view.stage;
            	var container = new createjs.Container();
            	container.name = "new"; 
            	view.container = container;
            	
			    var length = chartData.children.length;
			    
			    for(var i = 0; i < length; i++) {
			    	var r = chartData.children[i].weight*30;
			    	var cx = r*Math.cos(2*Math.PI*((i+1)/(length+1)));
			    	var cy = r*Math.sin(2*Math.PI*((i+1)/(length+1)));
			    	
			    	var line = new createjs.Shape();
      				line.graphics.beginStroke("#969DA7").moveTo(0,0).lineTo(cx,cy);
			    	container.addChild(line);
			    	
			    	var circle = new createjs.Shape();
			    	circle.graphics.beginStroke("#969DA7").beginFill("#E7FEFF").drawCircle(cx, cy, 10);
			        circle.name = chartData.children[i].name;
			    	circle.cx = cx;
			    	circle.cy = cy;
			    	
			    	circle.addEventListener("click", handlerMethod);
			    	
					container.addChild(circle);
			    }
			    
			    var circleCen = new createjs.Shape();
			    circleCen.graphics.beginStroke("#969DA7").beginFill("#FFF7D0").drawCircle(0, 0, 10);
			    container.addChild(circleCen);
			    
			    
			    container.x = rx + 500;
			    container.y = ry + 500;
			    
			    stage.addChild(container);
			    stage.update();
			    
				function handlerMethod(event) {
					var userName = event.target.name;
				 	var userData = transformData(view.dataSet,userName);
				 	
				 	view.container.name = "old";
				 	
					view.showGraphic(userData, event.target.cx, event.target.cy);
					
					view.rx = event.target.cx;
					view.ry = event.target.cy;
					
					createjs.Ticker.addEventListener("tick", handleTick);  
					view.s = (new Date()).getTime();
					
					view.stage.getChildByName("old").alpha = 1;
			    }
			    
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
			    
            },
            
            events:{
            }
            
        });
        
    })(jQuery);


})();
