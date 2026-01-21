<!-- course-player -->


<?php
/**
 * Custom MasterStudy Course Player Template - Silva Ultramind Style
 * Follows proper MasterStudy architecture with custom styling
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// This template expects $lesson_id and $lms_page_path from MasterStudy's routing
if ( ! isset( $lesson_id ) || ! isset( $lms_page_path ) ) {
    // If variables are missing, we're not in proper course player context
    // Redirect to course page or show error
    if ( is_singular( 'stm-courses' ) ) {
        // We're on a course page, show course overview with first lesson auto-start
        $course_id = get_the_ID();
        $curriculum_repo = new \MasterStudy\Lms\Repositories\CurriculumRepository();
        $curriculum = $curriculum_repo->get_curriculum( $course_id, true );
        
        if ( !empty( $curriculum ) && !empty( $curriculum[0]['materials'] ) ) {
            $first_lesson = $curriculum[0]['materials'][0];
            $first_lesson_url = STM_LMS_Lesson::get_lesson_url( $course_id, $first_lesson['post_id'] );
            
            // Auto-redirect to first lesson
            ?>
            <script>
                setTimeout(function() {
                    window.location.href = '<?php echo esc_js( $first_lesson_url ); ?>';
                }, 2000);
            </script>
            <?php
            
            get_header();
            ?>
            <div style="background: linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
                <div>
                    <h1>Starting Course...</h1>
                    <p>Redirecting to first lesson...</p>
                </div>
            </div>
            <?php
            get_footer();
            return;
        }
    }
    
    // Fallback: redirect to home
    wp_redirect( home_url() );
    exit;
}

// Now we're in proper course player context - use MasterStudy's system
use MasterStudy\Lms\Repositories\CoursePlayerRepository;

global $post;
$post = get_post( $lesson_id );

if ( $post instanceof \WP_Post ) {
	setup_postdata( $post );
}

$course_player = new CoursePlayerRepository();
$data = $course_player->get_main_data( $lms_page_path, (int) $lesson_id );
$quiz_data = 'quiz' === $data['lesson_type']
	? $course_player->get_quiz_data( $data['item_id'], $data['user_id'], $data['post_id'] )
	: array();

// Enqueue necessary assets
do_action( 'masterstudy_lms_course_player_register_assets' );
wp_enqueue_style( 'masterstudy-course-player-main' );
wp_enqueue_script( 'masterstudy-course-player-quiz-attempt' );

if ( empty( $data['theme_fonts'] ) ) {
	wp_enqueue_style( 'masterstudy-fonts' );
	wp_enqueue_style( 'masterstudy-course-player-fonts' );
	wp_enqueue_style( 'masterstudy-components-fonts' );
}

$data['dark_mode'] = true;

do_action( 'stm_lms_before_item_template_start', $data['post_id'], $data['item_id'], $data['material_ids'] );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo esc_html( get_the_title( $data['item_id'] ) ); ?> - <?php echo esc_html( $data['course_title'] ); ?></title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome for reliable icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <?php wp_head(); ?>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-blue: #4c6ef5;
            --primary-purple: #7c3aed;
            --bg-dark: #0a0a0a;
            --bg-darker: #000000;
            --bg-card: #1a1a1a;
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --text-muted: #666666;
            --border-color: #2a2a2a;
            --success-green: #10b981;
            --gradient-main: linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%);
        }
        
        body {
            background: var(--bg-dark);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            overflow-x: hidden;
        }
        
        .course-player-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        /* Header */
        .course-header {
            background: var(--bg-darker);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-color);
        }
        
        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .back-btn {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: background 0.2s;
        }
        
        .back-btn:hover {
            background: var(--bg-card);
        }
        
        .course-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .header-right {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .bookmark-btn, .menu-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.2s;
        }
        
        .bookmark-btn:hover, .menu-btn:hover {
            color: var(--text-primary);
            background: var(--bg-card);
        }
        
        /* Main Content Area */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        /* Video Player Area */
        .video-section {
            background: var(--gradient-main);
            position: relative;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            overflow: hidden;
        }
        
        /* Video styling for hero section */
        .video-section video,
        .video-section iframe,
        .video-section .masterstudy-single-course-video,
        .video-section .stm-lms-course-player-lesson-video {
            height: 100% !important;
            width: auto !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            object-fit: cover !important;
        }
        
        .video-section .masterstudy-single-course-video__container,
        .video-section .masterstudy-single-course-video__wrapper {
            height: 100% !important;
            width: 100% !important;
            border-radius: 0 !important;
        }
        
        .video-content h1 {
            font-size: 3.5rem;
            font-weight: 300;
            line-height: 1.2;
            margin-bottom: 2rem;
            color: white;
            text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        
        .video-content .subtitle {
            font-size: 1.2rem;
            color: rgba(255,255,255,0.9);
            font-style: italic;
        }
        
        .video-controls {
            position: absolute;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            gap: 1rem;
        }
        
        .control-btn {
            background: rgba(0,0,0,0.3);
            border: none;
            color: white;
            padding: 0.75rem;
            border-radius: 8px;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.2s;
        }
        
        .control-btn:hover {
            background: rgba(0,0,0,0.5);
        }
        
        /* Course Info Section */
        .course-info {
            background: var(--bg-darker);
            padding: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
        }
        
        .course-branding {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .course-logo {
            width: 60px;
            height: 60px;
            background: var(--gradient-main);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.2rem;
            color: white;
        }
        
        .course-details h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        
        .course-author {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .course-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .continue-btn {
            background: white;
            color: var(--bg-dark);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }
        
        .continue-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255,255,255,0.2);
        }
        
        .chat-btn {
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .chat-btn:hover {
            background: var(--bg-darker);
        }
        
        .progress-section {
            text-align: right;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        /* Navigation Tabs */
        .nav-tabs {
            background: var(--bg-darker);
            padding: 0 2rem;
            display: flex;
            gap: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .nav-tab {
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 1rem 0;
            font-weight: 500;
            cursor: pointer;
            position: relative;
            transition: color 0.2s;
        }
        
        .nav-tab.active {
            color: var(--text-primary);
        }
        
        .nav-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--primary-blue);
        }
        
        .nav-tab:hover {
            color: var(--text-primary);
        }
        
        /* Tabbed Content */
        .tabbed-content {
            flex: 1;
            background: var(--bg-dark);
        }
        
        .tab-content {
            display: none;
            padding: 2rem;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* Overview Section */
        .overview-section {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .course-overview h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .course-description {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .course-stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            justify-content: center;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-blue);
        }
        
        .stat-label {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .first-lesson-preview h4 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .lesson-preview-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: var(--bg-card);
            border-radius: 12px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid var(--border-color);
        }
        
        .lesson-preview-card:hover {
            background: #222;
            border-color: var(--primary-blue);
        }
        
        .lesson-preview-thumbnail {
            width: 80px;
            height: 60px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .lesson-preview-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .lesson-preview-thumbnail .thumbnail-placeholder {
            width: 100%;
            height: 100%;
            background: var(--gradient-main);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
        }
        
        .lesson-preview-info h5 {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }
        
        .lesson-preview-info p {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        /* Lessons Section */
        .lessons-section {
            padding: 0;
        }
        
        /* Resources Section */
        .resources-section h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            color: var(--text-primary);
        }
        
        .resources-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .resource-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: var(--bg-card);
            border-radius: 12px;
            padding: 1rem;
            border: 1px solid var(--border-color);
        }
        
        .resource-icon {
            font-size: 2rem;
            flex-shrink: 0;
        }
        
        .resource-info h4 {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }
        
        .resource-info p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .resource-link {
            color: var(--primary-blue);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .resource-link:hover {
            text-decoration: underline;
        }
        
        /* Discussions Section */
        .discussions-section h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            color: var(--text-primary);
        }
        
        .lesson-group {
            margin-bottom: 2rem;
        }
        
        .group-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            cursor: pointer;
        }
        
        .group-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .lesson-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-card);
            border-radius: 12px;
            margin-bottom: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid transparent;
        }
        
        .lesson-item:hover {
            background: #222;
            border-color: var(--border-color);
        }
        
        .lesson-thumbnail {
            width: 120px;
            height: 80px;
            background: var(--gradient-main);
            border-radius: 12px;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .lesson-thumbnail:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(76, 110, 245, 0.3);
        }
        
        .lesson-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
        }
        
        .lesson-thumbnail .thumbnail-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.5rem;
            color: white;
            background: var(--gradient-main);
        }
        
        .lesson-thumbnail .play-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 32px;
            height: 32px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lesson-thumbnail:hover .play-overlay {
            opacity: 1;
        }
        
        .lesson-thumbnail .play-overlay i {
            font-size: 12px;
            color: var(--primary-blue);
        }
        
        .lesson-thumbnail .play-overlay .emoji-fallback {
            font-size: 12px;
            color: var(--primary-blue);
            margin-left: 2px;
        }
        
        .lesson-info {
            flex: 1;
        }
        
        .lesson-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }
        
        .lesson-meta {
            color: var(--text-secondary);
            font-size: 0.85rem;
        }
        
        .lesson-duration {
            color: var(--text-muted);
            font-size: 0.8rem;
        }
        
        .lesson-item.completed .lesson-status {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--success-green);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 1.2rem;
        }
        
        .lesson-status.incomplete {
            background: var(--border-color);
        }
        
        /* Icon System - Font Awesome with Emoji Fallbacks */
        .emoji-fallback {
            display: none;
        }
        
        /* If Font Awesome fails to load, show emoji fallbacks */
        .fa:not(.fa-loaded) + .emoji-fallback,
        .fas:not(.fa-loaded) + .emoji-fallback,
        .far:not(.fa-loaded) + .emoji-fallback {
            display: inline;
        }
        
        .fa:not(.fa-loaded),
        .fas:not(.fa-loaded),
        .far:not(.fa-loaded) {
            display: none;
        }
        
        /* Ensure icons are properly sized */
        .back-btn i,
        .bookmark-btn i,
        .menu-btn i,
        .control-btn i,
        .chat-btn i,
        .continue-btn i {
            margin-right: 0.5rem;
        }
        
        .section-toggle i {
            transition: transform 0.2s ease;
        }
        
        .section-toggle.expanded i {
            transform: rotate(180deg);
        }
        
        .resource-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .play-overlay {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lesson-status {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .course-header {
                padding: 1rem;
            }
            
            .video-content h1 {
                font-size: 2.5rem;
            }
            
            .course-info {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
            
            .nav-tabs {
                padding: 0 1rem;
                gap: 1rem;
            }
            
            .lessons-section {
                padding: 1rem;
            }
        }
    .course-progress-bar {
        position: relative;
        width: 90%;
        height: 5px;
        background: #2e2d2d;
        border-radius: 4px;
        overflow: hidden;
        margin: 10px 0;
    }

    .course-progress-bar .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, rgba(34,122,255,1) 0%, rgba(34,122,255,0.8) 100%);
        width: 0%;
        border-radius: 4px;
        transition: width 0.5s ease;
    }

    .progress-container {
        display: flex;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        align-items: center;
        justify-content: space-between;
    }
    .progress-section {
        font-size: 1.2rem;
    }
    .lesson-item.active-lesson {
        background: rgba(34,122,255,0.3);
    }

    #course-compl {
        cursor: pointer;
        opacity: 1;
    }

    #course-compl:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Remove the disabled state styles */
    #course-compl.disabled {
        opacity: 1; /* Override - button is always enabled */
        cursor: pointer;
    }
    
    .masterstudy-authorization__instructor-already {
        display: none;
    }

    </style>
