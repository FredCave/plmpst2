<?php get_header(); ?>

	<?php 	
	// CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
	$bg_var = get_query_var('background'); 
	?>

	<div id="wrapper" data-id="1" data-bg="<?php echo $bg_var; ?>">

		<!-- AUDIO -->
		<?php 
		$content_query = new WP_Query( array ("p" => 5) );
		if ( $content_query->have_posts() ) :
			while ( $content_query->have_posts() ) : $content_query->the_post();

				$main_audio = get_field("main_audio");
				if ( $main_audio ) { ?>
					<audio id="main_audio_1" controls>
						<source src="<?php echo $main_audio["url"]; ?>" type="audio/mpeg">
					</audio>
					<audio id="main_audio_2" controls>
						<source src="<?php echo $main_audio["url"]; ?>" type="audio/mpeg">
					</audio>
				<?php }

				$voiceover_audio = get_field("voiceover_audio");
				if ( $voiceover_audio ) { ?>
					<audio id="voiceover_audio" controls>
						<source src="<?php echo $voiceover_audio["url"]; ?>" type="audio/mpeg">
					</audio>
				<?php } 

				// VIDEOS
				$videos = get_field("videos");
					// SHUFFLE
				shuffle ( $videos );

				// SEND ONES WITH AUDIO TO BACK IN FIRST FIVE
				$send_to_back = array();
				$i = 2; ?>
				<div id="video_sources">
					<!-- INITIAL VIDEO -->
					<div class="video">
						<iframe id="video-1" src="<?php the_field("initial_video"); ?>" width="640" height="360"></iframe>
					</div>
				<?php
				foreach ( $videos as $video ) {
					if ( $i < 5 && $video["audio"] ) {
						$send_to_back[] = $video;
					} else { 
						?>
						<div class="video <?php if ( $video["audio"] ) { echo "audio"; } ?>">
							<iframe id="video-<?php echo $i; ?>" 
								src="<?php echo $video['vimeo_url']; ?>" width="640" height="360">	
							</iframe>
						</div>
					<?php 
					$i++;
					}	
				}

				// ECHO VIDEOS SENT TO BACK
				foreach ( $send_to_back as $video ) { ?>
					<div class="video audio">
						<iframe id="video-<?php echo $i; ?>" 
							src="<?php echo $video['vimeo_url']; ?>" width="640" height="360">	
						</iframe>
					</div>
					<?php 
					$i++;
				}			

				?>
				</div>

				<?php 
				
			endwhile;
		endif; 
		?>

		<!-- CONTROLS -->
		<div id="hover_area_left" class="hover_area"></div>
		<div id="hover_area_right" class="hover_area"></div>

		<div id="arrows">
			<div id="arrow_left" class="arrow"><img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/nav_arrow.png" /></div>	
			<div id="arrow_right" class="arrow"><img src="<?php bloginfo('stylesheet_directory'); ?>/assets/img/nav_arrow.png" /></div>
		</div>

		<div id="counter"></div>

	</div>

	<?php 
	// IF NOT BACKGROUND
	if ( !$bg_var ) {
		$title = "A Fire Wil Burn";
		$artist = "Tohar Lev Jacobson";
		include_once( get_template_directory() . '/includes/artist_info.php' );
		include_once( get_template_directory() . '/includes/main_info.php' );
	}
	?>

	<script src="https://player.vimeo.com/api/player.js"></script>
	<script src="<?php bloginfo('stylesheet_directory'); ?>/js/scripts.min.js"></script>
	
<?php get_footer(); ?>