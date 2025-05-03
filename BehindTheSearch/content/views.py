from django.shortcuts import render, get_object_or_404, redirect
from django.http import Http404, JsonResponse, StreamingHttpResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from .models import CourseVideo
from .forms import CourseVideoForm
from .utils.encryption import encrypt_video, decrypt_video

from adminBoard.decorators import superuser_required, access_required

import json
import io


@access_required
def stream_video(request, id):
    video = get_object_or_404(CourseVideo, id=id)

    try:
        decrypted_data = decrypt_video(video.video.path)

        return StreamingHttpResponse(
            io.BytesIO(decrypted_data),
            content_type='video/mp4'
        )
    except Exception as e:
        return HttpResponse(f"Error decrypting video: {e}", status=500)





@access_required
def video_list(request):
    videos = CourseVideo.objects.all().order_by('lesson_number')

    query = request.GET.get('search', '')
    if query:
        videos = videos.filter(
            title__icontains=query).order_by('lesson_number')
    context = {
        'videos': videos,
        'query': query,
    }
    return render(request, 'content/video_list.html', context)



@access_required
def video_detail(request, id):
    video = get_object_or_404(CourseVideo, id=id)

    # Get previous and next videos based on lesson number
    prev_video = CourseVideo.objects.filter(
        lesson_number__lt=video.lesson_number).order_by('-lesson_number').first()
    next_video = CourseVideo.objects.filter(
        lesson_number__gt=video.lesson_number).order_by('lesson_number').first()

    context = {
        'video': video,
        'prev_video': prev_video,
        'next_video': next_video
    }

    return render(request, 'content/video_detail.html', context)


@superuser_required
def create_course_video(request):
    if request.method == 'POST':
        form = CourseVideoForm(request.POST, request.FILES)
        if form.is_valid():
            video_instance = form.save()
            
            # Encrypt the saved video
            input_path = video_instance.video.path
            encrypted_path = input_path  # overwrite same file
            encrypt_video(input_path, encrypted_path)

            return redirect('video_list')
    else:
        form = CourseVideoForm()

    return render(request, 'content/create_course_video.html', {'form': form})

# def video_description(request, video_id):
    # video = get_object_or_404(CourseVideo, id=video_id)

    # return render(request, 'content/video_description.html', {'video': video})


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



@access_required
def delete_course_video(request, video_id):
    video = get_object_or_404(CourseVideo, id=video_id)
    video.delete()
    return redirect('video_list')

# This view is used to mark a video as watched or unwatched {Ai -Ninja}


@access_required
@require_POST
def mark_video_watched(request, video_id):
    video = get_object_or_404(CourseVideo, id=video_id)

    try:
        data = json.loads(request.body)
        watched = data.get('watched', False)

        # Update the video's watched status
        video.mark_as_watched = watched
        video.save()

        return JsonResponse({
            'success': True,
            'watched': video.mark_as_watched
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)
