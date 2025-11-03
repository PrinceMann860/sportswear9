from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import UserProfile, Address
from .serializers import UserProfileSerializer, AddressSerializer
import requests
from rest_framework import status
from ipware import get_client_ip

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile = self.request.user.profile

        # Update country from IP
        country = self.get_country_from_ip()
        if country and profile.country != country:
            profile.country = country

        # Update locale from request headers
        locale = self.get_locale()
        if locale and profile.locale != locale:
            profile.locale = locale

        profile.save(update_fields=['country', 'locale'])
        return profile

    def get_country_from_ip(self):
        client_ip, is_routable = get_client_ip(self.request)
        if not client_ip:
            return None
        try:
            response = requests.get(f"https://ipapi.co/{client_ip}/json/")
            if response.status_code == 200:
                return response.json().get("country")  # ISO code, e.g., "IN"
        except requests.RequestException:
            return None
        return None

    def get_locale(self):
        # Check Accept-Language header
        accept_lang = self.request.META.get("HTTP_ACCEPT_LANGUAGE")
        if accept_lang:
            # Returns something like 'en-US,en;q=0.9'
            return accept_lang.split(",")[0]
        return None



class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return Address.objects.filter(user=profile)

    def perform_create(self, serializer):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        serializer.save(user=profile)


from rest_framework import status
from rest_framework.response import Response

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return Address.objects.filter(user=profile)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        address_name = instance.address_name
        first_name = instance.first_name
        last_name = instance.last_name
        city = instance.city

        # Delete the instance
        self.perform_destroy(instance)

        # Return a custom JSON response
        return Response(
            {
                "status": "success",
                "message": f"Address '{address_name}' for {first_name} {last_name or ''} in {city} deleted successfully."
            },
            status=status.HTTP_200_OK
        )
