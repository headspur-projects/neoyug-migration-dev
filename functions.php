<?php
/**
 * Twenty Twenty functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

/**
 * Table of Contents:
 * Theme Support
 * Required Files
 * Register Styles
 * Register Scripts
 * Register Menus
 * Custom Logo
 * WP Body Open
 * Register Sidebars
 * Enqueue Block Editor Assets
 * Enqueue Classic Editor Styles
 * Block Editor Settings
 */

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 * @since Twenty Twenty 1.0
 */
function twentytwenty_theme_support() {

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	// Custom background color.
	add_theme_support(
		'custom-background',
		array(
			'default-color' => 'f5efe0',
		)
	);

	// Set content-width.
	global $content_width;
	if ( ! isset( $content_width ) ) {
		$content_width = 580;
	}

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	// Set post thumbnail size.
	set_post_thumbnail_size( 1200, 9999 );

	// Add custom image size used in Cover Template.
	add_image_size( 'twentytwenty-fullscreen', 1980, 9999 );

	// Custom logo.
	$logo_width  = 120;
	$logo_height = 90;

	// If the retina setting is active, double the recommended width and height.
	if ( get_theme_mod( 'retina_logo', false ) ) {
		$logo_width  = floor( $logo_width * 2 );
		$logo_height = floor( $logo_height * 2 );
	}

	add_theme_support(
		'custom-logo',
		array(
			'height'      => $logo_height,
			'width'       => $logo_width,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'script',
			'style',
			'navigation-widgets',
		)
	);

	// Add support for full and wide align images.
	add_theme_support( 'align-wide' );

	// Add support for responsive embeds.
	add_theme_support( 'responsive-embeds' );

	/*
	 * Adds starter content to highlight the theme on fresh sites.
	 * This is done conditionally to avoid loading the starter content on every
	 * page load, as it is a one-off operation only needed once in the customizer.
	 */
	if ( is_customize_preview() ) {
		require get_template_directory() . '/inc/starter-content.php';
		add_theme_support( 'starter-content', twentytwenty_get_starter_content() );
	}

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/*
	 * Adds `async` and `defer` support for scripts registered or enqueued
	 * by the theme.
	 */
	$loader = new TwentyTwenty_Script_Loader();
	if ( version_compare( $GLOBALS['wp_version'], '6.3', '<' ) ) {
		add_filter( 'script_loader_tag', array( $loader, 'filter_script_loader_tag' ), 10, 2 );
	} else {
		add_filter( 'print_scripts_array', array( $loader, 'migrate_legacy_strategy_script_data' ), 100 );
	}
}

add_action( 'after_setup_theme', 'twentytwenty_theme_support' );

/**
 * REQUIRED FILES
 * Include required files.
 */
require get_template_directory() . '/inc/template-tags.php';

// Handle SVG icons.
require get_template_directory() . '/classes/class-twentytwenty-svg-icons.php';
require get_template_directory() . '/inc/svg-icons.php';

// Handle Customizer settings.
require get_template_directory() . '/classes/class-twentytwenty-customize.php';

// Require Separator Control class.
require get_template_directory() . '/classes/class-twentytwenty-separator-control.php';

// Custom comment walker.
require get_template_directory() . '/classes/class-twentytwenty-walker-comment.php';

// Custom page walker.
require get_template_directory() . '/classes/class-twentytwenty-walker-page.php';

// Custom script loader class.
require get_template_directory() . '/classes/class-twentytwenty-script-loader.php';

// Non-latin language handling.
require get_template_directory() . '/classes/class-twentytwenty-non-latin-languages.php';

// Custom CSS.
require get_template_directory() . '/inc/custom-css.php';

/**
 * Register block patterns and pattern categories.
 *
 * @since Twenty Twenty 2.8
 */
function twentytwenty_register_block_patterns() {
	require get_template_directory() . '/inc/block-patterns.php';
}

add_action( 'init', 'twentytwenty_register_block_patterns' );

/**
 * Register and Enqueue Styles.
 *
 * @since Twenty Twenty 1.0
 * @since Twenty Twenty 2.6 Enqueue the CSS file for the variable font.
 */
function twentytwenty_register_styles() {

	$theme_version = wp_get_theme()->get( 'Version' );

	wp_enqueue_style( 'twentytwenty-style', get_stylesheet_uri(), array(), $theme_version );
	wp_style_add_data( 'twentytwenty-style', 'rtl', 'replace' );

	// Enqueue the CSS file for the variable font, Inter.
	wp_enqueue_style( 'twentytwenty-fonts', get_theme_file_uri( '/assets/css/font-inter.css' ), array(), $theme_version, 'all' );

	// Add output of Customizer settings as inline style.
	$customizer_css = twentytwenty_get_customizer_css( 'front-end' );
	if ( $customizer_css ) {
		wp_add_inline_style( 'twentytwenty-style', $customizer_css );
	}

	// Add print CSS.
	wp_enqueue_style( 'twentytwenty-print-style', get_template_directory_uri() . '/print.css', null, $theme_version, 'print' );
}

add_action( 'wp_enqueue_scripts', 'twentytwenty_register_styles' );

/**
 * Register and Enqueue Scripts.
 *
 * @since Twenty Twenty 1.0
 */
function twentytwenty_register_scripts() {

	$theme_version = wp_get_theme()->get( 'Version' );

	if ( ( ! is_admin() ) && is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	/*
	 * This script is intentionally printed in the head because it involves the page header. The `defer` script loading
	 * strategy ensures that it does not block rendering; being in the head it will start loading earlier so that it
	 * will execute sooner once the DOM has loaded. The $args array is not used here to avoid unintentional footer
	 * placement in WP<6.3; the wp_script_add_data() call is used instead.
	 */
	wp_enqueue_script( 'twentytwenty-js', get_template_directory_uri() . '/assets/js/index.js', array(), $theme_version );
	wp_script_add_data( 'twentytwenty-js', 'strategy', 'defer' );
}

add_action( 'wp_enqueue_scripts', 'twentytwenty_register_scripts' );

/**
 * Fix skip link focus in IE11.
 *
 * This does not enqueue the script because it is tiny and because it is only for IE11,
 * thus it does not warrant having an entire dedicated blocking script being loaded.
 *
 * @since Twenty Twenty 1.0
 * @deprecated Twenty Twenty 2.3 Removed from wp_print_footer_scripts action.
 *
 * @link https://git.io/vWdr2
 */
function twentytwenty_skip_link_focus_fix() {
	// The following is minified via `terser --compress --mangle -- assets/js/skip-link-focus-fix.js`.
	?>
	<script>
	/(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var t,e=location.hash.substring(1);/^[A-z0-9_-]+$/.test(e)&&(t=document.getElementById(e))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())},!1);
	</script>
	<?php
}

/**
 * Enqueue non-latin language styles.
 *
 * @since Twenty Twenty 1.0
 *
 * @return void
 */
function twentytwenty_non_latin_languages() {
	$custom_css = TwentyTwenty_Non_Latin_Languages::get_non_latin_css( 'front-end' );

	if ( $custom_css ) {
		wp_add_inline_style( 'twentytwenty-style', $custom_css );
	}
}

add_action( 'wp_enqueue_scripts', 'twentytwenty_non_latin_languages' );

/**
 * Register navigation menus uses wp_nav_menu in five places.
 *
 * @since Twenty Twenty 1.0
 */
function twentytwenty_menus() {

	$locations = array(
		'primary'  => __( 'Desktop Horizontal Menu', 'twentytwenty' ),
		'expanded' => __( 'Desktop Expanded Menu', 'twentytwenty' ),
		'mobile'   => __( 'Mobile Menu', 'twentytwenty' ),
		'footer'   => __( 'Footer Menu', 'twentytwenty' ),
		'social'   => __( 'Social Menu', 'twentytwenty' ),
	);

	register_nav_menus( $locations );
}

add_action( 'init', 'twentytwenty_menus' );

/**
 * Get the information about the logo.
 *
 * @since Twenty Twenty 1.0
 *
 * @param string $html The HTML output from get_custom_logo (core function).
 * @return string
 */
function twentytwenty_get_custom_logo( $html ) {

	$logo_id = get_theme_mod( 'custom_logo' );

	if ( ! $logo_id ) {
		return $html;
	}

	$logo = wp_get_attachment_image_src( $logo_id, 'full' );

	if ( $logo ) {
		// For clarity.
		$logo_width  = esc_attr( $logo[1] );
		$logo_height = esc_attr( $logo[2] );

		// If the retina logo setting is active, reduce the width/height by half.
		if ( get_theme_mod( 'retina_logo', false ) ) {
			$logo_width  = floor( $logo_width / 2 );
			$logo_height = floor( $logo_height / 2 );

			$search = array(
				'/width=\"\d+\"/iU',
				'/height=\"\d+\"/iU',
			);

			$replace = array(
				"width=\"{$logo_width}\"",
				"height=\"{$logo_height}\"",
			);

			// Add a style attribute with the height, or append the height to the style attribute if the style attribute already exists.
			if ( false === strpos( $html, ' style=' ) ) {
				$search[]  = '/(src=)/';
				$replace[] = "style=\"height: {$logo_height}px;\" src=";
			} else {
				$search[]  = '/(style="[^"]*)/';
				$replace[] = "$1 height: {$logo_height}px;";
			}

			$html = preg_replace( $search, $replace, $html );

		}
	}

	return $html;
}

add_filter( 'get_custom_logo', 'twentytwenty_get_custom_logo' );

