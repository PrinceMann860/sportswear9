from django.urls import path
from .views import (
    RecentlyViewedListAPIView,
    AISuggestionListAPIView,
    AICompleteLookListAPIView,
)

urlpatterns = [
    path("recently-viewed/", RecentlyViewedListAPIView.as_view(), name="recently-viewed"),
    path("suggestions/<int:product_id>/", AISuggestionListAPIView.as_view(), name="ai-suggestions"),
    path("complete-look/<int:product_id>/", AICompleteLookListAPIView.as_view(), name="complete-look"),
]
