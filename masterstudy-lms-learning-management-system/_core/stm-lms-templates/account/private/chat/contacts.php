<?php
/**
 * @var $current_user
 */

$user_id = ( 'object' === gettype( $current_user ) ) ? $current_user->ID : $current_user['id'];

?>
<div class="stm_lms_chat__conversations">
	<?php esc_html_e( 'No messages yet.', 'masterstudy-lms-learning-management-system' ); ?>
</div>
