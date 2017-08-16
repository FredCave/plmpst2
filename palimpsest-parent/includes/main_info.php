<div id="mobile_black_background"></div>

<div id="hover_area"></div>

<div id="info_wrapper">

	<div id="info_left">
		<a id="artist_info_show" href="">
			<p>
				<?php echo $title; ?><br>
				<?php echo $artist; ?>
			</p>
		</a>
		<a id="artist_info_hide" href="">
			<img src="<?php bloginfo('template_url'); ?>/assets/img/main_info_close.svg" />
		</a>
	</div>

	<div id="info_right">
		<p>
			<a id="main_info_show" href="">Jerusalem Palimpsest</a>
			<a id="main_info_hide" href=""><img src="<?php bloginfo('template_url'); ?>/assets/img/main_info_close.svg" /></a>
		</p>
	</div>

	<div id="info">
		
		<div id="white_underlayer">
			<div id="info_bg_wrapper"></div>
			<div id="info_bg_white_wrapper"></div>
		</div>

		<div id="info_text_wrapper">

			<!-- TITLE -->
			<div id="info_title" class="large_text">Jerusalem Palimpsest</div>

			<!-- META DATA -->
			<div id="info_meta">
				<p class="meta_row large_text">
					<span class="loaded">Jerusalem </span>
					<span class="meta_date"></span>, 
					<span class="meta_time"></span>
				</p>
				<p class="meta_row icons_row large_text">
					<span class="meta_temp"></span>
					<span class="meta_sunrise"><img src="<?php bloginfo('template_url'); ?>/assets/img/icon_sunrise.svg" /></span> 
					<span class="meta_sunset"><img src="<?php bloginfo('template_url'); ?>/assets/img/icon_sunset.svg" /></span>
					<span class="meta_moonrise"><img src="<?php bloginfo('template_url'); ?>/assets/img/icon_moonrise.svg" /></span> 
					<span class="meta_moonset"><img src="<?php bloginfo('template_url'); ?>/assets/img/icon_moonset.svg" /></span> 
				</p>
			</div>

			<div id="info_text_inner_wrapper">
				<div id="info_definition" class="large_text"></div>
				<div id="info_mobile_enter">
					<img src="<?php bloginfo('template_url'); ?>/assets/img/icon_rotate.svg" />
					<p>Rotate to enter</p>
				</div>
				<div id="info_main_text"  class="large_text"></div>
				<div id="info_works_toggle" class="info_toggle">Works Exhibited</div>
				<div id="info_works"></div>
				<div id="info_colophon_toggle" class="info_toggle">Colophon</div>
				<div id="info_colophon"></div>
				<div id="info_mekudeshet_toggle" class="info_toggle">Mekudeshet 2017</div>
				<div id="info_mekudeshet_text"></div>
				<div id="info_mekudeshet_share"></div>
			</div>

		</div>
	</div>

</div>


