<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $ms_lms_loaded_textdomain_path;

$translations_path  = ! empty( $ms_lms_loaded_textdomain_path ) ? $ms_lms_loaded_textdomain_path : MS_LMS_PATH . '/languages';
$additional_styles  = apply_filters( 'ms_lms_course_builder_additional_styles', array() );
$additional_scripts = apply_filters( 'ms_lms_course_builder_additional_scripts', array() );
$wp_referer         = wp_get_referer();

wp_register_style( 'ms-lms-course-builder', apply_filters( 'ms_lms_course_builder_css', MS_LMS_URL . 'assets/course-builder/css/main.css' ), array(), MS_LMS_VERSION );
wp_register_script( 'ms-lms-course-builder-vendors', apply_filters( 'ms_lms_course_builder_vendors_js', MS_LMS_URL . 'assets/course-builder/js/vendors.js' ), array(), MS_LMS_VERSION, true );
wp_register_script( 'ms-lms-course-builder', apply_filters( 'ms_lms_course_builder_js', MS_LMS_URL . 'assets/course-builder/js/main.js' ), array(), MS_LMS_VERSION, true );
wp_register_script( 'ms-lms-course-builder-tinymce', MS_LMS_URL . '/assets/course-builder/tinymce/hugerte.min.js', array(), MS_LMS_VERSION, true );
wp_register_script( 'ms-lms-course-builder-translations', apply_filters( 'ms_lms_course_builder_translations_js', MS_LMS_URL . 'assets/course-builder/js/i18n-translations.js' ), array(), MS_LMS_VERSION, true );

wp_set_script_translations( 'ms-lms-course-builder-translations', 'masterstudy-lms-learning-management-system', $translations_path );

$scripts = wp_scripts();
$styles  = wp_styles();

$load_scripts = array(
	'wp-polyfill-inert',
	'regenerator-runtime',
	'wp-polyfill',
	'wp-hooks',
	'wp-i18n',
	'utils',
);

do_action( 'stm_lms_template_main' );
?>
<!doctype html>
<html lang="<?php echo esc_attr( get_locale() ); ?>" <?php echo is_rtl() ? ' dir="rtl"' : ''; ?>>
<head>
	<title><?php esc_html_e( 'Course Builder', 'masterstudy-lms-learning-management-system' ); ?></title>
	<link rel="shortcut icon" type="image/x-icon" href="<?php echo esc_url( ms_plugin_favicon_url() ); ?>" />
	<link href="<?php echo esc_url( site_url( $styles->registered['dashicons']->src ) ); // phpcs:ignore ?>" rel="stylesheet">
	<link href="<?php echo esc_url( site_url( $styles->registered['editor-buttons']->src ) ); // phpcs:ignore ?>" rel="stylesheet">
	<link href="<?php echo esc_url( $styles->registered['ms-lms-course-builder']->src ); // phpcs:ignore ?>" rel="stylesheet">
	<?php
	if ( ! empty( $additional_styles ) ) {
		foreach ( $additional_styles as $style_url ) {
			?>
			<link href="<?php echo esc_url( $style_url ); // phpcs:ignore ?>" rel="stylesheet">
			<?php
		}
	}
	?>
</head>
<body>
<div id="ms_plugin_root"></div>
<?php
foreach ( $load_scripts as $handle ) {
	$handle_src = $scripts->registered[ $handle ]->src;
	$src_url    = filter_var( $handle_src, FILTER_VALIDATE_URL ) ? $handle_src : site_url( $handle_src );
	?>
	<script src="<?php echo esc_url( $src_url ); // phpcs:ignore ?>"></script>
<?php } ?>
<script>
	window.lmsApiSettings = {
		lmsUrl: '<?php echo esc_url_raw( rest_url( 'masterstudy-lms/v2' ) ); ?>',
		wpUrl: '<?php echo esc_url_raw( rest_url( 'wp/v2' ) ); ?>',
		nonce: '<?php echo esc_html( wp_create_nonce( 'wp_rest' ) ); ?>',
	};
	<?php if ( function_exists( 'pll_current_language' ) ) { ?>
	window.lmsApiSettings.lang = '<?php echo esc_js( pll_current_language() ); ?>';
	<?php } ?>

	<?php if ( ! empty( $wp_referer ) ) : ?>
	window.lmsApiSettings.prevUrl = '<?php echo esc_url_raw( $wp_referer ); ?>';
	<?php endif; ?>
</script>
<?php
$scripts->print_translations( 'ms-lms-course-builder-translations' );

if ( ! class_exists( '\_WP_Editors', false ) ) {
	require ABSPATH . WPINC . '/class-wp-editor.php';
}
?>
<script src="<?php echo esc_url( $scripts->registered['ms-lms-course-builder-tinymce']->src ); // phpcs:ignore ?>"></script>
<script src="<?php echo esc_url( $scripts->registered['ms-lms-course-builder']->src ); // phpcs:ignore ?>"></script>
<script src="<?php echo esc_url( $scripts->registered['ms-lms-course-builder-vendors']->src ); // phpcs:ignore ?>"></script>
<script src="<?php echo esc_url( $scripts->registered['ms-lms-course-builder-translations']->src ); // phpcs:ignore ?>"></script>
<?php
if ( ! empty( $additional_scripts ) ) {
	foreach ( $additional_scripts as $script_url ) {
		?>
		<script src="<?php echo esc_url( $script_url ); // phpcs:ignore ?>"></script>
		<?php
	}
}
?>
</body>
</html>
