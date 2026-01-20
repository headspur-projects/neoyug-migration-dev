<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly
?>

<?php

/**
 * @var $current_user
 */



if ( empty( $current_user ) ) {
	$current_user = STM_LMS_User::get_current_user();
}

$is_instructor = STM_LMS_Instructor::is_instructor( $current_user['id'] );
$tpl           = ( $is_instructor ) ? 'instructor' : 'student';


