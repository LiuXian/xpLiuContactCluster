;(function() {
	
    (function ($) {
        brite.registerView("ContactClusterEaseljs",  {emptyParent : true}, {
            create:function (data, config) {
                var $html = app.render("tmpl-ContactClusterEaseljs");
                var $e = $($html);
                return $e;
            },
            
            postDisplay:function (data, config) {
            	var view = this;
                var $e = view.$el;
                
              	var dataSet = createDataSet(30);
				var chartData = transformData(dataSet);
				
				view.dataSet = dataSet;
			    view.showGraphic(chartData);            	
            },
            
            showGraphic: function(chartData, rx, ry) {
            	var view = this;
            	
            	// rx = rx || 0;
            	// ry = ry || 0;            	
            	rx = 0;
            	ry = 0;
            	
            	var stage = new createjs.Stage("demoCanvas");
			    var circleCen = new createjs.Shape();
			    
			    circleCen.graphics.beginFill("steelblue").drawCircle(0, 0, 4);
			    
			    circleCen.x = rx + 100;
			    circleCen.y = ry + 100;
			    
			    
			    stage.addChild(circleCen);
			    stage.update();
			    
			    var g = new createjs.Graphics();
			    
			    var length = chartData.children.length;
			    
			    var circles = []
			    
			    for(var i = 0; i < length; i++) {
			    	var r = chartData.children[i].weight*8;
			    	var cx = r*Math.cos(2*Math.PI*((i+1)/(length+1)));
			    	var cy = r*Math.sin(2*Math.PI*((i+1)/(length+1)));
			    	
			    	var circle = new createjs.Shape();
			    	
			    	circle.graphics.beginFill("red").drawCircle(cx, cy, 3);
			    	
			        circle.name = chartData.children[i].name;
			    	
			    	circle.cx = cx;
			    	circle.cy = cy;
			    	
			    	circles.push(circle);
			    	
			    	circle.x = rx + 100;
			    	circle.y = ry + 100;
					stage.addChild(circle);
					stage.update();
			    }
			    
			    
			    
			    // if(rx != 0 || ry != 0) {
			    	// var duration = 1000;
			    	// var time = 100;
			    	// var cenx = circleCen.x;
// 			    	
			    	// if(cenx > 100) {
			    		// setInterval(function() {
			    			// if(circleCen.x > 100) {
			    				// circleCen.x -= rx*(time/duration);
			    				// stage.update();
			    			// }
			    		// },time)
			    	// }
// 			    	
			    	// if(cenx < 100) {
			    		// setInterval(function() {
			    			// if(circleCen.x < 100) {
			    				// circleCen.x -= rx*(time/duration);
			    				// stage.update();
			    			// }
			    		// },time)
			    	// }
// 			    	
			    // }
			    
			    
				
				for(var i = 0; i < circles.length; i++) {
					circles[i].addEventListener("click", handlerMethod);
				}
			    
			    
				 function handlerMethod(event) {
				 	var userName = event.target.name;
				 	var userData = transformData(view.dataSet,userName);
				 	
				 	stage.clear();
				 	
					view.showGraphic(userData, event.target.cx, event.target.cy);
					
					view.rx = event.target.cx;
					view.ry = event.target.cy;
					
					//createjs.Ticker.addEventListener("tick", handleTick);  
						
				 }
			
			    
            },
            
            events:{
            }
            
        });
        
    })(jQuery);


})();
