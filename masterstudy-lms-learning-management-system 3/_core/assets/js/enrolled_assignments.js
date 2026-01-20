"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
(function ($) {
  $(document).ready(function () {
    $('body').addClass('enrolled-assignments');
    var searchInput = $('.stm_lms_enrolled_assignments__search-input');
    var statusFilterContainer = $('.sort_assignments');
    var statusFilterEl = statusFilterContainer.find('.sort_assignments__statuses');
    var statusesContainer = statusFilterContainer.find('.sort_assignments__statuses_available');
    var statusActiveEl = $('.sort_assignments__statuses-active-title');
    var assignmentsGrid = $('.enrolled-assignments-grid');
    var assignmentsPagination = $('.asignments_grid__pagination');
    var noAssignments = $('.stm_lms_enrolled_assignments__no-items');
    var paginationNumbers = $('.stm_lms_enrolled_assignments__pagination-numbers');
    var loading = false;
    var page = 1;
    var search = '';
    var translations = window['stm_lms_enrolled_assignments']['translations'];
    var statuses = [{
      id: undefined,
      title: translations.choose_status
    }].concat(_toConsumableArray(window['stm_lms_enrolled_assignments']['statuses']));
    var activeStatus = statuses[0];
    var pages = window['stm_lms_enrolled_assignments']['assignments'].pages;
    var assignments = window['stm_lms_enrolled_assignments']['assignments'];
    var searchTimeout = 0;
    function setIsLoading(val) {
      loading = val;
      assignmentsGrid.toggleClass('loading', val);
    }
    function renderStatusesOptions() {
      statusesContainer.find('.sort_assignments__status').remove();
      statuses.forEach(function (status) {
        var _activeStatus;
        if (status.id === ((_activeStatus = activeStatus) === null || _activeStatus === void 0 ? void 0 : _activeStatus.id)) return;
        var statusEl = $('<div>', {
          "class": 'sort_assignments__status'
        });
        statusEl.text(status.title);
        statusEl.on('click', function () {
          activeStatus = status;
          getAssignments();
          setFilterHovered(false);
          renderStatusesOptions();
          statusActiveEl.text(activeStatus.title);
        });
        statusesContainer.append(statusEl);
      });
    }
    function computePage(page) {
      /*Always show first and last page*/
      if (page === 1 || page === this.pages) return 'first';

      /*Hide not 2 closest pages to first and last*/
      if (page + 2 < this.page) return 'other';
      if (page - 2 > this.page) return 'other';
      return 'first';
    }
    function renderPaginationNumbers() {
      var _pages;
      paginationNumbers.empty();
      Array((_pages = pages) !== null && _pages !== void 0 ? _pages : 0).fill(0).forEach(function (_, idx) {
        var singlePage = idx + 1;
        var liEl = $('<li>');
        if (page === singlePage) {
          liEl.append("\n                        <span class=\"page-numbers current\">".concat(singlePage, "</span>\n                    "));
          paginationNumbers.append(liEl);
          return;
        }
        var pageEl = $('<a>', {
          href: '#',
          "class": "page-numbers ".concat(computePage(singlePage))
        });
        pageEl.text(singlePage);
        pageEl.addEventListener('click', function (e) {
          e.preventDefault();
          page = singlePage;
          getAssignments();
        });
        liEl.append(pageEl);
        paginationNumbers.append(liEl);
      });
    }
    function renderAssignments() {
      assignmentsGrid.empty();
      assignments.forEach(function (assignment) {
        assignmentsGrid.append("\n                    <a href=\"".concat(assignment.url, "\" class=\"enrolled-assignment\">\n                        <div class=\"inner ").concat(assignment.who_view === '0' ? 'unviewed' : '', "\">\n                            <i class=\"stmlms-bell\"></i>\n                            <div class=\"enrolled-assignment--title heading_font\">").concat(assignment.assignment_title, "</div>\n\n                            <div class=\"enrolled-assignment--course\">\n                                <span>").concat(translations.course, ":</span>\n                                <span class=\"enrolled-assignment--course-title\">").concat(assignment.course_title, "</span>\n                            </div>\n\n                            <div class=\"enrolled-assignment--meta\">\n                                <div class=\"enrolled-assignment--teacher\">\n                                    <img src=\"").concat(assignment.instructor.avatar_url, "\"/>\n                                    <div class=\"enrolled-assignment--teacher_name\">\n                                        <span>").concat(translations.teacher, ":</span>\n                                        <span class=\"enrolled-assignment--value\">").concat(assignment.instructor.login, "</span>\n                                    </div>\n                                </div>\n\n                                <div class=\"enrolled-assignment--status ").concat(assignment.status.status, "\">\n                                    <span>").concat(translations.status, ":</span>\n                                    <span class=\"enrolled-assignment--value\">").concat(assignment.status.label, "</span>\n                                </div>\n\n                                <div class=\"enrolled-assignment--time\">\n                                    <i class=\"stmlms-clock\"></i>\n                                    <span>").concat(translations.last_update, ":</span>\n                                    <span class=\"enrolled-assignment--value\">").concat(assignment.updated_at, "</span>\n                                </div>\n                            </div>\n                        </div>\n                    </a>\n                "));
      });
    }
    function setFilterHovered(val) {
      statusFilterEl.toggleClass('active_sort', val);
      statusFilterEl.toggleClass('active_status', val);
    }
    function togglePagination() {
      assignmentsPagination.toggleClass('hidden', pages <= 1 || !pages);
    }
    function setNoAssignments(val) {
      noAssignments.toggleClass('hidden', val);
    }
    function getAssignments() {
      return _getAssignments.apply(this, arguments);
    }
    function _getAssignments() {
      _getAssignments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _activeStatus2;
        var url, res, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!loading) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              setIsLoading(true);
              setNoAssignments(true);
              url = stm_lms_ajaxurl + '?action=stm_lms_get_enrolled_assignments&nonce=' + stm_lms_nonces['stm_lms_get_enrolled_assingments'] + '&page=' + page + '&status=' + ((_activeStatus2 = activeStatus) === null || _activeStatus2 === void 0 ? void 0 : _activeStatus2.id) + '&s=' + search;
              _context.prev = 5;
              _context.next = 8;
              return fetch(url, {
                method: 'GET'
              });
            case 8:
              res = _context.sent;
              if (res.ok) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return");
            case 11:
              _context.next = 13;
              return res.json();
            case 13:
              response = _context.sent;
              if (response) {
                assignments = response;
                renderAssignments();
                setNoAssignments(!!response.length);
                if (response.length > 0) {
                  pages = response[0].pages;
                  togglePagination();
                }
              }
              _context.next = 20;
              break;
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](5);
              console.error(_context.t0);
            case 20:
              _context.prev = 20;
              setIsLoading(false);
              return _context.finish(20);
            case 23:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[5, 17, 20, 23]]);
      }));
      return _getAssignments.apply(this, arguments);
    }
    function init() {
      getAssignments();
      statusActiveEl.text(activeStatus.title);
      renderStatusesOptions();
      togglePagination();
      renderPaginationNumbers();
    }
    init();
    searchInput.on('input', function () {
      search = $(this).val();
    });
    searchInput.on('keyup', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        page = 1;
        getAssignments();
      }, 1000);
    });
    statusFilterContainer.on('mouseover', function () {
      setFilterHovered(true);
    });
    statusFilterContainer.on('mouseout', function () {
      setFilterHovered(false);
    });
  });
})(jQuery);