<?php

use MasterStudy\Lms\Pro\addons\CourseBundle\Repository\CourseBundleRepository;
use MasterStudy\Lms\Pro\addons\CourseBundle\Utility\CourseBundleCheckout;
use MasterStudy\Lms\Pro\AddonsPlus\Subscriptions\Repositories\SubscriptionPlanRepository;
use MasterStudy\Lms\Plugin\Addons;

new STM_LMS_Guest_Checkout();

class STM_LMS_Guest_Checkout {
	public function __construct() {
		add_filter( 'stm_lms_buy_button_auth', array( $this, 'guest_checkout' ), 10, 2 );

		add_action( 'wp_ajax_nopriv_stm_lms_add_to_cart_guest', array( $this, 'guest_checkout_process' ) );
		add_action( 'wp_ajax_nopriv_stm_lms_fast_login', array( $this, 'fast_login' ) );
		add_action( 'wp_ajax_nopriv_stm_lms_fast_register', array( $this, 'fast_register' ) );
	}

	public static function guest_enabled() {
		return STM_LMS_Options::get_option( 'guest_checkout', false );
	}

	public function guest_checkout( $atts, $course_id ) {
		if ( ! self::guest_enabled() ) {
			return $atts;
		}
		if ( is_user_logged_in() ) {
			return $atts;
		}

		return array(
			'data-guest="' . $course_id . '"',
		);
	}

	public function guest_checkout_process() {
		check_ajax_referer( 'stm_lms_add_to_cart_guest', 'nonce' );

		$is_woocommerce = STM_LMS_Cart::woocommerce_checkout_enabled();

		$r = array();

		if ( ! $is_woocommerce ) {
			$r['text']     = esc_html__( 'Go to Cart', 'masterstudy-lms-learning-management-system' );
			$r['cart_url'] = esc_url( STM_LMS_Cart::checkout_url() );
		} else {
			$item_id = intval( $_GET['item_id'] );

			$r['added']    = STM_LMS_Woocommerce::add_to_cart( $item_id );
			$r['text']     = esc_html__( 'Go to Cart', 'masterstudy-lms-learning-management-system' );
			$r['cart_url'] = esc_url( wc_get_cart_url() );
		}

		$r['redirect'] = STM_LMS_Options::get_option( 'redirect_after_purchase', false );

		wp_send_json( $r );
	}

	public static function get_cart_items() {
		$items = array();
		if ( isset( $_COOKIE['stm_lms_notauth_cart'] ) ) {
			$items = self::check_cart_items( $_COOKIE['stm_lms_notauth_cart'] );
		}

		return $items;
	}

	public static function check_cart_items( $items ) {
		$cart_items = array();

		if ( empty( $items ) ) {
			return $cart_items;
		}

		$items = json_decode( $items, true );

		foreach ( $items as $item_id ) {
			if ( ! is_int( $item_id ) && get_post_type( $item_id ) !== 'stm-courses' ) {
				continue;
			}

			$cart_item = array(
				'item_id' => $item_id,
			);

			$plan = is_ms_lms_addon_enabled( Addons::SUBSCRIPTIONS ) ? ( new SubscriptionPlanRepository() )->get( $item_id ) : null;

			if ( 'stm-course-bundles' === get_post_type( $item_id )
				&& class_exists( '\MasterStudy\Lms\Pro\addons\CourseBundle\Repository\CourseBundleRepository' ) ) {
				$cart_item['price'] = CourseBundleRepository::get_bundle_price( $item_id );
			} elseif ( $plan ) {
				$cart_item['price']           = SubscriptionPlanRepository::get_actual_price( $plan );
				$cart_item['is_subscription'] = 1;
				$cart_item['is_trial']        = ! empty( $plan['trial_period'] );
			} else {
				$cart_item['price'] = STM_LMS_Course::get_course_price( $item_id );
			}

			$bundle_ids = get_post_meta( $item_id, 'stm_lms_bundle_ids', true );
			if ( ! empty( $bundle_ids ) ) {
				$cart_item['bundle'] = $item_id;
			}

			$cart_items[] = $cart_item;
		}

		return $cart_items;
	}

