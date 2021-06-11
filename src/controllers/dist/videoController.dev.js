"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteComment = exports.createComment = exports.registerView = exports.search = exports.deleteVideo = exports.postUpload = exports.getUpload = exports.postEdit = exports.getEdit = exports.watch = exports.home = void 0;

var _Video = _interopRequireDefault(require("../models/Video.js"));

var _User = _interopRequireDefault(require("../models/User.js"));

var _Comment = _interopRequireDefault(require("../models/Comment.js"));

var _pug = require("pug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var home = function home(req, res) {
  var _videos;

  return regeneratorRuntime.async(function home$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].find({}).sort({
            createdAt: "desc"
          }).populate("owner"));

        case 3:
          _videos = _context.sent;
          return _context.abrupt("return", res.render("home", {
            pageTitle: "Home",
            videos: _videos
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.render("home", {
            pageTitle: "Home",
            videos: videos
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.home = home;

var watch = function watch(req, res) {
  var id, video;
  return regeneratorRuntime.async(function watch$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id).populate("owner").populate("comments"));

        case 4:
          video = _context2.sent;
          return _context2.abrupt("return", res.render("watch", {
            pageTitle: video.title,
            video: video
          }));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(404).render("404", {
            pageTitle: "video not found"
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.watch = watch;

var getEdit = function getEdit(req, res) {
  var id, _id, video;

  return regeneratorRuntime.async(function getEdit$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 4:
          video = _context3.sent;

          if (!(String(video.owner) !== _id)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(403).redirect("/"));

        case 7:
          _context3.prev = 7;
          return _context3.abrupt("return", res.render("edit", {
            pageTitle: "Edit: ".concat(video.title),
            video: video
          }));

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](7);
          res.status(404).render("404", {
            pageTitle: "video not found"
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 11]]);
};

exports.getEdit = getEdit;

var postEdit = function postEdit(req, res) {
  var id, _id, _req$body, title, discription, hashtags, ok, video;

  return regeneratorRuntime.async(function postEdit$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _req$body = req.body, title = _req$body.title, discription = _req$body.discription, hashtags = _req$body.hashtags;
          _context4.next = 5;
          return regeneratorRuntime.awrap(_Video["default"].exists({
            _id: id
          }));

        case 5:
          ok = _context4.sent;

          if (ok) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).render("404", {
            pageTitle: "video not found"
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 10:
          video = _context4.sent;

          if (!(String(video.owner) !== _id)) {
            _context4.next = 14;
            break;
          }

          req.flash("error", "you are not the owner of the video.");
          return _context4.abrupt("return", res.status(403).redirect("/"));

        case 14:
          _context4.prev = 14;
          _context4.next = 17;
          return regeneratorRuntime.awrap(_Video["default"].findByIdAndUpdate(id, {
            title: title,
            discription: discription,
            hashtags: _Video["default"].formatHashtags(hashtags)
          }));

        case 17:
          req.flash("success", "changes saved.");
          return _context4.abrupt("return", res.redirect("/videos/".concat(id)));

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](14);
          res.status(404).render("404", {
            pageTitle: "video not found"
          });

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[14, 21]]);
};

exports.postEdit = postEdit;

var getUpload = function getUpload(req, res) {
  return res.render("upload", {
    pageTitle: "Upload"
  });
};

exports.getUpload = getUpload;

var postUpload = function postUpload(req, res) {
  var _req$body2, title, description, hashtags, _req$files, video, thumb, _id, newVideo, user;

  return regeneratorRuntime.async(function postUpload$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, hashtags = _req$body2.hashtags, _req$files = req.files, video = _req$files.video, thumb = _req$files.thumb, _id = req.session.user._id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].create({
            title: title,
            description: description,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].destination + thumb[0].filename,
            owner: _id,
            hashtags: _Video["default"].formatHashtags(hashtags)
          }));

        case 4:
          newVideo = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(_User["default"].findById(_id));

        case 7:
          user = _context5.sent;
          user.videos.push(newVideo._id);
          _context5.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          return _context5.abrupt("return", res.redirect("/"));

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](1);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(400).render("upload", {
            pageTitle: "Upload",
            errorMessage: _context5.t0._message
          }));

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

exports.postUpload = postUpload;

var deleteRelatedDB = function deleteRelatedDB(model, fields, beDeletedId) {
  var index, _index;

  return regeneratorRuntime.async(function deleteRelatedDB$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (!(fields === "comment")) {
            _context6.next = 5;
            break;
          }

          index = model.comments.indexOf(beDeletedId);
          model.comments.splice(index, 1);
          _context6.next = 5;
          return regeneratorRuntime.awrap(model.save());

        case 5:
          if (!(fields === "video")) {
            _context6.next = 10;
            break;
          }

          _index = model.videos.indexOf(beDeletedId);
          model.videos.splice(_index, 1);
          _context6.next = 10;
          return regeneratorRuntime.awrap(model.save());

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var deleteVideo = function deleteVideo(req, res) {
  var id, _id, video, userDB;

  return regeneratorRuntime.async(function deleteVideo$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;
          _id = req.session.user._id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(_Video["default"].findById(id).populate("owner").populate("comments"));

        case 4:
          video = _context7.sent;

          if (video) {
            _context7.next = 8;
            break;
          }

          console.log(1);
          return _context7.abrupt("return", res.status(404).render("404", {
            pageTitle: "video not found"
          }));

        case 8:
          if (!(String(video.owner._id) !== _id)) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", res.status(403).redirect("/"));

        case 10:
          _context7.next = 12;
          return regeneratorRuntime.awrap(_User["default"].findById(_id));

        case 12:
          userDB = _context7.sent;
          _context7.next = 15;
          return regeneratorRuntime.awrap(_Video["default"].findByIdAndDelete(id));

        case 15:
          deleteRelatedDB(userDB, "video", id);
          res.redirect("/");

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.deleteVideo = deleteVideo;

var search = function search(req, res) {
  var keyword, videos;
  return regeneratorRuntime.async(function search$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          keyword = req.query.keyword;
          videos = [];

          if (!keyword) {
            _context8.next = 6;
            break;
          }

          _context8.next = 5;
          return regeneratorRuntime.awrap(_Video["default"].find({
            title: {
              $regex: new RegExp(keyword, "i")
            }
          }).populate("owner"));

        case 5:
          videos = _context8.sent;

        case 6:
          return _context8.abrupt("return", res.render("search", {
            pageTitle: "Search",
            videos: videos
          }));

        case 7:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.search = search;

var registerView = function registerView(req, res) {
  var id, video;
  return regeneratorRuntime.async(function registerView$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          id = req.params.id;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 3:
          video = _context9.sent;

          if (video) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.sendStatus(404));

        case 6:
          video.meta.views = ++video.meta.views;
          _context9.next = 9;
          return regeneratorRuntime.awrap(video.save());

        case 9:
          res.sendStatus(200);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  });
};

exports.registerView = registerView;

var createComment = function createComment(req, res) {
  var user, text, id, video, userDB, comment;
  return regeneratorRuntime.async(function createComment$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          user = req.session.user, text = req.body.text, id = req.params.id;
          _context10.next = 3;
          return regeneratorRuntime.awrap(_Video["default"].findById(id));

        case 3:
          video = _context10.sent;
          _context10.next = 6;
          return regeneratorRuntime.awrap(_User["default"].findById(user._id));

        case 6:
          userDB = _context10.sent;

          if (video) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", res.sendStatus(404));

        case 9:
          _context10.next = 11;
          return regeneratorRuntime.awrap(_Comment["default"].create({
            text: text,
            owner: user._id,
            video: id
          }));

        case 11:
          comment = _context10.sent;
          video.comments.push(comment._id);
          userDB.comments.push(comment._id);
          _context10.next = 16;
          return regeneratorRuntime.awrap(video.save());

        case 16:
          _context10.next = 18;
          return regeneratorRuntime.awrap(userDB.save());

        case 18:
          return _context10.abrupt("return", res.status(201).json({
            newCommentId: comment._id
          }));

        case 19:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.createComment = createComment;

var deleteComment = function deleteComment(req, res) {
  var id, user, confirm, comment, users, videos;
  return regeneratorRuntime.async(function deleteComment$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          id = req.params.id;
          user = req.session.user;
          _context11.next = 4;
          return regeneratorRuntime.awrap(_Comment["default"].findById(id));

        case 4:
          confirm = _context11.sent;

          if (confirm) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.sendStatus(404));

        case 7:
          if (!(String(confirm.owner) !== user._id)) {
            _context11.next = 9;
            break;
          }

          return _context11.abrupt("return", res.sendStatus(403));

        case 9:
          _context11.next = 11;
          return regeneratorRuntime.awrap(_Comment["default"].findByIdAndRemove(id));

        case 11:
          comment = _context11.sent;
          _context11.next = 14;
          return regeneratorRuntime.awrap(_User["default"].findById(comment.owner));

        case 14:
          users = _context11.sent;
          _context11.next = 17;
          return regeneratorRuntime.awrap(_Video["default"].findById(comment.video));

        case 17:
          videos = _context11.sent;
          deleteRelatedDB(users, "comment", comment._id);
          deleteRelatedDB(videos, "comment", comment._id);
          return _context11.abrupt("return", res.sendStatus(200));

        case 21:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.deleteComment = deleteComment;