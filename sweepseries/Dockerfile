# Python Image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY Pipfile Pipfile.lock /app/
RUN pip install pipenv && pipenv install --deploy --system

COPY . /app/

# Expose port for guincorn
EXPOSE 8000

# Add entrypoint script for migrations and collectstatic
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Create logs directory
RUN mkdir -p /app/logs

# Run the application
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["pipenv", "run", "gunicorn", "sweepseries.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", "--preload", \
     "--access-logfile", "/app/logs/server_access.log", \
     "--error-logfile", "/app/logs/server_error.log", \
     "--log-level", "info", \
     "--access-logformat", "%(h)s %(u)s %(t)s \\\"%(r)s\\\" %(s)s %(b)s"]
