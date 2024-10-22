from django.utils.deprecation import MiddlewareMixin

class DisableCookiesMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()

        if 'sweep' in user_agent:
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')

        return response
