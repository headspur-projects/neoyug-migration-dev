<?php
/**
 * @var int $quiz_id
 * @var int $course_id
 * */

use MasterStudy\Lms\Repositories\CoursePlayerRepository;

STM_LMS_Templates::show_lms_template( 'header' );
do_action( 'stm_lms_template_main' );

wp_enqueue_script( 'masterstudy-enrolled-quizzes' );
wp_enqueue_style( 'masterstudy-pagination' );
wp_localize_script(
	'masterstudy-enrolled-quizzes',
	'masterstudy_quiz_attempts',
	array(
		'quiz_id'   => $quiz_id,
		'course_id' => $course_id,
	)
);
stm_lms_register_style( 'quiz-attempts' );

$quiz_data = ( new CoursePlayerRepository() )->get_quiz_data( $quiz_id );
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
						'link'          => ms_plugin_user_account_url( 'enrolled-quizzes' ),
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

			<span class="masterstudy-quiz-attempts-separator">
				<span class="masterstudy-quiz-attempts-separator__short"></span>
				<span class="masterstudy-quiz-attempts-separator__long"></span>
			</span>

			<div class="masterstudy-quiz-attempts-container<?php echo $quiz_data['has_h5p_shortcode'] ? ' masterstudy-quiz-attempts-h5p-exists' : ''; ?>">
				<div class="masterstudy-quiz-attempts__header">
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__number">
						<?php echo esc_html__( '№', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__attempt">
						<?php echo esc_html__( 'Attempt:', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__questions">
						<?php echo esc_html__( 'Questions', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__correct">
						<?php echo esc_html__( 'Correct', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__incorrect">
						<?php echo esc_html__( 'Incorrect', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__grade">
						<?php echo esc_html__( 'Grade', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__info"></div>
					<div class="masterstudy-quiz-header__column masterstudy-quiz-header__details"></div>
				</div>
				<div class="masterstudy-quiz-attempts">
					<div class="ms_lms_loader_"></div>
					<template id="masterstudy-quiz-attempts-template">
						<div class="masterstudy-quiz-attempt">
							<div class="masterstudy-quiz-attempt__number"></div>
							<div class="masterstudy-quiz-attempt__date" data-header="<?php echo /* translators: %s attempt number */esc_attr__( 'Attempt %s', 'masterstudy-lms-learning-management-system' ); ?>">
								<span class="masterstudy-quiz-attempt__date--value"></span>
								<span class="masterstudy-quiz-attempt__date--time"></span>
							</div>
							<div class="masterstudy-quiz-attempt__questions" data-header="<?php echo esc_attr__( 'Questions:', 'masterstudy-lms-learning-management-system' ); ?>"></div>
							<div class="masterstudy-quiz-attempt__correct" data-header="<?php echo esc_attr__( 'Correct:', 'masterstudy-lms-learning-management-system' ); ?>"></div>
							<div class="masterstudy-quiz-attempt__incorrect" data-header="<?php echo esc_attr__( 'Incorrect:', 'masterstudy-lms-learning-management-system' ); ?>"></div>
							<div class="masterstudy-quiz-attempt__grade" data-header="<?php echo esc_attr__( 'Grade:', 'masterstudy-lms-learning-management-system' ); ?>"></div>
							<div class="masterstudy-quiz-attempt__info">
								<div class="masterstudy-quiz-attempt__progress-wrapper">
									<div class="masterstudy-quiz-attempt__progress" data-attempt-progress>
										<span class="masterstudy-quiz-attempt__progress--bar">
											<span class="masterstudy-quiz-attempt__progress--filled"></span>
										</span>
									</div>
									<div class="masterstudy-quiz-attempt__status" data-quiz-status></div>
								</div>
							</div>
							<a href="#" class="masterstudy-quiz-attempt__details">
								<?php echo esc_html__( 'Details', 'masterstudy-lms-learning-management-system' ); ?>
							</a>
						</div>
					</template>
					<template id="masterstudy-quiz-attempts-no-found-template">
						<div class="masterstudy-quiz-attempts-no-found__info">
							<div class="masterstudy-quiz-attempts-no-found__info-icon"><span class="stmlms-order"></span></div>
							<div class="masterstudy-quiz-attempts-no-found__info-title">
								<?php echo esc_html__( 'No enrolled quiz attempts yet', 'masterstudy-lms-learning-management-system' ); ?>
							</div>
							<div class="masterstudy-quiz-attempts-no-found__info-description">
								<?php echo esc_html__( 'All information about your enrolled quiz attempts will be displayed here', 'masterstudy-lms-learning-management-system' ); ?>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>

		<div class="masterstudy-quiz-attempts-navigation">
			<div class="masterstudy-quiz-attempts-navigation__pagination"></div>
			<div class="masterstudy-quiz-attempts-navigation__per-page">
				<?php
				STM_LMS_Templates::show_lms_template(
					'components/select',
					array(
						'select_id'    => 'quiz-attempts-per-page',
						'select_width' => '170px',
						'select_name'  => 'per_page',
						'placeholder'  => esc_html__( '10 per page', 'masterstudy-lms-learning-management-system' ),
						'default'      => 10,
						'is_queryable' => false,
						'options'      => array(
							'25'  => esc_html__( '25 per page', 'masterstudy-lms-learning-management-system' ),
							'50'  => esc_html__( '50 per page', 'masterstudy-lms-learning-management-system' ),
							'75'  => esc_html__( '75 per page', 'masterstudy-lms-learning-management-system' ),
							'100' => esc_html__( '100 per page', 'masterstudy-lms-learning-management-system' ),
						),
					)
				);
				?>
			</div>
		</div>
	</div>
</div>
<?php
	STM_LMS_Templates::show_lms_template( 'footer' );
