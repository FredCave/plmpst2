<?php get_header(); ?>

    <?php   
    // CHECK IF PAGE WILL BE SHOWN IN BACKGROUND OF ANOTHER PAGE
    $bg_var = get_query_var('background'); 
    ?>

    <div id="wrapper" data-id="3" data-bg="<?php echo $bg_var; ?>">

        <div id="space"></div>

        <?php /* 
        <div id="buttons_wrapper">
            <div id="buttons_toggle">Hide Controls</div>
            <ul id="buttons"></ul>
        </div> 

        <div id="tooltip"></div>
        */ ?>

        <audio id="main_audio">
    		<source src="<?php bloginfo('stylesheet_directory'); ?>/assets/audio/EVEN_MAIN_LQ2.mp3" type="audio/mpeg">
        </audio>

        <audio id="loop_audio_1">
    		<source src="<?php bloginfo('stylesheet_directory'); ?>/assets/audio/EVEN_ENDLOOP_LQ.mp3" type="audio/mpeg">
        </audio>

        <audio id="loop_audio_2">
    		<source src="<?php bloginfo('stylesheet_directory'); ?>/assets/audio/EVEN_ENDLOOP_LQ.mp3" type="audio/mpeg">
        </audio>

    </div>

    <div id="mobile_wrapper">
        <div id="button_wrapper">
            <a href="">
                <div id="button"></div>
            </a>
            <div id="mobile_text">Press to start</div>
        </div>
    </div>

    <?php 
    // IF NOT BACKGROUND
    if ( !$bg_var ) {
        $title = "Rock";
        $artist = "Dor Zlekha Levy";
        include_once( get_template_directory() . '/includes/artist_info.php' );
        include_once( get_template_directory() . '/includes/main_info.php' );
    }
    ?>

    <script src="<?php bloginfo( 'stylesheet_directory' ); ?>/assets/lib/Three.js"></script>
    <script src="<?php bloginfo( 'stylesheet_directory' ); ?>/assets/lib/Detector.js"></script>
    <script src="<?php bloginfo( 'stylesheet_directory' ); ?>/assets/lib/OrbitControls.js"></script>
    <script src="<?php bloginfo( 'stylesheet_directory' ); ?>/assets/lib/THREEx.WindowResize.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>
    <script src="<?php bloginfo( 'stylesheet_directory' ); ?>/js/scripts.min.js"></script> 

<?php get_footer(); ?>