<?php get_header(); ?>

	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="5" data-bg="<?php echo $bg_var; ?>">

		<?php // GET IMAGES
		$image_query = new WP_Query( array("name"=>"content") );
		if ( have_rows("images") ) :
			echo "<ul>";
			while ( have_rows("images") ) : the_row(); 
				$image = get_sub_field("image"); 
				$ratio = $image["width"] / $image["height"];
				?>

				<li class="scroll_image" 
					data-ratio="<?php echo $ratio; ?>" 
					data-thm="<?php echo $image['sizes']['thumbnail']; ?>"  
					data-med="<?php echo $image['sizes']['medium']; ?>" 
					data-mlg="<?php echo $image['sizes']['medium_large']; ?>" 
					data-lrg="<?php echo $image['sizes']['large']; ?>" 
					data-xlg="<?php echo $image['sizes']['extralarge']; ?>" 
					data-ulg="<?php echo $image['sizes']['ultralarge']; ?>" 
					style=""
					>
				</li>
			
			<?php 
			endwhile;
			echo "</ul>";
		endif; ?>

		<!-- SCROLL TO START -->
		<div id="scroll_to_start">
			Scroll to Start
		</div>

	</div>

	<div id="work_nav">
		
		<div id="lang_buttons" class="button_right">
			<div id="fullscreen">
				<a href="">
					<img class="enter_fullscreen" src="<?php bloginfo('template_url'); ?>/assets/img/icon_fullscreen.svg" />
					<img class="exit_fullscreen" src="<?php bloginfo('template_url'); ?>/assets/img/icon_fullscreen_exit.svg" />
				</a>
			</div>
		</div>

	</div>

	<div id="mobile_background_video">
		<video muted autoplay playsinline loop>
			<source data-src="<?php bloginfo('stylesheet_directory'); ?>/assets/media/background_video.mp4" />
		</video>
	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Yonderer";
		$artist = "Eran Hilleli";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>