if ( ! function_exists( 'wp_body_open' ) ) {

	/**
	 * Shim for wp_body_open, ensuring backward compatibility with versions of WordPress older than 5.2.
	 *
	 * @since Twenty Twenty 1.0
	 */
	function wp_body_open() {
		/** This action is documented in wp-includes/general-template.php */
		do_action( 'wp_body_open' );
	}
}

/**
 * Include a skip to content link at the top of the page so that users can bypass the menu.
 *
 * @since Twenty Twenty 1.0
 */
function twentytwenty_skip_link() {
	echo '<a class="skip-link screen-reader-text" href="#site-content">' .
		/* translators: Hidden accessibility text. */
		__( 'Skip to the content', 'twentytwenty' ) .
	'</a>';
}

add_action( 'wp_body_open', 'twentytwenty_skip_link', 5 );

/**
 * Register widget areas.
 *
 * @since Twenty Twenty 1.0
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function twentytwenty_sidebar_registration() {

	// Arguments used in all register_sidebar() calls.
	$shared_args = array(
		'before_title'  => '<h2 class="widget-title subheading heading-size-3">',
		'after_title'   => '</h2>',
		'before_widget' => '<div class="widget %2$s"><div class="widget-content">',
		'after_widget'  => '</div></div>',
	);

	// Footer #1.
	register_sidebar(
		array_merge(
			$shared_args,
			array(
				'name'        => __( 'Footer #1', 'twentytwenty' ),
				'id'          => 'sidebar-1',
				'description' => __( 'Widgets in this area will be displayed in the first column in the footer.', 'twentytwenty' ),
			)
		)
	);

	// Footer #2.
	register_sidebar(
		array_merge(
			$shared_args,
			array(
				'name'        => __( 'Footer #2', 'twentytwenty' ),
				'id'          => 'sidebar-2',
				'description' => __( 'Widgets in this area will be displayed in the second column in the footer.', 'twentytwenty' ),
			)
		)
	);
}

add_action( 'widgets_init', 'twentytwenty_sidebar_registration' );

/**
 * Enqueue supplemental block editor styles.
 *
 * @since Twenty Twenty 1.0
 * @since Twenty Twenty 2.4 Removed a script related to the obsolete Squared style of Button blocks.
 * @since Twenty Twenty 2.6 Enqueue the CSS file for the variable font.
 */
function twentytwenty_block_editor_styles() {

	$theme_version = wp_get_theme()->get( 'Version' );

	// Enqueue the editor styles.
	wp_enqueue_style( 'twentytwenty-block-editor-styles', get_theme_file_uri( '/assets/css/editor-style-block.css' ), array(), $theme_version, 'all' );
	wp_style_add_data( 'twentytwenty-block-editor-styles', 'rtl', 'replace' );

	// Add inline style from the Customizer.
	$customizer_css = twentytwenty_get_customizer_css( 'block-editor' );
	if ( $customizer_css ) {
		wp_add_inline_style( 'twentytwenty-block-editor-styles', $customizer_css );
	}

	// Enqueue the CSS file for the variable font, Inter.
	wp_enqueue_style( 'twentytwenty-fonts', get_theme_file_uri( '/assets/css/font-inter.css' ), array(), $theme_version, 'all' );

	// Add inline style for non-latin fonts.
	$custom_css = TwentyTwenty_Non_Latin_Languages::get_non_latin_css( 'block-editor' );
	if ( $custom_css ) {
		wp_add_inline_style( 'twentytwenty-block-editor-styles', $custom_css );
	}
}

if ( is_admin() && version_compare( $GLOBALS['wp_version'], '6.3', '>=' ) ) {
	add_action( 'enqueue_block_assets', 'twentytwenty_block_editor_styles', 1, 1 );
} else {
	add_action( 'enqueue_block_editor_assets', 'twentytwenty_block_editor_styles', 1, 1 );
}

/**
 * Enqueue classic editor styles.
 *
 * @since Twenty Twenty 1.0
 * @since Twenty Twenty 2.6 Enqueue the CSS file for the variable font.
 */
function twentytwenty_classic_editor_styles() {

	$classic_editor_styles = array(
		'/assets/css/editor-style-classic.css',
		'/assets/css/font-inter.css',
	);

	add_editor_style( $classic_editor_styles );
}

add_action( 'init', 'twentytwenty_classic_editor_styles' );

/**
 * Output Customizer settings in the classic editor.
 * Adds styles to the head of the TinyMCE iframe. Kudos to @Otto42 for the original solution.
 *
 * @since Twenty Twenty 1.0
 *
 * @param array $mce_init TinyMCE styles.
 * @return array TinyMCE styles.
 */
function twentytwenty_add_classic_editor_customizer_styles( $mce_init ) {

	$styles = twentytwenty_get_customizer_css( 'classic-editor' );

	if ( ! $styles ) {
		return $mce_init;
	}

	if ( ! isset( $mce_init['content_style'] ) ) {
		$mce_init['content_style'] = $styles . ' ';
	} else {
		$mce_init['content_style'] .= ' ' . $styles . ' ';
	}

	return $mce_init;
}

add_filter( 'tiny_mce_before_init', 'twentytwenty_add_classic_editor_customizer_styles' );

/**
 * Output non-latin font styles in the classic editor.
 * Adds styles to the head of the TinyMCE iframe. Kudos to @Otto42 for the original solution.
 *
 * @param array $mce_init TinyMCE styles.
 * @return array TinyMCE styles.
 */
function twentytwenty_add_classic_editor_non_latin_styles( $mce_init ) {

	$styles = TwentyTwenty_Non_Latin_Languages::get_non_latin_css( 'classic-editor' );

	// Return if there are no styles to add.
	if ( ! $styles ) {
		return $mce_init;
	}

	if ( ! isset( $mce_init['content_style'] ) ) {
		$mce_init['content_style'] = $styles . ' ';
	} else {
		$mce_init['content_style'] .= ' ' . $styles . ' ';
	}

	return $mce_init;
}

add_filter( 'tiny_mce_before_init', 'twentytwenty_add_classic_editor_non_latin_styles' );

/**
 * Block Editor Settings.
 * Add custom colors and font sizes to the block editor.
 *
 * @since Twenty Twenty 1.0
 */
function twentytwenty_block_editor_settings() {

	// Block Editor Palette.
	$editor_color_palette = array(
		array(
			'name'  => __( 'Accent Color', 'twentytwenty' ),
			'slug'  => 'accent',
			'color' => twentytwenty_get_color_for_area( 'content', 'accent' ),
		),
		array(
			'name'  => _x( 'Primary', 'color', 'twentytwenty' ),
			'slug'  => 'primary',
			'color' => twentytwenty_get_color_for_area( 'content', 'text' ),
		),
		array(
			'name'  => _x( 'Secondary', 'color', 'twentytwenty' ),
			'slug'  => 'secondary',
			'color' => twentytwenty_get_color_for_area( 'content', 'secondary' ),
		),
		array(
			'name'  => __( 'Subtle Background', 'twentytwenty' ),
			'slug'  => 'subtle-background',
			'color' => twentytwenty_get_color_for_area( 'content', 'borders' ),
		),
	);

	// Add the background option.
	$background_color = get_theme_mod( 'background_color' );
	if ( ! $background_color ) {
		$background_color_arr = get_theme_support( 'custom-background' );
		$background_color     = $background_color_arr[0]['default-color'];
	}
	$editor_color_palette[] = array(
		'name'  => __( 'Background Color', 'twentytwenty' ),
		'slug'  => 'background',
		'color' => '#' . $background_color,
	);

	// If we have accent colors, add them to the block editor palette.
	if ( $editor_color_palette ) {
		add_theme_support( 'editor-color-palette', $editor_color_palette );
	}

	// Block Editor Font Sizes.
	add_theme_support(
		'editor-font-sizes',
		array(
			array(
				'name'      => _x( 'Small', 'Name of the small font size in the block editor', 'twentytwenty' ),
				'shortName' => _x( 'S', 'Short name of the small font size in the block editor.', 'twentytwenty' ),
				'size'      => 18,
				'slug'      => 'small',
			),
			array(
				'name'      => _x( 'Regular', 'Name of the regular font size in the block editor', 'twentytwenty' ),
				'shortName' => _x( 'M', 'Short name of the regular font size in the block editor.', 'twentytwenty' ),
				'size'      => 21,
				'slug'      => 'normal',
			),
			array(
				'name'      => _x( 'Large', 'Name of the large font size in the block editor', 'twentytwenty' ),
				'shortName' => _x( 'L', 'Short name of the large font size in the block editor.', 'twentytwenty' ),
				'size'      => 26.25,
				'slug'      => 'large',
			),
			array(
				'name'      => _x( 'Larger', 'Name of the larger font size in the block editor', 'twentytwenty' ),
				'shortName' => _x( 'XL', 'Short name of the larger font size in the block editor.', 'twentytwenty' ),
				'size'      => 32,
				'slug'      => 'larger',
			),
		)
	);

	add_theme_support( 'editor-styles' );

	// If we have a dark background color then add support for dark editor style.
	// We can determine if the background color is dark by checking if the text-color is white.
	if ( '#ffffff' === strtolower( twentytwenty_get_color_for_area( 'content', 'text' ) ) ) {
		add_theme_support( 'dark-editor-style' );
	}
}

add_action( 'after_setup_theme', 'twentytwenty_block_editor_settings' );

