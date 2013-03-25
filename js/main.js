$(function(){
	brite.display("MainScreen","#main-container");
});

$("document").ready(function() {
	$(".nav li").click(function(e) {
	var $li = $(e.currentTarget);
	$("li").removeClass("active");
	$li.addClass("active");
	var menu = $li.attr("data-nav");
	 if(menu == "UserWeightD3Cluster"){
	  	 brite.display("MainScreen","#main-container");
	 }else if(menu == "ContactClusterEaseljs"){
	  	 brite.display("ContactClusterEaseljs","#main-container");
	 }

	});

});


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



