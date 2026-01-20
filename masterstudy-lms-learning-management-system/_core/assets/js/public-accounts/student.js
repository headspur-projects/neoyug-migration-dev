"use strict";

(function ($) {
  var statsData = null;
  var isDomReady = false;
  if (student_data.show_stats) {
    fetchStatsData();
  }
  $(document).ready(function () {
    isDomReady = true;
    document.title = student_data.user_login;
    $('.masterstudy-student-public__list-pagination').on('click', '.masterstudy-pagination__item-block', function () {
      var pageId = $(this).data('id');
      fetchCoursesData(pageId);
    });
    var publicFieldsContainer = $('.masterstudy-form-builder-public-fields');
    if (publicFieldsContainer.length && publicFieldsContainer.html().trim() !== "") {
      $('.masterstudy-student-public__details').css('display', 'flex');
    }
    $('.masterstudy-student-public__details').click(function () {
      var fields = $('.masterstudy-form-builder-public-fields');
      if (fields.css('display') === 'none') {
        fields.css('display', 'flex');
      } else {
        fields.css('display', 'none');
      }
      $(this).toggleClass('masterstudy-student-public__details_hide');
    });
    $('.masterstudy-student-public__list-pagination').on('click', '.masterstudy-pagination__button-prev, .masterstudy-pagination__button-next', function () {
      if ($(this).hasClass('masterstudy-pagination__button_disabled')) {
        return;
      }
      var currentPageId = parseInt($('.masterstudy-pagination__item_current .masterstudy-pagination__item-block').data('id'));
      var newPageId = $(this).hasClass('masterstudy-pagination__button-next') ? currentPageId + 1 : currentPageId - 1;
      fetchCoursesData(newPageId);
    });
    function fetchCoursesData(pageId) {
      var endpoint = "".concat(ms_lms_resturl, "/student-courses?page=").concat(pageId, "&user=").concat(student_data.user, "&pp=").concat(student_data.courses_per_page, "&status=completed");
      var ListContainer = $('.masterstudy-student-public__list');
      var paginationContainer = $('.masterstudy-student-public__list-pagination');
      ListContainer.empty();
      paginationContainer.empty();
      $('.masterstudy-student-public__loader').addClass('masterstudy-student-public__loader_show');
      $.ajax({
        url: endpoint,
        method: 'GET',
        headers: {
          'X-WP-Nonce': stm_lms_vars.wp_rest_nonce
        },
        dataType: 'json',
        success: function success(data) {
          var items = data['courses'];
          if (items && items.length > 0) {
            items.forEach(function (itemHtml) {
              ListContainer.append(itemHtml);
            });
            if (data['pagination']) {
              paginationContainer.append(data['pagination']);
              initializePagination(parseInt(pageId), parseInt(data['total_pages']));
            }
          }
          $('.masterstudy-student-public__loader').removeClass('masterstudy-student-public__loader_show');
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.error('There was a problem with the AJAX operation:', textStatus, errorThrown);
        }
      });
    }
    updateStatsContainers();
  });
  function fetchStatsData() {
    var endpoint = "".concat(ms_lms_resturl, "/student/stats/").concat(student_data.user);
    $.ajax({
      url: endpoint,
      method: 'GET',
      headers: {
        'X-WP-Nonce': ms_lms_nonce
      },
      dataType: 'json',
      success: function success(data) {
        statsData = data;
        updateStatsContainers();
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.error('There was a problem with the AJAX operation:', textStatus, errorThrown);
      }
    });
  }
  function updateStatsContainers() {
    if (statsData && isDomReady) {
      updateStatsBlock('.masterstudy-statistics-block_completed_courses', statsData.courses_statuses, 'courses');
      updateStatsBlock('.masterstudy-statistics-block_groups', statsData.courses_types.enterprise_count);
      updateStatsBlock('.masterstudy-statistics-block_certificates', statsData.certificates);
      updateStatsBlock('.masterstudy-statistics-block_quizzes', statsData.total_quizzes);
      updateStatsBlock('.masterstudy-statistics-block_points', statsData.total_points);
      updateStatsBlock('.masterstudy-statistics-block_assignments', statsData.total_assignments);
    }
  }
  function updateStatsBlock(selector, value) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var statsBlock = document.querySelector(selector);
    if (statsBlock) {
      var valueElement = statsBlock.querySelector('.masterstudy-statistics-block__value');
      if (valueElement) {
        if (type === 'courses') {
          valueElement.innerText = value.completed + ' / ' + value.summary;
        } else {
          valueElement.innerText = value;
        }
        statsBlock.querySelector('.masterstudy-stats-loader').style.display = 'none';
      }
    }
  }
})(jQuery);