/**
 * Overwrite default more tag with styling and screen reader markup.
 *
 * @param string $html The default output HTML for the more tag.
 * @return string
 */
function twentytwenty_read_more_tag( $html ) {
	return preg_replace( '/<a(.*)>(.*)<\/a>/iU', sprintf( '<div class="read-more-button-wrap"><a$1><span class="faux-button">$2</span> <span class="screen-reader-text">"%1$s"</span></a></div>', get_the_title( get_the_ID() ) ), $html );
}

add_filter( 'the_content_more_link', 'twentytwenty_read_more_tag' );

/**
 * Enqueues scripts for customizer controls & settings.
 *
 * @since Twenty Twenty 1.0
 *
 * @return void
 */
function twentytwenty_customize_controls_enqueue_scripts() {
	$theme_version = wp_get_theme()->get( 'Version' );

	// Add main customizer js file.
	wp_enqueue_script( 'twentytwenty-customize', get_template_directory_uri() . '/assets/js/customize.js', array( 'jquery' ), $theme_version );

	// Add script for color calculations.
	wp_enqueue_script( 'twentytwenty-color-calculations', get_template_directory_uri() . '/assets/js/color-calculations.js', array( 'wp-color-picker' ), $theme_version );

	// Add script for controls.
	wp_enqueue_script( 'twentytwenty-customize-controls', get_template_directory_uri() . '/assets/js/customize-controls.js', array( 'twentytwenty-color-calculations', 'customize-controls', 'underscore', 'jquery' ), $theme_version );
	wp_localize_script( 'twentytwenty-customize-controls', 'twentyTwentyBgColors', twentytwenty_get_customizer_color_vars() );
}

add_action( 'customize_controls_enqueue_scripts', 'twentytwenty_customize_controls_enqueue_scripts' );

/**
 * Enqueue scripts for the customizer preview.
 *
 * @since Twenty Twenty 1.0
 *
 * @return void
 */
function twentytwenty_customize_preview_init() {
	$theme_version = wp_get_theme()->get( 'Version' );

	wp_enqueue_script( 'twentytwenty-customize-preview', get_theme_file_uri( '/assets/js/customize-preview.js' ), array( 'customize-preview', 'customize-selective-refresh', 'jquery' ), $theme_version, array( 'in_footer' => true ) );
	wp_localize_script( 'twentytwenty-customize-preview', 'twentyTwentyBgColors', twentytwenty_get_customizer_color_vars() );
	wp_localize_script( 'twentytwenty-customize-preview', 'twentyTwentyPreviewEls', twentytwenty_get_elements_array() );

	wp_add_inline_script(
		'twentytwenty-customize-preview',
		sprintf(
			'wp.customize.selectiveRefresh.partialConstructor[ %1$s ].prototype.attrs = %2$s;',
			wp_json_encode( 'cover_opacity' ),
			wp_json_encode( twentytwenty_customize_opacity_range() )
		)
	);
}

add_action( 'customize_preview_init', 'twentytwenty_customize_preview_init' );

/**
 * Get accessible color for an area.
 *
 * @since Twenty Twenty 1.0
 *
 * @param string $area    The area we want to get the colors for.
 * @param string $context Can be 'text' or 'accent'.
 * @return string Returns a HEX color.
 */
function twentytwenty_get_color_for_area( $area = 'content', $context = 'text' ) {

	// Get the value from the theme-mod.
	$settings = get_theme_mod(
		'accent_accessible_colors',
		array(
			'content'       => array(
				'text'      => '#000000',
				'accent'    => '#cd2653',
				'secondary' => '#6d6d6d',
				'borders'   => '#dcd7ca',
			),
			'header-footer' => array(
				'text'      => '#000000',
				'accent'    => '#cd2653',
				'secondary' => '#6d6d6d',
				'borders'   => '#dcd7ca',
			),
		)
	);

	// If we have a value return it.
	if ( isset( $settings[ $area ] ) && isset( $settings[ $area ][ $context ] ) ) {
		return $settings[ $area ][ $context ];
	}

	// Return false if the option doesn't exist.
	return false;
}

/**
 * Returns an array of variables for the customizer preview.
 *
 * @since Twenty Twenty 1.0
 *
 * @return array
 */
function twentytwenty_get_customizer_color_vars() {
	$colors = array(
		'content'       => array(
			'setting' => 'background_color',
		),
		'header-footer' => array(
			'setting' => 'header_footer_background_color',
		),
	);
	return $colors;
}

/**
 * Get an array of elements.
 *
 * @since Twenty Twenty 1.0
 *
 * @return array
 */
function twentytwenty_get_elements_array() {

	// The array is formatted like this:
	// [key-in-saved-setting][sub-key-in-setting][css-property] = [elements].
	$elements = array(
		'content'       => array(
			'accent'     => array(
				'color'            => array( '.color-accent', '.color-accent-hover:hover', '.color-accent-hover:focus', ':root .has-accent-color', '.has-drop-cap:not(:focus):first-letter', '.wp-block-button.is-style-outline', 'a' ),
				'border-color'     => array( 'blockquote', '.border-color-accent', '.border-color-accent-hover:hover', '.border-color-accent-hover:focus' ),
				'background-color' => array( 'button', '.button', '.faux-button', '.wp-block-button__link', '.wp-block-file .wp-block-file__button', 'input[type="button"]', 'input[type="reset"]', 'input[type="submit"]', '.bg-accent', '.bg-accent-hover:hover', '.bg-accent-hover:focus', ':root .has-accent-background-color', '.comment-reply-link' ),
				'fill'             => array( '.fill-children-accent', '.fill-children-accent *' ),
			),
			'background' => array(
				'color'            => array( ':root .has-background-color', 'button', '.button', '.faux-button', '.wp-block-button__link', '.wp-block-file__button', 'input[type="button"]', 'input[type="reset"]', 'input[type="submit"]', '.wp-block-button', '.comment-reply-link', '.has-background.has-primary-background-color:not(.has-text-color)', '.has-background.has-primary-background-color *:not(.has-text-color)', '.has-background.has-accent-background-color:not(.has-text-color)', '.has-background.has-accent-background-color *:not(.has-text-color)' ),
				'background-color' => array( ':root .has-background-background-color' ),
			),
			'text'       => array(
				'color'            => array( 'body', '.entry-title a', ':root .has-primary-color' ),
				'background-color' => array( ':root .has-primary-background-color' ),
			),
			'secondary'  => array(
				'color'            => array( 'cite', 'figcaption', '.wp-caption-text', '.post-meta', '.entry-content .wp-block-archives li', '.entry-content .wp-block-categories li', '.entry-content .wp-block-latest-posts li', '.wp-block-latest-comments__comment-date', '.wp-block-latest-posts__post-date', '.wp-block-embed figcaption', '.wp-block-image figcaption', '.wp-block-pullquote cite', '.comment-metadata', '.comment-respond .comment-notes', '.comment-respond .logged-in-as', '.pagination .dots', '.entry-content hr:not(.has-background)', 'hr.styled-separator', ':root .has-secondary-color' ),
				'background-color' => array( ':root .has-secondary-background-color' ),
			),
			'borders'    => array(
				'border-color'        => array( 'pre', 'fieldset', 'input', 'textarea', 'table', 'table *', 'hr' ),
				'background-color'    => array( 'caption', 'code', 'code', 'kbd', 'samp', '.wp-block-table.is-style-stripes tbody tr:nth-child(odd)', ':root .has-subtle-background-background-color' ),
				'border-bottom-color' => array( '.wp-block-table.is-style-stripes' ),
				'border-top-color'    => array( '.wp-block-latest-posts.is-grid li' ),
				'color'               => array( ':root .has-subtle-background-color' ),
			),
		),
		'header-footer' => array(
			'accent'     => array(
				'color'            => array( 'body:not(.overlay-header) .primary-menu > li > a', 'body:not(.overlay-header) .primary-menu > li > .icon', '.modal-menu a', '.footer-menu a, .footer-widgets a:where(:not(.wp-block-button__link))', '#site-footer .wp-block-button.is-style-outline', '.wp-block-pullquote:before', '.singular:not(.overlay-header) .entry-header a', '.archive-header a', '.header-footer-group .color-accent', '.header-footer-group .color-accent-hover:hover' ),
				'background-color' => array( '.social-icons a', '#site-footer button:not(.toggle)', '#site-footer .button', '#site-footer .faux-button', '#site-footer .wp-block-button__link', '#site-footer .wp-block-file__button', '#site-footer input[type="button"]', '#site-footer input[type="reset"]', '#site-footer input[type="submit"]' ),
			),
			'background' => array(
				'color'            => array( '.social-icons a', 'body:not(.overlay-header) .primary-menu ul', '.header-footer-group button', '.header-footer-group .button', '.header-footer-group .faux-button', '.header-footer-group .wp-block-button:not(.is-style-outline) .wp-block-button__link', '.header-footer-group .wp-block-file__button', '.header-footer-group input[type="button"]', '.header-footer-group input[type="reset"]', '.header-footer-group input[type="submit"]' ),
				'background-color' => array( '#site-header', '.footer-nav-widgets-wrapper', '#site-footer', '.menu-modal', '.menu-modal-inner', '.search-modal-inner', '.archive-header', '.singular .entry-header', '.singular .featured-media:before', '.wp-block-pullquote:before' ),
			),
			'text'       => array(
				'color'               => array( '.header-footer-group', 'body:not(.overlay-header) #site-header .toggle', '.menu-modal .toggle' ),
				'background-color'    => array( 'body:not(.overlay-header) .primary-menu ul' ),
				'border-bottom-color' => array( 'body:not(.overlay-header) .primary-menu > li > ul:after' ),
				'border-left-color'   => array( 'body:not(.overlay-header) .primary-menu ul ul:after' ),
			),
			'secondary'  => array(
				'color' => array( '.site-description', 'body:not(.overlay-header) .toggle-inner .toggle-text', '.widget .post-date', '.widget .rss-date', '.widget_archive li', '.widget_categories li', '.widget cite', '.widget_pages li', '.widget_meta li', '.widget_nav_menu li', '.powered-by-wordpress', '.footer-credits .privacy-policy', '.to-the-top', '.singular .entry-header .post-meta', '.singular:not(.overlay-header) .entry-header .post-meta a' ),
			),
			'borders'    => array(
				'border-color'     => array( '.header-footer-group pre', '.header-footer-group fieldset', '.header-footer-group input', '.header-footer-group textarea', '.header-footer-group table', '.header-footer-group table *', '.footer-nav-widgets-wrapper', '#site-footer', '.menu-modal nav *', '.footer-widgets-outer-wrapper', '.footer-top' ),
				'background-color' => array( '.header-footer-group table caption', 'body:not(.overlay-header) .header-inner .toggle-wrapper::before' ),
			),
		),
	);

	/**
	 * Filters Twenty Twenty theme elements.
	 *
	 * @since Twenty Twenty 1.0
	 *
	 * @param array Array of elements.
	 */
	return apply_filters( 'twentytwenty_get_elements_array', $elements );
}
























