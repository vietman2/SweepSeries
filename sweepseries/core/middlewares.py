import logging
import sys
import traceback
from django.conf import settings
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
        if settings.DEBUG or 'unittest' in sys.modules:
            return

        tb = traceback.format_exc()

        log_message = (
            "Unhandled Exception:\n"
            f"Path: {request.path}\n"
            f"Method: {request.method}\n"
            f"User: {getattr(request, 'user', None)}\n"
            f"Exception: {str(exception)}\n"
            f"Traceback:\n{tb}"
        )

        logger.error(log_message)

    def process_response(self, request, response):
        if settings.DEBUG or 'unittest' in sys.modules:
            return response

        if response.status_code >= 400:
            log_message = (
                f"Client/Server Error Response:\n"
                f"Status Code: {response.status_code}\n"
                f"Path: {request.path}\n"
                f"Method: {request.method}\n"
                f"User: {getattr(request, 'user', None)}\n"
                f"Response: {getattr(response, 'content', b'').decode(errors='ignore')[:500]}"
            )

            logger.error(log_message)

        return response
