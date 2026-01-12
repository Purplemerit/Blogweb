'use client';

/**
 * Comment Thread Component
 * Display and manage comment threads on articles
 */

import { useState } from 'react';
import { MessageSquare, CheckCircle, Trash2, Reply } from 'lucide-react';

interface Comment {
  id: string;
  userId?: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface CommentThreadProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onResolveComment: (commentId: string, resolved: boolean) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export default function CommentThread({
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment,
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await onAddComment(newComment);
    setNewComment('');
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    await onAddComment(replyContent, parentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  return (
    <div className="space-y-4">
      {/* Add new comment */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-neutral-900"
          placeholder="Add a comment..."
          rows={3}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
        >
          <MessageSquare className="inline h-4 w-4 mr-2" />
          Add Comment
        </button>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`bg-white p-4 rounded-lg border ${
              comment.resolved ? 'border-emerald-200 bg-emerald-50' : 'border-neutral-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[13px] text-neutral-900 whitespace-pre-wrap">{comment.content}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-500">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  {comment.resolved && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded"
                  title="Reply"
                >
                  <Reply className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onResolveComment(comment.id, !comment.resolved)}
                  className="p-1.5 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                  title={comment.resolved ? 'Unresolve' : 'Resolve'}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-3 pl-4 border-l-2 border-neutral-200">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-neutral-900"
                  placeholder="Write a reply..."
                  rows={2}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="px-3 py-1.5 text-[12px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1.5 text-[12px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-neutral-200 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-neutral-50 p-3 rounded">
                    <p className="text-[13px] text-neutral-900">{reply.content}</p>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-neutral-500 text-[13px]">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}
