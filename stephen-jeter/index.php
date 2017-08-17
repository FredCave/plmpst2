<?php get_header(); ?>

	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="9" data-bg="<?php echo $bg_var; ?>">
		
		<!-- INTRO PORTRAITS -->

		<div id="intro_portraits">
			<div id="portrait_wrapper_1" class="portrait_wrapper" data-link="video_1">
				<?php /* <video id="portrait_1" class="portrait_video" playsinline>
					<source data-src="<?php bloginfo("stylesheet_directory"); ?>/assets/video/Bashar Portrait.mp4" />
				</video> */?>
			</div>
			<div id="portrait_wrapper_2" class="portrait_wrapper" data-link="video_2">
				<video id="portrait_2" class="portrait_video" autoplay muted loop playsinline>
					<source src="<?php bloginfo("stylesheet_directory"); ?>/assets/video/ISSA Portrait.mp4" />
				</video>
			</div>
			<div id="portrait_wrapper_3" class="portrait_wrapper" data-link="video_3">
				<?php /* <video id="portrait_2" class="portrait_video" muted loop playsinline>
					<source data-src="<?php bloginfo("stylesheet_directory"); ?>/assets/video/Bashar Portrait.mp4" />
				</video> */?>
			</div>
		</div>

		<!-- FULL SCREEN VIDEOS -->

		<?php 
		$video_query = new WP_Query( array("name"=>"videos") );
		if ( $video_query->have_posts() ) :
			while ( $video_query->have_posts() ) : $video_query->the_post(); ?>

				<div id="videos">
					
					<?php if ( get_field("video_1") ) : ?>
						<div>
							<iframe id="video_1" class="video" 
								src="<?php the_field("video_1"); ?>" width="1280" height="720">	
							</iframe>
						</div>
					<?php endif; ?>

					<?php if ( get_field("video_1") ) : ?>
						<div>
							<iframe id="video_2" class="video"  
								src="<?php the_field("video_2"); ?>" width="1280" height="720">	
							</iframe>
						</div>
					<?php endif; ?>
	
					<?php if ( get_field("video_3") ) : ?>
						<div>
							<iframe id="video_3" class="video"  
								src="<?php the_field("video_3"); ?>" width="1280" height="720">	
							</iframe>
						</div>
					<?php endif; ?>

				</div>

			<?php endwhile;
		endif; ?>

		<div id="back_button">
			<a href="">
				<img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/back_button.svg" />Back
			</a>
		</div>

	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Untitled";
		$artist = "Stephen Jeter";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="https://player.vimeo.com/api/player.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>