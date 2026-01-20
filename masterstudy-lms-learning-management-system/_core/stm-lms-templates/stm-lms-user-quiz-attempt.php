<?php
/**
 * @var int $quiz_id
 * @var int $course_id
 * @var int $attempt_id
 * */

use MasterStudy\Lms\Repositories\EnrolledQuizzesRepository;

STM_LMS_Templates::show_lms_template( 'header' );
do_action( 'stm_lms_template_main' );

stm_lms_register_style( 'quiz-attempts' );

$quiz_data   = ( new EnrolledQuizzesRepository() )->get_attempt( compact( 'quiz_id', 'course_id', 'attempt_id' ) );
$is_answered = ! empty( $quiz_data['last_answers'] );
do_action( 'masterstudy_lms_course_player_register_assets' );
?>
<div class="stm-lms-wrapper user-account-page">
	<div class="container">
		<?php do_action( 'stm_lms_admin_after_wrapper_start', STM_LMS_User::get_current_user() ); ?>
		<div class="masterstudy-quiz-container">
			<div class="masterstudy-quiz__top-bar">
				<?php
				STM_LMS_Templates::show_lms_template(
					'components/button',
					array(
						'title'         => '',
						'link'          => ms_plugin_user_account_url( 'enrolled-quiz-attempts/' . $course_id . '/' . $quiz_id ),
						'style'         => 'secondary',
						'size'          => 'sm',
						'icon_position' => 'left',
						'icon_name'     => 'arrow-left',
					)
				);
				?>
				<div class="masterstudy-quiz-details">
					<?php echo esc_html( get_the_title( $quiz_id ) ); ?>
					<span>
						<?php printf( /* translators: %s Course name */ esc_html__( 'Course: %s', 'masterstudy-lms-learning-management-system' ), esc_html( get_the_title( $course_id ) ) ); ?>
					</span>
				</div>
			</div>

			<span class="masterstudy-student-progress-list-separator">
				<span class="masterstudy-student-progress-list-separator__short"></span>
				<span class="masterstudy-student-progress-list-separator__long"></span>
			</span>

			<div class="masterstudy-student-progress-list__item-quiz<?php echo esc_attr( ! $is_answered ? ' masterstudy-student-progress-list__item_hidden' : '' ); ?>">
				<?php
				STM_LMS_Templates::show_lms_template(
					'course-player/content/quiz/main',
					array(
						'dark_mode'   => false,
						'post_id'     => $course_id,
						'data'        => $quiz_data,
						'item_id'     => $quiz_id,
						'lesson_type' => $quiz_data['lesson_type'],
					)
				);
				?>
			</div>
		</div>

	</div>
</div>
<?php
	STM_LMS_Templates::show_lms_template( 'footer' );
