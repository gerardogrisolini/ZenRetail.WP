<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.zenretail.cloud:8181
 * @since             1.0.0
 * @package           ZenRetail
 *
 * @wordpress-plugin
 * Plugin Name:       ZenRetail
 * Plugin URI:        http://www.zenretail.cloud
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            Gerardo Grisolini
 * Author URI:        https://www.zenretail.cloud:8181
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       zenretail
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'PLUGIN_NAME_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-zenretail-activator.php
 */
function activate_webretail() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-zenretail-activator.php';
	Webretail_Activator::activate();

	flush_custom_rules();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-zenretail-deactivator.php
 */
function deactivate_webretail() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-zenretail-deactivator.php';
	Webretail_Deactivator::deactivate();
}

function flush_custom_rules() {
	$rules = $GLOBALS['wp_rewrite']->wp_rewrite_rules();
	//print_r($rules);
	global $wp_rewrite;
	$wp_rewrite->flush_rules();
}

// Took out the $wp_rewrite->rules replacement so the rewrite rules filter could handle this.
function create_rewrite_rules($rules) {
	global $wp_rewrite;
	$webretailRule = array('zenretail/(.+)' => 'index.php?pagename=zenretail&zenretail=' . $wp_rewrite->preg_index(1));
	$categoryRule = array('category/(.+)' => 'index.php?pagename=category&category=' . $wp_rewrite->preg_index(1));
	$brandRule = array('brand/(.+)' => 'index.php?pagename=brand&brand=' . $wp_rewrite->preg_index(1));
	$productRule = array('product/(.+)' => 'index.php?pagename=product&product=' . $wp_rewrite->preg_index(1));
	$newRules = $productRule + $categoryRule + $brandRule + $webretailRule + $rules;
	return $newRules;
}

function add_query_vars($qvars) {
	$qvars[] = 'zenretail';
	$qvars[] = 'category';
	$qvars[] = 'brand';
	$qvars[] = 'product';
	return $qvars;
}

function template_redirect_intercept() {
	global $wp_query;
	$selected = '<input id="selectedValue" type="hidden" value="***"/>';
	if ($wp_query->get('product')) {
		$selected = str_replace("***", $wp_query->get('product'), $selected);
	} else if ($wp_query->get('category')) {
		$selected = str_replace("***", $wp_query->get('category'), $selected);
	} else if ($wp_query->get('brand')) {
		$selected = str_replace("***", $wp_query->get('brand'), $selected);
	} else if ($wp_query->get('zenretail')) {
		$selected = str_replace("***", $wp_query->get('zenretail'), $selected);
	}
	echo $selected;
}

function insert_pages(){
	$post_id = post_exists('Category');
	if (!$post_id) {
		$my_post = array(
		'post_title'    => 'Category',
		'post_content'  => '<div id="category_info"></div>',
		'post_status'   => 'publish',
		'post_author'   => get_current_user_id(),
		'post_type'     => 'page',
		);
		wp_insert_post( $my_post, '' );
	}
	$post_id = post_exists('Product');
	if (!$post_id) {
		$my_post = array(
			'post_title'    => 'Product',
			'post_content'  => '<div id="product_info"></div>',
			'post_status'   => 'publish',
			'post_author'   => get_current_user_id(),
			'post_type'     => 'page',
		);
		wp_insert_post( $my_post, '' );
	}
	$post_id = post_exists('Brand');
	if (!$post_id) {
		$my_post = array(
		'post_title'    => 'Brand',
		'post_content'  => '<div id="brand_info"></div>',
		'post_status'   => 'publish',
		'post_author'   => get_current_user_id(),
		'post_type'     => 'page',
		);
		wp_insert_post( $my_post, '' );
	}

	$post_id = post_exists('ZenRetail');
	if (!$post_id) {
		$my_post = array(
		'post_title'    => 'ZenRetail',
		'post_content'  => '<div id="zenretail"></div>',
		'post_status'   => 'publish',
		'post_author'   => get_current_user_id(),
		'post_type'     => 'page',
		);
		wp_insert_post( $my_post, '' );
	}
}

function filterArray($value){
	$country = strtoupper(substr(get_locale(), 0, 2));
	return ($value->country == $country);
}

