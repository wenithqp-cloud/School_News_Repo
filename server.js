import express from "express";
import fetch from "node-fetch"; // npm i node-fetch

const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GH_TOKEN; // store secret in server env
const REPO = "wenithqp-cloud/School_News_Repo";

app.post("/updateSiteData", async (req, res) => {
  const siteData = req.body;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/updateSiteData.yml/dispatches`,
      {
        method: "POST",
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github+json"
        },
        body: JSON.stringify({
          ref: "main", // branch to update
          inputs: { newData: JSON.stringify(siteData) }
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ success: false, error: text });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
