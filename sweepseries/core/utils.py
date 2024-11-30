from django.conf import settings
import boto3

s3 = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    region_name='kr-standard',
    config=boto3.session.Config(signature_version='s3v4'),
)

def get_presigned_url(filename):
    return s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': f'{filename}',
        },
        ExpiresIn=300,
    )

def is_admin_page(request):
    admin_page_url = settings.ADMIN_PAGE_URL
    return request.META.get('HTTP_ORIGIN') == admin_page_url
