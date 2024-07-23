// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/Login';
import Register from './components/Register'; // If needed
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import ViewBlogs from './components/ViewBlogs';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


function App() {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login setUser={handleLogin} />} />
          <Route path="/register" element={<Register setUser={setUser} />} /> {/* If you have a registration route */}

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute element={<Home user={user} authToken={authToken} />} user={user} />} />
          <Route path="/create" element={<ProtectedRoute element={<CreatePost user={user} authToken={authToken} />} user={user} />} />

          {/* Public Routes */}
          <Route path="/posts/:postId" element={<Post />} />
          <Route path="/view-blogs" element={<ViewBlogs authToken={authToken} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
