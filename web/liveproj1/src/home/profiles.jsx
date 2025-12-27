import { useState, useEffect } from "react";
import "./profiles.css";

const API = "http://127.0.0.1:8000/api";

export default function Profile() {
  const token = localStorage.getItem("token");

  const [edit, setEdit] = useState(false);
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState("");

  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    bio: "",
    website: "",
    image: null,
    followers: 0,
    following: 0,
  });

  const [posts, setPosts] = useState([]);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    const res = await fetch(`${API}/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfile(data);
  };

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    const res = await fetch(`${API}/my-posts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  /* ================= UPDATE PROFILE ================= */
  const saveProfile = async () => {
    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("fullName", profile.fullName);
    formData.append("bio", profile.bio);
    formData.append("website", profile.website);
    if (profile.image instanceof File) {
      formData.append("image", profile.image);
    }

    await fetch(`${API}/profile/update/`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setEdit(false);
    fetchProfile();
  };

  /* ================= CREATE POST ================= */
  const createPost = async () => {
    if (!postFile) return;

    const formData = new FormData();
    formData.append("image", postFile);
    formData.append("caption", caption);

    await fetch(`${API}/posts/create/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setPostFile(null);
    setCaption("");
    fetchPosts();
  };

  /* ================= LIKE POST ================= */
  const likePost = async (id) => {
    await fetch(`${API}/posts/${id}/like/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  /* ================= DELETE POST ================= */
  const deletePost = async (id) => {
    await fetch(`${API}/posts/${id}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-img">
          <img
            src={profile.image || "https://via.placeholder.com/150"}
            alt="profile"
          />
          {edit && (
            <div className="profile-hover-overlay">
              <label>
                Edit Profile
                <input
                  type="file"
                  onChange={(e) =>
                    setProfile({ ...profile, image: e.target.files[0] })
                  }
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-top">
            <h2 className="username">{profile.username || "username"}</h2>
            <button onClick={() => (edit ? saveProfile() : setEdit(true))}>
              {edit ? "Save Profile" : "Edit Profile"}
            </button>
          </div>

          <div className="stats">
            <span>
              <b>{posts.length}</b> posts
            </span>
            <span>
              <b>{profile.followers}</b> followers
            </span>
            <span>
              <b>{profile.following}</b> following
            </span>
          </div>

          {edit ? (
            <div className="edit-fields">
              <input
                placeholder="Username"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
              <input
                placeholder="Full Name"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
              <textarea
                placeholder="Bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
              <input
                placeholder="Website"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="bio">
              <b>{profile.fullName}</b>
              <p>{profile.bio}</p>
              {profile.website && <a href={profile.website}>{profile.website}</a>}
            </div>
          )}
        </div>
      </div>

      {/* CREATE POST */}
      <div className="create-post">
        <label className="upload-btn">
          {postFile ? postFile.name : "Upload Post"}
          <input
            type="file"
            onChange={(e) => setPostFile(e.target.files[0])}
          />
        </label>
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />
        <button onClick={createPost}>Post</button>
      </div>

      {/* POSTS */}
      <div className="posts-grid">
        {posts.map((p) => (
          <div className="grid-item" key={p.id}>
            <img src={p.image} alt="" />
            <div className="grid-overlay">
              <span onClick={() => likePost(p.id)}>❤️ {p.likes}</span>
              <span className="delete-btn" onClick={() => deletePost(p.id)}>
                🗑
              </span>
            </div>
            {p.caption && (
              <div className="post-caption">
                <strong>{profile.username}</strong> {p.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}