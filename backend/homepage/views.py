# core/views.py

from rest_framework import generics
from .models import HomePageLevel, HomePageSection, SectionItem
from .serializers import HomePageLevelSerializer, HomePageSectionSerializer, SectionItemSerializer
from rest_framework.permissions import IsAdminUser , AllowAny  # optional for admin-only access
from rest_framework.exceptions import NotFound

# Helper to retrieve by uuid
def get_object_by_uuid_or_404(model, uuid_field, uuid_value):
    try:
        return model.objects.get(**{uuid_field: uuid_value})
    except model.DoesNotExist:
        raise NotFound(f"{model.__name__} with UUID '{uuid_value}' not found.")


class HomePageLevelListCreateView(generics.ListCreateAPIView):
    queryset = HomePageLevel.objects.all().order_by("order")
    serializer_class = HomePageLevelSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Anyone can view
        return [IsAdminUser()]   # Only admins can POST


class HomePageLevelDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomePageLevelSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return get_object_by_uuid_or_404(HomePageLevel, "level_uuid", self.kwargs["uuid"])


class HomePageSectionListCreateView(generics.ListCreateAPIView):
    serializer_class = HomePageSectionSerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Anyone can view
        return [IsAdminUser()]   # Only admins can POST

    def get_queryset(self):
        level = get_object_by_uuid_or_404(HomePageLevel, "level_uuid", self.kwargs["level_uuid"])
        return level.sections.all().order_by("order")

    def perform_create(self, serializer):
        level = get_object_by_uuid_or_404(HomePageLevel, "level_uuid", self.kwargs["level_uuid"])
        serializer.save(level=level)


class HomePageSectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomePageSectionSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return get_object_by_uuid_or_404(HomePageSection, "section_uuid", self.kwargs["uuid"])


class SectionItemListCreateView(generics.ListCreateAPIView):
    serializer_class = SectionItemSerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Anyone can view
        return [IsAdminUser()]   # Only admins can POST

    def get_queryset(self):
        section = get_object_by_uuid_or_404(HomePageSection, "section_uuid", self.kwargs["section_uuid"])
        return section.items.all().order_by("order")

    def perform_create(self, serializer):
        section = get_object_by_uuid_or_404(HomePageSection, "section_uuid", self.kwargs["section_uuid"])
        serializer.save(section=section)


class SectionItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SectionItemSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return get_object_by_uuid_or_404(SectionItem, "item_uuid", self.kwargs["uuid"])

