'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  rating: number;
}

const CommentSection: React.FC = () => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [showDisapproveModal, setShowDisapproveModal] = useState(false);
  const [commentToDisapprove, setCommentToDisapprove] = useState<Comment | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch('/api/comments');
      const data = await response.json();
      setComments(data);
    };

    fetchComments();
  }, []);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: session?.user?.name || 'Anonymous',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      dislikes: 0,
      rating: newRating,
    };

    setComments([...comments, comment]);
    setNewComment('');
    setNewRating(5);
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

  const handleDisapprove = (id: number) => {
    const comment = comments.find((comment) => comment.id === id);
    if (comment) {
      setCommentToDisapprove(comment);
      setShowDisapproveModal(true);
    }
  };

  const confirmDisapprove = () => {
    if (commentToDisapprove) {
      setComments(comments.filter((comment) => comment.id !== commentToDisapprove.id));
      setShowDisapproveModal(false);
      setCommentToDisapprove(null);
    }
  };

  const cancelDisapprove = () => {
    setShowDisapproveModal(false);
    setCommentToDisapprove(null);
  };

  const StarRating = ({ rating, setRating }: { rating: number; setRating?: (rating: number) => void }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating?.(star)}
            disabled={!setRating}
            className={`focus:outline-none ${
              star <= rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[475px] flex flex-col text-gray-200">
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
              <div className="flex-1">
                <div className="mb-1 font-medium">{comment.author}</div>
                <StarRating rating={comment.rating} />
                <p className="my-2 text-gray-300">{comment.content}</p>
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

                  {session?.user?.role === 'admin' && (
                    <button
                      onClick={() => handleDisapprove(comment.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Disapprove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Comment Input Section */}
      {session ? (
        <div className="border-t border-gray-800 p-4">
          <form
            onSubmit={handleSubmitComment}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Rating:</span>
              <StarRating rating={newRating} setRating={setNewRating} />
            </div>
            <div className="flex items-center gap-2">
              <textarea
                className="w-2/3 p-2 rounded-lg bg-gray-900 border border-gray-800 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 resize-none"
                rows={1}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg 
                     hover:bg-red-700 transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border-t border-gray-800 p-4 text-center text-gray-400">
          Please log in to post a comment.
        </div>
      )}

      {showDisapproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-xl font-semibold mb-4">Confirm Disapproval</h2>
            <p className="mb-4">Are you sure you want to disapprove this comment?</p>
            <p className="italic mb-4">&quot;{commentToDisapprove?.content}&quot;</p>
            <div className="mb-4 flex items-center">
              <span className="mr-2">Rating:</span>
              <StarRating rating={commentToDisapprove?.rating || 0} />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDisapprove}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisapprove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;