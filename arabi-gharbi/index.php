<?php get_header(); ?>
	
	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="8" data-bg="<?php echo $bg_var; ?>">
		
		<!-- FRAME -->
		<div id="content_frame">

			<!-- YOUTUBE PLAYLIST -->
			<div id="youtube_playlist">
				<?php
				// RANDOM STARTING POINT FOR PLAYLIST
				$randIndex = mt_rand( 0, 24 );
				?>
				<iframe type="text/html" width="720" height="405" src="https://www.youtube.com/embed/?autoplay=1&fs=0&list=PLGf0_dz21-MM7XIwmazK0dSXL7sbK1Ns1&listType=playlist&loop=1&playsinline=1&rel=0&showinfo=0&index=<?php echo $randIndex; ?>&color=white&iv_load_policy=3" frameborder="0" allowfullscreen>
				</iframe>
			</div>

			<div id="slideshow_1" class="slideshow_wrapper group_one"></div>
			<div id="slideshow_2" class="slideshow_wrapper group_two"></div>
			<div id="slideshow_3" class="slideshow_wrapper group_one"></div>
			<div id="slideshow_4" class="slideshow_wrapper group_two"></div>

			<!-- TWITTER -->
			<div id="twitter_wrapper" style="background-image:url('<?php bloginfo('stylesheet_directory'); ?>/assets/img/twitter_back.jpg')">
				<ul></ul>
			</div>

			<!-- WEBCAM -->
			<div id="webcam">
				<video id="webcam_video" width="1280" height="960" preload autoplay loop muted></video>
				<canvas id="canvas" width="1280" height="960"></canvas>

				<div id="webcam_access_screen">
					<p>Please allow access to the webcam in your browser</p>
					<span class="terms">
						<a target="_blank" href="http://jerusalempalimpsest.com/Arabi-Arabi Terms of Use.pdf">
							Terms of Use
						</a>
					</span>
				</div>

				<div id="webcam_error_screen">
					<p>Webcam access is not supported on your browser.<br> Please try Chrome or Firefox.</p>
				</div>

				<div id="webcam_initial_image"></div>

				<!-- BUTTONS -->
				<div id="webcam_button_init" class="webcam_button"><p>Take Your Own Photo</p></div>

				<div id="webcam_loaded_buttons">
					<div id="webcam_button_close" class="webcam_button">
						<img class="blue" src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/webcam_close_blue.svg" />
						<img class="white" src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/webcam_close_white.svg" />
					</div>
					<div id="webcam_button_refresh" class="webcam_button"><p>Refresh</p></div>
					<a id="webcam_button_take" class="webcam_button" download=""><p>Take Photo</p></a>
				</div>

				<div id="webcam_success">
					<p>Mabruk!</p>
					<p>Would you like to add your portrait to the Arabi-Arabi archive?</p>
					<div id="webcam_success_yes" class="webcam_button"><p>Yes</p></div>
					<div id="webcam_success_no" class="webcam_button"><p>No</p></div>
				</div>

				<audio id="cam_click">
					<source src="<?php bloginfo('stylesheet_directory'); ?>/assets/audio/cam_click.mp3" />
				</audio>

			</div>
			
		</div>

		<div id="frame" style="background-image:url('<?php bloginfo('stylesheet_directory'); ?>/assets/img/frame.png')" ></div>

		<!-- #INFO APPENDED AT END OF #WRAPPER FROM __INFO.PHP -->
	</div>

	<div id="work_nav">
					
		<div class="button_right">
			<div id="fullscreen">
				<a href="">
					<img class="enter_fullscreen" src="<?php bloginfo('template_url'); ?>/assets/img/icon_fullscreen.svg" />
					<img class="exit_fullscreen" src="<?php bloginfo('template_url'); ?>/assets/img/icon_fullscreen_exit.svg" />
				</a>
			</div>
		</div>	

	</div>

	<div id="comment_wrapper">
		<?php 
		// ATTEMPT AT POSTING WEBCAM IMAGES THROUGH COMMENT FORM
		comment_form(); 
		?>
	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Arabi-Arabi";
		$artist = "Ohad Hadad, Hilal Jabareen";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="https://platform.twitter.com/widgets.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/tracking-min.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>