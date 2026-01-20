<?php
/**
 * Plugin Name: MasterStudy Custom Course Player
 * Description: Override only the course-player.php layout of MasterStudy LMS with safe fallback.
 * Version: 1.1
 * Author: Your Name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

define( 'MASTERSTUDY_CUSTOM_LAYOUT_ENABLED', true );

/**
 * Override course-player.php template only on frontend course player
 */
function masterstudy_custom_layout_template_include( $template ) {

    if ( ! defined( 'MASTERSTUDY_CUSTOM_LAYOUT_ENABLED' ) || ! MASTERSTUDY_CUSTOM_LAYOUT_ENABLED ) {
        return $template;
    }

    // ✅ Skip admin and user-account pages
    if ( is_admin() || strpos( $_SERVER['REQUEST_URI'], 'user-account' ) !== false ) {
        return $template;
    }

    // ✅ Check if lesson_id exists (frontend course player case)
    $lesson_id = get_query_var( 'lesson_id' );

    if ( $lesson_id ) {
        $custom_template = plugin_dir_path( __FILE__ ) . 'templates/course-player.php';

        if ( file_exists( $custom_template ) ) {
            error_log("✅ Custom course player template loaded for lesson_id: $lesson_id");
            return $custom_template;
        } else {
            // 🔄 Fallback: load MasterStudy default course-player.php
            $default_template = WP_PLUGIN_DIR . '/masterstudy-lms-learning-management-system/templates/course-player.php';

            if ( file_exists( $default_template ) ) {
                error_log("⚠️ Custom template missing. Falling back to default MasterStudy template.");
                return $default_template;
            }
        }
    }

    return $template;
}
add_filter( 'template_include', 'masterstudy_custom_layout_template_include', 999 );

/**
 * Enqueue assets when on course player (custom or fallback)
 */
function masterstudy_custom_layout_enqueue_assets() {
    if ( is_admin() || strpos( $_SERVER['REQUEST_URI'], 'user-account' ) !== false ) {
        return;
    }

    if ( get_query_var( 'lesson_id' ) ) {
        wp_enqueue_style(
            'masterstudy-custom-layout-style',
            plugin_dir_url( __FILE__ ) . 'assets/css/custom-style.css',
            array(),
            '1.1.0'
        );

        wp_enqueue_script(
            'masterstudy-custom-layout-script',
            plugin_dir_url( __FILE__ ) . 'assets/js/custom-script.js',
            array( 'jquery' ),
            '1.1.0',
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'masterstudy_custom_layout_enqueue_assets' );