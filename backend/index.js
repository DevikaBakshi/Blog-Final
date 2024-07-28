const express = require('express');
const cors = require('cors');
const app = express();
const { DBConnection } = require("./database/db.js");
const Post = require("./models/Post.js");
const User = require("./models/Users.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const cookieParser = require('cookie-parser');
dotenv.config();



app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


DBConnection();

// Middleware to verify token


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).send("Access denied. Token missing.");
    }
  
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified; // Ensure `verified` contains user email or identifier
      next();
    } catch (error) {
      res.status(400).send("Invalid token.");
    }
  };
  
  

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.post("/logout", (req, res) => {
  res.clearCookie('token', { httpOnly: true }); // Ensure all relevant flags are included
  res.status(200).send("Logged out successfully");
  console.log("Logged out successfully");
});
// Import necessary modules and setup

// Register a new user
app.post("/register", async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      if (!(firstname && lastname && email && password)) {
        return res.status(400).send("Please enter all required fields!");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send("User already exists");
      }
      const hashPassword = await bcrypt.hashSync(password, 10);
      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashPassword,
      });
      const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
        expiresIn: "1h"
      });
      user.token = token;
      user.password = undefined; // Do not send the password back
      res.status(201).json({
        message: "You have successfully registered!",
        success: true,
        user,
        token
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });
  
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("Please enter all required fields!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User does not exist");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1h"
    });
    res.cookie('token', token, { httpOnly: true });
    user.password = undefined; // Don't send the password back
    res.status(200).json({
      message: "Login successful!",
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Fetch all posts by logged-in user
app.get("/posts/user/:email", authenticateToken, async (req, res) => {
    try {
        console.log("Request received for email:", req.params.email); // Log the received email
        const posts = await Post.find({ authorEmail: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching posts");
    }
});

  
app.get("/posts/:postId", authenticateToken, async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      const currentUserEmail = req.user.email; // Adjust this based on how you handle user info
  
      res.status(200).json({
        message: "Post retrieved successfully",
        success: true,
        post: {
          ...post.toObject(), // Convert Mongoose document to plain object
          currentUserEmail
        }
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).send("Internal server error");
    }
  });
  
  
  
  // /backend/index.js
app.post("/posts", authenticateToken, async (req, res) => {
    try {
      const { title, content, authorName, authorEmail } = req.body;
      if (!(title && content && authorName && authorEmail)) {
        return res.status(400).send("Please enter all required fields");
      }
      const post = await Post.create({
        title,
        content,
        authorName,
        authorEmail
      });
      res.status(201).json({
        message: "Post created successfully",
        success: true,
        post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send("Internal server error");
    }
  });
  
  
  // /backend/index.js

// Import necessary modules and setup

// Update a post by ID
app.put("/posts/:postId", authenticateToken, async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
  
      if (!(title && content)) {
        return res.status(400).send("Please enter all required fields");
      }
  
      const post = await Post.findById(postId);
  
      // Check if post exists
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      // Check if the current user is the author of the post
      if (post.authorEmail !== req.user.email) {
        return res.status(403).send("Unauthorized to update this post");
      }
  
      // Update the post
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, content },
        { new: true }
      );
  
      res.status(200).json({
        message: "Post updated successfully",
        success: true,
        post: updatedPost
      });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).send("Internal server error");
    }
  });
  
  // Delete a post by ID
  app.delete("/posts/:postId", authenticateToken, async (req, res) => {
    try {
      const { postId } = req.params;
  
      const post = await Post.findById(postId);
  
      // Check if post exists
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      // Check if the current user is the author of the post
      if (post.authorEmail !== req.user.email) {
        return res.status(403).send("Unauthorized to delete this post");
      }
  
      // Delete the post
      await Post.findByIdAndDelete(postId);
  
      res.status(200).json({
        message: "Post deleted successfully",
        success: true
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send("Internal server error");
    }
  });
  
  



  // Fetch all posts except the logged-in user's posts
// Fetch all posts except the logged-in user's posts
app.get("/posts", authenticateToken, async (req, res) => {
  try {
    const currentUserEmail = req.user.email;
    const posts = await Post.find({ authorEmail: { $ne: currentUserEmail } }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching posts");
  }
});

  
// Add comment to a post
// Like a post
// Like or Unlike a post
// Like or Unlike a post
// In your Express routes file
// In your Express routes file
app.post("/posts/:postId/like", authenticateToken, async (req, res) => {
    try {
      const postId = req.params.postId;
      const currentUserEmail = req.user.email;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      const hasLiked = post.likes.includes(currentUserEmail);
  
      if (hasLiked) {
        post.likes = post.likes.filter(email => email !== currentUserEmail);
        post.likesCount--;
      } else {
        post.likes.push(currentUserEmail);
        post.likesCount++;
      }
  
      await post.save();
  
      res.status(200).json({
        message: "Post updated successfully",
        success: true,
        likesCount: post.likesCount,
        isLiked: !hasLiked // Return whether the post is now liked by the current user
      });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).send("Internal server error");
    }
  });
  
  // Add a comment to a post
  app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
    try {
      const postId = req.params.postId;
      const { content } = req.body;
      const userEmail = req.user.email; // Extract user email from the token
  
      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) return res.status(404).send('Post not found');
  
      // Add the comment to the post
      const comment = { content, authorEmail: userEmail };
      post.comments.push(comment);
      await post.save();
  
      res.json({ comment }); // Send back the new comment object
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Error adding comment');
    }
  });
  
  
  

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
