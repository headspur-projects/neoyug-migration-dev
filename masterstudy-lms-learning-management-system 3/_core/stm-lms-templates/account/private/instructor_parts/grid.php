<?php
$reviews             = STM_LMS_Options::get_option( 'course_tab_reviews', true );
$is_featured_enabled = STM_LMS_Options::get_option( 'enable_featured_courses', true );
?>

<div class="stm_lms_instructor_courses__grid">

	<div class="stm_lms_instructor_courses__single" v-for="course in courses"  v-bind:class="'course-' + course.status" >
		<div class="stm_lms_instructor_courses__single__inner">
			<div class="stm_lms_instructor_courses__single--image">

				<div class="stm_lms_post_status heading_font"
					v-if="course.post_status && course.post_status.label"
					v-bind:class="course.post_status.status"
					:style="{color: `${course.post_status.text_color}`, background: `${course.post_status.bg_color}`}"
				>
					{{ course.post_status.label }}
				</div>

				<a v-bind:href="course.link" target="_blank">

					<div class="pending-message" v-if="course.status==='pending'">
						<i class="stmlms-hourglass-half"></i>
						<h4><?php esc_html_e( 'Pending for approval', 'masterstudy-lms-learning-management-system' ); ?></h4>
					</div>
					<div class="pending-message" v-if="course.status==='rejected'">
						<i class="stmlms-times-circle"></i>
						<h4><?php esc_html_e( 'Course Rejected', 'masterstudy-lms-learning-management-system' ); ?></h4>
					</div>

					<div class="stm_lms_instructor_courses__single--image-wrapper"
						v-bind:class="{'no-image' : course.image===''}"
						v-html="course.image"></div>
				</a>
			</div>
			<div class="stm_lms_instructor_courses__single--inner">

				<div class="stm_lms_instructor_courses__single--terms" v-if="course.terms">
					<div class="stm_lms_instructor_courses__single--term" v-for="(term, key) in course.terms">
						<a :href="'<?php echo esc_url( STM_LMS_Course::courses_page_url() ); ?>' + '?terms[]=' + term.term_id + '&category[]=' + term.term_id" v-if="key === 0">
							{{ term.name }}
						</a>
					</div>
				</div>

				<div class="stm_lms_instructor_courses__single--title">
					<a v-bind:href="course.link">
						<h5 v-html="course.title"></h5>
					</a>
				</div>

				<div class="stm_lms_instructor_courses__single--meta">
					<?php if ( $reviews ) { ?>
						<div class="average-rating-stars__top">
							<div class="star-rating">
									<span v-bind:style="{'width' : course.percent + '%'}">
										<strong class="rating">{{ course.average }}</strong>
									</span>
							</div>
							<div class="average-rating-stars__av heading_font">
								{{ course.average }}<span v-if="course.total != ''"> ({{course.total}})</span>
							</div>
						</div>
					<?php } ?>
					<div class="views">
						<i class="stmlms-eye"></i>
						{{ course.views }}
					</div>
				</div>

				<div class="stm_lms_instructor_courses__single--bottom">


					<div class="stm_lms_instructor_courses__single--status" v-bind:class="course.status">

						<div class="stm_lms_instructor_courses__single--status-inner"
							v-bind:class="{
								'coming-soon': course.availability === '1',
								'loading': course.changingStatus
								}">

							<div class="stm_lms_instructor_courses__single--choice publish"
								@click="changeStatus(course, 'publish')"
								v-bind:class="{'chosen' : (course.status === 'publish' || course.status === 'pending')}">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Published', 'masterstudy-lms-learning-management-system' ); ?></span>
							</div>

							<div class="stm_lms_instructor_courses__single--choice draft"
								@click="changeStatus(course, 'draft')"
								v-bind:class="{'chosen' : course.status === 'draft'}">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Drafted', 'masterstudy-lms-learning-management-system' ); ?></span>
							</div>

							<div class="stm_lms_instructor_courses__single--choice draft"
								@click="changeStatus(course, 'rejected')"  v-if="course.status === 'rejected'"
								v-bind:class="{'chosen' : course.status === 'rejected'}">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Rejected', 'masterstudy-lms-learning-management-system' ); ?></span>
							</div>

							<a v-bind:href="course.edit_link" target="_blank"
								class="stm_lms_instructor_courses__single--choice edit">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Edit', 'masterstudy-lms-learning-management-system' ); ?></span>
							</a>

							<a v-bind:href="course.manage_students_link" target="_blank" v-if="course.can_instructor_add_students"
								class="stm_lms_instructor_courses__single--choice manage-students">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Manage Students', 'masterstudy-lms-learning-management-system' ); ?></span>
							</a>

							<a v-bind:href="course.analytics_link" target="_blank" v-if="course.analytics_link"
								class="stm_lms_instructor_courses__single--choice chart">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Analytics', 'masterstudy-lms-learning-management-system' ); ?></span>
							</a>

							<a v-bind:href="course.grades_link" target="_blank" v-if="course.grades_link"
								class="stm_lms_instructor_courses__single--choice grades">
								<div class="stm_lms_instructor_courses__single--choice-icon"></div>
								<span><?php esc_html_e( 'Grades', 'masterstudy-lms-learning-management-system' ); ?></span>
							</a>
						</div>


					</div>


					<div class="stm_lms_instructor_courses__single--price heading_font"
						v-if="course.single_sale && ! course.zero_price && course.sale_price && course.price">
						<span>{{ course.price }}</span>
						<strong>{{ course.sale_price }}</strong>
					</div>
					<div class="stm_lms_instructor_courses__single--price heading_font"
						v-else-if="course.single_sale && ! course.zero_price && ! course.sale_price && course.price">
						<strong>{{ course.price }}</strong>
					</div>
					<div class="stm_lms_instructor_courses__single--price heading_font"
						v-else-if="course.is_free">
						<strong><?php echo esc_html__( 'Free', 'masterstudy-lms-learning-management-system' ); ?></strong>
					</div>
					<div class="stm_lms_instructor_courses__single--price heading_font members_only"
						v-else-if="! course.single_sale && course.members_only">
						<strong><?php echo esc_html__( 'Members only', 'masterstudy-lms-learning-management-system' ); ?></strong>
					</div>
					<div class="stm_lms_instructor_courses__single--price heading_font" v-else ></div>
				</div>

				<div class="stm_lms_instructor_courses__single--featured heading_font"
					v-bind:class="{'loading' : course.changingFeatured}">

					<?php if ( $is_featured_enabled ) : ?>
					<div class="feature_it add_to_featured"
						@click="changeFeatured(course)"
						v-if="course.status == 'publish' && course.is_featured != 'on'">
						<?php esc_html_e( 'Make Featured', 'masterstudy-lms-learning-management-system' ); ?>
					</div>

					<div class="feature_it remove_from_featured"
						v-if="course.is_featured == 'on'"
						@click="changeFeatured(course)">
						<?php esc_html_e( 'Remove from Featured', 'masterstudy-lms-learning-management-system' ); ?>
					</div>
					<?php endif; ?>

					<a class="feature_it edit_course" v-if="course.status === 'draft'" :href="course.edit_link" target="_blank">
						<?php esc_html_e( 'Edit course', 'masterstudy-lms-learning-management-system' ); ?>
					</a>

					<div class="feature_it cancel_request" v-if="course.status === 'pending'" @click="changeStatus(course, 'draft')">
						<?php esc_html_e( 'Cancel request', 'masterstudy-lms-learning-management-system' ); ?>
					</div>

				</div>

				<div class="stm_lms_instructor_courses__single--updated"
					v-if="course.updated"
					v-html="course.updated">
				</div>
			</div>
		</div>
	</div>

</div>
