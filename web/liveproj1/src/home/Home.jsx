// import React, { useState, useEffect, useRef } from "react";
// import "./Home.css";
// import Profile from "./profiles";

// import { FiUpload, FiSearch } from "react-icons/fi";
// import {
//   AiFillHome,
//   AiOutlineHeart,
//   AiFillHeart,
//   AiOutlineComment,
//   AiOutlineShareAlt,
//   AiOutlineEye,
// } from "react-icons/ai";
// import { RiUser3Line } from "react-icons/ri";
// import { MdSlowMotionVideo } from "react-icons/md";
// import { BsMessenger } from "react-icons/bs";

// const API = "http://127.0.0.1:8000/api";

// export default function Home() {
//   const [activeTab, setActiveTab] = useState("home");

//   const [posts, setPosts] = useState([]);
//   const [stories, setStories] = useState([]);
//   const [reels, setReels] = useState([]);

//   const storyInputRef = useRef(null);
//   const [activeStory, setActiveStory] = useState(null);

//   const [activeCommentPost, setActiveCommentPost] = useState(null);
//   const [commentText, setCommentText] = useState("");

//   /* ================= USER ================= */
//   const [myUsername, setMyUsername] = useState("");

//   /* ================= SEARCH ================= */
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchUsers, setSearchUsers] = useState([]);
//   const [searchPosts, setSearchPosts] = useState([]);

//   /* ================= MESSAGES ================= */
//   const socketRef = useRef(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState("");
//   const [receiver, setReceiver] = useState("");

//   const token = localStorage.getItem("token");

//   /* ================= LOGOUT (ADDED) ================= */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   /* ================= FETCH ================= */

//   const fetchPosts = async () => {
//     const res = await fetch(`${API}/posts/`);
//     const data = await res.json();
//     setPosts(data);
//   };

//   const fetchStories = async () => {
//     const res = await fetch(`${API}/stories/`);
//     const data = await res.json();
//     setStories(data);
//   };

//   const fetchReels = async () => {
//     const res = await fetch(`${API}/reels/`);
//     const data = await res.json();
//     setReels(data);
//   };

//   const fetchMessages = async () => {
//     const res = await fetch(`${API}/messages/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setMessages(data);
//   };

//   const fetchMyProfile = async () => {
//     const res = await fetch(`${API}/profile/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setMyUsername(data.username);
//   };

//   useEffect(() => {
//     fetchPosts();
//     fetchStories();
//     fetchReels();
//     fetchMyProfile();
//   }, []);

//   /* ================= SEARCH ================= */

//   const handleSearch = async (value) => {
//     setSearchQuery(value);

//     if (!value.trim()) {
//       setSearchUsers([]);
//       setSearchPosts([]);
//       return;
//     }

//     const res = await fetch(`${API}/search/?q=${value}`);
//     const data = await res.json();

//     setSearchUsers(data.users || []);
//     setSearchPosts(data.posts || []);
//   };

//   /* ================= WEBSOCKET ================= */

//   useEffect(() => {
//     if (activeTab !== "messages") return;

//     fetchMessages();
//     socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

//     socketRef.current.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setMessages((prev) => [...prev, data]);
//     };

//     return () => socketRef.current?.close();
//   }, [activeTab]);

//   const sendMessage = () => {
//     if (!messageText || !receiver) return;

//     socketRef.current.send(
//       JSON.stringify({ receiver, text: messageText })
//     );
//     setMessageText("");
//   };

