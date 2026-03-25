import express from "express";
import axios from "axios";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Shared GitHub API base URL
const GITHUB_API = "https://api.github.com";

// Helper: create Axios config with auth headers
const githubHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/github/user — authenticated user profile
router.get("/user", async (req, res) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/user`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch user",
    });
  }
});

// GET /api/github/repos — list authenticated user's repos
router.get("/repos", async (req, res) => {
  const { sort = "updated", per_page = 30, page = 1 } = req.query;
  try {
    const response = await axios.get(`${GITHUB_API}/user/repos`, {
      ...githubHeaders(req.token),
      params: { sort, per_page, page, affiliation: "owner,collaborator" },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch repos",
    });
  }
});

// GET /api/github/repos/:owner/:repo/commits — list commits
router.get("/repos/:owner/:repo/commits", async (req, res) => {
  const { owner, repo } = req.params;
  const { sha, per_page = 30, page = 1 } = req.query;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/commits`,
      {
        ...githubHeaders(req.token),
        params: { sha, per_page, page },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch commits",
    });
  }
});

// GET /api/github/repos/:owner/:repo/commits/:sha — single commit detail + files
router.get("/repos/:owner/:repo/commits/:sha", async (req, res) => {
  const { owner, repo, sha } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/commits/${sha}`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch commit detail",
    });
  }
});

// GET /api/github/repos/:owner/:repo/branches — list branches
router.get("/repos/:owner/:repo/branches", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/branches`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch branches",
    });
  }
});

// GET /api/github/repos/:owner/:repo/languages — fetch language stats
router.get("/repos/:owner/:repo/languages", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/languages`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch languages",
    });
  }
});

// GET /api/github/repos/:owner/:repo/collaborators — fetch collaborators
router.get("/repos/:owner/:repo/collaborators", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/collaborators`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch collaborators",
    });
  }
});

// GET /api/github/repos/:owner/:repo/compare/:basehead — compare two branches/commits
router.get("/repos/:owner/:repo/compare/:basehead", async (req, res) => {
  const { owner, repo, basehead } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/compare/${basehead}`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to compare branches",
    });
  }
});

// POST /api/github/repos/:owner/:repo/merges — merge a branch
router.post("/repos/:owner/:repo/merges", async (req, res) => {
  const { owner, repo } = req.params;
  const { base, head, commit_message } = req.body;
  try {
    const response = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/merges`,
      { base, head, commit_message },
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Merge failed",
      conflicts: error.response?.status === 409
    });
  }
});

// POST /api/github/repos/:owner/:repo/branches — create a new branch
router.post("/repos/:owner/:repo/branches", async (req, res) => {
  const { owner, repo } = req.params;
  const { name, source_sha } = req.body;
  try {
    const response = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/git/refs`,
      {
        ref: `refs/heads/${name}`,
        sha: source_sha
      },
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to create branch",
    });
  }
});

// PUT /api/github/repos/:owner/:repo/collaborators/:username — add/invite collaborator
router.put("/repos/:owner/:repo/collaborators/:username", async (req, res) => {
  const { owner, repo, username } = req.params;
  try {
    const response = await axios.put(
      `${GITHUB_API}/repos/${owner}/${repo}/collaborators/${username}`,
      {},
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to add collaborator",
    });
  }
});

// GET /api/github/repos/:owner/:repo/pulls — list pull requests
router.get("/repos/:owner/:repo/pulls", async (req, res) => {
  const { owner, repo } = req.params;
  const { state = "all", sort = "updated", direction = "desc" } = req.query;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/pulls`,
      {
        ...githubHeaders(req.token),
        params: { state, sort, direction },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch pull requests",
    });
  }
});

// GET /api/github/repos/:owner/:repo/pulls/:pull_number — get PR details
router.get("/repos/:owner/:repo/pulls/:pull_number", async (req, res) => {
  const { owner, repo, pull_number } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/pulls/${pull_number}`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch pull request",
    });
  }
});

// POST /api/github/repos/:owner/:repo/pulls — create PR
router.post("/repos/:owner/:repo/pulls", async (req, res) => {
  const { owner, repo } = req.params;
  const { title, head, base, body } = req.body;
  try {
    const response = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/pulls`,
      { title, head, base, body },
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to create pull request",
    });
  }
});

// POST /api/github/repos/:owner/:repo/pulls/:pull_number/reviews — submit PR review
router.post("/repos/:owner/:repo/pulls/:pull_number/reviews", async (req, res) => {
  const { owner, repo, pull_number } = req.params;
  const { body, event, comments } = req.body;
  try {
    const response = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/pulls/${pull_number}/reviews`,
      { body, event, comments },
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to submit review",
    });
  }
});

// GET /api/github/repos/:owner/:repo/contents/:path — get file or folder contents
// Using * to capture the rest of the path
router.get("/repos/:owner/:repo/contents/*", async (req, res) => {
  const { owner, repo } = req.params;
  const path = req.params[0] || ""; // The * capture group
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch repository contents",
    });
  }
});

// PUT /api/github/repos/:owner/:repo/contents/* — create or update file content
router.put("/repos/:owner/:repo/contents/*", async (req, res) => {
  const { owner, repo } = req.params;
  const path = req.params[0] || "";
  const { content, message, sha, branch } = req.body;
  try {
    const response = await axios.put(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
      { content, message, sha, branch },
      githubHeaders(req.token)
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to update file contents",
    });
  }
});

// GET /api/github/repos/:owner/:repo/commits/:sha/diff — get raw commit diff
router.get("/repos/:owner/:repo/commits/:sha/diff", async (req, res) => {
  const { owner, repo, sha } = req.params;
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/commits/${sha}`,
      {
        ...githubHeaders(req.token),
        headers: {
          ...githubHeaders(req.token).headers,
          Accept: "application/vnd.github.v3.diff",
        },
      }
    );
    res.send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to fetch commit diff",
    });
  }
});

export default router;
