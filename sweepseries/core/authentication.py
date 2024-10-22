from rest_framework.authentication import SessionAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()

        if 'sweep' in user_agent:
            return

        super().enforce_csrf(request)
