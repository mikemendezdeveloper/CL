//Initialize all moving elements
var movingElems = $(".parallax"),
	scrollPos = Math.min($(window).scrollTop()),
	newPos = 0,
	scrollDelta = 0,
	timingValue = 20;



	movingElems.each(function(i, elem){
		var self = $(this);
		//get data attribute for extra offset?
		//Calculate original position based on dist from top of page?
		elem.sideOffset = (self.offset().top) * -1;
		elem.maxOffset = (self.offset().top) * -1;
		elem.startOffset = (self.offset().top);
		console.log("initial scrollPos" + scrollPos);
		//Set the left/right offset of the element based on its topOffset
		elem.side = self.hasClass("left") ? "left" : "right";
		//Initialize an "extraOffset" property for keeping track past 0
		elem.extraOffset = 0;
		
		self.css(elem.side, elem.sideOffset);
	});


// Animation Logic -------------------------------
function move(scrollDelta, scrollPos){
	movingElems.each(function(i, elem){
		var self = $(this);

								if (i == 0){
									console.log("scrollDelta" + scrollDelta);
									console.log("before" + elem.sideOffset);
								}
								if (i == 0){console.log("scrollPos: " + scrollPos);console.log("startOffset: " + elem.startOffset);}
		
		if (scrollPos <= elem.startOffset){
			elem.extraOffset = 0;
		}
		else {
			elem.extraOffset = (scrollPos - elem.startOffset); //start tracking extra offset
			if (elem.sideOffset != 0){//if its not already zero, set it to 0 and move it there.
				elem.sideOffset = 0;

				if (elem.side === "left"){
					self.stop(true, false).animate({left: elem.sideOffset}, 300, "linear");
				}
				else {
					self.stop(true, false).animate({right: elem.sideOffset}, 300, "linear");
				}
			}
		}

		if (Math.abs(elem.extraOffset) == 0){ //If there is no extraOffset then move
		
			elem.sideOffset += scrollDelta; 
								if (i == 0){console.log("after" + elem.sideOffset);}
			if (elem.sideOffset > 0){
				elem.sideOffset = 0;
			}
			if (elem.sideOffset < elem.maxOffset){elem.sideOffset = elem.maxOffset;}

			//Actually Move the element
			if (elem.side === "left"){
				self.stop(true, false).animate({left: elem.sideOffset}, 300, "linear");
			}
			else {
				self.stop(true, false).animate({right: elem.sideOffset}, 300, "linear");
			}
		}
							if (i == 0){console.log("sideOffset: " + elem.sideOffset + " extraOffset: " + elem.extraOffset);}
	})
};

$(window).scroll(function (){ 
	newPos = Math.min($(window).scrollTop());

	scrollDelta = newPos - scrollPos;

	scrollPos = newPos;//Remember to update scrollPos

	move(scrollDelta, scrollPos);

});