function display_seek_taxonomy_tabs() {
    $seek_terms = get_terms(array(
        'taxonomy' => 'guidance-seek', 
        'hide_empty' => false,        
    ));

    if (!empty($seek_terms) && !is_wp_error($seek_terms)) {
        $output = '<div class="guidance-seek-tabs">';
  
       foreach ($seek_terms as $term) {
            $output .= '<div class="guidance-seek-tab" data-seek="' . esc_attr($term->slug) . '">';
            $output .= esc_html($term->name); 
            $output .= '<svg class="close-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></div>';
        }

        $output .= '</div>';
    } else {
        $output = '<p>No guidance seek options found.</p>';
    }

    return $output;
}

add_shortcode('seek_taxonomy_tabs', 'display_seek_taxonomy_tabs');



function display_offer_taxonomy_tabs() {
    $offer_terms = get_terms(array(
        'taxonomy' => 'guidance-offer',
        'hide_empty' => false,
    ));

    if (!empty($offer_terms) && !is_wp_error($offer_terms)) {
        $output = '<div class="swiper-container guidence-offer-tabs">';
        $output .= '<div class="swiper-wrapper">';

        foreach ($offer_terms as $term) {
            $output .= '<div class="swiper-slide"data-offer="' . esc_attr($term->slug) . '">';
            $output .= '<img src="https://www.neoyug.com/wp-content/uploads/2025/02/Frame-1000006469-1.webp" alt="' . esc_attr($term->name) . '">';
            $output .= esc_html($term->name);
            $output .= '</div>';
        }

        $output .= '</div>';
        $output .= '<div class="swiper-button-next"></div>';
        $output .= '<div class="swiper-button-prev"></div>';
        $output .= '</div>';
    } else {
        $output = '<p>No guidance offer options found.</p>';
    }

    return $output;
}

add_shortcode('offer_taxonomy_tabs', 'display_offer_taxonomy_tabs');




function list_mentor_child_pages_with_custom_fields() {
    global $post;

    $child_pages = get_pages(array('child_of' => $post->ID, 'sort_column' => 'menu_order'));

    if ($child_pages) {
		
		 $mentors_with_blue_tick = [];
        $mentors_without_blue_tick = [];
        foreach ($child_pages as $page) {
            $add_blue_tick = get_field('add_blue_tick', $page->ID);
            if ($add_blue_tick) {
				
                $mentors_with_blue_tick[] = $page;
            } else {
				
                $mentors_without_blue_tick[] = $page;
            }
        }
		
		  $sorted_mentors = array_merge($mentors_with_blue_tick, $mentors_without_blue_tick);
		
        $output = '<div class="mentor-list">';

        foreach ($sorted_mentors as $page) {
            $mentor_image = get_field('mentor_image', $page->ID);
            $mentor_post = get_field('mentor_post', $page->ID);
            $mentor_name = $page->post_title;
            $session_price = get_field('session_price', $page->ID);
            $mentor_experience = get_field('mentor_experience', $page->ID);
            $mentor_languages = get_field('mentor_languages', $page->ID);
            $mentor_session_mode = get_field('mentor_session_mode', $page->ID);
            $mentor_city = get_field('mentor_city', $page->ID);
			$mentor_gender = get_field('mentor_gender', $page->ID);
			$mentor_guidance_seek = get_field('mentor_guidance_seek', $page->ID);
            $mentor_guidance_offer = get_field('guidance_offer', $page->ID);
			$mentor_modality = get_field('mentor_modality', $page->ID);
			$mentor_concerns = get_field('mentor_concerns', $page->ID);
			$add_blue_tick = get_field('add_blue_tick', $page->ID);
			
		if (is_array($mentor_guidance_seek)) {
    $mentor_guidance_seek_names = array_map(function ($term) {
        return $term->slug;
    }, $mentor_guidance_seek);
    $mentor_guidance_seek = implode(', ', $mentor_guidance_seek_names);
}
			
			if (is_array($mentor_guidance_offer)) {
    $mentor_guidance_offer_names = array_map(function ($term) {
        return $term->slug;
    }, $mentor_guidance_offer);
    $mentor_guidance_offer = implode(', ', $mentor_guidance_offer_names);
}
	
			if (is_array($mentor_modality)) {
    $mentor_modality_values = implode(', ', array_map(function($value) {
        return str_replace(' ', '_', esc_attr($value));
    }, $mentor_modality));
} else {
    $mentor_modality_values = str_replace(' ', '_', esc_attr($mentor_modality));
}
			
		 $mentor_languages_attr = is_array($mentor_languages) ? implode(', ', array_map('esc_attr', $mentor_languages)) : '';	
			
	$mentor_concerns_attr = is_array($mentor_concerns) ? implode(', ', array_map(function($value) {
    return str_replace(' ', '_', esc_attr($value));
}, $mentor_concerns)) : '';
			
			
        $output .= '<div class="mentor-item mentor-listing-item" data-gender="' . esc_attr($mentor_gender) . '" data-guidance="' . esc_attr($mentor_guidance_seek) .  '" data-guidance-offer="' . esc_attr($mentor_guidance_offer) . '" data-modality="' . $mentor_modality_values . '" data-languages="' . esc_attr($mentor_languages_attr) . '" data-concerns="' . esc_attr($mentor_concerns_attr) . '">';

            if ($mentor_image) {
                $output .= '<div class="mentor-item-image"><img src="' . esc_url($mentor_image) . '" alt="' . esc_attr($mentor_name) . '">';
            }

            if ($mentor_post) {
                $output .= '<h2 class="mentor-post">' . esc_html($mentor_post) . '</h2></div>';
            }

            $output .= '<div class="mentor-item-content">';
			
              $output .= '<h2 class="mentor-name">';
    $output .= esc_html($mentor_name);
    if ($add_blue_tick) {
        $output .= ' <img src="https://www.neoyug.com/wp-content/uploads/2025/02/material-symbols_verified-1.webp" alt="Blue Tick" class="blue-tick-icon">';
    }
    $output .= '</h2>';
			
			if ($session_price) {
                $output .= '<h2 class="mentor-price">Energy Exchange: ' . esc_html($session_price) . '</h2>';
            }
            if ($mentor_experience) {
                $output .= '<h2 class="mentor-experience">' . esc_html($mentor_experience) . '</h2>';
            }
        if ($mentor_languages) {
                $output .= '<h2 class="mentor-languages">Speaks: <span>' . esc_html($mentor_languages_attr) . '</span></h2>';
            }
if ($mentor_session_mode) {
    $output .= '<h2 class="mentor-session-mode">Session Mode: <span>' . esc_html($mentor_session_mode) . '</span></h2>';
}
if ($mentor_city) {
    $output .= '<h2 class="mentor-city">City: <span>' . esc_html($mentor_city) . '</span></h2>';
}


            $output .= '<a href="' . get_permalink($page->ID) . '" class="mentor-connect-button">Connect With Mentor <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9419 4.44194C12.186 4.19787 12.186 3.80214 11.9419 3.55806L8.60861 0.224727C8.36453 -0.0193506 7.9688 -0.0193506 7.72472 0.224727C7.48065 0.468804 7.48065 0.864533 7.72472 1.10861L9.99112 3.375L1.5 3.375C1.15482 3.375 0.875 3.65482 0.875 4C0.875 4.34518 1.15482 4.625 1.5 4.625L9.99112 4.625L7.72472 6.89139C7.48065 7.13547 7.48065 7.5312 7.72472 7.77528C7.9688 8.01935 8.36453 8.01935 8.60861 7.77528L11.9419 4.44194Z" fill="white"/>
<path d="M11.9419 3.55806C12.186 3.80214 12.186 4.19787 11.9419 4.44194L8.60861 7.77528C8.36453 8.01935 7.9688 8.01935 7.72473 7.77528C7.48065 7.5312 7.48065 7.13547 7.72473 6.89139L10.6423 4.00212L7.72473 1.10861C7.48065 0.864532 7.48065 0.468804 7.72473 0.224726C7.9688 -0.0193514 8.36453 -0.0193514 8.60861 0.224726L11.9419 3.55806Z" fill="white"/>
</svg>
</a>';
            $output .= '</div>';

            $output .= '</div>';
        }

        $output .= '</div>';
        return $output;
    }

    return '<p>No mentors found.</p>';
}

