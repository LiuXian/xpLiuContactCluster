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
                
                var dataSet = createDataSet(30);
				var chartData = transformData(dataSet);
				view.dataSet = dataSet;
				view.chartData = chartData;
                
                view.showView(chartData);
			},
			showView:function(data, offset){
				var view = this;
                var $e = view.$el;
                var w = 1000, 
                	h = 800,
				    root;
				
				root = data;
			  	root.x = w / 2;
			  	root.y = h / 2 - 80;
			  	
				var $container = $e.find(".ForceDirectedClusterSummary");
                
				$container.append("<div class='fstCon new transition-medium'></div>");
				
				$newDataView = $(".new");
				
				var vis = d3.select(".fstCon.new").append("svg:svg").attr("width", w).attr("height", h);
				
				var force = d3.layout.force().size([w, h])
								.charge(-120)
    							.linkDistance(30);
			  	
				var nodes = flatten(root),
			        links = d3.layout.tree().links(nodes);
			
			  	force
			    	.nodes(nodes)
			      	.start();
				
				var link = vis.selectAll(".new line.link")
							.data(links, function(d) { return d.target.id; })
							.enter()
							.append("svg:line")
							.attr("class", "link")
							.style("stroke", "#CCC")
							.attr("x1", function(d) { return d.source.x; })
				        	.attr("y1", function(d) { return d.source.y; })
				        	.attr("x2", function(d) { return d.target.x; })
				        	.attr("y2", function(d) { return d.target.y; });
				
				
				var node = vis.selectAll(".new g.node")
							.data(nodes, function(d) { return d.id; })
							.enter().append("svg:g").attr("class", "node")
							.on("click", click);
							
				node.append("svg:circle").attr("r", radius).style("fill", color);
					
				node.append("text").attr("dx", 12).attr("dy", ".35em").text(function(d) { return d.name });
					
			    node.attr("transform", function(d) { d.cx = d.x; d.cy = d.y; return "translate(" + d.x + "," + d.y + ")"; });
					
				node.append("title").text(function(d) { return d.name + ": " + d.weightVal; });
				
				
				if (offset) {
					offset.cx = offset.cx - root.x;
					offset.cy = offset.cy - root.y;
			        
			        $newDataView.css("transform", "translate(" + offset.cx + "px," + offset.cy + "px)");
			        $newDataView.css("opacity", "0");
			        
		        	offset.cx = offset.cx + root.x;
					offset.cy = offset.cy + root.y;
			        
			        setTimeout (function() {
			        	$newDataView.css("transform", "translate(0px, 0px)");
			        	$newDataView.css("opacity", "1");
			        }, 10);
			      
			        
			    }
	
				
				function click(d) {
					var offset = {
						"cx" : d.cx, 
						"cy" : d.cy
					}
					
					 var userName = d.name;
					 $(".new").addClass("old");
					 $(".new").removeClass("new");
					
					
			        setTimeout (function() {
			        	 $(".old").css("opacity", "0");
			        }, 10);
					 
					 
					 view.showView(transformData(view.dataSet,userName), offset);
				
				}
			
				//first undelegate the click event
				$e.undelegate('circle', 'click');

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
					friend.weightVal = RandomData(1,10);
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
			object.children.sort(weightSort);
			console.log(object);
			return object;
		}
		
		// Returns a list of all nodes under the root.
		function flatten(root) {
			var nodes = [], i = 0;
			
			function recurse(node) {
				if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
			    if (!node.id) node.id = ++i;
			    nodes.push(node);
			    return node.size;
			}
			
			root.size = recurse(root);
			return nodes;
		}
		
		//Color leaf nodes orange, and packages white or blue.
		function color(d) {
			return d._children ? "green" : d.children ? "green" : "#fd8d3c";
		}
		
		function radius(d) {
			return d._children ? 10 : d.children ? 10 : 5;
		}
		
		function weightSort(a,b){
			return a.weightVal>b.weightVal ? 1 :-1;
		}
		// --------- /Private Method --------- //
        
    })(jQuery);
})();
