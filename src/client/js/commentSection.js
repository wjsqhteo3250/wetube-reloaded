import fetch from "node-fetch";
import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");
const delComment = document.querySelectorAll(".delComment");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video-comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video-comment"
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`
    const delBtn = document.createElement("button");
    delBtn.innerText = "X";
    delBtn.className = "delComment";
    delBtn.addEventListener("click", handleDeleteComment);
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(delBtn);
    videoComments.prepend(newComment);
}


const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === "") return;
    const response = await fetch(`/api/videos/${videoId}/comment`,{
        method:"post", 
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text})
    });
        textarea.value = "";
        if(response.status === 201) {
            const {newCommentId} = await response.json();
            addComment(text, newCommentId);
        }
}
if(form) {
    form.addEventListener("submit", handleSubmit);
}

const deleteComment = (e) => {
    const li = e.target.parentElement;
    li.remove();
}

const handleDeleteComment = async (e) => {
    const comment = e.target.parentElement;
    const commentId = comment.dataset.id;
    console.log(commentId);
    const response = await fetch(`/api/videos/${commentId}/comment`, {
        method:"delete",
    })
    if(response.status === 200) {
        deleteComment(e);
    }
}
let x;
for(x=0; x<delComment.length; x++) {
    delComment[x].addEventListener("click", handleDeleteComment);
    
}