add_shortcode('mentor_child_pages', 'list_mentor_child_pages_with_custom_fields');


function add_mentor_no_blue_tick_class_to_current_page() {
    global $post;

    if (is_page() && isset($post)) {
        $add_blue_tick = get_field('add_blue_tick', $post->ID);

        if ($add_blue_tick === false) {
            echo '<script>document.body.classList.add("mentor-no-blue-tick");</script>';
        } else {
           echo '<script>document.body.classList.add("blue-tick");</script>';
        }
    }
}
add_shortcode('mentor_no_blue_tick', 'add_mentor_no_blue_tick_class_to_current_page');





add_filter('wpcf7_form_tag', 'populate_mentor_name_dropdown', 10, 2);

function populate_mentor_name_dropdown($tag, $unused) {
    if ($tag['name'] !== 'mentor-name') {
        return $tag;
    }

    $mentor_page = get_page_by_title('Mentor');
    if (!$mentor_page) {
        return $tag;
    }

    $page_titles = [];

    $args = array(
        'post_type'   => 'page',
        'post_parent' => $mentor_page->ID,
        'posts_per_page' => -1,
        'post_status' => 'publish',
    );

    $child_pages = get_posts($args);

    foreach ($child_pages as $page) {
        if (get_post_meta($page->ID, 'add_price_on_request_form', true)) {
            $page_titles[] = $page->post_title;
        }
    }

    $tag['raw_values'] = $page_titles;
    $tag['values'] = $page_titles;

    return $tag;
} 















add_action('template_redirect', function () {
    if (is_404()) {
        get_header();
        ?>
        <main id="site-content">
            <div class="error-page-content-container">
                <div>
                    <img
                        fetchpriority="high"
                        decoding="async"
                        width="580"
                        height="290"
                        src="https://www.neoyug.com/wp-content/uploads/2025/07/404img-1.webp"
                        alt="404"
                    />

                    <h1>Oops! This page doesn’t exist.</h1>
      
                    <p>Looks like this page wandered off. Let’s help you find your way back.</p>

                    <a href="/">
                        <span>
                            <span>
                               <i aria-hidden="true" class="hm hm-arrow-right"></i>
                            </span>
                            <span>Back to Homepage</span>
                        </span>
                    </a>
                </div>
            </div>
        </main>
        <?php
        get_footer();
        exit;
    }
});





/**
 * Redirect logged-out users to MasterStudy login before checkout
 */
add_action( 'template_redirect', function() {
    // Only affect WooCommerce checkout page
    if ( function_exists( 'is_checkout' ) && is_checkout() && ! is_user_logged_in() ) {
        // Your MasterStudy login page
        $login_page = site_url('/user-account/');
        // Return here after login
        $return_to = urlencode( wc_get_checkout_url() );
        wp_redirect( $login_page . '?redirect=' . $return_to );
        exit;
    }
});

/**
 * Handle the redirect after MasterStudy login
 */
add_action( 'wp_login', function( $user_login, $user ) {
    // Check if there's a redirect parameter
    if ( isset( $_REQUEST['redirect'] ) && ! empty( $_REQUEST['redirect'] ) ) {
        $redirect_url = esc_url_raw( $_REQUEST['redirect'] );
        wp_safe_redirect( $redirect_url );
        exit;
    }
}, 10, 2 );

/**
 * Also handle redirect on MasterStudy's account page if user is already logged in
 */
add_action( 'template_redirect', function() {
    // If user lands on login page but is already logged in
    if ( is_page('user-account') && is_user_logged_in() ) {
        if ( isset( $_GET['redirect'] ) && ! empty( $_GET['redirect'] ) ) {
            $redirect_url = esc_url_raw( $_GET['redirect'] );
            wp_safe_redirect( $redirect_url );
            exit;
        }
    }
});







/**
 * Direct Add to Cart Course Shortcode
 * Add this code to your theme's functions.php file
 * 
 * Usage Examples:
 * [add_to_cart_course course_id="123"]
 * [add_to_cart_course course_id="123" button_text="Buy Now"]
 * Direct URL: yoursite.com/?add_course_to_cart=123
 */

/**
 * Helper function to find WooCommerce product ID for a course
 */
function masterstudy_find_product_id( $course_id ) {
    global $wpdb;
    
    // Method 1: Check product_id meta on course
    $product_id = get_post_meta( $course_id, 'product_id', true );
    if ( $product_id ) {
        return $product_id;
    }
    
    // Method 2: Search for product with _course_id meta
    $product_id = $wpdb->get_var( $wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta} 
        WHERE meta_key = '_course_id' 
        AND meta_value = %d 
        LIMIT 1",
        $course_id
    ) );
    if ( $product_id ) {
        return $product_id;
    }
    
    // Method 3: Check if course itself is a WooCommerce product
    if ( function_exists( 'wc_get_product' ) ) {
        $product = wc_get_product( $course_id );
        if ( $product ) {
            return $course_id;
        }
    }
    
    // Method 4: Search by matching title
    $course_title = get_the_title( $course_id );
    $product_id = $wpdb->get_var( $wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts} 
        WHERE post_type = 'product' 
        AND post_title = %s 
        AND post_status = 'publish'
        LIMIT 1",
        $course_title
    ) );
    
    return $product_id ? $product_id : false;
}

/**
 * SHORTCODE 1: WooCommerce Add to Cart (Direct)
 * Usage: [woo_add_to_cart course_id="123"]
 * Best for: WooCommerce-based purchases
 */
function masterstudy_woo_add_to_cart_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'course_id' => 0,
        'button_text' => 'Add to Cart',
        'style' => 'gradient',
    ), $atts );
    
    $course_id = intval( $atts['course_id'] );
    
    // If no course_id provided, show error
    if ( empty( $course_id ) ) {
        return '<p style="color: red;">Error: Please specify course_id. Example: [woo_add_to_cart course_id="123"]</p>';
    }
    
    if ( get_post_type( $course_id ) !== 'stm-courses' ) {
        return '<p style="color: red;">Invalid course ID: ' . $course_id . '</p>';
    }
    
    // Check if enrolled
    $user_id = get_current_user_id();
    $is_enrolled = false;
    if ( $user_id && class_exists( 'STM_LMS_User' ) ) {
        $is_enrolled = \STM_LMS_User::has_course_access( $course_id, 0, $user_id );
    }
    
    if ( $is_enrolled ) {
        return '<a href="' . esc_url( get_permalink( $course_id ) ) . '" class="enrolled-btn" style="display: inline-block; padding: 15px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">✓ Access Course</a>';
    }
    
    // Find WooCommerce product
    $product_id = masterstudy_find_product_id( $course_id );
    
    if ( ! $product_id || ! class_exists( 'WooCommerce' ) ) {
        return '<p style="color: red;">WooCommerce product not found for this course</p>';
    }
    
    // Button styles
    $button_styles = array(
        'default' => 'background: #4c6ef5; color: white; padding: 15px 30px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s;',
        'gradient' => 'background: linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%); color: white; padding: 15px 30px; border-radius: 25px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s; box-shadow: 0 4px 15px rgba(76, 110, 245, 0.3);',
        'minimal' => 'background: white; color: #4c6ef5; padding: 15px 30px; border: 2px solid #4c6ef5; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s;',
    );
    
    $style = isset( $button_styles[ $atts['style'] ] ) ? $button_styles[ $atts['style'] ] : $button_styles['gradient'];
    
    // WooCommerce add-to-cart URL
    $add_to_cart_url = wc_get_cart_url() . '?add-to-cart=' . $product_id;
    
    $output = '<a href="' . esc_url( $add_to_cart_url ) . '" ';
    $output .= 'class="woo-add-to-cart-btn" ';
    $output .= 'style="' . esc_attr( $style ) . '" ';
    $output .= 'onmouseover="this.style.transform=\'translateY(-2px)\';" ';
    $output .= 'onmouseout="this.style.transform=\'translateY(0)\';">';
    $output .= '🛒 ' . esc_html( $atts['button_text'] );
    $output .= '</a>';
    
    return $output;
}
add_shortcode( 'woo_add_to_cart', 'masterstudy_woo_add_to_cart_shortcode' );

/**
 * SHORTCODE 2: MasterStudy LMS Native Cart
 * Usage: [lms_add_to_cart course_id="123"]
 * Best for: MasterStudy native cart system
 */
