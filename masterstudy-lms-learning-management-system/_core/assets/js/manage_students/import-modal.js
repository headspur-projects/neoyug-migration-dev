"use strict";

(function ($) {
  $(document).ready(function () {
    var importBtn = $('[data-id="import-students-via-csv"]');
    var importModal = $('.masterstudy-manage-students-import__modal');
    var importModalClose = $('.masterstudy-manage-students-import__modal-close');
    var addBtn = $('[data-id="add-student"]');
    var dropZone = $('.masterstudy-manage-students-import__file-upload');
    var dropZoneField = $('.masterstudy-manage-students-import__file-upload__field');
    var fileInput = $('.masterstudy-manage-students-import__file-upload__input');
    var modalIconWrapper = $('.masterstudy-manage-students-import__adding-box__icon-wrapper');
    var modalIcon = $('.masterstudy-manage-students-import__adding-box__icon');
    var emailInput = $('.masterstudy-manage-students-import__email-input');
    var importedList = $('.masterstudy-manage-students-import__list');
    var courseID = importModal.attr('data-course-id');
    var importProgress = $('.masterstudy-progress');
    var enrolledUsers = [];
    var currentStep = 1;
    var totalUsers = 0;
    var importCounter = 0;
    var userData = [];
    var isManual = false;
    stepHandler(1);
    importBtn.on('click', function (e) {
      e.preventDefault();
      importModal.addClass('is-open');
    });
    $(window).on('click', function (event) {
      if ($(event.target).is(importModal)) {
        importModal.removeClass('is-open');
        resetAll();
      }
    });
    importModalClose.on('click', function (e) {
      e.preventDefault();
      importModal.removeClass('is-open');
      resetAll();
    });
    dropZone.on('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZoneField.addClass('highlight');
    });
    dropZone.on('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZoneField.removeClass('highlight');
    });
    dropZone.on('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZoneField.removeClass('highlight');
      fileUploadHandler(e.originalEvent.dataTransfer.files);
    });
    $('[data-id="import-students-upload-csv-btn"]').on('click', function () {
      fileInput.click();
    });
    $('.masterstudy-manage-students-import__file-attachment__delete').on('click', function () {
      fileInput.val('');
      stepHandler(1);
    });
    $('[data-id="import-students-close-modal"]').on('click', function () {
      importModal.removeClass('is-open');
      resetAll();
    });
    $('[data-id="import-students-next-attempt"]').on('click', function () {
      fileInput.val('');
      stepHandler(1);
      dropZoneField.removeClass('error');
      $('.masterstudy-manage-students-import__unsupported-file-type').addClass('hidden');
      modalIconWrapper.removeClass('error');
    });
    fileInput.on('change', function (event) {
      fileUploadHandler(event.target.files);
    });
    $('[data-id="import-students-submit"]').on('click', function (e) {
      e.preventDefault();
      if (1 === currentStep) return;
      stepHandler(3);
      userData.map(function (udata) {
        addStudent(udata);
      });
    });
    addBtn.on('click', function (e) {
      e.preventDefault();
      stepHandler(7);
      totalUsers = 1;
      importCounter = 0;
      isManual = true;
      modalIcon.addClass('envelope');
      importModal.addClass('is-open');
    });
    $('[data-id="send-invitation"]').on('click', function (e) {
      e.preventDefault();
      var email = emailInput.val();
      if (!validateEmail(email)) {
        $('.masterstudy-manage-students-import__incorrect-email').removeClass('hidden');
        return;
      }
      $(this).addClass('masterstudy-button_loading');
      addStudent({
        email: email
      });
    });
    emailInput.on('change paste keyup', function () {
      $('.masterstudy-manage-students-import__incorrect-email').addClass('hidden');
    });
    function fileUploadHandler(files) {
      if (files === undefined || files === null) return;
      var file = files[0];
      if (file === undefined || file === null) return;
      var fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['csv'].includes(fileExtension)) {
        dropZoneField.addClass('error');
        $('.masterstudy-manage-students-import__unsupported-file-type').removeClass('hidden');
        return;
      }
      $('.masterstudy-manage-students-import__file-attachment__title').text(file.name);
      $('.masterstudy-manage-students-import__file-attachment__size').text(getFileSize(file.size));
      readCSVFile(file).then(function (data) {
        var headers = ['email'];
        var csvHeaders = Object.keys(data[0] || []);
        var isValidCSV = headers.every(function (header) {
          return csvHeaders.includes(header);
        });
        if (!isValidCSV && csvHeaders.length) {
          isValidCSV = headers.every(function (header) {
            return csvHeaders[0].split(';').includes(header);
          });
        }
        if (isValidCSV && csvHeaders.length > 0 && data.length > 0) {
          totalUsers = data.length;
          userData = data;
          stepHandler(2);
        } else {
          dropZoneField.addClass('error');
          $('.masterstudy-manage-students-empty-file').removeClass('hidden');
        }
      })["catch"](function (error) {
        console.error('Error reading CSV file:', error);
      });
    }
    function readCSVFile(file) {
      totalUsers = 0;
      importCounter = 0;
      userData = {};
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (event) {
          var csvData = event.target.result;
          var lines = csvData.split('\n');
          var headers = lines[0].trim().split(',').map(function (header) {
            return header.trim();
          });
          var dataArray = [];
          for (var i = 1; i < lines.length; i++) {
            var values = lines[i].trim().split(',').map(function (value) {
              return value.trim();
            });
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
              var key = headers[j];
              if (values[j] !== undefined && values[j] !== '') {
                obj[key] = values[j];
              }
            }
            if (Object.keys(obj).length > 0) {
              dataArray.push(obj);
            }
          }
          resolve(dataArray);
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
    }
    function resetAll() {
      fileInput.val('');
      emailInput.val('');
      stepHandler(1);
      isManual = false;
      enrolledUsers = [];
      dropZoneField.removeClass('error');
      modalIcon.removeClass('envelope');
      $('.masterstudy-manage-students-empty-file').addClass('hidden');
      $('.masterstudy-button').removeClass('masterstudy-button_loading');
      $('.masterstudy-manage-students-import__unsupported-file-type').addClass('hidden');
      modalIconWrapper.removeClass('error');
      importedList.html('');
    }
    function stepHandler(step) {
      var stepItems = importModal.find('[data-step]');
      currentStep = step;
      stepItems.each(function (i, item) {
        var itemSteps = $(item).attr('data-step');
        var dataSteps = itemSteps.split(',').map(function (item) {
          return parseInt(item, 10);
        });
        if (dataSteps.indexOf(step) !== -1) {
          $(item).removeClass('hidden');
        } else {
          $(item).addClass('hidden');
        }
        if (1 === step) {
          fileInput.val('');
          $('[data-id="import-students-submit"]').addClass('masterstudy-button_disabled');
        } else {
          $('[data-id="import-students-submit"]').removeClass('masterstudy-button_disabled');
        }
      });
    }
    function getFileSize(bytes) {
      var KB = 1024;
      var MB = KB * 1024;
      var GB = MB * 1024;
      if (bytes >= GB) {
        return (bytes / GB).toFixed(2) + ' gb';
      } else if (bytes >= MB) {
        return (bytes / MB).toFixed(2) + ' mb';
      } else if (bytes >= KB || bytes / KB < 1) {
        return (bytes / KB).toFixed(2) + ' kb';
      } else {
        return bytes + ' bytes';
      }
    }
    function addStudent() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryString = new URLSearchParams(params).toString();
      var apiUrl = "".concat(ms_lms_resturl, "/student/").concat(courseID, "/?").concat(queryString);
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': ms_lms_nonce,
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          return response.json();
        }
      }).then(function (data) {
        if (data) {
          importCounter += 1;
          var progress = Math.round(importCounter / totalUsers * 100, 0);
          importProgress.find('.masterstudy-progress__bar-filled').css({
            width: "".concat(progress, "%")
          });
          importProgress.find('.masterstudy-progress__percent').text(progress);
          if (data.is_enrolled_before) {
            enrolledUsers.push(data);
          }
          if (importCounter === totalUsers) {
            setTimeout(function () {
              setAddStudentEvent(progress);
              afterImportHandler();
            }, 1500);
          }
        } else {
          stepHandler(5);
          modalIconWrapper.addClass('error');
        }
      })["catch"](function (error) {
        stepHandler(5);
        modalIconWrapper.addClass('error');
      });
    }
    function afterImportHandler() {
      modalIcon.removeClass('envelope');
      if (isManual) {
        stepHandler(8);
        isManual = false;
        return;
      }
      stepHandler(4);
      $('.masterstudy-manage-students-import__user-count').text(totalUsers);
      if (enrolledUsers.length) {
        $('.masterstudy-manage-students-import__user-count').text(totalUsers - enrolledUsers.length);
        enrolledUsers.map(function (user) {
          importedList.append("<span class=\"masterstudy-manage-students-import__list-item\">".concat(user.email, "</span>"));
        });
        stepHandler(6);
      }
    }
    function setAddStudentEvent(progress) {
      document.dispatchEvent(new CustomEvent('msAddStudentEvent', {
        detail: {
          progress: progress
        }
      }));
    }
    function validateEmail(email) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });
})(jQuery);