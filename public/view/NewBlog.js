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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewBlog = function (_Reflux$Component) {
    _inherits(NewBlog, _Reflux$Component);

    function NewBlog(props) {
        _classCallCheck(this, NewBlog);

        var _this = _possibleConstructorReturn(this, (NewBlog.__proto__ || Object.getPrototypeOf(NewBlog)).call(this, props));

        _this.getEditView = function () {
            return _react2.default.createElement(
                "form",
                { className: "newForm", style: { width: '100vw', textAlign: 'center' } },
                _react2.default.createElement("textarea", { placeholder: "Title", style: { width: '80vw', height: '30px', backgroundColor: 'rgba(0,0,0,0)',
                        border: '2px solid white', color: 'white' }, onChange: _this.udpateBlog.bind(_this, "blogTitle"), value: _this.state.blogTitle }),
                _react2.default.createElement("textarea", { placeholder: "TL;DR", style: { width: '86vw', height: '5vh', backgroundColor: 'rgba(0,0,0,0)',
                        border: '2px solid white', color: 'white' }, onChange: _this.udpateBlog.bind(_this, "blogTLDR"), value: _this.state.blogTLDR }),
                _react2.default.createElement("textarea", { placeholder: "Content", style: { width: '86vw', height: '80vh', backgroundColor: 'rgba(0,0,0,0)',
                        border: '2px solid white', color: 'white' }, onChange: _this.udpateBlog.bind(_this, "blogContent"), value: _this.state.blogContent })
            );
        };

        _this.udpateBlog = function (field, event) {
            _this.setState(_defineProperty({}, field, event.target.value));
        };

        _this.saveNewBlog = function () {
            _this.props.saveNewBlog(_this.state.blogTitle, _this.state.blogTLDR, _this.state.blogContent);
        };

        _this.changeEditable = function () {
            _this.setState({ isEditable: !_this.state.isEditable });
        };

        _this.getBlogPreview = function () {
            return _react2.default.createElement(
                "div",
                { className: "newForm" },
                _react2.default.createElement(
                    "div",
                    { style: { textAlign: 'center', fontSize: '25px', padding: "35px", textDecoration: 'underline' } },
                    _this.state.blogTitle
                ),
                _react2.default.createElement(
                    "div",
                    { style: { overflow: 'scroll', maxHeight: "85vh", color: 'white', padding: "10px" } },
                    (0, _reactRenderHtml2.default)((0, _marked2.default)(_this.state.blogContent))
                )
            );
        };

        _this.state = props.currentBlog === "" ? {
            isEditable: true,
            blogContent: "",
            blogTitle: "",
            blogTLDR: ""
        } : {
            isEditable: true,
            blogContent: props.currentBlogContent,
            blogTitle: props.currentBlog.title,
            blogTLDR: props.currentBlog.TLDR
        };

        _this.store = _DlogsStore2.default;
        return _this;
    }

    _createClass(NewBlog, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "item newDiv" },
                this.state.isEditable ? this.getEditView() : this.getBlogPreview(),
                _react2.default.createElement("input", { type: "button", className: "button pbutton", defaultValue: this.state.isEditable ? "Preview" : "Edit", onClick: this.changeEditable }),
                _react2.default.createElement("input", { type: "button", className: "button sbutton", defaultValue: "Save", onClick: this.saveNewBlog }),
                _react2.default.createElement("input", { type: "button", className: "button bbutton", defaultValue: "Back", onClick: this.props.goBack })
            );
        }
    }]);

    return NewBlog;
}(_reflux2.default.Component);

exports.default = NewBlog;