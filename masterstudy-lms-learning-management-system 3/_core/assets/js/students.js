(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachPaginationClickHandlers = attachPaginationClickHandlers;
exports.bindPerPageHandler = bindPerPageHandler;
exports.renderPagination = renderPagination;
exports.updatePaginationView = updatePaginationView;
window.$ = jQuery;
function updatePaginationView(totalPages, currentPage) {
  $(".masterstudy-pagination__item").removeClass('masterstudy-pagination__item_current').hide();
  var start = Math.max(1, currentPage - 1);
  var end = Math.min(totalPages, currentPage + 1);
  if (currentPage === 1 || start === 1) end = Math.min(totalPages, start + 2);
  if (currentPage === totalPages || end === totalPages) start = Math.max(1, end - 2);
  for (var i = start; i <= end; i++) {
    $(".masterstudy-pagination__item:has([data-id=\"".concat(i, "\"])")).show();
  }
  $(".masterstudy-pagination__item-block[data-id=\"".concat(currentPage, "\"]")).parent().addClass('masterstudy-pagination__item_current');
  $(".masterstudy-pagination__button-next").toggle(currentPage < totalPages);
  $(".masterstudy-pagination__button-prev").toggle(currentPage > 1);
}
function attachPaginationClickHandlers(totalPages, onPageChange, getPerPageSelector) {
  $(".masterstudy-pagination__item-block").off("click").on("click", function () {
    if ($(this).parent().hasClass('masterstudy-pagination__item_current')) {
      return;
    }
    var page = $(this).data("id");
    onPageChange($(getPerPageSelector()).val(), page);
  });
  $(".masterstudy-pagination__button-prev").off("click").on("click", function () {
    var current = $(".masterstudy-pagination__item_current .masterstudy-pagination__item-block").data("id");
    if (current > 1) onPageChange($(getPerPageSelector()).val(), current - 1);
  });
  $(".masterstudy-pagination__button-next").off("click").on("click", function () {
    var current = $(".masterstudy-pagination__item_current .masterstudy-pagination__item-block").data("id");
    var total = $(".masterstudy-pagination__item-block").length;
    if (current < total) onPageChange($(getPerPageSelector()).val(), current + 1);
  });
}
function bindPerPageHandler(containerSelector, perPage, fetchFn) {
  $(".masterstudy-select__option, .masterstudy-select__clear", perPage).off("click").on("click", function () {
    $(containerSelector).remove();
    fetchFn($(this).data("value"));
  });
}
function renderPagination(_ref) {
  var ajaxurl = _ref.ajaxurl,
    nonce = _ref.nonce,
    totalPages = _ref.totalPages,
    currentPage = _ref.currentPage,
    paginationContainer = _ref.paginationContainer,
    onPageChange = _ref.onPageChange,
    getPerPageSelector = _ref.getPerPageSelector;
  $.post(ajaxurl, {
    action: "get_pagination",
    total_pages: totalPages,
    current_page: currentPage,
    _ajax_nonce: nonce
  }, function (response) {
    if (response.success) {
      var $nav = $(paginationContainer);
      $nav.toggle(totalPages > 1).html(response.data.pagination);
      attachPaginationClickHandlers(totalPages, onPageChange, getPerPageSelector);
      updatePaginationView(totalPages, currentPage);
    }
  });
}

},{}],2:[function(require,module,exports){
"use strict";

var _utils = require("../enrolled-quizzes/modules/utils.js");
(function ($) {
  var config = {
      selectors: {
        container: '.masterstudy-table-list-items',
        loading: 'items-loading',
        no_found: '.masterstudy-table-list-no-found__info',
        row: '.masterstudy-table-list__row',
        search_input: '.masterstudy-form-search__input',
        checkboxAll: '#masterstudy-table-list-checkbox',
        checkbox: 'input[name="student[]"]',
        per_page: '#items-per-page',
        navigation: '.masterstudy-table-list-navigation',
        pagination: '.masterstudy-table-list-navigation__pagination',
        perPage: '.masterstudy-table-list-navigation__per-page',
        "export": '[data-id="export-students-to-csv"]',
        selectByCourse: '.filter-students-by-courses',
        deleteBtn: '[data-id="masterstudy-students-delete"]',
        modalDelete: '[data-id="masterstudy-delete-students"]',
        topBar: '.masterstudy-table-list__top-bar'
      },
      templates: {
        no_found: 'masterstudy-table-list-no-found-template',
        row: 'masterstudy-table-list-row-template'
      },
      endpoints: {
        students: '/students/',
        deleting: '/students/delete/',
        courses: '/courses',
        exportStudents: '/export/students/'
      },
      apiBase: ms_lms_resturl,
      nonce: ms_lms_nonce
    },
    totalPages = 1,
    courseId = '';
  $(document).ready(function () {
    if ($('.masterstudy-students-list').length) {
      init();
    }
  });
  function init() {
    (0, _utils.bindPerPageHandler)($(config.selectors.row, config.selectors.container), config.selectors.perPage, fetchItems);
    fetchItems();
    initSearch();
    checkAll();
    deleteStudents();
    searchByCourse();
    exportStudents();
    dateFilter();
    itemsSort();
  }
  function fetchItems() {
    var perPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    var currentPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var orderby = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var order = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var url = config.apiBase + config.endpoints.students;
    var query = [];
    var $input = $(config.selectors.search_input);
    var searchQuery = $input.length ? $input.val().trim() : '';
    var dateFrom = getDateFrom();
    var dateTo = getDateTo();
    query.push("show_all_enrolled=1");
    if (searchQuery) query.push("s=".concat(encodeURIComponent(searchQuery)));
    if (perPage) query.push("per_page=".concat(perPage));
    if (currentPage) query.push("page=".concat(currentPage));
    if (courseId) query.push("course_id=".concat(courseId));
    if (dateFrom) query.push("date_from=".concat(dateFrom));
    if (dateTo) query.push("date_to=".concat(dateTo));
    if (orderby) query.push("orderby=".concat(orderby));
    if (order) query.push("order=".concat(order));
    if (query.length) url += "?".concat(query.join("&"));
    (0, _utils.updatePaginationView)(totalPages, currentPage);
    var $container = $(config.selectors.container);
    $("".concat(config.selectors.row, ", ").concat(config.selectors.no_found), config.selectors.container).remove();
    $container.addClass(config.selectors.loading);
    $(config.selectors.navigation).hide();
    fetch(url, {
      headers: {
        "X-WP-Nonce": config.nonce,
        "Content-Type": "application/json"
      }
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      $container.css("height", "auto").removeClass(config.selectors.loading);
      $("".concat(config.selectors.row, ", ").concat(config.selectors.no_found), config.selectors.container).remove();
      updatePagination(data.pages, currentPage);
      if (!data.students || data.students.length === 0) {
        var template = document.getElementById(config.templates.no_found);
        if (template) {
          var clone = template.content.cloneNode(true);
          $(config.selectors.navigation).hide();
          $container.append(clone);
        }
        return;
      }
      $(config.selectors.navigation).show();
      totalPages = data.pages;
      (data.students || []).forEach(function (item) {
        var html = renderItemTemplate(item);
        $container.append(html);
      });
    })["catch"](function (err) {
      console.error("Error fetching items:", err);
      $container.css("height", "auto").removeClass(config.selectors.loading);
    });
  }
  function renderItemTemplate(item) {
    var template = document.getElementById(config.templates.row);
    if (!template) return '';
    var clone = template.content.cloneNode(true);
    var url = new URL(item.url, window.location.origin);
    clone.querySelector('[name="student[]"]').value = item.user_id;
    if (clone.querySelector('.masterstudy-table-list__row--link')) {
      clone.querySelector('.masterstudy-table-list__row--link').href = url.toString();
    }
    clone.querySelector('.masterstudy-table-list__td--name').textContent = item.display_name;
    clone.querySelector('.masterstudy-table-list__td--email').textContent = item.email;
    clone.querySelector('.masterstudy-table-list__td--joined').textContent = item.registered;
    clone.querySelector('.masterstudy-table-list__td--enrolled').textContent = item.enrolled;
    if (clone.querySelector('.masterstudy-table-list__td--points')) {
      clone.querySelector('.masterstudy-table-list__td--points').textContent = item.points;
    }
    return clone;
  }
  function updatePagination(totalPages, currentPage) {
    (0, _utils.renderPagination)({
      ajaxurl: stm_lms_ajaxurl,
      nonce: config.nonce,
      totalPages: totalPages,
      currentPage: currentPage,
      paginationContainer: config.selectors.pagination,
      onPageChange: fetchItems,
      getPerPageSelector: function getPerPageSelector() {
        return config.selectors.per_page;
      }
    });
  }
  function initSearch() {
    var $input = $(config.selectors.search_input);
    if (!$input.length) return;
    var timer;
    var lastQuery = '';
    $input.off("input").on("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var query = $input.val().trim();
        if (query !== lastQuery) {
          lastQuery = query;
          fetchItems($(config.selectors.per_page).val(), 1);
        }
      }, 300);
    });
  }
  function checkAll() {
    var $selectAll = $(config.selectors.checkboxAll);
    var $deleteBtn = $(config.selectors.deleteBtn);
    if (!$selectAll.length) return;
    function updateDeleteBtn() {
      var anyChecked = $(config.selectors.checkbox).filter(':checked').length > 0;
      $deleteBtn.prop('disabled', !anyChecked);
    }
    $selectAll.on('change', function () {
      var isChecked = this.checked;
      $(config.selectors.checkbox).prop('checked', isChecked).trigger('change');
    });
    $(document).on('change', config.selectors.checkbox, function () {
      var $all = $(config.selectors.checkbox);
      var checkedCnt = $all.filter(':checked').length;
      $selectAll.prop('checked', checkedCnt === $all.length);
      updateDeleteBtn();
    });
    updateDeleteBtn();
  }
  function deleteStudents() {
    var url = config.apiBase + config.endpoints.deleting;
    var _config$selectors = config.selectors,
      checkboxAll = _config$selectors.checkboxAll,
      deleteBtn = _config$selectors.deleteBtn,
      modalDelete = _config$selectors.modalDelete,
      container = _config$selectors.container,
      row = _config$selectors.row,
      no_found = _config$selectors.no_found,
      loading = _config$selectors.loading,
      checkbox = _config$selectors.checkbox,
      per_page = _config$selectors.per_page;
    var students = [];
    $(deleteBtn).on('click', function (e) {
      e.preventDefault();
      students = $('input[name="student[]"]:checked').map(function () {
        return this.value;
      }).get();
      if (students.length) {
        $(modalDelete).addClass('masterstudy-alert_open');
      }
    });
    $(modalDelete).on('click', "[data-id='cancel'], .masterstudy-alert__header-close", function (e) {
      e.preventDefault();
      $(modalDelete).removeClass('masterstudy-alert_open');
    });
    $(modalDelete).on('click', "[data-id='submit']", function (e) {
      e.preventDefault();
      if (!students.length) return;
      $(container).find("".concat(row, ", ").concat(no_found)).remove();
      $(container).addClass(loading);
      $(modalDelete).removeClass('masterstudy-alert_open');
      $(checkbox).prop('checked', false);
      $(config.selectors.navigation).hide();
      $(checkboxAll).prop('checked', false);
      fetch(url, {
        method: 'DELETE',
        headers: {
          'X-WP-Nonce': config.nonce,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          students: students
        })
      }).then(function (res) {
        students = [];
        return res.json().then(function (data) {
          var $msg = $("<div class=\"stm-lms-message error\">".concat(data.message, "</div>"));
          if (['error', 'demo_forbidden_access'].includes(data.status) || 'demo_forbidden_access' === data.error_code) {
            $(config.selectors.topBar).after($msg);
            setTimeout(function () {
              $msg.remove();
            }, 5000);
          }
          return fetchItems($(per_page).val(), 1);
        });
      })["catch"](console.error);
    });
  }
  function searchByCourse() {
    var $input = $(config.selectors.selectByCourse);
    var $parent = $input.parent();
    var apiBase = config.apiBase,
      endpoints = config.endpoints,
      nonce = config.nonce;
    var URL = apiBase + endpoints.courses;
    var PER_PAGE = 20;
    var staticCourses = [];
    var staticTotalPages = 0;
    function fetchCourses() {
      var term = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return $.ajax({
        url: URL,
        method: 'GET',
        dataType: 'json',
        headers: {
          'X-WP-Nonce': nonce
        },
        data: {
          s: term,
          per_page: PER_PAGE,
          current_user: 1,
          page: page
        }
      });
    }
    function truncateWithEllipsis(text) {
      return text.length > 23 ? text.slice(0, 23) + '…' : text;
    }
    fetchCourses().done(function (response) {
      staticCourses = response.courses || [];
      staticTotalPages = parseInt(response.pages, 10) || 0;
    }).always(initSelect2);
    function initSelect2() {
      $parent.removeClass('filter-students-by-courses-default');
      $input.select2({
        dropdownParent: $parent,
        placeholder: $input.data('placeholder'),
        allowClear: true,
        minimumInputLength: 0,
        templateSelection: function templateSelection(data) {
          return truncateWithEllipsis(data.text);
        },
        escapeMarkup: function escapeMarkup(markup) {
          return markup;
        },
        ajax: {
          transport: function transport(params, success, failure) {
            var term = params.data.term || '';
            var page = parseInt(params.data.page, 10) || 1;
            if (!term && page === 1) {
              return success({
                results: staticCourses.map(function (item) {
                  return {
                    id: item.ID,
                    text: item.post_title
                  };
                }),
                pagination: {
                  more: staticTotalPages > 1
                }
              });
            }
            fetchCourses(term, page).done(function (response) {
              return success({
                results: (response.courses || []).map(function (item) {
                  return {
                    id: item.ID,
                    text: item.post_title
                  };
                }),
                pagination: {
                  more: page < (parseInt(response.pages, 10) || 0)
                }
              });
            }).fail(failure);
          },
          delay: 250,
          processResults: function processResults(data) {
            return data;
          },
          cache: true
        }
      });
      $input.on('select2:select select2:clear', function (e) {
        if (e.type === 'select2:select') {
          courseId = e.params.data.id;
        } else if (e.type === 'select2:clear') {
          courseId = null;
        }
        fetchItems($(config.selectors.per_page).val(), 1);
      });
    }
  }
  function exportStudents() {
    $(config.selectors["export"]).on('click', function () {
      var url = config.apiBase + config.endpoints.exportStudents;
      var query = [];
      var $selectByCourse = $(config.selectors.selectByCourse);
      var courseId = $selectByCourse.length ? $selectByCourse.val().trim() : '';
      var $inputSearch = $(config.selectors.search_input);
      var searchQuery = $inputSearch.length ? $inputSearch.val().trim() : '';
      var dateFrom = getDateFrom();
      var dateTo = getDateTo();
      query.push("show_all_enrolled=1");
      query.push("s=".concat(encodeURIComponent(searchQuery)));
      query.push("course_id=".concat(courseId));
      query.push("date_from=".concat(dateFrom));
      query.push("date_to=".concat(dateTo));
      if (query.length) url += "?".concat(query.join("&"));
      fetch(url, {
        headers: {
          "X-WP-Nonce": config.nonce,
          "Content-Type": "application/json"
        }
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        downloadCSV(data);
      })["catch"](function (err) {
        console.error("Error export items:", err);
      });
    });
    function downloadCSV(data) {
      var csv = convertArrayOfObjectsToCSV({
        data: data
      });
      if (!csv) return;
      var filename = "enrolled_students.csv";
      var csvUtf = 'data:text/csv;charset=utf-8,';
      var href = encodeURI(csvUtf + "\uFEFF" + csv);
      var link = document.createElement('a');
      link.setAttribute('href', href);
      link.setAttribute('download', filename);
      link.click();
    }
    function convertArrayOfObjectsToCSV(_ref) {
      var data = _ref.data,
        _ref$columnDelimiter = _ref.columnDelimiter,
        columnDelimiter = _ref$columnDelimiter === void 0 ? ',' : _ref$columnDelimiter,
        _ref$lineDelimiter = _ref.lineDelimiter,
        lineDelimiter = _ref$lineDelimiter === void 0 ? '\r\n' : _ref$lineDelimiter;
      if (!Array.isArray(data) || data.length === 0) return null;
      var keys = Object.keys(data[0]);
      var result = '';
      result += keys.join(columnDelimiter) + lineDelimiter;
      data.forEach(function (item) {
        keys.forEach(function (key, idx) {
          if (idx > 0) result += columnDelimiter;
          var cell = item[key];
          if (Array.isArray(cell)) {
            result += "\"".concat(cell.map(function (item) {
              return decodeStr(item);
            }).join(','), "\"");
          } else {
            cell = cell == null ? '' : String(cell);
            if (cell.includes(columnDelimiter) || cell.includes('"') || cell.includes('\n')) {
              cell = "\"".concat(cell.replace(/"/g, '""'), "\"");
            }
            result += cell;
          }
        });
        result += lineDelimiter;
      });
      return result;
    }
    function decodeStr(str) {
      return str.replace(/&#(\d+);/g, function (_, code) {
        return String.fromCharCode(code);
      });
    }
  }
  function dateFilter() {
    initializeDatepicker('#masterstudy-datepicker-students');
    document.addEventListener('datesUpdated', function () {
      fetchItems();
    });
  }
  function itemsSort() {
    document.addEventListener('msSortIndicatorEvent', function (event) {
      var order = event.detail.sortOrder,
        orderby = event.detail.indicator.parents('.masterstudy-tcell__header').data('sort');
      order = 'none' === order ? 'asc' : order;
      fetchItems($(config.selectors.per_page).val(), 1, orderby, order);
    });
    $('.masterstudy-tcell__title').on('click', function () {
      $('.masterstudy-sort-indicator', $(this).parent()).trigger('click');
    });
  }
})(jQuery);

},{"../enrolled-quizzes/modules/utils.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvZXM2L2Vucm9sbGVkLXF1aXp6ZXMvbW9kdWxlcy91dGlscy5qcyIsImFzc2V0cy9lczYvc3R1ZGVudHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUNBQSxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU07QUFFVixTQUFTLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUU7RUFDMUQsQ0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUMsV0FBVyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDN0YsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQztFQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0VBRS9DLElBQUksV0FBVyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQzNFLElBQUksV0FBVyxLQUFLLFVBQVUsSUFBSSxHQUFHLEtBQUssVUFBVSxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0VBRWxGLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0IsQ0FBQyxpREFBQSxNQUFBLENBQWdELENBQUMsU0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbkU7RUFFQSxDQUFDLGtEQUFBLE1BQUEsQ0FBaUQsV0FBVyxRQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFB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a0NBQWtDLENBQUM7SUFFeEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxZQUFXO01BQ2pELFVBQVUsQ0FBQyxDQUFDO0lBQ2hCLENBQUMsQ0FBQztFQUNOO0VBRUEsU0FBUyxTQUFTLENBQUEsRUFBRztJQUNqQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxLQUFLLEVBQUc7TUFDaEUsSUFBSSxLQUFLLEdBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTO1FBQ2hDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO01BRXZGLEtBQUssR0FBRyxNQUFNLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLO01BQ3hDLFVBQVUsQ0FBRSxDQUFDLENBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBTSxDQUFDO0lBQ3pFLENBQUMsQ0FBQztJQUVGLENBQUMsQ0FBRSwyQkFBNEIsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxPQUFPLEVBQUUsWUFBVztNQUNyRCxDQUFDLENBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFFLENBQUMsQ0FBQyxPQUFPLENBQUUsT0FBUSxDQUFDO0lBQzdFLENBQUMsQ0FBQztFQUNOO0FBQ0osQ0FBQyxFQUFFLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIndpbmRvdy4kID0galF1ZXJ5O1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUGFnaW5hdGlvblZpZXcodG90YWxQYWdlcywgY3VycmVudFBhZ2UpIHtcbiAgICAkKFwiLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW1cIikucmVtb3ZlQ2xhc3MoJ21hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW1fY3VycmVudCcpLmhpZGUoKTtcbiAgICBsZXQgc3RhcnQgPSBNYXRoLm1heCgxLCBjdXJyZW50UGFnZSAtIDEpO1xuICAgIGxldCBlbmQgPSBNYXRoLm1pbih0b3RhbFBhZ2VzLCBjdXJyZW50UGFnZSArIDEpO1xuXG4gICAgaWYgKGN1cnJlbnRQYWdlID09PSAxIHx8IHN0YXJ0ID09PSAxKSBlbmQgPSBNYXRoLm1pbih0b3RhbFBhZ2VzLCBzdGFydCArIDIpO1xuICAgIGlmIChjdXJyZW50UGFnZSA9PT0gdG90YWxQYWdlcyB8fCBlbmQgPT09IHRvdGFsUGFnZXMpIHN0YXJ0ID0gTWF0aC5tYXgoMSwgZW5kIC0gMik7XG5cbiAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgJChgLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW06aGFzKFtkYXRhLWlkPVwiJHtpfVwiXSlgKS5zaG93KCk7XG4gICAgfVxuXG4gICAgJChgLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW0tYmxvY2tbZGF0YS1pZD1cIiR7Y3VycmVudFBhZ2V9XCJdYCkucGFyZW50KCkuYWRkQ2xhc3MoICdtYXN0ZXJzdHVkeS1wYWdpbmF0aW9uX19pdGVtX2N1cnJlbnQnICk7XG4gICAgJChcIi5tYXN0ZXJzdHVkeS1wYWdpbmF0aW9uX19idXR0b24tbmV4dFwiKS50b2dnbGUoY3VycmVudFBhZ2UgPCB0b3RhbFBhZ2VzKTtcbiAgICAkKFwiLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2J1dHRvbi1wcmV2XCIpLnRvZ2dsZShjdXJyZW50UGFnZSA+IDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNoUGFnaW5hdGlvbkNsaWNrSGFuZGxlcnModG90YWxQYWdlcywgb25QYWdlQ2hhbmdlLCBnZXRQZXJQYWdlU2VsZWN0b3IpIHtcbiAgICAkKFwiLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW0tYmxvY2tcIikub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICggJCh0aGlzKS5wYXJlbnQoKS5oYXNDbGFzcyggJ21hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW1fY3VycmVudCcgKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhZ2UgPSAkKHRoaXMpLmRhdGEoXCJpZFwiKTtcbiAgICAgICAgb25QYWdlQ2hhbmdlKCQoZ2V0UGVyUGFnZVNlbGVjdG9yKCkpLnZhbCgpLCBwYWdlKTtcbiAgICB9KTtcblxuICAgICQoXCIubWFzdGVyc3R1ZHktcGFnaW5hdGlvbl9fYnV0dG9uLXByZXZcIikub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSAkKFwiLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW1fY3VycmVudCAubWFzdGVyc3R1ZHktcGFnaW5hdGlvbl9faXRlbS1ibG9ja1wiKS5kYXRhKFwiaWRcIik7XG4gICAgICAgIGlmIChjdXJyZW50ID4gMSkgb25QYWdlQ2hhbmdlKCQoZ2V0UGVyUGFnZVNlbGVjdG9yKCkpLnZhbCgpLCBjdXJyZW50IC0gMSk7XG4gICAgfSk7XG5cbiAgICAkKFwiLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2J1dHRvbi1uZXh0XCIpLm9mZihcImNsaWNrXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gJChcIi5tYXN0ZXJzdHVkeS1wYWdpbmF0aW9uX19pdGVtX2N1cnJlbnQgLm1hc3RlcnN0dWR5LXBhZ2luYXRpb25fX2l0ZW0tYmxvY2tcIikuZGF0YShcImlkXCIpO1xuICAgICAgICBjb25zdCB0b3RhbCA9ICQoXCIubWFzdGVyc3R1ZHktcGFnaW5hdGlvbl9faXRlbS1ibG9ja1wiKS5sZW5ndGg7XG4gICAgICAgIGlmIChjdXJyZW50IDwgdG90YWwpIG9uUGFnZUNoYW5nZSgkKGdldFBlclBhZ2VTZWxlY3RvcigpKS52YWwoKSwgY3VycmVudCArIDEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZFBlclBhZ2VIYW5kbGVyKGNvbnRhaW5lclNlbGVjdG9yLCBwZXJQYWdlLCBmZXRjaEZuKSB7XG4gICAgJChcIi5tYXN0ZXJzdHVkeS1zZWxlY3RfX29wdGlvbiwgLm1hc3RlcnN0dWR5LXNlbGVjdF9fY2xlYXJcIiwgcGVyUGFnZSkub2ZmKFwiY2xpY2tcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoY29udGFpbmVyU2VsZWN0b3IpLnJlbW92ZSgpO1xuICAgICAgICBmZXRjaEZuKCQodGhpcykuZGF0YShcInZhbHVlXCIpKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclBhZ2luYXRpb24oe1xuICAgIGFqYXh1cmwsXG4gICAgbm9uY2UsXG4gICAgdG90YWxQYWdlcyxcbiAgICBjdXJyZW50UGFnZSxcbiAgICBwYWdpbmF0aW9uQ29udGFpbmVyLFxuICAgIG9uUGFnZUNoYW5nZSxcbiAgICBnZXRQZXJQYWdlU2VsZWN0b3IsXG59KSB7XG4gICAgJC5wb3N0KGFqYXh1cmwsIHtcbiAgICAgICAgYWN0aW9uOiBcImdldF9wYWdpbmF0aW9uXCIsXG4gICAgICAgIHRvdGFsX3BhZ2VzOiB0b3RhbFBhZ2VzLFxuICAgICAgICBjdXJyZW50X3BhZ2U6IGN1cnJlbnRQYWdlLFxuICAgICAgICBfYWpheF9ub25jZTogbm9uY2UsXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICBjb25zdCAkbmF2ID0gJChwYWdpbmF0aW9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgICRuYXYudG9nZ2xlKHRvdGFsUGFnZXMgPiAxKS5odG1sKHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbik7XG4gICAgICAgICAgICBhdHRhY2hQYWdpbmF0aW9uQ2xpY2tIYW5kbGVycyh0b3RhbFBhZ2VzLCBvblBhZ2VDaGFuZ2UsIGdldFBlclBhZ2VTZWxlY3Rvcik7XG4gICAgICAgICAgICB1cGRhdGVQYWdpbmF0aW9uVmlldyh0b3RhbFBhZ2VzLCBjdXJyZW50UGFnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7YmluZFBlclBhZ2VIYW5kbGVyLCByZW5kZXJQYWdpbmF0aW9uLCB1cGRhdGVQYWdpbmF0aW9uVmlld30gZnJvbSAnLi4vZW5yb2xsZWQtcXVpenplcy9tb2R1bGVzL3V0aWxzLmpzJztcblxuKGZ1bmN0aW9uKCQpIHtcbiAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICBzZWxlY3RvcnM6IHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJy5tYXN0ZXJzdHVkeS10YWJsZS1saXN0LWl0ZW1zJyxcbiAgICAgICAgICAgIGxvYWRpbmc6ICdpdGVtcy1sb2FkaW5nJyxcbiAgICAgICAgICAgIG5vX2ZvdW5kOiAnLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3Qtbm8tZm91bmRfX2luZm8nLFxuICAgICAgICAgICAgcm93OiAnLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3RfX3JvdycsXG4gICAgICAgICAgICBzZWFyY2hfaW5wdXQ6ICcubWFzdGVyc3R1ZHktZm9ybS1zZWFyY2hfX2lucHV0JyxcbiAgICAgICAgICAgIGNoZWNrYm94QWxsOiAnI21hc3RlcnN0dWR5LXRhYmxlLWxpc3QtY2hlY2tib3gnLFxuICAgICAgICAgICAgY2hlY2tib3g6ICdpbnB1dFtuYW1lPVwic3R1ZGVudFtdXCJdJyxcbiAgICAgICAgICAgIHBlcl9wYWdlOiAnI2l0ZW1zLXBlci1wYWdlJyxcbiAgICAgICAgICAgIG5hdmlnYXRpb246ICcubWFzdGVyc3R1ZHktdGFibGUtbGlzdC1uYXZpZ2F0aW9uJyxcbiAgICAgICAgICAgIHBhZ2luYXRpb246ICcubWFzdGVyc3R1ZHktdGFibGUtbGlzdC1uYXZpZ2F0aW9uX19wYWdpbmF0aW9uJyxcbiAgICAgICAgICAgIHBlclBhZ2U6ICcubWFzdGVyc3R1ZHktdGFibGUtbGlzdC1uYXZpZ2F0aW9uX19wZXItcGFnZScsXG4gICAgICAgICAgICBleHBvcnQ6ICdbZGF0YS1pZD1cImV4cG9ydC1zdHVkZW50cy10by1jc3ZcIl0nLFxuICAgICAgICAgICAgc2VsZWN0QnlDb3Vyc2U6ICcuZmlsdGVyLXN0dWRlbnRzLWJ5LWNvdXJzZXMnLFxuICAgICAgICAgICAgZGVsZXRlQnRuOiAnW2RhdGEtaWQ9XCJtYXN0ZXJzdHVkeS1zdHVkZW50cy1kZWxldGVcIl0nLFxuICAgICAgICAgICAgbW9kYWxEZWxldGU6ICdbZGF0YS1pZD1cIm1hc3RlcnN0dWR5LWRlbGV0ZS1zdHVkZW50c1wiXScsXG4gICAgICAgICAgICB0b3BCYXI6ICcubWFzdGVyc3R1ZHktdGFibGUtbGlzdF9fdG9wLWJhcidcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVzOiB7XG4gICAgICAgICAgbm9fZm91bmQ6ICdtYXN0ZXJzdHVkeS10YWJsZS1saXN0LW5vLWZvdW5kLXRlbXBsYXRlJyxcbiAgICAgICAgICByb3c6ICdtYXN0ZXJzdHVkeS10YWJsZS1saXN0LXJvdy10ZW1wbGF0ZScsXG4gICAgICAgIH0sXG4gICAgICAgIGVuZHBvaW50czoge1xuICAgICAgICAgICAgc3R1ZGVudHM6ICcvc3R1ZGVudHMvJyxcbiAgICAgICAgICAgIGRlbGV0aW5nOiAnL3N0dWRlbnRzL2RlbGV0ZS8nLFxuICAgICAgICAgICAgY291cnNlczogJy9jb3Vyc2VzJyxcbiAgICAgICAgICAgIGV4cG9ydFN0dWRlbnRzOiAnL2V4cG9ydC9zdHVkZW50cy8nXG4gICAgICAgIH0sXG4gICAgICAgIGFwaUJhc2U6IG1zX2xtc19yZXN0dXJsLFxuICAgICAgICBub25jZTogbXNfbG1zX25vbmNlLFxuICAgIH0sXG4gICAgdG90YWxQYWdlcyA9IDEsXG4gICAgY291cnNlSWQgPSAnJztcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoICQoICcubWFzdGVyc3R1ZHktc3R1ZGVudHMtbGlzdCcgKS5sZW5ndGggKSB7XG4gICAgICAgICAgICBpbml0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGJpbmRQZXJQYWdlSGFuZGxlcigkKCBjb25maWcuc2VsZWN0b3JzLnJvdywgY29uZmlnLnNlbGVjdG9ycy5jb250YWluZXIgKSwgY29uZmlnLnNlbGVjdG9ycy5wZXJQYWdlLCBmZXRjaEl0ZW1zKTtcbiAgICAgICAgZmV0Y2hJdGVtcygpO1xuICAgICAgICBpbml0U2VhcmNoKCk7XG4gICAgICAgIGNoZWNrQWxsKCk7XG4gICAgICAgIGRlbGV0ZVN0dWRlbnRzKCk7XG4gICAgICAgIHNlYXJjaEJ5Q291cnNlKCk7XG4gICAgICAgIGV4cG9ydFN0dWRlbnRzKCk7XG4gICAgICAgIGRhdGVGaWx0ZXIoKTtcbiAgICAgICAgaXRlbXNTb3J0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmV0Y2hJdGVtcyggcGVyUGFnZSA9IHVuZGVmaW5lZCwgY3VycmVudFBhZ2UgPSAxLCBvcmRlcmJ5ID0gJycsIG9yZGVyID0gJycgKSB7XG4gICAgICAgIGxldCB1cmwgPSBjb25maWcuYXBpQmFzZSArIGNvbmZpZy5lbmRwb2ludHMuc3R1ZGVudHM7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gW107XG4gICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoIGNvbmZpZy5zZWxlY3RvcnMuc2VhcmNoX2lucHV0ICk7XG4gICAgICAgIGNvbnN0IHNlYXJjaFF1ZXJ5ID0gJGlucHV0Lmxlbmd0aCA/ICRpbnB1dC52YWwoKS50cmltKCkgOiAnJztcbiAgICAgICAgY29uc3QgZGF0ZUZyb20gPSBnZXREYXRlRnJvbSgpO1xuICAgICAgICBjb25zdCBkYXRlVG8gPSBnZXREYXRlVG8oKTtcblxuICAgICAgICBxdWVyeS5wdXNoKGBzaG93X2FsbF9lbnJvbGxlZD0xYCk7XG5cbiAgICAgICAgaWYgKHNlYXJjaFF1ZXJ5KSBxdWVyeS5wdXNoKGBzPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHNlYXJjaFF1ZXJ5KX1gKTtcbiAgICAgICAgaWYgKHBlclBhZ2UpIHF1ZXJ5LnB1c2goYHBlcl9wYWdlPSR7cGVyUGFnZX1gKTtcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlKSBxdWVyeS5wdXNoKGBwYWdlPSR7Y3VycmVudFBhZ2V9YCk7XG4gICAgICAgIGlmIChjb3Vyc2VJZCkgcXVlcnkucHVzaChgY291cnNlX2lkPSR7Y291cnNlSWR9YCk7XG4gICAgICAgIGlmIChkYXRlRnJvbSkgcXVlcnkucHVzaChgZGF0ZV9mcm9tPSR7ZGF0ZUZyb219YCk7XG4gICAgICAgIGlmIChkYXRlVG8pIHF1ZXJ5LnB1c2goYGRhdGVfdG89JHtkYXRlVG99YCk7XG4gICAgICAgIGlmIChvcmRlcmJ5KSBxdWVyeS5wdXNoKGBvcmRlcmJ5PSR7b3JkZXJieX1gKTtcbiAgICAgICAgaWYgKG9yZGVyKSBxdWVyeS5wdXNoKGBvcmRlcj0ke29yZGVyfWApO1xuICAgICAgICBpZiAocXVlcnkubGVuZ3RoKSB1cmwgKz0gYD8ke3F1ZXJ5LmpvaW4oXCImXCIpfWA7XG5cbiAgICAgICAgdXBkYXRlUGFnaW5hdGlvblZpZXcoIHRvdGFsUGFnZXMsIGN1cnJlbnRQYWdlICk7XG5cbiAgICAgICAgY29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbmZpZy5zZWxlY3RvcnMuY29udGFpbmVyICk7XG5cbiAgICAgICAgJCggYCR7Y29uZmlnLnNlbGVjdG9ycy5yb3d9LCAke2NvbmZpZy5zZWxlY3RvcnMubm9fZm91bmR9YCwgY29uZmlnLnNlbGVjdG9ycy5jb250YWluZXIgKS5yZW1vdmUoKTtcblxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCBjb25maWcuc2VsZWN0b3JzLmxvYWRpbmcgKTtcbiAgICAgICAgJCggY29uZmlnLnNlbGVjdG9ycy5uYXZpZ2F0aW9uICkuaGlkZSgpO1xuXG4gICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiWC1XUC1Ob25jZVwiOiBjb25maWcubm9uY2UsXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAkY29udGFpbmVyLmNzcyhcImhlaWdodFwiLCBcImF1dG9cIikucmVtb3ZlQ2xhc3MoIGNvbmZpZy5zZWxlY3RvcnMubG9hZGluZyApO1xuICAgICAgICAgICAgJCggYCR7Y29uZmlnLnNlbGVjdG9ycy5yb3d9LCAke2NvbmZpZy5zZWxlY3RvcnMubm9fZm91bmR9YCwgY29uZmlnLnNlbGVjdG9ycy5jb250YWluZXIgKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgdXBkYXRlUGFnaW5hdGlvbihkYXRhLnBhZ2VzLCBjdXJyZW50UGFnZSk7XG5cbiAgICAgICAgICAgIGlmICghZGF0YS5zdHVkZW50cyB8fCBkYXRhLnN0dWRlbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNvbmZpZy50ZW1wbGF0ZXMubm9fZm91bmQgKTtcbiAgICAgICAgICAgICAgICBpZiAoIHRlbXBsYXRlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAkKCBjb25maWcuc2VsZWN0b3JzLm5hdmlnYXRpb24gKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuYXBwZW5kKGNsb25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKCBjb25maWcuc2VsZWN0b3JzLm5hdmlnYXRpb24gKS5zaG93KCk7XG5cbiAgICAgICAgICAgIHRvdGFsUGFnZXMgPSBkYXRhLnBhZ2VzO1xuICAgICAgICAgICAgKGRhdGEuc3R1ZGVudHMgfHwgW10pLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IHJlbmRlckl0ZW1UZW1wbGF0ZShpdGVtKTtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFwcGVuZChodG1sKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBpdGVtczpcIiwgZXJyKTtcbiAgICAgICAgICAgICRjb250YWluZXIuY3NzKFwiaGVpZ2h0XCIsIFwiYXV0b1wiKS5yZW1vdmVDbGFzcyggY29uZmlnLnNlbGVjdG9ycy5sb2FkaW5nICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckl0ZW1UZW1wbGF0ZShpdGVtKSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29uZmlnLnRlbXBsYXRlcy5yb3cpO1xuICAgICAgICBpZiAoIXRlbXBsYXRlKSByZXR1cm4gJyc7XG4gICAgICAgIGNvbnN0IGNsb25lID0gdGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCggaXRlbS51cmwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKTtcblxuICAgICAgICBjbG9uZS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInN0dWRlbnRbXVwiXScpLnZhbHVlID0gaXRlbS51c2VyX2lkO1xuICAgICAgICBpZiAoIGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5tYXN0ZXJzdHVkeS10YWJsZS1saXN0X19yb3ctLWxpbmsnKSApIHtcbiAgICAgICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3IoJy5tYXN0ZXJzdHVkeS10YWJsZS1saXN0X19yb3ctLWxpbmsnKS5ocmVmID0gdXJsLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvcignLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3RfX3RkLS1uYW1lJykudGV4dENvbnRlbnQgPSBpdGVtLmRpc3BsYXlfbmFtZTtcbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvcignLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3RfX3RkLS1lbWFpbCcpLnRleHRDb250ZW50ID0gaXRlbS5lbWFpbDtcbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvcignLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3RfX3RkLS1qb2luZWQnKS50ZXh0Q29udGVudCA9IGl0ZW0ucmVnaXN0ZXJlZDtcbiAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvcignLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3RfX3RkLS1lbnJvbGxlZCcpLnRleHRDb250ZW50ID0gaXRlbS5lbnJvbGxlZDtcbiAgICAgICAgaWYgKCBjbG9uZS5xdWVyeVNlbGVjdG9yKCcubWFzdGVyc3R1ZHktdGFibGUtbGlzdF9fdGQtLXBvaW50cycpICkge1xuICAgICAgICAgICAgY2xvbmUucXVlcnlTZWxlY3RvcignLm1hc3RlcnN0dWR5LXRhYmxlLWxpc3RfX3RkLS1wb2ludHMnKS50ZXh0Q29udGVudCA9IGl0ZW0ucG9pbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2luYXRpb24odG90YWxQYWdlcywgY3VycmVudFBhZ2UpIHtcbiAgICAgICAgcmVuZGVyUGFnaW5hdGlvbih7XG4gICAgICAgICAgICBhamF4dXJsOiBzdG1fbG1zX2FqYXh1cmwsXG4gICAgICAgICAgICBub25jZTogY29uZmlnLm5vbmNlLFxuICAgICAgICAgICAgdG90YWxQYWdlcyxcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlLFxuICAgICAgICAgICAgcGFnaW5hdGlvbkNvbnRhaW5lcjogY29uZmlnLnNlbGVjdG9ycy5wYWdpbmF0aW9uLFxuICAgICAgICAgICAgb25QYWdlQ2hhbmdlOiBmZXRjaEl0ZW1zLFxuICAgICAgICAgICAgZ2V0UGVyUGFnZVNlbGVjdG9yOiAoKSA9PiBjb25maWcuc2VsZWN0b3JzLnBlcl9wYWdlLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0U2VhcmNoKCkge1xuICAgICAgICBjb25zdCAkaW5wdXQgPSAkKCBjb25maWcuc2VsZWN0b3JzLnNlYXJjaF9pbnB1dCApO1xuICAgICAgICBpZiAoICEgJGlucHV0Lmxlbmd0aCApIHJldHVybjtcblxuICAgICAgICBsZXQgdGltZXI7XG4gICAgICAgIGxldCBsYXN0UXVlcnkgPSAnJztcblxuICAgICAgICAkaW5wdXQub2ZmKFwiaW5wdXRcIikub24oXCJpbnB1dFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeSA9ICRpbnB1dC52YWwoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXJ5ICE9PSBsYXN0UXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFF1ZXJ5ID0gcXVlcnk7XG4gICAgICAgICAgICAgICAgICAgIGZldGNoSXRlbXMoJCggY29uZmlnLnNlbGVjdG9ycy5wZXJfcGFnZSApLnZhbCgpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0FsbCgpIHtcbiAgICAgICAgY29uc3QgJHNlbGVjdEFsbCA9ICQoY29uZmlnLnNlbGVjdG9ycy5jaGVja2JveEFsbCk7XG4gICAgICAgIGNvbnN0ICRkZWxldGVCdG4gPSAkKGNvbmZpZy5zZWxlY3RvcnMuZGVsZXRlQnRuKTtcblxuICAgICAgICBpZiAoICEgJHNlbGVjdEFsbC5sZW5ndGggKSByZXR1cm47XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlRGVsZXRlQnRuKCkge1xuICAgICAgICAgICAgY29uc3QgYW55Q2hlY2tlZCA9ICQoY29uZmlnLnNlbGVjdG9ycy5jaGVja2JveCkuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAkZGVsZXRlQnRuLnByb3AoJ2Rpc2FibGVkJywgIWFueUNoZWNrZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNlbGVjdEFsbC5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBpc0NoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICAgICAgICAkKGNvbmZpZy5zZWxlY3RvcnMuY2hlY2tib3gpLnByb3AoJ2NoZWNrZWQnLCBpc0NoZWNrZWQpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgY29uZmlnLnNlbGVjdG9ycy5jaGVja2JveCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCAkYWxsID0gJChjb25maWcuc2VsZWN0b3JzLmNoZWNrYm94KTtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWRDbnQgPSAkYWxsLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICRzZWxlY3RBbGwucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWRDbnQgPT09ICRhbGwubGVuZ3RoKTtcblxuICAgICAgICAgICAgdXBkYXRlRGVsZXRlQnRuKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVwZGF0ZURlbGV0ZUJ0bigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlbGV0ZVN0dWRlbnRzKCkge1xuICAgICAgICBjb25zdCB1cmwgPSBjb25maWcuYXBpQmFzZSArIGNvbmZpZy5lbmRwb2ludHMuZGVsZXRpbmc7XG4gICAgICAgIGNvbnN0IHtjaGVja2JveEFsbCwgZGVsZXRlQnRuLCBtb2RhbERlbGV0ZSwgY29udGFpbmVyLCByb3csIG5vX2ZvdW5kLCBsb2FkaW5nLCBjaGVja2JveCwgcGVyX3BhZ2V9ID0gY29uZmlnLnNlbGVjdG9ycztcblxuICAgICAgICBsZXQgc3R1ZGVudHMgPSBbXTtcblxuICAgICAgICAkKGRlbGV0ZUJ0bikub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzdHVkZW50cyA9ICQoJ2lucHV0W25hbWU9XCJzdHVkZW50W11cIl06Y2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudmFsdWU7IH0pXG4gICAgICAgICAgICAgICAgLmdldCgpO1xuXG4gICAgICAgICAgICBpZiAoc3R1ZGVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJChtb2RhbERlbGV0ZSkuYWRkQ2xhc3MoJ21hc3RlcnN0dWR5LWFsZXJ0X29wZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChtb2RhbERlbGV0ZSkub24oJ2NsaWNrJywgXCJbZGF0YS1pZD0nY2FuY2VsJ10sIC5tYXN0ZXJzdHVkeS1hbGVydF9faGVhZGVyLWNsb3NlXCIsIGUgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJChtb2RhbERlbGV0ZSkucmVtb3ZlQ2xhc3MoJ21hc3RlcnN0dWR5LWFsZXJ0X29wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChtb2RhbERlbGV0ZSkub24oJ2NsaWNrJywgXCJbZGF0YS1pZD0nc3VibWl0J11cIiwgZSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoIXN0dWRlbnRzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAkKGNvbnRhaW5lcikuZmluZChgJHtyb3d9LCAke25vX2ZvdW5kfWApLnJlbW92ZSgpO1xuICAgICAgICAgICAgJChjb250YWluZXIpLmFkZENsYXNzKGxvYWRpbmcpO1xuICAgICAgICAgICAgJChtb2RhbERlbGV0ZSkucmVtb3ZlQ2xhc3MoJ21hc3RlcnN0dWR5LWFsZXJ0X29wZW4nKTtcbiAgICAgICAgICAgICQoY2hlY2tib3gpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKCBjb25maWcuc2VsZWN0b3JzLm5hdmlnYXRpb24gKS5oaWRlKCk7XG4gICAgICAgICAgICAkKGNoZWNrYm94QWxsKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuXG4gICAgICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1gtV1AtTm9uY2UnOiBjb25maWcubm9uY2UsXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHN0dWRlbnRzIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBzdHVkZW50cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJG1zZyA9ICQoYDxkaXYgY2xhc3M9XCJzdG0tbG1zLW1lc3NhZ2UgZXJyb3JcIj4ke2RhdGEubWVzc2FnZX08L2Rpdj5gKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIFsnZXJyb3InLCAnZGVtb19mb3JiaWRkZW5fYWNjZXNzJ10uaW5jbHVkZXMoIGRhdGEuc3RhdHVzICkgfHwgJ2RlbW9fZm9yYmlkZGVuX2FjY2VzcycgPT09IGRhdGEuZXJyb3JfY29kZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoIGNvbmZpZy5zZWxlY3RvcnMudG9wQmFyICkuYWZ0ZXIoICRtc2cgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7ICRtc2cucmVtb3ZlKCk7IH0sIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoSXRlbXMoICQocGVyX3BhZ2UpLnZhbCgpLCAxICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZWFyY2hCeUNvdXJzZSgpIHtcbiAgICAgICAgY29uc3QgJGlucHV0ICA9ICQoIGNvbmZpZy5zZWxlY3RvcnMuc2VsZWN0QnlDb3Vyc2UgKTtcbiAgICAgICAgY29uc3QgJHBhcmVudCA9ICRpbnB1dC5wYXJlbnQoKTtcbiAgICAgICAgY29uc3QgeyBhcGlCYXNlLCBlbmRwb2ludHMsIG5vbmNlIH0gPSBjb25maWc7XG4gICAgICAgIGNvbnN0IFVSTCAgICAgICA9IGFwaUJhc2UgKyBlbmRwb2ludHMuY291cnNlcztcbiAgICAgICAgY29uc3QgUEVSX1BBR0UgID0gMjA7XG5cbiAgICAgICAgbGV0IHN0YXRpY0NvdXJzZXMgICAgPSBbXTtcbiAgICAgICAgbGV0IHN0YXRpY1RvdGFsUGFnZXMgPSAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIGZldGNoQ291cnNlcyh0ZXJtID0gJycsIHBhZ2UgPSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICAgICAgVVJMLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogICAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6ICB7ICdYLVdQLU5vbmNlJzogbm9uY2UgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHM6ICAgICAgICB0ZXJtLFxuICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogUEVSX1BBR0UsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdXNlcjogMSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogICAgIHBhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRydW5jYXRlV2l0aEVsbGlwc2lzKCB0ZXh0ICkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQubGVuZ3RoID4gMjMgPyB0ZXh0LnNsaWNlKDAsIDIzKSArICfigKYnIDogdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZldGNoQ291cnNlcygpXG4gICAgICAgICAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgc3RhdGljQ291cnNlcyAgICA9IHJlc3BvbnNlLmNvdXJzZXMgfHwgW107XG4gICAgICAgICAgICAgICAgc3RhdGljVG90YWxQYWdlcyA9IHBhcnNlSW50KHJlc3BvbnNlLnBhZ2VzLCAxMCkgfHwgMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGluaXRTZWxlY3QyKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcbiAgICAgICAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoICdmaWx0ZXItc3R1ZGVudHMtYnktY291cnNlcy1kZWZhdWx0JyApO1xuXG4gICAgICAgICAgICAkaW5wdXQuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgZHJvcGRvd25QYXJlbnQ6ICAgICAkcGFyZW50LFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAgICAgICAgJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyJyksXG4gICAgICAgICAgICAgICAgYWxsb3dDbGVhcjogICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICAgIG1pbmltdW1JbnB1dExlbmd0aDogMCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNlbGVjdGlvbjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1bmNhdGVXaXRoRWxsaXBzaXMoIGRhdGEudGV4dCApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXNjYXBlTWFya3VwOiBmdW5jdGlvbihtYXJrdXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hcmt1cDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFqYXg6IHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0OiBmdW5jdGlvbihwYXJhbXMsIHN1Y2Nlc3MsIGZhaWx1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlcm0gPSBwYXJhbXMuZGF0YS50ZXJtIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHBhcmFtcy5kYXRhLnBhZ2UsIDEwKSB8fCAxO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRlcm0gJiYgcGFnZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0czogc3RhdGljQ291cnNlcy5tYXAoaXRlbSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICAgaXRlbS5JRCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGl0ZW0ucG9zdF90aXRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcmU6IHN0YXRpY1RvdGFsUGFnZXMgPiAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hDb3Vyc2VzKHRlcm0sIHBhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4gc3VjY2Vzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHM6IChyZXNwb25zZS5jb3Vyc2VzIHx8IFtdKS5tYXAoaXRlbSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICAgaXRlbS5JRCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGl0ZW0ucG9zdF90aXRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vcmU6IHBhZ2UgPCAocGFyc2VJbnQocmVzcG9uc2UucGFnZXMsIDEwKSB8fCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZmFpbHVyZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiAyNTAsXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NSZXN1bHRzOiBkYXRhID0+IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaW5wdXQub24oJ3NlbGVjdDI6c2VsZWN0IHNlbGVjdDI6Y2xlYXInLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gJ3NlbGVjdDI6c2VsZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb3Vyc2VJZCA9IGUucGFyYW1zLmRhdGEuaWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICdzZWxlY3QyOmNsZWFyJykge1xuICAgICAgICAgICAgICAgICAgICBjb3Vyc2VJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZmV0Y2hJdGVtcygkKCBjb25maWcuc2VsZWN0b3JzLnBlcl9wYWdlICkudmFsKCksIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBvcnRTdHVkZW50cygpIHtcbiAgICAgICAgJCggY29uZmlnLnNlbGVjdG9ycy5leHBvcnQgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHVybCA9IGNvbmZpZy5hcGlCYXNlICsgY29uZmlnLmVuZHBvaW50cy5leHBvcnRTdHVkZW50cztcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5ID0gW107XG4gICAgICAgICAgICBjb25zdCAkc2VsZWN0QnlDb3Vyc2UgPSAkKCBjb25maWcuc2VsZWN0b3JzLnNlbGVjdEJ5Q291cnNlICk7XG4gICAgICAgICAgICBjb25zdCBjb3Vyc2VJZCA9ICRzZWxlY3RCeUNvdXJzZS5sZW5ndGggPyAkc2VsZWN0QnlDb3Vyc2UudmFsKCkudHJpbSgpIDogJyc7XG4gICAgICAgICAgICBjb25zdCAkaW5wdXRTZWFyY2ggPSAkKCBjb25maWcuc2VsZWN0b3JzLnNlYXJjaF9pbnB1dCApO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoUXVlcnkgPSAkaW5wdXRTZWFyY2gubGVuZ3RoID8gJGlucHV0U2VhcmNoLnZhbCgpLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgY29uc3QgZGF0ZUZyb20gPSBnZXREYXRlRnJvbSgpO1xuICAgICAgICAgICAgY29uc3QgZGF0ZVRvID0gZ2V0RGF0ZVRvKCk7XG5cbiAgICAgICAgICAgIHF1ZXJ5LnB1c2goYHNob3dfYWxsX2Vucm9sbGVkPTFgKTtcbiAgICAgICAgICAgIHF1ZXJ5LnB1c2goYHM9JHtlbmNvZGVVUklDb21wb25lbnQoc2VhcmNoUXVlcnkpfWApO1xuICAgICAgICAgICAgcXVlcnkucHVzaChgY291cnNlX2lkPSR7Y291cnNlSWR9YCk7XG4gICAgICAgICAgICBxdWVyeS5wdXNoKGBkYXRlX2Zyb209JHtkYXRlRnJvbX1gKTtcbiAgICAgICAgICAgIHF1ZXJ5LnB1c2goYGRhdGVfdG89JHtkYXRlVG99YCk7XG4gICAgICAgICAgICBpZiAocXVlcnkubGVuZ3RoKSB1cmwgKz0gYD8ke3F1ZXJ5LmpvaW4oXCImXCIpfWA7XG5cbiAgICAgICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJYLVdQLU5vbmNlXCI6IGNvbmZpZy5ub25jZSxcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGRvd25sb2FkQ1NWKCBkYXRhICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGV4cG9ydCBpdGVtczpcIiwgZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBkb3dubG9hZENTVihkYXRhKSB7XG4gICAgICAgICAgICBsZXQgY3N2ID0gY29udmVydEFycmF5T2ZPYmplY3RzVG9DU1YoeyBkYXRhIH0pO1xuICAgICAgICAgICAgaWYgKCFjc3YpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSBgZW5yb2xsZWRfc3R1ZGVudHMuY3N2YDtcbiAgICAgICAgICAgIGNvbnN0IGNzdlV0ZiA9ICdkYXRhOnRleHQvY3N2O2NoYXJzZXQ9dXRmLTgsJztcbiAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBlbmNvZGVVUkkoY3N2VXRmICsgJ1xcdUZFRkYnICsgY3N2KTtcblxuICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XG4gICAgICAgICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb252ZXJ0QXJyYXlPZk9iamVjdHNUb0NTVih7IGRhdGEsIGNvbHVtbkRlbGltaXRlciA9ICcsJywgbGluZURlbGltaXRlciA9ICdcXHJcXG4nIH0pIHtcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSB8fCBkYXRhLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhWzBdKTtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcblxuICAgICAgICAgICAgcmVzdWx0ICs9IGtleXMuam9pbihjb2x1bW5EZWxpbWl0ZXIpICsgbGluZURlbGltaXRlcjtcblxuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpZHgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCA+IDApIHJlc3VsdCArPSBjb2x1bW5EZWxpbWl0ZXI7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbGwgPSBpdGVtW2tleV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2VsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBgXCIke2NlbGwubWFwKCBpdGVtID0+IGRlY29kZVN0ciggaXRlbSApICkuam9pbignLCcpfVwiYDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwgPSBjZWxsID09IG51bGwgPyAnJyA6IFN0cmluZyhjZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLmluY2x1ZGVzKGNvbHVtbkRlbGltaXRlcikgfHwgY2VsbC5pbmNsdWRlcygnXCInKSB8fCBjZWxsLmluY2x1ZGVzKCdcXG4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwgPSBgXCIke2NlbGwucmVwbGFjZSgvXCIvZywgJ1wiXCInKX1cImA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gY2VsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBsaW5lRGVsaW1pdGVyO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWNvZGVTdHIoIHN0ciApIHtcbiAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvJiMoXFxkKyk7L2csIChfLCBjb2RlKSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhdGVGaWx0ZXIoKSB7XG4gICAgICAgIGluaXRpYWxpemVEYXRlcGlja2VyKCcjbWFzdGVyc3R1ZHktZGF0ZXBpY2tlci1zdHVkZW50cycpO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RhdGVzVXBkYXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZmV0Y2hJdGVtcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpdGVtc1NvcnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21zU29ydEluZGljYXRvckV2ZW50JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgICAgbGV0IG9yZGVyICAgPSBldmVudC5kZXRhaWwuc29ydE9yZGVyLFxuICAgICAgICAgICAgICAgIG9yZGVyYnkgPSBldmVudC5kZXRhaWwuaW5kaWNhdG9yLnBhcmVudHMoJy5tYXN0ZXJzdHVkeS10Y2VsbF9faGVhZGVyJykuZGF0YSgnc29ydCcpO1xuXG4gICAgICAgICAgICBvcmRlciA9ICdub25lJyA9PT0gb3JkZXIgPyAnYXNjJyA6IG9yZGVyO1xuICAgICAgICAgICAgZmV0Y2hJdGVtcyggJCggY29uZmlnLnNlbGVjdG9ycy5wZXJfcGFnZSApLnZhbCgpLCAxLCBvcmRlcmJ5LCBvcmRlciApO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCAnLm1hc3RlcnN0dWR5LXRjZWxsX190aXRsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCAnLm1hc3RlcnN0dWR5LXNvcnQtaW5kaWNhdG9yJywgJCggdGhpcyApLnBhcmVudCgpICkudHJpZ2dlciggJ2NsaWNrJyApO1xuICAgICAgICB9KTtcbiAgICB9XG59KShqUXVlcnkpO1xuIl19
