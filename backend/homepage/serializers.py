# core/serializers.py


from rest_framework import serializers
from .models import HomePageLevel, HomePageSection, SectionItem

class SectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionItem
        fields = ['item_uuid', 'image', 'title', 'link', 'order']


class HomePageSectionSerializer(serializers.ModelSerializer):
    items = SectionItemSerializer(many=True, read_only=True)

    class Meta:
        model = HomePageSection
        fields = ['section_uuid', 'title', 'section_type', 'order', 'extra_config', 'items']


class HomePageLevelSerializer(serializers.ModelSerializer):
    sections = HomePageSectionSerializer(many=True, read_only=True)

    class Meta:
        model = HomePageLevel
        fields = ['level_uuid', 'name', 'order', 'sections']
