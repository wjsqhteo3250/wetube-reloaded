import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    email : {type: String, required : true, unique : true},
    socialOnly : {type: Boolean, default : false},
    avatarUrl : String,
    username : {type: String, required: true, unique : true},
    password : String,
    name : {type: String},
    location :String,
    
});

userSchema.pre("save", async function () {
    try{
        this.password = await bcrypt.hash(this.password, 5);
    } 
    catch {
        console.log("err hashing password");
        
    }
})

const User = mongoose.model("User", userSchema);
export default User;