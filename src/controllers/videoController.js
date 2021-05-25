import Video from "../models/Video.js"

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
        const video = await Video.findById(id);
        return res.render("watch", {pageTitle : video.title, video})
    } catch {
        res.status(404).render("404",{pageTitle:"video not found"})
    }
};
export const getEdit = async (req, res) => {
    const {id} = req.params;
    try {
        const video = await Video.findById(id);
        return res.render("edit", {pageTitle : `Edit: ${video.title}`, video})
    } catch {
        res.status(404).render("404",{pageTitle:"video not found"})
    }
};
export const postEdit = async (req, res) =>{
    const {id} = req.params;
    const {title, discription, hashtags} = req.body;
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
    const {body:{title, description, hashtags}, file:{path : fileUrl} }= req;
    try {
        await Video.create({
            title, 
            description, 
            fileUrl,
            hashtags : Video.formatHashtags(hashtags)
        })
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