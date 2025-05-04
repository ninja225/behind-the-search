from django.db import models


class CourseVideo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    # New field for Bunny.net video ID
    bunny_video_id = models.CharField(max_length=255, null=True, blank=True,
                                      help_text="The video ID from Bunny.net (e.g., 'eefdc431-726a-4ccc-b2f1-127b9aa449a5')")
    # Library ID from Bunny.net (not editable in forms)
    bunny_library_id = models.CharField(
        max_length=255, default="420524", editable=False)
    mark_as_watched = models.BooleanField(default=False)
    lesson_number = models.IntegerField(unique=True, null=False)

    def __str__(self):
        return self.title

    @property
    def has_bunny_video(self):
        """Check if this video has a Bunny.net video ID."""
        return bool(self.bunny_video_id)
