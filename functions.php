<?php
/**
 * @package Make
 */

/**
 * The current version of the theme.
 */
define( 'TTFMAKE_CHILD_VERSION', '1.1.0' );

/**
 * kill Make builder since we're using Beaver Builder
 */
function ttfmake_get_builder_base() {
	return false;
}


/**
 * Theme Setup
 */
add_action( 'after_setup_theme', 'criticalink_setup' );
function criticalink_setup(){
	// remove Make pro upgrade notices
	remove_action( 'edit_form_after_title', 'ttfmake_plus_quick_start' );
	remove_action( 'add_meta_boxes', 'ttfmake_add_plus_metabox' );
	// remove Make edit scripts
	remove_action( 'admin_enqueue_scripts', 'ttfmake_edit_page_script' );


	add_filter( 'make_show_footer_credit', '__return_false' );

	// load childtheme text domain
	load_child_theme_textdomain( 'criticalink', get_stylesheet_directory() . '/languages' );

	// add post-formats 
	add_theme_support( 'post-formats', array( 'link', 'video', 'photo' ) );

	// support common tinymce styles
	add_theme_support( 'common-tinymce-styles' );

	// add custom image
	add_image_size( 'banner', 1080, 9999 );

}


/**
 * Enqueue styles and scripts.
 *
 * @since  1.0.0.
 *
 * @return void
 */
function criticalink_scripts() {

	// fastclick for fixing the 300ms delay on touch
	wp_enqueue_script( 'fastclick', get_stylesheet_directory_uri() . '/js/vendors/jquery.fastclick.min.js', array( 'jquery' ), '1.0.0', true );

	// sidr for off-canvas menu
	wp_enqueue_script( 'sidr', get_stylesheet_directory_uri() . '/js/vendors/jquery.sidr.js', array( 'jquery' ), '1.2.1', true );


	if ( SCRIPT_DEBUG || WP_DEBUG ){

		// Concatonated Scripts
		wp_register_script( 'ttfmake-global', get_stylesheet_directory_uri() . '/js/development.js', array( 'jquery' ), TTFMAKE_CHILD_VERSION, true );

		// Main Style
		wp_register_style( 'ttfmake-main-style',  get_stylesheet_directory_uri() . '/style.css' );

	} else {
		// Concatonated Scripts
		wp_register_script( 'ttfmake-global', get_stylesheet_directory_uri() . '/js/production.min.js', array( 'jquery' ), TTFMAKE_CHILD_VERSION, true );

		// Main Style
		wp_register_style( 'ttfmake-main-style',  get_stylesheet_directory_uri() . '/style.min.css' );
	}

}
add_action( 'wp_enqueue_scripts', 'criticalink_scripts', 5 );

/**
 * Output the site region (header or footer) markup if the current view calls for it.
 * ADD some hooks that I can use before and after
 *
 * @since  1.0.0.
 *
 * @param  string    $region    Region to maybe show.
 * @return void
 */
function ttfmake_maybe_show_site_region( $region ) {
	if ( ! in_array( $region, array( 'header', 'footer' ) ) ) {
		return;
	}

	// Get the view
	$view = ttfmake_get_view();

	// Get the relevant option
	$hide_region = (bool) get_theme_mod( 'layout-' . $view . '-hide-' . $region, ttfmake_get_default( 'layout-' . $view . '-hide-' . $region ) );

	do_action( 'ttfmake_before_' . $region, $hide_region );

	if ( true !== $hide_region ) {
		get_template_part(
			'partials/' . $region . '-layout',
			get_theme_mod( $region . '-layout', ttfmake_get_default( $region . '-layout' ) )
		);
	} 

	do_action( 'ttfmake_after_' . $region, $hide_region );
}

// add featured image as banner above content
add_action( 'ttfmake_after_header', 'criticalink_featured_banner' );
function criticalink_featured_banner(){
	if( is_singular() ){
		get_template_part( 'partials/content-featured-image' );
	}
}


// add post class if has featured image
add_filter( 'post_class', 'criticalink_post_class' );
function criticalink_post_class( $class ){
	if( has_post_thumbnail() ){
		$class[] = 'has-post-thumbnail';
	}
	return $class;
}


// add ID to menu container
add_filter( 'wp_nav_menu_args', 'criticalink_modify_nav_menu_args' );
function criticalink_modify_nav_menu_args( $args ){
	if( 'primary' == $args['theme_location'] ){
		$args['container_id'] = 'menu-header-container';
	}

	return $args;
}

// modify the loop templates for custom post forms
add_filter( 'make_template_content_archive', 'criticalink_template_content_archive', 10, 2 );
function criticalink_template_content_archive( $template, $post ){
	$format = get_post_format( $post->ID );
	if( in_array( $format, array( 'link', 'video', 'photo' ) ) ){
		$template = 'archive-' . $format;
	}
	return $template;
}


/* **********************************************
   Features by WooThemes
 ************************************************/

add_filter( 'woothemes_features_item_template', 'cl_features_item_template', 10, 2 );
function cl_features_item_template($tpl, $args){
	if( isset( $args['category'] ) && intval( $args['category'] ) == 48 ){
		$tpl = '<div class="%%CLASS%%">%%IMAGE%%</div>';
	} 

	return $tpl;
}

add_filter( 'woothemes_features_template', 'cl_features_template', 10, 2 );
function cl_features_template($html, $post){
	$html = str_replace( 'href=', 'target="_blank" href=', $html );
	return $html;
}

/* **********************************************
   Give Donations
 ************************************************/




/* **********************************************
   Documentate
 ************************************************/

function documentate_output_content_wrapper(){?>
<main id="site-main" class="site-main" role="main">
<?php }

function documentate_output_content_wrapper_end(){?>
</main>
<?php }



add_action( 'woocommerce_thankyou', 'so_32512552_payment_complete' );
function so_32512552_payment_complete( $order_id ){
    $order = wc_get_order( $order_id );

    foreach ( $order->get_items() as $item ) {

        if ( $item['product_id'] > 0 ) {
		   $physical = array_shift( wc_get_product_terms( $item['product_id'], 'pa_physical_inventory', array( 'fields' => 'names' ) ) );
		   $newphysical = intval( $physical ) - intval( $item['qty'] );

		   wp_set_object_terms( $item['product_id'], (string) $newphysical, 'pa_physical_inventory' );

		   update_post_meta( $item['product_id'], '_physical_inventory', $newphysical );
        }
    }
}