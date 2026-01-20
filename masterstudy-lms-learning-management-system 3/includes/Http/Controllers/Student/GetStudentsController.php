<?php

namespace MasterStudy\Lms\Http\Controllers\Student;

use WP_REST_Response;
use WP_REST_Request;
use MasterStudy\Lms\Http\WpResponseFactory;
use MasterStudy\Lms\Repositories\CourseRepository;
use MasterStudy\Lms\Repositories\StudentsRepository;
use MasterStudy\Lms\Validation\Validator;

final class GetStudentsController {

	public function __invoke( WP_REST_Request $request ) {
		$validator = new Validator(
			$request->get_params(),
			array(
				'show_all_enrolled' => 'nullable|string',
				'date_from'         => 'nullable|string',
				'date_to'           => 'nullable|string',
				's'                 => 'nullable|string',
				'page'              => 'nullable|integer',
				'per_page'          => 'nullable|integer',
				'order'             => 'nullable|string|in:asc,desc,ASC,DESC',
				'orderby'           => 'nullable|string|in:joined,enrolled,points,id,name,email,login',
				'course_id'         => 'nullable|integer',
				'subscribed'        => 'nullable|boolean',
			)
		);

		if ( $validator->fails() ) {
			return WpResponseFactory::validation_failed( $validator->get_errors_array() );
		}

		$params        = $validator->get_validated();
		$user_id       = get_current_user_id();
		$course_repo   = new CourseRepository();
		$students_repo = new StudentsRepository();
		$course_id     = $params['course_id'] ?? null;
		$show_all      = ! empty( $params['show_all_enrolled'] );

		if ( ! $show_all && ! $course_repo->exists( $course_id ) ) {
			return WpResponseFactory::not_found();
		}

		$has_access = $course_id
			? \STM_LMS_Course::check_course_author( $course_id, $user_id )
			: \STM_LMS_Instructor::is_instructor( $user_id );

		if ( ! $has_access ) {
			return WpResponseFactory::forbidden();
		}

		$students = $show_all
			? $students_repo->get_all_students( $params )
			: $students_repo->get_course_students( $params );

		return new WP_REST_Response( $students );
	}
}
