"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DlogsActions = _reflux2.default.createActions(["saveNewBlog", "fetchBlogContent", "unlock", "refresh", "deleteBlog", "editBlog"]);

exports.default = DlogsActions;