//   /* ================= UPLOAD POST ================= */

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append(
//       file.type.startsWith("video") ? "video" : "image",
//       file
//     );
//     formData.append("caption", "New post ✨");

//     await fetch(`${API}/posts/create/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     fetchPosts();
//     fetchReels();
//   };

//   /* ================= STORY UPLOAD ================= */

//   const uploadStory = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     await fetch(`${API}/stories/upload/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     fetchStories();
//   };

//   /* ================= LIKE ================= */

//   const handleLike = async (id) => {
//     await fetch(`${API}/posts/${id}/like/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchPosts();
//   };

//   /* ================= COMMENT ================= */

//   const submitComment = async (id) => {
//     if (!commentText) return;

//     await fetch(`${API}/posts/${id}/comment/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ text: commentText }),
//     });

//     setCommentText("");
//     setActiveCommentPost(null);
//     fetchPosts();
//   };

//   /* ================= STORIES ================= */

//   const renderStories = () => {
//     const myStory = stories.find((s) => s.user === myUsername);
//     const otherStories = stories.filter((s) => s.user !== myUsername);

//     return (
//       <div className="stories-page">
//         <div
//           className="story-item"
//           onClick={() =>
//             myStory
//               ? setActiveStory(myStory)
//               : storyInputRef.current.click()
//           }
//         >
//           <div className="story-ring">
//             {myStory ? (
//               <img src={myStory.image} alt="" />
//             ) : (
//               <span style={{ fontSize: "30px", color: "#ff0066" }}>+</span>
//             )}
//           </div>
//           <p>Your Story</p>

//           {!myStory && (
//             <input
//               hidden
//               ref={storyInputRef}
//               type="file"
//               accept="image/*"
//               onChange={uploadStory}
//             />
//           )}
//         </div>

//         {otherStories.map((s) => (
//           <div
//             key={s.id}
//             className="story-item"
//             onClick={() => setActiveStory(s)}
//           >
//             <div className="story-ring">
//               <img src={s.image} alt="" />
//             </div>
//             <p>{s.user}</p>
//           </div>
//         ))}

//         {activeStory && (
//           <div className="story-viewer">
//             <span
//               className="story-close"
//               onClick={() => setActiveStory(null)}
//             >
//               ✕
//             </span>
//             <img src={activeStory.image} alt="" />
//             <p>{activeStory.user}</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ================= REELS ================= */

//   const renderReels = () => {
//     const videoPosts = posts.filter((p) => p.video);
//     const allReels = [...reels, ...videoPosts];

//     return (
//       <div className="home-feed">
//         {allReels.map((r) => (
//           <div key={`reel-${r.id}`} className="insta-post">
//             <div className="post-header">
//               <strong>{r.user}</strong>
//             </div>

//             <video
//               src={r.video}
//               className="post-image"
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="metadata"
//             />

//             <div className="post-actions">
//               <AiOutlineHeart />
//               <AiOutlineComment />
//               <AiOutlineShareAlt />
//             </div>

//             <div className="post-info">
//               <strong>{r.likes || 0} likes</strong>
//             </div>

//             {r.caption && (
//               <p className="post-info">
//                 <strong>{r.user}</strong> {r.caption}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /* ================= HOME ================= */

//   const renderHome = () => (
//     <div className="home-feed">
//       {posts.map((p) => (
//         <div key={p.id} className="insta-post">
//           <div className="post-header">
//             <strong>{p.user}</strong>
//           </div>

//           {p.image && <img src={p.image} className="post-image" />}
//           {p.video && (
//             <video src={p.video} className="post-image" controls />
//           )}

//           <div className="post-actions">
//             {p.liked ? (
//               <AiFillHeart color="red" onClick={() => handleLike(p.id)} />
//             ) : (
//               <AiOutlineHeart onClick={() => handleLike(p.id)} />
//             )}
//             <AiOutlineComment
//               onClick={() => setActiveCommentPost(p.id)}
//             />
//             <AiOutlineShareAlt />
//           </div>

//           <div className="post-info">
//             <strong>{p.likes} likes</strong>
//           </div>

//           <p className="post-info">
//             <strong>{p.user}</strong> {p.caption}
//           </p>

//           {activeCommentPost === p.id && (
//             <div className="comment-box">
//               <input
//                 placeholder="Add a comment..."
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//               />
//               <button onClick={() => submitComment(p.id)}>
//                 Post
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   /* ================= SWITCH ================= */

//   const renderContent = () => {
//     switch (activeTab) {
//       case "home":
//         return renderHome();
//       case "search":
//         return (
//           <div className="search-page">
//             <input
//               className="search-input"
//               placeholder="Search users or posts..."
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>
//         );
//       case "stories":
//         return renderStories();
//       case "reels":
//         return renderReels();
//       case "messages":
//         return <div />;
//       case "upload":
//         return <input type="file" onChange={handleUpload} />;
//       case "profile":
//         return <Profile />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="layout">
//       <aside className="sidebar">
//         <h1>Hfun</h1>

//         <div onClick={() => setActiveTab("home")}>
//           <AiFillHome /> Home
//         </div>
//         <div onClick={() => setActiveTab("search")}>
//           <FiSearch /> Search
//         </div>
//         <div onClick={() => setActiveTab("messages")}>
//           <BsMessenger /> Messages
//         </div>
//         <div onClick={() => setActiveTab("stories")}>
//           <AiOutlineEye /> Stories
//         </div>
//         <div onClick={() => setActiveTab("reels")}>
//           <MdSlowMotionVideo /> Reels
//         </div>
//         <div onClick={() => setActiveTab("upload")}>
//           <FiUpload /> Upload
//         </div>
//         <div onClick={() => setActiveTab("profile")}>
//           <RiUser3Line /> Profile
//         </div>

//         {/* ✅ LOGOUT ADDED */}
//         <div onClick={handleLogout} className="logout-btn">
//           Logout
//         </div>

//       </aside>

//       <main className="content">
//         <div className="top-bar">Hfun</div>
//         {renderContent()}
//       </main>
//     </div>
//   );
// }






// import React, { useState, useEffect, useRef } from "react";
// import "./Home.css";
// import Profile from "./profiles";

// import { FiUpload, FiSearch } from "react-icons/fi";
// import {
//   AiFillHome,
//   AiOutlineHeart,
//   AiFillHeart,
//   AiOutlineComment,
//   AiOutlineShareAlt,
//   AiOutlineEye,
// } from "react-icons/ai";
// import { RiUser3Line } from "react-icons/ri";
// import { MdSlowMotionVideo } from "react-icons/md";
// import { BsMessenger } from "react-icons/bs";

// const API = "http://127.0.0.1:8000/api";

// export default function Home() {
//   const [activeTab, setActiveTab] = useState("home");

//   /* ================= POSTS / STORIES / REELS ================= */
//   const [posts, setPosts] = useState([]);
//   const [stories, setStories] = useState([]);
//   const [reels, setReels] = useState([]);

//   /* ================= STORY ================= */
//   const storyInputRef = useRef(null);
//   const [activeStory, setActiveStory] = useState(null);

//   /* ================= COMMENTS ================= */
//   const [activeCommentPost, setActiveCommentPost] = useState(null);
//   const [commentText, setCommentText] = useState("");

//   /* ================= USER ================= */
//   const [myUsername, setMyUsername] = useState("");

//   /* ================= SEARCH ================= */
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchUsers, setSearchUsers] = useState([]);
//   const [searchPosts, setSearchPosts] = useState([]);

