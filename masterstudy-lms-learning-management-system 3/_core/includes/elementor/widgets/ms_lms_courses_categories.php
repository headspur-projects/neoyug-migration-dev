<?php
namespace StmLmsElementor\Widgets;

use Elementor\Controls_Manager;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;
use Elementor\Group_Control_Typography;
use Elementor\Widget_Base;
use MasterStudy\Lms\Plugin\Taxonomy;

class MsLmsCoursesCategories extends Widget_Base {
	public function __construct( $data = array(), $args = null ) {
		parent::__construct( $data, $args );
		wp_register_style( 'masterstudy-fonts', STM_LMS_URL . 'assets/css/variables/fonts.css', array(), STM_LMS_VERSION, false );
		wp_register_style( 'ms_lms_courses_categories', STM_LMS_URL . 'assets/css/elementor-widgets/courses-categories/courses-categories.css', array(), STM_LMS_VERSION, false );
	}

	public function get_name(): string {
		return 'ms_lms_courses_categories';
	}

	public function get_title(): string {
		return esc_html__( 'Courses Categories', 'masterstudy-lms-learning-management-system' );
	}

	public function get_icon(): string {
		return 'stmlms-categories lms-icon';
	}

	public function get_categories(): array {
		return array( 'stm_lms' );
	}

	public function get_style_depends(): array {
		return array( 'masterstudy-fonts', 'ms_lms_courses_categories' );
	}

	public function register_controls() {
		$this->register_content_controls();
		$this->register_style_controls();
	}

	private function register_content_controls() {
		$this->course_categories_content_controls();
		$this->layout_content_controls();
	}

	private function register_style_controls() {
		$this->layout_style_section();
		$this->card_style_section();
		$this->category_title_style_section();
		$this->courses_count_style_section();
	}

