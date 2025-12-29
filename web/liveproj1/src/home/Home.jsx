import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

// Icons
import {
  AiFillHome,
  AiOutlineHome,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineMessage,
  AiFillMessage,
  AiOutlineCompass,
  AiFillCompass,
  AiOutlinePlusSquare,
  AiOutlineVideoCamera,
  AiOutlineSearch,
  AiOutlineSend
} from "react-icons/ai";
import { 
  BsInstagram, 
  BsMessenger, 
  BsBookmark, 
  BsBookmarkFill,
  BsThreeDots,
  BsChevronLeft,
  BsChevronRight
} from "react-icons/bs";
import { 
  FaRegComment, 
  FaRegHeart, 
  FaHeart,
  FaFacebookMessenger
} from "react-icons/fa";
import { 
  MdOutlineExplore,
  MdSlowMotionVideo,
  MdAddCircleOutline,
  MdClose,
  MdGridOn,
  MdPlayCircleOutline,
  MdAccountBox
} from "react-icons/md";
import { RiUser3Line, RiUserFill } from "react-icons/ri";
import { FiSend, FiSearch, FiMoreHorizontal } from "react-icons/fi";
import { BiMoviePlay, BiUserPlus } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";

const API = "http://127.0.0.1:8000/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [currentUser, setCurrentUser] = useState({
    username: "instagram",
    fullName: "Instagram",
    profilePic: "",
    isVerified: true,
    bio: "Bringing you closer to the people and things you love. 💬",
    website: "help.instagram.com"
  });

  // Data states
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [reels, setReels] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userStats, setUserStats] = useState({
    posts: 6623,
    followers: "383M",
    following: 48
  });
  
  // UI states
  const [activeStory, setActiveStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileTab, setProfileTab] = useState("posts");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const token = localStorage.getItem("token");
  const postInputRef = useRef(null);
  const storyInputRef = useRef(null);
  const searchRef = useRef(null);

  /* ================= FETCH DATA FROM BACKEND ================= */
  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchPosts();
      fetchStories();
      fetchReels();
      fetchSuggestions();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(prev => ({
          ...prev,
          username: data.username || "user",
          fullName: data.full_name || data.username || "User",
          profilePic: data.profile_pic || "",
          isVerified: data.is_verified || false,
          bio: data.bio || prev.bio,
          website: data.website || prev.website
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API}/posts/`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.map(post => ({
          id: post.id,
          user: post.user || post.username || "Unknown",
          profilePic: post.user_profile_pic || "",
          image: post.image || "",
          video: post.video || "",
          caption: post.caption || "",
          likes: post.likes_count || post.likes || 0,
          comments: post.comments_count || 0,
          time: post.created_at ? formatTimeAgo(post.created_at) : "Just now",
          location: post.location || "",
          isLiked: post.is_liked || false,
          isSaved: post.is_saved || false
        })));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch(`${API}/stories/`);
      if (response.ok) {
        const data = await response.json();
        setStories(data.map(story => ({
          id: story.id,
          user: story.user || story.username || "Unknown",
          image: story.image || story.media_url || "",
          user_profile_pic: story.user_profile_pic || "",
          created_at: story.created_at ? formatTimeAgo(story.created_at) : "Just now",
          hasSeen: story.seen_by_current_user || false
        })));
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const fetchReels = async () => {
    try {
      const response = await fetch(`${API}/reels/`);
      if (response.ok) {
        const data = await response.json();
        setReels(data.map(reel => ({
          id: reel.id,
          user: reel.user || reel.username || "Unknown",
          video: reel.video || reel.media_url || "",
          caption: reel.caption || "",
          likes: reel.likes_count || reel.likes || 0,
          comments: reel.comments_count || 0
        })));
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API}/suggestions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        // Fallback mock data
        setSuggestions([
          {
            id: 1,
            username: "chambigoth",
            name: "Cham Bigoth",
            profilePic: "",
            description: "Followed by rabbit__saman",
            isFollowed: false
          },
          {
            id: 2,
            username: "McEight",
            name: "Mc Eight",
            profilePic: "",
            description: "Suggested for you",
            isFollowed: false
          },
          {
            id: 3,
            username: "Vyahnavi_Hanha",
            name: "Vyahnavi",
            profilePic: "",
            description: "Suggested for you",
            isFollowed: false
          },
          {
            id: 4,
            username: "partyArchitects",
            name: "Party Architects",
            profilePic: "",
            description: "Followed by beautiful_mercy",
            isFollowed: false
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API}/messages/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  /* ================= UTILITY FUNCTIONS ================= */
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  /* ================= HANDLERS ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${API}/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const newLiked = !post.isLiked;
            return {
              ...post,
              isLiked: newLiked,
              likes: newLiked ? post.likes + 1 : post.likes - 1
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async (postId) => {
    try {
      const response = await fetch(`${API}/posts/${postId}/save/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, isSaved: !post.isSaved }
            : post
        ));
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await fetch(`${API}/users/${userId}/follow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuggestions(suggestions.map(user => 
          user.id === userId 
            ? { ...user, isFollowed: !user.isFollowed }
            : user
        ));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleStoryClick = (story) => {
    setActiveStory(story);
    setStoryProgress(0);
    
    if (!story.hasSeen) {
      fetch(`${API}/stories/${story.id}/view/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(err => console.error("Error marking story as seen:", err));
    }
  };

  const closeStory = () => {
    setActiveStory(null);
    setStoryProgress(0);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    if (file.type.startsWith('video')) {
      formData.append('video', file);
      formData.append('caption', 'New reel 🎥');
    } else {
      formData.append('image', file);
      formData.append('caption', 'New post 📸');
    }

    try {
      const response = await fetch(`${API}/posts/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        fetchPosts();
        if (file.type.startsWith('video')) {
          fetchReels();
        }
        alert('Post uploaded successfully!');
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert('Error uploading post');
    }
  };

  const uploadStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API}/stories/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        fetchStories();
        alert('Story uploaded successfully!');
      }
    } catch (error) {
      console.error("Error uploading story:", error);
      alert('Error uploading story');
    }
  };

  const submitComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`${API}/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText })
      });

      if (response.ok) {
        setCommentText("");
        setActiveCommentPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) return;

    try {
      const response = await fetch(`${API}/search/?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Search results:", data);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  /* ================= COMPONENTS ================= */

  const StoryItem = ({ story, isUserStory = false }) => (
    <div className="story-item" onClick={() => !isUserStory && handleStoryClick(story)}>
      <div className={`story-ring ${story.hasSeen ? 'seen' : 'unseen'} ${isUserStory ? 'user-story' : ''}`}>
        <div className="story-avatar">
          {story.user_profile_pic ? (
            <img src={story.user_profile_pic} alt={story.user} />
          ) : (
            <div className="avatar-initial">{story.user.charAt(0)}</div>
          )}
          {isUserStory && <div className="add-story">+</div>}
        </div>
      </div>
      <span className="story-username">
        {isUserStory ? "Your Story" : story.user}
      </span>
    </div>
  );

  const SuggestionItem = ({ user }) => (
    <div className="suggestion-item">
      <div className="suggestion-user">
        <div className="suggestion-avatar">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.username} />
          ) : (
            <div className="avatar-initial-small">{user.username.charAt(0)}</div>
          )}
        </div>
        <div className="suggestion-info">
          <strong>{user.username}</strong>
          <span>{user.description}</span>
        </div>
      </div>
      <button 
        className={`follow-btn ${user.isFollowed ? 'following' : ''}`}
        onClick={() => handleFollow(user.id)}
      >
        {user.isFollowed ? 'Following' : 'Follow'}
      </button>
    </div>
  );

  const Post = ({ post }) => (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar">
            {post.profilePic ? (
              <img src={post.profilePic} alt={post.user} />
            ) : (
              <div className="avatar-initial">{post.user.charAt(0)}</div>
            )}
          </div>
          <div className="post-user-info">
            <div className="post-username">
              <strong>{post.user}</strong>
              {post.user === "instagram" && <span className="verified-badge">✓</span>}
            </div>
            {post.location && <span className="post-location">{post.location}</span>}
          </div>
        </div>
        <FiMoreHorizontal className="more-btn" />
      </div>

      <div className="post-media-container">
        {post.image && (
          <img src={post.image} alt={post.caption} className="post-media" />
        )}
        {post.video && (
          <video src={post.video} controls className="post-media" />
        )}
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button onClick={() => handleLike(post.id)}>
            {post.isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
          </button>
          <button onClick={() => setActiveCommentPost(post.id === activeCommentPost ? null : post.id)}>
            <FaRegComment />
          </button>
          <button><FiSend /></button>
        </div>
        <div className="post-actions-right">
          <button onClick={() => handleSave(post.id)}>
            {post.isSaved ? <BsBookmarkFill /> : <BsBookmark />}
          </button>
        </div>
      </div>

      <div className="post-info">
        <strong>{post.likes.toLocaleString()} likes</strong>
        <div className="post-caption">
          <strong>{post.user}</strong> {post.caption}
        </div>
        {post.comments > 0 && (
          <div className="view-comments">View all {post.comments} comments</div>
        )}
        <div className="post-time">{post.time}</div>
      </div>

      {activeCommentPost === post.id && (
        <div className="comment-input-container">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && submitComment(post.id)}
          />
          <button 
            className={`post-comment-btn ${commentText ? 'active' : ''}`}
            onClick={() => submitComment(post.id)}
            disabled={!commentText}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );

  /* ================= MAIN VIEWS ================= */

  const renderHome = () => (
    <div className="home-container">
      <div className="main-feed">
        {/* Stories */}
        {stories.length > 0 && (
          <div className="stories-container">
            <div className="stories-scroll">
              <div 
                className="story-item" 
                onClick={() => storyInputRef.current?.click()}
              >
                <div className="story-ring user-story">
                  <div className="story-avatar">
                    {currentUser.profilePic ? (
                      <img src={currentUser.profilePic} alt="You" />
                    ) : (
                      <div className="avatar-initial">{currentUser.username.charAt(0)}</div>
                    )}
                    <div className="add-story">+</div>
                  </div>
                </div>
                <span className="story-username">Your Story</span>
              </div>
              
              {stories.map(story => (
                <StoryItem key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="posts-container">
          {isLoading ? (
            <div className="loading">Loading posts...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <Post key={post.id} post={post} />
            ))
          ) : (
            <div className="no-posts">
              <p>No posts yet. Follow people to see their posts!</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Desktop only */}
      <div className="home-sidebar">
        <div className="sidebar-user">
          <div className="user-avatar">
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic} alt={currentUser.username} />
            ) : (
              <div className="avatar-initial">{currentUser.username.charAt(0)}</div>
            )}
          </div>
          <div className="user-info">
            <strong>{currentUser.username}</strong>
            <span>{currentUser.fullName}</span>
          </div>
          <button className="switch-btn">Switch</button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <div className="suggestions-header">
              <span>Suggestions For You</span>
              <button className="see-all">See All</button>
            </div>
            <div className="suggestions-list">
              {suggestions.map(user => (
                <SuggestionItem key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="footer-links">
            <a href="#">About</a> • <a href="#">Help</a> • <a href="#">Press</a> • <a href="#">API</a> • <a href="#">Jobs</a> • 
            <a href="#">Privacy</a> • <a href="#">Terms</a> • <a href="#">Locations</a> • <a href="#">Language</a>
          </div>
          <div className="copyright">
            © 2025 HFUN FROM META
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <AiOutlineSearch />
          <input
            placeholder="Search users or posts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>
        {searchQuery && (
          <div className="search-results">
            <p>Search results for: {searchQuery}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-sidebar">
          <div className="messages-header">
            <h2>{currentUser.username}</h2>
            <div className="messages-actions">
              <MdSlowMotionVideo />
            </div>
          </div>
          <div className="messages-list">
            {messages.length > 0 ? (
              messages.map(msg => (
                <div key={msg.id} className="message-preview">
                  <div className="message-avatar">
                    <div className="avatar-initial">{msg.sender?.charAt(0) || "U"}</div>
                  </div>
                  <div className="message-info">
                    <div className="message-user">
                      <strong>{msg.sender}</strong>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    <span className="message-text">{msg.text || msg.lastMessage}</span>
                  </div>
                  {msg.unread && <div className="unread-dot"></div>}
                </div>
              ))
            ) : (
              <div className="no-messages">
                <p>No messages yet</p>
              </div>
            )}
          </div>
        </div>
        <div className="chat-area">
          <div className="chat-welcome">
            <h3>Your Messages</h3>
            <p>Send private messages to friends</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReels = () => (
    <div className="reels-page">
      <div className="reels-container">
        {reels.length > 0 ? (
          reels.map(reel => (
            <div key={reel.id} className="reel">
              <video src={reel.video} autoPlay muted loop />
              <div className="reel-overlay">
                <div className="reel-user">
                  <div className="reel-avatar">
                    <div className="avatar-initial">{reel.user.charAt(0)}</div>
                  </div>
                  <strong>{reel.user}</strong>
                  <button className="follow-btn">Follow</button>
                </div>
                <div className="reel-caption">{reel.caption}</div>
                <div className="reel-actions">
                  <button><AiOutlineHeart /></button>
                  <button><FaRegComment /></button>
                  <button><FiSend /></button>
                  <button><BsBookmark /></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reels">
            <p>No reels yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic} alt={currentUser.username} />
            ) : (
              <div className="avatar-initial-large">{currentUser.username.charAt(0)}</div>
            )}
          </div>
        </div>
        
        <div className="profile-info-section">
          <div className="profile-top-row">
            <h1 className="profile-username">{currentUser.username}</h1>
            {currentUser.isVerified && <span className="verified-badge large">✓</span>}
            <div className="profile-actions">
              <button className="edit-profile">Edit Profile</button>
              <button className="view-archive">View Archive</button>
              <IoIosSettings className="settings-icon" />
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat">
              <strong>{userStats.posts.toLocaleString()}</strong>
              <span>posts</span>
            </div>
            <div className="stat">
              <strong>{userStats.followers}</strong>
              <span>followers</span>
            </div>
            <div className="stat">
              <strong>{userStats.following}</strong>
              <span>following</span>
            </div>
          </div>
          
          <div className="profile-bio">
            <h2>{currentUser.fullName}</h2>
            <p>{currentUser.bio}</p>
            <a href={`https://${currentUser.website}`} className="profile-website">{currentUser.website}</a>
          </div>
        </div>
      </div>

      {/* Profile Highlights */}
      <div className="profile-highlights">
        <div className="highlight-item">
          <div className="highlight-circle">
            <span>#</span>
          </div>
          <span className="highlight-name">ShareWith...</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <span>💬</span>
          </div>
          <span className="highlight-name">Made Us</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <span>SBS</span>
          </div>
          <span className="highlight-name">SBS</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <span>💎</span>
          </div>
          <span className="highlight-name">Hidden Gems</span>
        </div>
        <div className="highlight-item">
          <div className="highlight-circle">
            <span>#</span>
          </div>
          <span className="highlight-name">Advocates</span>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${profileTab === 'posts' ? 'active' : ''}`}
          onClick={() => setProfileTab('posts')}
        >
          <MdGridOn /> <span>POSTS</span>
        </button>
        <button 
          className={`profile-tab ${profileTab === 'reels' ? 'active' : ''}`}
          onClick={() => setProfileTab('reels')}
        >
          <MdPlayCircleOutline /> <span>REELS</span>
        </button>
        <button 
          className={`profile-tab ${profileTab === 'tagged' ? 'active' : ''}`}
          onClick={() => setProfileTab('tagged')}
        >
          <MdAccountBox /> <span>TAGGED</span>
        </button>
      </div>

      {/* Posts Grid */}
      <div className="profile-posts-grid">
        {posts.length > 0 ? (
          posts.slice(0, 9).map(post => (
            <div key={post.id} className="profile-post-item">
              {post.image && <img src={post.image} alt="" />}
              {post.video && (
                <div className="video-overlay">
                  <video src={post.video} />
                  <div className="video-icon">▶</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-posts-profile">
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );

  // Bottom Navigation for Mobile
  const MobileBottomNav = () => (
    <div className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-icon ${activeTab === "home" ? "active" : ""}`}
        onClick={() => setActiveTab("home")}
      >
        {activeTab === "home" ? <AiFillHome /> : <AiOutlineHome />}
      </button>
      <button 
        className={`mobile-nav-icon ${activeTab === "search" ? "active" : ""}`}
        onClick={() => setActiveTab("search")}
      >
        <AiOutlineSearch />
      </button>
      <button 
        className="mobile-nav-icon"
        onClick={() => postInputRef.current?.click()}
      >
        <AiOutlinePlusSquare />
      </button>
      <button 
        className={`mobile-nav-icon ${activeTab === "reels" ? "active" : ""}`}
        onClick={() => setActiveTab("reels")}
      >
        <BiMoviePlay />
      </button>
      <button 
        className={`mobile-nav-icon ${activeTab === "profile" ? "active" : ""}`}
        onClick={() => setActiveTab("profile")}
      >
        {activeTab === "profile" ? <RiUserFill /> : <RiUser3Line />}
      </button>
    </div>
  );

  return (
    <div className="hfun-app">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => setActiveTab("home")}>
            <div className="logo-icon">
              <div className="hfun-logo">Hfun</div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="nav-search-desktop">
            <AiOutlineSearch />
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              ref={searchRef}
            />
          </div>

          <div className="nav-icons">
            <button 
              className={`nav-icon desktop-only ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              {activeTab === "home" ? <AiFillHome /> : <AiOutlineHome />}
            </button>
            
            <button 
              className={`nav-icon desktop-only ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("messages");
                fetchMessages();
              }}
            >
              {activeTab === "messages" ? <FaFacebookMessenger /> : <BsMessenger />}
            </button>
            
            <button 
              className="nav-icon desktop-only"
              onClick={() => postInputRef.current?.click()}
            >
              <AiOutlinePlusSquare />
            </button>
            
            <button 
              className={`nav-icon desktop-only ${activeTab === "reels" ? "active" : ""}`}
              onClick={() => setActiveTab("reels")}
            >
              <BiMoviePlay />
            </button>
            
            <button 
              className={`nav-icon ${activeTab === "search" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("search");
                searchRef.current?.focus();
              }}
            >
              <AiOutlineSearch />
            </button>
            
            <button 
              className={`nav-icon desktop-only ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <RiUser3Line />
            </button>
            
            <button 
              className="nav-icon logout-btn desktop-only"
              onClick={handleLogout}
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "home" && renderHome()}
        {activeTab === "search" && renderSearch()}
        {activeTab === "messages" && renderMessages()}
        {activeTab === "reels" && renderReels()}
        {activeTab === "profile" && renderProfile()}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Hidden Inputs */}
      <input 
        hidden 
        ref={postInputRef} 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleUpload} 
      />
      <input 
        hidden 
        ref={storyInputRef} 
        type="file" 
        accept="image/*" 
        onChange={uploadStory} 
      />
    </div>
  );
}