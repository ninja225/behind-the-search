# Frontend Design PRD

## Project Title: Search Engine Rating Course Platform (Frontend/UI Focus)

---

## 1. Objective

Design and develop a clean, modern, and visually appealing front end for a website that promotes and delivers a paid Search Engine Rating course. The site must reflect the brand's purple identity and provide intuitive user experiences across desktop and mobile.

---

## 2. Brand and Color Scheme

### Primary Colors (based on client input)

```css
:root {
  --Primary: #8e00a3; /* Primary purple */
  --Accent: #d16adf; /* Accent fuchsia */

  --Background: #1c1c1e; /* Dark mode base */
  --Background-Secondary: #2a2a2e;
  --Background-Tertiary: #3b3b42;

  --Surface: #2d2d30;
  --Surface-Hover: #3a3a3d;

  --Text-Primary: #ffffff;
  --Text-Secondary: #cccccc;
  --Text-Disabled: #777777;

  --Border: #444444;
  --Border-Focus: #d16adf;

  --Button-Hover: #a620b6;
  --Button-Active: #79007f;

  --Link: #d16adf;
  --Link-Hover: #ffffff;
}
```

### Typography

- **Headings**: Inter or Poppins, bold, white or accent
- **Body**: Inter or Roboto, light/regular, light gray

### Visual Style

- Dark UI with vibrant purple highlights
- Glassmorphism for cards and login forms
- Neumorphic buttons (soft inner shadows)
- Minimal, responsive grid layout

---

## 3. Frontend Pages & Components

### 1. Landing Page

- Hero section with bold CTA ("Enroll in Search Engine Rating Course")
- Course overview highlighting search evaluation skills
- Benefits section with icon cards (career opportunities, industry standards, etc.)
- Course curriculum preview with expandable sections
- Testimonial slider from previous students
- Register / Login buttons

### 2. Auth Pages (Login / Register / Forgot Password)

- Simple two-column layout (search engine themed illustration on left, form on right)
- Clean form validation
- Responsive and accessible

### 3. Dashboard (User Home)

- Welcome message with user name
- Course progress indicator
- List of available lessons with clear categorization by search rating topics
- Lesson card with progress indicator and estimated time
- Access to downloadable resources

### 4. Course Player Page

- Video player embedded with playback controls
- Sidebar with lesson titles organized by modules (e.g., "Understanding Search Quality", "Rating Techniques")
- Lesson status (watched/incomplete)
- Progress bar showing overall course completion
- Resource download section for supplementary materials

### 5. Admin Dashboard UI

- Table of users (sortable, searchable)
- Ban/unban button with status highlight
- Charts/insights: user count, access count, activity log
- Course analytics (most/least watched lessons)

---

## 4. Responsive Design

- Mobile-first layout
- Sticky nav bar (minimalistic)
- Hamburger menu on small screens
- Touch-friendly buttons and links
- Optimized video player for mobile viewing

---

## 5. UX Best Practices

- Transitions and hover states for buttons and links
- Feedback alerts (e.g., success, error)
- Loader animation on page transitions or video load
- Empty states (e.g., no lessons yet)
- Clear visual progress indicators throughout the learning journey

---

## 6. Tools & Frameworks

- **HTML5 / CSS3**
- **Vanilla JavaScript** (or minimal framework if needed)
- **Tailwind CSS** (preferred for utility and speed)
- **SVG Icons** (Lucide or Heroicons)

---

## 7. Success Criteria

- The design is consistent, accessible, and reflects the brand
- Users can intuitively navigate through the Search Engine Rating course content
- UI is visually appealing and enhances the learning experience
- The platform effectively communicates the value of the course

---

## 8. Optional Enhancements (Post-MVP)

- Animated hero section with search engine themed visuals
- Dark/light mode toggle
- User profile page with achievement badges
- Interactive practice exercises for search rating skills
- Note-taking feature for lessons