	private function course_categories_content_controls() {
		$this->start_controls_section(
			'course_categories_section',
			array(
				'label' => esc_html__( 'Course Categories', 'masterstudy-lms-learning-management-system' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'preset',
			array(
				'label'   => esc_html__( 'Preset', 'masterstudy-lms-learning-management-system' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'style-1',
				'options' => array(
					'style-1' => esc_html__( 'Classic', 'masterstudy-lms-learning-management-system' ),
					'style-2' => esc_html__( 'Colorful', 'masterstudy-lms-learning-management-system' ),
					'style-3' => esc_html__( 'Sleek', 'masterstudy-lms-learning-management-system' ),
					'style-4' => esc_html__( 'Dynamic', 'masterstudy-lms-learning-management-system' ),
					'style-5' => esc_html__( 'Dynamic with Title Below', 'masterstudy-lms-learning-management-system' ),
				),
			)
		);

		$this->add_control(
			'taxonomy',
			array(
				'name'        => 'taxonomy',
				'label'       => __( 'Select categories', 'masterstudy-lms-learning-management-system' ),
				'type'        => Controls_Manager::SELECT2,
				'label_block' => true,
				'multiple'    => true,
				'options'     => stm_lms_elementor_autocomplete_terms( 'stm_lms_course_taxonomy' ),
			)
		);

		$this->end_controls_section();
	}
	private function layout_content_controls() {
		$selector = $this->container_prefix_selector( '' );
		$this->start_controls_section(
			'layout_content_section',
			array(
				'label'     => esc_html__( 'Layout', 'masterstudy-lms-learning-management-system' ),
				'tab'       => Controls_Manager::TAB_CONTENT,
				'condition' => array(
					'preset!' => array( 'style-4', 'style-5' ),
				),
			)
		);

		$this->add_responsive_control(
			'categories_per_row',
			array(
				'label'     => esc_html__( 'Categories per row', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::NUMBER,
				'min'       => 1,
				'max'       => 6,
				'step'      => 1,
				'selectors' => array(
					$selector => '--masterstudy-categories-per-row: {{VALUE}};',
				),
				'condition' => array(
					'categories_wrap' => 'yes',
				),
			)
		);

		$this->add_responsive_control(
			'categories_wrap',
			array(
				'label'          => esc_html__( 'Wrap', 'masterstudy-lms-learning-management-system' ),
				'type'           => Controls_Manager::SWITCHER,
				'return_value'   => 'yes',
				'default'        => 'yes',
				'tablet_default' => 'yes',
				'mobile_default' => 'yes',
				'prefix_class'   => 'masterstudy-categories-wrap-%s',
			)
		);

		$this->add_responsive_control(
			'categories_align',
			array(
				'label'     => esc_html__( 'Align Content', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::CHOOSE,
				'options'   => array(
					'start'  => array(
						'title' => esc_html__( 'Left', 'masterstudy-lms-learning-management-system' ),
						'icon'  => 'eicon-text-align-left',
					),
					'center' => array(
						'title' => esc_html__( 'Center', 'masterstudy-lms-learning-management-system' ),
						'icon'  => 'eicon-text-align-center',
					),
					'end'    => array(
						'title' => esc_html__( 'Right', 'masterstudy-lms-learning-management-system' ),
						'icon'  => 'eicon-text-align-right',
					),
				),
				'selectors' => array(
					$selector => '--masterstudy-category-content-align: {{VALUE}};',
				),
			)
		);

		$this->end_controls_section();
	}

	private function layout_style_section() {
		$selector = $this->container_prefix_selector( '' );
		$this->start_controls_section(
			'layout_style_section',
			array(
				'label' => esc_html__( 'Layout', 'masterstudy-lms-learning-management-system' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_responsive_control(
			'container_margin',
			array(
				'label'      => esc_html__( 'Margin', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_responsive_control(
			'container_padding',
			array(
				'label'      => esc_html__( 'Padding', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_responsive_control(
			'container_space_between_cards',
			array(
				'label'      => esc_html__( 'Space between cards', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'range'      => array(
					'px' => array(
						'max'  => 100,
						'step' => 0.1,
					),
					'%'  => array(
						'max'  => 100,
						'step' => 1,
					),
				),
				'selectors'  => array(
					$selector => '--masterstudy-cards-gap: {{SIZE}}{{UNIT}};',
				),
				'condition'  => array(
					'preset' => array( 'style-1', 'style-2', 'style-3' ),
				),
			)
		);

		$this->add_responsive_control(
			'container_background_color',
			array(
				'label'     => esc_html__( 'Background', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					$selector => 'background: {{VALUE}};',
				),
			)
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			array(
				'name'     => 'container_border',
				'label'    => esc_html__( 'Border', 'masterstudy-lms-learning-management-system' ),
				'selector' => $selector,
			)
		);

		$this->add_responsive_control(
			'container_border_radius',
			array(
				'label'      => esc_html__( 'Border radius', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_responsive_control(
			'container_width',
			array(
				'label'      => esc_html__( 'Width', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'width: {{SIZE}}{{UNIT}};',
				),
				'range'      => array(
					'px' => array(
						'max'  => 1000,
						'step' => 0.1,
					),
					'%'  => array(
						'max'  => 100,
						'step' => 1,
					),
				),
			)
		);

		$this->add_responsive_control(
			'container_z_index',
			array(
				'label'     => esc_html__( 'Z-Index', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::NUMBER,
				'min'       => 1,
				'max'       => 99,
				'step'      => 1,
				'selectors' => array(
					$selector => 'z-index: {{VALUE}};',
				),
			)
		);

		$this->end_controls_section();
	}

	private function card_style_section() {
		$this->start_controls_section(
			'card_style_section',
			array(
				'label' => esc_html__( 'Card', 'masterstudy-lms-learning-management-system' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->start_controls_tabs(
			'card_tab'
		);
		$this->start_controls_tab(
			'card_normal_tab',
			array(
				'label' => esc_html__( 'Normal', 'masterstudy-lms-learning-management-system' ),
			)
		);

		$this->card_style_first_variant_controls( 'normal' );
		$this->card_style_second_variant_controls( 'normal' );
		$this->card_style_common_controls();

		$this->end_controls_tab();

		$this->start_controls_tab(
			'card_hover_tab',
			array(
				'label' => esc_html__( 'Hover', 'masterstudy-lms-learning-management-system' ),
			)
		);

		$this->card_style_first_variant_controls( 'hover' );
		$this->card_style_second_variant_controls( 'hover' );
		$this->card_hover_style_common_controls();

		$this->end_controls_tab();
		$this->end_controls_tabs();

		$this->end_controls_section();
	}

	private function category_title_style_section() {
		$condition            = array( 'preset' => array( 'style-4', 'style-5' ) );
		$title_selector       = $this->category_prefix_selector( ' .masterstudy-courses-category__category-title' );
		$title_hover_selector = $this->category_prefix_selector( ':hover .masterstudy-courses-category__category-title' );

		$this->start_controls_section(
			'category_title_style_section',
			array(
				'label'     => esc_html__( 'Category title', 'masterstudy-lms-learning-management-system' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => $condition,
			)
		);

		$this->start_controls_tabs(
			'category_title_tabs'
		);

		$this->start_controls_tab(
			'category_title_normal_tab',
			array(
				'label' => esc_html__( 'Normal', 'masterstudy-lms-learning-management-system' ),
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'category_title_typography',
				'label'    => esc_html__( 'Typography', 'masterstudy-lms-learning-management-system' ),
				'selector' => $title_selector,
			)
		);

		$this->add_control(
			'category_title_font_color',
			array(
				'label'     => esc_html__( 'Color', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					$title_selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_responsive_control(
			'category_title_margin',
			array(
				'label'      => esc_html__( 'Margin', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$title_selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);
		$this->end_controls_tab();

		$this->start_controls_tab(
			'category_title_hover_tab',
			array(
				'label'     => esc_html__( 'Hover', 'masterstudy-lms-learning-management-system' ),
				'condition' => array(
					'preset' => array( 'style-5', 'style-4' ),
				),
			)
		);

		$this->add_control(
			'category_title_font_color_hover',
			array(
				'label'     => esc_html__( 'Color', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					$title_hover_selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();
		$this->end_controls_section();
	}

	private function courses_count_style_section() {
		$condition               = array( 'preset' => array( 'style-4', 'style-5' ) );
		$subtitle_selector       = $this->category_prefix_selector( ' .masterstudy-courses-category__category-subtitle' );
		$subtitle_hover_selector = $this->category_prefix_selector( ':hover .masterstudy-courses-category__category-subtitle' );

		$this->start_controls_section(
			'courses_count_style_section',
			array(
				'label'     => esc_html__( 'Courses count', 'masterstudy-lms-learning-management-system' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => $condition,
			)
		);

		$this->start_controls_tabs(
			'count_tabs'
		);

		$this->start_controls_tab(
			'count_normal_tab',
			array(
				'label' => esc_html__( 'Normal', 'masterstudy-lms-learning-management-system' ),
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'courses_count_typography',
				'label'    => esc_html__( 'Typography', 'masterstudy-lms-learning-management-system' ),
				'selector' => $subtitle_selector,
			)
		);

		$this->add_control(
			'courses_count_font_color',
			array(
				'label'     => esc_html__( 'Color', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					$subtitle_selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_responsive_control(
			'courses_count_margin',
			array(
				'label'      => esc_html__( 'Margin', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$subtitle_selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);
		$this->end_controls_tab();

		$this->start_controls_tab(
			'count_hover_tab',
			array(
				'label'     => esc_html__( 'Hover', 'masterstudy-lms-learning-management-system' ),
				'condition' => array(
					'preset' => array( 'style-5', 'style-4' ),
				),
			)
		);

		$this->add_control(
			'courses_count_font_color_hover',
			array(
				'label'     => esc_html__( 'Color', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					$subtitle_hover_selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();
		$this->end_controls_section();
	}

	private function container_prefix_selector( string $selector ): string {
		return "{{WRAPPER}} .masterstudy-courses-category-widget $selector";
	}

	private function category_prefix_selector( string $selector ): string {
		return $this->container_prefix_selector( ".masterstudy-courses-category__category$selector" );
	}

	private function card_style_first_variant_controls( string $tab ) {
		$condition      = array( 'preset' => array( 'style-1', 'style-2', 'style-3' ) );
		$title_selector = $this->category_prefix_selector( 'normal' === $tab ? ' .masterstudy-courses-category__category-title' : ':hover .masterstudy-courses-category__category-title' );
		$icon_selector  = $this->category_prefix_selector( 'normal' === $tab ? ' .masterstudy-courses-category__category-icon::before' : ':hover .masterstudy-courses-category__category-icon::before' );
		$image_selector = $this->category_prefix_selector( 'normal' === $tab ? ' .masterstudy-courses-category__category-image-icon' : ':hover .masterstudy-courses-category__category-image-icon' );
		$container      = $this->container_prefix_selector( '' );
		$category       = $this->category_prefix_selector( '' );
		$name_postfix   = 'hover' === $tab ? '_hover' : '';

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'      => 'card_typography' . $name_postfix,
				'label'     => esc_html__( 'Typography', 'masterstudy-lms-learning-management-system' ),
				'condition' => $condition,
				'selector'  => $title_selector,
			)
		);

		$this->add_control(
			'card_font_color' . $name_postfix,
			array(
				'label'     => esc_html__( 'Color', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => $condition,
				'selectors' => array(
					$title_selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_control(
			'card_icon_color' . $name_postfix,
			array(
				'label'     => esc_html__( 'Icon color', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => array(
					'preset' => array( 'style-1', 'style-2' ),
				),
				'selectors' => array(
					$icon_selector => 'color: {{VALUE}}',
				),
			)
		);

		$this->add_responsive_control(
			'icon_size' . $name_postfix,
			array(
				'label'      => esc_html__( 'Icon size', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$icon_selector => 'font-size: {{SIZE}}{{UNIT}};',
				),
				'condition'  => array(
					'preset' => array( 'style-1', 'style-2' ),
				),
				'range'      => array(
					'px' => array(
						'max'  => 1000,
						'step' => 0.1,
					),
					'%'  => array(
						'max'  => 100,
						'step' => 1,
					),
				),
			)
		);

		$this->add_responsive_control(
			'image_size' . $name_postfix,
			array(
				'label'      => esc_html__( 'Image size', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$image_selector => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}}',
				),
				'condition'  => array(
					'preset' => array( 'style-3' ),
				),
				'range'      => array(
					'px' => array(
						'max'  => 1000,
						'step' => 0.1,
					),
					'%'  => array(
						'max'  => 100,
						'step' => 1,
					),
				),
			)
		);

		$this->add_control(
			'card_background_1' . $name_postfix,
			array(
				'label'     => esc_html__( 'Background', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					$this->category_prefix_selector( 'hover' === $tab ? ':hover' : '' ) => 'background: {{VALUE}}',
				),
				'condition' => array(
					'preset' => array( 'style-1', 'style-3' ),
				),
			)
		);

		$this->add_responsive_control(
			'card_width',
			array(
				'label'      => esc_html__( 'Card width', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$container => '--card-width: {{SIZE}}{{UNIT}};',
				),
				'condition'  => $condition,
				'range'      => array(
					'px' => array(
						'max'  => 1000,
						'step' => 0.1,
					),
					'%'  => array(
						'max'  => 100,
						'step' => 1,
					),
				),
			)
		);

		$this->add_responsive_control(
			'card_height',
			array(
				'label'      => esc_html__( 'Card height', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$category => 'height: {{SIZE}}{{UNIT}};',
				),
				'condition'  => $condition,
				'range'      => array(
					'px' => array(
						'max'  => 1000,
						'step' => 0.1,
					),
					'%'  => array(
						'max'  => 100,
						'step' => 1,
					),
				),
			)
		);
	}

	private function card_style_second_variant_controls( string $tab ) {
		$image_overlay_selector         = $this->category_prefix_selector( 'normal' === $tab ? '::before' : ':hover::before' );
		$image_style_5_overlay_selector = $this->category_prefix_selector( 'normal' === $tab ? ' .masterstudy-courses-category__category-image-container::before' : ':hover .masterstudy-courses-category__category-image-container::before' );
		$name_postfix                   = 'hover' === $tab ? '_hover' : '';

		$this->add_control(
			'card_image_overlay' . $name_postfix,
			array(
				'label'     => esc_html__( 'Image overlay', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => array(
					'preset' => array( 'style-4' ),
				),
				'selectors' => array(
					$image_overlay_selector => 'background: {{VALUE}}',
				),
			)
		);

		$this->add_control(
			'card_image_style_5_overlay' . $name_postfix,
			array(
				'label'     => esc_html__( 'Image overlay', 'masterstudy-lms-learning-management-system' ),
				'type'      => Controls_Manager::COLOR,
				'condition' => array(
					'preset' => array( 'style-5' ),
				),
				'selectors' => array(
					$image_style_5_overlay_selector => 'background: {{VALUE}}',
				),
			)
		);
	}

	private function card_style_common_controls() {
		$selector = $this->category_prefix_selector( '' );

		$this->add_group_control(
			Group_Control_Border::get_type(),
			array(
				'name'     => 'card_border',
				'label'    => esc_html__( 'Border', 'masterstudy-lms-learning-management-system' ),
				'selector' => $selector,
			)
		);

		$this->add_responsive_control(
			'card_border_radius',
			array(
				'label'      => esc_html__( 'Border radius', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_responsive_control(
			'card_margin',
			array(
				'label'      => esc_html__( 'Margin', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_responsive_control(
			'card_padding',
			array(
				'label'      => esc_html__( 'Padding', 'masterstudy-lms-learning-management-system' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%' ),
				'selectors'  => array(
					$selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			array(
				'name'     => 'card_shadow',
				'selector' => $selector,
			)
		);
	}

	private function card_hover_style_common_controls() {
		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			array(
				'name'     => 'card_shadow_hover',
				'selector' => $this->category_prefix_selector( ':hover' ),
			)
		);
	}

	public function render() {
		$settings = $this->get_settings_for_display();

		$terms = get_terms(
			array(
				'taxonomy'   => Taxonomy::COURSE_CATEGORY,
				'include'    => $settings['taxonomy'],
				'orderby'    => 'include',
				'hide_empty' => false,
			)
		);

		$atts = array(
			'taxonomy' => $settings['taxonomy'],
			'terms'    => $terms,
		);

		\STM_LMS_Templates::show_lms_template( "elementor-widgets/courses-categories/{$settings['preset']}", $atts );
	}
}
