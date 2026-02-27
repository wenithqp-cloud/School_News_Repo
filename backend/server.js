import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

let siteData = {
  heroContent:{title:"Welcome",desc:"Delivering stories",btn:"Watch Latest Broadcast"},
  videos:[],
  teamMembers:[],
  newsItems:[],
  joinRequests:[]
};

// Get site data
app.get("/getSiteData",(req,res)=>res.json(siteData));

// Update site data
app.post("/updateSiteData",(req,res)=>{
  siteData = req.body;
  fs.writeFileSync("siteData.json", JSON.stringify(siteData,null,2));
  res.json({success:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
