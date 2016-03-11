<?php
/*
	Template Name: Colour
*/
?>
<?php get_header(); ?>

<?php

	// GET GLOBALS
	global $content_and_sidebar;

	$meta_fields = get_post_meta($post->ID, 'zn_meta_elements', true);
	$meta_fields = maybe_unserialize( $meta_fields );
/*--------------------------------------------------------------------------------------------------
	ACTION BOX AREA
--------------------------------------------------------------------------------------------------*/

	if ( isset ( $meta_fields['action_box_area'] ) && is_array ( $meta_fields['action_box_area'] ) ) {
		zn_get_template_from_area ('action_box_area',$post->ID,$meta_fields);
	}

/*--------------------------------------------------------------------------------------------------
	CONTENT AREA
--------------------------------------------------------------------------------------------------*/
	
	// Here will check if sidebar is enabled
	$content_css = 'span12'; 
	$sidebar_css = ''; 
	$has_sidebar = false;
	$mainbody_css = '';
		
	// WE CHECK IF THIS IS NOT A PAGE FROM OUR THEME	
	if ( empty ( $meta_fields['page_layout'] ) || empty ( $meta_fields['sidebar_select'] ) ) {
		if ( $data['page_sidebar_position'] == 'left_sidebar' ) {
			$content_css = 'span9 zn_float_right zn_content';
			$sidebar_css = 'sidebar-left';
			$has_sidebar = true;
			$mainbody_css = 'zn_has_sidebar';
		}
		elseif ( $data['page_sidebar_position'] == 'right_sidebar' ) {
			$content_css = 'span9 zn_content';
			$sidebar_css = 'sidebar-right';
			$has_sidebar = true;
			$mainbody_css = 'zn_has_sidebar';
		}
	}	
	// WE CHECK IF WE HAVE LEFT SIDEBAR
	elseif ( $meta_fields['page_layout'] == 'left_sidebar' || ( $meta_fields['page_layout'] == 'default' && !empty ( $data['page_sidebar_position'] ) && $data['page_sidebar_position'] == 'left_sidebar' )   )
	{
		$content_css = 'span9 zn_float_right zn_content';
		$sidebar_css = 'sidebar-left';
		$has_sidebar = true;
		$mainbody_css = 'zn_has_sidebar';
	}
	// WE CHECK IF WE HAVE RIGHT SIDEBAR
	elseif ( $meta_fields['page_layout'] == 'right_sidebar' || ( $meta_fields['page_layout'] == 'default' && !empty ( $data['page_sidebar_position'] ) && $data['page_sidebar_position'] == 'right_sidebar' )  )
	{
		$content_css = 'span9 zn_content';
		$sidebar_css = 'sidebar-right ';
		$has_sidebar = true;
		$mainbody_css = 'zn_has_sidebar';
	}
	
	echo '<section id="content">';

	if ( $content_and_sidebar ) { 

		while (have_posts()) : the_post();
		
		$content = get_the_content();
		$content = apply_filters('the_content', $content);
		if ( !empty($content) || ( isset ( $meta_fields['page_title_show'] ) && $meta_fields['page_title_show'] == 'yes' ) ) {

			$row_margin = 'zn_content_no_margin';
		
			if ( get_the_content() || $has_sidebar ) {
				$row_margin = '';
			}
		
			echo '<div class="container">';
			
			echo '<div class="mainbody '.$mainbody_css.'">';
			
					echo '<div class="row '.$row_margin.'">';
					
						echo '<div class="'.$content_css.'">';
					
							// TITLE CHECK
							if ( isset ( $meta_fields['page_title_show'] ) && $meta_fields['page_title_show'] == 'yes' ) {
								echo '<h1 class="page-title">'.get_the_title().'</h1>';
							}
							
							// PAGE CONTENT
							//the_content();
							?>
                            
<ul>
<li>
<a href="http://mywicker.com.au/wp-content/uploads/2012/03/Two-Tone-Chocolate-Brown1.jpg" rel="lightbox"><img class="size-full wp-image-363 " title="Two Tone Chocolate Brown" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/Two-Tone-Chocolate-Brown1.jpg" width="500" height="345" /></a><span class="img-title"> Two Tone Chocolate Brown</span>
</li>
<li>
<a href="http://mywicker.com.au/wp-content/uploads/2012/03/black-0052.jpg" rel="lightbox"><img class="wp-image-366 " title="Licorice Black" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/black-0052.jpg" width="451" height="256" /></a><span class="img-title"> Licorice Black wicker</span>
</li>
<li>
<a href="http://mywicker.com.au/wp-content/uploads/2012/03/RT-07.jpg" rel="lightbox"><img class="size-medium wp-image-2669 " alt="Liqoricce black" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/RT-07-300x281.jpg" width="300" height="281" /></a><span class="img-title"> Close up of licorice black wicker</span>
</li>
<li>
<a href="http://mywicker.com.au/test/wp-content/uploads/2012/03/Charcoal-Hazelnut.jpg" rel="lightbox"><img class="size-full wp-image-368 " title="Charcoal Hazelnut" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/Charcoal-Hazelnut.jpg" width="600" height="450" /></a><span class="img-title"> Charcoal with a hint of Hazelnut</span>
</li>
<li>
<a href="http://mywicker.com.au/wp-content/uploads/2012/03/RT-15.jpg" rel="lightbox"><img class="size-medium wp-image-2670 " alt="Charcoal/Hazelnut wicker" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/RT-15-300x263.jpg" width="300" height="263" /></a><span class="img-title"> Close up of Charcoal/Hazelnut wicker</span>
</li>
</ul>
							<?php
							if ( !empty($data['zn_enable_page_comments']) && $data['zn_enable_page_comments'] == 'yes'  ) {
								?>
								<!-- DISQUS comments block -->
								<div class="disqusForm">
									<?php comments_template(); ?>
								</div>
								<div class="clear"></div>
								<!-- end DISQUS comments block -->
								<?php
							}

						echo '</div>';

						
						// START SIDEBAR OPTIONS
						// WE CHECK IF THIS IS NOT A PAGE FROM THE THEME
						if ( empty ( $meta_fields['page_layout'] ) || empty ( $meta_fields['sidebar_select'] ) ) {
							if ( $data['page_sidebar_position'] == 'left_sidebar' || $data['page_sidebar_position'] == 'right_sidebar' ) {
								echo '<div class="span3">';
									echo '<div id="sidebar" class="sidebar '.$sidebar_css.'">';
										if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar($data['page_sidebar']) ) : endif;
									echo '</div>';
								echo '</div>';
							}
						}
						// WE CHECK IF WE HAVE A SIDEBAR SET IN PAGE OPTIONS
						elseif ( ( ( $meta_fields['page_layout'] == 'left_sidebar' || $meta_fields['page_layout'] == 'right_sidebar' ) && $meta_fields['sidebar_select'] != 'default' ) || (  $meta_fields['page_layout'] == 'default' && $data['page_sidebar_position'] != 'no_sidebar' && $meta_fields['sidebar_select'] != 'default' ) ) 
						{ 
								
									echo '<div class="span3">';
										echo '<div id="sidebar" class="sidebar '. $sidebar_css.'">';
											if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar( $meta_fields['sidebar_select'] ) ) : endif;
										echo '</div>';
									echo '</div>';
						}
						// WE CHECK IF WE HAVE A SIDEBAR SET FROM THEME'S OPTIONS
						elseif ( $meta_fields['page_layout'] == 'default' && $data['page_sidebar_position'] != 'no_sidebar' && $meta_fields['sidebar_select'] == 'default' || ( ( $meta_fields['page_layout'] == 'left_sidebar' || $meta_fields['page_layout'] == 'right_sidebar' ) && $meta_fields['sidebar_select'] == 'default' ) ) {
							echo '<div class="span3">';
								echo '<div id="sidebar" class="sidebar '.$sidebar_css.'">';
									if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar($data['page_sidebar']) ) : endif;
								echo '</div>';
							echo '</div>';
						}
		
					
					echo '</div>';
			
				echo '</div>';
				
			echo '</div>';
			}
		endwhile;
	}
	
