<?php
/**
 * @var $current_user
 */

if ( is_user_logged_in() ) :
	stm_lms_register_style( 'send_message' );
	stm_lms_register_script( 'send_message' );
	wp_localize_script(
		'stm-lms-send_message',
		'fast_message_data',
		array(
			'user_id'                 => intval( $current_user['id'] ),
			'unable_send_message_msg' => esc_html__( 'Unable to send message', 'masterstudy-lms-learning-management-system' ),
		)
	)
	?>

	<br/>

	<div class="stm-lms-user_message_btn public_messages" id="stm_lms_send_fast_message">
		<a href="#" class="btn btn-default stm-lms-user__open-form-btn"><?php esc_html_e( 'Send Message', 'masterstudy-lms-learning-management-system' ); ?></a>

		<div class="stm_lms_fast_message">
			<div class="stm_lms_fast_message_to">
				<?php
				printf(
					wp_kses_post(
						// translators: %s: User login.
						__( 'To: <span>%s</span>', 'masterstudy-lms-learning-management-system' )
					),
					wp_kses_post( $current_user['login'] )
				);
				?>
			</div>

			<textarea class="stm_lms_fast_message__input" placeholder="<?php esc_html_e( 'Message', 'masterstudy-lms-learning-management-system' ); ?>"></textarea>

			<div class="stm_lms_fast_message_btns">
				<a href="#" class="btn btn-default stm_lms_fast_message__send-btn">
					<span><?php esc_html_e( 'Send', 'masterstudy-lms-learning-management-system' ); ?></span>
				</a>
				<a href="#" class="btn btn-default btn-cancel stm_lms_fast_message__close-btn"><?php esc_html_e( 'Cancel', 'masterstudy-lms-learning-management-system' ); ?></a>
			</div>

			<div class="stm-lms-message stm_lms_fast_message__response-text hidden">
			</div>
		</div>
	</div>
<?php endif; ?>
