# core/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Levels
    path("levels/", views.HomePageLevelListCreateView.as_view(), name="level-list-create"),
    path("levels/<str:uuid>/", views.HomePageLevelDetailView.as_view(), name="level-detail"),

    # Sections inside a level
    path("levels/<str:level_uuid>/sections/", views.HomePageSectionListCreateView.as_view(), name="section-list-create"),
    path("sections/<str:uuid>/", views.HomePageSectionDetailView.as_view(), name="section-detail"),

    # Items inside a section
    path("sections/<str:section_uuid>/items/", views.SectionItemListCreateView.as_view(), name="item-list-create"),
    path("items/<str:uuid>/", views.SectionItemDetailView.as_view(), name="item-detail"),
]
