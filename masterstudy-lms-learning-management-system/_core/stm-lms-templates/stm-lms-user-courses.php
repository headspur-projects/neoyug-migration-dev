<?php
/**
 * @var object $course
 * @var string $style
 */

if (!defined('ABSPATH')) {
    exit;
}

STM_LMS_Templates::show_lms_template('header');

$lms_current_user = STM_LMS_User::get_current_user('', true, true);

do_action('stm_lms_template_main');
stm_lms_register_style('user_info_top');
?>

<?php STM_LMS_Templates::show_lms_template('modals/preloader'); ?>

<div class="stm-lms-wrapper user-account-page">
    <div class="container">

        <?php do_action('stm_lms_admin_after_wrapper_start', $lms_current_user); ?>

        <?php
        // =========================
        // Build course levels + lecture count
        // =========================
        $user_id = $lms_current_user['id'] ?? get_current_user_id();
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

        // =========================
        // Now pass the data to enrolled-courses template
        // =========================
        STM_LMS_Templates::show_lms_template(
            'account/private/parts/enrolled-courses',
            compact('course_levels', 'enrolled_courses')
        );
        ?>

    </div>
</div>

<?php
STM_LMS_Templates::show_lms_template('footer');