function custom_nav_menu_items($items, $menu)  {
	if (has_nav_menu('zenretail')) {

		global $wp_version;
		$args = array(
			'timeout'     => 5,
			'redirection' => 5,
			'httpversion' => '1.1',
			'user-agent'  => 'WordPress/' . $wp_version . '; ' . home_url(),
			'blocking'    => true,
			'headers'     => array(
				"Content-type" 				  => "application/json",
				"Access-Control-Allow-Origin" => "*"
			),
			'cookies'     => array(),
			'body'        => null,
			'compress'    => false,
			'decompress'  => true,
			'sslverify'   => false,
			'stream'      => false,
			'filename'    => null
		); 

		$options = get_option('ZenRetail');

		/// Basket
		$items .= '<li class="menu-item menu-item-type-custom menu-item-object-custom"><a href="/zenretail/basket" class="basket"><img src="/wp-content/plugins/wpWebretail/public/images/basket.png" width="25"></i></a></li>';
		
		/// Products
		$items .= add_menu('Products');
		$items .= add_submenu('Featured', '/category/featured');
		$items .= add_submenu('New', '/category/new');
		$items .= add_submenu('Sale', '/category/sale');
		$items .= close_menu();
		
		/// Categories
		$url = $options['url'] . '/api/ecommerce/category';
		$categories = wp_remote_get($url, $args);
		$response_code = wp_remote_retrieve_response_code( $categories );
		if ($response_code == 200) {
			$items .= add_menu('Categories');
			foreach(json_decode($categories['body']) as $category) {
				$desc = $category->categoryName;
				$filteredArray = array_filter($category->translations, 'filterArray');
				foreach($filteredArray as $v){
					$desc = $v->value;
				}
				$items .= add_submenu( $desc, '/category/' . $category->seo->permalink);
			}
			$items .= close_menu();
		}

		/// Brands
		$url = $options['url'] . '/api/ecommerce/brand';
		$brands = wp_remote_get($url, $args);
		$response_code = wp_remote_retrieve_response_code( $brands );
		if ($response_code == 200) {
			$items .= add_menu('Brands');
			foreach(json_decode($brands['body']) as $brand) {
				$items .= add_submenu( $brand->brandName, '/brand/' . $brand->seo->permalink);
			}
			$items .= close_menu();
		}
	}
	
	return $items;
}

function add_menu($title) {
	return '<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children">' .
		'<a><span class="trn">' . $title . '</span>' .
		'<svg class="icon icon-angle-down" aria-hidden="true" role="img">' .
		'<use href="#icon-angle-down" xlink:href="#icon-angle-down"></use></svg></a>' .
		'<ul class="sub-menu">';
}

function close_menu() {
	return '</ul></li>';
}

function add_submenu($title, $url) {
	return '<li class="menu-item menu-item-type-custom menu-item-object-custom"><a href="' . $url . '"><span class="trn">' . $title . '</span></a></li>';
}

function webretail_menu() {
	register_nav_menu('zenretail', '<span class="trn">Automatically add zenretail primary categories in this menu</span>');
}

function add_posts_to_search_query($posts){
	global $wp_query, $wp_version;
	if ( !is_main_query() || is_admin() || !is_search() )
		return $posts;

	$args = array(
		'timeout'     => 5,
		'redirection' => 5,
		'httpversion' => '1.1',
		'user-agent'  => 'WordPress/' . $wp_version . '; ' . home_url(),
		'blocking'    => true,
		'headers'     => array(
			"Content-type" 				  => "application/json",
			"Access-Control-Allow-Origin" => "*"
		),
		'cookies'     => array(),
		'body'        => null,
		'compress'    => false,
		'decompress'  => true,
		'sslverify'   => false,
		'stream'      => false,
		'filename'    => null
	); 

	$options = get_option('ZenRetail');
	$url = $options['url'] . '/api/ecommerce/search/' . $_GET['s'];
	$response = wp_remote_get($url, $args);
	$response_code = wp_remote_retrieve_response_code( $response );
	if ($response_code == 200) {
		$count = count(json_decode($response['body']));
		if ($count == 0) {
			return $posts;
		}			
		array_push($wp_query->posts, null);
		$wp_query->found_posts += $count;
		$wp_query->post_count += $count;
		echo "<script>var search = '" . $response['body'] . "';</script>";
	}
	// set the paged and other wp_query properties to the right value, to make pagination work
	return $wp_query->posts;
}

register_activation_hook( __FILE__, 'activate_webretail' );
register_deactivation_hook( __FILE__, 'deactivate_webretail' );
register_activation_hook( __FILE__, 'insert_pages' );

// Using a filter instead of an action to create the rewrite rules.
// Write rules -> Add query vars -> Recalculate rewrite rules
add_filter('rewrite_rules_array', 'create_rewrite_rules');
add_filter('query_vars', 'add_query_vars');

// Recalculates rewrite rules during admin init to save resourcees.
// Could probably run it once as long as it isn't going to change or check the
// $wp_rewrite rules to see if it's active.
add_filter('admin_init', 'flush_custom_rules');
add_action('template_redirect', 'template_redirect_intercept');
	

add_action('init', 'webretail_menu');
add_filter('wp_nav_menu_items', 'custom_nav_menu_items', 10, 2);

add_filter('the_posts', 'add_posts_to_search_query');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-zenretail.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_webretail() {

	$plugin = new ZenRetail();
	$plugin->run();

}
run_webretail();
