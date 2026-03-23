import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Route 1: Redirect user to GitHub OAuth page
router.get("/github", (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = "http://localhost:5000/auth/github/callback";
  const scope = "read:user repo";

  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${encodeURIComponent(scope)}`
  );
});

// Route 2: GitHub OAuth callback — exchange code for token
router.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const { access_token, error: ghError } = response.data;

    if (ghError || !access_token) {
      console.error("GitHub OAuth error:", ghError);
      return res.redirect(
        `http://localhost:5173/?error=oauth_failed`
      );
    }

    // Redirect to frontend dashboard with token in query param
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${access_token}`
    );
  } catch (error) {
    console.error("Callback error:", error.message);
    res.redirect(`${process.env.FRONTEND_URL}/?error=server_error`);
  }
});

export default router;
