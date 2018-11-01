"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _DlogsActions = require("../action/DlogsActions");

var _DlogsActions2 = _interopRequireDefault(_DlogsActions);

var _http = require("http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = require('fs');

var DlogsStore = function (_Reflux$Store) {
    _inherits(DlogsStore, _Reflux$Store);

    function DlogsStore() {
        _classCallCheck(this, DlogsStore);

        var _this = _possibleConstructorReturn(this, (DlogsStore.__proto__ || Object.getPrototypeOf(DlogsStore)).call(this));

        _this.initializeState = function () {
            var Max = 10;
            var blogs = [];
            var count = 0;
            _this.dlogs.allAccounts().then(function (addr) {
                return _this.dlogs.linkAccount(addr[0]).then(function (r) {
                    if (r.result) {
                        _this.setState({ login: true, account: _this.dlogs.getAccount() });
                    }
                });
            }).then(function () {
                _this.dlogs.browse(0, Max).then(function (helper) {
                    helper.map(function (value, index) {
                        var ipns = value.ipnsHash;
                        _this.dlogs.pullIPNS(ipns).then(function (metaJSON) {
                            var tempBlogs = Object.keys(metaJSON.Articles).map(function (hash) {
                                return _extends({}, metaJSON.Articles[hash], { ipfsHash: hash });
                            });
                            blogs = [].concat(_toConsumableArray(blogs), _toConsumableArray(tempBlogs));
                            count = count + 1;
                            // if (count == helper.length) {
                            _this.setState({ blogs: blogs });
                            // }
                        }).catch(function (e) {
                            count = count + 1;
                            // if (count == helper.length) {
                            _this.setState({ blogs: blogs });
                            // }
                        });
                    });
                });
            });
        };

        _this.getBlogOnlyShowForBloger = function () {
            _this.dlogs.lookUpByAddr(_this.state.onlyShowForBlogger).then(function (ipns) {
                _this.dlogs.pullIPNS(ipns).then(function (metaJSON) {
                    var blogs = Object.keys(metaJSON.Articles).map(function (hash) {
                        return _extends({}, metaJSON.Articles[hash], { ipfsHash: hash });
                    });
                    _this.setState({ blogs: blogs });
                });
            });
        };

        _this.onFetchBlogContent = function (ipfsHash) {
            _this.setState({ currentBlogContent: "" });
            _this.dlogs.ipfsRead(ipfsHash).then(function (r) {
                _this.setState({ currentBlogContent: r });
            });
        };

        _this.onSaveNewBlog = function (title, TLDR, content) {
            var tempFile = "/tmp/.tempBlog";
            var tempIPNSFile = "/tmp/.ipns.json";

            fs.writeFileSync(tempFile, content, 'utf8');
            _this.dlogs.lookUpByAddr(_this.dlogs.getAccount()).then(function (ipns) {
                _this.dlogs.ipfsPut(tempFile).then(function (r) {
                    _this.dlogs.pullIPNS(ipns).then(function (metaJSON) {
                        var newArticle = { title: title, author: _this.dlogs.getAccount(), timestamp: Date.now(), TLDR: TLDR };
                        var newJSON = _extends({}, metaJSON);
                        newJSON.Articles = _extends({}, newJSON.Articles, _defineProperty({}, r[0].hash, newArticle));
                        fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                        _this.dlogs.ipfsPut(tempIPNSFile).then(function (r) {
                            _this.dlogs.ipnsPublish(r[0].hash).then(function (rc) {
                                fs.unlinkSync(tempFile);
                                fs.unlinkSync(tempIPNSFile);
                            });
                        });
                    });
                });
            });
        };

        _this.onDeleteBlog = function (ipfsHash) {
            var tempIPNSFile = "/tmp/.ipns.json";
            _this.dlogs.lookUpByAddr(_this.dlogs.getAccount()).then(function (ipns) {
                _this.dlogs.pullIPNS(ipns).then(function (metaJSON) {
                    var newJSON = _extends({}, metaJSON);
                    var articles = newJSON.Articles;
                    articles[ipfsHash] = undefined;
                    newJSON.Articles = articles;
                    fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                    _this.dlogs.ipfsPut(tempIPNSFile).then(function (r) {
                        _this.dlogs.ipnsPublish(r[0].hash).then(function (rc) {
                            fs.unlinkSync(tempIPNSFile);
                        });
                    });
                });
            });
        };

        _this.onEditBlog = function (title, TLDR, content, ipfsHash) {
            var tempFile = "/tmp/.tempBlog";
            var tempIPNSFile = "/tmp/.ipns.json";

            fs.writeFileSync(tempFile, content, 'utf8');
            _this.dlogs.lookUpByAddr(_this.dlogs.getAccount()).then(function (ipns) {
                _this.dlogs.ipfsPut(tempFile).then(function (r) {
                    console.log(r);
                    _this.dlogs.pullIPNS(ipns).then(function (metaJSON) {
                        var newArticle = { title: title, author: _this.dlogs.getAccount(), timestamp: Date.now(), TLDR: TLDR };
                        var newJSON = _extends({}, metaJSON);
                        var articles = newJSON.Articles;
                        articles[ipfsHash] = undefined;
                        newJSON.Articles = articles;
                        newJSON.Articles = _extends({}, newJSON.Articles, _defineProperty({}, r[0].hash, newArticle));
                        fs.writeFileSync(tempIPNSFile, JSON.stringify(newJSON), 'utf8');
                        _this.dlogs.ipfsPut(tempIPNSFile).then(function (r) {
                            _this.dlogs.ipnsPublish(r[0].hash).then(function (rc) {
                                fs.unlinkSync(tempFile);
                                fs.unlinkSync(tempIPNSFile);
                            });
                        });
                    });
                });
            });
        };

        _this.onUnlock = function (pw) {
            _this.dlogs.client.request('unlock', [pw]).then(function (rc) {
                if (!rc.result) return false;
                _this.dlogs.allAccounts().then(function (addr) {
                    _this.dlogs.linkAccount(addr[0]).then(function (r) {
                        if (r) {
                            _this.setState({ login: true, account: _this.dlogs.getAccount() });
                        }
                    });
                });
            });
        };

        _this.onRefresh = function () {
            _this.setState({ blogs: [] });
            _this.initializeState();
        };

        _this.listenables = _DlogsActions2.default;
        var remote = require('electron').remote;
        _this.dlogs = remote.getGlobal('dlogs');

        _this.dlogs.ipfsId().then(function (o) {
            console.log(JSON.stringify(o, 0, 2));
            _this.initializeState();
        });

        _this.state = {
            blogs: [],
            following: [],
            displayBlogs: [],
            onlyShowForBlogger: "",
            currentBlogContent: "",
            login: false,
            account: ""

        };

        return _this;
    }

    return DlogsStore;
}(_reflux2.default.Store);

DlogsStore.id = "DlogsStore";

exports.default = DlogsStore;