//   /* ================= MESSAGES ================= */
//   const socketRef = useRef(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState("");
//   const [receiver, setReceiver] = useState("");

//   const token = localStorage.getItem("token");

//   /* ================= LOGOUT ================= */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   /* ================= FETCH ================= */

//   const fetchPosts = async () => {
//     const res = await fetch(`${API}/posts/`);
//     const data = await res.json();
//     setPosts(data);
//   };

//   const fetchStories = async () => {
//     const res = await fetch(`${API}/stories/`);
//     const data = await res.json();
//     setStories(data);
//   };

//   const fetchReels = async () => {
//     const res = await fetch(`${API}/reels/`);
//     const data = await res.json();
//     setReels(data);
//   };

//   const fetchMessages = async () => {
//     const res = await fetch(`${API}/messages/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setMessages(data);
//   };

//   const fetchMyProfile = async () => {
//     const res = await fetch(`${API}/profile/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setMyUsername(data.username);
//   };

//   useEffect(() => {
//     fetchPosts();
//     fetchStories();
//     fetchReels();
//     fetchMyProfile();
//   }, []);

//   /* ================= SEARCH ================= */

//   const handleSearch = async (value) => {
//     setSearchQuery(value);

//     if (!value.trim()) {
//       setSearchUsers([]);
//       setSearchPosts([]);
//       return;
//     }

