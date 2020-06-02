from .models import User
from rest_framework import viewsets, permissions
from .serializers import UserSerializer

# Lead Viewset


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset= User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    # permission_classes = [
    #     permissions.IsAuthenticated,
    # ]
    serializer_class = UserSerializer
    #
    # def get_queryset(self):
    #     return self.request.user.leads.all()
    #
    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)
