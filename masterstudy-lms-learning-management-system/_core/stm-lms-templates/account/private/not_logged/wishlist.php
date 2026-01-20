<?php $wishlist_title = ( is_user_logged_in() ) ? __( 'My Wishlist', 'masterstudy-lms-learning-management-system' ) : __( 'Wishlist', 'masterstudy-lms-learning-management-system' ); ?>
<h2><?php echo esc_html( $wishlist_title ); ?></h2>
<?php
if ( ! empty( $_COOKIE['stm_lms_wishlist'] ) ) {
	$wishlist = sanitize_text_field( wp_unslash( $_COOKIE['stm_lms_wishlist'] ) );
	$args     = array(
		'per_row'  => 4,
		'post__in' => explode( ',', $wishlist ),
	);
	STM_LMS_Templates::show_lms_template( 'courses/grid', array( 'args' => $args ) );
} else {
	?>
	<h4>
		<?php echo esc_html__( 'Wishlist will be available after', 'masterstudy-lms-learning-management-system' ); ?>
		<a href="<?php echo esc_url( add_query_arg( 'mode', 'register', STM_LMS_User::login_page_url() ) ); ?>">
			<?php echo esc_html__( 'registration', 'masterstudy-lms-learning-management-system' ); ?>
		</a>	
	</h4>
<?php } ?>
