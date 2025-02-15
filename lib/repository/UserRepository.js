"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserRepository = void 0;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserRepository = /*#__PURE__*/function () {
  function UserRepository(_ref) {
    var connection = _ref.connection;

    _classCallCheck(this, UserRepository);

    this.table = 'users';
    this.connection = connection;
  }

  _createClass(UserRepository, [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var chatId, username;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                chatId = _ref2.chatId, username = _ref2.username;
                console.log({
                  chatId: chatId,
                  username: username
                });

                if (!(!chatId || !username)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", 'No data specified!');

              case 4:
                _context.prev = 4;
                _context.next = 7;
                return this.connection.execute(['INSERT INTO', "".concat(this.table, " (chatId, username)"), 'VALUES', "(".concat(chatId, ", \"").concat(username, "\")")].join(' '));

              case 7:
                return _context.abrupt("return", 'User was added!');

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](4);
                return _context.abrupt("return", "Error: ".concat(_context.t0));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 10]]);
      }));

      function create(_x) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
        var chatId, arghs, fields, _i, _fields, field;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                chatId = _ref3.chatId, arghs = _objectWithoutProperties(_ref3, ["chatId"]);

                if (chatId) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                fields = Object.keys(arghs);
                _i = 0, _fields = fields;

              case 5:
                if (!(_i < _fields.length)) {
                  _context2.next = 18;
                  break;
                }

                field = _fields[_i];
                _context2.prev = 7;
                _context2.next = 10;
                return this.connection.execute("\n                    UPDATE \n                        ".concat(this.table, "\n                    SET \n                        ").concat(field, " = ").concat(this.wrapWithQuotes(arghs[field]), "\n                    WHERE \n                        chatId = ").concat(chatId, "\n                "));

              case 10:
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](7);
                return _context2.abrupt("return", "Error: ".concat(_context2.t0));

              case 15:
                _i++;
                _context2.next = 5;
                break;

              case 18:
                return _context2.abrupt("return", 'Updated.');

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 12]]);
      }));

      function update(_x2) {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref4) {
        var row, value;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                row = _ref4.row, value = _ref4.value;
                _context3.prev = 1;
                _context3.next = 4;
                return this.connection.execute("\n                SELECT * \n                FROM \n                    ".concat(this.table, "\n                WHERE \n                    ").concat(row, " = ").concat(this.wrapWithQuotes(value), "\n            "));

              case 4:
                return _context3.abrupt("return", _context3.sent);

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](1);
                return _context3.abrupt("return", 'Error: ' + _context3.t0);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 7]]);
      }));

      function read(_x3) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref5) {
        var chatId;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                chatId = _ref5.chatId;
                _context4.prev = 1;
                _context4.next = 4;
                return this.connection.execute("\n                DELETE FROM \n                    ".concat(this.table, "\n                WHERE \n                    chatId = ").concat(chatId, "\n            "));

              case 4:
                return _context4.abrupt("return", 'Deleted.');

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](1);
                return _context4.abrupt("return", 'Error: ' + _context4.t0);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 7]]);
      }));

      function _delete(_x4) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "wrapWithQuotes",
    value: function wrapWithQuotes(value) {
      if (typeof value === 'string') {
        return "\"".concat(value, "\"");
      }

      return value;
    }
  }]);

  return UserRepository;
}();

exports.UserRepository = UserRepository;