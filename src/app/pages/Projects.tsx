import React, { useEffect, useState } from 'react';
import { Github, ExternalLink, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API_URL, publicAnonKey } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
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

// Add this array above the Projects() function
const staticProjects: Project[] = [
  {
    id: 'nexgen-landing-2026',
    title: 'NexGen',
    description: 'The all-in-one platform to manage your team, track analytics, and build products users love. Designed for modern software teams.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Web App',
    image: '/GenX.png',
    liveUrl: 'https://nextgen101.netlify.app',   
    githubUrl: 'https://github.com/RoxelJohnBangi-an/NextGen.git', 
    featured: true,
  },
  {
    id: 'apex-landing-2026',
    title: 'Apex',
    description: 'A secure vault for your sensitive information, built with modern web technologies.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'API Integration'],
    category: 'Web App',
    image: '/SecureVault.png',
    liveUrl: 'https://secure-vault-gilt.vercel.app/',   
    githubUrl: 'https://github.com/RoxelJohnBangi-an/SecureVault.git', 
    featured: true,
  },
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedCategory, projects]);

const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      const apiIds = new Set(data.map((p: Project) => p.id));
      const merged = [
        ...data,
        ...staticProjects.filter((p) => !apiIds.has(p.id)), 
      ];
      setProjects(merged);
      if (merged.length > 0) {
        const uniqueCategories = Array.from(new Set(merged.map((p: Project) => p.category))) as string[];
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      }
      setFilteredProjects(merged);
    } else {
      setProjects(staticProjects);       
      setFilteredProjects(staticProjects);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    setProjects(staticProjects);         
    setFilteredProjects(staticProjects);
  } finally {
    setLoading(false);
  }
};

  const filterProjects = () => {
    let filtered = projects;

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  };

  const categories = Array.from(new Set(projects.map(p => p.category)));

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of projects I've worked on, showcasing my skills and experience.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full"
                >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                      {project.title.charAt(0)}
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
     ) : null}
      </div>
    </div>
  );
}
