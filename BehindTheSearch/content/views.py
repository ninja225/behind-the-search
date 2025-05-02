
from django.shortcuts import render, get_object_or_404, redirect
from .models import CourseVideo
from .forms import CourseVideoForm
from adminBoard.decorators import superuser_required
from django.contrib.auth.decorators import login_required
from django.http import FileResponse




@login_required
def stream_video(request, id):
    video = get_object_or_404(CourseVideo, id=id)
    try:
        return FileResponse(video.video.open('rb'), content_type='video/mp4')
    except FileNotFoundError:
        raise Http404("Video not found.")




def video_list(request):
    videos = CourseVideo.objects.all()
    return render(request, 'content/video_list.html', {'videos': videos})

def video_detail(request, id):
    video = get_object_or_404(CourseVideo, id=id) 
    return render(request, 'content/video_detail.html', {'video': video})

@superuser_required
def create_course_video(request):
    if request.method == 'POST':
        form = CourseVideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('video_list')
    else:
        form = CourseVideoForm()

    return render(request, 'content/create_course_video.html', {'form': form})

#def video_description(request, video_id):
    #video = get_object_or_404(CourseVideo, id=video_id)
    
    #return render(request, 'content/video_description.html', {'video': video})

@superuser_required
def edit_course_video(request, video_id):
    video = get_object_or_404(CourseVideo, id=video_id)
    
    if request.method == 'POST':
        form = CourseVideoForm(request.POST, request.FILES, instance=video)
        if form.is_valid():
            form.save()
            return redirect('video_list')
    else:
        form = CourseVideoForm(instance=video)
    
    return render(request, 'content/edit_course_video.html', {'form': form, 'video': video})