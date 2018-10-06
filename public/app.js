"use strict";

var _MainView = require("./view/MainView");

var _MainView2 = _interopRequireDefault(_MainView);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var remote = require('electron').remote;
var ipfs = remote.getGlobal('ipfs');
var DLogsAPI = require('../DLogsAPI.js');

var dlogs = new DLogsAPI('../.local/config.json');

ipfs.ipfsAPI.id().then(function (o) {
  console.log(JSON.stringify(o, 0, 2));
}).then(function () {
  return dlogs.connect();
}).then(function () {
  return dlogs.init(ipfs);
}).then(function (r) {
  if (r) console.log(dlogs.web3.eth.blockNumber);
});

_reactDom2.default.render(_react2.default.createElement(_MainView2.default, null), document.getElementById("app"));