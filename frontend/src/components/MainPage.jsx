import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div className="min-h-screen flex flex-col bg-purple-100">
      
      {/* Navbar */}
      <nav className="bg-purple-600 p-4 text-white flex justify-between items-center shadow-lg">
        <div className="text-3xl font-bold">
        BlogiVerse
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/register" 
            className="bg-white text-purple-600 py-2 px-4 rounded-full hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="bg-white text-purple-600 py-2 px-4 rounded-full hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-purple-300">
        <h1 className="text-6xl font-bold mb-4 text-purple-700 text-center">
          Welcome to BlogiVerse!
        </h1>
        <p className="text-2xl text-gray-800 mb-6 text-center max-w-xl">
          Discover, Create, and Share Amazing Content with the World.
        </p>
        <div className="flex">
          <Link 
            to="/register" 
            className="bg-purple-600 text-white py-3 px-6 rounded-full text-xl hover:bg-purple-700 transition duration-300 ease-in-out"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-600 text-white text-center py-4">
        <p>&copy; 2024 BlogiVerse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainPage;


