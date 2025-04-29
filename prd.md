# Product Requirements Document (PRD)

## Project Title: Search Engine Rating Course Platform

---

## 1. Objective

Build a clean, modern, and functional website that offers a **paid Search Engine Rating course**. The client will handle payments manually (outside the platform). The website must support user authentication, course access management, and provide an admin panel for controlling user access and viewing insights.

---

## 2. Target Users

- Users interested in learning Search Engine Rating methodologies and techniques
- Individuals looking to work in the search quality evaluation industry
- Admin (course author) who manages users and access permissions

---

## 3. Key Features (MVP)

### 1. Landing Page

- Brief introduction about the Search Engine Rating course
- Call to action (CTA) for registration or login
- Course highlights (search engine evaluation techniques, industry standards, job opportunities, etc.)
- Course outline and expected learning outcomes

### 2. Authentication

- User registration and login system
- Password reset functionality

### 3. Course Access Page (Private Area)

- Accessible only to users with granted access (approved manually by admin)
- Structured course content with video player (HTML5 video or embedded player)
- Navigation for course sections/lessons on Search Engine Rating techniques
- Downloadable resources (worksheets, rating guidelines, practice materials)

### 4. Manual Access Control

- No payment gateway
- Admin grants access manually after confirming payment via external means (e.g., bank transfer)

### 5. Admin Dashboard

Accessible only to authenticated admin user(s).

#### Admin Capabilities:

- View list of registered users
- Ban/unban users
- View platform insights:
  - Total registered users
  - Active users
  - Number of users with access
  - Basic activity log (last login, last lesson viewed, etc.)

---

## 4. Data Models (Django ORM)

```python
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    has_access = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)
    progress = models.IntegerField(default=0)  # Track user progress as percentage

class Lesson(models.Model):
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    order = models.PositiveIntegerField()
    is_published = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    duration = models.PositiveIntegerField(default=0)  # Duration in seconds

class Resource(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resources/')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='resources')

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

class LessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    last_watched_position = models.PositiveIntegerField(default=0)  # Position in seconds
```

---

## 5. Tech Stack

- **Frontend**: HTML, CSS (modern, responsive), JavaScript (vanilla or minimal framework)
- **Backend**: Django (Python)
- **Database**: SQLite (for simplicity in the MVP stage)
- **Deployment**: Any free-tier hosting (e.g., Vercel for frontend, Render/Railway for Django backend)

---

## 6. Success Criteria

- Users can register, log in, and request access to the Search Engine Rating course
- Admin can manage users, access rights, and view basic metrics
- The course content is secure and only visible to authorized users
- Users can track their progress through the course

---

## 7. Out of Scope (for MVP)

- Online payments
- Multi-course support
- Instructor/multi-admin system
- Mobile application
- Forum/community features
- Certification generation
