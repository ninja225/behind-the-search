
from django.urls import path
from . import views

urlpatterns = [
    path('videos/', views.video_list, name='video_list'),
    path('video/<int:id>/', views.video_detail, name='video_detail'),
    path('videos/stream/<int:id>/', views.stream_video, name='stream_video'),
    path('video/create/', views.create_course_video, name='create_course_video'),
    path('video/edit/<int:video_id>/', views.edit_course_video, name='edit_course_video'),
    path('video/delete/<int:video_id>/', views.delete_course_video, name='delete_course_video'),

]
