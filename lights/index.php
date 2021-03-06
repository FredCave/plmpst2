<?php get_header(); ?>

	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="2" data-bg="<?php echo $bg_var; ?>">

		<?php 
		$lights_query = new WP_Query( array ("name" => "content") );
		if ( $lights_query->have_posts() ) :
			while ( $lights_query->have_posts() ) : $lights_query->the_post();
				
				if ( get_field("dark_image") ) {
					$image = get_field("dark_image");
					image_object($image, "dark_image");
				}

				if ( get_field("west_image") ) {
					$image = get_field("west_image");
					image_object($image, "west_image");
				} 

				if ( get_field("east_image") ) {
					$image = get_field("east_image");				
					image_object($image, "east_image");
				} 

				if ( get_field("audio_file") ) {
					$image = get_field("audio_file"); ?>		
					<audio id="audio_1">
						<source src="<?php echo $image["url"]; ?>" />
					</audio>
					<audio id="audio_2">
						<source src="<?php echo $image["url"]; ?>" />
					</audio>
				<?php 
				}

			endwhile;
		endif; 
		?>

		<div id="mobile_wrapper">
			<div id="button_wrapper">
				<div id="button"></div>
				<div id="mobile_text">Press to start</div>
			</div>
		</div>

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

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Atmospheric Electricity";
		$artist = "Ada Rimon, Ofeq Shemer";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>