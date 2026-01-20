<?php
if ( ! STM_LMS_Instructor::instructor_show_list_students() || ! STM_LMS_Instructor::is_instructor() ) {
	STM_LMS_User::js_redirect( STM_LMS_User::login_page_url() );
	die;
}

STM_LMS_Templates::show_lms_template( 'header' );
do_action( 'stm_lms_template_main' );
?>

<div class="stm-lms-wrapper user-account-page">
	<div class="container">
		<?php
			do_action( 'stm_lms_admin_after_wrapper_start', STM_LMS_User::get_current_user() );
			STM_LMS_Templates::show_lms_template( 'account/private/track-students/list' );
		?>
	</div>
</div>
<?php
STM_LMS_Templates::show_lms_template( 'footer' );
