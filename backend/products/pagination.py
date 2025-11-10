from rest_framework.pagination import CursorPagination

class ProductCursorPagination(CursorPagination):
    page_size = 100
    ordering = '-created_at'  # newest first
    cursor_query_param = 'cursor'
