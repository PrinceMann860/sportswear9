# reviews/permissions.py
from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission: allow full access for admin,
    only self-review access for users.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user