</head>
<body>
    <div class="course-player-container">
        <!-- Header -->
        <header class="course-header">
        <div class="header-left">
            <button class="back-btn" onclick="window.location.href='<?php echo esc_url( $data['course_url'] ); ?>'">
            <i class="fas fa-arrow-left"></i>
            <span class="emoji-fallback">←</span>
            </button>
            <span class="course-title"><?php echo esc_html( $data['course_title'] ); ?></span>
        </div>

        <div class="header-right">
<?php
// Hook registration - must be at top of file
add_action('wp_ajax_custom_toggle_bookmark', 'custom_toggle_bookmark');
add_action('wp_ajax_nopriv_custom_toggle_bookmark', 'custom_toggle_bookmark');

function custom_toggle_bookmark() {
    // Make all output visible in browser
    header('Content-Type: application/json');

    $debug = [];

    // Nonce check
    $debug['received_post'] = $_POST;
    if (!isset($_POST['nonce'])) {
        $debug['error'] = 'Nonce missing';
        echo json_encode(['success' => false, 'debug' => $debug]);
        wp_die();
    }
    $debug['nonce_received'] = $_POST['nonce'];

    if (!wp_verify_nonce($_POST['nonce'], 'custom_bookmark_nonce')) {
        $debug['error'] = 'Invalid nonce';
        echo json_encode(['success' => false, 'debug' => $debug]);
        wp_die();
    }

    // User logged in check
    $debug['is_user_logged_in'] = is_user_logged_in();
    if (!is_user_logged_in()) {
        $debug['error'] = 'User not logged in';
        echo json_encode(['success' => false, 'debug' => $debug]);
        wp_die();
    }

    $course_id = isset($_POST['course_id']) ? intval($_POST['course_id']) : 0;
    $debug['course_id'] = $course_id;
    if (!$course_id) {
        $debug['error'] = 'Invalid course ID';
        echo json_encode(['success' => false, 'debug' => $debug]);
        wp_die();
    }

    // Wishlist status
    $wishlisted = STM_LMS_User::is_wishlisted($course_id);
    $debug['currently_wishlisted'] = $wishlisted;

    if ($wishlisted) {
        STM_LMS_User::remove_from_wishlist($course_id);
        $debug['action_taken'] = 'Removed from wishlist';
        $text = 'Add to wishlist';
    } else {
        STM_LMS_User::add_to_wishlist($course_id);
        $debug['action_taken'] = 'Added to wishlist';
        $text = 'Remove from wishlist';
    }

    echo json_encode([
        'success' => true,
        'text' => $text,
        'debug' => $debug
    ]);
    wp_die();
}
?>
   <?php
