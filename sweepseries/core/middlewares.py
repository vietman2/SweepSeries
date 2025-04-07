import logging
import traceback
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('gunicorn.error')

class DisableCookiesMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()

        if 'sweep' in user_agent:
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')

        return response

class BadResponseMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        tb = traceback.format_exc()

        try:
            body = request.body.decode(errors='ignore')
        except Exception:
            body = '<unavailable>'

        try:
            post_data = request.POST.dict()
        except Exception:
            post_data = '<unavailable>'

        log_message = (
            "Unhandled Exception:\n"
            f"Path: {request.path}\n"
            f"Method: {request.method}\n"
            f"GET Params: {request.GET.dict()}\n"
            f"POST Data: {post_data}\n"
            f"Body: {body}\n"
            f"User: {getattr(request, 'user', None)}\n"
            f"Exception: {str(exception)}\n"
            f"Traceback:\n{tb}"
        )

        logger.error(log_message)

    def process_response(self, request, response):
        if response.status_code >= 400:
            log_message = (
                f"Client/Server Error Response:\n"
                f"Status Code: {response.status_code}\n"
                f"Path: {request.path}\n"
                f"Method: {request.method}\n"
                f"GET: {request.GET.dict()}\n"
                f"POST: {getattr(request, 'POST', {})}\n"
                f"Body: {request.body.decode(errors='ignore')}\n"
                f"User: {getattr(request, 'user', None)}\n"
                f"Response Content: {getattr(response, 'content', b'').decode(errors='ignore')[:500]}"
            )

            logger.error(log_message)

        return response
