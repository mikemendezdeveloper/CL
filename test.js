
$("#startedText").ready(function(){ //fixes incorrect initial offset issue.
	/*Test before running the rest of the script */

	function initParallax(){
		var bannerElems = $("#cl-banner img"),
			movingElems = $(".parallax"),
			headers = $(".cl-header"),
			bottle = $("#bottle"),
			scrollPos = 0,
			newPos = 0,
			scrollDelta = 0,
			timingValue = 100,
			initialScrollPos,
			specialSpeed = .2,
			headerIndex = 0,
			stemPos = 0,
			stemOffset = 120,
			stemImg = 1876; //This is the exact height of the actual image slice

		function fadeHeaders(){
			headers.each(function(i, elem){
				if ( elem.offsetTop < (newPos + 130) ){
					var self = $(this);
					self.fadeTo("slow", 1);
				}
			});
		};

		//Used for initialization, and then upon every scroll event.
		function scrolling (pageLoad) {
			newPos = Math.min($(window).scrollTop());
			fadeHeaders(newPos);

			scrollDelta = newPos - scrollPos;

			scrollPos = newPos;//Remember to update scrollPos

			pageLoad ? initialScrollPos = newPos : 0;

			if (scrollDelta > 0 || pageLoad){ //Only move when scrolling down the page or on page load
				moveLogic(scrollDelta, scrollPos);
			}
		};

		//init headers
		headers.each(function(i, elem){
			var self = $(this);
			elem.offsetTop = self.offset().top;
			self.css( "opacity", 0 ); //initially set opacity to 0
		});

		//init moving elems
		movingElems.each(function(i, elem){
			var self = $(this);
			
			var initial = self.offset().top - timingValue;

			//Calculate original position based on dist from top of page?
			elem.startDistance = initial;
			elem.speed = 1;
			
			if ( self.hasClass("left") ){
				elem.side = "left";
				self.addClass("moveLeft");
				//self.css("opacity", 0); //initially make all moving elems invisible.

			}
			else if ( self.hasClass("right") ) {
				elem.side = "right";
				self.addClass("moveRight");
				//self.css("opacity", 0); //initially make all moving elems invisible.

			}

			//only for the bottle
			if (self.hasClass("bottle")){
				elem.side = "top";
				if ( self.is("#bottle") ){

					elem.startDistance = elem.sideOffset = (stemImg + stemOffset - 287);//287 is just the distance that I want the bottle to initially lay over the stem
					elem.maxOffset = elem.sideOffset + 500;
					elem.speed = specialSpeed;
				}
			}
			if ( self.is("#stem") ){
				elem.sideOffset = stemOffset; //was -8 or 8 before
				elem.maxOffset = stemOffset + 200; //total amount the stem can move
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
			if (elem.side === "top") {
				self.stop(true, false).animate({top: (elem.sideOffset)}, 300, "linear");
			}
			else if (elem.side === "left"){
				self.animate({left: 0}, 2000, "easeInOutQuad");
				//self.fadeTo("slow", 1);
			}
			else {
				self.animate({right: 0}, 2000, "easeInOutQuad");
				//self.fadeTo("slow", 1);
			}
		};

		function moveLogic(scrollDelta, scrollPos){
			movingElems.each(function(i, elem){
				var self = $(this),
					delay = 200; //for tuning bottle
				
									
				if (elem.side === "top"){//bottle only logic
								//console.log("scrollPos " + scrollPos);
								//console.log("stemPos " + stemPos);
								//console.log("elem.sideOffset " + elem.sideOffset);
					if (scrollPos > delay && (scrollPos >= stemPos) ){ 
						elem.sideOffset += (scrollDelta * specialSpeed); //So I can speed bottle up after stem stops moving

						if (elem.sideOffset > elem.maxOffset){
							specialSpeed = .7; //When the stem stops moving, speed up the bottle's movement
							elem.sideOffset = elem.maxOffset;
						}
							move(elem, self);
							stemPos = scrollPos;
					}
				}
				else if (scrollPos > elem.startDistance - 200){
					if (!elem.animated){
						move(elem, self);
						elem.animated = true;
					}
				}
			})
		};


		$(window).scroll(function (){ 
			scrolling();
		});

		//Hid, and then Fade-In Banner Elements
		(function (){
			var i = 0,
				len = bannerElems.length,
				waitTime = 200;

			bannerElems.each(function(i, elem){
			var self = $(this);
			self.css("opacity", 0);
			});

			function waitToFade (i) {
				setTimeout(function(){
					$(bannerElems[i]).fadeTo("slow", 1);
				}, waitTime);
				waitTime += 800;
			};

			for (i; i<len; i+=1){
				waitToFade(i);
			}
		}());
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
	
	/*fade out loading cover*/
	var whiteCover = $("#cover");
	whiteCover.fadeOut("slow");
	whiteCover.addClass("jsEnabled");
	

});//end ready