//     const res = await fetch(`${API}/search/?q=${value}`);
//     const data = await res.json();

//     setSearchUsers(data.users || []);
//     setSearchPosts(data.posts || []);
//   };

//   /* ================= WEBSOCKET (FIXED) ================= */

//   useEffect(() => {
//     if (activeTab !== "messages") return;

//     fetchMessages();

//     socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

//     socketRef.current.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setMessages((prev) => [...prev, data]);
//     };

//     socketRef.current.onerror = (e) => {
//       console.error("WebSocket error", e);
//     };

//     return () => socketRef.current?.close();
//   }, [activeTab]);

//   const sendMessage = () => {
//     if (!messageText.trim() || !receiver.trim()) return;
//     if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
//       alert("Socket not connected");
//       return;
//     }

//     const payload = {
//       sender: myUsername,
//       receiver: receiver,
//       text: messageText,
//     };

//     socketRef.current.send(JSON.stringify(payload));

//     // ✅ show message instantly
//     setMessages((prev) => [...prev, payload]);
//     setMessageText("");
//   };

//   /* ================= UPLOAD POST ================= */

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append(
//       file.type.startsWith("video") ? "video" : "image",
//       file
//     );
//     formData.append("caption", "New post ✨");

//     await fetch(`${API}/posts/create/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     fetchPosts();
//     fetchReels();
//   };

//   /* ================= STORY UPLOAD ================= */

//   const uploadStory = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     await fetch(`${API}/stories/upload/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     fetchStories();
//   };

//   /* ================= LIKE ================= */

//   const handleLike = async (id) => {
//     await fetch(`${API}/posts/${id}/like/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchPosts();
//   };

//   /* ================= COMMENT ================= */

//   const submitComment = async (id) => {
//     if (!commentText) return;

//     await fetch(`${API}/posts/${id}/comment/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ text: commentText }),
//     });

//     setCommentText("");
//     setActiveCommentPost(null);
//     fetchPosts();
//   };

//   /* ================= STORIES ================= */

//   const renderStories = () => {
//     const myStory = stories.find((s) => s.user === myUsername);
//     const otherStories = stories.filter((s) => s.user !== myUsername);

//     return (
//       <div className="stories-page">
//         <div
//           className="story-item"
//           onClick={() =>
//             myStory
//               ? setActiveStory(myStory)
//               : storyInputRef.current.click()
//           }
//         >
//           <div className="story-ring">
//             {myStory ? (
//               <img src={myStory.image} alt="" />
//             ) : (
//               <span style={{ fontSize: "30px", color: "#ff0066" }}>+</span>
//             )}
//           </div>
//           <p>Your Story</p>

//           {!myStory && (
//             <input
//               hidden
//               ref={storyInputRef}
//               type="file"
//               accept="image/*"
//               onChange={uploadStory}
//             />
//           )}
//         </div>

//         {otherStories.map((s) => (
//           <div
//             key={s.id}
//             className="story-item"
//             onClick={() => setActiveStory(s)}
//           >
//             <div className="story-ring">
//               <img src={s.image} alt="" />
//             </div>
//             <p>{s.user}</p>
//           </div>
//         ))}

//         {activeStory && (
//           <div className="story-viewer">
//             <span
//               className="story-close"
//               onClick={() => setActiveStory(null)}
//             >
//               ✕
//             </span>
//             <img src={activeStory.image} alt="" />
//             <p>{activeStory.user}</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* ================= REELS ================= */

//   const renderReels = () => {
//     const videoPosts = posts.filter((p) => p.video);
//     const allReels = [...reels, ...videoPosts];

//     return (
//       <div className="home-feed">
//         {allReels.map((r) => (
//           <div key={r.id} className="insta-post">
//             <div className="post-header">
//               <strong>{r.user}</strong>
//             </div>

//             <video
//               src={r.video}
//               className="post-image"
//               autoPlay
//               muted
//               loop
//             />

//             <div className="post-actions">
//               <AiOutlineHeart />
//               <AiOutlineComment />
//               <AiOutlineShareAlt />
//             </div>

//             <div className="post-info">
//               <strong>{r.likes || 0} likes</strong>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /* ================= HOME ================= */

//   const renderHome = () => (
//     <div className="home-feed">
//       {posts.map((p) => (
//         <div key={p.id} className="insta-post">
//           <div className="post-header">
//             <strong>{p.user}</strong>
//           </div>

//           {p.image && <img src={p.image} className="post-image" />}
//           {p.video && <video src={p.video} className="post-image" controls />}

//           <div className="post-actions">
//             {p.liked ? (
//               <AiFillHeart color="red" onClick={() => handleLike(p.id)} />
//             ) : (
//               <AiOutlineHeart onClick={() => handleLike(p.id)} />
//             )}
//             <AiOutlineComment
//               onClick={() => setActiveCommentPost(p.id)}
//             />
//             <AiOutlineShareAlt />
//           </div>

//           <div className="post-info">
//             <strong>{p.likes} likes</strong>
//           </div>

//           <p className="post-info">
//             <strong>{p.user}</strong> {p.caption}
//           </p>

//           {activeCommentPost === p.id && (
//             <div className="comment-box">
//               <input
//                 placeholder="Add a comment..."
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//               />
//               <button onClick={() => submitComment(p.id)}>Post</button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   /* ================= MESSAGES UI ================= */

//   const renderMessages = () => (
//     <div className="messages-page">
//       <h2>Messages</h2>

//       <div className="messages-list">
//         {messages.map((m, i) => (
//           <div key={i} className="message-item">
//             <strong>{m.sender}:</strong> {m.text}
//           </div>
//         ))}
//       </div>

//       <div className="message-input">
//         <input
//           placeholder="Receiver username"
//           value={receiver}
//           onChange={(e) => setReceiver(e.target.value)}
//         />
//         <input
//           placeholder="Type a message..."
//           value={messageText}
//           onChange={(e) => setMessageText(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );

//   /* ================= SWITCH ================= */

//   const renderContent = () => {
//     switch (activeTab) {
//       case "home":
//         return renderHome();
//       case "search":
//         return (
//           <div className="search-page">
//             <input
//               className="search-input"
//               placeholder="Search users or posts..."
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>
//         );
//       case "stories":
//         return renderStories();
//       case "reels":
//         return renderReels();
//       case "messages":
//         return renderMessages();
//       case "upload":
//         return <input type="file" onChange={handleUpload} />;
//       case "profile":
//         return <Profile />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="layout">
//       <aside className="sidebar">
//         <h1>Hfun</h1>

//         <div onClick={() => setActiveTab("home")}>
//           <AiFillHome /> Home
//         </div>
//         <div onClick={() => setActiveTab("search")}>
//           <FiSearch /> Search
//         </div>
//         <div onClick={() => setActiveTab("messages")}>
//           <BsMessenger /> Messages
//         </div>
//         <div onClick={() => setActiveTab("stories")}>
//           <AiOutlineEye /> Stories
//         </div>
//         <div onClick={() => setActiveTab("reels")}>
//           <MdSlowMotionVideo /> Reels
//         </div>
//         <div onClick={() => setActiveTab("upload")}>
//           <FiUpload /> Upload
//         </div>
//         <div onClick={() => setActiveTab("profile")}>
//           <RiUser3Line /> Profile
//         </div>

//         <div onClick={handleLogout} className="logout-btn">
//           Logout
//         </div>
//       </aside>

//       <main className="content">
//         <div className="top-bar">Hfun</div>
//         {renderContent()}
//       </main>
//     </div>
//   );
// }


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
  AiOutlineSend,
} from "react-icons/ai";
import { RiUser3Line } from "react-icons/ri";
import { MdSlowMotionVideo, MdClose } from "react-icons/md";
import { BsMessenger, BsChevronLeft, BsChevronRight } from "react-icons/bs";

