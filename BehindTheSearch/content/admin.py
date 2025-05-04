from django.contrib import admin
from .models import CourseVideo


class CourseVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson_number',
                    'has_bunny_video', 'mark_as_watched')
    search_fields = ('title', 'description', 'bunny_video_id')
    list_filter = ('mark_as_watched',)
    ordering = ('lesson_number',)
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'lesson_number')
        }),
        ('Bunny.net Video', {
            'fields': ('bunny_video_id',),
            'description': 'Enter the video ID from Bunny.net. Example: For the URL "https://iframe.mediadelivery.net/embed/420524/eefdc431-726a-4ccc-b2f1-127b9aa449a5", the video ID is "eefdc431-726a-4ccc-b2f1-127b9aa449a5".'
        }),
        ('Status', {
            'fields': ('mark_as_watched',)
        }),
    )

    def has_bunny_video(self, obj):
        return obj.has_bunny_video
    has_bunny_video.short_description = 'Video Available'
    has_bunny_video.boolean = True


admin.site.register(CourseVideo, CourseVideoAdmin)
