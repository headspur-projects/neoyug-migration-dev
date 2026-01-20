<?php
/**
 * @var $current_user
 */

$is_instructor = STM_LMS_Instructor::is_instructor();

wp_enqueue_style( 'masterstudy-select2' );
wp_enqueue_script( 'masterstudy-personal-info' );
stm_lms_register_style( 'edit_account' );
stm_lms_register_script( 'edit_account' );
stm_lms_register_style( 'user_info_top' );

if ( ! metadata_exists( 'user', $current_user['id'], 'disable_report_email_notifications' ) ) {
	$current_user['meta']['disable_report_email_notifications'] = true;
}

$data              = wp_json_encode( $current_user );
$personal_data_raw = get_user_meta( $current_user['id'], 'masterstudy_personal_data', true );

if ( ! is_array( $personal_data_raw ) ) {
	$personal_data_raw = array();
}

$personal_data = wp_json_encode( (object) $personal_data_raw );

wp_add_inline_script(
	'stm-lms-edit_account',
	"var stm_lms_edit_account_info = {$data};
	var stm_lms_personal_data = {$personal_data};"
);
?>


<div class="stm_lms_edit_account" id="stm_lms_edit_account">

	<div class="stm_lms_edit_socials stm_lms_edit_name">
		<div class="stm_lms_edit_socials_list">
			<?php
			if ( $is_instructor ) {
				STM_LMS_Templates::show_lms_template( 'account/private/edit_account/profile-cover' );
			}
			?>
			<?php STM_LMS_Templates::show_lms_template( 'account/private/edit_account/name' ); ?>

			<?php
			if ( $is_instructor ) {
				STM_LMS_Templates::show_lms_template( 'account/private/edit_account/position' );
				STM_LMS_Templates::show_lms_template( 'account/private/edit_account/bio' );
			}

			STM_LMS_Templates::show_lms_template( 'account/private/edit_account/display_name' );
			?>

			<?php STM_LMS_Templates::show_lms_template( 'account/private/edit_account/custom_fields' ); ?>
		</div>
	</div>
	<?php
	$email_settings    = get_option( 'stm_lms_email_manager_settings' );
	$student_digest    = $email_settings['stm_lms_reports_student_checked_enable'] ?? false;
	$instructor_digest = $email_settings['stm_lms_reports_instructor_checked_enable'] ?? false;
	$admin_digest      = $email_settings['stm_lms_reports_admin_checked_enable'] ?? true;

	if ( is_ms_lms_addon_enabled( 'email_manager' ) && STM_LMS_Helpers::is_pro_plus() ) {
		$current_user = \STM_LMS_User::get_current_user( null, true, true );

		if ( isset( $current_user['roles'] ) && is_array( $current_user['roles'] ) && ! empty( $current_user['roles'][0] ) ) {
			$user_role = $current_user['roles'][0] ?? '';

			if ( in_array( $user_role, array( 'administrator', 'stm_lms_instructor', 'subscriber' ), true ) ) {

				if (
					( 'administrator' === $user_role && $admin_digest ) ||
					( 'stm_lms_instructor' === $user_role && $instructor_digest ) ||
					( 'subscriber' === $user_role && $student_digest )
				) {
					STM_LMS_Templates::show_lms_template( 'account/private/edit_account/email_notifications' );
				}
			}
		}
	}
	if ( $is_instructor ) {
		STM_LMS_Templates::show_lms_template( 'account/private/edit_account/socials' );
	}
	STM_LMS_Templates::show_lms_template( 'account/private/edit_account/change_password' );
	?>

	<div class="row">
		<div class="col-md-12">
			<div class="row">
				<div class="col-md-6 col-sm-6">
					<button class="btn btn-default btn-save-account">
						<span><?php esc_html_e( 'Save changes', 'masterstudy-lms-learning-management-system' ); ?></span>
					</button>
				</div>
				<div class="col-md-6 col-sm-6">
					<div class="stm_lms_sidebar_logout_wrapper text-right xs-text-left">
						<?php STM_LMS_Templates::show_lms_template( 'account/private/parts/logout' ); ?>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="stm-lms-message masterstudy-edit-account-message-hidden">
			</div>
		</div>
	</div>
</div>
