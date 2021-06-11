"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.see = exports.postChangePassword = exports.getChangePassword = exports.postEdit = exports.getEdit = exports.logout = exports.finishGithubLogin = exports.startGithubLogin = exports.postLogin = exports.getLogin = exports.postJoin = exports.getJoin = void 0;

var _User = _interopRequireDefault(require("../models/User.js"));

var _Video = _interopRequireDefault(require("../models/Video.js"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getJoin = function getJoin(req, res) {
  res.render("join", {
    pageTitle: "join"
  });
};

exports.getJoin = getJoin;

var postJoin = function postJoin(req, res) {
  var _req$body, email, username, password, password2, name, location, exists, pageTitle;

  return regeneratorRuntime.async(function postJoin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, username = _req$body.username, password = _req$body.password, password2 = _req$body.password2, name = _req$body.name, location = _req$body.location;
          _context.next = 3;
          return regeneratorRuntime.awrap(_User["default"].exists({
            $or: [{
              username: username
            }, {
              email: email
            }]
          }));

        case 3:
          exists = _context.sent;
          pageTitle = "Join";

          if (!(password !== password2)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "password confimation does not match."
          }));

        case 7:
          if (!exists) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: "same username/email has already existed."
          }));

        case 9:
          _context.prev = 9;
          _context.next = 12;
          return regeneratorRuntime.awrap(_User["default"].create({
            email: email,
            username: username,
            password: password,
            name: name,
            location: location
          }));

        case 12:
          res.redirect("/login");
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](9);
          return _context.abrupt("return", res.status(400).render("join", {
            pageTitle: pageTitle,
            errorMessage: _context.t0._message
          }));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 15]]);
};

exports.postJoin = postJoin;

var getLogin = function getLogin(req, res) {
  res.render("login", {
    pageTitle: "Login"
  });
};

exports.getLogin = getLogin;

var postLogin = function postLogin(req, res) {
  var _req$body2, username, password, user, pageTitle, userPassword, match;

  return regeneratorRuntime.async(function postLogin$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            username: username,
            socialOnly: false
          }));

        case 3:
          user = _context2.sent;
          pageTitle = "Login";

          if (user) {
            _context2.next = 9;
            break;
          }

          res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage: "An account with these username doesn\'t exist."
          });
          _context2.next = 18;
          break;

        case 9:
          userPassword = user.password;
          _context2.next = 12;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, userPassword));

        case 12:
          match = _context2.sent;

          if (match) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage: "wrong password"
          }));

        case 15:
          req.session.loggedIn = true;
          req.session.user = user;
          return _context2.abrupt("return", res.redirect("/"));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.postLogin = postLogin;

var startGithubLogin = function startGithubLogin(req, res) {
  var baseUrl = 'https://github.com/login/oauth/authorize';
  var config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  };
  var params = new URLSearchParams(config).toString();
  var finalUrl = "".concat(baseUrl, "?").concat(params);
  return res.redirect(finalUrl);
};

exports.startGithubLogin = startGithubLogin;

var finishGithubLogin = function finishGithubLogin(req, res) {
  var baseUrl, config, params, finalUrl, tokenRequest, access_token, apiUrl, userData, emailData, emailObj, user;
  return regeneratorRuntime.async(function finishGithubLogin$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          baseUrl = 'https://github.com/login/oauth/access_token';
          config = {
            client_id: process.env.GH_CLIENT,
            client_secret: process.env.GH_SECRET,
            code: req.query.code
          };
          params = new URLSearchParams(config).toString();
          finalUrl = "".concat(baseUrl, "?").concat(params);
          _context3.t0 = regeneratorRuntime;
          _context3.next = 7;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])(finalUrl, {
            method: "post",
            headers: {
              Accept: "application/json"
            }
          }));

        case 7:
          _context3.t1 = _context3.sent.json();
          _context3.next = 10;
          return _context3.t0.awrap.call(_context3.t0, _context3.t1);

        case 10:
          tokenRequest = _context3.sent;

          if (!("access_token" in tokenRequest)) {
            _context3.next = 44;
            break;
          }

          access_token = tokenRequest.access_token;
          apiUrl = "https://api.github.com";
          _context3.t2 = regeneratorRuntime;
          _context3.next = 17;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])("".concat(apiUrl, "/user"), {
            headers: {
              Authorization: "token ".concat(access_token)
            }
          }));

        case 17:
          _context3.t3 = _context3.sent.json();
          _context3.next = 20;
          return _context3.t2.awrap.call(_context3.t2, _context3.t3);

        case 20:
          userData = _context3.sent;
          _context3.t4 = regeneratorRuntime;
          _context3.next = 24;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])("".concat(apiUrl, "/user/emails"), {
            headers: {
              Authorization: "token ".concat(access_token)
            }
          }));

        case 24:
          _context3.t5 = _context3.sent.json();
          _context3.next = 27;
          return _context3.t4.awrap.call(_context3.t4, _context3.t5);

        case 27:
          emailData = _context3.sent;
          emailObj = emailData.find(function (email) {
            return email.primary === true && email.verified === true;
          });

          if (emailObj) {
            _context3.next = 31;
            break;
          }

          return _context3.abrupt("return", res.redirect("/login"));

        case 31:
          ;
          _context3.next = 34;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            email: emailObj.email
          }));

        case 34:
          user = _context3.sent;

          if (user) {
            _context3.next = 39;
            break;
          }

          _context3.next = 38;
          return regeneratorRuntime.awrap(_User["default"].create({
            email: emailObj.email,
            avatarUrl: userData.avatar_url,
            username: userData.login,
            socialOnly: true,
            password: "",
            name: userData.name,
            location: userData.location
          }));

        case 38:
          user = _context3.sent;

        case 39:
          req.session.loggedIn = true;
          req.session.user = user;
          return _context3.abrupt("return", res.redirect("/"));

        case 44:
          return _context3.abrupt("return", res.redirect("/login"));

        case 45:
          ;

        case 46:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.finishGithubLogin = finishGithubLogin;

