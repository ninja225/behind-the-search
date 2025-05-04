from django import forms
from .models import CourseVideo


class CourseVideoForm(forms.ModelForm):
    class Meta:
        model = CourseVideo
        fields = ['title', 'description', 'lesson_number', 'bunny_video_id']
