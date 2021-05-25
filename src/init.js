import "dotenv/config";
import "./db.js";
// import Video from "./models/Video.js"
// import User from "./models/User.js"
import app from "./server.js"

app.listen(4000, ()=>{console.log("Listening on port 4000")});
