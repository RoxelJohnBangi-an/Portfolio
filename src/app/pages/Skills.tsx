import React, { useEffect, useState } from 'react';
import { Progress } from '../components/ui/progress';
import { API_URL, publicAnonKey } from '../lib/supabase';
import { motion } from 'motion/react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

const techStackRow1 = [
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Vue', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg' },
  { name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' },
  { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  { name: 'Svelte', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
];

const techStackRow2 = [
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Spring', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/skills`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Skills
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and expertise across various technologies and tools.
          </p>
        </motion.div>

        {/* Marquee Animation Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24 space-y-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4">
            Technologies & Tools
          </h2>
          
          {/* Row 1: Right Moving */}
          <div className="relative flex overflow-hidden group bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl py-8">
            <div className="flex animate-marquee-reverse whitespace-nowrap group-hover:[animation-play-state:paused]">
              {[...techStackRow1, ...techStackRow1].map((tech, index) => (
                <div
                  key={index}
                  className="mx-4 flex items-center space-x-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-8 py-4 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer min-w-[200px]"
                >
                  <img src={tech.icon} alt={tech.name} className="w-8 h-8 object-contain" />
                  <span className="font-bold text-gray-700 dark:text-gray-200">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Left Moving */}
          <div className="relative flex overflow-hidden group bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl py-8">
            <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
              {[...techStackRow2, ...techStackRow2].map((tech, index) => (
                <div
                  key={index}
                  className="mx-4 flex items-center space-x-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-8 py-4 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer min-w-[200px]"
                >
                  <img src={tech.icon} alt={tech.name} className="w-8 h-8 object-contain" />
                  <span className="font-bold text-gray-700 dark:text-gray-200">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skill Summary */}
        {skills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{Object.keys(groupedSkills).length}</div>
                <div className="text-blue-100">Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{skills.length}</div>
                <div className="text-blue-100">Total Skills</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)}%
                </div>
                <div className="text-blue-100">Avg Proficiency</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {skills.filter(s => s.level >= 80).length}
                </div>
                <div className="text-blue-100">Expert Level</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
