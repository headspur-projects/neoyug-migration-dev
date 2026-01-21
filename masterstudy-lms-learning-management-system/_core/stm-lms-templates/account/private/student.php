<?php if (!defined('ABSPATH')) exit; ?>

<?php
/**
 * @var $current_user
 */

stm_lms_register_style('user_info_top');

$user_id = $current_user['id'] ?? get_current_user_id();
$enrolled_courses = stm_lms_get_user_courses($user_id, array(), false, false);

$course_levels = array();

if (!empty($enrolled_courses)) {
    foreach ($enrolled_courses as $enrolled) {
        $course_id = $enrolled['course_id'] ?? null;
        if (empty($course_id)) continue;

        $course = get_post($course_id);
        if (!$course) continue;

        $level = get_post_meta($course_id, 'level', true);
        $level_label = !empty($level) ? ucfirst($level) : 'Unknown';

        $lesson_count = 0;
        if (class_exists('STM_LMS_Course')) {
            $lectures = STM_LMS_Course::curriculum_info($course_id);
            $lesson_count = !empty($lectures['lessons']) ? intval($lectures['lessons']) : 0;
        }

        $course_levels[$course_id] = array(
            'level_label'  => $level_label,
            'lesson_count' => $lesson_count,
        );
    }
}
?>


<?php STM_LMS_Templates::show_lms_template('account/private/parts/enrolled-courses', compact('course_levels', 'enrolled_courses')); ?>