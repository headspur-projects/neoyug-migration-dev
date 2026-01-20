"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
(function ($) {
  $(document).ready(function () {
    var statisticsContainerEl = $('.stm-account-statistics');
    var chartsContainer = $('.stm-account-statistics__charts');
    var paypalEmailInput = $('.stm-account-statistics__email-input');
    var paypalEmailResponse = $('.stm-lms-statistics__paypal-email-response');
    var saveEmailBtn = $('.payout-save-email');
    var tableFilters = $('.stm-account-statistics__table-filters');
    var courseSelectEl = tableFilters.find('.stm-lms-user-quiz__head_title select');
    var totalCountEl = $('.stm-account-statistics__total-count strong');
    var totalPriceEl = $('.stm-account-statistics__total-price strong');
    var ordersTable = $('.stm-account-statistics__orders-table');
    var loadMoreContainer = $('.stm-account-statistics__load-more-container');
    var loadMoreBtn = loadMoreContainer.find('button');
    var clearFilterBtn = $('.stm-account-statistics__clear-filter');
    var noItemsText = $('.stm-account-statistics__no-items-text');
    window.defaultDateRanges = getDefaultDateRanges();
    var selectedKey = localStorage.getItem('StatisticsSelectedPeriodKey');
    var selectedPeriod = localStorage.getItem('StatisticsSelectedPeriod');
    if (selectedKey) {
      window.selectedPeriod = window.defaultDateRanges[selectedKey];
    } else if (selectedPeriod) {
      window.selectedPeriod = JSON.parse(selectedPeriod).map(function (d) {
        return new Date(d);
      });
    } else {
      window.selectedPeriod = window.defaultDateRanges['this_month'];
    }
    window.stats_data = masterstudy_lms_statistics_data.stats_data;
    window.stats_data.is_account_statistics = true;
    var statData = masterstudy_lms_statistics_data.data;
    var translations = masterstudy_lms_statistics_data.translations;
    var api = new MasterstudyApiProvider('lms');
    var limit = 10;
    var offset = 0;
    var currencySymbol = null;
    var authorId = null;
    var paypalEmail = null;
    var isPaypalEmailLoading = false;
    var labelsEarnings = null;
    var datasetsEarnings = null;
    var labelsSales = [];
    var datasetsSales = [{
      data: [],
      backgroundColor: []
    }];
    var courses = [];
    var total = 0;
    var totalPrice = 0;
    var orderItems = [];
    var dateFrom = null;
    var dateTo = null;
    var selectedCourse = 0;
    var lineChart = null;
    var pieChart = null;
    var loadMoreLoading = false;
    function initVars() {
      if (!statData) return;
      currencySymbol = statData.currency_symbol;
      authorId = statData.author_id;
      if (statData.paypal_email) {
        paypalEmail = statData.paypal_email;
        paypalEmailInput.val(paypalEmail);
      }
      labelsEarnings = statData.labels_earnings;
      if (statData.datasets_earnings) {
        datasetsEarnings = Array.isArray(statData.datasets_earnings) ? statData.datasets_earnings : Object.values(statData.datasets_earnings);
        datasetsEarnings.forEach(function (item) {
          item.fill = true;
          item.tension = 0.4;
        });
      }
      if (typeof statData.sales_statisticas != "undefined") {
        statData.sales_statisticas.forEach(function (item) {
          labelsSales.push(item.title);
          datasetsSales[0].data.push(item.order_item_count);
          datasetsSales[0].backgroundColor.push(item.backgroundColor);
        });
      }
    }
    function setIsLoading(val) {
      loadMoreLoading = val;
      loadMoreBtn.toggleClass('loading', val);
    }
    function setShowLoadMore(val) {
      loadMoreBtn.toggleClass('hidden', !val);
    }
    function setIsPaypalEmailLoading(val) {
      saveEmailBtn.toggleClass('loading', val);
    }
    function formatPrice(value) {
      var val = (value / 1).toFixed(2).replace('.', ',');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function setPaypalEmailResponse(msg, status) {
      paypalEmailResponse.attr('class', 'stm-lms-message stm-lms-statistis__paypal-email-response');
      paypalEmailResponse.toggleClass('hidden', !msg);
      paypalEmailResponse.addClass(status);
      paypalEmailResponse.text(msg);
    }
    function createLineChart() {
      var _translations$earning;
      var ctx = document.getElementById('line_chart_id').getContext('2d');
      lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labelsEarnings,
          datasets: datasetsEarnings
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(219,224,233,1)',
                borderColor: 'rgba(77,94,111,1)'
              },
              ticks: {
                callback: function callback(tick) {
                  var _currencySymbol;
                  return "".concat((_currencySymbol = currencySymbol) !== null && _currencySymbol !== void 0 ? _currencySymbol : '$', " ") + tick.toString();
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                padding: 20
              }
            },
            title: {
              display: true,
              text: (_translations$earning = translations === null || translations === void 0 ? void 0 : translations.earnings_text) !== null && _translations$earning !== void 0 ? _translations$earning : 'Earnings',
              font: {
                size: 22
              }
            }
          }
        }
      });
    }
    function createPieChart() {
      var _translations$sales_t;
      var ctx = document.getElementById('pie_chart_id').getContext('2d');
      lineChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labelsSales,
          datasets: datasetsSales
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                padding: 20
              }
            },
            title: {
              display: true,
              text: (_translations$sales_t = translations === null || translations === void 0 ? void 0 : translations.sales_text) !== null && _translations$sales_t !== void 0 ? _translations$sales_t : 'Sales',
              font: {
                size: 22
              }
            }
          }
        }
      });
    }
    function renderCharts() {
      if (datasetsSales[0].data.length && datasetsEarnings) {
        chartsContainer.removeClass('hidden');
      }
      if (!lineChart) {
        createLineChart();
      }
      if (!pieChart) {
        createPieChart();
      }
    }
    function renderCourseOptions() {
      tableFilters.toggleClass('hidden', !courses.length);
      courses.forEach(function (course) {
        courseSelectEl.append("\n\t\t\t\t\t<option value=\"".concat(course.id, "\">").concat(course.title, "</option>\n                "));
      });
    }
    function renderOrdersTable() {
      ordersTable.toggleClass('hidden', !orderItems.length);
      if (!orderItems.length) return;
      var tableBody = ordersTable.find('tbody');
      tableBody.empty();
      orderItems.forEach(function (item, index) {
        tableBody.append("\n                    <tr>\n                        <th scope=\"row\">".concat(index + 1, "</th>\n\n                        <td>").concat(item.name, "</td>\n                        <td>").concat(item.quantity, "</td>\n                        <td>").concat(formatPrice(item.price * item.quantity), "</td>\n                        <td>\n                            <span>").concat(item.transaction === '1' ? translations.yes : translations.no, "</span>\n                        </td>\n                        <td>").concat(moment(item.date_created).format("DD/MM/YYYY"), "</td>\n                    </tr>\n                "));
      });
    }
    function setDates(range) {
      dateFrom = moment(range[0]).format('YYYY-MM-DD');
      dateTo = moment(range[1]).format('YYYY-MM-DD');
    }
    function getCourse() {
      return _getCourse.apply(this, arguments);
    }
    function _getCourse() {
      _getCourse = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var res;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return api.get('/stm-lms-user/course-list', {
                author_id: authorId
              });
            case 2:
              res = _context.sent;
              courses = [{
                id: 0,
                title: 'All'
              }].concat(_toConsumableArray(res));
              renderCourseOptions();
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return _getCourse.apply(this, arguments);
    }
    function getOrderItems(_x) {
      return _getOrderItems.apply(this, arguments);
    }
    function _getOrderItems() {
      _getOrderItems = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(addItems) {
        var formData, response;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setIsLoading(true);
              formData = new FormData();
              formData.append('limit', limit);
              formData.append('offset', offset);
              formData.append('author_id', authorId);
              formData.append('nonce', stm_lms_vars.wp_rest_nonce);
              if (dateFrom && dateTo) {
                formData.append('date_from', dateFrom);
                formData.append('date_to', dateTo);
              }
              if (selectedCourse) {
                formData.append('course_id', selectedCourse);
              }
              _context2.prev = 8;
              _context2.next = 11;
              return api.postFormData('/stm-lms/order/items', formData);
            case 11:
              response = _context2.sent;
              if (typeof response.items !== "undefined") {
                if (addItems) {
                  orderItems = orderItems.concat(response.items);
                } else {
                  orderItems = response.items;
                }
              }
              if (typeof response.total !== "undefined") {
                total = response.total;
                totalCountEl.text(total);
              }
              if (typeof response.total_price != "undefined") {
                totalPrice = response.total_price;
                totalPriceEl.text(totalPrice);
              }
              if (total <= orderItems.length) {
                setShowLoadMore(false);
              } else {
                setShowLoadMore(true);
              }
              statisticsContainerEl.toggleClass('min-height-500', !!orderItems.length);
              loadMoreContainer.toggleClass('hidden', !orderItems.length);
              clearFilterBtn.toggleClass('hidden', !!orderItems.length);
              noItemsText.toggleClass('hidden', !!orderItems.length);
              renderOrdersTable();
              _context2.next = 26;
              break;
            case 23:
              _context2.prev = 23;
              _context2.t0 = _context2["catch"](8);
              console.error(_context2.t0);
            case 26:
              _context2.prev = 26;
              setIsLoading(false);
              return _context2.finish(26);
            case 29:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[8, 23, 26, 29]]);
      }));
      return _getOrderItems.apply(this, arguments);
    }
    function saveEmail() {
      return _saveEmail.apply(this, arguments);
    }
    function _saveEmail() {
      _saveEmail = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var formData, res;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!isPaypalEmailLoading) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              setIsPaypalEmailLoading(true);
              setPaypalEmailResponse('', '');
              formData = new FormData();
              formData.append('paypal_email', paypalEmail);
              _context3.prev = 6;
              _context3.next = 9;
              return api.postFormData('/stm-lms-payout/paypal-email', formData);
            case 9:
              res = _context3.sent;
              setPaypalEmailResponse(res.message, res.status);
              _context3.next = 16;
              break;
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](6);
              console.error(_context3.t0);
            case 16:
              _context3.prev = 16;
              setIsPaypalEmailLoading(false);
              return _context3.finish(16);
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[6, 13, 16, 19]]);
      }));
      return _saveEmail.apply(this, arguments);
    }
    function init() {
      return _init.apply(this, arguments);
    }
    function _init() {
      _init = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              setDates(window.selectedPeriod);
              initVars();
              Promise.all([getCourse(), getOrderItems()]);
              initializeDatepicker('#masterstudy-datepicker-stm-account-statistics');
              renderCharts();
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return _init.apply(this, arguments);
    }
    init();
    paypalEmailInput.on('input', function () {
      paypalEmail = $(this).val();
    });
    saveEmailBtn.on('click', function () {
      saveEmail();
    });
    courseSelectEl.on('change', function () {
      selectedCourse = $(this).val();
      offset = 0;
      getOrderItems();
    });
    loadMoreBtn.on('click', function () {
      if (loadMoreLoading) return;
      offset += limit;
      getOrderItems(true);
    });
    clearFilterBtn.on('click', function () {
      offset = 0;
      dateFrom = null;
      dateTo = null;
      selectedCourse = 0;
      getOrderItems();
    });
    document.addEventListener('datesUpdated', function (e) {
      setDates(e.detail.selectedPeriod);
      offset = 0;
      getOrderItems();
    });
  });
})(jQuery);