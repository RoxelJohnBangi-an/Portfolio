import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Bucket name for file storage
const BUCKET_NAME = 'make-931ae6ba-portfolio';

// Initialize storage bucket
async function initStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
      console.log('Storage bucket created:', BUCKET_NAME);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize on startup
initStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-931ae6ba/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth middleware
async function requireAuth(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Authorization header required while authenticating user' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401);
  }

  c.set('user', user);
  await next();
}

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// Get profile
app.get("/make-server-931ae6ba/profile", async (c) => {
  try {
    const profile = await kv.get('profile');
    if (!profile) {
      return c.json({
        name: 'Developer',
        title: 'Full Stack Developer',
        bio: 'Passionate about creating amazing web applications.',
      });
    }
    return c.json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get all skills
app.get("/make-server-931ae6ba/skills", async (c) => {
  try {
    const skills = await kv.getByPrefix('skill:');
    return c.json(skills);
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return c.json({ error: 'Failed to fetch skills' }, 500);
  }
});

// Get all projects
app.get("/make-server-931ae6ba/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix('project:');
    return c.json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Get all certificates
app.get("/make-server-931ae6ba/certificates", async (c) => {
  try {
    const certificates = await kv.getByPrefix('certificate:');
    return c.json(certificates);
  } catch (error: any) {
    console.error('Error fetching certificates:', error);
    return c.json({ error: 'Failed to fetch certificates' }, 500);
  }
});

// Submit contact form
app.post("/make-server-931ae6ba/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const id = crypto.randomUUID();
    const contactMessage = {
      id,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    await kv.set(`message:${id}`, contactMessage);
    return c.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    return c.json({ error: 'Failed to submit message' }, 500);
  }
});

// ============================================================================
// ADMIN ROUTES (Protected)
// ============================================================================

// Admin stats
app.get("/make-server-931ae6ba/admin/stats", requireAuth, async (c) => {
  try {
    const projects = await kv.getByPrefix('project:');
    const skills = await kv.getByPrefix('skill:');
    const certificates = await kv.getByPrefix('certificate:');
    const messages = await kv.getByPrefix('message:');
    const unreadMessages = messages.filter((m: any) => !m.read);

    return c.json({
      projects: projects.length,
      skills: skills.length,
      certificates: certificates.length,
      messages: unreadMessages.length,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Update profile
app.put("/make-server-931ae6ba/admin/profile", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('profile', body);
    return c.json({ success: true, message: 'Profile updated' });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// CRUD for Projects
app.post("/make-server-931ae6ba/admin/projects", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const project = { id, ...body };
    await kv.set(`project:${id}`, project);
    return c.json(project);
  } catch (error: any) {
    console.error('Error creating project:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

app.put("/make-server-931ae6ba/admin/projects/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const project = { id, ...body };
    await kv.set(`project:${id}`, project);
    return c.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

app.delete("/make-server-931ae6ba/admin/projects/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`project:${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// CRUD for Skills
app.post("/make-server-931ae6ba/admin/skills", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const skill = { id, ...body };
    await kv.set(`skill:${id}`, skill);
    return c.json(skill);
  } catch (error: any) {
    console.error('Error creating skill:', error);
    return c.json({ error: 'Failed to create skill' }, 500);
  }
});

app.put("/make-server-931ae6ba/admin/skills/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const skill = { id, ...body };
    await kv.set(`skill:${id}`, skill);
    return c.json(skill);
  } catch (error: any) {
    console.error('Error updating skill:', error);
    return c.json({ error: 'Failed to update skill' }, 500);
  }
});

app.delete("/make-server-931ae6ba/admin/skills/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`skill:${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    return c.json({ error: 'Failed to delete skill' }, 500);
  }
});

// CRUD for Certificates
app.post("/make-server-931ae6ba/admin/certificates", requireAuth, async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const certificate = { id, ...body };
    await kv.set(`certificate:${id}`, certificate);
    return c.json(certificate);
  } catch (error: any) {
    console.error('Error creating certificate:', error);
    return c.json({ error: 'Failed to create certificate' }, 500);
  }
});

app.put("/make-server-931ae6ba/admin/certificates/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const certificate = { id, ...body };
    await kv.set(`certificate:${id}`, certificate);
    return c.json(certificate);
  } catch (error: any) {
    console.error('Error updating certificate:', error);
    return c.json({ error: 'Failed to update certificate' }, 500);
  }
});

app.delete("/make-server-931ae6ba/admin/certificates/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`certificate:${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting certificate:', error);
    return c.json({ error: 'Failed to delete certificate' }, 500);
  }
});

// Messages management
app.get("/make-server-931ae6ba/admin/messages", requireAuth, async (c) => {
  try {
    const messages = await kv.getByPrefix('message:');
    return c.json(messages.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

app.put("/make-server-931ae6ba/admin/messages/:id/read", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const message = await kv.get(`message:${id}`);
    if (message) {
      message.read = true;
      await kv.set(`message:${id}`, message);
    }
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error marking message as read:', error);
    return c.json({ error: 'Failed to update message' }, 500);
  }
});

app.delete("/make-server-931ae6ba/admin/messages/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`message:${id}`);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return c.json({ error: 'Failed to delete message' }, 500);
  }
});

// File upload endpoint
app.post("/make-server-931ae6ba/admin/upload", requireAuth, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Error uploading file to Supabase Storage:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000);

    return c.json({ url: signedUrlData?.signedUrl });
  } catch (error: any) {
    console.error('Error in upload endpoint:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Signup endpoint (for creating admin account)
app.post("/make-server-931ae6ba/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error('Error in signup endpoint:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Seed sample data endpoint
app.post("/make-server-931ae6ba/seed-data", async (c) => {
  try {
    // Create sample profile
    await kv.set('profile', {
      name: 'Alex Johnson',
      title: 'Full Stack Developer',
      bio: 'Passionate about creating elegant solutions to complex problems. Specialized in modern web technologies and cloud architecture.',
      aboutMe: 'I am a full-stack developer with over 5 years of experience building scalable web applications. My expertise spans across frontend technologies like React and Vue, backend frameworks like Node.js and Django, and cloud platforms like AWS and Azure. I love learning new technologies and sharing knowledge with the developer community.',
      profileImage: '',
    });

    // Create sample skills
    const skills = [
      { name: 'React', category: 'Frontend Development', level: 95, icon: '⚛️' },
      { name: 'TypeScript', category: 'Frontend Development', level: 90, icon: '📘' },
      { name: 'Tailwind CSS', category: 'Frontend Development', level: 88, icon: '🎨' },
      { name: 'Node.js', category: 'Backend Development', level: 92, icon: '🟢' },
      { name: 'Python', category: 'Backend Development', level: 85, icon: '🐍' },
      { name: 'PostgreSQL', category: 'Backend Development', level: 87, icon: '🐘' },
      { name: 'AWS', category: 'DevOps & Cloud', level: 80, icon: '☁️' },
      { name: 'Docker', category: 'DevOps & Cloud', level: 83, icon: '🐳' },
      { name: 'Git', category: 'Tools & Others', level: 90, icon: '📦' },
      { name: 'Figma', category: 'Tools & Others', level: 75, icon: '🎯' },
    ];

    for (const skill of skills) {
      const id = crypto.randomUUID();
      await kv.set(`skill:${id}`, { id, ...skill });
    }

    // Create sample projects
    const projects = [
      {
        title: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform with payment integration, inventory management, and real-time analytics.',
        category: 'Web Development',
        techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: true,
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team collaboration features, and advanced filtering.',
        category: 'Web Development',
        techStack: ['Vue.js', 'Firebase', 'Tailwind CSS'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: false,
      },
      {
        title: 'AI Content Generator',
        description: 'An AI-powered content generation tool that helps marketers create engaging content using natural language processing.',
        category: 'AI/ML',
        techStack: ['Python', 'FastAPI', 'OpenAI', 'React'],
        githubUrl: 'https://github.com',
        featured: true,
      },
      {
        title: 'Mobile Fitness Tracker',
        description: 'Cross-platform mobile app for tracking workouts, nutrition, and fitness goals with social features.',
        category: 'Mobile Development',
        techStack: ['React Native', 'TypeScript', 'Supabase'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: false,
      },
    ];

    for (const project of projects) {
      const id = crypto.randomUUID();
      await kv.set(`project:${id}`, { id, ...project });
    }

    // Create sample certificates
    const certificates = [
      {
        title: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-06-15',
        description: 'Professional certification demonstrating expertise in designing distributed systems on AWS.',
        skills: ['AWS', 'Cloud Architecture', 'Security'],
        credentialUrl: 'https://aws.amazon.com/certification',
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta (Coursera)',
        date: '2023-03-20',
        description: 'Comprehensive program covering React, JavaScript, and modern frontend development practices.',
        skills: ['React', 'JavaScript', 'HTML/CSS'],
        credentialUrl: 'https://coursera.org',
      },
      {
        title: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        date: '2022-11-10',
        description: 'Certification validating skills in designing, building, and deploying applications on Google Cloud Platform.',
        skills: ['GCP', 'Kubernetes', 'Cloud Functions'],
        credentialUrl: 'https://cloud.google.com/certification',
      },
    ];

    for (const certificate of certificates) {
      const id = crypto.randomUUID();
      await kv.set(`certificate:${id}`, { id, ...certificate });
    }

    return c.json({ success: true, message: 'Sample data seeded successfully' });
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return c.json({ error: 'Failed to seed data' }, 500);
  }
});

Deno.serve(app.fetch);