function masterstudy_lms_add_to_cart_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'course_id' => 0,
        'button_text' => 'Enroll Now',
        'style' => 'gradient',
    ), $atts );
    
    $course_id = intval( $atts['course_id'] );
    
    // If no course_id provided, show error
    if ( empty( $course_id ) ) {
        return '<p style="color: red;">Error: Please specify course_id. Example: [lms_add_to_cart course_id="123"]</p>';
    }
    
    if ( get_post_type( $course_id ) !== 'stm-courses' ) {
        return '<p style="color: red;">Invalid course ID: ' . $course_id . '</p>';
    }
    
    // Check if enrolled
    $user_id = get_current_user_id();
    $is_enrolled = false;
    if ( $user_id && class_exists( 'STM_LMS_User' ) ) {
        $is_enrolled = \STM_LMS_User::has_course_access( $course_id, 0, $user_id );
    }
    
    if ( $is_enrolled ) {
        return '<a href="' . esc_url( get_permalink( $course_id ) ) . '" class="enrolled-btn" style="display: inline-block; padding: 15px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">✓ Access Course</a>';
    }
    
    // Get course info
    $is_free = empty( get_post_meta( $course_id, 'price', true ) );
    $guest_checkout = class_exists( 'STM_LMS_Options' ) ? STM_LMS_Options::get_option( 'guest_checkout', false ) : false;
    $is_logged = is_user_logged_in();
    
    // MasterStudy button attributes
    if ( $is_logged ) {
        $button_attributes = 'data-purchased-course="' . intval( $course_id ) . '"';
    } else {
        $button_attributes = $guest_checkout ? 'data-guest="' . intval( $course_id ) . '"' : 'data-authorization-modal="login"';
    }
    
    // Enqueue MasterStudy assets
    wp_enqueue_style( 'masterstudy-buy-button' );
    wp_enqueue_script( 'masterstudy-buy-button' );
    wp_localize_script(
        'masterstudy-buy-button',
        'ms_lms_cart_' . $course_id,
        array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'get_nonce' => wp_create_nonce( 'stm_lms_add_to_cart' ),
            'get_guest_nonce' => wp_create_nonce( 'stm_lms_add_to_cart_guest' ),
            'item_id' => $course_id,
        )
    );
    
    // Button styles
    $button_styles = array(
        'default' => 'background: #4c6ef5; color: white; padding: 15px 30px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s;',
        'gradient' => 'background: linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%); color: white; padding: 15px 30px; border-radius: 25px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s; box-shadow: 0 4px 15px rgba(76, 110, 245, 0.3);',
        'minimal' => 'background: white; color: #4c6ef5; padding: 15px 30px; border: 2px solid #4c6ef5; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s;',
    );
    
    $style = isset( $button_styles[ $atts['style'] ] ) ? $button_styles[ $atts['style'] ] : $button_styles['gradient'];
    
    $output = '<a href="#" ';
    $output .= 'class="masterstudy-buy-button__link lms-enroll-btn" ';
    $output .= $button_attributes . ' ';
    $output .= 'style="' . esc_attr( $style ) . '" ';
    $output .= 'onclick="event.preventDefault();" ';
    $output .= 'onmouseover="this.style.transform=\'translateY(-2px)\';" ';
    $output .= 'onmouseout="this.style.transform=\'translateY(0)\';">';
    $output .= '🎓 ' . esc_html( $atts['button_text'] );
    $output .= '</a>';
    
    return $output;
}
add_shortcode( 'lms_add_to_cart', 'masterstudy_lms_add_to_cart_shortcode' );

/**
 * SHORTCODE 3: Auto-detect (tries both)
 * Usage: [add_to_cart_course course_id="123"]
 * Automatically uses WooCommerce if available, otherwise LMS
 */
function masterstudy_auto_add_to_cart_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'course_id' => 0,
        'button_text' => 'Add to Cart',
        'style' => 'gradient',
    ), $atts );
    
    $course_id = intval( $atts['course_id'] );
    
    // If no course_id provided, show error
    if ( empty( $course_id ) ) {
        return '<p style="color: red;">Error: Please specify course_id. Example: [add_to_cart_course course_id="123"]</p>';
    }
    
    // Verify it's a course
    if ( get_post_type( $course_id ) !== 'stm-courses' ) {
        return '<p style="color: red;">Invalid course ID: ' . $course_id . '</p>';
    }
    
    // Try WooCommerce first
    $product_id = masterstudy_find_product_id( $course_id );
    
    if ( $product_id && class_exists( 'WooCommerce' ) ) {
        // Use WooCommerce shortcode
        return masterstudy_woo_add_to_cart_shortcode( $atts );
    } else {
        // Use LMS shortcode
        return masterstudy_lms_add_to_cart_shortcode( $atts );
    }
}
add_shortcode( 'add_to_cart_course', 'masterstudy_auto_add_to_cart_shortcode' );

/**
 * Handle direct add-to-cart via URL parameter for WooCommerce
 * URL: yoursite.com/?add_course_to_cart=123
 */
function masterstudy_handle_direct_cart_url() {
    if ( isset( $_GET['add_course_to_cart'] ) ) {
        $course_id = intval( $_GET['add_course_to_cart'] );
        
        // Verify it's a course
        if ( get_post_type( $course_id ) !== 'stm-courses' ) {
            return;
        }
        
        // Check if user is logged in (comment out these lines if you want to allow guest checkout)
        if ( ! is_user_logged_in() ) {
            $return_url = add_query_arg( 'add_course_to_cart', $course_id, home_url() );
            wp_redirect( wp_login_url( $return_url ) );
            exit;
        }
        
        // WooCommerce Integration for MasterStudy
        if ( class_exists( 'WooCommerce' ) ) {
            // Method 1: Try to find the WooCommerce product linked to this course
            global $wpdb;
            
            // Search for product with course meta
            $product_id = $wpdb->get_var( $wpdb->prepare(
                "SELECT post_id FROM {$wpdb->postmeta} 
                WHERE meta_key = '_course_id' 
                AND meta_value = %d 
                LIMIT 1",
                $course_id
            ) );
            
            // Method 2: Check if course has product_id meta
            if ( empty( $product_id ) ) {
                $product_id = get_post_meta( $course_id, 'product_id', true );
            }
            
            // Method 3: Check if course itself is the product (some setups)
            if ( empty( $product_id ) ) {
                $product = wc_get_product( $course_id );
                if ( $product ) {
                    $product_id = $course_id;
                }
            }
            
            // Method 4: Search by course title match
            if ( empty( $product_id ) ) {
                $course_title = get_the_title( $course_id );
                $product_id = $wpdb->get_var( $wpdb->prepare(
                    "SELECT ID FROM {$wpdb->posts} 
                    WHERE post_type = 'product' 
                    AND post_title = %s 
                    AND post_status = 'publish'
                    LIMIT 1",
                    $course_title
                ) );
            }
            
            // If we found a product, add it to cart
            if ( ! empty( $product_id ) ) {
                // Clear any existing cart items (optional - remove if you want to keep other items)
                // WC()->cart->empty_cart();
                
                // Add to cart
                $added = WC()->cart->add_to_cart( $product_id, 1 );
                
                if ( $added ) {
                    // Successfully added - redirect to cart
                    wp_redirect( wc_get_cart_url() );
                    exit;
                }
            }
            
            // If we couldn't find/add product, try MasterStudy's native cart
            if ( class_exists( 'STM_LMS_Cart' ) ) {
                STM_LMS_Cart::add_to_cart( $course_id );
                
                // Try to get MasterStudy cart page
                if ( class_exists( 'STM_LMS_Options' ) ) {
                    $cart_page_id = STM_LMS_Options::get_option( 'cart_page', false );
                    if ( $cart_page_id ) {
                        wp_redirect( get_permalink( $cart_page_id ) );
                        exit;
                    }
                }
            }
            
            // Last resort: redirect to course page with message
            wp_redirect( add_query_arg( 'add_to_cart_failed', '1', get_permalink( $course_id ) ) );
            exit;
        }
        
        // If WooCommerce not available, redirect to course page
        wp_redirect( get_permalink( $course_id ) );
        exit;
    }
}
add_action( 'template_redirect', 'masterstudy_handle_direct_cart_url' );

/**
 * Generate direct add-to-cart URL for a course
 * Usage in PHP: echo masterstudy_get_add_to_cart_url( 123 );
 */
function masterstudy_get_add_to_cart_url( $course_id ) {
    return add_query_arg( 'add_course_to_cart', intval( $course_id ), home_url() );
}

/**
 * Shortcode to output direct cart URL
 * Usage: [cart_url course_id="123"]
 */
function masterstudy_cart_url_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'course_id' => get_the_ID(),
    ), $atts );
    
    return masterstudy_get_add_to_cart_url( intval( $atts['course_id'] ) );
}
add_shortcode( 'cart_url', 'masterstudy_cart_url_shortcode' );

/**
 * Debug function - Add ?debug_cart=1 to URL to see what's happening
 * Remove this after fixing the issue
 */
function masterstudy_debug_cart_info() {
    if ( isset( $_GET['debug_cart'] ) && current_user_can( 'manage_options' ) ) {
        $course_id = isset( $_GET['course_id'] ) ? intval( $_GET['course_id'] ) : 0;
        
        if ( $course_id ) {
            echo '<div style="background: #000; color: #0f0; padding: 20px; position: fixed; top: 50px; right: 10px; z-index: 99999; max-width: 400px; font-family: monospace; font-size: 12px; overflow: auto; max-height: 80vh;">';
            echo '<strong>Course Cart Debug Info:</strong><br><br>';
            echo 'Course ID: ' . $course_id . '<br>';
            echo 'Course Type: ' . get_post_type( $course_id ) . '<br>';
            echo 'Course Title: ' . get_the_title( $course_id ) . '<br><br>';
            
            // Check product_id meta
            $product_id_meta = get_post_meta( $course_id, 'product_id', true );
            echo 'product_id meta: ' . ( $product_id_meta ? $product_id_meta : 'NOT FOUND' ) . '<br><br>';
            
            // Check for linked product
            global $wpdb;
            $linked_product = $wpdb->get_var( $wpdb->prepare(
                "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_course_id' AND meta_value = %d LIMIT 1",
                $course_id
            ) );
            echo 'Linked Product (via _course_id): ' . ( $linked_product ? $linked_product : 'NOT FOUND' ) . '<br><br>';
            
            // Check if course is product
            $is_product = wc_get_product( $course_id );
            echo 'Course is WC Product: ' . ( $is_product ? 'YES' : 'NO' ) . '<br><br>';
            
            // Search by title
            $course_title = get_the_title( $course_id );
            $product_by_title = $wpdb->get_var( $wpdb->prepare(
                "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'product' AND post_title = %s AND post_status = 'publish' LIMIT 1",
                $course_title
            ) );
            echo 'Product by Title Match: ' . ( $product_by_title ? $product_by_title : 'NOT FOUND' ) . '<br><br>';
            
            // Show all course meta
            echo '<strong>All Course Meta:</strong><br>';
            $all_meta = get_post_meta( $course_id );
            foreach ( $all_meta as $key => $value ) {
                if ( strpos( $key, 'product' ) !== false || strpos( $key, 'price' ) !== false ) {
                    echo $key . ': ' . print_r( $value, true ) . '<br>';
                }
            }
            
            echo '</div>';
        }
    }
}
add_action( 'wp_footer', 'masterstudy_debug_cart_info' );