const API = "http://127.0.0.1:8000/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  /* ================= POSTS / STORIES / REELS ================= */
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);

  /* ================= STORY ================= */
  const storyInputRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [seenStories, setSeenStories] = useState(new Set());

  /* ================= COMMENTS ================= */
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

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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

  /* ================= WEBSOCKET (FIXED) ================= */
  useEffect(() => {
    if (activeTab !== "messages") return;

    fetchMessages();

    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    return () => socketRef.current?.close();
  }, [activeTab]);

  const sendMessage = () => {
    if (!messageText.trim() || !receiver.trim()) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("Socket not connected");
      return;
    }

    const payload = {
      sender: myUsername,
      receiver: receiver,
      text: messageText,
    };

    socketRef.current.send(JSON.stringify(payload));

    setMessages((prev) => [...prev, payload]);
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

  /* ================= STORIES BAR (HOME) ================= */
  const renderStoriesBar = () => {
    const myStory = stories.find((s) => s.user === myUsername);
    const otherStories = stories.filter((s) => s.user !== myUsername);

    return (
      <div className="stories-bar">
        {/* Your Story */}
        <div
          className="story-item"
          onClick={() =>
            myStory
              ? handleStoryClick(myStory)
              : storyInputRef.current.click()
          }
        >
          <div className={`story-ring ${myStory ? "has-story" : "no-story"}`}>
            {myStory ? (
              <img src={myStory.image} alt="Your story" />
            ) : (
              <div className="add-story">+</div>
            )}
          </div>
          <p>Your Story</p>
        </div>

        {/* Others' Stories */}
        {otherStories.map((s) => (
          <div
            key={s.id}
            className="story-item"
            onClick={() => handleStoryClick(s)}
          >
            <div className={`story-ring ${seenStories.has(s.id) ? "seen" : "unseen"}`}>
              <img src={s.image} alt={s.user} />
            </div>
            <p>{s.user}</p>
          </div>
        ))}

        {/* Hidden file input */}
        <input
          hidden
          ref={storyInputRef}
          type="file"
          accept="image/*"
          onChange={uploadStory}
        />
      </div>
    );
  };

  /* ================= STORY CLICK HANDLER ================= */
  const handleStoryClick = (story) => {
    setActiveStory(story);
    setCurrentStoryIndex(stories.findIndex(s => s.id === story.id));
    setStoryProgress(0);
    
    if (!seenStories.has(story.id)) {
      setSeenStories(prev => new Set([...prev, story.id]));
      // Optional: Mark as seen in backend
      fetch(`${API}/stories/${story.id}/seen/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.log("Error marking story seen:", err));
    }
  };

  /* ================= STORY PROGRESS ================= */
  useEffect(() => {
    if (!activeStory) return;

    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          const nextIndex = currentStoryIndex + 1;
          if (nextIndex < stories.length) {
            setCurrentStoryIndex(nextIndex);
            setActiveStory(stories[nextIndex]);
            return 0;
          } else {
            closeStoryViewer();
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory, currentStoryIndex, stories]);

  const closeStoryViewer = () => {
    setActiveStory(null);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      const nextIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(nextIndex);
      setActiveStory(stories[nextIndex]);
      setStoryProgress(0);
    } else {
      closeStoryViewer();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevIndex);
      setActiveStory(stories[prevIndex]);
      setStoryProgress(0);
    }
  };

  /* ================= STORY VIEWER ================= */
  const renderStoryViewer = () => {
    if (!activeStory) return null;

    return (
      <div className="story-viewer-overlay">
        <div className="story-viewer">
          {/* Progress bars */}
          <div className="story-progress-container">
            {stories.map((s, idx) => (
              <div key={s.id} className="story-progress-track">
                <div 
                  className={`story-progress-bar ${idx === currentStoryIndex ? "active" : idx < currentStoryIndex ? "filled" : ""}`}
                  style={idx === currentStoryIndex ? { width: `${storyProgress}%` } : {}}
                />
              </div>
            ))}
          </div>

          {/* Close button */}
          <MdClose className="story-close" onClick={closeStoryViewer} />

          {/* Story content */}
          <div className="story-content">
            <img src={activeStory.image} alt={activeStory.user} />
          </div>

          {/* Story info */}
          <div className="story-info">
            <div className="story-user">
              <div className="story-user-pic">
                {activeStory.user_profile_pic ? (
                  <img src={activeStory.user_profile_pic} alt={activeStory.user} />
                ) : (
                  <div className="story-user-initial">{activeStory.user.charAt(0)}</div>
                )}
              </div>
              <div className="story-user-details">
                <strong>{activeStory.user}</strong>
                <span className="story-time">{activeStory.created_at}</span>
              </div>
            </div>
            <div className="story-actions">
              <input type="text" placeholder="Send message" />
              <button><AiOutlineSend /></button>
              <button><AiOutlineHeart /></button>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="story-nav-left" onClick={goToPrevStory}>
            <BsChevronLeft />
          </div>
          <div className="story-nav-right" onClick={goToNextStory}>
            <BsChevronRight />
          </div>
        </div>
      </div>
    );
  };

  /* ================= STORIES TAB ================= */
  const renderStories = () => (
    <div className="stories-tab">
      <h2>All Stories</h2>
      <div className="stories-grid">
        {stories.length === 0 ? (
          <p className="no-stories">No stories available</p>
        ) : (
          stories.map((s) => (
            <div
              key={s.id}
              className="story-card"
              onClick={() => handleStoryClick(s)}
            >
              <div className="story-card-image">
                <img src={s.image} alt={s.user} />
              </div>
              <div className="story-card-info">
                <div className="story-card-user-pic">
                  {s.user_profile_pic ? (
                    <img src={s.user_profile_pic} alt={s.user} />
                  ) : (
                    <div className="story-card-initial">{s.user.charAt(0)}</div>
                  )}
                </div>
                <div className="story-card-details">
                  <strong>{s.user}</strong>
                  <span>{s.created_at}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  /* ================= REELS ================= */
  const renderReels = () => {
    const videoPosts = posts.filter((p) => p.video);
    const allReels = [...reels, ...videoPosts];

    return (
      <div className="home-feed">
        {allReels.map((r) => (
          <div key={r.id} className="insta-post">
            <div className="post-header">
              <strong>{r.user}</strong>
            </div>

            <video
              src={r.video}
              className="post-image"
              autoPlay
              muted
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
          </div>
        ))}
      </div>
    );
  };

  /* ================= HOME ================= */
  const renderHome = () => (
    <div className="home-feed">
      {/* Stories Bar */}
      {renderStoriesBar()}

      {/* Posts */}
      {posts.map((p) => (
        <div key={p.id} className="insta-post">
          <div className="post-header">
            <strong>{p.user}</strong>
          </div>

          {p.image && <img src={p.image} className="post-image" alt="post" />}
          {p.video && <video src={p.video} className="post-image" controls />}

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
              <button onClick={() => submitComment(p.id)}>Post</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  /* ================= MESSAGES UI ================= */
  const renderMessages = () => (
    <div className="messages-page">
      <h2>Messages</h2>

      <div className="messages-list">
        {messages.map((m, i) => (
          <div key={i} className="message-item">
            <strong>{m.sender}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          placeholder="Receiver username"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <input
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );

  /* ================= SEARCH UI ================= */
  const renderSearch = () => (
    <div className="search-page">
      <input
        className="search-input"
        placeholder="Search users or posts..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {searchUsers.length > 0 && (
        <div className="search-results">
          <h3>Users</h3>
          {searchUsers.map(user => (
            <div key={user.id} className="search-user-item">
              <img src={user.profile_pic} alt={user.username} />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      )}
      
      {searchPosts.length > 0 && (
        <div className="search-results">
          <h3>Posts</h3>
          {searchPosts.map(post => (
            <div key={post.id} className="search-post-item">
              <img src={post.image} alt="post" />
              <span>{post.caption}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ================= SWITCH ================= */
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "search":
        return renderSearch();
      case "stories":
        return renderStories();
      case "reels":
        return renderReels();
      case "messages":
        return renderMessages();
      case "upload":
        return (
          <div className="upload-page">
            <h2>Upload</h2>
            <input type="file" onChange={handleUpload} />
          </div>
        );
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

        <div onClick={handleLogout} className="logout-btn">
          Logout
        </div>
      </aside>

      <main className="content">
        <div className="top-bar">Hfun</div>
        {renderContent()}
        {renderStoryViewer()}
      </main>
    </div>
  );
}