import User from "../models/User.js";
import Video from "../models/Video.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) =>{
    res.render("join",{pageTitle: "join"})
};
export const postJoin = async (req, res) => {
    const {email, username, password, password2, name, location} = req.body;
    const exists = await User.exists({$or:[{username}, {email}]});
    const pageTitle = "Join";
    if(password !==password2){
        return res.status(400).render("join",{
            pageTitle, 
            errorMessage:"password confimation does not match."
        });
    }
    if(exists) {
        return res.status(400).render("join",{
            pageTitle, 
            errorMessage:"same username/email has already existed."
        });
    }
    try {
        await User.create({
            email, 
            username, 
            password, 
            name, 
            location
        });
        res.redirect("/login");
    } catch(e) {
        return res.status(400).render("join",{
            pageTitle, 
            errorMessage: e._message
        });
    }
};

export const getLogin = (req, res) =>{
    res.render("login", {pageTitle: "Login"});
};

export const postLogin = async (req, res) =>{
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly : false});
    const pageTitle = "Login";
    if(!user) {
        res.status(400).render("login", {
            pageTitle, 
            errorMessage: "An account with these username doesn\'t exist."
        })
    } else {
        const userPassword = user.password;
        const match = await bcrypt.compare(password, userPassword);
        if(!match)
        {
            return res.status(400).render("login", {
                pageTitle,
                errorMessage: "wrong password"
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }
};

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize'
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req,res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(finalUrl, {
            method : "post",
            headers: {
                Accept: "application/json"
            }
    })).json();
    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("/login");
        };
        let user = await User.findOne({email : emailObj.email});
        if(!user) {
            user =  await User.create({
                email : emailObj.email,
                avatarUrl : userData.avatar_url,
                username : userData.login,
                socialOnly : true,
                password : "",
                name : userData.name,
                location : userData.location
            });
        } 
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
    } else {
        return res.redirect("/login");
    };
};

export const logout = (req, res) =>{
    req.flash("info", "bye bye");
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) =>{
    return res.render("edit-profile", {pageTitle:"Edit profile"});
};

export const postEdit = async (req, res) =>{
    const {session : {user: {_id, avatarUrl}},
            body : {name, email, username, location}, 
            file} = req;
    const existUsername = await User.findOne({username});
    const existUserEmail = await User.findOne({email});
    if (existUsername){
        if (existUsername._id.toString() !== _id){
            return res.render("edit-profile", {
                    pageTitle:"Edit profile", errorMessage : "username already exist"});
            }
        }
    if (existUserEmail){
        if (existUserEmail._id.toString() !== _id){
            return res.render("edit-profile", {
                    pageTitle:"Edit profile", errorMessage : "email already exist"});
            }
        }
    const updatedUser = await User.findByIdAndUpdate(_id, 
        {
            name, 
            email, 
            username, 
            location, 
            avatarUrl: file ? file.path : avatarUrl
        },{new: true});
    req.session.user = updatedUser;
    return res.redirect("/");
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true) {
        req.flash("error", "can\'t change password")
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle:"Change Password"});
}
export const postChangePassword = async (req, res) => {
    const{session : {user: {_id}}, body: {oldPassword, newPassword, newPassword1 } } = req;
    if(newPassword !== newPassword1) {
        return res.status(400).render("users/change-password", {pageTitle:"Change Password", errorMessage:"new password doesn\'t match with confirmation"});
    }
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword,user.password);
    if(!ok) {
        return res.status(400).render("users/change-password", {pageTitle:"Change Password", errorMessage:"current Password is not right"});
    }
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    req.flash("info", "password updated");
    return res.redirect("/users/logout")
}
export const see = async (req, res) =>{
    const {params:{id}} = req;
    const user = await User.findById(id).populate({
        path:"videos",
        populate : {
            path : "owner",
            model : "User"
        }
    });
    if(!user) return res.status(404).render('404', {pageTitle: "User Not Found"});
    return res.render("users/userProfile", {pageTitle:`${user.username}의 profile`, user});
};