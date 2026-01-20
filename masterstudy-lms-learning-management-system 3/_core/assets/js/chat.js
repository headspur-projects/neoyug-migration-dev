"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
(function ($) {
  $(document).ready(function () {
    var conversationsContainer = $('.stm_lms_chat__conversations');
    var chatCompanion = $('.stm_lms_chat_companion');
    var companionSyncBtn = chatCompanion.find('.stm_lms_chat_companion__sync-btn');
    var chatMessages = $('.stm_lms_chat_messages');
    var chatSendMessage = $('.stm_lms_chat_messages__send-message');
    var chatSendBtn = $('.stm_lms_chat_messages__send-btn');
    var chatSendResponse = $('.stm_lms_chat_messages__send-response');
    var chatContainer = $('.stm_lms_chat__chat-container');
    var conversations = [];
    var conversationId = 0;
    var instructorPublic = chat_data.instructor_public;
    var studentPublic = chat_data.student_public;
    var user_id = chat_data.user_id;
    var myMessage = '';
    function addConversation(val, idx) {
      conversations.push(val);
      var conversationContainerEl = $('<div>', {
        "class": "stm_lms_chat__conversation ".concat(conversationId === idx ? 'active' : '')
      });
      conversationContainerEl.attr('data-conversation-id', idx);
      var conversationItem = "\n                <div class=\"stm_lms_chat__conversation__image\">".concat(val['companion']['avatar'], "</div>\n                <div class=\"stm_lms_chat__conversation__meta\">\n                    <div class=\"stm_lms_chat__conversation__title\">\n                        <h5>").concat(val['companion']['login'], "</h5>\n                    </div>\n                    <div class=\"stm_lms_chat__conversation__date\">").concat(val['conversation_info']['ago'], "</div>\n                </div>\n\n                ").concat(val['conversation_info']['user_form'] === user_id ? "<div class=\"stm_lms_chat__conversation__messages_num ".concat(val['conversation_info']['uf_new_messages'] > 0 ? 'has_new' : '', "\">\n                    <span class=\"new-message\">").concat(val['conversation_info']['uf_new_messages'], "</span>\n                    <span class=\"all-message\">").concat(val['conversation_info']['messages_number'], "</span>\n                </div>") : "<div class=\"stm_lms_chat__conversation__messages_num ".concat(val['conversation_info']['ut_new_messages'] > 0 ? 'has_new' : '', "\">\n                    <span class=\"new-message\">").concat(val['conversation_info']['ut_new_messages'], "</span>\n                    <span class=\"all-message\">").concat(val['conversation_info']['messages_number'], "</span>\n                </div>"), "\n            ");
      conversationContainerEl.append(conversationItem);
      conversationContainerEl.on('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var oldId, messageKeys, url;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              //Change chat
              oldId = conversationId;
              conversationId = idx;
              messageKeys = ["uf_new_messages", "ut_new_messages"];
              messageKeys.forEach(function (key) {
                if (conversations[idx]['conversation_info'][key] > 0) {
                  conversations[idx]['conversation_info'][key] = 0;
                }
              });
              url = stm_lms_ajaxurl + '?action=stm_lms_clear_new_messages&nonce=' + stm_lms_nonces['stm_lms_clear_new_messages'] + '&conversation_id=' + conversations[conversationId]['conversation_info']['conversation_id'];
              try {
                fetch(url, {
                  method: 'GET'
                });
                renderChat();
                $(this).addClass('active');
                $(".stm_lms_chat__conversation[data-conversation-id=\"".concat(oldId, "\"]")).removeClass('active');
              } catch (e) {
                console.error(e);
                scrollMessagesBottom();
              }
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      })));
      conversationsContainer.append(conversationContainerEl);
    }
    function setIsUpdating(val) {
      companionSyncBtn.toggleClass('active', val);
    }
    function setIsLoading(val) {
      chatSendBtn.toggleClass('loading', val);
    }
    function setResponse(val) {
      chatSendResponse.toggle(!!val);
      chatSendResponse.text(val);
    }
    function renderReply() {
      var conversation = conversations[conversationId];
      var sendLink = $('.stm_lms_chat_messages__send-link');
      var isInstructorOrStudent = instructorPublic && conversation['companion']['is_instructor'] || studentPublic && !conversation['companion']['is_instructor'];
      sendLink.attr('href', isInstructorOrStudent ? conversation['companion']['url'] : null);
      sendLink.toggleClass('stm_lms_chat_messages__send-link_disabled', !isInstructorOrStudent);
      sendLink.text(conversation['companion']['login']);
    }
    function renderMessages() {
      var conversation = conversations[conversationId];
      if (!conversation || !conversation['messages']) return;
      chatMessages.empty();
      conversation.messages.forEach(function (message) {
        chatMessages.append("\n                <div class=\"stm_lms_chat_messages__single ".concat(message.isOwner ? 'owner_message' : 'companion_message', "\">\n                    <div class=\"stm_lms_chat_messages__single_message\">").concat(message.message, "</div>\n                    <div class=\"stm_lms_chat_messages__single_user\">\n                        <div class=\"stm_lms_chat_companion\">\n                            <div class=\"stm_lms_chat_companion__title\">\n                                <h5>").concat(message.companion.login, "</h5>\n                                <label>").concat(message.ago, "</label>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            "));
      });
    }
    function renderChat() {
      var conversation = conversations[conversationId];
      var companionImage = chatCompanion.find('.stm_lms_chat_companion__image');
      var companionTitle = chatCompanion.find('.stm_lms_chat_companion__title');
      var isInstructorOrStudent = instructorPublic && conversation['companion']['is_instructor'] || studentPublic && !conversation['companion']['is_instructor'];
      if (!conversation) return;
      companionImage.html(conversation['companion']['avatar']);
      companionTitle.attr('href', isInstructorOrStudent ? conversation['companion']['url'] : null);
      companionTitle.toggleClass('stm_lms_chat_companion__title_disabled', !isInstructorOrStudent);
      companionTitle.html(conversation['companion']['login']);
      getMessages(conversations[conversationId]['conversation_info']['conversation_id'], false, true);
      renderReply();
    }
    function scrollMessagesBottom() {
      setIsUpdating(false);
      var container = $("#stm_lms_chat_messages");
      container.scrollTop = container.scrollHeight;
    }
    function getConversations() {
      return _getConversations.apply(this, arguments);
    }
    function _getConversations() {
      _getConversations = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var url, res, response;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              url = stm_lms_ajaxurl + '?action=stm_lms_get_user_conversations&nonce=' + stm_lms_nonces['stm_lms_get_user_conversations'];
              _context3.prev = 1;
              _context3.next = 4;
              return fetch(url, {
                method: 'GET'
              });
            case 4:
              res = _context3.sent;
              if (res.ok) {
                _context3.next = 8;
                break;
              }
              console.error('Unable to fetch conversation');
              return _context3.abrupt("return");
            case 8:
              _context3.next = 10;
              return res.json();
            case 10:
              response = _context3.sent;
              conversationsContainer.empty();
              response.forEach(addConversation);
              if (conversations.length) {
                renderChat();
                chatContainer.toggleClass('hidden', false);
              }
              _context3.next = 19;
              break;
            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3["catch"](1);
              console.error(_context3.t0);
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[1, 16]]);
      }));
      return _getConversations.apply(this, arguments);
    }
    function getMessages(_x, _x2, _x3) {
      return _getMessages.apply(this, arguments);
    }
    function _getMessages() {
      _getMessages = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(conversation_id, update, just_send) {
        var url, res, response;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              url = stm_lms_ajaxurl + '?action=stm_lms_get_user_messages&nonce=' + stm_lms_nonces['stm_lms_get_user_messages'] + '&id=' + conversation_id + '&just_send=' + just_send;
              if (!(typeof conversations[conversationId]['messages'] !== 'undefined' && !update)) {
                _context4.next = 5;
                break;
              }
              renderMessages();
              scrollMessagesBottom();
              return _context4.abrupt("return", false);
            case 5:
              if (conversations[conversationId].length) {
                _context4.next = 25;
                break;
              }
              _context4.prev = 6;
              _context4.next = 9;
              return fetch(url, {
                method: 'GET'
              });
            case 9:
              res = _context4.sent;
              if (res.ok) {
                _context4.next = 12;
                break;
              }
              return _context4.abrupt("return");
            case 12:
              _context4.next = 14;
              return res.json();
            case 14:
              response = _context4.sent;
              conversations[conversationId]['messages'] = response['messages'];
              renderMessages();
              _context4.next = 22;
              break;
            case 19:
              _context4.prev = 19;
              _context4.t0 = _context4["catch"](6);
              console.error(_context4.t0);
            case 22:
              _context4.prev = 22;
              scrollMessagesBottom();
              return _context4.finish(22);
            case 25:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[6, 19, 22, 25]]);
      }));
      return _getMessages.apply(this, arguments);
    }
    var init = function init() {
      $('body').addClass('stm_lms_chat_page');
      getConversations();
      setResponse('');
    };
    init();
    companionSyncBtn.on('click', function () {
      setIsUpdating(true);
      getMessages(conversations[conversationId]['conversation_info']['conversation_id'], true);
    });
    chatSendMessage.on('input', function () {
      myMessage = $(this).val();
    });
    chatSendBtn.on('click', /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
        var user_to, data, url, res, response;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              e.preventDefault();
              user_to = conversations[conversationId]['companion']['id'];
              if (myMessage) {
                _context2.next = 4;
                break;
              }
              return _context2.abrupt("return");
            case 4:
              data = {
                to: user_to,
                message: myMessage
              };
              url = stm_lms_ajaxurl + '?action=stm_lms_send_message&nonce=' + stm_lms_nonces['stm_lms_send_message'];
              setResponse('');
              _context2.prev = 7;
              setIsLoading(true);
              _context2.next = 11;
              return fetch(url, {
                method: 'POST',
                body: JSON.stringify(data)
              });
            case 11:
              res = _context2.sent;
              if (res.ok) {
                _context2.next = 14;
                break;
              }
              return _context2.abrupt("return");
            case 14:
              _context2.next = 16;
              return res.json();
            case 16:
              response = _context2.sent;
              if (response.response && 'error' === response.status) {
                setResponse(response.response);
              } else {
                getMessages(conversations[conversationId]['conversation_info']['conversation_id'], true, true);
                myMessage = '';
                chatSendMessage.val('');
              }
              _context2.next = 23;
              break;
            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](7);
              console.error(_context2.t0);
            case 23:
              _context2.prev = 23;
              setIsLoading(false);
              return _context2.finish(23);
            case 26:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[7, 20, 23, 26]]);
      }));
      return function (_x4) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
})(jQuery);