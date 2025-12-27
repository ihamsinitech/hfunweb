from django.urls import path
from .views import (
    # ================= AUTH =================
    jwt_login,
    register_user,

    # ================= POSTS =================
    get_posts,
    create_post,
    add_comment,
    like_post,
    delete_post,          # ✅ ADDED (SAFE)
    my_posts,             # ✅ ADDED (SAFE)

    # ================= STORIES =================
    get_stories,
    upload_story,

    # ================= REELS =================
    get_reels,
    upload_reel,
    like_reel,
    comment_reel,

    # ================= MESSAGES =================
    get_messages,
    send_message,

    # ================= SEARCH =================
    search_api,

    # ================= PROFILE =================
    get_profile,          # ✅ ADDED
    update_profile        # ✅ ADDED
)

urlpatterns = [
    # ---------- AUTH ----------
    path("jwt/login/", jwt_login),
    path("accounts/register/", register_user),

    # ---------- POSTS ----------
    path("posts/", get_posts),
    path("posts/create/", create_post),
    path("posts/<int:post_id>/like/", like_post),
    path("posts/<int:post_id>/comment/", add_comment),

    # ---------- STORIES ----------
    path("stories/", get_stories),
    path("stories/upload/", upload_story),

    # ---------- REELS ----------
    path("reels/", get_reels),
    path("reels/upload/", upload_reel),
    path("reels/<int:reel_id>/like/", like_reel),
    path("reels/<int:reel_id>/comment/", comment_reel),

    # ---------- MESSAGES ----------
    path("messages/", get_messages),
    path("messages/send/", send_message),

    # ---------- SEARCH ----------
    path("search/", search_api),

    # ---------- PROFILE (NEW) ----------
    path("profile/", get_profile),
    path("profile/update/", update_profile),

    # ---------- MY POSTS & DELETE ----------
    path("my-posts/", my_posts),
    path("posts/<int:id>/delete/", delete_post),
]