global $post;
$course_id  = isset( $data['course_id'] ) ? intval( $data['course_id'] ) : ( isset( $post->ID ) ? $post->ID : 0 );
$wishlisted = STM_LMS_User::is_wishlisted( $course_id );
?>
<a class="account_linkk" href="https://neoyug.com/user-account/"><img src="https://neoyug.com/wp-content/uploads/2026/01/user-account-1.png" width="25" height="25" alt="Account Icon" /></a>
            <!-- <button type="button" 
                    class="bookmark-btn <?php echo $wishlisted ? 'bookmarked' : ''; ?>" 
                    data-id="<?php echo esc_attr( $course_id ); ?>">
            <i class="fas fa-bookmark"></i>
            <span class="emoji-fallback">🔖</span>
        </button> -->

        </div>
        </header>



        <!-- Main Content -->
        <main class="main-content">
            <!-- Video Section -->
            <section class="video-section">
                <div class="video-content">
                    <?php
                    // Strict access control - user must be logged in AND enrolled
                    $user_id = get_current_user_id();
                    $is_enrolled = false;
                    
                    if ( $user_id ) {
                        // Check if user is enrolled in the course
                        $is_enrolled = \STM_LMS_User::has_course_access( $data['post_id'], $data['item_id'], $user_id );
                        
                        // Alternative check using MasterStudy's enrollment system
                        if ( !$is_enrolled && function_exists( 'stm_lms_has_course_access' ) ) {
                            $is_enrolled = stm_lms_has_course_access( $data['post_id'], $user_id );
                        }
                    }
                    
                    // Only allow access if user is enrolled (ignore guest trial for security)
                    $has_access = $is_enrolled;

                    if ( $has_access || $data['has_preview'] ) {
                        if ( ! $data['lesson_lock_before_start'] && ! $data['lesson_locked_by_drip'] ) {
                            $item_content = apply_filters( 'stm_lms_show_item_content', true, $data['post_id'], $data['item_id'] );

                            if ( $item_content && ! empty( $data['item_id'] ) ) {
                                // Display the actual lesson content (video, text, etc.)
                                STM_LMS_Templates::show_lms_template(
                                    'course-player/content/' . $data['content_type'] . '/main',
                                    array(
                                        'post_id'               => $data['post_id'],
                                        'item_id'               => $data['item_id'],
                                        'user_id'               => $data['user_id'],
                                        'lesson_type'           => $data['lesson_type'],
                                        'lesson_completed'      => $data['lesson_completed'],
                                        'data'                  => 'quiz' === $data['content_type'] ? $quiz_data : array(),
                                        'last_lesson'           => $data['last_lesson'],
                                        'video_questions'       => $data['video_questions'] ?? array(),
                                        'video_questions_stats' => $data['video_questions_stats'] ?? array(),
                                        'dark_mode'             => $data['dark_mode'],
                                        'has_attempts'          => $quiz_data['has_attempts'] ?? false,
                                    )
                                );
                            } else {
                                // Fallback: show inspirational text
                                ?>
                                <h1>Access altered states of mind for<br>more intuition, clarity and healing</h1>
                                <p class="subtitle">Transform your learning experience</p>
                                <?php
                            }
                        } else {
                            ?>
                            <h1>Lesson Locked</h1>
                            <p class="subtitle"><?php echo esc_html( $data['lesson_lock_message'] ?? 'This lesson is not available yet.' ); ?></p>
                            <?php
                        }
                    } else {
                        ?>
                        <h1>Access Restricted</h1>
                        <p class="subtitle">Please enroll in this course to access the content</p>
                        <?php
                    }
                    ?>
                </div>
                <!-- <div class="video-controls">
                    <button class="control-btn">
                        <i class="fas fa-pause"></i>
                        <span class="emoji-fallback">⏸️</span>
                    </button>
                    <button class="control-btn">
                        <i class="fas fa-volume-up"></i>
                        <span class="emoji-fallback">🔊</span>
                    </button>
                    <button class="control-btn">
                        <i class="fas fa-expand"></i>
                        <span class="emoji-fallback">⛶</span>
                    </button>
                </div> -->
            </section>

            <!-- Course Info -->
            <section class="course-info">
                <div class="course-branding">
                    <!-- <div class="course-logo">
                        <?php 
                        $title_words = explode(' ', $data['course_title']);
                        echo esc_html(substr($title_words[0], 0, 1) . (isset($title_words[1]) ? substr($title_words[1], 0, 1) : ''));
                        ?>
                    </div> -->

                    <div class="lesson-preview-thumbnail">
                        <?php
                        $first_lesson_thumb = get_the_post_thumbnail_url( $first_lesson['post_id'], 'medium' );
                        if ( !$first_lesson_thumb ) {
                            $first_lesson_thumb = get_the_post_thumbnail_url( $data['post_id'], 'medium' );
                        }
                        ?>
                        <?php if ( $first_lesson_thumb ) : ?>
                            <img src="<?php echo esc_url( $first_lesson_thumb ); ?>" alt="<?php echo esc_attr( $first_lesson['title'] ); ?>">
                        <?php else : ?>
                            <div class="thumbnail-placeholder">
                                <i class="fas fa-play"></i>
                                <span class="emoji-fallback">▶</span>
                            </div>
                        <?php endif; ?>
        </div>
                    <div class="course-details">
                        <h2><?php echo esc_html( $data['course_title'] ); ?></h2>
                        <p class="course-author"><?php echo esc_html( get_the_author_meta( 'display_name', get_post_field( 'post_author', $data['post_id'] ) ) ); ?></p>
                    </div>
                </div>
                <div class="course-actions">
                    <?php if ( $has_access ) : ?>
                        <?php
                        // Get next lesson for continue button (enrolled users only)
                        $next_lesson_url = '';
                        $current_lesson_found = false;
                        
                        if ( !empty( $data['curriculum'] ) ) {
                            foreach ( $data['curriculum'] as $section ) {
                                if ( isset( $section['materials'] ) ) {
                                    foreach ( $section['materials'] as $material ) {
                                        if ( $current_lesson_found ) {
                                            $next_lesson_url = STM_LMS_Lesson::get_lesson_url( $data['post_id'], $material['post_id'] );
                                            break 2;
                                        }
                                        if ( $material['post_id'] == $data['item_id'] ) {
                                            $current_lesson_found = true;
                                        }
                                    }
                                }
                            }
                        }
                        
                       
                        if ( $next_lesson_url ) : ?>
                            <a href="<?php echo esc_url( $next_lesson_url ); ?>" class="continue-btn next-lesson-btn">
                                Continue - Next Module
                            </a>
                        <?php else : ?>
                            <!-- ✅ Course Complete button - ALWAYS ENABLED on last lesson -->
                            <button id="course-compl" class="continue-btn next-lesson-btn" type="button">
                                Program Complete
                            </button>
                        <?php endif; ?>
                        
                        <!-- <button class="chat-btn">
                            <i class="fas fa-comments"></i>
                            <span class="emoji-fallback">💬</span>
                            Community
                        </button> -->
                    <!-- <div class="progress-section">
                        <div id="progress-count">0 / 0 Completed</div>
                    </div> -->

                    <?php else : ?>
                        <!-- Non-enrolled user actions -->
                        <?php
                        // Get course price information
                        $course_price = get_post_meta( $data['post_id'], 'price', true );
                        $course_sale_price = get_post_meta( $data['post_id'], 'sale_price', true );
                        $sale_price_active = STM_LMS_Helpers::is_sale_price_active( $data['post_id'] );
                        $is_free = empty( $course_price ) || $course_price == '0';
                        $guest_checkout = STM_LMS_Options::get_option( 'guest_checkout', false );
                        $is_logged = is_user_logged_in();
                        
                        // Determine button attributes based on MasterStudy's system
                        if ( $is_logged ) {
                            $button_attributes = 'data-purchased-course="' . intval( $data['post_id'] ) . '"';
                        } else {
                            if ( $guest_checkout ) {
                                $button_attributes = 'data-guest="' . intval( $data['post_id'] ) . '"';
                            } else {
                                $button_attributes = 'data-authorization-modal="login"';
                            }
                        }
                        
                        // Prepare button text and price display
                        $button_text = $is_free ? 'Enroll for Free' : 'Get Course';
                        $display_price = '';
                        
                        if ( !$is_free ) {
                            if ( !empty( $course_sale_price ) && $sale_price_active ) {
                                $display_price = STM_LMS_Helpers::display_price( $course_sale_price );
                            } elseif ( !empty( $course_price ) ) {
                                $display_price = STM_LMS_Helpers::display_price( $course_price );
                            }
                        }
                        ?>
                        
                        <!-- Enqueue MasterStudy's buy button assets -->
                        <?php
                        wp_enqueue_style( 'masterstudy-buy-button' );
                        wp_enqueue_script( 'masterstudy-buy-button' );
                        wp_localize_script(
                            'masterstudy-buy-button',
                            'masterstudy_buy_button_data',
                            array(
                                'ajax_url'        => admin_url( 'admin-ajax.php' ),
                                'get_nonce'       => wp_create_nonce( 'stm_lms_add_to_cart' ),
                                'get_guest_nonce' => wp_create_nonce( 'stm_lms_add_to_cart_guest' ),
                                'item_id'         => $data['post_id'],
                            )
                        );
                        ?>
                        
                        <button 
                            class="continue-btn masterstudy-open-auth-modal"
                            data-auth-type="register"
                            type="button">
                            <i class="fas fa-graduation-cap"></i>
                            <span class="emoji-fallback">🎓</span>
                            <?php echo esc_html( $button_text ); ?>
                            <?php if ( !empty( $display_price ) ) : ?>
                                <span style="margin-left: 0.5rem; opacity: 0.9;">
                                    <?php echo wp_kses_post( $display_price ); ?>
                                </span>
                            <?php endif; ?>
                        </button>

                        
                        <button class="chat-btn" onclick="window.location.href='<?php echo esc_url( $data['course_url'] ); ?>'">
                            <i class="fas fa-eye"></i>
                            <span class="emoji-fallback">👁️</span>
                            Preview Course
                        </button>
                        <div class="progress-section">
                            <div>Course Preview Mode</div>
                        </div>
                    <?php endif; ?>
                    </div>
                </div>

                <div class="progress-container">
                    <!-- 🔵 Progress Bar Added Here -->
                    <div class="course-progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%;"></div>
                    </div>

                    <div class="progress-section">
                        <div id="progress-count">0 / 0 Completed</div>
                    </div>
                </div>


            </section>

