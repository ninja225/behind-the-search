from django.db import models

class CourseVideo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    video = models.FileField(upload_to='videos/')  
    mark_as_watched = models.BooleanField(default=False)

    def __str__(self):
        return self.title
