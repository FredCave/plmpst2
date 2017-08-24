<?php get_header(); ?>

	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="9" data-bg="<?php echo $bg_var; ?>">
		
		<!-- INTRO PORTRAITS -->

		<div id="intro_portraits">
			<div id="portrait_wrapper_1" class="portrait_wrapper" data-link="video_1">
				<video id="portrait_1" class="portrait_video" autoplay muted loop playsinline>
					<source src="<?php bloginfo("stylesheet_directory"); ?>/assets/video/bashar_small.mp4" />
				</video> 
			</div>

			<div id="portrait_wrapper_2" class="portrait_wrapper" data-link="video_2">
				<video id="portrait_2" class="portrait_video" autoplay muted loop playsinline>
					<source src="<?php bloginfo("stylesheet_directory"); ?>/assets/video/waseem_small.mp4" />
				</video>
			</div>
			<div id="portrait_wrapper_3" class="portrait_wrapper" data-link="video_3">
				<video id="portrait_3" class="portrait_video" autoplay muted loop playsinline>
					<source src="<?php bloginfo("stylesheet_directory"); ?>/assets/video/issa_small.mp4" />
				</video>
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
								data-src="<?php the_field("video_1"); ?>" width="1280" height="720">	
							</iframe>
						</div>
					<?php endif; ?>

					<?php if ( get_field("video_1") ) : ?>
						<div>
							<iframe id="video_2" class="video"  
								data-src="<?php the_field("video_2"); ?>" width="1280" height="720">	
							</iframe>
						</div>
					<?php endif; ?>
	
					<?php if ( get_field("video_3") ) : ?>
						<div>
							<iframe id="video_3" class="video"  
								data-src="<?php the_field("video_3"); ?>" width="1280" height="720">	
							</iframe>
						</div>
					<?php endif; ?>

				</div>

			<?php endwhile;
		endif; ?>

		<div id="work_nav">
		
			<div class="button_right">
				<div id="back_button" class="back_button">
					<a href="">
						<img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/back_button.svg" /><span>Back</span>
					</a>
				</div>
				<div id="fullscreen">
					<a href="">
						<img class="enter_fullscreen" src="<?php bloginfo('template_url'); ?>/assets/img/icon_fullscreen.svg" />
						<img class="exit_fullscreen" src="<?php bloginfo('template_url'); ?>/assets/img/icon_fullscreen_exit.svg" />
					</a>
				</div>
			</div>	

		</div>

	</div>




	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Maqdeseyeen";
		$artist = "Steve Jeter";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="https://player.vimeo.com/api/player.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>