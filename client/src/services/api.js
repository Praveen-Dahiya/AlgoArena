import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Problems API
export const getProblems = (page = 1, limit = 10) => {
  return api.get(`/problems?page=${page}&limit=${limit}`);
};

export const getProblem = (slug) => {
  return api.get(`/problems/${slug}`);
};

// Submissions API
export const runCode = (code, language, problemId, input) => {
  return api.post('/submissions/run', { code, language, problemId, input });
};

export const submitSolution = (code, language, problemId) => {
  return api.post('/submissions/submit', { code, language, problemId });
};

export const getProblemSubmissions = (problemId) => {
  return api.get(`/submissions/problem/${problemId}`);
};

export default api;