<?php
// Detect first lesson
$first_lesson_id = null;
if ( !empty( $data['curriculum'][0]['materials'][0]['post_id'] ) ) {
    $first_lesson_id = $data['curriculum'][0]['materials'][0]['post_id'];
}

// Determine which tab should be active by default
$default_tab = 'overview';
if ( $has_access && $data['item_id'] != $first_lesson_id ) {
    $default_tab = 'lessons';
}
?>

<!-- Navigation Tabs -->
<nav class="nav-tabs">
    <button class="nav-tab <?php echo $default_tab === 'overview' ? 'active' : ''; ?>" data-tab="overview">
        Overview
    </button>

    <?php if ( $has_access ) : ?>
        <button class="nav-tab <?php echo $default_tab === 'lessons' ? 'active' : ''; ?>" data-tab="lessons">
            Modules
        </button>

        <?php
        // Check if course has resources
        $has_resources = false;
        $course_materials = get_post_meta( $data['post_id'], 'course_materials', true );
        $course_files = get_post_meta( $data['post_id'], 'course_files', true );
        if ( !empty( $course_materials ) || !empty( $course_files ) ) {
            $has_resources = true;
        }
        ?>


<?php
$course_files = get_post_meta( $data['post_id'] ?? 0, 'course_files', true );

// Ensure we always have an array to work with
if ( empty( $course_files ) ) {
    $course_files = [];
}

// If it's a string like "[7000]" or "7000,7001"
if ( is_string( $course_files ) ) {
    $cleaned = str_replace( [ '[', ']' ], '', $course_files );
    $course_files = array_filter( array_map( 'trim', explode( ',', $cleaned ) ) );
}

// Flatten any nested arrays
if ( is_array( $course_files ) ) {
    foreach ( $course_files as $key => $file_entry ) {
        if ( is_array( $file_entry ) && !empty( $file_entry[0] ) ) {
            $course_files[$key] = $file_entry[0];
        }
    }
}

// Remove empties
$course_files = array_filter( $course_files );

$has_resources = !empty( $course_files );
?>

       

        <?php if ( $has_resources ) : ?>
            <button class="nav-tab <?php echo $default_tab === 'resources' ? 'active' : ''; ?>" data-tab="resources">
                Resources
            </button>
        <?php endif; ?>

        <!-- <button class="nav-tab <?php echo $default_tab === 'stories' ? 'active' : ''; ?>" data-tab="stories">
            Stories
        </button> -->

    <?php endif; ?>
</nav>

            <!-- Tabbed Content Section -->
            <section class="tabbed-content">
                
                <!-- Overview Tab (Always visible) -->
                <div class="tab-content <?php echo $default_tab === 'overview' ? 'active' : ''; ?>" id="overview-content">
                    <div class="overview-section">
                        <div class="course-overview">
                            <h3>About This Program</h3>
                            <div class="course-description">
                                <?php 
                                $course_excerpt = get_post_field( 'post_excerpt', $data['post_id'] );
                                $course_content = get_post_field( 'post_content', $data['post_id'] );
                                
                                if ( !empty( $course_excerpt ) ) {
                                    echo wp_kses_post( $course_excerpt );
                                } elseif ( !empty( $course_content ) ) {
                                    echo wp_kses_post( wp_trim_words( $course_content, 50 ) );
                                } else {
                                    echo '<p>Discover the transformative power of this comprehensive program designed to enhance your learning experience.</p>';
                                }
                                ?>
                            </div>
                            
                            <?php if ( !empty( $data['curriculum'] ) ) : ?>
                                <div class="course-stats">
                                    <div class="stat-item">
                                        <span class="stat-number"><?php echo count( $data['material_ids'] ); ?></span>
                                        <span class="stat-label">Modules</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number"><?php echo count( $data['curriculum'] ); ?></span>
                                        <span class="stat-label">Sections</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-number">∞</span>
                                        <span class="stat-label">Access</span>
                                    </div>
                                </div>
                                
                                <?php if ( $has_access ) : ?>
                                    <!-- First lesson preview for enrolled users -->
                                    <?php 
                                    $first_lesson = null;
                                    if ( !empty( $data['curriculum'][0]['materials'][0] ) ) {
                                        $first_lesson = $data['curriculum'][0]['materials'][0];
                                    }
                                    ?>
                                    <?php if ( $first_lesson ) : ?>
                                        <div class="first-lesson-preview">
                                            <h4>Start Learning</h4>
                                            <div class="lesson-preview-card" onclick="window.location.href='<?php echo esc_js( STM_LMS_Lesson::get_lesson_url( $data['post_id'], $first_lesson['post_id'] ) ); ?>'">
                                                <div class="lesson-preview-thumbnail">
                                                    <?php
                                                    $first_lesson_thumb = get_the_post_thumbnail_url( $first_lesson['post_id'], 'medium' );
                                                    if ( !$first_lesson_thumb ) {
                                                        $first_lesson_thumb = get_the_post_thumbnail_url( $data['post_id'], 'medium' );
                                                    }
                                                    ?>
                                                    <?php if ( $first_lesson_thumb ) : ?>
                                                        <img src="<?php echo esc_url( $first_lesson_thumb ); ?>" alt="<?php echo esc_attr( $first_lesson['title'] ); ?>">
                                                    <?php else : ?>
                                                        <div class="thumbnail-placeholder">
                                                            <i class="fas fa-play"></i>
                                                            <span class="emoji-fallback">▶</span>
                                                        </div>
                                                    <?php endif; ?>
                                                </div>
                                                <div class="lesson-preview-info">
                                                    <h5><?php echo esc_html( $first_lesson['title'] ); ?></h5>
                                                    <p>Begin your journey with this introductory module</p>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                
                <?php if ( $has_access ) : ?>
                    <!-- Lessons Tab (Enrolled users only) -->
                    <div class="tab-content <?php echo $default_tab === 'lessons' ? 'active' : ''; ?>" id="lessons-content">
                        <div class="lessons-section">
                            <?php if ( !empty( $data['curriculum'] ) ) : ?>
                    <?php foreach ( $data['curriculum'] as $section_index => $section ) : ?>
                        <div class="lesson-group">
                            <div class="group-header">
                                <span class="section-toggle">
                                    <i class="fas fa-chevron-down"></i>
                                    <span class="emoji-fallback">▼</span>
                                </span>
                                <h3 class="group-title"><?php echo esc_html( $section['title'] ); ?></h3>
                            </div>
                            
