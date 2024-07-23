import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAllPosts } from '../service/api';

function ViewBlogs() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await fetchAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Handle errors (e.g., show a notification or redirect)
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Navbar */}
      <nav className="bg-purple-600 p-4 text-white flex justify-between items-center shadow-lg">
        <div className="text-3xl font-bold">
          <Link
            to="/home"
            className="text-white hover:bg-purple-700 rounded px-4 py-2 transition duration-300 ease-in-out"
          >
            BlogiVerse
          </Link>
        </div>
        <div className="flex items-center">
          <Link
            to="/create"
            className="bg-white text-purple-600 py-2 px-4 rounded-full mr-4 hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            Create New Post
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6 text-purple-800">Explore Blogs</h1>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {/* Display all posts */}
        {filteredPosts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="border-b mb-6 pb-4">
                <h2
                  className="text-2xl font-bold mb-2 cursor-pointer hover:text-purple-600"
                  onClick={() => handleViewPost(post._id)}
                >
                  <Link
                    to={`/posts/${post._id}`}
                    className="hover:text-purple-600"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-2">
                  By {post.authorName} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-700">{post.content.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No posts to display.</p>
        )}
      </div>
    </div>
  );
}

export default ViewBlogs;
