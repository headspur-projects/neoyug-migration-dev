"use strict";

(function ($) {
  $(document).ready(function () {
    document.title = instructor_data.user_login;
    $('.masterstudy-tabs__item').click(function () {
      var tabName = $(this).data('id');
      $(this).addClass('masterstudy-tabs__item_active');
      $(this).siblings().removeClass('masterstudy-tabs__item_active');
      if (tabName === 'reviews') {
        $('.masterstudy-instructor-public__list-header').addClass('masterstudy-instructor-public__list-header_active');
        fetchDataForTab(1, tabName, $('input[name="reviews-search"]').val(), $('#reviews-rating').val());
      } else {
        $('.masterstudy-instructor-public__list-header').removeClass('masterstudy-instructor-public__list-header_active');
        fetchDataForTab(1, tabName);
      }
    });
    var publicFieldsContainer = $('.masterstudy-form-builder-public-fields');
    var publicDescriptionContainer = $('.masterstudy-instructor-public__description');
    if (publicFieldsContainer.length && publicFieldsContainer.html().trim() !== "" || publicDescriptionContainer.length && publicDescriptionContainer.text().trim() !== "") {
      $('.masterstudy-instructor-public__details').css('display', 'flex');
    }
    $('.masterstudy-instructor-public__details').click(function () {
      $('.masterstudy-instructor-public__details-wrapper').toggleClass('masterstudy-instructor-public__details-wrapper_show');
      $(this).toggleClass('masterstudy-instructor-public__details_hide');
    });
    $('.masterstudy-instructor-public__list-pagination').on('click', '.masterstudy-pagination__item-block', function () {
      var currentPageId = $(this).data('id');
      var activeTab = $('.masterstudy-tabs__item_active').data('id');
      if (activeTab === 'reviews') {
        fetchDataForTab(currentPageId, activeTab, $('input[name="reviews-search"]').val(), $('#reviews-rating').val());
      } else {
        fetchDataForTab(currentPageId, activeTab);
      }
    });
    $('.masterstudy-instructor-public__list-pagination').on('click', '.masterstudy-pagination__button-prev, .masterstudy-pagination__button-next', function () {
      if ($(this).hasClass('masterstudy-pagination__button_disabled')) {
        return;
      }
      var currentPageId = parseInt($('.masterstudy-pagination__item_current .masterstudy-pagination__item-block').data('id'));
      var activeTab = $('.masterstudy-tabs__item_active').data('id');
      var newPageId = $(this).hasClass('masterstudy-pagination__button-next') ? currentPageId + 1 : currentPageId - 1;
      if (activeTab === 'reviews') {
        fetchDataForTab(newPageId, activeTab, $('input[name="reviews-search"]').val(), $('#reviews-rating').val());
      } else {
        fetchDataForTab(newPageId, activeTab);
      }
    });
    $('.masterstudy-search__icon').on('click', function () {
      fetchDataForTab(1, 'reviews', $('input[name="reviews-search"]').val(), $('#reviews-rating').val());
    });
    $('input[name="reviews-search"]').on('keypress', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        fetchDataForTab(1, 'reviews', $(this).val(), $('#reviews-rating').val());
      }
    });
    $('.masterstudy-search__clear-icon').on('click', function () {
      fetchDataForTab(1, 'reviews', '', $('#reviews-rating').val());
    });
    $('.masterstudy-select__option, .masterstudy-select__clear').on('click', function () {
      fetchDataForTab(1, 'reviews', $('input[name="reviews-search"]').val(), $(this).data('value'));
    });
    function fetchDataForTab(pageId, tabName) {
      var course = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var rating = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'all';
      var endpoint = '';
      var perPage = instructor_data.courses_per_page;
      if (tabName === 'reviews') {
        perPage = instructor_data.reviews_per_page;
        endpoint = "".concat(ms_lms_resturl, "/instructor-reviews?page=").concat(pageId, "&user=").concat(instructor_data.user, "&pp=").concat(perPage);
        if (course) {
          endpoint += "&course=".concat(encodeURIComponent(course));
        }
        if (rating && rating !== 'all') {
          endpoint += "&rating=".concat(encodeURIComponent(rating));
        }
      } else if (tabName === 'bundles') {
        perPage = instructor_data.bundles_per_page;
        endpoint = "".concat(ms_lms_resturl, "/instructor-bundles?page=").concat(pageId, "&user=").concat(instructor_data.user, "&pp=").concat(perPage);
      } else if (tabName === 'co-owned') {
        perPage = instructor_data.co_owned_per_page;
        endpoint = "".concat(ms_lms_resturl, "/instructor-co-owned-courses?page=").concat(pageId, "&user=").concat(instructor_data.user, "&pp=").concat(perPage);
      } else {
        endpoint = "".concat(ms_lms_resturl, "/instructor-public-courses?page=").concat(pageId, "&user=").concat(instructor_data.user, "&pp=").concat(perPage);
      }
      if (typeof pll_current_language !== 'undefined') {
        endpoint += "&lang=".concat(pll_current_language);
      }
      $('.masterstudy-instructor-public__empty').removeClass('masterstudy-instructor-public__empty_show');
      var ListContainer = $('.masterstudy-instructor-public__list');
      var paginationContainer = $('.masterstudy-instructor-public__list-pagination');
      ListContainer.empty();
      paginationContainer.empty();
      $('.masterstudy-instructor-public__loader').addClass('masterstudy-instructor-public__loader_show');
      $.ajax({
        url: endpoint,
        method: 'GET',
        headers: {
          'X-WP-Nonce': stm_lms_vars.wp_rest_nonce
        },
        dataType: 'json',
        success: function success(data) {
          var items = tabName === 'reviews' ? data['reviews'] : data['courses'];
          if (items && items.length > 0) {
            if (tabName === 'reviews') {
              $('.masterstudy-instructor-public__list-header-total').text(data['total_posts']);
            }
            items.forEach(function (itemHtml) {
              ListContainer.append(itemHtml);
            });
            if (data['pagination']) {
              paginationContainer.append(data['pagination']);
              initializePagination(parseInt(pageId), parseInt(data['total_pages']));
            }
            $('.masterstudy-instructor-public__loader').removeClass('masterstudy-instructor-public__loader_show');
            if (tabName === 'courses') {
              $('.masterstudy-countdown').each(function () {
                $(this).countdown({
                  timestamp: $(this).data('timer')
                });
              });
            }
          } else {
            $('.masterstudy-instructor-public__loader').removeClass('masterstudy-instructor-public__loader_show');
            $('.masterstudy-instructor-public__empty').addClass('masterstudy-instructor-public__empty_show');
          }
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.error('There was a problem with the AJAX operation:', textStatus, errorThrown);
        }
      });
    }
  });
})(jQuery);