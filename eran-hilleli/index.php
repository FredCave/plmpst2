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

	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "Untitled";
		$artist = "Eran Hilleli";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>

<?php get_footer(); ?>