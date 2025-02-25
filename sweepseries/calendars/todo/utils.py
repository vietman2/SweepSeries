from django.db.models import Q

from .models import Todo
from .serializers import TodoSerializer

def get_todos(user, date):
    q = Q(user=user)
    q &= Q(deadline=date)

    todos = Todo.objects.filter(q)

    return TodoSerializer(todos, many=True).data
