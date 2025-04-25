"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialLinks } from "@/app/data/socials";
import Image from "next/image";
import { EMAIL } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
          <p className="text-lg lg:text-xl text-muted-foreground mb-6">
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
            <div className="rounded-xl overflow-hidden shadow-lg bg-card/50 dark:bg-card/50 backdrop-blur-sm border p-6 h-full">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
                Contact Info
              </h2>

              <div className="space-y-4">
                <p className="text-muted-foreground">
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
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="text-foreground">{EMAIL}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">
                        Location
                      </p>
                      <p className="text-foreground">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Connect with me
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/30 dark:bg-secondary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300"
                      title={social.name}
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 filter dark:invert"
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
            <div className="rounded-xl overflow-hidden shadow-lg bg-card/50 dark:bg-card/50 backdrop-blur-sm border p-6">
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
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Your Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-background/70 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Your Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Regarding your project..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Your message here..."
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-70"
                  >
                    {formStatus === "submitting"
                      ? "Sending..."
                      : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
