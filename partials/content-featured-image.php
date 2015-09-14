<?php 
/**
 * @package CriticaLink
 */
global $post;
$thumb_key    = 'layout-' . ttfmake_get_view() . '-featured-images';
$thumb_option = ttfmake_sanitize_choice( get_theme_mod( $thumb_key, ttfmake_get_default( $thumb_key ) ), $thumb_key );
$thumb_id = get_post_thumbnail_id();


if ( 'post-header' === $thumb_option && $thumb_id ) : 
	$thumb_url = wp_get_attachment_image_src( $thumb_id,'banner', true ); ?>
	<div id='site-banner' style='background-image:url(<?php echo $thumb_url[0]; ?>);'></div>
<?php 
endif;

