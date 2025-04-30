# Behind The Search: Search Engine Rating Course

A modern, responsive web platform for delivering a comprehensive Search Engine Rating course. This Django-based application provides secure access to video lessons, resources, and learning materials for individuals interested in search quality evaluation.

## 🌟 Features

- **Secure Authentication System**: User registration, login, and password recovery
- **Course Content Management**: Structured video lessons and downloadable resources
- **Progress Tracking**: Users can track their learning journey
- **Admin Dashboard**: Manage user access, monitor platform usage, and view analytics
- **Mobile-Responsive Design**: Optimized learning experience across all devices
- **Manual Access Control**: Admin grants course access after confirming payment
- **Advanced Video Security**:
  - Dynamic watermarking with user identification
  - Copy protection and download prevention
  - Encrypted video streaming
  - Session-based access controls

## 🔒 Content Protection

This platform implements multiple layers of security to protect course content:

- **Dynamic Watermarking**: Each video is overlaid with the viewer's personal information
- **Anti-Download Measures**: Disabled right-click, custom video player with no download option
- **Encryption**: Video content is encrypted during storage and streaming
- **Session Management**: Time-limited viewing sessions with re-authentication requirements
- **Screen Recording Prevention**: Visual safeguards against unauthorized screen recording
- **Access Monitoring**: IP and device tracking to prevent account sharing

## 🛠️ Tech Stack

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **UI Framework**: Tailwind CSS
- **Icons**: SVG (Lucide/Heroicons)

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ installed
- pip (Python package manager)
- Git

### Installation

1. Clone the repository

   ```
   git clone https://github.com/ninja225/behind-the-search.git
   cd behind-the-search
   ```

2. Create a virtual environment

   ```
   python -m venv venv
   ```

3. Activate the virtual environment

   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies

   ```
   pip install -r requirements.txt
   ```

5. Run migrations

   ```
   python manage.py migrate
   ```

6. Create a superuser (admin)

   ```
   python manage.py createsuperuser
   ```

7. Start the development server

   ```
   python manage.py runserver
   ```

8. Access the application at [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 📂 Project Structure

```
behind-the-search/
├── core/                   # Core Django application
│   ├── models.py           # Database models
│   ├── views.py            # View functions
│   ├── urls.py             # URL configurations
│   └── admin.py            # Admin panel setup
├── static/                 # Static files (CSS, JS, images)
├── templates/              # HTML templates
├── media/                  # User-uploaded content
├── docs/                   # Documentation
│   ├── prd.md              # Product Requirements Document
│   └── front-prd.md        # Frontend Design Requirements
├── manage.py               # Django management script
├── requirements.txt        # Project dependencies
└── README.md               # Project documentation
```

## 👥 Admin Features

- View registered users and their activity
- Grant/revoke course access
- Ban/unban users
- View platform insights and analytics
- Monitor security logs for unusual activity
- Manage session and device access

## 👤 User Features

- Register and request access to the course
- Access secure video lessons with content protection
- Track course progress
- Download additional resources (non-video content)
- Resume lessons from where they left off
- View on authorized devices only

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
