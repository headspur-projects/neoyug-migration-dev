<?php
/**
 * @var $current_user
 */

$user_id = ( 'object' === gettype( $current_user ) ) ? $current_user->ID : $current_user['id'];

stm_lms_register_style( 'chat' );
stm_lms_register_script( 'chat' );
wp_localize_script(
	'stm-lms-chat',
	'chat_data',
	array(
		'instructor_public' => STM_LMS_Options::get_option( 'instructor_public_profile', true ),
		'student_public'    => STM_LMS_Options::get_option( 'student_public_profile', true ),
		'user_id'           => $user_id,
	)
);
?>

<div id="stm_lms_chat">
	<div class="row">
		<div class="col-md-4">
			<?php STM_LMS_Templates::show_lms_template( 'account/private/chat/contacts', array( 'current_user' => $current_user ) ); ?>
		</div>
		<div class="col-md-8 stm_lms_chat__chat-container hidden">
			<?php STM_LMS_Templates::show_lms_template( 'account/private/chat/chat', array( 'current_user' => $current_user ) ); ?>
		</div>
	</div>
</div>
