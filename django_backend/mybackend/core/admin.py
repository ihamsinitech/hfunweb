from django.contrib import admin
from .models import (
    Profile,          # ✅ ADDED
    Post,
    Comment,
    Story,
    Reel,
    ReelComment,
    Message
)

# ================= PROFILE =================
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "full_name",
        "followers",
        "following"
    )
    search_fields = ("user__username", "full_name")
    readonly_fields = ("user",)


# ================= POSTS =================
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "caption", "likes", "created_at")
    list_filter = ("created_at",)
    search_fields = ("caption", "user__username")
    readonly_fields = ("created_at",)


# ================= COMMENTS =================
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "text", "created_at")
    list_filter = ("created_at",)
    search_fields = ("text", "user__username")
    readonly_fields = ("created_at",)


# ================= STORIES =================
@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    list_filter = ("created_at",)
    readonly_fields = ("created_at",)


# ================= REELS =================
@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "likes", "created_at")
    list_filter = ("created_at",)
    readonly_fields = ("created_at",)


# ================= REEL COMMENTS =================
@admin.register(ReelComment)
class ReelCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "reel", "text", "created_at")
    list_filter = ("created_at",)
    readonly_fields = ("created_at",)


# ================= MESSAGES =================
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "receiver", "short_text", "timestamp", "is_read")
    list_filter = ("timestamp", "is_read")
    search_fields = ("text", "sender__username", "receiver__username")
    readonly_fields = ("timestamp",)

    def short_text(self, obj):
        return obj.text[:30]

    short_text.short_description = "Message"