<?php if ( isset( $section['materials'] ) ) : ?>
    <?php
    $user_id   = get_current_user_id();
    $course_id = $data['post_id'];

    $completed_lessons = STM_LMS_Lesson::get_completed_lessons( $user_id, $course_id );
    $passed_quizzes    = STM_LMS_Quiz::get_passed_quizzes( $user_id, $course_id );
    $material_index    = 0;
    ?>

    <?php foreach ( $section['materials'] as $lesson_index => $lesson ) : ?>
        
    <?php 
        $current_lesson_id = $data['item_id']; // The lesson currently being viewed
        $is_current_lesson = ( $lesson['post_id'] == $current_lesson_id );
    ?>


        <?php 
        $material_index++;
        $lesson_id    = $lesson['post_id'];
        $lesson_url   = STM_LMS_Lesson::get_lesson_url( $course_id, $lesson_id );
        $lesson_type  = get_post_type( $lesson_id );

        // ✅ Completion logic
        $is_completed = false;
        if ( 'stm-quizzes' === $lesson_type ) {
            $is_completed = isset( $passed_quizzes[ $lesson_id ] );
        } elseif ( 'stm-assignments' === $lesson_type ) {
            $is_completed = STM_LMS_Lesson::is_lesson_completed( $user_id, $course_id, $lesson_id );
        } else {
            $is_completed = isset( $completed_lessons[ $lesson_id ] );
        }

        // ✅ Thumbnail logic
        $thumbnail_url = '';
        $featured_img = get_the_post_thumbnail_url( $lesson_id, 'medium' );
        if ( $featured_img ) {
            $thumbnail_url = $featured_img;
        } else {
            $meta_fields = [ 'lesson_banner', 'lesson_video_poster', 'video_poster', 'lesson_image', 'stm_lesson_banner', 'lesson_thumbnail' ];
            foreach ( $meta_fields as $field ) {
                $meta_value = get_post_meta( $lesson_id, $field, true );
                if ( !empty( $meta_value ) ) {
                    if ( is_array( $meta_value ) && isset( $meta_value['url'] ) ) {
                        $thumbnail_url = $meta_value['url']; break;
                    } elseif ( is_string( $meta_value ) && filter_var( $meta_value, FILTER_VALIDATE_URL ) ) {
                        $thumbnail_url = $meta_value; break;
                    } elseif ( is_numeric( $meta_value ) ) {
                        $attachment_url = wp_get_attachment_image_url( $meta_value, 'medium' );
                        if ( $attachment_url ) { $thumbnail_url = $attachment_url; break; }
                    }
                }
            }
        }
        if ( !$thumbnail_url ) $thumbnail_url = get_the_post_thumbnail_url( $course_id, 'medium' );

        // Duration fallback
        $duration = get_post_meta( $lesson_id, 'duration', true );
        if ( !$duration ) $duration = rand( 8, 25 ) . ' mins';

        // Label
        switch ( $lesson_type ) {
            case 'stm-quizzes': $type_label = 'QUIZ'; break;
            case 'stm-assignments': $type_label = 'ASSIGNMENT'; break;
            default: $type_label = 'MODULE';
        }

        // ✅ Check for lesson locked by drip or before start
        $lesson_locked_by_drip = $lesson['lesson_locked_by_drip'] ?? false;
        $lesson_lock_message   = $lesson['lesson_lock_message'] ?? '';
        $lesson_lock_before_start = $lesson['lesson_lock_before_start'] ?? false;
        ?>

<div class="lesson-item 
    <?php 
        echo $is_completed ? 'completed' : ''; 
        echo $is_current_lesson ? ' active-lesson' : ''; 
    ?>" 
    data-lesson-id="<?php echo esc_attr( $lesson_id ); ?>"
    style="position: relative;">

    
            <div class="lesson-thumbnail" onclick="if(!<?php echo $lesson_locked_by_drip || $lesson_lock_before_start ? 'true' : 'false'; ?>) { window.location.href='<?php echo esc_js( $lesson_url ); ?>'; }" >
                <?php if ( $thumbnail_url ) : ?>
                    <img src="<?php echo esc_url( $thumbnail_url ); ?>" alt="<?php echo esc_attr( $lesson['title'] ); ?>" loading="lazy">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                <?php else : ?>
                    <div class="thumbnail-placeholder"><?php echo esc_html( $lesson_index + 1 ); ?></div>
                <?php endif; ?>
            </div>

            <div class="lesson-info" onclick="if(!<?php echo $lesson_locked_by_drip || $lesson_lock_before_start ? 'true' : 'false'; ?>) { window.location.href='<?php echo esc_js( $lesson_url ); ?>'; }" >

                <?php if ( $is_current_lesson ) : ?>
                    <!-- <div class="current-lesson-label" style="color: green; font-weight: bold; margin-top: 5px;">
                        ✅ You are currently viewing this lesson
                    </div> -->
                <?php endif; ?>

                <div class="lesson-meta"><?php echo esc_html( $type_label . ' ' . ($lesson_index + 1) ); ?></div>
                <div class="lesson-title"><?php echo esc_html( $lesson['title'] ); ?></div>
                <!-- <div class="lesson-duration"><?php echo esc_html( $duration ); ?></div> -->
            </div>

            <div class="lesson-status" data-lesson-id="<?php echo esc_attr( $lesson_id ); ?>">
                <?php if ( $lesson_lock_before_start || $lesson_locked_by_drip ) : ?>
                    <span class="lesson-locked" title="<?php echo esc_attr( $lesson_lock_message ); ?>">🔒</span>
                <?php else : ?>
                    <span class="lesson-checkmark" style="color: rgba(34,122,255,1);display: <?php echo $is_completed ? 'inline' : 'none'; ?>">✔</span>
                    <span class="next-arrow" style="font-size:25px;color: rgba(34,122,255,1);display: <?php echo $is_completed ? 'none' : 'inline'; ?>">›</span>
                <?php endif; ?>
            </div>


        </div>
    <?php endforeach; ?>
<?php endif; ?>



                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <p>No lessons available yet. Check back soon!</p>
                    </div>
                <?php endif; ?>
                        </div>
                    </div>
                    
<!-- Resources Tab (Enrolled users only, if resources exist) -->
<?php if ( $has_resources ) : ?>
<div class="tab-content <?php echo $default_tab === 'resources' ? 'active' : ''; ?>" id="resources-content">
  <div class="resources-section">
    
    <!-- PDFs Accordion Group -->
    <div class="resource-group active">
      <div class="group-header" onclick="this.parentElement.classList.toggle('active')">
        <span class="section-toggle">
          <i class="fas fa-chevron-down"></i>
        </span>
        <h3 class="group-title">PDFs</h3>
      </div>
      
      <div class="resource-list">
        <?php foreach ( $course_files as $file_id ) :
            $file = get_post( $file_id );
            if ( ! $file ) continue;

            $file_url   = wp_get_attachment_url( $file_id );
            $file_title = get_the_title( $file_id );
            
            // Get author/creator meta
            $file_author = get_post_meta( $file_id, 'resource_author', true );
            if ( ! $file_author ) {
                $file_author = get_the_author_meta( 'display_name', $file->post_author );
            }
            
            // Get description - try caption first, then description field
            $file_desc  = wp_get_attachment_caption( $file_id );
            $file_desc  = $file_desc ?: wp_strip_all_tags( $file->post_content );

            // ACF Resource Image (custom field)
            $image_id = get_field( 'resource_image', $file_id );

            if ( $image_id ) {
                $thumb = wp_get_attachment_image( $image_id, 'medium', false, array( 'class' => 'pdf-thumb' ) );
            } else {
                // fallback icon
                $fallback_icon = get_template_directory_uri() . '/assets/images/pdf-icon.png';
                $thumb = '<img src="' . esc_url( $fallback_icon ) . '" alt="PDF Icon" class="pdf-thumb">';
            }
        ?>
            <div class="course-resource-item">
                <div class="resource-thumb"><?php echo $thumb; ?></div>

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






