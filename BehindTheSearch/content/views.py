from django.shortcuts import render, get_object_or_404, redirect
from .models import CourseVideo, VideoSection
from .forms import CourseVideoForm, VideoSectionForm
from adminBoard.decorators import superuser_required, access_required
from django.contrib.auth.decorators import login_required
from django.http import Http404
# {Ai -Ninja} This view is used to stream the video content
from django.http import FileResponse, JsonResponse
from django.views.decorators.http import require_POST
import json


@access_required
def sections_list(request):
    # Fetch all VideoSection objects from the database
    sections = VideoSection.objects.all()

    context = {
        'sections': sections,
    }

    return render(request, 'content/sections_list.html', context)


@superuser_required
def delete_section(request, section_id):
    section = get_object_or_404(VideoSection, id=section_id)
    section.delete()
    return redirect('sections_list')\



@superuser_required
def edit_section(request, section_id):
    section = get_object_or_404(VideoSection, id=section_id)

    if request.method == 'POST':
        form = VideoSectionForm(request.POST, instance=section)
        if form.is_valid():
            form.save()
            return redirect('section_detail', section_id=section.id)
    else:
        form = VideoSectionForm(instance=section)

    return render(request, 'content/edit_section.html', {'form': form, 'section': section})


@access_required
def section_detail(request, section_id):
    section = get_object_or_404(VideoSection, id=section_id)
    videos = CourseVideo.objects.filter(
        section=section).order_by('lesson_number')
    description = section.description

    context = {
        'description': description,
        'section': section,
        'videos': videos,
    }

    return render(request, 'content/section_detail.html', context)


@superuser_required
def create_section(request):
    if request.method == 'POST':
        form = VideoSectionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('sections_list')
    else:
        form = VideoSectionForm()

    return render(request, 'content/create_section.html', {'form': form})


@access_required
def video_list(request, section_id):
    section = get_object_or_404(VideoSection, id=section_id)

    videos = CourseVideo.objects.filter(
        section=section).order_by('lesson_number')

    context = {
        'section': section,
        'videos': videos,
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
            form.save()
            return redirect('video_list_by_section', section_id=form.cleaned_data['section'].id)
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
            section_id=form.cleaned_data['section'].id
            return redirect('video_list_by_section', section_id)
    else:
        form = CourseVideoForm(instance=video)

    return render(request, 'content/edit_course_video.html', {'form': form, 'video': video,'section_id':video.section.id})


@superuser_required
def delete_course_video(request, video_id):
    video = get_object_or_404(CourseVideo, id=video_id)
    video.delete()
    return redirect('video_list_by_section', section_id=video.section.id)


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


# API endpoint to check if a lesson number already exists {Ninja- Ai}
def check_lesson_number(request):
    """
    Checks if a lesson number already exists in the database.
    Returns JSON response with 'exists' property.
    """
    number = request.GET.get('number')
    video_id = request.GET.get('current_id')

    if not number:
        return JsonResponse({'error': 'Lesson number is required'}, status=400)

    try:
        number = int(number)
        query = CourseVideo.objects.filter(lesson_number=number)

        # If editing an existing video, exclude the current video from the check
        if video_id:
            try:
                video_id = int(video_id)
                query = query.exclude(id=video_id)
            except ValueError:
                pass

        exists = query.exists()
        return JsonResponse({'exists': exists})
    except ValueError:
        return JsonResponse({'error': 'Invalid lesson number'}, status=400)
