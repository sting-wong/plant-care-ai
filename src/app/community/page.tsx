"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Heart, MessageCircle } from "lucide-react";
import { MOCK_POSTS, TOPICS, type CommunityPost } from "@/lib/data/community-posts";
import { PostImage } from "@/components/post-image";

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

function PostCard({ post }: { post: CommunityPost }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    if (!liked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  return (
    <Link
      href={`/community/${post.id}`}
      className="block card-natural p-4 press-effect"
    >
      {/* 作者信息 */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-2xl">{post.author.avatar}</span>
        <div>
          <p className="text-sm font-medium text-[#1A2E1A]">
            {post.author.name}
          </p>
          <p className="text-[10px] text-[#6B7B6B]">
            养了{post.author.plantCount}棵植物 · {formatTime(post.createdAt)}
          </p>
        </div>
      </div>

      {/* 内容 */}
      <p className="text-sm text-[#1A2E1A] leading-relaxed mb-3">
        {post.content.length > 100
          ? post.content.slice(0, 100) + "..."
          : post.content}
      </p>

      {/* 配图 */}
      {post.plantTag && (
        <div className="mb-3">
          <PostImage plantTag={post.plantTag} seed={parseInt(post.id.replace(/\D/g, ""))} />
        </div>
      )}

      {/* 标签 */}
      <div className="flex items-center gap-2 mb-3">
        {post.plantTag && (
          <span className="px-2 py-0.5 bg-green-50 text-[#2D7D46] text-[10px] rounded-full">
            #{post.plantTag}
          </span>
        )}
        {post.topic && (
          <span className="px-2 py-0.5 bg-gray-50 text-[#6B7B6B] text-[10px] rounded-full">
            #{post.topic}
          </span>
        )}
      </div>

      {/* 互动 */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          className="flex items-center gap-1 text-xs"
        >
          <Heart
            className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-[#6B7B6B]"} ${isAnimating ? "animate-heart" : ""}`}
          />
          <span className={liked ? "text-red-500" : "text-[#6B7B6B]"}>
            {likeCount}
          </span>
        </button>
        <span className="flex items-center gap-1 text-xs text-[#6B7B6B]">
          <MessageCircle className="w-4 h-4" />
          {post.comments.length}
        </span>
      </div>
    </Link>
  );
}

export default function CommunityPage() {
  const [activeTopic, setActiveTopic] = useState("推荐");

  const filteredPosts =
    activeTopic === "推荐"
      ? MOCK_POSTS
      : MOCK_POSTS.filter((p) => p.topic === activeTopic);

  return (
    <main className="min-h-dvh px-5 pt-6 pb-4 page-slide-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#1A2E1A]">植友圈</h1>
        <Link
          href="/community/post"
          className="flex items-center gap-1 px-3 py-1.5 bg-[#2D7D46] text-white rounded-lg text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          发布
        </Link>
      </div>

      {/* Topic tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar -mx-5 px-5">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTopic === topic
                ? "bg-[#2D7D46] text-white"
                : "bg-white text-[#6B7B6B] border border-green-100"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* 帖子列表 */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <div key={post.id} className="stagger-item">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-[#6B7B6B]">这个话题还没有帖子</p>
        </div>
      )}
    </main>
  );
}
