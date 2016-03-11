<?php
/*
	Template Name: Fabrice
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
<a href="http://mywicker.com.au/test/wp-content/uploads/2012/03/cream.jpg" rel="lightbox"><img class="size-full wp-image-349 " title="Cream Wicker Fabric" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/cream.jpg" width="266" height="209" /></a> vCream Wicker Fabric
</li>
<li>
<a href="http://mywicker.com.au/test/wp-content/uploads/2012/03/2.jpg" rel="lightbox"><img class="size-full wp-image-351 " title="Black and white stripes wicker fabric" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/2.jpg" width="388" height="218" /></a><span class="img-title"> Black and white stripes wicker fabric</span>
</li>
<li>
<a href="http://mywicker.com.au/test/wp-content/test/uploads/2012/03/mustard-brown-640x245.jpg" rel="lightbox"><img class="size-medium wp-image-1351 " title="mustard brown wicker fabric" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/mustard-brown-640x245-300x114.jpg" width="300" height="114" /></a><span class="img-title"> mustard brown wicker fabric</span>
</li>
<li>
<a href="http://mywicker.com.au/test/wp-content/uploads/2012/03/dark-grey1.jpg" rel="lightbox"><img class="size-medium wp-image-1334 " title="charcoal grey wicker fabric" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/dark-grey1-300x300.jpg" width="300" height="300" /></a> <span class="img-title">charcoal grey wicker fabric</span>
</li>
<li>
<a href="http://mywicker.com.au/test/wp-content/uploads/2012/03/A148171.jpg" rel="lightbox"><img class="size-full wp-image-1342 " title="Grey Brown Wicker Fabric" alt="" src="http://mywicker.com.au/test/wp-content/uploads/2012/03/A148171.jpg" width="237" height="200" /></a> <span class="img-title">Grey Brown Wicker Fabric</span>
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