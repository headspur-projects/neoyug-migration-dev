"use strict";

stm_lms_components['user_data_transfer'] = {
  template: '#stm-lms-dashboard-user_data_transfer',
  props: ['course_id'],
  data: function data() {
    return {
      modalVisible: false,
      fileTypeError: false,
      isCSVExporting: false,
      emptyCsvFile: false,
      userDataFileName: '',
      importFileSize: '',
      userData: [],
      totalUsers: 0,
      importedUsers: 0,
      importProgress: 0,
      importStep: 0,
      newEnrolledUsers: [],
      beforeEnrolledUsers: [],
      notEnrolledUsers: [],
      incorrectEmailUsers: [],
      afterImport: false
    };
  },
  mounted: function mounted() {
    var $this = this;
    document.addEventListener('click', this.clickOutsideModal);
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
      $this.$refs.uploadFileDropArea.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });
    ['dragenter', 'dragover'].forEach(function (eventName) {
      $this.$refs.uploadFileDropArea.addEventListener(eventName, function (e) {
        e.target.classList.add('highlight');
      }, false);
    });
    ['dragleave', 'drop'].forEach(function (eventName) {
      $this.$refs.uploadFileDropArea.addEventListener(eventName, function (e) {
        e.target.classList.remove('highlight');
      }, false);
    });
    $this.$refs.uploadFileDropArea.addEventListener('drop', function (e) {
      $this.fileUploadHandler(e.dataTransfer.files);
      $this.$forceUpdate();
    }, false);
  },
  methods: {
    uploadImportFile: function uploadImportFile() {
      var $this = this;
      $this.importStep = 0;
      $this.$refs.importFileInput.click();
      $this.$refs.importFileInput.addEventListener('change', function (event) {
        $this.fileUploadHandler(event.target.files);
      });
    },
    fileUploadHandler: function fileUploadHandler(files) {
      var $this = this;
      $this.deleteAttachedFile();
      if (files === undefined || files === null) return;
      $this.$refs.importFileInput.files = files;
      var file = files[0];
      if (file === undefined || file === null) return;
      var fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['csv'].includes(fileExtension)) {
        $this.fileTypeError = true;
        return;
      }
      $this.userDataFileName = file.name;
      $this.importFileSize = $this.setFileSize(file.size);
      $this.readCSVFile(file).then(function (data) {
        var headers = ['email'];
        var csvHeaders = Object.keys(data[0] || []);
        var isValidCSV = headers.every(function (header) {
          return csvHeaders.includes(header);
        });
        if (isValidCSV && csvHeaders.length) {
          $this.totalUsers = data.length;
          $this.userData = data;
          $this.importStep = 1;
        } else {
          $this.emptyCsvFile = true;
        }
      })["catch"](function (error) {
        console.error('Error reading CSV file:', error);
      });
    },
    closeImportModal: function closeImportModal() {
      this.userDataFileName = '';
      this.importStep = 0;
      this.userData = [];
      this.modalVisible = false;
      this.emptyCsvFile = false;
      this.fileTypeError = false;
      if (this.afterImport) {
        this.$emit('studentAdded');
        this.afterImport = false;
      }
    },
    clickOutsideModal: function clickOutsideModal(event) {
      if (event.target === this.$refs.transferModal) {
        this.userDataFileName = '';
        this.importStep = 0;
        this.userData = [];
        this.modalVisible = false;
        if (this.afterImport) {
          this.$emit('studentAdded');
          this.afterImport = false;
        }
      }
    },
    deleteAttachedFile: function deleteAttachedFile() {
      this.userDataFileName = '';
      this.importStep = 0;
      this.userData = [];
      this.emptyCsvFile = false;
      this.fileTypeError = false;
    },
    importUsers: function importUsers() {
      var $this = this;
      $this.importStep = 2;
      $this.beforeEnrolledUsers = [];
      $this.newEnrolledUsers = [];
      $this.incorrectEmailUsers = [];
      $this.notEnrolledUsers = [];
      $this.importProgress = 0;
      $this.userData.map(function (udata) {
        $this.$http.post("".concat(stm_lms_ajaxurl, "?action=stm_lms_dashboard_import_users_to_course&nonce=").concat(stm_lms_nonces['stm_lms_dashboard_import_users_to_course']), {
          users: [udata],
          course_id: $this.course_id
        }).then(function (response) {
          var $data = response.body;
          if ($data.new_enrolled_users && $data.new_enrolled_users.length) {
            $this.newEnrolledUsers.push($data.new_enrolled_users[0]);
          }
          if ($data.before_enrolled_users && $data.before_enrolled_users.length) {
            $this.beforeEnrolledUsers.push($data.before_enrolled_users[0]);
          }
          if ($data.incorrect_email_users && $data.incorrect_email_users.length) {
            $this.incorrectEmailUsers.push($data.incorrect_email_users[0]);
          }
          if ($data.not_enrolled_users && $data.not_enrolled_users.length) {
            $this.notEnrolledUsers.push($data.not_enrolled_users[0]);
          }
          var beforeCount = $this.beforeEnrolledUsers.length;
          var enrolledCount = $this.newEnrolledUsers.length;
          var incorrectCount = $this.incorrectEmailUsers.length;
          var notEnrolledCount = $this.notEnrolledUsers.length;
          var totalImported = beforeCount + enrolledCount + notEnrolledCount + incorrectCount;
          $this.importedUsers = $this.newEnrolledUsers.length;
          $this.importProgress = Math.round(Math.floor(totalImported / $this.totalUsers * 100));
          if (100 === $this.importProgress) {
            if (0 === beforeCount) {
              setTimeout(function () {
                $this.importStep = 3;
              }, 1500);
            }
            if (beforeCount > 0) {
              setTimeout(function () {
                $this.importStep = 4;
              }, 1500);
            }
            if ((incorrectCount > 0 || notEnrolledCount > 0) && 0 === beforeCount && 0 === enrolledCount) {
              setTimeout(function () {
                $this.importStep = 5;
              }, 1500);
            }
            $this.afterImport = true;
          }
        })["catch"](function (error) {
          $this.importStep = 5;
          $this.userDataFileName = '';
          $this.userData = [];
          $this.emptyCsvFile = false;
          $this.fileTypeError = false;
        });
      });
    },
    exportUsers: function exportUsers() {
      var $this = this;
      $this.isCSVExporting = true;
      $this.$http.post("".concat(stm_lms_ajaxurl, "?action=stm_lms_dashboard_export_course_students&nonce=").concat(stm_lms_nonces['stm_lms_dashboard_export_course_students_to_csv']), {
        course_id: $this.course_id
      }).then(function (response) {
        if (null !== response.body.user_data && response.body.user_data.length) {
          $this.downloadCSV({
            filename: response.body.filename
          }, response.body.user_data);
        }
        setTimeout(function () {
          $this.isCSVExporting = false;
        }, 1500);
      });
    },
    readCSVFile: function readCSVFile(file) {
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
    },
    downloadCSV: function downloadCSV(args, stockData) {
      var data,
        filename,
        link,
        csvUtf = '';
      var csv = this.convertArrayofObjectsToCSV({
        data: stockData
      });
      if (csv == null) return;
      filename = args.filename || 'students.csv';
      if (!csv.match(/^data:text\/csv/i)) {
        csvUtf = 'data:text/csv;charset=utf-8,';
      }
      data = encodeURI(csvUtf) + "\uFEFF" + encodeURI(csv);
      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    },
    convertArrayofObjectsToCSV: function convertArrayofObjectsToCSV(args) {
      var result, keys, columnDelimeter, lineDelimeter, data;
      data = args.data || null;
      if (data == null || !data.length) {
        return null;
      }
      columnDelimeter = args.columnDelimeter || ',';
      lineDelimeter = args.lineDelimeter || '\r\n';
      keys = Object.keys(data[0]);
      result = '';
      result += keys.join(columnDelimeter);
      result += lineDelimeter;
      data.forEach(function (item) {
        keys.forEach(function (key, index) {
          if (index > 0) result += columnDelimeter + ' ';
          result += item[key] || '';
        });
        result += lineDelimeter;
      });
      return result;
    },
    setFileSize: function setFileSize(bytes) {
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
  }
};