from django.db import models
from django.contrib.auth.models import User


# ================= PROFILE =================
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    full_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    image = models.ImageField(upload_to="profiles/", null=True, blank=True)
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


# ================= POSTS =================
class Post(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts"
    )
    image = models.ImageField(upload_to="posts/", null=True, blank=True)
    video = models.FileField(upload_to="posts/videos/", null=True, blank=True)
    caption = models.TextField(blank=True)
    likes = models.IntegerField(default=0)
    liked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.caption[:20]}"


# ================= COMMENTS =================
class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        related_name="comments",
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        related_name="comments",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.text[:20]}"


# ================= STORIES =================
class Story(models.Model):
    user = models.ForeignKey(
        User,
        related_name="stories",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="stories/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} story"


# ================= REELS =================
class Reel(models.Model):
    user = models.ForeignKey(
        User,
        related_name="reels",
        on_delete=models.CASCADE
    )
    video = models.FileField(upload_to="reels/")
    likes = models.IntegerField(default=0)
    liked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} reel"


# ================= REEL COMMENTS =================
class ReelComment(models.Model):
    reel = models.ForeignKey(
        Reel,
        related_name="comments",
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        related_name="reel_comments",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.text[:20]}"


# ================= MESSAGES =================
class Message(models.Model):
    sender = models.ForeignKey(
        User,
        related_name="sent_messages",
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User,
        related_name="received_messages",
        on_delete=models.CASCADE
    )
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.sender.username} → {self.receiver.username}: {self.text[:20]}"