<!-- Stories Tab -->
<!-- <div class="tab-content <?php echo $default_tab === 'stories' ? 'active' : ''; ?>" id="stories-content">
    <div class="stories-section">
    <h3>Student Stories & Testimonials</h3>
    <div class="stories-wrapper">

        <div class="story-card">
        <img src="https://placehold.co/600x400" alt="Dijana Ljugolli" class="story-image">
        <div class="story-content">
            <h4 class="story-quote">"This was the exact guidance I needed to step into this new chapter with clarity and confidence"</h4>
            <p class="story-text">
            After years of running a successful business, I reached a point where I knew I was ready for something more aligned, something with purpose. 
            Starting a new business felt exciting but also overwhelming. Reinventing You with Dorie Clark was the exact guidance I needed to step into this new...
            </p>
            <a href="#" class="story-readmore">Read More</a>
            <p class="story-name">Dijana Ljugolli</p>
            <p class="story-role">Coach<br>Stockholm, Sweden</p>
        </div>
        </div>

        <div class="story-card">
        <img src="https://placehold.co/600x400" alt="Vivienne Keytel" class="story-image">
        <div class="story-content">
            <h4 class="story-quote">"Each day of the quest created the next building block for expansion"</h4>
            <p class="story-text">
            An absolute powerhouse of a quest and beautifully curated and presented by the dynamic Dorie Clark. Before this quest I had never really 
            considered reinvention as such a dynamic and powerful event or strategy. From the start of this quest, I saw that “Reinvention” actually...
            </p>
            <a href="#" class="story-readmore">Read More</a>
            <p class="story-name">Vivienne Keytel</p>
            <p class="story-role">Transformation Coach<br>Johannesburg, South Africa</p>
        </div>
        </div>

        <div class="story-card">
        <img src="https://placehold.co/600x400" alt="Sample Testimonial" class="story-image">
        <div class="story-content">
            <h4 class="story-quote">"Instead of vague motivation, it provides tangible steps to create lasting change"</h4>
            <p class="story-text">
            This program gave me the practical tools and inspiration I needed to implement real change in my career and personal life. Each lesson felt 
            deeply relevant and grounded in reality.
            </p>
            <a href="#" class="story-readmore">Read More</a>
            <p class="story-name">Sarah Mitchell</p>
            <p class="story-role">Consultant<br>New York, USA</p>
        </div>
        </div>

    </div>
    </div>

</div> -->


                    
                    <!-- Discussions Tab (Enrolled users only) 
                    <div class="tab-content" id="discussions-content">
                        <div class="discussions-section">
                            <h3>Course Discussions</h3>
                            <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                                Course discussions and community features will be available here.
                            </p>
                        </div>
                    </div>-->
                <?php endif; ?>
                
            </section>
        </main>


        <?php
// Calculate completion status
$total_lessons = 0;
$completed_lessons_count = 0;

if ( ! empty( $data['curriculum'] ) ) {
    $user_id   = get_current_user_id();
    $course_id = $data['post_id'];
    $completed_lessons = STM_LMS_Lesson::get_completed_lessons( $user_id, $course_id );
    $passed_quizzes    = STM_LMS_Quiz::get_passed_quizzes( $user_id, $course_id );

    foreach ( $data['curriculum'] as $section ) {
        if ( ! empty( $section['materials'] ) ) {
            foreach ( $section['materials'] as $lesson ) {
                $lesson_id = $lesson['post_id'];
                $lesson_type = get_post_type( $lesson_id );
                $total_lessons++;

                $is_completed = false;
                if ( 'stm-quizzes' === $lesson_type ) {
                    $is_completed = isset( $passed_quizzes[ $lesson_id ] );
                } elseif ( 'stm-assignments' === $lesson_type ) {
                    $is_completed = STM_LMS_Lesson::is_lesson_completed( $user_id, $course_id, $lesson_id );
                } else {
                    $is_completed = isset( $completed_lessons[ $lesson_id ] );
                }

                if ( $is_completed ) {
                    $completed_lessons_count++;
                }
            }
        }
    }
}

$is_course_completed = ($total_lessons > 0 && $completed_lessons_count === $total_lessons);
?>

<!-- ✅ Custom Course Complete Popup -->
<div id="custom-course-complete-popup" class="course-complete-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-container">
    <button class="popup-close">&times;</button>
    <div class="popup-content">
      <div class="popup-icon">
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="#E3F2FD"/>
          <path d="M45 62L54 71L77 48" stroke="#2196F3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="stats">
            <h3 class="popup-label">Your score</h3>
            <h1 class="popup-score">100%</h1>
        </div>
      </div>
   
      <p class="popup-message">You have successfully completed the program</p>
      <h2 class="popup-course-title"><?php echo esc_html( $data['course_title'] ); ?></h2>
      <div class="popup-media-info">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#FF9800" stroke-width="2"/>
          <path d="M8 7L13 10L8 13V7Z" fill="#FF9800"/>
        </svg>
        <span>Media: <strong>6/6</strong></span>
      </div>
      <div class="popup-buttons">
        <!-- <button class="popup-btn primary" id="view-certificate-btn">Certificate</button> -->
        <button class="popup-btn secondary" onclick="window.location.href='<?php echo esc_url( $data['course_url'] ); ?>'" id="view-course-btn">View Program</button>
        <button class="popup-btn secondary" id="leave-review-btn">Leave Review</button>
      </div>
    </div>
  </div>
</div>

<script>
setTimeout(() => {
  if (typeof video_player_data !== 'undefined') {
    window.MASTERSTUDY_COURSE_ID = video_player_data.course_id;
    window.MASTERSTUDY_LESSON_ID = video_player_data.lesson_id;
    console.log('✅ Course ID set globally (delayed):', window.MASTERSTUDY_COURSE_ID);
  } else {
    console.warn('⚠️ video_player_data not found after delay');
  }
}, 800); // wait 1 second
</script>

<script>
window.stm_lms_nonces = {
  stm_lms_total_progress: "<?php echo wp_create_nonce('stm_lms_total_progress'); ?>",
  stm_lms_complete_lesson: "<?php echo wp_create_nonce('stm_lms_complete_lesson'); ?>"
};
</script>


<script>
// ✅ jQuery to handle lesson completion and progress tracking
jQuery(function($) {

    // ✅ Function to update the progress counter
window.updateProgress = function () {
    const lessonItems = document.querySelectorAll('.lesson-item');
    const completedLessons = document.querySelectorAll('.lesson-item.completed');
    const totalCount = lessonItems.length;
    const completedCount = completedLessons.length;

    const progressElement = document.getElementById('progress-count');
    if (progressElement) {
        progressElement.textContent = `${completedCount} / ${totalCount} Completed`;
    }

    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        progressFill.style.width = percent + '%';
    }
};


    // ✅ Restore completion state from localStorage
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    completedLessons.forEach(id => {
        const $lesson = $(`.lesson-item[data-lesson-id="${id}"]`);
        $lesson.addClass('completed').removeClass('incomplete');
        $lesson.find('.lesson-checkmark').show();
        $lesson.find('.next-arrow').hide();
    });

// ✅ Handle "Next Lesson" button click (merged local + server update)
$('body').on('click', '.continue-btn.next-lesson-btn', function(e) {
    e.preventDefault(); // ⛔ stop immediate redirect

    const $btn = $(this);
    const nextLessonUrl = $btn.attr('href'); // store the link
    const $currentLesson = $('.lesson-item.active-lesson');
    const courseId = window.MASTERSTUDY_COURSE_ID;

    if ($currentLesson.length && courseId) {
        const currentLessonId = parseInt($currentLesson.data('lesson-id'));
        console.log(`🟩 Completing lesson ${currentLessonId} for course ${courseId}`);

        // ✅ Mark in UI immediately
        $currentLesson.addClass('completed').removeClass('incomplete');
        $currentLesson.find('.lesson-checkmark').show();
        $currentLesson.find('.next-arrow').hide();

        // ✅ Save to localStorage
        let stored = JSON.parse(localStorage.getItem('completedLessons') || '[]');
        if (!stored.includes(currentLessonId)) {
            stored.push(currentLessonId);
            localStorage.setItem('completedLessons', JSON.stringify(stored));
        }

        // ✅ Send request to backend to mark as completed
$.ajax({
    url: stm_lms_ajaxurl,
    method: 'POST',
    dataType: 'json',
    data: {
        action: 'stm_lms_complete_lesson',
        lesson_id: currentLessonId,
        course_id: courseId,
        nonce: stm_lms_nonces.stm_lms_complete_lesson
    },
    success: function(res) {
        console.log('✅ Lesson completion response:', res);
    },
    error: function(err) {
        console.error('❌ Error marking lesson complete:', err);
    },
    complete: function() {
        setTimeout(() => {
            console.log('➡️ Navigating to next lesson:', nextLessonUrl);
            window.location.href = nextLessonUrl;
        }, 800);
    }
});

    }
});


    

// ✅ Handle click on .lesson-status to UNCOMPLETE lesson (no page reload)
$('body').on('click', '.lesson-status', function() {
    const lessonId = $(this).data('lesson-id');
    if (!lessonId) return;

    const $lessonItem = $(`.lesson-item[data-lesson-id="${lessonId}"]`);
    $lessonItem.removeClass('completed');
    $lessonItem.find('.lesson-checkmark').hide();
    $lessonItem.find('.next-arrow').show();

    let stored = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    stored = stored.filter(id => parseInt(id) !== parseInt(lessonId));
    localStorage.setItem('completedLessons', JSON.stringify(stored));

    // ✅ Just update progress UI dynamically instead of reloading
    updateProgress();
});

    // ✅ Initial progress update
    updateProgress();

    // ✅ Observe for DOM changes
    const container = document.querySelector('.section-container');
    if (container) {
        const observer = new MutationObserver(updateProgress);
        observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

});




