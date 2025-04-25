"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialLinks } from "@/app/data/socials";
import Image from "next/image";
import { EMAIL } from "@/lib/types";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Replace this URL with your actual API endpoint or third-party service URL
    const endpoint = "/api/contact"; // Example using a Next.js API route

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Successfully submitted
        console.log("Form submitted successfully");
        setFormStatus("success");
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        // Reset status after a few seconds
        setTimeout(() => {
          setFormStatus("idle");
        }, 5000);
      } else {
        // Handle server errors or invalid responses
        console.error("Form submission failed:", response.statusText);
        setFormStatus("error");
      }
    } catch (error) {
      // Handle network errors
      console.error("An error occurred during form submission:", error);
      setFormStatus("error");
    } finally {
      // Optional: Add any cleanup logic here, though setting status handles UI
      // If not success/error, maybe reset to idle?
      // Current logic resets to idle only after success timer.
      // If an error occurs, it stays in 'error' state until next attempt.
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 bg-gradient-to-br from-background via-blue-900/10 to-teal-900/20 dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-900/10">
      <div className="w-full max-w-5xl space-y-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg lg:text-xl text-theme-secondary mb-6">
            Have a question or want to work together? Feel free to contact me.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            className="md:col-span-1"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="rounded-xl overflow-hidden shadow-lg bg-theme-card backdrop-blur-sm border border-theme p-6 h-full">
              {/* Notification that form is not working */}
              <div className="mb-6 p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Message Sending Currently Unavailable</h3>
                    <div className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      <p>The contact form functionality is currently under maintenance. Please use the email or social media links provided to get in touch.</p>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                Contact Info
              </h2>

              <div className="space-y-4">
                <p className="text-theme-secondary">
                  I&apos;m always interested in hearing about new projects and
                  opportunities. Feel free to reach out through any of these
                  channels:
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-secondary">
                        Email
                      </p>
                      <p className="text-theme-primary">{EMAIL}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500/10 dark:bg-teal-500/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-teal-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-secondary">
                        Location
                      </p>
                      <p className="text-theme-primary">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-theme-primary">
                  Connect with me
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                      title={social.name}
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="md:col-span-2"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="rounded-xl overflow-hidden shadow-lg bg-theme-card backdrop-blur-sm border border-theme p-6">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                Send a Message
              </h2>

              {formStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-4 rounded-lg mb-6"
                >
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Thanks for your message! I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : formStatus === "error" ? (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 rounded-lg mb-6">
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    Something went wrong. Please try again later.
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-theme-primary mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-2 rounded-lg border border-theme bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-theme-primary mb-2"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 rounded-lg border border-theme bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-theme-primary mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Regarding your project..."
                    className="w-full px-4 py-2 rounded-lg border border-theme bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-theme-primary mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message here..."
                    className="w-full px-4 py-2 rounded-lg border border-theme bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 backdrop-blur-sm"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="button"
                    disabled
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 opacity-50 cursor-not-allowed text-white shadow-md"
                  >
                    Message Sending Unavailable
                  </button>
                  <p className="text-xs text-center mt-2 text-amber-600 dark:text-amber-400">Please use the contact information on the left instead</p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
