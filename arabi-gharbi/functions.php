<?php

// ADD CUSTOM IMAGE SIZES
add_theme_support( 'post-thumbnails' );
add_image_size( 'extralarge', 1200, 1200 );
add_image_size( 'ultralarge', 1600, 1600 );

// GET OG IMAGE
function get_og_image () {

	echo get_bloginfo("stylesheet_directory") . "/assets/img/og_image.mp4";

}
