;(function() {
	
    (function ($) {
        brite.registerView("MainScreen",  {}, {
            create:function (data, config) {
                var $html = app.render("tmpl-MainScreen");
                var $e = $($html);
                return $e;
            },
            
            postDisplay:function (data, config) {
            	var view = this;
                var $e = view.$el;
                
              	var dataSet = createDataSet(2);
				var chartData = transformData(dataSet);
				
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
				
				var svg = d3.select("#main-container").append("div")
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
			          	.attr("y2", function(d) { return ys(nodes[0]); });
				      
			   function xs(d) { return (d.depth>0?(d.y-150+((10-d.weight)*10)):d.y) * Math.cos((d.x - 90) / 180 * Math.PI); }
			   function ys(d) { return (d.depth>0?(d.y-150+((10-d.weight)*10)):d.y) * Math.sin((d.x - 90) / 180 * Math.PI); }
			        
				    
			   var node = vis.selectAll("g.node")
				      .data(nodes)
				      .enter().append("svg:g")
				      .attr("class", "node");
				
			  node.append("svg:circle")
			      .attr("r", 4);
			      
			  	    
		        vis.selectAll("circle")
					.attr("cx", function(d) { return xs(d); })
					.attr("cy", function(d) { return ys(d); });    
            },
            
            events:{
            }
            
        });
        
         // --------- Private Method --------- //
        /**
		 * Create a random dataset that can be use for rendering
		 * @return an array of users, like:
		 *         [{id:..,
		 *           name:..,
		 *           friends:[{id:..,name:..,weight:..},{..}]
		 *          },
		 *          {..}]
		 */
		function createDataSet(dataSize){
			var dataSet = [];
			dataSize = dataSize || 10;
			
			for(var i = 1; i <= dataSize;i++){
				var data = {};
				data.id = i;
				data.name = "User" + i;
				
				//each user have 5 to 10 friends
				var friendsNum = RandomData(5,10);
				var friendsArr = [];
				for(var j = 1; j < friendsNum;j++){
					var friend = {};
					if(j == i) continue;
					friend.id = j;
					friend.name = "User" + j;
					friend.weight = RandomData(1,10);
					friendsArr.push(friend);
				}
				data.friends = friendsArr;
				
				dataSet.push(data);
			}
			
			return dataSet;
		}
		
		//generate the data between fromNum and toNum
		function RandomData(fromNum,toNum){ 
			return parseInt(Math.random()*(toNum-fromNum) + fromNum); 
		}
		
		/**
		 * Transform the data get the dataSet by name ,default the first one
		 * @return  like:
		 *         {id:..,
		 *           name:..,
		 *           children:[{id:..,name:..,weight:..},{..}]
		 *          }
		 */
		function transformData(dataSet,name){ 
			var object = {};
			if(typeof name == 'undefined'){
				var dataPart = dataSet[0];
				object.id = dataPart.id;
				object.name = dataPart.name;
				object.children = dataPart.friends;
			}else{
				$.each(dataSet,function(i,user){
					if(name == user.name){
						var dataPart = dataSet[i];
						object.id = dataPart.id;
						object.name = dataPart.name;
						object.children = dataPart.friends;
					}
				});
			}

			return object;
		}
		// --------- /Private Method --------- //
    })(jQuery);


})();
