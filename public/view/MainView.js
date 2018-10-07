"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _DlogsStore = require("../store/DlogsStore");

var _DlogsStore2 = _interopRequireDefault(_DlogsStore);

var _DlogsActions = require("../action/DlogsActions");

var _DlogsActions2 = _interopRequireDefault(_DlogsActions);

var _BlogView = require("./BlogView");

var _BlogView2 = _interopRequireDefault(_BlogView);

var _NewBlog = require("./NewBlog");

var _NewBlog2 = _interopRequireDefault(_NewBlog);

var _reactRenderHtml = require("react-render-html");

var _reactRenderHtml2 = _interopRequireDefault(_reactRenderHtml);

var _marked = require("marked");

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainView = function (_Reflux$Component) {
    _inherits(MainView, _Reflux$Component);

    function MainView(props) {
        _classCallCheck(this, MainView);

        var _this = _possibleConstructorReturn(this, (MainView.__proto__ || Object.getPrototypeOf(MainView)).call(this, props));

        _this.getBlogList = function () {
            var colors = ['purple', 'yellow'];
            return _this.state.blogs.map(function (blog, idx) {
                var magic = (idx + 1) % 2;
                var layout = magic == 0 ? 'rpicDiv' : 'lpicDiv';
                var prefix = magic == 0 ? 'r' : 'l';
                return _react2.default.createElement(
                    "div",
                    { className: layout, onClick: _this.goToBlog.bind(_this, blog) },
                    _react2.default.createElement(
                        "div",
                        { className: prefix + 'titleDiv' },
                        blog.title,
                        _react2.default.createElement("br", null),
                        (0, _reactRenderHtml2.default)((0, _marked2.default)(blog.TLDR))
                    ),
                    _react2.default.createElement("div", { className: prefix + 'picDiv', style: { backgroundColor: colors[magic] } })
                );
            });
        };

        _this.goToBlog = function (blog) {
            _this.setState({ view: "Content", currentBlog: blog });
        };

        _this.goToNewBlog = function () {
            _this.setState({ view: "New" });
        };

        _this.goBackToList = function () {
            _this.setState({ view: "List", currentBlog: "" });
        };

        _this.saveNewBlog = function (blogTitle, blogContent) {
            _DlogsActions2.default.saveNewBlog(blogTitle, blogContent);
            _this.goBackToList();
        };

        _this.state = {
            view: "List",
            currentBlog: ""
        };

        _this.store = _DlogsStore2.default;
        return _this;
    }

    _createClass(MainView, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                null,
                this.state.view === "List" ? this.getBlogList() : this.state.view === "Content" ? _react2.default.createElement(_BlogView2.default, { blog: this.state.currentBlog, goBack: this.goBackToList }) : _react2.default.createElement(_NewBlog2.default, { saveNewBlog: this.saveNewBlog }),
                this.state.view === "List" ? _react2.default.createElement(
                    "button",
                    { onClick: this.goToNewBlog },
                    " New "
                ) : ""
            );
        }
    }]);

    return MainView;
}(_reflux2.default.Component);

exports.default = MainView;