// ✅ JavaScript to control popup behavior
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("custom-course-complete-popup");
  if (!popup) return;
  const closeBtns = popup.querySelectorAll(".popup-close, .popup-overlay");

  // ✅ Function to check if we're on the last lesson
  function isLastLesson() {
    const lessonItems = document.querySelectorAll('.lesson-item');
    const activeLesson = document.querySelector('.lesson-item.active-lesson');
    if (!activeLesson || !lessonItems.length) return false;
    const lastLesson = lessonItems[lessonItems.length - 1];
    return activeLesson === lastLesson;
  }

  // ✅ Show popup if course completed and on last lesson
  function checkAndShowPopup() {
    const lessonItems = document.querySelectorAll('.lesson-item');
    const completedLessons = document.querySelectorAll('.lesson-item.completed');
    const totalCount = lessonItems.length;
    const completedCount = completedLessons.length;
    const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    const onLastLesson = isLastLesson();
    const popupDismissed = sessionStorage.getItem('course_complete_popup_dismissed');

    // ✅ Only show popup if 100% completed AND on last lesson
    if (percent >= 100 && onLastLesson && !popupDismissed) {
      const scoreElement = popup.querySelector('.popup-score');
      if (scoreElement) scoreElement.textContent = percent + '%';
      const mediaInfo = popup.querySelector('.popup-media-info strong');
      if (mediaInfo) mediaInfo.textContent = `${completedCount}/${totalCount}`;
      popup.style.display = "flex";
      sessionStorage.removeItem('course_complete_popup_dismissed');
    }
  }

  // Initial check
  checkAndShowPopup();

  // ✅ Function to check if we're on the last lesson
    function isLastLesson() {
        const lessonItems = document.querySelectorAll('.lesson-item');
        const activeLesson = document.querySelector('.lesson-item.active-lesson');
        if (!activeLesson || !lessonItems.length) return false;
        const lastLesson = lessonItems[lessonItems.length - 1];
        return activeLesson === lastLesson;
    }

  // ✅ Close popup
  closeBtns.forEach(btn => btn.addEventListener("click", () => {
    popup.style.display = "none";
    sessionStorage.setItem('course_complete_popup_dismissed', 'true');
  }));

  // ✅ View course button
  const viewCourseBtn = document.getElementById('view-course-btn');
  if (viewCourseBtn) {
    viewCourseBtn.addEventListener('click', () => {
      popup.style.display = "none";
      sessionStorage.setItem('course_complete_popup_dismissed', 'true');
    });
  }

  // ✅ Leave review button
  const reviewBtn = document.getElementById('leave-review-btn');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      popup.style.display = "none";
      sessionStorage.setItem('course_complete_popup_dismissed', 'true');
      setTimeout(() => {
        const discussionSection = document.querySelector('.masterstudy-course-player-discussions');
        if (discussionSection) {
          discussionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    });
  }

  // ✅ Observe DOM changes to recheck completion dynamically
  const container = document.querySelector('.lessons-section');
  if (container) {
    const observer = new MutationObserver(() => setTimeout(checkAndShowPopup, 500));
    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }

});


// ✅ Function to manually show popup
function showCourseCompletePopup() {
  const popup = document.getElementById('custom-course-complete-popup');
  if (!popup) return;

  // Update popup with current stats
  const lessonItems = document.querySelectorAll('.lesson-item');
  const completedLessons = document.querySelectorAll('.lesson-item.completed');
  const totalCount = lessonItems.length;
  const completedCount = completedLessons.length;
  const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const scoreElement = popup.querySelector('.popup-score');
  if (scoreElement) scoreElement.textContent = percent + '%';
  
  const mediaInfo = popup.querySelector('.popup-media-info strong');
  if (mediaInfo) mediaInfo.textContent = `${completedCount}/${totalCount}`;

  popup.style.display = 'flex';
  sessionStorage.removeItem('course_complete_popup_dismissed');
}

function resetCourseCompletePopup() {
  sessionStorage.removeItem('course_complete_popup_dismissed');
  console.log('Course complete popup state reset');
}

// ✅ Handle Course Complete button click
document.addEventListener("DOMContentLoaded", () => {
  const courseComplBtn = document.getElementById('course-compl');
  if (!courseComplBtn) return;

  courseComplBtn.addEventListener('click', function(e) {
    e.preventDefault(); // ⛔ Prevent any default behavior
    e.stopPropagation(); // ⛔ Stop event bubbling

    console.log('🟩 Course Complete button clicked');

    // ✅ Get current lesson info
    const $currentLesson = jQuery('.lesson-item.active-lesson');
    const courseId = window.MASTERSTUDY_COURSE_ID;

    if (!$currentLesson.length || !courseId) {
      console.warn('⚠️ No active lesson found or course ID missing');
      return;
    }

    const currentLessonId = parseInt($currentLesson.data('lesson-id'));
    console.log(`🟩 Marking last lesson ${currentLessonId} as complete`);

    // ✅ Mark lesson as completed in UI immediately
    $currentLesson.addClass('completed').removeClass('incomplete');
    $currentLesson.find('.lesson-checkmark').show();
    $currentLesson.find('.next-arrow').hide();

    // ✅ Save to localStorage
    let stored = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    if (!stored.includes(currentLessonId)) {
      stored.push(currentLessonId);
      localStorage.setItem('completedLessons', JSON.stringify(stored));
    }

    // ✅ Update progress UI
    updateProgress();

    // ✅ Send AJAX request to mark lesson complete on server
    jQuery.ajax({
      url: stm_lms_ajaxurl,
      method: 'POST',
      dataType: 'json',
      data: {
        action: 'stm_lms_complete_lesson',
        lesson_id: currentLessonId,
        course_id: courseId,
        nonce: stm_lms_nonces.stm_lms_complete_lesson
      },
      success: function(res) {
        console.log('✅ Lesson completion response:', res);
      },
      error: function(err) {
        console.error('❌ Error marking lesson complete:', err);
      },
      complete: function() {
        // ✅ After marking complete, show popup
        console.log('🎉 Showing course complete popup');
        showCourseCompletePopup();
      }
    });
  });
});

</script>



    </div>

<?php
    // Show discussions if enabled
    if ( $data['has_access'] ) {
        STM_LMS_Templates::show_lms_template(
            'course-player/discussions',
            array(
                'post_id'             => $data['post_id'],
                'item_id'             => $data['item_id'],
                'user_id'             => $data['user_id'],
                'lesson_type'         => $data['lesson_type'],
                'quiz_data'           => 'quiz' === $data['content_type'] ? $quiz_data : array(),
                'dark_mode'           => $data['dark_mode'],
                'discussions_sidebar' => $data['discussions_sidebar'],
                'settings'            => $data['settings'],
            )
        );
    }
    
    wp_footer();
