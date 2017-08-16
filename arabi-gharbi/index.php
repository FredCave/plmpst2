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
				<iframe data-src="https://www.youtube.com/embed/videoseries?list=PLGf0_dz21-MM7XIwmazK0dSXL7sbK1Ns1&autoplay=1"></iframe>
			</div>

			<div id="slideshow_1" class="slideshow_wrapper group_one"></div>
			<div id="slideshow_2" class="slideshow_wrapper group_two"></div>
			<div id="slideshow_3" class="slideshow_wrapper group_one"></div>
			<div id="slideshow_4" class="slideshow_wrapper group_two"></div>

			<!-- WEBCAM -->
			<div id="webcam">
				<video id="webcam_video" width="1280" height="960" preload autoplay loop muted></video>
				<canvas id="canvas" width="1280" height="960"></canvas>

				<div id="webcam_access_screen">
					<p>Please allow access to your webcam above</p>
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
					<p>Would you like to add your portrait to the Arabi-Gharbi archive?</p>
					<div id="webcam_success_yes" class="webcam_button"><p>Yes</p></div>
					<div id="webcam_success_no" class="webcam_button"><p>No</p></div>
				</div>

			</div>
			
		</div>

		<div id="frame" style="background-image:url('<?php bloginfo('stylesheet_directory'); ?>/assets/img/frame.png')" ></div>

		<?php 
		echo "before:";
		include("includes/get_server_files.php"); 
		echo "after:";
		?>

		<!-- #INFO APPENDED AT END OF #WRAPPER FROM __INFO.PHP -->
	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Arabi Gharbi";
		$artist = "Ohad Hadad and Hilal Jabareen";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>


	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/tracking-min.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>