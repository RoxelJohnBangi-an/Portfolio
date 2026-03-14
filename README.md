# Developer Portfolio Web Application

A modern, full-featured portfolio web application built with React, Tailwind CSS, Supabase, and PostgreSQL. This application includes a public-facing portfolio website and a complete admin dashboard for managing content.

## Features

### Public Pages
- **Home Page**: Hero section with profile picture, name, title, bio, and stats
- **About Page**: Detailed information about yourself with professional background
- **Skills Page**: Display skills organized by categories with proficiency levels and progress bars
- **Projects Page**: Showcase your projects with search, filtering by category, tech stack display, and links
- **Certificates Page**: Display certifications and achievements with credential links
- **Contact Page**: Contact form that saves messages to the database

### Admin Dashboard
- **Authentication**: Secure login with Supabase Auth
- **Profile Management**: Update your profile information and upload profile picture
- **Projects CRUD**: Create, read, update, and delete projects with image uploads
- **Skills CRUD**: Manage skills with categories and proficiency levels
- **Certificates CRUD**: Manage certifications and achievements
- **Messages Management**: View and manage contact form submissions

### Additional Features
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Fully responsive across all devices
- **File Storage**: Image uploads via Supabase Storage
- **Search & Filtering**: Advanced search and category filtering for projects
- **Real-time Updates**: Instant updates when managing content

## Tech Stack

- **Frontend**: React 18.3, TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Radix UI primitives
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: PostgreSQL (via Supabase KV Store)
- **File Storage**: Supabase Storage
- **Authentication**: Supabase Auth

## Getting Started

### 1. Create Admin Account

First, create an admin account by making a POST request to the signup endpoint:

\`\`\`bash
curl -X POST https://[your-project-id].supabase.co/functions/v1/make-server-931ae6ba/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "name": "Admin Name"
  }'
\`\`\`

### 2. Seed Sample Data (Optional)

To populate the database with sample data, make a POST request:

\`\`\`bash
curl -X POST https://[your-project-id].supabase.co/functions/v1/make-server-931ae6ba/seed-data
\`\`\`

This will create:
- Sample profile information
- 10 skills across 4 categories
- 4 sample projects
- 3 sample certificates

### 3. Login to Admin Dashboard

1. Navigate to `/login` in your application
2. Use the credentials you created in step 1
3. You'll be redirected to the admin dashboard at `/admin`

### 4. Customize Your Portfolio

From the admin dashboard, you can:

1. **Update Profile** (`/admin/profile`):
   - Upload your profile picture
   - Update name, title, and bio
   - Add detailed "About Me" section

2. **Manage Projects** (`/admin/projects`):
   - Add your real projects
   - Upload project thumbnails
   - Add GitHub and live demo links
   - Organize by categories
   - Mark projects as featured

3. **Manage Skills** (`/admin/skills`):
   - Add your technical skills
   - Set proficiency levels (0-100%)
   - Organize by categories (Frontend, Backend, etc.)
   - Add emoji icons for visual appeal

4. **Manage Certificates** (`/admin/certificates`):
   - Add your certifications
   - Upload certificate images
   - Add credential URLs
   - Tag related skills

5. **View Messages** (`/admin/messages`):
   - Read contact form submissions
   - Mark messages as read
   - Reply via email
   - Delete messages

## Project Structure

\`\`\`
/src
├── /app
│   ├── /components          # Reusable UI components
│   │   ├── /ui              # Base UI components (Button, Card, etc.)
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   └── RootLayout.tsx   # App layout wrapper
│   ├── /contexts            # React contexts
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Dark/light mode
│   ├── /lib                 # Utilities
│   │   └── supabase.ts      # Supabase client config
│   ├── /pages               # Page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Certificates.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   └── /admin           # Admin pages
│   │       ├── Dashboard.tsx
│   │       ├── ProfileManagement.tsx
│   │       ├── ProjectsManagement.tsx
│   │       ├── SkillsManagement.tsx
│   │       ├── CertificatesManagement.tsx
│   │       └── MessagesManagement.tsx
│   ├── routes.ts            # React Router configuration
│   └── App.tsx              # Main app component
├── /styles                  # Global styles
└── /supabase
    └── /functions
        └── /server
            ├── index.tsx    # Backend API routes
            └── kv_store.tsx # Database utilities

\`\`\`

## API Endpoints

### Public Endpoints
- `GET /profile` - Get profile information
- `GET /skills` - Get all skills
- `GET /projects` - Get all projects
- `GET /certificates` - Get all certificates
- `POST /contact` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `GET /admin/stats` - Get dashboard statistics
- `PUT /admin/profile` - Update profile
- `POST /admin/projects` - Create project
- `PUT /admin/projects/:id` - Update project
- `DELETE /admin/projects/:id` - Delete project
- `POST /admin/skills` - Create skill
- `PUT /admin/skills/:id` - Update skill
- `DELETE /admin/skills/:id` - Delete skill
- `POST /admin/certificates` - Create certificate
- `PUT /admin/certificates/:id` - Update certificate
- `DELETE /admin/certificates/:id` - Delete certificate
- `GET /admin/messages` - Get all messages
- `PUT /admin/messages/:id/read` - Mark message as read
- `DELETE /admin/messages/:id` - Delete message
- `POST /admin/upload` - Upload file

### Utility Endpoints
- `POST /signup` - Create admin account
- `POST /seed-data` - Populate with sample data

## Database Schema

The application uses Supabase's KV (Key-Value) store with the following prefixes:

- `profile` - Profile information (single object)
- `skill:*` - Skills (multiple objects)
- `project:*` - Projects (multiple objects)
- `certificate:*` - Certificates (multiple objects)
- `message:*` - Contact messages (multiple objects)

### Data Models

**Profile**
\`\`\`typescript
{
  name: string;
  title: string;
  bio: string;
  aboutMe?: string;
  profileImage?: string;
}
\`\`\`

**Skill**
\`\`\`typescript
{
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  icon?: string;
}
\`\`\`

**Project**
\`\`\`typescript
{
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}
\`\`\`

**Certificate**
\`\`\`typescript
{
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image?: string;
  credentialUrl?: string;
  skills?: string[];
}
\`\`\`

**Message**
\`\`\`typescript
{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}
\`\`\`

## Customization Tips

1. **Colors**: Modify the color scheme in `/src/styles/theme.css`
2. **Fonts**: Update font imports in `/src/styles/fonts.css`
3. **Stats**: Update the stats on the homepage in `/src/app/pages/Home.tsx`
4. **Social Links**: Update social media links in `/src/app/components/Footer.tsx`
5. **Contact Info**: Update contact information in `/src/app/pages/Contact.tsx`

## Best Practices

- Always use the admin dashboard to manage content
- Upload high-quality images for projects and certificates
- Keep project descriptions concise and clear
- Use consistent category names for better organization
- Regularly backup your data
- Update skills and certifications as you learn

## Security Notes

- Admin credentials are managed by Supabase Auth
- All admin routes require authentication
- File uploads are stored in private Supabase Storage buckets
- Access tokens are validated on every admin request
- Passwords are hashed and never stored in plain text

## Support

For issues or questions, please check the code comments or review the component documentation.

## License

This portfolio application is provided as-is for personal and commercial use.
