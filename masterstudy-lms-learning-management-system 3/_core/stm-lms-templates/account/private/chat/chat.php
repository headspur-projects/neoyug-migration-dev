<?php
/**
 * @var $current_user
 */

?>

<div class="stm_lms_chat_companion">
	<div class="stm_lms_chat_companion__image"></div>
	<a href="#" class="stm_lms_chat_companion__title"></a>
	<i class="stmlms-sync stm_lms_chat_companion__sync-btn"></i>
</div>

<div class="stm_lms_chat_messages" id="stm_lms_chat_messages"></div>

<div class="stm_lms_chat_messages__send">
	<h4><?php esc_html_e( 'Reply to', 'masterstudy-lms-learning-management-system' ); ?>
		<a href="#" class="stm_lms_chat_messages__send-link"></a>
	</h4>
	<textarea class="stm_lms_chat_messages__send-message" placeholder="<?php esc_html_e( 'Your message', 'masterstudy-lms-learning-management-system' ); ?>"></textarea>
	<a href="#" class="btn btn-default stm_lms_chat_messages__send-btn">
		<span><?php esc_html_e( 'Send message', 'masterstudy-lms-learning-management-system' ); ?></span>
	</a>
	<p class="stm-lms-message error stm_lms_chat_messages__send-response"></p>
</div>
