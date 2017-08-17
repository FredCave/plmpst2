<!DOCTYPE html>
<html <?php language_attributes(); ?> style="margin-top: 0px !important">

<head>
	<title><?php bloginfo('title'); ?></title>
    <meta name="description" content="<?php bloginfo('description'); ?>">
	<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta property="og:url" content="<?php bloginfo('url'); ?>" />
    <meta property="og:type" content="Website" />
    <meta property="og:title" content="Jerusalem Palimpsest Online Exhibition" />
    <meta property="og:description" content="Come experience the infinite narratives that comprise Jerusalem — the realistic, the exalted and the virtual as one. Part of Mekudeshet 2017." />
    <meta property="og:image" content="<?php if ( function_exists('get_og_image')){ get_og_image(); } ?>" />

    <!-- TWITTER -->
    <meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="<?php bloginfo('url'); ?>">
	<meta name="twitter:description" content="Come experience the infinite narratives that comprise Jerusalem — the realistic, the exalted and the virtual as one. Part of Mekudeshet 2017.">
	<meta name="twitter:title" content="Jerusalem Palimpsest Online Exhibition">
	<meta name="twitter:image" content="<?php if ( function_exists('get_og_image')){ get_og_image(); } ?>">

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_directory') ?>/style.css">
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_directory') ?>/style.min.css">
	<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url') ?>/info.min.css">
	
	<link rel="icon" type="image/png" href="<?php bloginfo('url') ?>/favicon_96.png" sizes="96x96">

	<script>
		// FIX IE CONSOLE ERRORS
		if (!window.console) console = {log: function() {}}; 
		// SET ROOT
		var MAIN_ROOT = '<?= network_site_url(); ?>';
		var ROOT = '<?= get_bloginfo('url'); ?>';
		var TEMPLATE = '<?= get_bloginfo('stylesheet_directory'); ?>';
	</script>

	<?php wp_head(); ?>

	<script>
		// ANALYTICS
		
		// FACEBOOK

	</script>

</head>

<body>