"use strict";

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _regeneratorRuntime = require("regenerator-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm");
var delComment = document.querySelectorAll(".delComment");

var addComment = function addComment(text, id) {
  var videoComments = document.querySelector(".video-comments ul");
  var newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video-comment";
  var icon = document.createElement("i");
  icon.className = "fas fa-comment";
  var span = document.createElement("span");
  span.innerText = " ".concat(text);
  var delBtn = document.createElement("button");
  delBtn.innerText = "X";
  delBtn.className = "delComment";
  delBtn.addEventListener("click", handleDeleteComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(delBtn);
  videoComments.prepend(newComment);
};

var handleSubmit = function handleSubmit(e) {
  var textarea, text, videoId, response, _ref, newCommentId;

  return regeneratorRuntime.async(function handleSubmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          e.preventDefault();
          textarea = form.querySelector("textarea");
          text = textarea.value;
          videoId = videoContainer.dataset.id;

          if (!(text === "")) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])("/api/videos/".concat(videoId, "/comment"), {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: text
            })
          }));

        case 8:
          response = _context.sent;
          textarea.value = "";

          if (!(response.status === 201)) {
            _context.next = 16;
            break;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(response.json());

        case 13:
          _ref = _context.sent;
          newCommentId = _ref.newCommentId;
          addComment(text, newCommentId);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

var deleteComment = function deleteComment(e) {
  var li = e.target.parentElement;
  li.remove();
};

var handleDeleteComment = function handleDeleteComment(e) {
  var comment, commentId, response;
  return regeneratorRuntime.async(function handleDeleteComment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          comment = e.target.parentElement;
          commentId = comment.dataset.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])("/api/videos/".concat(commentId, "/comment"), {
            method: "delete"
          }));

        case 4:
          response = _context2.sent;

          if (response.status === 200) {
            deleteComment(e);
          }

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var x;

for (x = 0; x < delComment.length; x++) {
  delComment[x].addEventListener("click", handleDeleteComment);
}