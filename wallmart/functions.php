<?php

// ADD CUSTOM IMAGE SIZES
add_theme_support( 'post-thumbnails' );
add_image_size( 'extralarge', 1200, 1200 );
add_image_size( 'ultralarge', 1600, 1600 );

// IMAGE OBJECT
function image_object ( $image ) {

    if( !empty($image) ): 
        $width = $image['sizes'][ 'thumbnail-width' ];
        $height = $image['sizes'][ 'thumbnail-height' ];
        $thumb = $image['sizes'][ "thumbnail" ]; // 400
        $medium = $image['sizes'][ "medium" ]; // 800
        $mediumlarge = $image['sizes'][ "medium-large" ]; // 1200
        $large = $image['sizes'][ "large" ]; // 1600
        $extralarge = $image['sizes'][ "extralarge" ]; // 2400
        $ultralarge = $image['sizes'][ "ultralarge" ]; // 3000

        echo "<div class='postcard_image' 
                data-thm='" . $thumb . "' 
                data-med='" . $medium . "' 
                data-mdl='" . $mediumlarge . "' 
                data-lrg='" . $large . "' 
                data-xlg='" . $extralarge . "' 
                data-ulg='" . $ultralarge . "' 
                style='background-image:url(" . $extralarge . ")' ></div>";

    endif;

}