/**
 * Send MasterStudy Course data to Razorpay Dashboard
 * FIXED VERSION - Data persists to Thank You page
 */

// Step 1: Capture data during checkout
add_action('woocommerce_checkout_create_order', 'send_course_data_to_razorpay', 10, 2);
function send_course_data_to_razorpay($order, $data) {
    
    $course_names = array();
    $course_ids = array();
    $debug_info = array();
    
    // Get cart items
    foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
        $product_id = $cart_item['product_id'];
        $product_name = $cart_item['data']->get_name();
        
        // Find linked MasterStudy course
        $course_id = get_post_meta($product_id, '_course_id', true);
        
        // Check if product itself is a course
        if (!$course_id && get_post_type($product_id) === 'stm-courses') {
            $course_id = $product_id;
        }
        
        if ($course_id) {
            $course_title = get_the_title($course_id);
            $course_names[] = $course_title;
            $course_ids[] = $course_id;
            
            $debug_info[] = array(
                'product_id' => $product_id,
                'product_name' => $product_name,
                'course_id' => $course_id,
                'course_title' => $course_title,
                'status' => 'FOUND'
            );
        } else {
            $course_names[] = $product_name;
            $debug_info[] = array(
                'product_id' => $product_id,
                'product_name' => $product_name,
                'course_id' => 'NOT FOUND',
                'course_title' => 'NOT FOUND',
                'status' => 'FAILED'
            );
        }
    }
    
    $final_course_names = implode(', ', $course_names);
    $final_course_ids = implode(', ', $course_ids);
    
    // Store as order meta (THIS IS KEY - saves to database)
    $order->update_meta_data('_razorpay_course_names', $final_course_names);
    $order->update_meta_data('_razorpay_course_ids', $final_course_ids);
    $order->update_meta_data('_razorpay_debug_info', json_encode($debug_info));
    $order->update_meta_data('_razorpay_debug_timestamp', current_time('mysql'));
}

/**
 * Display floating debug console on ALL pages
 * Shows REAL-TIME cart data + stored order data on Thank You page
 * 
 * COMMENTED OUT - Uncomment to enable floating debug console
 */
/*
add_action('wp_footer', 'display_razorpay_floating_debug');
function display_razorpay_floating_debug() {
    
    $cart_data = array();
    $order_data = array();
    $data_source = '';
    
    // Check if we're on Thank You page
    if (is_wc_endpoint_url('order-received')) {
        global $wp;
        $order_id = absint($wp->query_vars['order-received']);
        
        if ($order_id) {
            $order = wc_get_order($order_id);
            
            // Get data from ORDER (not cart)
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                $product_name = $item->get_name();
                $course_id = get_post_meta($product_id, '_course_id', true);
                
                if (!$course_id && get_post_type($product_id) === 'stm-courses') {
                    $course_id = $product_id;
                }
                
                $cart_data[] = array(
                    'product_id' => $product_id,
                    'product_name' => $product_name,
                    'course_id' => $course_id ? $course_id : 'NOT FOUND',
                    'course_title' => $course_id ? get_the_title($course_id) : 'NOT FOUND'
                );
            }
            
            // Get stored meta
            $order_data = array(
                'order_id' => $order_id,
                'course_names' => $order->get_meta('_razorpay_course_names'),
                'course_ids' => $order->get_meta('_razorpay_course_ids'),
                'debug_info' => $order->get_meta('_razorpay_debug_info'),
                'timestamp' => $order->get_meta('_razorpay_debug_timestamp')
            );
            
            $data_source = 'ORDER DATA (Thank You Page)';
        }
    } else {
        // On other pages, get from cart
        if (class_exists('WooCommerce') && WC()->cart) {
            foreach (WC()->cart->get_cart() as $cart_item) {
                $product_id = $cart_item['product_id'];
                $product_name = $cart_item['data']->get_name();
                $course_id = get_post_meta($product_id, '_course_id', true);
                
                if (!$course_id && get_post_type($product_id) === 'stm-courses') {
                    $course_id = $product_id;
                }
                
                $cart_data[] = array(
                    'product_id' => $product_id,
                    'product_name' => $product_name,
                    'course_id' => $course_id ? $course_id : 'NOT FOUND',
                    'course_title' => $course_id ? get_the_title($course_id) : 'NOT FOUND'
                );
            }
            $data_source = 'CART DATA (Live)';
        }
    }
    
    ?>
    <div id="razorpay-debug-console" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 500px;
        max-height: 650px;
        background: #1a1a1a;
        border: 3px solid #00ff00;
        border-radius: 10px;
        padding: 20px;
        z-index: 999999;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #00ff00;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,255,0,0.3);
    ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #00ff00; padding-bottom: 10px;">
            <strong style="color: #ffff00; font-size: 14px;">🔍 RAZORPAY DEBUG</strong>
            <button onclick="document.getElementById('razorpay-debug-console').style.display='none'" style="
                background: #ff0000;
                color: #fff;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px;
                font-weight: bold;
            ">✕</button>
        </div>
        
        <div style="background: #000; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <strong style="color: #00ffff;">📍 DATA SOURCE:</strong>
            <div style="color: #fff; margin-top: 5px; font-weight: bold;">
                <?php echo $data_source ? $data_source : 'NO DATA'; ?>
            </div>
            <div style="color: #ffff00; margin-top: 5px; font-size: 11px;">
                <?php echo is_checkout() ? '🛒 CHECKOUT PAGE' : (is_cart() ? '🛒 CART PAGE' : (is_wc_endpoint_url('order-received') ? '✅ THANK YOU PAGE' : '📄 ' . get_the_title())); ?>
            </div>
        </div>
        
        <?php if (!empty($cart_data)): ?>
        <div style="background: #000; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <strong style="color: #00ffff;">
                <?php echo is_wc_endpoint_url('order-received') ? '📦 ORDER ITEMS:' : '🛒 CURRENT CART:'; ?>
            </strong>
            <?php foreach ($cart_data as $index => $item): ?>
                <div style="background: #1a1a1a; padding: 10px; margin-top: 10px; border-left: 3px solid <?php echo $item['course_id'] !== 'NOT FOUND' ? '#00ff00' : '#ff0000'; ?>;">
                    <div style="color: #ffff00; font-weight: bold;">Item #<?php echo ($index + 1); ?></div>
                    <div style="color: #fff; margin-top: 5px; font-size: 11px;">
                        <strong style="color: #00ff00;">Product ID:</strong> <?php echo $item['product_id']; ?><br>
                        <strong style="color: #00ff00;">Product Name:</strong> <?php echo $item['product_name']; ?><br>
                        <strong style="color: #00ff00;">Course ID:</strong> 
                        <span style="color: <?php echo $item['course_id'] !== 'NOT FOUND' ? '#0f0' : '#f00'; ?>; font-weight: bold;">
                            <?php echo $item['course_id']; ?>
                            <?php echo $item['course_id'] !== 'NOT FOUND' ? ' ✓' : ' ✗'; ?>
                        </span><br>
                        <strong style="color: #00ff00;">Course Title:</strong> 
                        <span style="color: <?php echo $item['course_title'] !== 'NOT FOUND' ? '#fff' : '#f00'; ?>;">
                            <?php echo $item['course_title']; ?>
                        </span>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
        <?php if (!empty($order_data) && !empty($order_data['course_names'])): ?>
        <div style="background: #003300; padding: 15px; border-radius: 5px; margin-bottom: 15px; border: 2px solid #00ff00;">
            <strong style="color: #ffff00;">🚀 SAVED TO RAZORPAY:</strong>
            <div style="margin-top: 10px; background: #000; padding: 10px; border-radius: 5px;">
                <div style="color: #00ff00; margin-bottom: 5px;"><strong>Order ID:</strong></div>
                <div style="color: #fff; font-size: 14px; font-weight: bold; margin-bottom: 10px;">
                    <?php echo $order_data['order_id']; ?>
                </div>
                
                <div style="color: #00ff00; margin-bottom: 5px;"><strong>Course Names:</strong></div>
                <div style="color: #fff; font-size: 13px; margin-bottom: 10px; word-break: break-word;">
                    <?php echo $order_data['course_names']; ?>
                </div>
                
                <div style="color: #00ff00; margin-bottom: 5px;"><strong>Course IDs:</strong></div>
                <div style="color: #fff; font-size: 13px; margin-bottom: 10px;">
                    <?php echo $order_data['course_ids']; ?>
                </div>
                
                <div style="color: #00ff00; margin-bottom: 5px;"><strong>Timestamp:</strong></div>
                <div style="color: #ffff00; font-size: 11px;">
                    <?php echo $order_data['timestamp']; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <?php if (empty($cart_data) && empty($order_data['course_names'])): ?>
        <div style="background: #000; padding: 15px; border-radius: 5px; margin-bottom: 15px; text-align: center;">
            <span style="color: #ff6b00;">⚠️ No data available</span>
        </div>
        <?php endif; ?>
        
        <div style="background: #000; padding: 15px; border-radius: 5px; font-size: 11px;">
            <strong style="color: #00ffff;">ℹ️ INSTRUCTIONS:</strong>
            <ol style="color: #fff; margin: 10px 0 0 0; padding-left: 20px; line-height: 1.6;">
                <li>Add course to cart</li>
                <li>Check if Course ID shows ✓</li>
                <li>Complete checkout</li>
                <li>Check this console on Thank You page</li>
                <li>Data should persist after payment</li>
            </ol>
        </div>
        
        <div style="text-align: center; margin-top: 15px; padding: 10px; background: #ff6b00; color: #000; border-radius: 5px; font-weight: bold; font-size: 11px;">
            ⚠️ DEBUG MODE - TESTING ONLY
        </div>
    </div>
    
    <script>
        // Console logging
        console.log('%c🔍 RAZORPAY DEBUG', 'background: #000; color: #0f0; font-size: 16px; font-weight: bold; padding: 10px;');
        console.log('Data Source:', '<?php echo $data_source; ?>');
        
        <?php if (!empty($cart_data)): ?>
        console.log('%cProduct/Course Data:', 'background: #000; color: #0ff; font-size: 14px; padding: 5px;');
        console.table(<?php echo json_encode($cart_data); ?>);
        <?php endif; ?>
        
        <?php if (!empty($order_data) && !empty($order_data['course_names'])): ?>
        console.log('%cStored Order Data:', 'background: #000; color: #ff0; font-size: 14px; padding: 5px;');
        console.table({
            'Order ID': '<?php echo $order_data['order_id']; ?>',
            'Course Names': '<?php echo addslashes($order_data['course_names']); ?>',
            'Course IDs': '<?php echo addslashes($order_data['course_ids']); ?>',
            'Timestamp': '<?php echo $order_data['timestamp']; ?>'
        });
        <?php endif; ?>
        
        console.log('%c═══════════════════════════', 'color: #0f0; font-size: 14px;');
    </script>
    <?php
}
*/

