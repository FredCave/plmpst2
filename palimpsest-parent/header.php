<!DOCTYPE html>
<html <?php language_attributes(); ?> style="margin-top: 0px !important">

<head>
	<?php 
	$desc = "Come experience the infinite narratives that comprise Jerusalem — the realistic, the exalted and the virtual as one. Part of Mekudeshet 2017.";
	?>
	<title><?php bloginfo('title'); ?></title>
    <meta name="description" content="<?php echo $desc; ?>">
	<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta property="og:url" content="<?php bloginfo('url'); ?>" />
    <meta property="og:type" content="Website" />
    <meta property="og:title" content="Jerusalem Palimpsest Online Exhibition" />
    <meta property="og:description" content="<?php echo $desc; ?>" />
    <meta property="og:image" content="<?php bloginfo('stylesheet_directory'); ?>/assets/img/jerusalem_palimpsest_share_image.jpg" />

    <!-- TWITTER -->
    <meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="<?php bloginfo('url'); ?>">
	<meta name="twitter:description" content="<?php echo $desc; ?>">
	<meta name="twitter:title" content="Jerusalem Palimpsest Online Exhibition">
	<meta name="twitter:image" content="<?php bloginfo('stylesheet_directory'); ?>/assets/img/jerusalem_palimpsest_share_image.jpg">

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
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-104912230-1', 'auto');
		ga('send', 'pageview');
	</script>

</head>

<body>