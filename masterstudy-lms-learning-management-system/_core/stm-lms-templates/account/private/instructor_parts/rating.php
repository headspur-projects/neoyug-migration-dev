<?php

$rating         = STM_LMS_Instructor::my_rating( $current_user );
$course_reviews = STM_LMS_Options::get_option( 'course_tab_reviews', true );

if ( ! empty( $rating['total_marks'] ) && $course_reviews ) { ?>
	<div class="stm-lms-user_rating">
		<div class="star-rating star-rating__big">
			<span style="width: <?php echo floatval( $rating['percent'] ); ?>%;"></span>
		</div>
		<strong class="rating heading_font"><?php echo floatval( $rating['average'] ); ?></strong>
		<div class="stm-lms-user_rating__total">
			<?php echo esc_html( $rating['total_marks'] ); ?>
		</div>
	</div>
<?php } ?>
