"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { socialLinks } from "@/app/data/socials";
import Image from "next/image";
import { EMAIL } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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



// Types
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

// Simple loading skeleton
const ContactSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-6 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
      
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, []);

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

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

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

  const contactInfo = useMemo(() => [
    {
      icon: Mail,
      label: "Email",
      value: EMAIL,
      action: () => copyToClipboard(EMAIL),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "United States",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: Globe,
      label: "Available",
      value: "Open to opportunities",
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50 dark:bg-violet-950/20",
    }
  ], [copyToClipboard]);

  if (!mounted) {
    return <ContactSkeleton />;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <motion.header 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Let&apos;s Connect
              </div>

              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Get In Touch
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Ready to bring your ideas to life? Whether you have a project in mind, want to collaborate, or just want to say hello - I&apos;m here to help!
                <span className="block mt-2 text-lg text-muted-foreground">
                  Let&apos;s turn your vision into reality together! 🚀
                </span>
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24h</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                <div className="text-muted-foreground">Reply Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">N/A★</div>
                <div className="text-muted-foreground">Client Rating</div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Contact Info Card */}
              <div className="bg-card border rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                      Contact Info
                    </h2>
                  </div>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    I&apos;m passionate about creating exceptional digital experiences and love connecting with fellow developers, creators, and innovators. 
                    Drop me a line through any of these channels - I&apos;d love to hear from you!
                  </p>

                  <div className="space-y-4">
                    {contactInfo.map((info, index) => {
                      const IconComponent = info.icon;
                      return (
                        <motion.div
                          key={info.label}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-lg transition-all duration-300",
                            "bg-muted/50 border",
                            info.action ? "cursor-pointer hover:shadow-md" : ""
                          )}
                          onClick={info.action}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={info.action ? { scale: 1.02 } : {}}
                          whileTap={info.action ? { scale: 0.98 } : {}}
                        >
                          <div className={cn(
                            "p-3 rounded-lg shadow-sm",
                            info.bgColor
                          )}>
                            <IconComponent className={`h-5 w-5 ${info.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              {info.label}
                            </p>
                            <p className="font-semibold text-foreground">
                              {info.value}
                              {info.action && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (click to copy)
                                </span>
                              )}
                            </p>
                          </div>
                          {info.action && (
                            <div className="p-2">
                              {copied ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
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
              <div className="bg-card border rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/20">
                      <Heart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      Let&apos;s stay connected
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-lg bg-muted/50 border hover:shadow-md transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
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
                          <p className="text-sm font-medium text-foreground truncate">
                            {social.name}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-card border rounded-lg shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Send a Message
                  </h2>
                </div>

                {/* Form Status Messages */}
                {formStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-800/50">
                        <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                          Message sent successfully! 🎉
                        </p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-300">
                          I&apos;ll get back to you within 24 hours with next steps and ideas!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-700/50"
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
                          Please try again or reach out directly via email - I&apos;m here to help!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <User className="h-4 w-4" />
                        Your Name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}

                        placeholder="John Doe"
                        className={cn(
                          "h-12 text-base",
                          errors.name && "border-destructive focus-visible:ring-destructive/20"
                        )}
                        aria-invalid={!!errors.name}
                      />
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
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Mail className="h-4 w-4" />
                        Your Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}

                        placeholder="you@example.com"
                        className={cn(
                          "h-12 text-base",
                          errors.email && "border-destructive focus-visible:ring-destructive/20"
                        )}
                        aria-invalid={!!errors.email}
                      />
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
                    <label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Star className="h-4 w-4" />
                      Subject
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}

                      placeholder="What can I help you build today?"
                      className={cn(
                        "h-12 text-base",
                        errors.subject && "border-destructive focus-visible:ring-destructive/20"
                      )}
                      aria-invalid={!!errors.subject}
                    />
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
                    <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}

                      placeholder="Share your vision, ask questions, or just introduce yourself! I&apos;m excited to learn about your project and see how we can work together to create something incredible..."
                      className={cn(
                        "resize-none",
                        errors.message && "border-destructive focus-visible:ring-destructive/20"
                      )}
                      aria-invalid={!!errors.message}
                    />
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
                  <Button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        Sending your message...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                        <span>✨</span>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}