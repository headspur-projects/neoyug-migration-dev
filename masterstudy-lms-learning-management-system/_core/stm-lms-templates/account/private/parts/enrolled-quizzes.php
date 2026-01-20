<?php
wp_enqueue_script( 'masterstudy-enrolled-quizzes' );
wp_enqueue_style( 'masterstudy-pagination' );
stm_lms_register_style( 'user-quizzes' );
?>

<div class="masterstudy-enrolled-quizzes">
	<div class="stm_lms_user_info_top">
		<h3><?php echo esc_html__( 'Enrolled Quizzes', 'masterstudy-lms-learning-management-system' ); ?></h3>
		<?php
		STM_LMS_Templates::show_lms_template(
			'components/search-input',
			array(
				'placeholder'     => __( 'Search course or quiz...', 'masterstudy-lms-learning-management-system' ),
				'classes_wrapper' => 'masterstudy-enrolled-quizzes-search',
				'classes_input'   => 'masterstudy-enrolled-quizzes-search__input',
			)
		);
		?>
	</div>
	<div class="masterstudy-enrolled-quizzes-container">
		<div class="ms_lms_loader_"></div>
		<template id="masterstudy-enrolled-quizzes-template">
			<div class="masterstudy-enrolled-quizzes__course">
				<div class="masterstudy-enrolled-quizzes__header">
					<div class="masterstudy-enrolled-quizzes-course__label">
						<?php echo esc_html__( 'Course:', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<div class="masterstudy-enrolled-quizzes-course__value">
						<a href="#" class="masterstudy-enrolled-quizzes-course__link"></a>
					</div>
				</div>
				<div class="masterstudy-enrolled-quizzes-items">
					<div class="masterstudy-enrolled-quizzes-item">
						<div class="masterstudy-enrolled-quizzes-item__name">
							<a href="#" class="masterstudy-enrolled-quizzes-item__name--link"></a>
						</div>
						<div class="masterstudy-enrolled-quizzes-item__attempts"></div>
						<div class="masterstudy-enrolled-quizzes-item__questions"></div>
						<div class="masterstudy-enrolled-quizzes-item__info">
							<div class="masterstudy-enrolled-quizzes-item__progress-wrapper">
								<div class="masterstudy-enrolled-quizzes-item__progress" data-quiz-progress>
									<span class="masterstudy-enrolled-quizzes-item__progress--bar">
										<span class="masterstudy-enrolled-quizzes-item__progress--filled"></span>
									</span>
									<span class="masterstudy-enrolled-quizzes-item__progress--status"></span>
								</div>
								<div class="masterstudy-enrolled-quizzes-item__status" data-quiz-status></div>
							</div>
							<a href="#" class="masterstudy-enrolled-quizzes-item__details">
								<?php echo esc_html__( 'Details', 'masterstudy-lms-learning-management-system' ); ?>
							</a>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template id="masterstudy-enrolled-quizzes-no-found-template">
			<div class="masterstudy-enrolled-quizzes-no-found__info">
				<div class="masterstudy-enrolled-quizzes-no-found__info-icon"><span class="stmlms-order"></span></div>
				<div class="masterstudy-enrolled-quizzes-no-found__info-title masterstudy-enrolled-quizzes-no-found__items">
					<?php echo esc_html__( 'No enrolled quizzes yet', 'masterstudy-lms-learning-management-system' ); ?>
				</div>
				<div class="masterstudy-enrolled-quizzes-no-found__info-title masterstudy-enrolled-quizzes-no-found__search">
					<?php echo esc_html__( 'No quizzes match your search', 'masterstudy-lms-learning-management-system' ); ?>
				</div>
				<div class="masterstudy-enrolled-quizzes-no-found__info-description">
					<?php echo esc_html__( 'All information about your enrolled quizzes will be displayed here', 'masterstudy-lms-learning-management-system' ); ?>
				</div>
			</div>
		</template>
	</div>

	<div class="masterstudy-enrolled-quizzes-navigation">
		<div class="masterstudy-enrolled-quizzes-navigation__pagination"></div>
		<div class="masterstudy-enrolled-quizzes-navigation__per-page">
			<?php
			STM_LMS_Templates::show_lms_template(
				'components/select',
				array(
					'select_id'    => 'enrolled-quizzes-per-page',
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