/**
 * Redirect WooCommerce Thank You page to Enrolled Courses after delay
 */

add_action( 'wp_footer', 'wc_thankyou_dynamic_redirect_after_delay' );
function wc_thankyou_dynamic_redirect_after_delay() {

    // Only on WooCommerce order received (thank you) page
    if ( ! is_wc_endpoint_url( 'order-received' ) ) {
        return;
    }

    // Dynamic redirect URL (works on staging / production)
    $redirect_url = home_url( '/user-account/enrolled-courses/' );
    ?>
    <script type="text/javascript">
        setTimeout(function() {
            window.location.href = "<?php echo esc_url( $redirect_url ); ?>";
        }, 4000); // 4 seconds
    </script>
    <?php
}

/**
 * Optional message on Thank You page
 */
add_action( 'woocommerce_thankyou', function () {
    echo '<p style="margin-top:20px; font-size:16px;">
        You’ll be redirected to your enrolled programe in a moment…
    </p>';
}, 5 );



/**
 * Enhanced Thank You page - Large display version
 */
add_action('woocommerce_thankyou', 'display_razorpay_thankyou_debug', 5, 1);
function display_razorpay_thankyou_debug($order_id) {
    
    $order = wc_get_order($order_id);
    
    // Get stored meta data
    $course_names = $order->get_meta('_razorpay_course_names');
    $course_ids = $order->get_meta('_razorpay_course_ids');
    $debug_info = $order->get_meta('_razorpay_debug_info');
    $timestamp = $order->get_meta('_razorpay_debug_timestamp');
    $payment_method = $order->get_payment_method();
    
    $debug_array = $debug_info ? json_decode($debug_info, true) : array();
    
    ?>
    <div style="
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        border: 4px solid <?php echo $course_names ? '#00ff00' : '#ff0000'; ?>;
        border-radius: 15px;
        padding: 30px;
        margin: 30px 0;
        box-shadow: 0 10px 40px rgba(0,255,0,0.3);
    ">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="
                color: <?php echo $course_names ? '#00ff00' : '#ff0000'; ?>;
                font-family: 'Courier New', monospace;
                font-size: 28px;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 3px;
                text-shadow: 0 0 10px <?php echo $course_names ? '#00ff00' : '#ff0000'; ?>;
            ">
                <?php echo $course_names ? '✓ DATA CAPTURED SUCCESSFULLY' : '✗ WARNING: NO DATA FOUND'; ?>
            </h1>
            <p style="color: #ffff00; margin-top: 10px; font-family: 'Courier New', monospace;">
                <?php echo $timestamp ? 'Captured at: ' . $timestamp : 'No timestamp recorded'; ?>
            </p>
        </div>
        
        <!-- ORDER INFO -->
        <div style="background: #000; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 5px solid #00ff00;">
            <h2 style="color: #00ffff; font-family: 'Courier New', monospace; margin-top: 0; font-size: 18px;">
                📦 ORDER INFORMATION
            </h2>
            <table style="width: 100%; font-family: 'Courier New', monospace; font-size: 14px;">
                <tr>
                    <td style="padding: 8px 0; color: #00ff00; width: 200px;"><strong>Order ID:</strong></td>
                    <td style="padding: 8px 0; color: #fff; font-weight: bold; font-size: 16px;"><?php echo $order_id; ?></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #00ff00;"><strong>Order Number:</strong></td>
                    <td style="padding: 8px 0; color: #fff; font-weight: bold; font-size: 16px;">#<?php echo $order->get_order_number(); ?></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #00ff00;"><strong>Payment Gateway:</strong></td>
                    <td style="padding: 8px 0; color: #fff;"><?php echo strtoupper($payment_method); ?></td>
                </tr>
            </table>
        </div>
        
        <!-- RAZORPAY DATA -->
        <div style="background: <?php echo $course_names ? '#003300' : '#330000'; ?>; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 3px solid <?php echo $course_names ? '#00ff00' : '#ff0000'; ?>;">
            <h2 style="color: <?php echo $course_names ? '#00ff00' : '#ff0000'; ?>; font-family: 'Courier New', monospace; margin-top: 0; font-size: 20px; text-align: center;">
                <?php echo $course_names ? '🚀 DATA SENT TO RAZORPAY' : '⚠️ NO DATA TO SEND'; ?>
            </h2>
            
            <div style="background: #000; padding: 20px; border-radius: 5px; margin-top: 15px;">
                <div style="color: #00ff00; margin-bottom: 10px; font-size: 16px;"><strong>📚 Course Names:</strong></div>
                <div style="
                    background: #1a1a1a;
                    padding: 15px;
                    border-radius: 5px;
                    color: <?php echo $course_names ? '#fff' : '#ff0000'; ?>;
                    font-size: 18px;
                    font-weight: bold;
                    border: 2px solid <?php echo $course_names ? '#00ff00' : '#ff0000'; ?>;
                    word-break: break-word;
                ">
                    <?php if ($course_names): ?>
                        ✓ <?php echo $course_names; ?>
                    <?php else: ?>
                        ✗ NO COURSE DATA CAPTURED
                    <?php endif; ?>
                </div>
                
                <div style="color: #00ff00; margin: 15px 0 10px 0; font-size: 16px;"><strong>🔢 Course IDs:</strong></div>
                <div style="
                    background: #1a1a1a;
                    padding: 15px;
                    border-radius: 5px;
                    color: <?php echo $course_ids ? '#fff' : '#ff0000'; ?>;
                    font-size: 18px;
                    font-weight: bold;
                    border: 2px solid <?php echo $course_ids ? '#00ff00' : '#ff0000'; ?>;
                ">
                    <?php if ($course_ids): ?>
                        ✓ <?php echo $course_ids; ?>
                    <?php else: ?>
                        ✗ NO COURSE IDS CAPTURED
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <?php if (!$course_names): ?>
        <div style="background: #ff0000; padding: 20px; border-radius: 10px; margin-bottom: 20px; color: #fff; text-align: center;">
            <h3 style="margin: 0 0 10px 0;">⚠️ TROUBLESHOOTING NEEDED</h3>
            <p style="margin: 0;">The course data was not saved. Please check:</p>
            <ul style="text-align: left; margin: 10px 0 0 0; padding-left: 40px;">
                <li>Was the course showing in the floating debug during checkout?</li>
                <li>Check WooCommerce → Orders → #<?php echo $order->get_order_number(); ?> → Custom Fields</li>
                <li>Look for _razorpay_course_names field</li>
            </ul>
        </div>
        <?php endif; ?>
        
        <div style="text-align: center; margin-top: 20px; padding: 15px; background: #ff6b00; color: #000; border-radius: 10px; font-family: 'Courier New', monospace; font-weight: bold;">
            ⚠️ DEBUG MODE - REMOVE AFTER TESTING
        </div>
    </div>
    <?php
}

