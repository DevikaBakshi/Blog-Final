import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Ensure cookies are included in all requests
});

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await API.post('/login', userData);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await API.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const fetchUserPosts = async (email) => {
  try {
    const response = await API.get(`/posts/user/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const fetchAllPosts = async () => {
  try {
    const response = await API.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await API.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await API.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await API.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const response = await API.post(`/posts/${postId}/comments`, commentData);
    return response.data; // Adjust based on what your backend returns
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};


// In your service/api.js or similar file
export const likePost = async (postId) => {
  try {
    const response = await API.post(`/posts/${postId}/like`);
    return response.data; // Should contain likesCount
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};
