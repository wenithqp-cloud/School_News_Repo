import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), "../frontend"))); // Serve frontend files

const DATA_FILE = path.join(path.resolve(), "../siteData.json");

// Load site data
app.get("/getSiteData", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({
    heroContent:{title:"Welcome",desc:"Delivering stories",btn:"Watch Latest Broadcast"},
    videos:[],
    teamMembers:[],
    newsItems:[],
    joinRequests:[]
  }, null, 2));
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// Save site data
app.post("/updateSiteData", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
