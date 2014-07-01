$( document ).ready(function() {
	/*Test before running the rest of the script */


	function initParallax(){
		var movingElems = $(".parallax"),
		bottle = $("#bottle"),
		scrollPos = 0,
		newPos = 0,
		scrollDelta = 0,
		timingValue = 180,
		initialScrollPos,
		specialSpeed = .2;

		//Used for initialization, and then upon every scroll event.
		function scrolling (pageLoad) {
			newPos = Math.min($(window).scrollTop());

			scrollDelta = newPos - scrollPos;

			scrollPos = newPos;//Remember to update scrollPos

			pageLoad ? initialScrollPos = newPos : 0;

			if (scrollDelta > 0 || pageLoad){ //Only move when scrolling down the page or on page load
				moveLogic(scrollDelta, scrollPos);
			}
		};

		movingElems.each(function(i, elem){
			var self = $(this);
			
			var initial = self.offset().top - timingValue;

			if ( self.data("wait") ){initial += self.data("wait");}
			//get data attribute for extra offset?
			//Calculate original position based on dist from top of page?
			elem.sideOffset = elem.maxOffset = initial * -1;
			elem.startDistance = initial;
			elem.speed = 1;
			//Set the left/right offset of the element based on its topOffset
			elem.side = self.hasClass("left") ? "left" : "right";

			//Initialize an "extraOffset" property for keeping track past 0
			elem.extraOffset = 0;
			elem.sideOffset = elem.maxOffset = initial * -1; //!!This is hardcoded to get around a bug.
			
			//only for the bottle
			if (self.hasClass("bottle")){
				elem.side = "top";
				if ( self.is("#bottle") ){
					elem.startDistance = 1600;
					elem.sideOffset = 1600;
					elem.maxOffset = 2120;
					elem.speed = specialSpeed;
				}
			}
			if ( self.is("#stem") ){
				elem.maxOffset = 215;

				elem.stem = true;
				elem.speed = specialSpeed;
			}
			
			self.css(elem.side, elem.sideOffset);

			//set initial position, in case page wasn't at the top on load.
			scrolling("firstPageLoad");
		});
		// Animation Logic -------------------------------
		function move(elem, self){
			//Actually Move the element
			if (elem.side === "left"){
				self.stop(true, false).animate({left: elem.sideOffset}, 300, "linear");
			}
			else if (elem.side === "top") {
				self.stop(true, false).animate({top: (elem.sideOffset)}, 300, "linear");
			}
			else {
				self.stop(true, false).animate({right: elem.sideOffset}, 300, "linear");
			}
		};

		function moveLogic(scrollDelta, scrollPos){
			movingElems.each(function(i, elem){
				var self = $(this),
					delay = 200; //for tuning bottle
				
									
				if (elem.side === "top"){//bottle only logic
								
					//delay before moving bottle and stem
					if (scrollPos > 300){
						elem.sideOffset += (scrollDelta * specialSpeed); //So I can speed bottle up after stem stops moving

						if (elem.sideOffset < 0){elem.sideOffset = 0;}

						if (elem.sideOffset > elem.maxOffset){
							specialSpeed = .7;
							elem.sideOffset = elem.maxOffset;
						}

							move(elem, self);
					}
				}
				else {
					elem.sideOffset += initialScrollPos;

					elem.sideOffset += scrollDelta;

					if (elem.sideOffset > 0){elem.sideOffset = 0;}

					if (elem.sideOffset < elem.maxOffset){elem.sideOffset = elem.maxOffset;}

					move(elem, self);
				}
			})
		};


		$(window).scroll(function (){ 
			scrolling();
		});
	};

	/*****************/
	//Test first
	/*var testElem = $("#startedText"),
		testElemPos = parseInt(testElem.offset().top);

	testElem.animate({left: testElemPos}, 0, "linear");
	testNewPos = parseInt( testElem.css("left") );
	if (testElemPos === testNewPos){
		//Begin
		initParallax();
	}
	*/
	initParallax();

});
