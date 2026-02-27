// server.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// Use environment variables for security
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const REPO = process.env.REPO;
const TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "siteData.json";
const BRANCH = "main";

// Get the current SHA of the file
async function getSHA() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${TOKEN}` }
  });
  const data = await res.json();
  return data.sha;
}

// Update siteData.json on GitHub
app.post("/updateSiteData", async (req, res) => {
  try {
    const sha = await getSHA();
    const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString("base64");

    const updateRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: { Authorization: `token ${TOKEN}` },
      body: JSON.stringify({
        message: "Update site data via admin panel",
        content,
        sha,
        branch: BRANCH
      })
    });

    const result = await updateRes.json();
    if (updateRes.ok) res.json({ success: true, result });
    else res.status(400).json({ success: false, error: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
