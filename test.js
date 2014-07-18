
$("#worker").ready(function(){ //fixes incorrect initial offset issue.
	/*Test before running the rest of the script */

	function initParallax(){
		var fadeInOnLoad = $("#cl-banner img"),
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

			fadeInOnLoad.push($("#bottle"), $("#stem"), $("#applicator"), $("#startedText"), $("#sku"), headers[0]);

			if (winHeight > 850){
				fadeInOnLoad.push(headers[1], $("#video"), $("#objectsDart"));
			}
			if (winHeight > 1600){
				fadeInOnLoad.push($("#quoteOne"), $("#gloves"), $("#art"), $("#playfulText"));
			}
			if (winHeight > 2400){
				fadeInOnLoad.push(headers[2], $("#quoteTwo"), $("#dancingGuy"));
			}
			if (winHeight > 3200){
				fadeInOnLoad.push($("#shoes"), $("#text1"), $("#text"), $("#worker") );
			}


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

			initialScrollPos = 0;

			if (scrollDelta != 0 ){ //Only move when scrolling or on page load
				moveLogic(scrollDelta, scrollPos);
			}
			$("#bottle").css("opacity", 1);
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

			if ( self.is("#video") || self.is("#objectsDart") ){
				var timingValue = 200;
			}
			if ( self.is("#shoes") || self.is("#text1") ){
				var timingValue = 700;
			}
			if ( self.is("#text") || self.is("#worker") ){
				var timingValue = 600;
			}
			//End timing tweaks
			
			var initial = self.offset().top - timingValue;

			//Calculate original position based on dist from top of page
			elem.startDistance = initial;
			elem.speed = 1;
			//self.css("opacity", 0); //initially make all moving elems invisible.

			
			if ( self.hasClass("left") ){
				elem.side = "left";
				//self.addClass("moveLeft");
				self.css("opacity", 0); //initially make all moving elems invisible.
			}
			else if ( self.hasClass("right") ) {
				elem.side = "right";
				//self.addClass("moveRight");
				self.css("opacity", 0); //initially make all moving elems invisible.
			}

			//stem only
			if ( self.is("#stem") ){
				elem.side = "top";
				elem.topOffset = 192;
				initialStemPos = 192;
				elem.maxOffset = -270; //total amount the stem can move
				elem.minOffset = 2240;
				elem.stem = true;
				elem.speed = 1;
				elem.isBottle = false;
			}
			//applicator only !! THIS WAS A COPY PASTE, FILL IN WITH REAL VALUES
			
			if ( self.is("#applicator") ){
				elem.side = "top";
				elem.topOffset = initial;
				elem.maxOffset = 1540; //total amount the stem can move
				elem.minOffset = elem.startDistance;
				elem.stem = true;
				elem.speed = 1;
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
		function move(elem, self, timing){
			//Actually Move the element
			if (elem.side === "top") {
				self.stop(true, true).animate({top: (elem.topOffset)}, timing, "linear"); //adjust the number 0 here to give some delay
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
				var currentStemOffset = movingElems[14].topOffset;
				var posBelowStem = (stemImg + currentStemOffset - overlapAmount);
				if(self.is("#stem")){;}
							
				if (elem.side === "top"){//product only logic
		
					if (elem.isBottle && (currentStemOffset <= -169) ){ //start moving the bottle down instead of up
						specialSpeed = 1;//start moving the bottle faster
						elem.topOffset += scrollDelta * specialSpeed;//Move down not up
						movingUp = false;
					} 
					//if things were moving down, but now we should start moving up then...
					else if (!movingUp && elem.isBottle){ //special thing to do when transitioning from up to down.
						specialSpeed = .3;
						elem.topOffset = posBelowStem; //set bottle right under stem - SNAP POINT
						elem.topOffset -= scrollDelta * specialSpeed;
						movingUp = true;
					} else {//move everything up.
						specialSpeed = .3;
						elem.topOffset -= scrollDelta * specialSpeed; 
						if (elem.isBottle){
							elem.topOffset = posBelowStem;
						}
					}
					
					if (elem.isBottle && (scrollPos > 1650) ){ //this is a snap POINT
						elem.topOffset = elem.minOffset;
						move(elem, self, 200);
					}

					if (elem.topOffset >= elem.maxOffset && elem.topOffset <= elem.minOffset){
						if ( elem.isBottle && (elem.topOffset <= posBelowStem) ) {
							elem.topOffset = posBelowStem;
						}
						move(elem, self, 0);
					}
				
				}
				else if (scrollPos > elem.startDistance - 200){
					if (!elem.animated){
						move(elem, self, 0);
						elem.animated = true;
					}
				}
		
			})
		};

		$(window).scroll(function (){ 
			scrolling();
		});

		//Hide, and then Fade-In Banner Elements
		(function (){
			var i = 0,
				len = fadeInOnLoad.length,
				waitTime = 200;

			fadeInOnLoad.each(function(i, elem){
			var self = $(this);
			self.css("opacity", 0);
			});

			function waitToFade (i) {
				setTimeout(function(){
					$(fadeInOnLoad[i]).fadeTo("slow", 1);
				}, waitTime);
				if (waitTime < 2500){
					waitTime += 800;
				}
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
	window.setTimeout(
		function(){
			window.scrollTo(0, 0);
			/*fade out loading cover*/
			var whiteCover = $("#cover");
			whiteCover.fadeOut("slow");
			whiteCover.addClass("jsEnabled");
			initParallax();

		}, 1500
	);
/*
	// left: 37, up: 38, right: 39, down: 40,
	// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	var keys = [37, 38, 39, 40];

	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
	      e.preventDefault();
	  e.returnValue = false;  
	}

	function keydown(e) {
	    for (var i = keys.length; i--;) {
	        if (e.keyCode === keys[i]) {
	            preventDefault(e);
	            return;
	        }
	    }
	}

	function wheel(e) {
	  preventDefault(e);
	}

	function disable_scroll() {
	  if (window.addEventListener) {
	      window.addEventListener('DOMMouseScroll', wheel, false);
	  }
	  window.onmousewheel = document.onmousewheel = wheel;
	  document.onkeydown = keydown;
	}

	function enable_scroll() {
	    if (window.removeEventListener) {
	        window.removeEventListener('DOMMouseScroll', wheel, false);
	    }
	    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
	}
*/

});//end ready