/*--------------------------------------------------------------------------------------------------
	START CONTENT AREA 
--------------------------------------------------------------------------------------------------*/
	if ( isset ( $meta_fields['content_main_area'] ) && is_array ( $meta_fields['content_main_area'] ) ) {
		echo '<div class="container">';
			zn_get_template_from_area ('content_main_area',$post->ID,$meta_fields);
		echo '</div>';
	}

/*--------------------------------------------------------------------------------------------------
	START GRAY AREA
--------------------------------------------------------------------------------------------------*/
				
	$cls = '';
	if ( !isset ( $meta_fields['content_bottom_area'] ) || !is_array ( $meta_fields['content_bottom_area'] ) ) {
		$cls = 'noMargin';
	}

	if ( isset ( $meta_fields['content_grey_area'] ) && is_array ( $meta_fields['content_grey_area'] ) ) {
	echo '<div class="gray-area '.$cls.'">';
		echo '<div class="container">';
		
			zn_get_template_from_area ('content_grey_area',$post->ID,$meta_fields);
		
		echo '</div>';
	echo '</div>';
	}
				

		
		
/*--------------------------------------------------------------------------------------------------
	START BOTTOM AREA
--------------------------------------------------------------------------------------------------*/
		

	if ( isset ( $meta_fields['content_bottom_area'] ) && is_array ( $meta_fields['content_bottom_area'] ) ) {
		echo '<div class="container">';
			zn_get_template_from_area ('content_bottom_area',$post->ID,$meta_fields);
		echo '</div>';
	}
			
		
		
	echo '</section><!-- end #content -->';
	
	
?>
				
<?php get_footer(); ?>