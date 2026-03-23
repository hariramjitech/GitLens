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
        params: { sha: branch, per_page: 50 }
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

  return {
    loading,
    error,
    fetchRepos,
    fetchBranches,
    fetchCommits,
    fetchCommitDetail,
    fetchLanguages,
    fetchCollaborators,
    compareBranches,
    mergeBranches,
    createBranch,
    inviteCollaborator
  };
};
