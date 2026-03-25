import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useGitHub = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/github/repos');
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch repositories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepoDetails = useCallback(async (owner, repo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch repository details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async (owner, repo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/branches`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch branches');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommits = useCallback(async (owner, repo, branch) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/commits`, {
        params: { sha: branch, per_page: 100 }
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch commits');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommitDetail = useCallback(async (owner, repo, sha) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/commits/${sha}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch commit details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async (owner, repo) => {
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/languages`);
      return data;
    } catch (err) {
      console.error('Failed to fetch languages', err);
      return {};
    }
  }, []);

  const fetchCollaborators = useCallback(async (owner, repo) => {
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/collaborators`);
      return data;
    } catch (err) {
      console.error('Failed to fetch collaborators', err);
      return [];
    }
  }, []);

  const compareBranches = useCallback(async (owner, repo, base, head) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/compare/${base}...${head}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compare branches');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const mergeBranches = useCallback(async (owner, repo, base, head, message) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/github/repos/${owner}/${repo}/merges`, {
        base,
        head,
        commit_message: message
      });
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Merge failed';
      setError(errorMsg);
      // Return details if it's a conflict
      if (err.response?.status === 409) {
        return { conflict: true, message: errorMsg };
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBranch = useCallback(async (owner, repo, name, sourceSha) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/github/repos/${owner}/${repo}/branches`, {
        name,
        source_sha: sourceSha
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create branch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteCollaborator = useCallback(async (owner, repo, username) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/github/repos/${owner}/${repo}/collaborators/${username}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to invite collaborator');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPullRequests = useCallback(async (owner, repo, state = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/pulls`, { params: { state } });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pull requests');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPullRequestDetails = useCallback(async (owner, repo, prNumber) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/pulls/${prNumber}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pull request details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPullRequest = useCallback(async (owner, repo, title, head, base, body) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/github/repos/${owner}/${repo}/pulls`, {
        title, head, base, body
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create pull request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitPullRequestReview = useCallback(async (owner, repo, prNumber, body, event, comments) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/github/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
        body, event, comments
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepoContents = useCallback(async (owner, repo, path = '') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/contents/${path}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch repo contents');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFileContent = useCallback(async (owner, repo, path, content, message, sha, branch) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/github/repos/${owner}/${repo}/contents/${path}`, {
        content, message, sha, branch
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update file content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommitDiff = useCallback(async (owner, repo, sha) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/github/repos/${owner}/${repo}/commits/${sha}/diff`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch commit diff');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommitExplanation = useCallback(async (diff, message) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/ai/explain-commit', { diff, message });
      return data.explanation;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch AI explanation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const suggestCommitMessages = useCallback(async (diff) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/ai/suggest-message', { diff });
      return data.suggestions;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch suggestions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchRepos,
    fetchRepoDetails,
    fetchBranches,
    fetchCommits,
    fetchCommitDetail,
    fetchLanguages,
    fetchCollaborators,
    compareBranches,
    mergeBranches,
    createBranch,
    inviteCollaborator,
    fetchPullRequests,
    fetchPullRequestDetails,
    createPullRequest,
    submitPullRequestReview,
    fetchRepoContents,
    updateFileContent,
    fetchCommitDiff,
    fetchCommitExplanation,
    suggestCommitMessages
  };
};
