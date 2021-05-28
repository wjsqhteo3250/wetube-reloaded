import Video from "../models/Video.js";
import User from "../models/User.js";
export const home = async (req, res)=>{
    try {
        const videos = await Video.find({}).sort({createdAt : "desc"});
        return res.render("home", {pageTitle : "Home", videos })

    }
    catch {
        return res.render("home", {pageTitle : "Home", videos : videos })
    }
};
export const watch = async (req, res) => { 
    const {id} = req.params;
    try {
        const video = await Video.findById(id).populate("owner");
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
        return res.status(403).redirect("/");
    }
    try {
        await Video.findByIdAndUpdate(id, {
            title,
            discription,
            hashtags : Video.formatHashtags(hashtags)
        })

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
        file:{path : fileUrl}, 
        session:{user:{_id}} }= req;
    try {
        const newVideo = await Video.create({
            title, 
            description, 
            fileUrl,
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

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video) {
       return res.status(404).render("404",{pageTitle:"video not found"})
    }
    if(String(video.owner) !== _id){
        return res.status(403).redirect("/");
    }
    try{
        await Video.findByIdAndDelete(id);
        res.redirect("/");        
    }
    catch {
        res.redirect("/");        
    }
}

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {
                $regex : new RegExp(keyword, "i")
            }
        });
    } 
    return res.render("search", {pageTitle: "Search", videos});
};