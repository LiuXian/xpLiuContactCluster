;(function() {
	
    (function ($) {
        brite.registerView("UserWeightD3Cluster",  {
        	emptyParent : true,
        }, {
            create:function (data, config) {
                var $html = app.render("tmpl-UserWeightD3Cluster");
                var $e = $($html);
                return $e;
            },
            
            postDisplay:function (data, config) {
            	var view = this;
                var $e = view.$el;
                
              	var dataSet = createDataSet(3000);
				var chartData = transformData(dataSet);
				
				view.dataSet = dataSet;
				view.display(chartData);
				
            },
            
            display:function(chartData) {
            		var view = this;
            	
					var w = 1280,
				    h = 800,
				    rx = w / 2,
				    ry = h / 2,
				    m0,
				    rotate = 0;
				
					var cluster = d3.layout.cluster()
					    .size([360, ry - 120])
					    .sort(null);
					
					var diagonal = d3.svg.diagonal.radial()
					    .projection(function(d) { return [d.y, d.x]; });
					
					$(".UserWeightD3Cluster").empty();
					
					var svg = d3.select(".UserWeightD3Cluster").append("div")
					    .style("width", w + "px")
					    .style("height", w + "px");
					
					var vis = svg.append("svg:svg")
					    .attr("width", w)
					    .attr("height", w)
					    .append("svg:g")
					    .attr("transform", "translate(" + rx + "," + ry + ")");
				
				  var nodes = cluster.nodes(chartData);
				  var link = vis.selectAll("g.link")
				    		.data(nodes)
				         	.enter()
				          	.append("svg:g")
				          	.attr("class", "link")
				          	.append("line")
				          	.attr("x1", function(d) { return xs(d); })
				          	.attr("y1", function(d) { return ys(d); })
				          	.attr("x2", function(d) { return xs(nodes[0]); })
				          	.attr("y2", function(d) { return ys(nodes[0]); })
				          	.style("opacity",0)
				          	.transition()
					       	.ease("linear")
					       	.duration(500)
					       	.style("opacity",1);
					      
				   function xs(d) { return (d.depth>0?(d.y-150+((10-d.weight)*10)):d.y) * Math.cos((d.x - 90) / 180 * Math.PI); }
				   function ys(d) { return (d.depth>0?(d.y-150+((10-d.weight)*10)):d.y) * Math.sin((d.x - 90) / 180 * Math.PI); }
					    
				
				   vis.selectAll(".dot")
						.data(nodes)
						.enter()
						.append("circle")
					  	.attr("r", 10)
					  	.attr("style", function(d) { return (d.depth == 0) ? "fill:#FFF7D0" : "fill:#E7FEFF"})
					  	.on("click", click); 	 	    
				  	    
			  	    
			      vis.selectAll("circle")
						.attr("cx", function(d) { return xs(d); })
						.attr("cy", function(d) { return ys(d); })
						.style("opacity",0)
						.transition()
				       	.ease("linear")
				       	.duration(500)
				       	.style("opacity",1);
						
				  function click(d){
			        	var userName = d.name;
			        	
			        	var thisCircle = d3.select(this);
			        	var cxVal = thisCircle.attr("cx");
			        	var cyVal = thisCircle.attr("cy");
			        	
			        	var userData = transformData(view.dataSet,userName);
					    
		        		vis.selectAll("circle").transition()
				       		.ease("linear")
				       		.duration(500)
				       		.attr("cx",function(d){return xs(d)-cxVal})
				       		.attr("cy",function(d){return ys(d)-cyVal})
				       		.style("opacity",function(d) {return (d.name == userName ? 1 :0.5);});
				       		
				       		
				       	vis.selectAll("g.link").select("line").transition()
				       		.ease("linear")
				       		.duration(500)
				       		.attr("x1", function(d) { return xs(d)-cxVal; })
					        .attr("y1", function(d) { return ys(d)-cyVal; })
					        .attr("x2", function(d) { return xs(nodes[0])-cxVal; })
					        .attr("y2", function(d) { return ys(nodes[0])-cyVal; })
					        .style("opacity",0.5);
					       
					    
					    window.setTimeout(function(){
				        		view.display(userData);
				        },500);
			        	
					    
					   
			      }		
				
            } ,
            
            events:{
            }
            
        });
        
    })(jQuery);


})();
