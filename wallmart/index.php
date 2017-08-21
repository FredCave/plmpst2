<?php get_header(); ?>

	<div id="wrapper" data-id="6" data-bg="<?php echo $bg_var; ?>">

		<?php 
		// POSTCARDS
		if ( have_rows("postcards") ) : ?>
			<ul id="postcards">
				<?php while ( have_rows("postcards")  ) : the_row(); ?>
					<li>
						<?php 
						$image = get_sub_field("image");
						image_object( $image ); 
						?>
					</li>
				<?php endwhile; ?>
			</ul>
		<?php 
		endif; 
		?>
		
		<div id="title_wrapper" data-600="filter: drop-shadow( 0px -80px 12px rgba( 0, 0, 0, 0.7 ) )" data-10="filter: drop-shadow( 0px 80px 12px rgba( 0, 0, 0, 0.7 ) )">
			<div class="title" style="background-image:url('<?php bloginfo('stylesheet_directory'); ?>/assets/img/logo.svg')"></div>
	 	</div>

		<canvas id="canvas"></canvas>

		<!-- OBJECTS APPENDED HERE -->
		<div id="objects_wrapper">
		</div>

	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Wallmart";
		$artist = "Firas A. Sirriyeh";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/three.min.js"></script> 
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>