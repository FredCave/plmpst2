<?php

// ADD CUSTOM IMAGE SIZES
add_theme_support( 'post-thumbnails' );
add_image_size( 'extralarge', 1400, 1400 );
add_image_size( 'ultralarge', 2000, 2000 );

// IMAGE OBJECT
function image_object ( $image ) {

    if( !empty($image) ): 
        $width = $image['sizes'][ 'thumbnail-width' ];
        $height = $image['sizes'][ 'thumbnail-height' ];
        $thumb = $image['sizes'][ "thumbnail" ]; // 300
        $medium = $image['sizes'][ "medium" ]; // 600
        $mediumlarge = $image['sizes'][ "medium-large" ]; // ??
        $large = $image['sizes'][ "large" ]; // 900
        $extralarge = $image['sizes'][ "extralarge" ]; // 1400
        $ultralarge = $image['sizes'][ "ultralarge" ]; // 2000

        echo "<div class='postcard_image' 
                data-ratio='" . $width / $height . "' 
                data-thm='" . $thumb . "' 
                data-med='" . $medium . "' 
                data-mdl='" . $mediumlarge . "' 
                data-lrg='" . $large . "' 
                data-xlg='" . $extralarge . "' 
                data-ulg='" . $ultralarge . "' 
                style='' ></div>";

    endif;

}

