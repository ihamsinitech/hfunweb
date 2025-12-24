from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ================= ADMIN =================
    path("admin/", admin.site.urls),

    # ================= API =================
    path("api/", include("core.urls")),
]

# ================= MEDIA FILES (DEV ONLY) =================
# This allows serving uploaded images/videos during development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
