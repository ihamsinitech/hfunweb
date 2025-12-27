from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
import json

from rest_framework.decorators import api_view, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Profile,      # ✅ ADDED (SAFE)
    Post,
    Comment,
    Story,
    Reel,
    ReelComment,
    Message
)

# ==================================================
# 🔐 JWT LOGIN
# ==================================================
@csrf_exempt
def jwt_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)
    username_or_email = data.get("username")
    password = data.get("password")

    if not username_or_email or not password:
        return JsonResponse({"error": "Missing fields"}, status=400)

    try:
        user = User.objects.get(
            Q(username=username_or_email) | Q(email=username_or_email)
        )
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    if not user.check_password(password):
        return JsonResponse({"error": "Invalid password"}, status=400)

    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })


# ==================================================
# 📝 REGISTER
# ==================================================
@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)

    name = data.get("name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([name, username, email, password]):
        return JsonResponse({"error": "All fields required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=name
    )

    # ✅ AUTO CREATE PROFILE
    Profile.objects.create(user=user)

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })


# ==================================================
# 🖼 POSTS
# ==================================================
def get_posts(request):
    posts = Post.objects.all().order_by("-created_at")

    return JsonResponse([
        {
            "id": p.id,
            "user": p.user.username,
            "caption": p.caption,
            "image": request.build_absolute_uri(p.image.url) if p.image else None,
            "video": request.build_absolute_uri(p.video.url) if p.video else None,
            "likes": p.likes,
            "liked": p.liked,
            "comments": [
                {"user": c.user.username, "text": c.text}
                for c in p.comments.all()
            ]
        }
        for p in posts
    ], safe=False)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def create_post(request):
    Post.objects.create(
        user=request.user,
        image=request.FILES.get("image"),
        video=request.FILES.get("video"),
        caption=request.POST.get("caption", "")
    )
    return JsonResponse({"message": "Post created"})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def add_comment(request, post_id):
    Comment.objects.create(
        post=get_object_or_404(Post, id=post_id),
        user=request.user,
        text=request.data.get("text")
    )
    return JsonResponse({"message": "Comment added"})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    post.liked = not post.liked
    post.likes = post.likes + 1 if post.liked else max(post.likes - 1, 0)
    post.save()

    return JsonResponse({"likes": post.likes, "liked": post.liked})


# ==================================================
# 📸 STORIES
# ==================================================
def get_stories(request):
    return JsonResponse([
        {
            "id": s.id,
            "user": s.user.username,
            "image": request.build_absolute_uri(s.image.url)
        }
        for s in Story.objects.all().order_by("-created_at")
    ], safe=False)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def upload_story(request):
    Story.objects.create(
        user=request.user,
        image=request.FILES.get("image")
    )
    return JsonResponse({"message": "Story uploaded"})


# ==================================================
# 🎬 REELS
# ==================================================
def get_reels(request):
    reels = Reel.objects.all().order_by("-created_at")

    return JsonResponse([
        {
            "id": r.id,
            "user": r.user.username,
            "video": request.build_absolute_uri(r.video.url),
            "likes": r.likes,
            "liked": r.liked,
            "comments": [
                {"user": c.user.username, "text": c.text}
                for c in r.comments.all()
            ]
        }
        for r in reels
    ], safe=False)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def upload_reel(request):
    Reel.objects.create(
        user=request.user,
        video=request.FILES.get("video")
    )
    return JsonResponse({"message": "Reel uploaded"})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def like_reel(request, reel_id):
    reel = get_object_or_404(Reel, id=reel_id)

    reel.liked = not reel.liked
    reel.likes = reel.likes + 1 if reel.liked else max(reel.likes - 1, 0)
    reel.save()

    return JsonResponse({"likes": reel.likes, "liked": reel.liked})


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def comment_reel(request, reel_id):
    ReelComment.objects.create(
        reel=get_object_or_404(Reel, id=reel_id),
        user=request.user,
        text=request.data.get("text")
    )
    return JsonResponse({"message": "Comment added"})


# ==================================================
# 💬 MESSAGES
# ==================================================
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def get_messages(request):
    user = request.user

    messages = Message.objects.filter(
        Q(sender=user) | Q(receiver=user)
    ).order_by("timestamp")

    return JsonResponse([
        {
            "id": m.id,
            "sender": m.sender.username,
            "receiver": m.receiver.username,
            "text": m.text,
            "timestamp": m.timestamp.isoformat(),
            "is_read": m.is_read
        }
        for m in messages
    ], safe=False)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
def send_message(request):
    receiver_username = request.data.get("receiver")
    text = request.data.get("text")

    receiver = get_object_or_404(User, username=receiver_username)

    Message.objects.create(
        sender=request.user,
        receiver=receiver,
        text=text
    )
    return JsonResponse({"message": "Message sent"})


# ==================================================
# 🔍 SEARCH
# ==================================================
def search_api(request):
    query = request.GET.get("q", "").strip()

    if not query:
        return JsonResponse({"users": [], "posts": []})

    users = User.objects.filter(username__icontains=query)[:10]
    posts = Post.objects.filter(caption__icontains=query)[:10]

    return JsonResponse({
        "users": [{"id": u.id, "username": u.username} for u in users],
        "posts": [
            {
                "id": p.id,
                "image": request.build_absolute_uri(p.image.url) if p.image else None,
                "caption": p.caption
            }
            for p in posts
        ]
    })


# ==================================================
# 👤 PROFILE (NEW — ADDED SAFELY)
# ==================================================
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def get_profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    return JsonResponse({
        "username": request.user.username,
        "fullName": profile.full_name,
        "bio": profile.bio,
        "website": profile.website,
        "image": request.build_absolute_uri(profile.image.url) if profile.image else None,
        "followers": profile.followers,
        "following": profile.following
    })


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
def update_profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    profile.full_name = request.data.get("fullName", "")
    profile.bio = request.data.get("bio", "")
    profile.website = request.data.get("website", "")

    if "image" in request.FILES:
        profile.image = request.FILES["image"]

    profile.save()
    return JsonResponse({"message": "Profile updated"})


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
def my_posts(request):
    posts = Post.objects.filter(user=request.user).order_by("-created_at")

    return JsonResponse([
        {
            "id": p.id,
            "image": request.build_absolute_uri(p.image.url) if p.image else None,
            "caption": p.caption,
            "likes": p.likes
        }
        for p in posts
    ], safe=False)


@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
def delete_post(request, id):
    post = get_object_or_404(Post, id=id, user=request.user)
    post.delete()
    return JsonResponse({"message": "Post deleted"})
