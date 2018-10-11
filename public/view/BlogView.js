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

var _reactRenderHtml = require("react-render-html");

var _reactRenderHtml2 = _interopRequireDefault(_reactRenderHtml);

var _marked = require("marked");

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlogView = function (_Reflux$Component) {
    _inherits(BlogView, _Reflux$Component);

    function BlogView(props) {
        _classCallCheck(this, BlogView);

        var _this = _possibleConstructorReturn(this, (BlogView.__proto__ || Object.getPrototypeOf(BlogView)).call(this, props));

        _this.delete = function () {
            _DlogsActions2.default.deleteBlog(_this.props.blog.ipfsHash);
            _this.props.goBack();
        };

        _this.store = _DlogsStore2.default;
        return _this;
    }

    _createClass(BlogView, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "item readloader", style: { margin: '20px 20px 0px 20px' } },
                _react2.default.createElement(
                    "div",
                    { style: { overflow: 'scroll', maxHeight: "85vh", color: 'white', padding: "10px" } },
                    _react2.default.createElement(
                        "div",
                        { style: { textAlign: 'center', fontSize: '25px', padding: "35px", textDecoration: 'underline' } },
                        this.props.blog.title
                    ),
                    (0, _reactRenderHtml2.default)((0, _marked2.default)(this.state.currentBlogContent))
                ),
                this.props.blog.author == this.state.account ? _react2.default.createElement(
                    "div",
                    { className: "item secondmainctr" },
                    " ",
                    _react2.default.createElement("input", { type: "button", className: "button", defaultValue: "Back", onClick: this.props.goBack }),
                    _react2.default.createElement("input", { type: "button", className: "button", defaultValue: "Edit", onClick: this.props.goEdit }),
                    _react2.default.createElement("input", { type: "button", className: "button", defaultValue: "Delete", onClick: this.delete })
                ) : _react2.default.createElement("input", { type: "button", className: "button", defaultValue: "Back", onClick: this.props.goBack })
            );
        }
    }]);

    return BlogView;
}(_reflux2.default.Component);

exports.default = BlogView;