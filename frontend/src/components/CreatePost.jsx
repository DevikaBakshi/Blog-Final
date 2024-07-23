import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../service/api';

function CreatePost({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: user ? user.firstname : '',
    authorEmail: user ? user.email : ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createPost(formData);
      console.log('Post created:', data);
      navigate('/home');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Create Post</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          className="block w-full p-4 mb-6 border border-gray-300 rounded-lg h-72 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button type="submit" className="bg-purple-600 text-white py-3 px-6 rounded-full hover:bg-purple-700 transition duration-300 ease-in-out">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
