import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import Profile from "./profiles";

import { FiUpload, FiSearch } from "react-icons/fi";
import {
  AiFillHome,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineEye,
} from "react-icons/ai";
import { RiUser3Line } from "react-icons/ri";
import { MdSlowMotionVideo } from "react-icons/md";
import { BsMessenger } from "react-icons/bs";

const API = "http://127.0.0.1:8000/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);

  const storyInputRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);

  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  /* ================= USER ================= */
  const [myUsername, setMyUsername] = useState("");

  /* ================= SEARCH ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchPosts, setSearchPosts] = useState([]);

  /* ================= MESSAGES ================= */
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [receiver, setReceiver] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */

  const fetchPosts = async () => {
    const res = await fetch(`${API}/posts/`);
    const data = await res.json();
    setPosts(data);
  };

  const fetchStories = async () => {
    const res = await fetch(`${API}/stories/`);
    const data = await res.json();
    setStories(data);
  };

  const fetchReels = async () => {
    const res = await fetch(`${API}/reels/`);
    const data = await res.json();
    setReels(data);
  };

  const fetchMessages = async () => {
    const res = await fetch(`${API}/messages/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  const fetchMyProfile = async () => {
    const res = await fetch(`${API}/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyUsername(data.username);
  };

  useEffect(() => {
    fetchPosts();
    fetchStories();
    fetchReels();
    fetchMyProfile();
  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchUsers([]);
      setSearchPosts([]);
      return;
    }

    const res = await fetch(`${API}/search/?q=${value}`);
    const data = await res.json();

    setSearchUsers(data.users || []);
    setSearchPosts(data.posts || []);
  };

  /* ================= WEBSOCKET ================= */

  useEffect(() => {
    if (activeTab !== "messages") return;

    fetchMessages();
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => socketRef.current?.close();
  }, [activeTab]);

  const sendMessage = () => {
    if (!messageText || !receiver) return;

    socketRef.current.send(
      JSON.stringify({ receiver, text: messageText })
    );
    setMessageText("");
  };

  /* ================= UPLOAD POST ================= */

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(
      file.type.startsWith("video") ? "video" : "image",
      file
    );
    formData.append("caption", "New post ✨");

    await fetch(`${API}/posts/create/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    fetchPosts();
    fetchReels();
  };

  /* ================= STORY UPLOAD ================= */

  const uploadStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    await fetch(`${API}/stories/upload/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    fetchStories();
  };

  /* ================= LIKE ================= */

  const handleLike = async (id) => {
    await fetch(`${API}/posts/${id}/like/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  /* ================= COMMENT ================= */

  const submitComment = async (id) => {
    if (!commentText) return;

    await fetch(`${API}/posts/${id}/comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });

    setCommentText("");
    setActiveCommentPost(null);
    fetchPosts();
  };

  /* ================= STORIES ================= */

  const renderStories = () => {
    const myStory = stories.find((s) => s.user === myUsername);
    const otherStories = stories.filter((s) => s.user !== myUsername);

    return (
      <div className="stories-page">
        <div
          className="story-item"
          onClick={() =>
            myStory
              ? setActiveStory(myStory)
              : storyInputRef.current.click()
          }
        >
          <div className="story-ring">
             {myStory ? (
               <img src={myStory.image} alt="" />
             ) : (
               <span style={{ fontSize: "30px", color: "#ff0066" }}>+</span>
             )}
           </div>
        <p>Your Story</p>

           {!myStory && (
             <input
               hidden
               ref={storyInputRef}
               type="file"
               accept="image/*"
               onChange={uploadStory}
             />
           )}
         </div>

         {otherStories.map((s) => (
           <div
             key={s.id}
            className="story-item"
             onClick={() => setActiveStory(s)}
           >
             <div className="story-ring">
               <img src={s.image} alt="" />
             </div>
             <p>{s.user}</p>
           </div>
        ))}

         {activeStory && (
           <div className="story-viewer">
             <span
               className="story-close"
               onClick={() => setActiveStory(null)}
             >
               ✕
            </span>
            <img src={activeStory.image} alt="" />
            <p>{activeStory.user}</p>
          </div>
        )}
      </div>
    );
       };



  /* ================= REELS (RESTORED) ================= */

  const renderReels = () => {
    const videoPosts = posts.filter((p) => p.video);
    const allReels = [...reels, ...videoPosts];

    return (
      <div className="home-feed">
        {allReels.map((r) => (
          <div key={`reel-${r.id}`} className="insta-post">
            <div className="post-header">
              <strong>{r.user}</strong>
            </div>

            <video
              src={r.video}
              className="post-image"
              controls
              loop
            />

            <div className="post-actions">
              <AiOutlineHeart />
              <AiOutlineComment />
              <AiOutlineShareAlt />
            </div>

            <div className="post-info">
              <strong>{r.likes || 0} likes</strong>
            </div>

            {r.caption && (
              <p className="post-info">
                <strong>{r.user}</strong> {r.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  /* ================= HOME ================= */

  const renderHome = () => (
    <div className="home-feed">
      {posts.map((p) => (
        <div key={p.id} className="insta-post">
          <div className="post-header">
            <strong>{p.user}</strong>
          </div>

          {p.image && <img src={p.image} className="post-image" />}
          {p.video && (
            <video src={p.video} className="post-image" controls />
          )}

          <div className="post-actions">
            {p.liked ? (
              <AiFillHeart color="red" onClick={() => handleLike(p.id)} />
            ) : (
              <AiOutlineHeart onClick={() => handleLike(p.id)} />
            )}
            <AiOutlineComment
              onClick={() => setActiveCommentPost(p.id)}
            />
            <AiOutlineShareAlt />
          </div>

          <div className="post-info">
            <strong>{p.likes} likes</strong>
          </div>

          <p className="post-info">
            <strong>{p.user}</strong> {p.caption}
          </p>

          {activeCommentPost === p.id && (
            <div className="comment-box">
              <input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={() => submitComment(p.id)}>
                Post
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  /* ================= SWITCH ================= */

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "search":
        return (
          <div className="search-page">
            <input
              className="search-input"
              placeholder="Search users or posts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        );
      case "stories":
        return renderStories();
      case "reels":
        return renderReels();
      case "messages":
        return <div />;
      case "upload":
        return <input type="file" onChange={handleUpload} />;
      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Hfun</h1>
        <div onClick={() => setActiveTab("home")}>
          <AiFillHome /> Home
        </div>
        <div onClick={() => setActiveTab("search")}>
          <FiSearch /> Search
        </div>
        <div onClick={() => setActiveTab("messages")}>
          <BsMessenger /> Messages
        </div>
        <div onClick={() => setActiveTab("stories")}>
          <AiOutlineEye /> Stories
        </div>
        <div onClick={() => setActiveTab("reels")}>
          <MdSlowMotionVideo /> Reels
        </div>
        <div onClick={() => setActiveTab("upload")}>
          <FiUpload /> Upload
        </div>
        <div onClick={() => setActiveTab("profile")}>
          <RiUser3Line /> Profile
        </div>
      </aside>

      <main className="content">
        <div className="top-bar">Hfun</div>
        {renderContent()}
      </main>
    </div>
  );
}
