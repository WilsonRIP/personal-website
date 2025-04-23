'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { WEBSITE_NAME } from '@/lib/types';
import { useTheme } from '@/lib/ThemeContext';
import LazyLoad from '@/lib/LazyLoad';
import OptimizedImage from '../components/OptimizedImage';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const { theme } = useTheme();
  
  // Skills array - customize as needed
  const skills = [
    { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'HTML/CSS'] },
    { category: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'Express'] },
    { category: 'Tools', items: ['Git', 'Docker', 'VS Code', 'GitHub Actions'] },
    { category: 'Design', items: ['Figma', 'Responsive Design', 'UI/UX', 'Tailwind CSS'] },
  ];
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-theme-gradient">
      <div className="w-full max-w-5xl space-y-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">
            About Me
          </h1>
          <p className="text-lg max-w-2xl mx-auto dark:text-gray-300 text-gray-700">
            Developer. Creator. Tech enthusiast.
          </p>
        </motion.div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile section */}
          <motion.div 
            className="md:col-span-1"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="sticky top-24 rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
              <div className="aspect-square overflow-hidden relative">
                <OptimizedImage 
                  src="/cat.png" 
                  alt="Profile" 
                  className="object-cover w-full h-full"
                  style={{ objectPosition: 'center top' }}
                  objectFit="cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.src = "https://via.placeholder.com/400?text=Profile";
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-teal-500">Wilson</h2>
                <p className="text-sm dark:text-gray-300 text-gray-700 mb-4">
                  Software Developer based in the United States with a passion for creating intuitive and engaging web experiences.
                </p>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <span className="w-24 font-medium dark:text-gray-400 text-gray-500">Location:</span>
                    <span className="dark:text-gray-300 text-gray-700">United States</span>
                  </p>
                  <p className="flex items-center text-sm">
                    <span className="w-24 font-medium dark:text-gray-400 text-gray-500">Experience:</span>
                    <span className="dark:text-gray-300 text-gray-700">Less than a year</span>
                  </p>
                  <p className="flex items-center text-sm">
                    <span className="w-24 font-medium dark:text-gray-400 text-gray-500">Focus:</span>
                    <span className="dark:text-gray-300 text-gray-700">Web Development, UX/UI</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Bio section */}
          <motion.div 
            className="md:col-span-2 space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <LazyLoad>
              <motion.div 
                className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6"
                variants={fadeIn}
              >
                <h2 className="text-2xl font-bold mb-4 text-teal-500">My Journey</h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    Hello! I'm a passionate software developer with a strong focus on building 
                    intuitive and performant web applications. My journey in technology began
                    when I first discovered the joy of solving problems through code.
                  </p>
                  <p>
                    Over the years, I've worked on a variety of projects ranging from small business
                    websites to complex web applications. I'm particularly interested in the
                    intersection of technology and user experience, always striving to create
                    products that are not only functional but also delightful to use.
                  </p>
                  <p>
                    When I'm not coding, you can find me exploring new technologies, contributing to
                    open-source projects, or sharing my knowledge through tutorials and blog posts.
                  </p>
                </div>
              </motion.div>
            </LazyLoad>
            
            <LazyLoad>
              <motion.div 
                className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6"
                variants={fadeIn}
              >
                <h2 className="text-2xl font-bold mb-6 text-teal-500">Skills & Expertise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-3 dark:text-gray-300 text-gray-700">
                        {skillGroup.category}
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {skillGroup.items.map((skill, skillIndex) => (
                          <li key={skillIndex} className="text-gray-600 dark:text-gray-400">{skill}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </LazyLoad>
            
            <LazyLoad>
              <motion.div 
                className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6"
                variants={fadeIn}
              >
                <h2 className="text-2xl font-bold mb-6 text-teal-500">Experience & Education</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      Senior Developer
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Tech Company Inc. | 2021 - Present
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Led development of web applications, mentored junior developers, 
                      and implemented modern development workflows.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      Web Developer
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Digital Agency | 2018 - 2021
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Built responsive websites and applications for clients across various industries
                      using React, Node.js, and other modern technologies.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">
                      B.S. Computer Science
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      University Tech Institute | 2014 - 2018
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Focused on software engineering, algorithms, and web technologies.
                      Graduated with honors.
                    </p>
                  </div>
                </div>
              </motion.div>
            </LazyLoad>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
