"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _DlogsActions = require("../action/DlogsActions");

var _DlogsActions2 = _interopRequireDefault(_DlogsActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');

var DlogsStore = function (_Reflux$Store) {
    _inherits(DlogsStore, _Reflux$Store);

    function DlogsStore() {
        _classCallCheck(this, DlogsStore);

        var _this = _possibleConstructorReturn(this, (DlogsStore.__proto__ || Object.getPrototypeOf(DlogsStore)).call(this));

        _this.initializeState = function () {
            var ipns = _this.dlogs.lookUpByAddr(_this.state.onlyShowForBlogger);
            _this.ipfs.pullIPNS(ipns).then(function (metaJSON) {
                var blogs = Object.keys(metaJSON.Articles).map(function (hash) {
                    return _extends({}, metaJSON.Articles[hash], { ipfsHash: hash });
                });
                _this.setState({ blogs: blogs });
            });
        };

        _this.refreshBlogs = function () {};

        _this.onFetchBlogContent = function (ipfsHash) {
            _this.setState({ currentBlogContent: "" });
            _this.ipfs.read(ipfsHash).then(function (r) {
                _this.setState({ currentBlogContent: r.toString() });
            });
        };

        _this.onSaveNewBlog = function (title, content) {
            var blog = { title: title, content: content };
            _this.setState({ blogs: [].concat(_toConsumableArray(_this.state.blogs), [blog]) });
        };

        _this.listenables = _DlogsActions2.default;
        var remote = require('electron').remote;
        _this.ipfs = remote.getGlobal('ipfs');
        var DLogsAPI = require('../../DLogsAPI.js');

        _this.dlogs = new DLogsAPI('../.local/config.json');

        _this.ipfs.ipfsAPI.id().then(function (o) {
            console.log(JSON.stringify(o, 0, 2));
        }).then(function () {
            return _this.dlogs.connect();
        }).then(function () {
            return _this.dlogs.init(_this.ipfs);
        }).then(function (r) {
            if (r) console.log(_this.dlogs.web3.eth.blockNumber);
            _this.initializeState();
        });

        _this.state = {
            blogs: [],
            following: [],
            displayBlogs: [],
            onlyShowForBlogger: "0x89dc07a2f750cf62e757f909a4985a94a07d6359",
            currentBlogContent: ""

        };

        return _this;
    }

    return DlogsStore;
}(_reflux2.default.Store);

DlogsStore.id = "DlogsStore";

exports.default = DlogsStore;