var logout = function logout(req, res) {
  req.flash("info", "bye bye");
  req.session.destroy();
  return res.redirect("/");
};

exports.logout = logout;

var getEdit = function getEdit(req, res) {
  return res.render("edit-profile", {
    pageTitle: "Edit profile"
  });
};

exports.getEdit = getEdit;

var postEdit = function postEdit(req, res) {
  var _req$session$user, _id, avatarUrl, _req$body3, name, email, username, location, file, existUsername, existUserEmail, updatedUser;

  return regeneratorRuntime.async(function postEdit$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$session$user = req.session.user, _id = _req$session$user._id, avatarUrl = _req$session$user.avatarUrl, _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, username = _req$body3.username, location = _req$body3.location, file = req.file;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            username: username
          }));

        case 3:
          existUsername = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            email: email
          }));

        case 6:
          existUserEmail = _context4.sent;

          if (!existUsername) {
            _context4.next = 10;
            break;
          }

          if (!(existUsername._id.toString() !== _id)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.render("edit-profile", {
            pageTitle: "Edit profile",
            errorMessage: "username already exist"
          }));

        case 10:
          if (!existUserEmail) {
            _context4.next = 13;
            break;
          }

          if (!(existUserEmail._id.toString() !== _id)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.render("edit-profile", {
            pageTitle: "Edit profile",
            errorMessage: "email already exist"
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(_User["default"].findByIdAndUpdate(_id, {
            name: name,
            email: email,
            username: username,
            location: location,
            avatarUrl: file ? file.path : avatarUrl
          }, {
            "new": true
          }));

        case 15:
          updatedUser = _context4.sent;
          req.session.user = updatedUser;
          return _context4.abrupt("return", res.redirect("/"));

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.postEdit = postEdit;

var getChangePassword = function getChangePassword(req, res) {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "can\'t change password");
    return res.redirect("/");
  }

  return res.render("users/change-password", {
    pageTitle: "Change Password"
  });
};

exports.getChangePassword = getChangePassword;

var postChangePassword = function postChangePassword(req, res) {
  var _id, _req$body4, oldPassword, newPassword, newPassword1, user, ok;

  return regeneratorRuntime.async(function postChangePassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _id = req.session.user._id, _req$body4 = req.body, oldPassword = _req$body4.oldPassword, newPassword = _req$body4.newPassword, newPassword1 = _req$body4.newPassword1;

          if (!(newPassword !== newPassword1)) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "new password doesn\'t match with confirmation"
          }));

        case 3:
          _context5.next = 5;
          return regeneratorRuntime.awrap(_User["default"].findById(_id));

        case 5:
          user = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(oldPassword, user.password));

        case 8:
          ok = _context5.sent;

          if (ok) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "current Password is not right"
          }));

        case 11:
          user.password = newPassword;
          _context5.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          req.session.user.password = user.password;
          req.flash("info", "password updated");
          return _context5.abrupt("return", res.redirect("/users/logout"));

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.postChangePassword = postChangePassword;

var see = function see(req, res) {
  var id, user;
  return regeneratorRuntime.async(function see$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_User["default"].findById(id).populate({
            path: "videos",
            populate: {
              path: "owner",
              model: "User"
            }
          }));

        case 3:
          user = _context6.sent;

          if (user) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", res.status(404).render('404', {
            pageTitle: "User Not Found"
          }));

        case 6:
          return _context6.abrupt("return", res.render("users/userProfile", {
            pageTitle: "".concat(user.username, "\uC758 profile"),
            user: user
          }));

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.see = see;