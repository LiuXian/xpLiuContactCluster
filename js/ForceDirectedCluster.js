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
            	
                return "";
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
					}
				});
				
			    $("#level").val($("#level-slider").slider("value"));
			    
				app.ContactDao.get().done(function(chartData){
                	view.chartData = chartData;
                	view.showGraphic(chartData);
				});
				
				
            	
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
			    
			    //draw the nodes
			    for(var i = 0; i < length; i++) {
			    	// var r = chartData.children[i].weight*50;					var r = 130 + chartData.children[i].weight*1;
					
			    	var cx = r*Math.cos(2*Math.PI*((i+1)/(length+1)));
			    	var cy = r*Math.sin(2*Math.PI*((i+1)/(length+1)));
			    	
			    	var line = new createjs.Shape();
      				line.graphics.beginStroke("#969DA7").moveTo(0,0).lineTo(cx,cy);
			    	container.addChild(line);
			    	
			    	var circle = new createjs.Shape();
			    	circle.graphics.beginStroke("#969DA7").beginFill("#E7FEFF").drawCircle(cx, cy, 5);
			        circle.name = chartData.children[i].name;
			    	circle.cx = cx;
			    	circle.cy = cy;
			    	
			    	circle.addEventListener("click", handlerMethod);
					container.addChild(circle);
					
					drawCircle(container, circle);
			    }
			    
			    //draw the center node
			    var circleCen = new createjs.Shape();
			    circleCen.graphics.beginStroke("#969DA7").beginFill("#FFF7D0").drawCircle(0, 0, 5);
			    container.addChild(circleCen);
			    
			    container.x = rx + 500;
			    container.y = ry + 500;
			    
			    view.container = container;
			    stage.addChild(container);
			    stage.update();
			    
			    //zoom the graph
			    $("#zoom-slider").slider({
					value:100,
					min: 10,
					max: 200,
					step: 10,
					slide: function(event, ui) {
						$("#zoom").val(ui.value + "%");
						container.scaleX = ui.value/100; 
						container.scaleY = ui.value/100; 
						stage.update();
					}
				});
				
			    $("#zoom").val($("#zoom-slider").slider("value") + "%");
			    
			    
			    //the click event method
				function handlerMethod(event) {
					var userName = event.target.name;
				 	view.container.name = "old";
				 	
				 	app.ContactDao.getByName(userName).done(function(userData){ 
				 		view.showGraphic(userData, event.target.cx, event.target.cy);
				 	})
					
					view.rx = event.target.cx;
					view.ry = event.target.cy;
					
					createjs.Ticker.addEventListener("tick", handleTick);  
					view.s = (new Date()).getTime();
					
					view.stage.getChildByName("old").alpha = 1;
			    }
			    
			    
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
                
                function drawCircle(container, circle) {
                	view.circle = circle;
                	app.ContactDao.getByName(circle.name).done(function(userData){
                		 for(var i = 0; i < userData.children.length; i++) { 
                		 	var r = 20 + userData.children[i].weight*1;
					    	var cx = r*Math.cos(2*Math.PI*((i+1)/(length+1))) + view.circle.cx;
					    	var cy = r*Math.sin(2*Math.PI*((i+1)/(length+1))) + view.circle.cy;
					    	
					    	var line = new createjs.Shape();
		      				line.graphics.beginStroke("#969DA7").moveTo(view.circle.cx, view.circle.cy).lineTo(cx,cy);
					    	container.addChild(line);
					    	
					    	var circle = new createjs.Shape();
					    	circle.graphics.beginStroke("#969DA7").beginFill("#E7FEFF").drawCircle(cx, cy, 5);
					        circle.name = userData.children[i].name;
					    	circle.cx = cx;
					    	circle.cy = cy;
					    	
					    	circle.addEventListener("click", handlerMethod);
							container.addChild(circle);		
                		 }
                		
				 		//view.showGraphic(userData, event.target.cx, event.target.cy);
				 	})
				 	
				 	  //draw the center node
				    var circleCen = new createjs.Shape();
				    circleCen.graphics.beginStroke("#969DA7").beginFill("#FFF7D0").drawCircle(circle.cx, circle.cy, 5);
				    container.addChild(circleCen);
                }
                
                
			    
            },
            
            events:{
            }
            
        });
        
    })(jQuery);


})();
