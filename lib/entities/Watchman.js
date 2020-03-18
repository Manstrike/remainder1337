"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Watchman = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var moment = require('moment');

var Watchman = /*#__PURE__*/function () {
  function Watchman() {
    _classCallCheck(this, Watchman);

    this.moment = moment;
  }

  _createClass(Watchman, [{
    key: "watch",
    value: function watch() {}
  }, {
    key: "stop",
    value: function stop() {}
  }]);

  return Watchman;
}();

exports.Watchman = Watchman;