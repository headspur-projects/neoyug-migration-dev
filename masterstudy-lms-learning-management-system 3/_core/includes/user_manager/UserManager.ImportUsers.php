<?php

new STM_LMS_User_Manager_Import_Users();

class STM_LMS_User_Manager_Import_Users {

	public function __construct() {
		add_action( 'wp_ajax_stm_lms_dashboard_import_users_to_course', array( $this, 'import_users' ) );
	}

	public function import_users() {
		if ( ! current_user_can( 'manage_options' ) ) {
			die;
		}

		check_ajax_referer( 'stm_lms_dashboard_import_users_to_course', 'nonce' );

		$request_body   = file_get_contents( 'php://input' );
		$data           = json_decode( $request_body, true );
		$imported_users = $data['users'] ?? array();
		$course_id      = intval( $data['course_id'] ?? 0 );
		$output         = array(
			'not_enrolled_users'      => array(),
			'new_enrolled_users'      => array(),
			'incorrect_email_users'   => array(),
			'before_registered_users' => array(),
		);

		foreach ( $imported_users as $imported_user ) {
			if ( isset( $imported_user['email'] ) && is_email( $imported_user['email'] ) ) {
				$user = get_user_by( 'email', $imported_user['email'] );

				$is_enrolled_before = false;

				if ( $user ) {
					$course_users = stm_lms_get_course_users( $course_id );

					$output['before_registered_users'][] = $imported_user;

					foreach ( $course_users as $course_user ) {
						$course_user_id = intval( $course_user['user_id'] ?? 0 );
						if ( intval( $user->ID ) === $course_user_id ) {
							$output['before_enrolled_users'][] = $imported_user;

							$is_enrolled_before = true;
						}
					}
				}

				if ( $user && ! $is_enrolled_before || ! $user && ! $is_enrolled_before ) {
					$adding_student = STM_LMS_Instructor::add_student_to_course( array( $course_id ), array( $imported_user['email'] ) );

					if ( ! $adding['error'] ) {
						$output['new_enrolled_users'][] = $imported_user;
						$this->update_user_names( $imported_user['email'], $imported_user );
					} else {
						$output['not_enrolled_users'][] = $imported_user;
					}
				}
			} else {
				$output['incorrect_email_users'][] = $imported_user;
			}
		}
		wp_send_json( $output );
	}

	public function update_user_names( $email, $user_data = array() ) {
		$first_name = sanitize_text_field( trim( $user_data['first_name'] ?? '' ) );
		$last_name  = sanitize_text_field( trim( $user_data['last_name'] ?? '' ) );

		if ( $first_name || $last_name ) {
			$user = get_user_by( 'email', $email );

			if ( $user ) {
				wp_update_user(
					array(
						'ID'         => $user->ID,
						'first_name' => $first_name,
						'last_name'  => $last_name,
					)
				);
			}
		}
	}
}
