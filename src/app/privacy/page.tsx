'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WEBSITE_NAME } from '@/lib/types';
import { Mulish } from 'next/font/google';
import Link from 'next/link';

const mulish = Mulish({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

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

export default function PrivacyPolicyPage() {
  return (
    <main className={`${mulish.className} flex min-h-screen flex-col items-center p-8 lg:p-24 bg-theme-gradient`}>
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg max-w-3xl mx-auto dark:text-gray-300 text-gray-700">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
        
        {/* Main content */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Introduction</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Thank you for visiting {WEBSITE_NAME}. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. 
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. 
                We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. 
                You are encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Information We Collect</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Personal Data</h3>
              <p>
                We may collect personal identification information from you in a variety of ways, including, but not limited to, when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Subscribe to our newsletter</li>
                <li>Fill out a contact form</li>
                <li>Submit project inquiries</li>
              </ul>
              <p>
                Depending on the activity, we may collect the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Messages or inquiries you submit</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 text-gray-700 dark:text-gray-300">Usage Data</h3>
              <p>
                We may also collect information about how you use our website, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referral sources</li>
                <li>Device information</li>
              </ul>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">How We Use Your Information</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may use the information we collect from you for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To send periodic emails (if you subscribe to our newsletter)</li>
                <li>To respond to your inquiries and support requests</li>
                <li>To improve our website and user experience</li>
                <li>To understand how visitors interact with our website</li>
              </ul>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                Cookies are files with a small amount of data that may include an anonymous unique identifier. 
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our site.
              </p>
              <p>
                The types of cookies we use:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
                <li><strong>Functionality cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
              </ul>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Third-Party Services</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may use third-party service providers to help us operate our website or administer activities on our behalf, such as sending out newsletters or analyzing how our website is used. 
                These third parties may have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
              <p>
                Third-party services we use may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Google Analytics (for website analytics)</li>
                <li>Email newsletter services</li>
                <li>Hosting providers</li>
              </ul>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Data Security</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. 
                However, we cannot guarantee that unauthorized third parties will never be able to defeat those measures or use your personal information for improper purposes.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Your Rights</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The right to access the personal information we have about you</li>
                <li>The right to request that we correct or update incorrect personal information</li>
                <li>The right to request that we delete your personal information</li>
                <li>The right to opt out of marketing communications</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided below.
              </p>
            </div>
          </motion.section>

          <motion.section variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Contact Information</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                If you have any questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p>Email: privacy@wilsonswebsite.com</p>
                <p>Or use our <Link href="/contact" className="text-blue-500 hover:text-blue-700 underline">contact form</Link>.</p>
              </div>
            </div>
          </motion.section>
        </motion.div>

        {/* Back to home */}
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <Link 
            href="/" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
} 