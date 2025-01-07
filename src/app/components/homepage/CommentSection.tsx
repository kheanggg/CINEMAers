import React, { useState } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
}

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "John Doe",
      content: "This is a great post!",
      timestamp: "2 hours ago",
      likes: 5,
      dislikes: 1,
    },
    {
      id: 2,
      author: "Jane Smith",
      content: "Really interesting perspective!",
      timestamp: "1 hour ago",
      likes: 3,
      dislikes: 0,
    },
    {
      id: 3,
      author: "Mike Johnson",
      content: "I completely agree with this.",
      timestamp: "30 minutes ago",
      likes: 2,
      dislikes: 1,
    },
  ]);

  const [newComment, setNewComment] = useState<string>("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: "Current User",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      dislikes: 0,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleLike = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      )
    );
  };

  const handleDislike = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, dislikes: comment.dislikes + 1 }
          : comment
      )
    );
  };

  const handleDelete = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className="h-screen flex flex-col bg-black text-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
      </div>

      {/* Scrollable Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                {comment.author.charAt(0)}
              </div>
              <div>
                <div className="mb-1 font-medium">{comment.author}</div>
                <p className="mb-2 text-gray-300">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDislike(comment.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">{comment.dislikes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Comment Input Section */}
      <div className="border-t border-gray-800 bg-black p-4">
        <form onSubmit={handleSubmitComment}>
          <textarea
            className="w-full p-4 rounded-lg bg-gray-900 border border-gray-800 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 resize-none mb-3"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg 
                     hover:bg-red-700 transition-colors float-right"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
