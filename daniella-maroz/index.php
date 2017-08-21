<?php get_header(); ?>
	
	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="4" data-bg="<?php echo $bg_var; ?>">

	<?php 
		$content_query = new WP_Query( array ("name" => "content") );
		if ( $content_query->have_posts() ) :
			while ( $content_query->have_posts() ) : $content_query->the_post();

				// VIDEO
				$video = get_field("video"); ?>

				<div id="video_wrapper">
					<iframe id="video" class="video" data-src="<?php the_field("video"); ?>" width="1280" height="720"></iframe>
				</div>

				<div id="work_nav">
					
					<div id="restart_button" class="button_left">
						<a href=""><img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/restart_button.svg" /></a>
						<span id="timer"></span>
					</div>

					<?php /*
					<div id="back_button" class="button_left">
						<a href=""><img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/back_button.svg" /> Back</a>
					</div>

					<div id="lang_buttons" class="button_right">
						<div id="lang_he"><a href="">He</a></div>
						<div id="lang_en"><a href="">En</a></div>
					</div> */ ?>

				</div>

				<?php 
			endwhile;
		endif; 
		?>		

	</div>

	<?php
	// IF NOT BACKGROUND
	if ( !$bg_var ) { 
		$title = "Untitled";
		$artist = "Daniella Maroz";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="https://player.vimeo.com/api/player.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>