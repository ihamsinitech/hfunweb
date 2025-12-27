from rest_framework import serializers
from .models import (
    Profile,
    Post,
    Comment,
    Story,
    Reel,
    ReelComment,
    Message
)

# ================= PROFILE =================
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "username",
            "full_name",
            "bio",
            "website",
            "image",
            "followers",
            "following",
        ]


# ================= POSTS =================
class PostSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Post
        fields = "__all__"


# ================= COMMENTS =================
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"


# ================= STORIES =================
class StorySerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Story
        fields = "__all__"


# ================= REELS =================
class ReelSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Reel
        fields = "__all__"


# ================= REEL COMMENTS =================
class ReelCommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ReelComment
        fields = "__all__"


# ================= MESSAGES =================
class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username", read_only=True)
    receiver = serializers.CharField(source="receiver.username", read_only=True)

    class Meta:
        model = Message
        fields = "__all__"
