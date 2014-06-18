<script src='//player.ooyala.com/v3/YTMwZmZmOGY2YWU1NGM1NTM1MmQxNjM3'></script>
	<div id='ooyalaplayer' style='width:640px;height:360px'></div>
	<script>
		OO.ready(function() { 
			OO.Player.create(
				'ooyalaplayer',
				'J2eDc5bjpRzdTYPxt3av3UlkPIMYbI6_',
				{
					autoplay: true,
					loop: true, 
					layout: 'chromeless',
					'flashParams': {
						hide: 'all'
					}
				}
			); 
		});
	</script>
</div>



/* CSS Override ooyala style */
<style>
#ooyalaplayer>div {
	z-index: 10 !important; /* Stop overlap of top bar */
}
#ooyalaplayer .innerWrapper {
	background: #ffffff !important; 
	/* Change color shown before video is ready 
	* Maybe I could use a jpg of the product to make up for the frame that 
	* shows for a sec before the video loops again.
	*/
}
</style>








/* THE STUFF BELOW HERE IS NO LONGER NEEDED. I CAN CONTROL THE FLASH PLAYER */

/* ?platform=html5-priority to use html5 and then fall back to flash*/
-----------------
/* ooyala always falls back to Flash if HTML5 video doesn't work
* I need to check if HTML5 is going to work and not show the 
* video at all if it doesn't. This is because I can't control
* the appearance of the controls with Flash.
*/
var htmlVideo = "";

function supports_video() {
  return !!document.createElement('video').canPlayType;
}

function supports_h264_baseline_video() {
  if (!supports_video()) { return false; }
  var v = document.createElement("video");
  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
}

