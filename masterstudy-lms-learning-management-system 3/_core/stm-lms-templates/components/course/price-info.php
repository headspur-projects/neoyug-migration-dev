<?php
/**
 * @var object $course
 */

if ( ! empty( $course->price_info ) ) { ?>
	<div class="masterstudy-single-course-price-info">
		<?php echo esc_html( $course->price_info ); ?>
	</div>
	<?php
}
