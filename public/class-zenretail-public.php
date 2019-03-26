<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://www.zenretail.cloud:8181
 * @since      1.0.0
 *
 * @package    ZenRetail
 * @subpackage ZenRetail/public
 * @author     Gerardo Grisolini <gerardo@grisolini.com>
 */

class Webretail_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
        $this->webretail_options = get_option($this->plugin_name);
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		// wp_enqueue_style( 'jssocials', plugin_dir_url( __FILE__ ) . 'css/jssocials.css', array(), $this->version, 'all' );
		// wp_enqueue_style( 'jssocials-theme-flat', plugin_dir_url( __FILE__ ) . 'css/jssocials-theme-flat.css', array(), $this->version, 'all' );
		// wp_enqueue_style( 'font-awesome', plugin_dir_url( __FILE__ ) . 'css/font-awesome.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'unite-gallery', plugin_dir_url( __FILE__ ) . 'unitegallery/css/unite-gallery.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/zenretail-public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
	
		echo "<script>";
		echo "var locale = '" . strtoupper(substr(get_locale(), 0, 2)) . "';";
		echo "var apiUrl = '" . $this->webretail_options['url'] . "';";
		echo "var featured = '" . $this->webretail_options['featured'] . "';";
		echo "var news = '" . $this->webretail_options['news'] . "';";
		echo "var sale = '" . $this->webretail_options['sale'] . "';";
		echo "var brands = '" . $this->webretail_options['brands'] . "';";
		echo "</script>";
		
		// wp_enqueue_script( 'jssocials', plugin_dir_url( __FILE__ ) . 'js/jssocials.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'unitegallery', plugin_dir_url( __FILE__ ) . 'unitegallery/js/unitegallery.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'ug-theme-compact', plugin_dir_url( __FILE__ ) . 'unitegallery/themes/tiles/ug-theme-tiles.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'dict', plugin_dir_url( __FILE__ ) . 'js/dict.js', array(), $this->version, false );
		wp_enqueue_script( 'translate', plugin_dir_url( __FILE__ ) . 'js/jquery.translate.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/zenretail-public.js', array( 'jquery' ), $this->version, false );
	}

	/**
	 * Render the page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_page() {
		// include_once( 'partials/zenretail-public-display.php' );
	}
}
