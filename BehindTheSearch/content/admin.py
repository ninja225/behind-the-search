from django.contrib import admin
from .models import CourseVideo

class CourseVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'mark_as_watched', 'video')
    search_fields = ('title', 'description')
    list_filter = ('mark_as_watched',)
    ordering = ('-id',)

admin.site.register(CourseVideo, CourseVideoAdmin)