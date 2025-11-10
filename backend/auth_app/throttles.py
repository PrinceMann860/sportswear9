from rest_framework.throttling import SimpleRateThrottle

class OTPRateThrottle(SimpleRateThrottle):
    scope = "otp"

    def get_cache_key(self, request, view):
        # Identify users uniquely by email (if provided) + IP address
        ident = (
            request.data.get("email") 
            or self.get_ident(request)
        )
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }
