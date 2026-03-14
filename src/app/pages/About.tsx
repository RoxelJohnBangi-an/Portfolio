import React, { useEffect, useState } from 'react';
import { Code, Briefcase, GraduationCap, Award } from 'lucide-react';
import { API_URL, publicAnonKey } from '../lib/supabase';
import { motion } from 'motion/react';

interface Profile {
  name: string;
  title: string;
  bio: string;
  aboutMe?: string;
  experience?: string;
  education?: string;
  profileImage?: string;
}

export function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set default profile data if fetch fails
      setProfile({
        name: 'Roxel John Bangian',
        title: 'Full Stack Developer',
        bio: 'Passionate about creating beautiful and functional web applications. Specialized in modern web technologies and clean code practices.',
        aboutMe: 'Passionate developer with expertise in building modern web applications. I love solving complex problems and creating intuitive user experiences.',
        profileImage: '/profile_pic.png'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

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
            About Me
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <div className="w-full max-w-md">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-8xl font-bold shadow-2xl">
                  {profile?.name?.charAt(0) || 'D'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profile?.name || 'Roxel John Bangian'}
            </h2>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">
              {profile?.title || 'Full Stack Developer'}
            </p>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {profile?.aboutMe || profile?.bio || 'Passionate developer with expertise in building modern web applications. I love solving complex problems and creating intuitive user experiences.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              {[
                { icon: Code, title: 'Clean Code', desc: 'Best practices' },
                { icon: Briefcase, title: 'Experience', desc: '3+ years' },
                { icon: GraduationCap, title: 'Education', desc: 'IT' },
                { icon: Award, title: 'Certified', desc: 'Few certs' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* What I Do */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            What I Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: 'Web Development', color: 'bg-blue-600', desc: 'Building responsive and performant web applications using modern technologies.' },
              { icon: Briefcase, title: 'UI/UX Design', color: 'bg-purple-600', desc: 'Creating beautiful and intuitive user interfaces with great user experience.' },
              { icon: GraduationCap, title: 'Consulting', color: 'bg-green-600', desc: 'Providing technical guidance and best practices for development teams.' }
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
