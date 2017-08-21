<?php get_header(); ?>
	
	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="7" data-bg="<?php echo $bg_var; ?>">

	<?php 
		$content_query = new WP_Query( array ("name" => "content") );
		if ( $content_query->have_posts() ) :
			while ( $content_query->have_posts() ) : $content_query->the_post();

				// VIDEO
				$video = get_field("video"); ?>

				<div id="video_wrapper">
					<iframe id="video_he" class="video" data-src="<?php the_field("video_he"); ?>" width="1280" height="720"></iframe>
					<iframe id="video_en" class="video" data-src="<?php the_field("video_en"); ?>" width="1280" height="720"></iframe>
				</div>

				<?php /* <div id="mobile_wrapper">
					<video id="mobile_he" controls playinline>
						<source data-src="https://player.vimeo.com/external/228552941.m3u8?s=1863d84f23244f9cc1a8dd1508f65f9927495092" />
					</video>
				</div> */ ?>

				<div id="work_nav">
					
					<div id="restart_button" class="button_left">
						<a href=""><img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/restart_button.svg" /></a>
						<span id="timer"></span>
					</div>

					<div id="lang_buttons" class="button_right">
						<div id="lang_he" class="lang selected"><a href="" data-lang="he">He</a></div>
						<div id="lang_en" class="lang"><a href="" data-lang="en">En</a></div>
					</div>

				</div>

				<?php 
			endwhile;
		endif; 
		?>		

	</div>

	<?php
	// IF NOT BACKGROUND
	if ( !$bg_var ) { 
		$title = "Raul Abastado #345";
		$artist = "Nitai schendar and Itamar Weiss";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="https://player.vimeo.com/api/player.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>