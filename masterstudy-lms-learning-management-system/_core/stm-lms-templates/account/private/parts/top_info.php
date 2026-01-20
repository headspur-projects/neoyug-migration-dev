<?php
/**
 * @var $current_user
 * @var $title
 * @var $socials
 */

if ( empty( $current_user ) ) {
	$current_user = STM_LMS_User::get_current_user();
}

stm_lms_register_style( 'user_info_top' );

if ( empty( $title ) ) {
	$title = esc_html__( 'My profile', 'masterstudy-lms-learning-management-system' );
}

$settings_url     = ms_plugin_user_account_url( 'settings' );
$current_full_url = home_url( $_SERVER['REQUEST_URI'] );
$is_settings_page = wp_parse_url( $settings_url, PHP_URL_PATH ) === wp_parse_url( $current_full_url, PHP_URL_PATH );
$show_public      = STM_LMS_Options::get_option( 'student_public_profile', true ) || empty( STM_LMS_User::student_public_page_url( $current_user['id'] ) );
?>

<div class="stm_lms_user_info_top">
	<h3><?php echo esc_html( $title ); ?></h3>
	<?php
	do_action( 'stm_lms_user_info_top', $current_user );
	if ( $show_public && $is_settings_page ) {
		STM_LMS_Templates::show_lms_template(
			'components/public-page-block',
			array(
				'user_id' => $current_user['id'],
				'student' => true,
			)
		);
	}
	?>
</div>

<div class="multiseparator"></div>
