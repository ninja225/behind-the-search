from django import forms
from .models import CourseVideo

class CourseVideoForm(forms.ModelForm):
    class Meta:
        model = CourseVideo
        fields = ['title', 'description', 'video','lesson_number']