?>
    
<script>

    // Navigation tabs functionality
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabName = this.getAttribute('data-tab');
            const content = document.getElementById(tabName + '-content');
            if (content) {
                content.classList.add('active');
            }
        });
    });
    
    // Debug functionality for lesson thumbnails
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const debugInfo = this.querySelector('.debug-info');
            if (debugInfo) {
                debugInfo.style.display = 'block';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const debugInfo = this.querySelector('.debug-info');
            if (debugInfo) {
                debugInfo.style.display = 'none';
            }
        });
    });
    
    // Initialize first tab as active
    document.addEventListener('DOMContentLoaded', function() {
        const firstTab = document.querySelector('.nav-tab[data-tab="overview"]');
        const firstContent = document.getElementById('overview-content');
        
        if (firstTab && firstContent) {
            firstTab.classList.add('active');
            firstContent.classList.add('active');
        }
        
        // Check if Font Awesome loaded, if not show emoji fallbacks
        setTimeout(function() {
            const testIcon = document.createElement('i');
            testIcon.className = 'fas fa-home';
            testIcon.style.position = 'absolute';
            testIcon.style.left = '-9999px';
            document.body.appendChild(testIcon);
            
            const computedStyle = window.getComputedStyle(testIcon, ':before');
            const fontFamily = computedStyle.getPropertyValue('font-family');
            
            if (fontFamily.indexOf('Font Awesome') === -1) {
                // Font Awesome didn't load, show emoji fallbacks
                document.querySelectorAll('.fa, .fas, .far').forEach(function(icon) {
                    icon.style.display = 'none';
                    const fallback = icon.nextElementSibling;
                    if (fallback && fallback.classList.contains('emoji-fallback')) {
                        fallback.style.display = 'inline';
                    }
                });
            } else {
                // Font Awesome loaded successfully, mark icons as loaded
                document.querySelectorAll('.fa, .fas, .far').forEach(function(icon) {
                    icon.classList.add('fa-loaded');
                });
            }
            
            document.body.removeChild(testIcon);
        }, 100);
        
        // Section toggle functionality
        document.querySelectorAll('.group-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const toggle = this.querySelector('.section-toggle');
                if (toggle) {
                    toggle.classList.toggle('expanded');
                }
            });
        });
    });



// MasterStudy authorization modal trigger on enroll button click

    document.addEventListener("DOMContentLoaded", function() {
        const buttons = document.querySelectorAll('.masterstudy-open-auth-modal');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.authType || 'register';
                const modal = document.querySelector('.masterstudy-authorization-modal');
                if (modal) {
                    modal.style.opacity = '1';
                    modal.style.visibility = 'visible';
                    modal.classList.add('active');

                    // Switch between register/login if needed
                    if (typeof authorization_settings !== 'undefined') {
                        authorization_settings.register_mode = (type === 'register');
                        const titleEl = modal.querySelector('.masterstudy-authorization__header-title');
                        if (titleEl) {
                            titleEl.textContent = type === 'register' ? 'Sign Up' : 'Sign In';
                        }
                    }
                }
            });
        });
    });

// MasterStudy authorization modal close button functionality   

    document.addEventListener("DOMContentLoaded", function () {
        document.addEventListener("click", function (e) {
            const closeBtn = e.target.closest(".masterstudy-authorization-modal__close");
            if (closeBtn) {
            const modal = document.querySelector(".masterstudy-authorization-modal.active");
            if (modal) {
                // Remove the active class
                modal.classList.remove("active");

                // Reset inline styles (visibility & opacity)
                modal.style.opacity = "";
                modal.style.visibility = "";

                // Also remove body lock if present
                document.body.classList.remove("masterstudy-modal-open");
            }
            }
        });
    });
        
</script>


<?php

// Debug-only: Check if AJAX is hitting the server at all
add_action('wp_ajax_stm_lms_wishlist', function() {
    header('Content-Type: application/json');
    echo json_encode([
        'debug' => '✅ AJAX hook triggered successfully inside custom file',
        'received' => $_POST,
    ]);
    wp_die();
});

add_action('wp_ajax_nopriv_stm_lms_wishlist', function() {
    header('Content-Type: application/json');
    echo json_encode([
        'debug' => '⚠️ User not logged in, but AJAX reached WordPress',
        'received' => $_POST,
    ]);
    wp_die();
});

?>

<script>

// Wishlist - Expose only the same vars MasterStudy uses

        // var masterstudy_wishlist = {
        //     ajaxurl: "<?php echo esc_url( admin_url('admin-ajax.php') ); ?>",
        //     nonce: "<?php echo esc_attr( wp_create_nonce('stm_lms_wishlist') ); ?>",
        //     is_logged_in: <?php echo is_user_logged_in() ? 'true' : 'false'; ?>
        // };

        // console.log('MasterStudy wishlist data:', masterstudy_wishlist);

// Wishlist button click handler

        // jQuery(function($){
        //     $('body').on('click', '.bookmark-btn', function(e){
        //         e.preventDefault();
        //         e.stopImmediatePropagation();

        //         var $btn = $(this);
        //         var post_id = String($btn.data('id'));

        //         console.log('Bookmark clicked for course:', post_id);

        //         // 🔹 Check login status
        //         if (!masterstudy_wishlist.is_logged_in) {
        //             console.log('User not logged in — triggering auth modal');
        //             // Instead of alert, trigger the login modal button
        //             $('.continue-btn.masterstudy-open-auth-modal').trigger('click');
        //             return;
        //         }

        //         var payload = {
        //             action: 'stm_lms_wishlist',
        //             nonce: masterstudy_wishlist.nonce,
        //             post_id: '7018'
        //         };

        //         console.log('MasterStudy payload being sent:', payload);
        //         $.ajax({
        //             url: masterstudy_wishlist.ajaxurl,
        //             type: 'POST',
        //             dataType: 'json',
        //             data: payload,
        //             success: function(response) {
        //                 console.log('✅ MasterStudy AJAX response (parsed JSON):', response);

        //                 if (response && response.text) {
        //                     $btn.toggleClass('bookmarked');
        //                     $btn.find('.bookmark-text').text(response.text);
        //                 }
        //             },
        //             error: function(xhr, status, error) {
        //                 console.log('❌ AJAX ERROR:', status, error);
        //                 console.log('Raw Response Text:', xhr.responseText);

        //                 // 👇 try parsing manually if it's valid JSON but not recognized
        //                 try {
        //                     var parsed = JSON.parse(xhr.responseText);
        //                     console.log('Manually parsed response:', parsed);
        //                 } catch (err) {
        //                     console.log('Manual parse failed — response not JSON:', err);
        //                 }
        //             },
        //             complete: function() {
        //                 console.log('MasterStudy AJAX request complete');
        //             }
        //         });

        //     });
        // });


// Set default active tab based on PHP variable

        document.addEventListener("DOMContentLoaded", () => {
        const defaultTab = "<?php echo $default_tab; ?>";

        // Remove active from all nav buttons
        document.querySelectorAll(".nav-tab").forEach(btn => btn.classList.remove("active"));

        // Remove active from all tab content
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

        // Add active to matching nav button
        document.querySelector(`.nav-tab[data-tab="${defaultTab}"]`)?.classList.add("active");

        // Add active to matching tab content container
        document.querySelector(`#${defaultTab}-content`)?.classList.add("active");
        });

</script>


<?php
    // Load the MasterStudy authorization modal (hidden initially)
    STM_LMS_Templates::show_lms_template(
        'components/authorization/main',
        array(
            'modal' => true,
            'type'  => 'register', // default view (can switch to login dynamically)
        )
    );
?>

</body>
</html>
<?php
do_action( 'stm_lms_template_main_after' );
?>