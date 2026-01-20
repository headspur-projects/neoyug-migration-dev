"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
(function ($) {
  $(document).ready(function () {
    var groupContainerEl = $('.stm_lms_enterprise_group');
    var groupNoUsersEl = $('.stm_lms_enterprise_group__no-users');
    var groupEl = $('.stm_lms_enterprise_group');
    var groupId = window['stm_lms_group']['id'];
    var translations = window['stm_lms_group']['translate'];
    var templates = window['stm_lms_group']['template'];
    var group = null;
    function setIsLoading(val) {
      groupContainerEl.toggleClass('loading', val);
    }
    function deleteUserCourse(_x, _x2, _x3, _x4) {
      return _deleteUserCourse.apply(this, arguments);
    }
    function _deleteUserCourse() {
      _deleteUserCourse = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(user, course, courseEl, userEl) {
        var url, res;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!course.loading) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              url = stm_lms_ajaxurl + '?action=stm_lms_delete_user_ent_courses&user_id=' + user.id + '&group_id=' + course.group_id + '&course_id=' + course.course_id + '&nonce=' + stm_lms_nonces['stm_lms_delete_user_ent_courses'];
              course.loading = true;
              courseEl.addClass('loading');
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
              course.added = false;
              renderCourses(user, userEl);
              _context.next = 20;
              break;
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](5);
              console.error(_context.t0);
            case 20:
              _context.prev = 20;
              course.loading = false;
              courseEl.removeClass('loading');
              return _context.finish(20);
            case 24:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[5, 17, 20, 24]]);
      }));
      return _deleteUserCourse.apply(this, arguments);
    }
    function addUserCourse(_x5, _x6, _x7, _x8) {
      return _addUserCourse.apply(this, arguments);
    }
    function _addUserCourse() {
      _addUserCourse = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(user, course, courseEl, userEl) {
        var url, res;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!course.loading) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              url = stm_lms_ajaxurl + '?action=stm_lms_add_user_ent_courses&user_id=' + user.id + '&group_id=' + course.group_id + '&course_id=' + course.course_id + '&nonce=' + stm_lms_nonces['stm_lms_add_user_ent_courses'];
              course.loading = true;
              courseEl.addClass('loading');
              _context2.prev = 5;
              _context2.next = 8;
              return fetch(url, {
                method: 'GET'
              });
            case 8:
              res = _context2.sent;
              if (res.ok) {
                _context2.next = 11;
                break;
              }
              return _context2.abrupt("return");
            case 11:
              _context2.next = 13;
              return res.json();
            case 13:
              course.added = true;
              renderCourses(user, userEl);
              _context2.next = 20;
              break;
            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2["catch"](5);
              console.error(_context2.t0);
            case 20:
              _context2.prev = 20;
              course.loading = false;
              courseEl.removeClass('loading');
              return _context2.finish(20);
            case 24:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[5, 17, 20, 24]]);
      }));
      return _addUserCourse.apply(this, arguments);
    }
    function renderCourses(user, userEl) {
      var coursesList = userEl.find('.stm_lms_user_ent_courses');
      if (user.courses.length) {
        userEl.find('.stm_lms_enterprise_group__single_courses').toggleClass('hidden', !user.active);
      }
      coursesList.empty();
      user.courses.forEach(function (course) {
        var courseEl = $('<div>', {
          "class": 'stm_lms_user_ent_course'
        });
        courseEl.append("\n                    <div class=\"stm_lms_user_ent_course__title\">\n                        <h4>".concat(course.data.title, "</h4>\n                        ").concat(course.added ? "\n                            <div class=\"stm_lms_user_ent_course__progress\">\n                                <div class=\"progress-bar progress-bar-success progress-bar-striped active\" style=\"width: ".concat(course.user_data.progress_percent + '%', "\">\n                                </div>\n                            </div>") : '', "\n                    </div>\n\n                    <div class=\"stm_lms_user_ent_course__actions\">\n                        ").concat(!course.added ? "\n                            <a href=\"#\" class=\"btn btn-default add\">\n                                ".concat(translations.add_course, "\n                            </a>") : "\n                            <a href=\"#\" class=\"btn btn-default remove\">\n                                ".concat(translations.remove_course, "\n                            </a>\n                        "), "\n                    </div>\n                "));
        courseEl.on('click', '.stm_lms_user_ent_course__actions .add', function () {
          return addUserCourse(user, course, courseEl, userEl);
        });
        courseEl.on('click', '.stm_lms_user_ent_course__actions .remove', function () {
          return deleteUserCourse(user, course, courseEl, userEl);
        });
        coursesList.append(courseEl);
      });
    }
    function getUserCourses(_x9, _x10) {
      return _getUserCourses.apply(this, arguments);
    }
    function _getUserCourses() {
      _getUserCourses = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(user, userEl) {
        var url, res;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!user.loading) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              url = stm_lms_ajaxurl + '?action=stm_lms_get_user_ent_courses&user_id=' + user.id + '&group_id=' + groupId + '&nonce=' + stm_lms_nonces['stm_lms_get_user_ent_courses'];
              user.loading = true;
              user.active = true;
              userEl.addClass('loading');
              userEl.addClass('active');
              _context3.prev = 7;
              _context3.next = 10;
              return fetch(url, {
                method: 'GET'
              });
            case 10:
              res = _context3.sent;
              if (res.ok) {
                _context3.next = 13;
                break;
              }
              return _context3.abrupt("return");
            case 13:
              _context3.next = 15;
              return res.json();
            case 15:
              user.courses = _context3.sent;
              renderCourses(user, userEl);
              _context3.next = 22;
              break;
            case 19:
              _context3.prev = 19;
              _context3.t0 = _context3["catch"](7);
              console.error(_context3.t0);
            case 22:
              _context3.prev = 22;
              user.loading = false;
              userEl.removeClass('loading');
              return _context3.finish(22);
            case 26:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[7, 19, 22, 26]]);
      }));
      return _getUserCourses.apply(this, arguments);
    }
    function openUser(user, userEl) {
      if (typeof user.courses === 'undefined') {
        getUserCourses(user, userEl);
      } else {
        user.active = !user.active;
        userEl.toggleClass('active', user.active);
        userEl.find('.stm_lms_enterprise_group__single_courses').toggleClass('hidden', !user.active);
      }
    }
    function changeAdmin(_x11, _x12) {
      return _changeAdmin.apply(this, arguments);
    }
    function _changeAdmin() {
      _changeAdmin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(user, userEl) {
        var url, res;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!user.loading) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return");
            case 2:
              if (confirm(translations['admin_notice'])) {
                _context4.next = 4;
                break;
              }
              return _context4.abrupt("return");
            case 4:
              url = stm_lms_ajaxurl + '?action=stm_lms_change_ent_group_admin&user_id=' + user.id + '&group_id=' + groupId + '&nonce=' + stm_lms_nonces['stm_lms_change_ent_group_admin'];
              user.loading = true;
              userEl.addClass('loading');
              _context4.prev = 7;
              _context4.next = 10;
              return fetch(url, {
                method: 'GET'
              });
            case 10:
              res = _context4.sent;
              if (res.ok) {
                _context4.next = 13;
                break;
              }
              return _context4.abrupt("return");
            case 13:
              _context4.t0 = window.location;
              _context4.next = 16;
              return res.json();
            case 16:
              _context4.t1 = _context4.sent;
              _context4.t0.replace.call(_context4.t0, _context4.t1);
              _context4.next = 23;
              break;
            case 20:
              _context4.prev = 20;
              _context4.t2 = _context4["catch"](7);
              console.error(_context4.t2);
            case 23:
              _context4.prev = 23;
              user.loading = false;
              userEl.removeClass('loading');
              return _context4.finish(23);
            case 27:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[7, 20, 23, 27]]);
      }));
      return _changeAdmin.apply(this, arguments);
    }
    function removeFromGroup(_x13, _x14) {
      return _removeFromGroup.apply(this, arguments);
    }
    function _removeFromGroup() {
      _removeFromGroup = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(user, userEl) {
        var url, res;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!user.loading) {
                _context5.next = 2;
                break;
              }
              return _context5.abrupt("return");
            case 2:
              if (confirm(translations['remove_notice'])) {
                _context5.next = 4;
                break;
              }
              return _context5.abrupt("return");
            case 4:
              url = stm_lms_ajaxurl + '?action=stm_lms_delete_user_from_group&user_id=' + user.id + '&user_email=' + user.email + '&group_id=' + groupId + '&nonce=' + stm_lms_nonces['stm_lms_delete_user_from_group'];
              user.loading = true;
              userEl.addClass('loading');
              _context5.prev = 7;
              _context5.next = 10;
              return fetch(url, {
                method: 'GET'
              });
            case 10:
              res = _context5.sent;
              if (res.ok) {
                _context5.next = 13;
                break;
              }
              return _context5.abrupt("return");
            case 13:
              _context5.next = 15;
              return res.json();
            case 15:
              group.users = group.users.filter(function (u) {
                return u.id !== user.id;
              });
              userEl.remove();
              _context5.next = 22;
              break;
            case 19:
              _context5.prev = 19;
              _context5.t0 = _context5["catch"](7);
              console.error(_context5.t0);
            case 22:
              _context5.prev = 22;
              user.loading = false;
              userEl.removeClass('loading');
              return _context5.finish(22);
            case 26:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[7, 19, 22, 26]]);
      }));
      return _removeFromGroup.apply(this, arguments);
    }
    function renderGroup() {
      if (!group.users || !group.users.length) {
        groupEl.addClass('hidden');
        groupNoUsersEl.removeClass('hidden');
        return;
      }
      groupEl.removeClass('hidden');
      groupNoUsersEl.addClass('hidden');
      groupEl.empty();
      group.users.forEach(function (user) {
        var userEl = $('<div>', {
          "class": "stm_lms_enterprise_group__single"
        });
        userEl.append("\n                    <div class=\"stm_lms_enterprise_group__single_avatar\">".concat(user.avatar, "</div>\n\n                    <div class=\"stm_lms_enterprise_group__single_title heading_font\">").concat(user.login, "</div>\n\n                    <div class=\"actions\">\n                        <a href=\"#\" class=\"adminChange\">\n                            <i class=\"fa fa-key\"></i>\n                            <span>").concat(translations.set_as_admin, "</span>\n                        </a>\n                        <a href=\"#\" class=\"deleteFromGroup\">\n                            <i class=\"fa fa-times\"></i>\n                            <span>").concat(translations.remove_from_group, "</span>\n                        </a>\n                        <span class=\"expand\" @click=\"openUser(user)\"></span>\n                    </div>\n\n                    <div class=\"stm_lms_enterprise_group__single_courses hidden\">\n                    </div>\n                "));
        userEl.find('.stm_lms_enterprise_group__single_courses').append(templates['courses_template']);
        userEl.on('click', '.stm_lms_enterprise_group__single_avatar', function () {
          return openUser(user, userEl);
        });
        userEl.on('click', '.stm_lms_enterprise_group__single_title', function () {
          return openUser(user, userEl);
        });
        userEl.on('click', '.expand', function () {
          return openUser(user, userEl);
        });
        userEl.on('click', '.adminChange', function () {
          return changeAdmin(user, userEl);
        });
        userEl.on('click', '.deleteFromGroup', function () {
          return removeFromGroup(user, userEl);
        });
        groupEl.append(userEl);
      });
    }
    function fetchGroup() {
      return _fetchGroup.apply(this, arguments);
    }
    function _fetchGroup() {
      _fetchGroup = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        var url, res;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              url = stm_lms_ajaxurl + '?action=stm_lms_get_enterprise_group&group_id=' + groupId + '&nonce=' + stm_lms_nonces['stm_lms_get_enterprise_group'];
              setIsLoading(true);
              _context6.prev = 2;
              _context6.next = 5;
              return fetch(url, {
                method: 'GET'
              });
            case 5:
              res = _context6.sent;
              if (res.ok) {
                _context6.next = 8;
                break;
              }
              return _context6.abrupt("return");
            case 8:
              _context6.next = 10;
              return res.json();
            case 10:
              group = _context6.sent;
              renderGroup();
              _context6.next = 17;
              break;
            case 14:
              _context6.prev = 14;
              _context6.t0 = _context6["catch"](2);
              console.error(_context6.t0);
            case 17:
              _context6.prev = 17;
              setIsLoading(false);
              return _context6.finish(17);
            case 20:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[2, 14, 17, 20]]);
      }));
      return _fetchGroup.apply(this, arguments);
    }
    function init() {
      fetchGroup();
    }
    init();
  });
})(jQuery);