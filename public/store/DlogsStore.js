"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _DlogsActions = require("../action/DlogsActions");

var _DlogsActions2 = _interopRequireDefault(_DlogsActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DlogsStore = function (_Reflux$Store) {
    _inherits(DlogsStore, _Reflux$Store);

    function DlogsStore() {
        _classCallCheck(this, DlogsStore);

        var _this = _possibleConstructorReturn(this, (DlogsStore.__proto__ || Object.getPrototypeOf(DlogsStore)).call(this));

        _this.onSaveNewBlog = function (blog) {
            _this.setState({ blogs: [].concat(_toConsumableArray(_this.state.blogs), [blog]) });
        };

        _this.listenables = _DlogsActions2.default;

        _this.state = {
            blogs: ["# This is Blog 1\n" + "This is the content 1", "# This is Blog 2\n" + "This is the content 2"]
        };
        return _this;
    }

    return DlogsStore;
}(_reflux2.default.Store);

DlogsStore.id = "DlogsStore";

exports.default = DlogsStore;