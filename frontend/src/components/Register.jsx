import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../service/api';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
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
      const response = await registerUser(formData);
      console.log(response); // Assuming `response` contains user data or confirmation
      setUser(response.user);  // Assuming `setUser` is a prop function to update user state
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl mb-6 text-purple-700 text-center">Register</h2>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="First Name"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="block w-full p-3 mb-6 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="bg-purple-600 text-white py-3 px-6 rounded-full w-full hover:bg-purple-700 transition duration-300 ease-in-out">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
