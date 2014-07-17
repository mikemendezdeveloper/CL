
$("#startedText").ready(function(){ //fixes incorrect initial offset issue.
	/*Test before running the rest of the script */

	function initParallax(){
		var bannerElems = $("#cl-banner img"),
			movingElems = $(".parallax"),
			headers = $(".cl-header"),
			bottle = $("#bottle"),
			scrollDownCTA = $("#scrollDown"),
			scrollPos = 0,
			winHeight = $(window).height(),
			newPos = 0,
			scrollDelta = 0,
			initialScrollPos,
			headerIndex = 0,
			stemPos = 0,
			initialStemPos,
			totalStemTravel = 200,
			specialSpeed = .3,
			overlapAmount = 122,
			movingUp = true;
			stemImg = 1810; //This is the exact height of the actual image slice

		scrollDownCTA.css("top", (winHeight - 300) + "px"); //Position CTA just above fold line.

		function scrollDown(opacity){
			var stop = false,
				speed = 1500;

			if (scrollPos > 0){
				stop = true;
				opacity = 0;
				speed = 200;
			}

			scrollDownCTA.fadeTo(
				speed, 
				opacity,
				"swing",
				function(){
					opacity = opacity === 1 ? 0 : 1;
					if (!stop){
						scrollDown(opacity);
					}
				}
			)
		};
		scrollDown(0);

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

			if (scrollDelta != 0 || pageLoad){ //Only move when scrolling or on page load
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
			var timingValue = 100;

			//Tweak timing of individual items
			if ( self.is("#startedText") || self.is("#sku") ){
				var timingValue = 200;
			}
			if ( self.is("#video") || self.is("#objectsDart") ){
				var timingValue = 200;
			}
			if ( self.is("#shoes") || self.is("#text1") ){
				var timingValue = 400;
			}
			if ( self.is("#text") || self.is("#worker") ){
				var timingValue = 600;
			}
			//End timing tweaks
			
			var initial = self.offset().top - timingValue;

			//Calculate original position based on dist from top of page
			elem.startDistance = initial;
			elem.speed = 1;
			
			if ( self.hasClass("left") ){
				elem.side = "left";
				self.addClass("moveLeft");
				self.css("opacity", 0); //initially make all moving elems invisible.
			}
			else if ( self.hasClass("right") ) {
				elem.side = "right";
				self.addClass("moveRight");
				self.css("opacity", 0); //initially make all moving elems invisible.
			}

			//stem only
			if ( self.is("#stem") ){
				elem.side = "top";
				elem.topOffset = initial;
				initialStemPos = initial;
				elem.maxOffset = -270; //total amount the stem can move
				elem.minOffset = 2240;
				elem.stem = true;
				elem.speed = initialStemPos;
				elem.isBottle = false;
			}
			//applicator only !! THIS WAS A COPY PASTE, FILL IN WITH REAL VALUES
			
			if ( self.is("#applicator") ){
				elem.side = "top";
				elem.topOffset = initial;
				elem.maxOffset = 1540; //total amount the stem can move
				elem.minOffset = elem.startDistance;
				elem.stem = true;
				elem.speed = initialStemPos;
				elem.isBottle = false;
			}
			
			//bottle only
			if ( self.is("#bottle") ){
					elem.side = "top";
					elem.startDistance = elem.topOffset = (stemImg + initialStemPos - overlapAmount);
					elem.speed = specialSpeed;
					elem.maxOffset = 1419;
					elem.minOffset = 1845;
					elem.isBottle = true;
			}
			
			self.css(elem.side, elem.topOffset);


			//set initial position, in case page wasn't at the top on load.
			scrolling("firstPageLoad");

		});


		// Animation Logic -------------------------------
		function move(elem, self){
			//Actually Move the element
			if (elem.side === "top") {
				self.stop(true, false).animate({top: (elem.topOffset)}, 0, "linear"); //adjust the number 0 here to give some delay
			}
			else if (elem.side === "left"){
				self.animate({left: 0}, 1000, "easeInOutQuad");
				//fade in version
				self.fadeTo(700, 1, "easeInOutQuad");
			}
			else {
				self.animate({right: 0}, 1000, "easeInOutQuad");
				//fade in version
				self.fadeTo(700, 1, "easeInOutQuad");
			}
		};

		function moveLogic(scrollDelta, scrollPos){
			movingElems.each(function(i, elem){
				var self = $(this);
							
				if (elem.side === "top"){//product only logic

					if (scrollPos > 1200 && elem.isBottle ){ //start moving the bottle down instead of up
						if (typeof elem.savedPosition == "undefined"){ //only save once
							elem.savedPosition = elem.topOffset; //Store this position to use later
						}
						specialSpeed = 1;
						elem.topOffset += scrollDelta * specialSpeed;
						movingUp = false;
					} 
					else if (!movingUp && elem.isBottle){ //special thing to do when transitioning from up to down.
						specialSpeed = .3;
						elem.topOffset = elem.savedPosition;
						elem.topOffset -= scrollDelta * specialSpeed;
						movingUp = true;
					} else {
						specialSpeed = .3;
						elem.topOffset -= scrollDelta * specialSpeed; 
					}
					
					if (self.is("#stem")){
						console.log("elem.topOffset " + elem.topOffset);
						console.log("elem.maxOffset " + elem.maxOffset);
						console.log("elem.minOffset " + elem.minOffset);
						console.log("scrollPos " + scrollPos);
					}

					if (elem.topOffset >= elem.maxOffset && elem.topOffset <= elem.minOffset){
						console.log("moving");
						move(elem, self);
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
