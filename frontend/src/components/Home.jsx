import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserPosts } from '../service/api';

function Home({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPosts(user.email);
    }
  }, [user]);

  const fetchPosts = async (email) => {
    try {
      const data = await fetchUserPosts(email);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = () => {
    navigate('/create');
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleViewBlogs = () => {
    navigate('/view-blogs');
  };

  const handleLogout = async () => {
    try {
      await fetch('/logout', {
        credentials: 'include',
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-100">
      <nav className="bg-purple-600 p-4 text-white flex justify-between items-center shadow-lg">
        <div className="text-3xl font-bold">BlogiVerse</div>
        <div className="flex items-center">
          {user && (
            <div className="mr-4">
              <span className="text-lg">Hello, {user.firstname}</span>
              <span className="block text-gray-300 text-sm">Email: {user.email}</span>
            </div>
          )}
          <button
            onClick={handleCreatePost}
            className="bg-white text-purple-600 py-2 px-4 rounded-full mr-4 hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            Create New Post
          </button>
          <button
            onClick={handleViewBlogs}
            className="bg-white text-purple-600 py-2 px-4 rounded-full hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            See Others' Blogs
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 py-2 px-4 rounded-full ml-4 hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 flex-grow">
        <h1 className="text-4xl font-bold mb-4 text-purple-700">Welcome to BlogiVerse!</h1>
        <p className="text-lg mb-4">Here are your recent blog posts:</p>
        {posts.length > 0 ? (
          <div className="bg-white rounded shadow-md p-4">
            {posts.map((post) => (
              <div key={post._id} className="border-b mb-4 pb-2">
                <h2
                  className="text-2xl font-bold mb-2 cursor-pointer text-purple-700"
                  onClick={() => handleViewPost(post._id)}
                >
                  {post.title}
                </h2>
                <p className="text-gray-600">Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="mt-2">{post.content.substring(0, 150)}...</p>
                <button
                  className="text-purple-600 mt-2 hover:underline"
                  onClick={() => handleViewPost(post._id)}
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts to display.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
