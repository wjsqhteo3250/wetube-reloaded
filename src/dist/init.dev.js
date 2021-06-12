"use strict";

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

require("dotenv/config");

require("./db.js");

var _Video = _interopRequireDefault(require("./models/Video.js"));

var _User = _interopRequireDefault(require("./models/User.js"));

var _Comment = _interopRequireDefault(require("./models/Comment.js"));

var _server = _interopRequireDefault(require("./server.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_server["default"].listen(4000, function () {
  console.log("Listening on port 4000");
});