<?php get_header(); ?>

	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

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

		// 3D OBJECTS ?>

		<ul id="objects">
			<li class="row">
				<div id="object_1" class="object"></div>
				<div id="object_2" class="object"></div>
			</li>
			<li class="row">
				<div id="object_1" class="object"></div>
				<div id="object_2" class="object"></div>
			</li>
			<li class="row">
				<div id="object_1" class="object"></div>
				<div id="object_2" class="object"></div>
			</li>
			<li class="row">
				<div id="object_1" class="object"></div>
				<div id="object_2" class="object"></div>
			</li>
			<li class="row">
				<div id="object_1" class="object"></div>
				<div id="object_2" class="object"></div>
			</li>			
		</ul>

		<div id="object">

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

<!-- 	-->
<!-- 	<script src="js/loaders/STLLoader.js"></script> -->
<!-- 	<script src="js/Detector.js"></script> -->
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/three.min.js"></script> 
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>