"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socialLinks } from "@/app/data/socials";
import Image from "next/image";
import { EMAIL } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Mail,
  MapPin,
  Send,
  Copy,
  Check,
  User,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Globe,
  Star,
  Heart,
  Zap
} from "lucide-react";
import { useTheme } from "next-themes";

// Enhanced types
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, delay: 0.2 }
  }
};

// Enhanced loading skeleton
const ContactSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div className="container mx-auto px-6 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);
  const [copyPosition, setCopyPosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Use a single effect for mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the loading state
  const loadingState = useMemo(() => {
    if (!mounted) {
      return (
        <main className={
          resolvedTheme === "dark"
            ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
        }>
          <ContactSkeleton />
        </main>
      );
    }
    return null;
  }, [mounted, resolvedTheme]);

  // Memoize the copyToClipboard function to prevent recreation on each render
  const copyToClipboard = useCallback(async (text: string, event?: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Capture mouse position for the copy effect
      if (event) {
        setCopyPosition({ x: event.clientX, y: event.clientY });
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Could not copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (event) {
        setCopyPosition({ x: event.clientX, y: event.clientY });
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, []);

  // Memoize the handleChange function
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // Memoize the validateForm function
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Enhanced validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoize the handleSubmit function
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  }, [formData, validateForm]);

  // Memoize contact info to prevent recreation on each render
  const contactInfo = useMemo(() => [
    {
      icon: Mail,
      label: "Email",
      value: EMAIL,
      action: (event?: React.MouseEvent) => copyToClipboard(EMAIL, event),
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "United States",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Globe,
      label: "Available",
      value: "Open to opportunities",
      gradient: "from-purple-500 to-pink-600"
    }
  ], [copyToClipboard]);

  if (!mounted) {
    return loadingState;
  }

  return (
    <main className={
      resolvedTheme === "dark"
        ? "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
    }>
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      {/* Animated background blobs - memoized with CSS animations instead of JS animations */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob will-change-transform"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 will-change-transform"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-green-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 will-change-transform"></div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Header */}
          <motion.header className="text-center space-y-6" variants={itemVariants}>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Let&apos;s Connect
              </div>

              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent leading-tight"
                style={{ fontFamily: "KOMIKAX, sans-serif" }}
              >
                Get In Touch
              </h1>

              <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Have a question or want to work together? I&apos;d love to hear from you.
                <span className="block mt-2 text-lg text-slate-500 dark:text-slate-400">
                  Let&apos;s create something amazing together! ✨
                </span>
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24h</div>
                <div className="text-slate-500 dark:text-slate-400">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                <div className="text-slate-500 dark:text-slate-400">Reply Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">N/A★</div>
                <div className="text-slate-500 dark:text-slate-400">Client Rating</div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
              {/* Contact Info Card */}
              <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                      Contact Info
                    </h2>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    I&apos;m always excited to discuss new projects and opportunities. 
                    Feel free to reach out through any of these channels!
                  </p>

                  <div className="space-y-4">
                    {contactInfo.map((info, index) => {
                      const IconComponent = info.icon;
                      return (
                        <motion.div
                          key={info.label}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                            "bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm",
                            "border border-slate-200/50 dark:border-slate-600/50",
                            info.action ? "cursor-pointer hover:scale-105 hover:shadow-lg" : ""
                          )}
                          onClick={info.action}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={info.action ? { scale: 1.02 } : {}}
                          whileTap={info.action ? { scale: 0.98 } : {}}
                        >
                          <div className={cn(
                            "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                            info.gradient
                          )}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {info.label}
                            </p>
                            <p className={cn(
                              "font-semibold text-slate-900 dark:text-white transition-colors duration-200",
                              info.action && "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            )}>
                              {info.value}
                              {info.action && (
                                <span className="ml-2 text-xs text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                                  (click to copy)
                                </span>
                              )}
                            </p>
                          </div>
                          {info.action && (
                            <div className="p-2">
                              {copied && info.action === (() => copyToClipboard(EMAIL)) ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Connect with me
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="relative">
                          <Image
                            src={social.icon}
                            alt={social.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {social.name}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              variants={formVariants}
            >
              <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-8">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <Send className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                      Send a Message
                    </h2>
                  </div>

                  {/* Form Status Messages */}
                  <AnimatePresence>
                    {formStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-800/50">
                            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-800 dark:text-green-200">
                              Message sent successfully! 🎉
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-300">
                              I&apos;ll get back to you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-red-100 dark:bg-red-800/50">
                            <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-red-800 dark:text-red-200">
                              Oops! Something went wrong
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-300">
                              Please try again or contact me directly via email.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <User className="h-4 w-4" />
                          Your Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="John Doe"
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
                              "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                              "focus:outline-none focus:ring-2 focus:ring-offset-2",
                              errors.name
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : focusedField === "name"
                                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                : "border-slate-200 dark:border-slate-600"
                            )}
                          />
                          {focusedField === "name" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            </motion.div>
                          )}
                        </div>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 dark:text-red-400"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <Mail className="h-4 w-4" />
                          Your Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="you@example.com"
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
                              "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                              "focus:outline-none focus:ring-2 focus:ring-offset-2",
                              errors.email
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : focusedField === "email"
                                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                : "border-slate-200 dark:border-slate-600"
                            )}
                          />
                          {focusedField === "email" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            </motion.div>
                          )}
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 dark:text-red-400"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Star className="h-4 w-4" />
                        Subject
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Let&apos;s discuss your amazing project..."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
                            "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            errors.subject
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : focusedField === "subject"
                              ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                              : "border-slate-200 dark:border-slate-600"
                          )}
                        />
                        {focusedField === "subject" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          </motion.div>
                        )}
                      </div>
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.subject}
                        </motion.p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Tell me about your project, ideas, or just say hello! I&apos;d love to hear from you..."
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none",
                            "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2",
                            errors.message
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : focusedField === "message"
                              ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                              : "border-slate-200 dark:border-slate-600"
                          )}
                        />
                        {focusedField === "message" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          </motion.div>
                        )}
                      </div>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className={cn(
                        "w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300",
                        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                        "text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40",
                        "border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      )}
                      whileHover={{ scale: formStatus === "submitting" ? 1 : 1.02 }}
                      whileTap={{ scale: formStatus === "submitting" ? 1 : 0.98 }}
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending your message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            ✨
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Copy Success Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: copyPosition.x - 75, // Center the notification
              top: copyPosition.y - 60,  // Position above the cursor
            }}
          >
            <div className="relative">
              {/* Main notification */}
              <div className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-green-400/50 flex items-center gap-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
                <span className="text-sm font-semibold">Email copied!</span>
              </div>
              
              {/* Floating particles effect */}
              {Array.from({length: 6}).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  initial={{ 
                    opacity: 1, 
                    scale: 1,
                    x: 0, 
                    y: 0 
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 0,
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 60
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 20}%`,
                    top: `${50 + (Math.random() - 0.5) * 20}%`,
                  }}
                />
              ))}
              
              {/* Success ripple effect */}
              <motion.div
                className="absolute inset-0 border-2 border-green-400 rounded-xl"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}