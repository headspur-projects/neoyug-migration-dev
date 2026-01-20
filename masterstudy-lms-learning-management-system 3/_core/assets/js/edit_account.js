"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
(function ($) {
  $(document).ready(function () {
    $('.stm_lms_settings_button').on('click', function () {
      $('.stm-lms-user_edit_profile_btn').click();
    });
    $('.stm-lms-user-avatar-edit .delete_avatar').on('click', function () {
      var $this = $(this);
      var $parent = $this.closest('.stm-lms-user-avatar-edit');
      $parent.addClass('loading-avatar');
      var formData = new FormData();
      formData.append('action', 'stm_lms_delete_avatar');
      formData.append('nonce', stm_lms_nonces['stm_lms_delete_avatar']);
      $this.remove();
      $.ajax({
        url: stm_lms_ajaxurl,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function success(data) {
          $parent.removeClass('loading-avatar');
          if (data.file) {
            var $avatar_img = $parent.find('img');
            $avatar_img.remove();
            $parent.find('.stm-lms-user_avatar').append(data.file);
            float_menu_image();
          }
        }
      });
    });
    function float_menu_image() {
      var $float_menu = $('.stm_lms_user_float_menu__user');
      if ($float_menu.length) {
        $float_menu.find('img').attr('src', $('.stm-lms-user_avatar').find('img').attr('src'));
      }
    }
    $('.stm-lms-user-avatar-edit input').on('change', function () {
      var $this = $(this);
      var files = $this[0].files;
      var $parent = $this.closest('.stm-lms-user-avatar-edit');
      $parent.addClass('loading-avatar');
      if (files.length) {
        var file = files[0];
        var formData = new FormData();
        formData.append('file', file);
        formData.append('action', 'stm_lms_change_avatar');
        formData.append('nonce', stm_lms_nonces['stm_lms_change_avatar']);
        $.ajax({
          url: stm_lms_ajaxurl,
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function success(data) {
            $parent.removeClass('loading-avatar');
            if (data.file) {
              $parent.find('img').attr('src', data.file);
              float_menu_image();
            }
          }
        });
      }
    });
    $('[data-container]').on('click', function (e) {
      e.preventDefault();
      var $default_container = $('[data-container-open=".stm_lms_private_information"]');
      var $container = $('[data-container-open="' + $(this).attr('data-container') + '"]');
      var container_visible = $container.is(':visible');
      $('[data-container]').removeClass('active');
      $('[data-container-open]').slideUp();
      if (!container_visible) {
        $(this).addClass('active');
        $container.slideDown();
      } else {
        $default_container.slideDown();
      }
    });
    $('body').addClass('stm_lms_chat_page');

    // Vue replacement logic
    var data = stm_lms_edit_account_info;
    var additionalFields = [];
    var personal_data = typeof stm_lms_personal_data !== 'undefined' ? stm_lms_personal_data : {};
    var displayNameOptions = new Set();
    var prevCountry, lastNonUSState;
    var displayNameOptionsContainer = $('.masterstudy-edit-account-display-name-options');
    var descriptionInput = $('.masterstudy-edit-account-bio-input');
    var firstNameInput = $('.masterstudy-edit-account-first-name-input');
    var lastNameInput = $('.masterstudy-edit-account-last-name-input');
    var positionInput = $('.masterstudy-edit-account-position-input');
    var emailNotifications = $('.masterstudy-edit-account-email-notifications');
    var newPasswordIcon = $('.masterstudy-edit-account-new-pass-icon');
    var newPasswordInput = $('.masterstudy-edit-account-new-pass-input');
    var reTypeNewPasswordIcon = $('.masterstudy-edit-account-re-new-pass-icon');
    var reTypeNewPasswordInput = $('.masterstudy-edit-account-re-new-pass-input');
    var facebookInput = $('.masterstudy-edit-account-social-facebook-input');
    var linkedinInput = $('.masterstudy-edit-account-social-linkedin-input');
    var twitterInput = $('.masterstudy-edit-account-social-twitter-input');
    var instagramInput = $('.masterstudy-edit-account-social-instagram-input');
    var countrySelect = $('.masterstudy-edit-account-country-select');
    var stateSelect = $('.masterstudy-edit-account-state-select');
    var stateInput = $('.masterstudy-edit-account-state-input');
    var postcodeInput = $('.masterstudy-edit-account-post_code-input');
    var cityInput = $('.masterstudy-edit-account-city-input');
    var companyInput = $('.masterstudy-edit-account-company-input');
    var phoneInput = $('.masterstudy-edit-account-phone-input');
    var saveBtn = $('.btn-save-account');
    var messageEl = $('.stm-lms-message');
    function generateNameOptions(firstName, lastName) {
      if (!firstName || !lastName) return [];
      var fullName1 = firstName + " " + lastName;
      var fullName2 = lastName + " " + firstName;
      return [fullName1, fullName2, firstName, lastName];
    }
    function updateDisplayNameOptions() {
      var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var firstName = data.meta.first_name;
      var lastName = data.meta.last_name;
      if (!initial) {
        displayNameOptions.clear();
        $('.masterstudy-edit-account-custom-display-option').remove();
      }
      generateNameOptions(firstName, lastName).forEach(function (name) {
        displayNameOptions.add(name);
      });
      if (!initial) {
        addUniqueNameOptions();
      }
      var _iterator = _createForOfIteratorHelper(displayNameOptions.values()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;
          var optionEl = $('<option>', {
            value: option,
            text: option,
            "class": 'masterstudy-edit-account-custom-display-option'
          });
          displayNameOptionsContainer.append(optionEl);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    function addUniqueNameOptions() {
      var firstName = data.meta.first_name;
      var lastName = data.meta.last_name;
      generateNameOptions(firstName, lastName).forEach(function (name) {
        displayNameOptions.add(name);
      });
    }
    function togglePasswordEye(val, iconEl, passwordInput) {
      if (val) {
        $(iconEl).removeClass('fa-eye-slash');
        $(iconEl).addClass('fa-eye');
        passwordInput.attr('type', 'text');
      } else {
        $(iconEl).addClass('fa-eye-slash');
        $(iconEl).removeClass('fa-eye');
        passwordInput.attr('type', 'password');
      }
    }
    function processFields(fields) {
      if (!Object.keys(fields).length) return;
      var _loop = function _loop(fieldName) {
        if (!fields.hasOwnProperty(fieldName)) return "continue";
        var additionalField = additionalFields.find(function (af) {
          return af.id === fieldName;
        });
        if (!additionalField) return "continue";
        switch (additionalField.type) {
          case 'checkbox':
            {
              var checkedValues = [];
              $("[name=\"".concat(additionalField.slug, "\"]")).each(function () {
                if ($(this).next().hasClass("masterstudy-form-builder__checkbox-wrapper_checked")) {
                  checkedValues.push($(this).val());
                }
              });
              fields[fieldName] = checkedValues.join(",");
              break;
            }
          case 'radio':
            {
              $("[name=\"".concat(additionalField.slug, "\"]")).each(function () {
                if ($(this).next().hasClass("masterstudy-form-builder__radio-wrapper_checked")) {
                  fields[fieldName] = $(this).val();
                }
              });
              break;
            }
          case 'file':
            {
              fields[fieldName] = $("[name=\"".concat(additionalField.slug, "\"]")).attr("data-url") || "";
              break;
            }
          default:
            {
              fields[fieldName] = $("[name=\"".concat(additionalField.slug, "\"]")).val();
            }
        }
      };
      for (var fieldName in fields) {
        var _ret = _loop(fieldName);
        if (_ret === "continue") continue;
      }
    }
    function toggleLoading(val) {
      saveBtn.toggleClass('loading', val);
    }
    function toggleMessage(message, status) {
      messageEl.attr('class', 'stm-lms-message');
      messageEl.toggleClass('masterstudy-edit-account-message-hidden', !message);
      messageEl.addClass(status);
      messageEl.text(message);
    }
    function saveUserInfo() {
      return _saveUserInfo.apply(this, arguments);
    }
    function _saveUserInfo() {
      _saveUserInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var url, pd, allowed, scope, _countrySelect, response, responseData, data_fields, k;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              processFields(data.meta);
              url = stm_lms_ajaxurl + "?action=stm_lms_save_user_info&nonce=" + stm_lms_nonces["stm_lms_save_user_info"];
              toggleLoading(true);
              toggleMessage("", "");
              pd = _objectSpread({}, personal_data || {});
              allowed = new Set(['country', 'post_code', 'state', 'city', 'company', 'phone']);
              scope = $('#stm_lms_edit_account');
              scope.find(':input[name]:enabled').each(function () {
                var el = $(this);
                var name = el.attr('name');
                if (!allowed.has(name)) return;
                if (el.is(':checkbox')) {
                  pd[name] = el.is(':checked') ? el.val() || '1' : '0';
                } else if (el.is(':radio')) {
                  if (el.is(':checked')) pd[name] = el.val();
                } else {
                  pd[name] = el.val();
                }
              });
              if (!pd.country && personal_data && personal_data.country) {
                pd.country = personal_data.country;
              } else if (!pd.country) {
                _countrySelect = document.querySelector('[name="country"]');
                if (_countrySelect) pd.country = _countrySelect.value;
              }
              data.meta.personal_data = pd;
              _context.prev = 10;
              _context.next = 13;
              return fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data.meta)
              });
            case 13:
              response = _context.sent;
              if (response.ok) {
                _context.next = 17;
                break;
              }
              toggleMessage('Unable to save settings', 'error');
              return _context.abrupt("return");
            case 17:
              _context.next = 19;
              return response.json();
            case 19:
              responseData = _context.sent;
              if (responseData) {
                _context.next = 22;
                break;
              }
              return _context.abrupt("return");
            case 22:
              toggleMessage(responseData.message, responseData.status);
              if (responseData.relogin) {
                window.location.href = responseData.relogin;
              }
              data_fields = {
                bio: "",
                facebook: "href",
                twitter: "href",
                "google-plus": "href",
                position: "",
                disable_report_email_notifications: true,
                first_name: "",
                display_name: "",
                instagram: "href"
              };
              for (k in data_fields) {
                if (data_fields.hasOwnProperty(k)) {
                  if (data_fields[k]) {
                    $(".stm_lms_update_field__" + k).attr(data_fields[k], data["meta"][k]);
                  } else {
                    $(".stm_lms_update_field__" + k).text(data["meta"][k]);
                  }
                }
              }
              _context.next = 32;
              break;
            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](10);
              toggleMessage('Something went wrong while updating settings', 'error');
              console.error(_context.t0);
            case 32:
              _context.prev = 32;
              toggleLoading(false);
              return _context.finish(32);
            case 35:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[10, 28, 32, 35]]);
      }));
      return _saveUserInfo.apply(this, arguments);
    }
    function taxesSetup() {
      prevCountry = countrySelect.length ? (countrySelect.val() || '').toUpperCase() : '';
      lastNonUSState = stateInput.val() || '';
      function initSelect2($el) {
        if (typeof $.fn.select2 === 'function' && !$el.hasClass('select2-hidden-accessible')) {
          $el.select2({
            width: '100%'
          });
        }
      }
      function destroySelect2(el) {
        if (el.hasClass('select2-hidden-accessible')) {
          el.select2('destroy');
        }
      }
      function showStateSelect() {
        syncInputToSelectIfPossible();
        initSelect2(stateSelect);
        stateSelect.prop('disabled', false).show();
        if (stateSelect.next('.select2').length) {
          stateSelect.next('.select2').show();
        }
        stateInput.prop('disabled', true).hide();
      }
      function showStateInput(options) {
        var opts = options || {};
        var preserveExisting = !!opts.preserveExisting;
        if (!preserveExisting) {
          lastNonUSState = stateInput.val() || '';
          stateInput.val(lastNonUSState).trigger('input');
        }
        destroySelect2(stateSelect);
        stateSelect.val('').prop('disabled', true).hide().trigger('change');
        if (stateSelect.next('.select2').length) {
          stateSelect.next('.select2').hide();
        }
        stateInput.prop('disabled', false).show();
      }
      function syncInputToSelectIfPossible() {
        var raw = (stateInput.val() || '').trim();
        if (!raw) return;
        var upper = raw.toUpperCase();
        var opt = stateSelect.find('option[value="' + upper + '"]');
        if (opt.length) {
          stateSelect.val(upper).trigger('change');
          return;
        }
        stateSelect.find('option').each(function () {
          var textUpper = ($(this).text() || '').trim().toUpperCase();
          if (textUpper === upper) {
            stateSelect.val($(this).val()).trigger('change');
            return false;
          }
        });
      }
      function toggleStateField(isInit) {
        var val = (countrySelect.val() || '').toUpperCase();
        if (val === 'US') {
          if (prevCountry !== 'US') {
            lastNonUSState = stateInput.val() || '';
          }
          showStateSelect();
        } else {
          var preserve = !!isInit && prevCountry !== 'US';
          showStateInput({
            preserveExisting: preserve
          });
        }
        prevCountry = val;
      }
      if (stateSelect.length && stateInput.length) {
        if (countrySelect.length) {
          toggleStateField(true);
        } else {
          showStateInput({
            preserveExisting: true
          });
        }
      }
      if (countrySelect.length) {
        countrySelect.on('change', function () {
          toggleStateField(false);
          $(this).removeClass('masterstudy-personal-info-error');
        });
      }
    }
    function init() {
      if (window.profileForm) {
        additionalFields = window.profileForm;
      }
      descriptionInput.val(data.meta.description);
      firstNameInput.val(data.meta.first_name);
      lastNameInput.val(data.meta.last_name);
      displayNameOptionsContainer.val(data.meta.display_name || selectedDisplayName);
      positionInput.val(data.meta.position);
      linkedinInput.val(data.meta.linkedin);
      facebookInput.val(data.meta.facebook);
      twitterInput.val(data.meta.twitter);
      instagramInput.val(data.meta.instagram);
      stateSelect.val(personal_data.state);
      stateInput.val(personal_data.state);
      postcodeInput.val(personal_data.post_code);
      cityInput.val(personal_data.city);
      companyInput.val(personal_data.company);
      phoneInput.val(personal_data.phone);
      countrySelect.val(personal_data.country);
      emailNotifications.prop('checked', data.meta.disable_report_email_notifications !== true);
      taxesSetup();
      updateDisplayNameOptions(true);
    }
    init();
    descriptionInput.on('input', function () {
      data.meta.description = $(this).val();
    });
    firstNameInput.on('input', function () {
      data.meta.first_name = $(this).val();
      updateDisplayNameOptions(false);
    });
    lastNameInput.on('input', function () {
      data.meta.last_name = $(this).val();
      updateDisplayNameOptions(false);
    });
    displayNameOptionsContainer.on('change', function () {
      data.meta.display_name = $(this).val();
    });
    positionInput.on('input', function () {
      data.meta.position = $(this).val();
    });
    emailNotifications.on('change', function () {
      data.meta.disable_report_email_notifications = !$(this).is(':checked');
    });
    newPasswordIcon.on('mousedown', function () {
      togglePasswordEye(true, $(this), newPasswordInput);
    });
    newPasswordIcon.on('mouseup', function () {
      togglePasswordEye(false, $(this), newPasswordInput);
    });
    newPasswordInput.on('input', function () {
      data.meta.new_pass = $(this).val();
    });
    reTypeNewPasswordIcon.on('mousedown', function () {
      togglePasswordEye(true, $(this), reTypeNewPasswordInput);
    });
    reTypeNewPasswordIcon.on('mouseup', function () {
      togglePasswordEye(false, $(this), reTypeNewPasswordInput);
    });
    reTypeNewPasswordInput.on('input', function () {
      data.meta.new_pass_re = $(this).val();
    });
    facebookInput.on('input', function () {
      data.meta.facebook = $(this).val();
    });
    linkedinInput.on('input', function () {
      data.meta.linkedin = $(this).val();
    });
    twitterInput.on('input', function () {
      data.meta.twitter = $(this).val();
    });
    instagramInput.on('input', function () {
      data.meta.instagram = $(this).val();
    });
    countrySelect.on('change', function () {
      personal_data.country = $(this).val();
    });
    stateInput.on('input', function () {
      personal_data.state = $(this).val();
    });
    postcodeInput.on('input', function () {
      personal_data.post_code = $(this).val();
    });
    cityInput.on('input', function () {
      personal_data.city = $(this).val();
    });
    companyInput.on('input', function () {
      personal_data.company = $(this).val();
    });
    phoneInput.on('input', function () {
      personal_data.phone = $(this).val();
    });
    saveBtn.on('click', function () {
      saveUserInfo();
    });
  });
})(jQuery);