from django.shortcuts import render
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import user_passes_test


from IMGSched.serializers import UserSerializer, CommentSerializer, MeetingSerializer
from IMGSched.models import Meeting, Comment
# from IMGSched.permissions import IsOwnerOrReadOnly, IsOwnerOrRead

from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework import permissions, generics, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = (IsAuthenticated, )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        serializer.save(created_on=timezone.now())

    @action(detail=True, methods=['get'])
    def get_queryset(self):
        if(self.request.user.is_staff):
            return Meeting.objects.all()
        return Meeting.objects.all(participants__username=user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer): 
        serializer.save(time=timezone.now())

    def retrieve(self, request, pk=None):
        queryset = Comment.objects.filter(meeting_id=pk)
        return queryset    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    @action(detail=True)
    def meetings(self, request, pk=None):
        queryset = User.objects.get(pk=pk).meetings.all()
        return queryset

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        filter = {}
        if self.kwargs['pk'].isnumeric():
            filter['pk'] = self.kwargs['pk']
        else:
            filter['username'] = self.kwargs['pk']
        return get_object_or_404(queryset, **filter)


    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny(), ]
        return super(UserViewSet, self).get_permissions()