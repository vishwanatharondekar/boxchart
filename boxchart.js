function renderMatrix(arr){
	var totalAmount = 0;
	for(var i=0; i<arr.length; i++){
		totalAmount+=arr[i];    
	}
	arr.sort(function(a,b){
		return a-b;
	});

	var perc = [];
	for(var i=0; i<arr.length; i++){
		perc.push(arr[i]/totalAmount);
	}

	var colors = ['#cccccc','red', 'blue', 'green', 'gray', 'black', 'cyan', 'purple', 'white'];
	var svgElem = document.getElementById('svgelem');
	var totalWidth = 300;
	var totalHeight = 300;
	

	
	var coordinates = [];
	
	var colorCounter=0;
	function setCoordinates(width, height, left, top){
		
		coordinates.push({
			width : width,
			height : height,
			left : left,
			top : top,
			right : left + width,
			bottom : top + height
		});
		
		
	}
	
	function drawRectangle(width, height, left, top){
		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		//var rect = document.createElement('rect');
		rect.setAttribute('width', width);
		rect.setAttribute('height', height);
		rect.setAttribute("x", left);
		rect.setAttribute("y", top);
		rect.setAttribute('fill', colors[colorCounter%7]);
		colorCounter++;
		svgElem.appendChild(rect);
	}
	
	var totalArea = 300*300;
	var large = [];
	var medium = [];
	var small = [];
	var slabs = {
			large : [],
			medium : [],
			small : []
	}; 
	var slabBarrier = {
			"0" : "large",
			"1" : "medium",
			"2" : "small"
	};
	var total = 0;
	var slots = {
			0 : 0,
			1 : 0,
			2 : 0,
			3 : 0,
			4 : 0,
			5 : 0,
			6 : 1,
			7 : 2,
			8 : 1,
			9 : 2,
			10 : 2
	};
	for(var i=0; i<perc.length; i++){
		total += perc[i];
		var actualSlot = slots[parseInt(parseInt(total*100)/10)];
		slabs[slabBarrier[actualSlot]].push(perc[i]);
	}

	var largerSlab = slabs['large'];
	totalLargerSlabArea = 0;
	for(var i=0;i<largerSlab.length;i++){
		totalLargerSlabArea+=largerSlab[i];
	}



	var emptyBox={
			left : 0,
			top : 0,
			right :totalWidth ,
			bottom : totalHeight
	};


	arr = arr.sort(function(a,b){
		return parseInt(a)-parseInt(b);
	});
	var progression="onward";
	var amount = arr[0];
	var areaRequired = totalWidth*totalHeight/totalAmount*amount;

	var widthRequired = Math.sqrt(areaRequired*3/1);
	var heightRequired = areaRequired/widthRequired;
	var lastWidthUsed = widthRequired;
	var lastHeightUsed = heightRequired;

	var lastLeft = 0;
	var lastTop = 0;
	var leftToUse = 0;
	var topToUse = 0;


	var leftAvailable = 0;
	var topAvailable = 0;
	var rightAvailable = totalWidth;
	var bottomAvailable = totalHeight;

	var startAllOver = false;


	setCoordinates(widthRequired, heightRequired, emptyBox.left,emptyBox.top);
	emptyBox.left = widthRequired + emptyBox.left;
	topAvailable = heightRequired;

	function calculateCoordinates(){
		console.log(arr);
		for(var i=1;i<arr.length;i++){
			var amount = arr[i];
			var areaRequired = totalWidth*totalHeight/totalAmount*amount;
			console.log('Area required', areaRequired);
			var widthToTry = 0;

			
			if(progression==='onward' || progression==='backward'){
				widthToTry = areaRequired/lastHeightUsed;
			} else {
				heightToTry = areaRequired/lastWidthUsed;
			}

	
			if(progression==='onward' && emptyBox.left+widthToTry>rightAvailable ){
				
				if((emptyBox.left+widthToTry) - rightAvailable >30){
					widthRequired = rightAvailable - emptyBox.left;
					heightRequired = lastHeightUsed;
					leftToUse = emptyBox.left;
					topToUse = emptyBox.top;
					startAllOver = true;
				} else {
					widthRequired = rightAvailable - emptyBox.left;
					heightRequired = areaRequired/widthRequired;
					
					leftToUse = emptyBox.left;
					topToUse = emptyBox.top;
					rightAvailable = rightAvailable - widthRequired;
				}
				progression = "downward";
				
				
				
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
	
				emptyBox.left = leftAvailable;
				emptyBox.top =emptyBox.top + heightRequired;
	
	
			} else if(progression==='downward' && emptyBox.top+heightToTry>bottomAvailable ){
				heightRequired = bottomAvailable- emptyBox.top;
				widthRequired = areaRequired/heightRequired;
				progression = "backward";
	
				leftToUse = emptyBox.right-widthRequired;
				topToUse = emptyBox.top;
	
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
	
				emptyBox.right = leftToUse;
				emptyBox.top = topAvailable;
	
				bottomAvailable = bottomAvailable - heightRequired;
	
	
			} else if(progression==='backward' && emptyBox.right-widthToTry<leftAvailable ){ 
				widthRequired = emptyBox.right -  leftAvailable;
				heightRequired = areaRequired/widthRequired;
				progression = "upward";
	
				topToUse = emptyBox.bottom - heightRequired;
				leftToUse = leftAvailable;
	
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
	
				emptyBox.right = rightAvailable;
				emptyBox.bottom = emptyBox.bottom - heightRequired;
	
				leftAvailable = leftAvailable + widthRequired;
	
			} else if(progression==='upward' && emptyBox.top-heightToTry<topAvailable ){
				heightRequired =  emptyBox.bottom - topAvailable;
				widthRequired = areaRequired/heightRequired;
				progression = "onward";
	
				leftToUse = emptyBox.left;
				topToUse = emptyBox.top;
	
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
	
				emptyBox.left = emptyBox.left + widthRequired;
				emptyBox.bottom = bottomAvailable;
	
				topAvailable = topAvailable + heightRequired;
	
			} else if(progression==="onward"){
				heightRequired = lastHeightUsed;
				widthRequired = areaRequired/heightRequired;
	
				leftToUse = emptyBox.left;
				topToUse = lastTop;
	
	
				if(leftToUse+widthRequired+30>rightAvailable){
					widthRequired = rightAvailable - leftToUse;
					emptyBox.left = leftAvailable;
					emptyBox.top = topAvailable;
					//rightAvailable = rightAvailable - widthRequired;
					progression = "downward";
					startAllOver = true;
				} else {
					emptyBox.left = emptyBox.left + widthRequired;
				}
	
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
			} else if(progression==="downward"){
	
				if(startAllOver){
					heightRequired = Math.sqrt(areaRequired*3/1);
					widthRequired = areaRequired/heightRequired;
					leftToUse = rightAvailable - widthRequired;
					topToUse = lastTop + lastHeightUsed;
					rightAvailable = rightAvailable - widthRequired;
					startAllOver = false;
				} else {
					widthRequired = lastWidthUsed;
					heightRequired = areaRequired/widthRequired;
	
					leftToUse = lastLeft;
					topToUse = lastTop + lastHeightUsed;
	
				}
	
	
				if(topToUse+heightRequired+30>bottomAvailable){
					heightRequired = bottomAvailable - topToUse;
					emptyBox.top = topAvailable;
					progression = "backward";
					startAllOver = true;
				} else {
					emptyBox.top = heightRequired + emptyBox.top;
				}
	
				setCoordinates(widthRequired, heightRequired, leftToUse ,topToUse);
			} else if(progression==="backward"){
	
				if(startAllOver){
					widthRequired = Math.sqrt(areaRequired*3/1);
					heightRequired = areaRequired/heightRequired;
					leftToUse = rightAvailable - widthRequired;
					topToUse = bottomAvailable - heightRequired;
	
					topAvailable = topAvailable - heightRequired;
	
					startAllOver = false;
				} else {
	
					heightRequired = lastHeightUsed;
					widthRequired = areaRequired/heightRequired;
	
					leftToUse = lastLeft-widthRequired;
					topToUse = lastTop;
				}
	
				if(leftToUse-30<leftAvailable){
					leftToUse = leftAvailable;
					widthRequired = emptyBox.right - leftToUse;
					emptyBox.top = topAvailable;
					emptyBox.right = rightAvailable;
					emptyBox.bottom = bottomAvailable;
					progression = "upward";
					startAllOver = true;
				} else {
					emptyBox.right = emptyBox.right - widthRequired;
				}
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
	
			} else if(progression==="upward"){
				widthRequired = lastWidthUsed;
				heightRequired = areaRequired/widthRequired;
	
				leftToUse = lastLeft-widthRequired;
				topToUse = lastTop;
	
				if(topToUse-30<topAvailable){
					heightRequired = topAvailable - topToUse;
					emptyBox.left = leftAvailable;
					progression = "onward";
					startAllOver = true;
				} else {
					emptyBox.bottom = emptyBox.bottom - heightRequired;
				}
	
				setCoordinates(widthRequired, heightRequired, leftToUse,topToUse);
			}
			lastWidthUsed = widthRequired;
			lastHeightUsed = heightRequired;
			lastLeft = leftToUse;
			lastTop = topToUse;
		};
	}
	calculateCoordinates();
	adjustCoordinates();
	
	
	function adjustCoordinates(){
		for ( var i = 0; i < coordinates.length; i++) {
			var coordinate = coordinates[i];
			if(emptyBox.left){
				
			}
			if(emptyBox.top===coordinate.bottom){
				coordinate.bottom = emptyBox.bottom;
				coordinate.height = emptyBox.bottom - coordinate.top;
			}
			if(emptyBox.right){
				
			}
			if(emptyBox.bottom){
				
				
			}
			
		}
	}
	
	drawCoordinates();
	
	function drawCoordinates(){
		
		for ( var i = 0; i < coordinates.length; i++) {
			var coordinate = coordinates[i];
			drawRectangle(coordinate.width, coordinate.height, coordinate.left, coordinate.top);
		}
		
	}
	
}