	public function fast_register() {
		check_ajax_referer( 'stm_lms_fast_register', 'nonce' );

		$response = array(
			'status' => 'error',
		);

		$request_body = file_get_contents( 'php://input' );
		$data         = json_decode( $request_body, true );

		if ( empty( $data['email'] ) ) {
			$response['errors'][] = array(
				'id'    => 'empty_email',
				'field' => 'email',
				'text'  => esc_html__( 'Field is required', 'masterstudy-lms-learning-management-system' ),
			);
		} else {
			if ( ! is_email( $data['email'] ) ) {
				$response['errors'][] = array(
					'id'    => 'wrong_email',
					'field' => 'email',
					'text'  => esc_html__( 'Enter valid email', 'masterstudy-lms-learning-management-system' ),
				);
			}

			if ( email_exists( $data['email'] ) ) {
				$response['errors'][] = array(
					'id'    => 'exists_email',
					'field' => 'email',
					'text'  => esc_html__( 'User with this email address already exists', 'masterstudy-lms-learning-management-system' ),
				);
			}
		}

		$weak_password = STM_LMS_Options::get_option( 'registration_weak_password', false );

		if ( ! $weak_password && ! empty( $data['password'] ) ) {
			/* If Password shorter than 8 characters*/
			if ( strlen( $data['password'] ) < 8 ) {
				$response['errors'][] = array(
					'id'    => 'characters',
					'field' => 'password',
					'text'  => esc_html__( 'Password must have at least 8 characters', 'masterstudy-lms-learning-management-system' ),
				);
			}
			/* if contains letter */
			if ( ! preg_match( '#[a-z]+#', $data['password'] ) ) {
				$response['errors'][] = array(
					'id'    => 'lowercase',
					'field' => 'password',
					'text'  => esc_html__( 'Password must include at least one lowercase letter!', 'masterstudy-lms-learning-management-system' ),
				);
			}
			/* if contains number */
			if ( ! preg_match( '#[0-9]+#', $data['password'] ) ) {
				$response['errors'][] = array(
					'id'    => 'number',
					'field' => 'password',
					'text'  => esc_html__( 'Password must include at least one number!', 'masterstudy-lms-learning-management-system' ),
				);
			}
			/* if contains CAPS */
			if ( ! preg_match( '#[A-Z]+#', $data['password'] ) ) {
				$response['errors'][] = array(
					'id'    => 'capital',
					'field' => 'password',
					'text'  => esc_html__( 'Password must include at least one capital letter! one number!', 'masterstudy-lms-learning-management-system' ),
				);
			}
		}

		if ( ! empty( $response['errors'] ) ) {
			return wp_send_json( $response );
		}

		$user = wp_create_user( sanitize_title( $data['email'] ), $data['password'], $data['email'] );

		if ( is_wp_error( $user ) ) {
			$response['errors'][] = array(
				'id'    => 'user_error',
				'field' => 'email',
				'text'  => $user->get_error_message(),
			);
		} else {
			wp_signon(
				array(
					'user_login'    => $data['email'],
					'user_password' => $data['password'],
				),
				is_ssl()
			);

			$response['items']  = self::add_cart( $user );
			$response['status'] = 'success';
		}

		wp_send_json( $response );
	}

	public function fast_login() {
		check_ajax_referer( 'stm_lms_fast_login', 'nonce' );

		$response = array(
			'status' => 'error',
		);

		$request_body = file_get_contents( 'php://input' );
		$data         = json_decode( $request_body, true );

		if ( empty( $data['user_login'] ) ) {
			$response['errors'][] = array(
				'id'    => 'empty_email',
				'field' => 'email',
				'text'  => esc_html__( 'Field is required', 'masterstudy-lms-learning-management-system' ),
			);
		}

		if ( empty( $data['user_password'] ) ) {
			$response['errors'][] = array(
				'id'    => 'empty_pass',
				'field' => 'password',
				'text'  => esc_html__( 'Field is required', 'masterstudy-lms-learning-management-system' ),
			);
		}

		if ( ! empty( $response['errors'] ) ) {
			return wp_send_json( $response );
		}

		$get_user_by   = is_email( remove_accents( $data['user_login'] ) ) ? 'email' : 'login';
		$is_registered = get_user_by( $get_user_by, remove_accents( $data['user_login'] ) );
		if ( ! $is_registered ) {
			$response['errors'][] = array(
				'id'    => 'wrong_email',
				'field' => 'email',
				'text'  => esc_html__( 'Wrong email', 'masterstudy-lms-learning-management-system' ),
			);

			return wp_send_json( $response );
		}

		$user = wp_signon( $data, is_ssl() );

		if ( is_wp_error( $user ) ) {
			$response['errors'][] = array(
				'id'    => 'wrong_password',
				'field' => 'password',
				'text'  => esc_html__( 'Wrong password', 'masterstudy-lms-learning-management-system' ),
			);
			return wp_send_json( $response );
		} else {
			$response['items']  = self::add_cart( $user->ID );
			$response['status'] = 'success';
		}

		wp_send_json( $response );
	}

	public static function add_cart( $user_id ) {
		$response = array();
		$items    = self::get_cart_items();

		foreach ( $items as $item ) {
			if ( 'stm-course-bundles' === get_post_type( $item['item_id'] )
				&& class_exists( 'CourseBundleRepository' ) ) {
				$response[] = CourseBundleCheckout::add_to_cart( $item['item_id'], $user_id );
			} else {
				$response[] = STM_LMS_Cart::masterstudy_add_to_cart( $item['item_id'], $user_id );
			}
		}

		return $response;
	}

}
