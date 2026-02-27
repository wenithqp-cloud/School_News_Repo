// server.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // If using Node 18+ you can skip installing

const app = express();
app.use(bodyParser.json());

const GITHUB_USERNAME = "wenithqp-cloud";
const REPO = "School_News_Repo";
const TOKEN = "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";

const FILE_PATH = "siteData.json";
const BRANCH = "main";

async function getSHA() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `token ${TOKEN}` }
  });
  const data = await res.json();
  return data.sha;
}

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

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
