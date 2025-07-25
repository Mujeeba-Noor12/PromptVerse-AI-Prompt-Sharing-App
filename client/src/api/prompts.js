import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Get all prompts
export const getPrompts = async (params = {}) => {
  const response = await api.get('/prompts', { params });
  return response.data;
};

// Get single prompt
export const getPrompt = async (id) => {
  const response = await api.get(`/prompts/${id}`);
  return response.data;
};

// Create prompt
export const createPrompt = async (promptData) => {
  const response = await api.post('/prompts', promptData);
  return response.data;
};


export const getPromptById = async (id) => {
  const response = await api.get(`/prompts/${id}`);
  return response.data;
};

export const updatePrompt = async (id, promptData) => {
  const response = await api.put(`/prompts/${id}`, promptData);
  return response.data;
};


// Delete prompt
export const deletePrompt = async (id) => {
  const response = await api.delete(`/prompts/${id}`);
  return response.data;
};

// Use prompt (increment usage count)
export const usePrompt = async (id) => {
  const response = await api.post(`/prompts/${id}/use`);
  return response.data;
};

// Vote on prompt
export const votePrompt = async (id, voteType) => {
  const response = await api.post(`/prompts/${id}/vote`, { voteType });
  return response.data;
};

// Toggle bookmark on prompt
export const toggleBookmark = async (id) => {
  const response = await api.post(`/prompts/${id}/bookmark`);
  return response.data;
};

export const toggleLike = async (id) => {
  const response = await api.post(`/prompts/${id}/like`);
  return response.data;
};
export const fetchBookmarkedPrompts = async () => {
  const response = await api.get('/prompts/bookmarks/me');
  return response.data;
};

// Get comments for prompt
export const getComments = async (promptId, params = {}) => {
  const response = await api.get(`/prompts/${promptId}/comments`, { params });
  return response.data;
};

// Add comment to prompt
export const addComment = async (promptId, commentData) => {
  const response = await api.post(`/prompts/${promptId}/comments`, commentData);
  return response.data;
};

// Vote on comment
export const voteComment = async (commentId, voteType) => {
  const response = await api.post(`/comments/${commentId}/vote`, { voteType });
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await api.put(`/prompts/comments/${commentId}`, commentData);
  return response.data;
};




export const deleteComment = async (commentId) => {
  const response = await api.delete(`/prompts/comments/${commentId}`);
  return response.data;
};

// User prompts
export const getUserPrompts = async (params = {}) => {
  const response = await api.get('/users/me/prompts', { params });
  return response.data;
};

export const getLikedPrompts = async (params = {}) => {
  const response = await api.get('/users/me/liked', { params });
  return response.data;
};

// User profiles
export const getUserProfile = async (username) => {
  const response = await api.get(`/users/profile/${username}`);
  return response.data;
};

export const searchUsers = async (params = {}) => {
  const response = await api.get('/users/search', { params });
  return response.data;
};

export const getTopUsers = async (params = {}) => {
  const response = await api.get('/users/top', { params });
  return response.data;
}; 