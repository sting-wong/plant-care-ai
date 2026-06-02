"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { MOCK_POSTS } from "@/lib/data/community-posts";

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return `${Math.floor(days / 7)}周前`;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const post = MOCK_POSTS.find((p) => p.id === params.id);

  const [liked, setLiked] = useState(post?.liked || false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!post) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[#6B7B6B]">帖子不存在</p>
      </div>
    );
  }

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    if (!liked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        id: `new-${Date.now()}`,
        author: { name: "我", avatar: "😊" },
        content: commentText.trim(),
        createdAt: Date.now(),
      },
    ]);
    setCommentText("");
  };

  return (
    <main className="min-h-dvh bg-[#FAFDF7] flex flex-col">
      {/* 顶部 */}
      <header className="sticky top-0 z-10 glass border-b border-green-100/30 px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-50"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A2E1A]" />
        </button>
        <h1 className="font-medium text-[#1A2E1A]">帖子详情</h1>
      </header>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* 作者 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{post.author.avatar}</span>
          <div>
            <p className="text-sm font-medium text-[#1A2E1A]">
              {post.author.name}
            </p>
            <p className="text-xs text-[#6B7B6B]">
              养了{post.author.plantCount}棵植物 · {formatTime(post.createdAt)}
            </p>
          </div>
        </div>

        {/* 正文 */}
        <p className="text-sm text-[#1A2E1A] leading-relaxed mb-4">
          {post.content}
        </p>

        {/* 标签 */}
        <div className="flex items-center gap-2 mb-4">
          {post.plantTag && (
            <span className="px-2.5 py-1 bg-green-50 text-[#2D7D46] text-xs rounded-full">
              #{post.plantTag}
            </span>
          )}
          {post.topic && (
            <span className="px-2.5 py-1 bg-gray-100 text-[#6B7B6B] text-xs rounded-full">
              #{post.topic}
            </span>
          )}
        </div>

        {/* 互动栏 */}
        <div className="flex items-center gap-5 pb-4 mb-4 border-b border-green-100/50">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5"
          >
            <Heart
              className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-[#6B7B6B]"} ${isAnimating ? "animate-heart" : ""}`}
            />
            <span className={`text-sm ${liked ? "text-red-500" : "text-[#6B7B6B]"}`}>
              {likeCount}
            </span>
          </button>
          <span className="flex items-center gap-1.5 text-sm text-[#6B7B6B]">
            <MessageCircle className="w-5 h-5" />
            {comments.length}
          </span>
        </div>

        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              <span className="text-lg shrink-0">{comment.author.avatar}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#1A2E1A]">
                    {comment.author.name}
                  </span>
                  <span className="text-[10px] text-[#6B7B6B]">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[#1A2E1A] mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部评论输入 */}
      <form
        onSubmit={handleComment}
        className="sticky bottom-0 flex items-center gap-2 p-4 bg-white border-t border-green-100/30 safe-bottom shrink-0"
      >
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="写评论..."
          className="flex-1 bg-[#FAFDF7] border border-green-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2D7D46]/20 focus:border-[#2D7D46]/30"
        />
        <button
          type="submit"
          disabled={!commentText.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#2D7D46] text-white disabled:opacity-30 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
}
