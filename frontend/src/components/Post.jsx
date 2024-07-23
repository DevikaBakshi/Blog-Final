import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  updatePost,
  deletePost,
  addComment,
  likePost,
} from "../service/api";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [commentContent, setCommentContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        console.log(data);
        if (data && data.post) {
          const { post, currentUserEmail } = data;
          setPost(post);
          setFormData({ title: post.title || "", content: post.content || "" });

          const likes = post.likes || [];
          setIsLiked(likes.includes(currentUserEmail));
          setLikesCount(post.likesCount || 0);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    try {
      const data = await likePost(postId);
      // Update state based on server response
      setLikesCount(data.likesCount);
      setIsLiked(data.isLiked); // Update the `isLiked` state based on server response
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const commentData = { content: commentContent };
      const data = await addComment(postId, commentData);
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), data.comment],
      }));
      setCommentContent("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updatePost(postId, formData);
      setIsEditing(false);
      const updatedPost = await getPostById(postId);
      setPost(updatedPost.post);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const isCurrentUserAuthor = () => {
    return post && post.authorEmail === post.currentUserEmail;
  };

  if (!post) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-purple-100">
      <nav className="bg-purple-600 p-4 text-white flex justify-between items-center shadow-lg">
        <div
          className="text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          BlogiVerse
        </div>
        <div className="flex items-center">
          {isCurrentUserAuthor() && (
            <button
              onClick={() => navigate("/create")}
              className="bg-white text-purple-600 py-2 px-4 rounded-full mr-4 hover:bg-purple-200 transition duration-300 ease-in-out"
            >
              Create New Post
            </button>
          )}
          <button
            onClick={() => navigate("/home")}
            className="bg-white text-purple-600 py-2 px-4 rounded-full hover:bg-purple-200 transition duration-300 ease-in-out"
          >
            Home
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 bg-white mt-10 rounded-lg shadow-md">
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            ></textarea>
            <button
              onClick={handleUpdate}
              className="bg-purple-600 text-white py-2 px-4 rounded-full mr-4 hover:bg-purple-700 transition duration-300 ease-in-out"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="border-b-2 border-gray-300 pb-4 mb-4">
              <h1 className="text-4xl font-bold mb-2 text-purple-700">
                {post.title}
              </h1>
              <p className="text-gray-600">
                By {post.authorName} on{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-lg leading-relaxed mb-6">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            {isCurrentUserAuthor() && (
              <div className="mb-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-full mr-4 hover:bg-yellow-400 transition duration-300 ease-in-out"
                >
                  Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-400 transition duration-300 ease-in-out"
                >
                  Delete Post
                </button>
              </div>
            )}
            {!isCurrentUserAuthor() && !isEditing && (
              <div className="flex items-center mb-6">
                <button
                  onClick={handleLike}
                  className={`mr-4 ${
                    isLiked ? "bg-red-500" : "bg-blue-500"
                  } text-white py-2 px-4 rounded-full hover:bg-${
                    isLiked ? "red" : "blue"
                  }-700 transition duration-300 ease-in-out`}
                >
                  {isLiked ? "Unlike" : "Like"} ({likesCount})
                </button>
              </div>
            )}

            <div className="border-t-2 border-gray-300 pt-4 mt-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Comments
              </h2>
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows="4"
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                  placeholder="Add a comment..."
                ></textarea>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-400 transition duration-300 ease-in-out"
                >
                  Add Comment
                </button>
              </form>
              <ul>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <li key={index} className="mb-4 border-b pb-2">
                      <p className="font-semibold">{comment.authorEmail}</p>
                      <p>{comment.content}</p>
                    </li>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Post;
