<?php
/**
 * @var object $course
 * @var array $course_preview
 * @var boolean $with_image
 * @var boolean $mode
 */

$with_image = isset( $with_image ) ? $with_image : false;
$mode       = $mode ?? '';
?>

<div class="masterstudy-single-course-description">
	
	<?php
	// 🧩 COURSE IMAGE / VIDEO DISPLAY
	if ( ! empty( $course->full_image ) && $with_image && ( empty( $course_preview['video_type'] ) || 'none' == $course_preview['video_type'] ) ) { ?>
		<img class="masterstudy-single-course-description__image"
			src="<?php echo esc_url( $course->full_image['url'] ); ?>"
			alt="<?php echo esc_html( $course->full_image['title'] ); ?>">
	<?php
	} elseif ( ! empty( $course_preview['video_type'] ) && $with_image || 'full_width' === $mode ) {
		STM_LMS_Templates::show_lms_template(
			'components/course/video',
			array(
				'course'    => (array) $course_preview ?? '',
				'course_id' => $course->id,
				'mode'      => true,
			)
		);
	}
	?>

	<!-- 🧩 Course Description Content -->
	<div class="masterstudy-single-course-description__content">
		<?php
		$post = get_post( $course->id );
		setup_postdata( $post );
		the_content();
		wp_reset_postdata();
		?>
	</div>

	<!-- 🧩 Course Resources (PDFs) -->
	<?php if ( ! empty( $course->attachments ) ) : ?>
		<div class="masterstudy-single-course-description__files">
			<div class="resources-section">
				<div class="resource-group active">
					
<span class="masterstudy-single-course-materials__title">Program materials</span>

					<div class="resource-list">
						<?php
						// DEBUG: check attachments
						if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
							error_log( 'MasterStudy PDF Section Loaded for Course ID: ' . $course->id );
							error_log( print_r( $course->attachments, true ) );
						}

						foreach ( $course->attachments as $file_id ) :
							$file = get_post( $file_id );
							if ( ! $file ) {
								if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
									error_log( "⚠️ Skipped invalid file ID: {$file_id}" );
								}
								continue;
							}

							// 🧩 FIXED URL HANDLING (inspired by ms_plugin_attachment_data)
							$file_url = wp_get_attachment_url( $file_id );

							// Try MasterStudy-compatible fallback fields
							if ( empty( $file_url ) ) {
								$file_url = get_post_meta( $file_id, 'external_url', true )
									?: get_post_meta( $file_id, 'file_url', true )
									?: get_post_meta( $file_id, 'stm_lms_file', true );
							}

							// Still empty? Use helper if available
							if ( empty( $file_url ) && function_exists( 'ms_plugin_attachment_data' ) ) {
								$file_data = ms_plugin_attachment_data( $file_id );
								if ( ! empty( $file_data['url'] ) ) {
									$file_url = $file_data['url'];
								}
							}

							// Skip if still no URL
							if ( empty( $file_url ) ) {
								if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
									error_log( "❌ No URL found for attachment ID: {$file_id}" );
								}
								continue;
							}

							$file_title = get_the_title( $file_id );

							// Author meta
							$file_author = get_post_meta( $file_id, 'resource_author', true );
							if ( ! $file_author ) {
								$file_author = get_the_author_meta( 'display_name', $file->post_author );
							}

							// Description from caption or content
							$file_desc = wp_get_attachment_caption( $file_id );
							$file_desc = $file_desc ?: wp_strip_all_tags( $file->post_content );

							// ACF Image (optional)
							$image_id = function_exists( 'get_field' ) ? get_field( 'resource_image', $file_id ) : '';
							if ( $image_id ) {
								$thumb = wp_get_attachment_image( $image_id, 'medium', false, array( 'class' => 'pdf-thumb' ) );
							} else {
								$fallback_icon = get_template_directory_uri() . '/assets/images/pdf-icon.png';
								$thumb = '<img src="' . esc_url( $fallback_icon ) . '" alt="PDF Icon" class="pdf-thumb">';
							}
							?>

							<div class="course-resource-item">
								<div class="resource-thumb">
									<?php echo $thumb; ?>
								</div>
								<div class="resource-info">
									<h4 class="resource-title"><?php echo esc_html( $file_title ); ?></h4>

									<?php if ( $file_author ) : ?>
										<div class="resource-author"><?php echo esc_html( $file_author ); ?></div>
									<?php endif; ?>

									<?php if ( $file_desc ) : ?>
										<p class="resource-desc"><?php echo esc_html( $file_desc ); ?></p>
									<?php endif; ?>

									<a href="<?php echo esc_url( $file_url ); ?>" class="download-btn" target="_blank" rel="noopener">
										Download
									</a>
								</div>
							</div>

						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>
</div>