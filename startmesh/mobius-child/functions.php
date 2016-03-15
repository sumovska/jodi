<?php

#-----------------------------------------------------------------#
# Load the stylesheet from Mobius parent theme 
#-----------------------------------------------------------------#

function theme_name_parent_styles() {
	$parent = get_template();
	$parent = wp_get_theme($parent);
	wp_enqueue_style('theme-name-parent-style', get_template_directory_uri() . '/style.css', array(), $parent['Version'], 'all');
}
add_action('wp_enqueue_scripts', 'theme_name_parent_styles');

?>