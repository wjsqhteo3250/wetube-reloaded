import Video from "../models/Video.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { compileFile } from "pug";

export const home = async (req, res)=>{
    try {
        const videos = await Video.find({}).sort({createdAt : "desc"}).populate("owner");
        return res.render("home", {pageTitle : "Home", videos })

    }
    catch {
        return res.render("home", {pageTitle : "Home", videos : videos })
    }
};
export const watch = async (req, res) => { 
    const {id} = req.params;
    try {
        const video = await Video.findById(id).populate("owner").populate("comments");
        return res.render("watch", {pageTitle : video.title, video})
    } catch {
        res.status(404).render("404",{pageTitle:"video not found"})
    }
};
export const getEdit = async (req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(String(video.owner) !== _id){
        return res.status(403).redirect("/");
    }
    try {
        return res.render("edit", {pageTitle : `Edit: ${video.title}`, video})
    } catch {
        res.status(404).render("404",{pageTitle:"video not found"})
    }
};
export const postEdit = async (req, res) =>{
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const {title, discription, hashtags} = req.body;
    const ok = await Video.exists({_id:id});
    if(!ok){
        return res.status(404).render("404",{pageTitle:"video not found"});
    }
    const video = await Video.findById(id);
    if(String(video.owner) !== _id){
        req.flash("error", "you are not the owner of the video.");
        return res.status(403).redirect("/");
    }
    try {
        await Video.findByIdAndUpdate(id, {
            title,
            discription,
            hashtags : Video.formatHashtags(hashtags)
        })
        req.flash("success", "changes saved.")
        return res.redirect(`/videos/${id}`);
    } catch {
        res.status(404).render("404",{pageTitle:"video not found"})
    }
}
export const getUpload = (req, res) => {
    return res.render("upload",{pageTitle:"Upload"})
};
export const postUpload = async (req, res) => {
    const {
        body:{title, description, hashtags}, 
        files:{video, thumb}, 
        session:{user:{_id}} }= req;
    const isHeroku = processs.env.NODE_ENV === "production";
    try {
        const newVideo = await Video.create({
            title, 
            description, 
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl:isHeroku ? thumb[0].location : thumb[0].destination+thumb[0].filename,
            // thumb[0].destination+thumb[0].filename
            owner: _id,
            hashtags : Video.formatHashtags(hashtags)
        })
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        await user.save();
        return res.redirect("/")

    }
    catch(e) {
        console.log(e);
        return res.status(400).render("upload",{
            pageTitle:"Upload", 
            errorMessage : e._message
        });
    }
    
};
//delete related database feilds
const deleteRelatedDB = async (model, fields, beDeletedId) => {
    if(fields === "comment") {
        const index = model.comments.indexOf(beDeletedId);
        model.comments.splice(index, 1);
        await model.save();
    }
    if(fields === "video") {
        const index = model.videos.indexOf(beDeletedId);
        model.videos.splice(index, 1);
        await model.save();
    }
}

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if(!video) {
        console.log(1)
       return res.status(404).render("404",{pageTitle:"video not found"})
    }
    if(String(video.owner._id) !== _id){
        return res.status(403).redirect("/");
    }
    const userDB = await User.findById(_id);
    await Video.findByIdAndDelete(id);
    deleteRelatedDB(userDB,"video",id); //when delete video then delete user's video field's one 
    res.redirect("/");        
}

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {
                $regex : new RegExp(keyword, "i")
            }
        }).populate("owner");
    } 
    return res.render("search", {pageTitle: "Search", videos});
};

export const registerView = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.sendStatus(404);
    } 
    video.meta.views = ++video.meta.views;
    await video.save();
    res.sendStatus(200);
}

export const createComment = async (req, res) => {
    const {
        session: {user},
        body: {text},
        params: {id}
    } = req;
    const video = await Video.findById(id);
    const userDB = await User.findById(user._id);
    if(!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id
    }); 
    video.comments.push(comment._id);
    userDB.comments.push(comment._id);
    await video.save();
    await userDB.save();
    return res.status(201).json({newCommentId:comment._id});
}


//deleteComment
export const deleteComment = async (req, res) => {
    const {id} = req.params;
    const {session: {user}} = req;
    const confirm = await Comment.findById(id);
    if(!confirm)  return res.sendStatus(404); 
    if(String(confirm.owner) !== user._id) return res.sendStatus(403);
    const comment = await Comment.findByIdAndRemove(id);
    const users = await User.findById(comment.owner);
    const videos = await Video.findById(comment.video);
    deleteRelatedDB(users, "comment", comment._id);
    deleteRelatedDB(videos, "comment", comment._id);
    return res.sendStatus(200);
}