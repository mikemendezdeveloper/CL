
var movingElems = $(".parallax"),
	bottle = $("#bottle"),
	scrollPos = Math.min($(window).scrollTop()),
	newPos = 0,
	scrollDelta = 0,
	timingValue = 200;

//Initialize all elements
movingElems.each(function(i, elem){
	var self = $(this);
	
	var initial = self.offset().top - timingValue;
	console.log("initial: " + initial);

	//if ( self.data("wait") ){initial += self.data("wait");}
	//get data attribute for extra offset?
	//Calculate original position based on dist from top of page?
	elem.sideOffset = elem.maxOffset = initial * -1;
	elem.startOffset = initial;
	//Set the left/right offset of the element based on its topOffset
	elem.side = self.hasClass("left") ? "left" : "right";
	if (self.hasClass("bottle")){
		elem.side = "top";

	}
	//Initialize an "extraOffset" property for keeping track past 0
	elem.extraOffset = 0;
	elem.sideOffset = elem.maxOffset = initial * -1; //!!This is hardcoded to get around a bug.
	
	self.css(elem.side, elem.sideOffset);
});

// Animation Logic -------------------------------
function move(elem, self){
	//Actually Move the element
	if (elem.side === "left"){
		self.stop(true, false).animate({left: elem.sideOffset}, 300, "linear");
	}
	else if (elem.side === "top") {
		self.stop(true, false).animate({top: elem.sideOffset}, 300, "linear");
	}
	else {
		self.stop(true, false).animate({right: elem.sideOffset}, 300, "linear");
	}
};

function xLogic(scrollDelta, scrollPos){
	movingElems.each(function(i, elem){
		var self = $(this);

								if (i == 14){
									console.log("scrollDelta" + scrollDelta);
									console.log("before" + elem.sideOffset);
								}
								if (i == 14){console.log("scrollPos: " + scrollPos);console.log("startOffset: " + elem.startOffset);}
		
		if (scrollPos <= elem.startOffset){
			elem.extraOffset = 0;
		}
		else {
			elem.extraOffset = (scrollPos - elem.startOffset); //start tracking extra offset
			if (elem.sideOffset != 0){//if its not already zero, set it to 0 and move it there.
				elem.sideOffset = 0;

				move(elem, self);
			}
		}

		if (Math.abs(elem.extraOffset) == 0){ //If there is no extraOffset then move
		
			elem.sideOffset += scrollDelta; 
								if (i == 14){console.log("after" + elem.sideOffset);}
			if (elem.sideOffset > 0){
				elem.sideOffset = 0;
			}
			if (elem.sideOffset < elem.maxOffset){elem.sideOffset = elem.maxOffset;}

			move(elem, self);
		}
							if (i == 14){console.log("sideOffset: " + elem.sideOffset + " extraOffset: " + elem.extraOffset);}
	})
};

$(window).scroll(function (){ 
	newPos = Math.min($(window).scrollTop());

	scrollDelta = newPos - scrollPos;

	scrollPos = newPos;//Remember to update scrollPos

	xLogic(scrollDelta, scrollPos);

});