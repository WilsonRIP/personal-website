"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialLinks } from "@/app/data/socials";
import Image from "next/image";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      // In a real application, you would handle the form submission here
      // For example, sending data to a server or API
      console.log("Form submitted:", formData);
      setFormStatus("success");

      // Reset form after successful submission
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
    }, 1500);
  };

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
            Get In Touch
          </h1>
          <p className="text-lg max-w-2xl mx-auto dark:text-gray-300 text-gray-700">
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
            <div className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6 text-teal-500">
                Contact Info
              </h2>

              <div className="space-y-4">
                <p className="dark:text-gray-300 text-gray-700">
                  I&apos;m always interested in hearing about new projects and
                  opportunities. Feel free to reach out through any of these
                  channels:
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
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
                      <p className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Email
                      </p>
                      <p className="dark:text-gray-300 text-gray-700">
                        contact@example.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/30">
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
                      <p className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Location
                      </p>
                      <p className="dark:text-gray-300 text-gray-700">
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-300 text-gray-700">
                  Connect with me
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-gray-700/50 bg-gray-200/50 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-all duration-300"
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
            <div className="rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/70 bg-white/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6 text-teal-500">
                Send a Message
              </h2>

              {formStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-6"
                >
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Thanks for your message! I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : formStatus === "error" ? (
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-6">
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
                      className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2"
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
                      className="w-full px-4 py-3 rounded-lg dark:bg-gray-700/50 bg-white border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2"
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
                      className="w-full px-4 py-3 rounded-lg dark:bg-gray-700/50 bg-white border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 rounded-lg dark:bg-gray-700/50 bg-white border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg dark:bg-gray-700/50 bg-white border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white resize-none"
                    placeholder="I'd like to discuss a potential project..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70"
                  >
                    {formStatus === "submitting" ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
