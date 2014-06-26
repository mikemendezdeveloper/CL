//Initialize all moving elements
var movingElems = $(".parallax"),
	scrollPos = Math.min($(window).scrollTop()),
	newPos = 0,
	scrollDelta = 0;



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

		if (elem.extraOffset > 0){ //Use all extra offset first
			if (elem.extraOffset < elem.startOffset && scrollDelta < 0){ //scrolling up
				elem.extraOffset = 0;
			}
			else {
				elem.extraOffset += scrollDelta;
			}
			if (elem.extraOffset < 0){elem.extraOffset = 0;} //don't allow negative value

		}
		else {
			elem.sideOffset += scrollDelta; //if extra is used up, start moving
		}

								if (i == 0){console.log("after" + elem.sideOffset);}

		if (elem.sideOffset > 0){
			elem.sideOffset = 0;
			elem.extraOffset += scrollDelta; //save extra offset
		}
								if (i == 0){console.log("extraOffset: " + elem.extraOffset);}

		if (elem.sideOffset < elem.maxOffset){elem.sideOffset = elem.maxOffset}

		/*
		* Only move if amount you are about to move by, is either larger than
		* the initial offset, or smaller than max offset. That might be backwards...
		*/
			if (elem.side === "left"){
				self.stop(true, false).animate({left: elem.sideOffset}, 300, "linear");
			}
			else {
				self.stop(true, false).animate({right: elem.sideOffset}, 300, "linear");
			}
		
	})
};

$(window).scroll(function (){ 
	newPos = Math.min($(window).scrollTop());

	scrollDelta = newPos - scrollPos; //wrap in Math.abs() to get absolute value.

	scrollPos = newPos;//Remember to update scrollPos

	move(scrollDelta, scrollPos);

});