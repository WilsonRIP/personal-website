"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { socialLinks } from "@/app/data/socials";
import Image from "next/image";
import { EMAIL } from "@/lib/types";
import FancyHeading from "@/app/components/FancyHeading";
import FancyCard from "@/app/components/FancyCard";
import FancyButton from "@/app/components/FancyButton";
import PageContainer from "@/app/components/PageContainer";

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

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors for this field when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    } = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setFormStatus("submitting");

    // API endpoint for contact form
    const endpoint = "/api/contact";

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
        // Reset status after 5 seconds
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
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <PageContainer className="space-y-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 title-komikax" 
            style={{ fontFamily: "KOMIKAX, sans-serif" }}
          >
            Get In Touch
          </h1>
          <p className="text-lg lg:text-xl text-foreground/80 mb-6">
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
            <FancyCard withAnimation="fade" className="h-full">
              <FancyHeading
                as="h2"
                variant="stylish"
                className="mb-6 text-foreground bg-clip-text bg-gradient-to-r from-primary to-accent font-kg-happy"
              >
                Contact Info
              </FancyHeading>

              <div className="space-y-4">
                <p 
                  className="text-lg text-blue-400 font-comic"
                  style={{ 
                    fontFamily: "Hey_Comic, sans-serif",
                    fontSize: "1.25rem",
                    letterSpacing: "0.03em",
                    lineHeight: "1.5"
                  }}
                >
                  I&apos;m always interested in hearing about new projects and
                  opportunities. Feel free to reach out through any of these
                  channels:
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3 hover-lift">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/80">
                        Email
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-foreground">{EMAIL}</p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(EMAIL)}
                          className="relative p-1 rounded-md hover:bg-secondary/50 transition-colors duration-200"
                          aria-label="Copy email address"
                        >
                          {copied ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          )}
                          <span
                            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded bg-black text-white ${
                              copied ? "opacity-100" : "opacity-0"
                            } transition-opacity duration-200`}
                          >
                            {copied ? "Copied!" : "Copy"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 hover-lift">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent/10 dark:bg-accent/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent"
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
                      <p className="text-sm font-medium text-foreground/80">
                        Location
                      </p>
                      <p className="text-foreground">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Connect with me
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary hover:bg-secondary/80 hover-lift transition-all duration-300"
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
            </FancyCard>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="md:col-span-2"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <FancyCard withAnimation="slide" className="backdrop-blur-sm">
              <FancyHeading
                as="h2"
                variant="stylish"
                className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
              >
                Send a Message
              </FancyHeading>

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
                    Something went wrong. Please try again later or contact me
                    directly via email.
                  </p>
                </div>
              ) : null}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-theme-primary mb-2 font-comic"
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
                      className={`w-full px-4 py-2 rounded-lg border font-comic ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500"
                          : "border-theme focus:ring-primary"
                      } bg-theme-card text-theme-primary focus:outline-none focus:ring-2 transition-colors duration-200 backdrop-blur-sm`}
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-theme-primary mb-2 font-comic"
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
                      className={`w-full px-4 py-2 rounded-lg border font-comic ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-theme focus:ring-primary"
                      } bg-theme-card text-theme-primary focus:outline-none focus:ring-2 transition-colors duration-200 backdrop-blur-sm`}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-theme-primary mb-2 font-comic"
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
                    className={`w-full px-4 py-2 rounded-lg border font-comic ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-500"
                        : "border-theme focus:ring-primary"
                    } bg-theme-card text-theme-primary focus:outline-none focus:ring-2 transition-colors duration-200 backdrop-blur-sm`}
                    aria-invalid={errors.subject ? "true" : "false"}
                    aria-describedby={
                      errors.subject ? "subject-error" : undefined
                    }
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-red-500">
                      {errors.subject}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-theme-primary mb-2 font-comic"
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
                    className={`w-full px-4 py-2 rounded-lg border font-comic ${
                      errors.message
                        ? "border-red-500 focus:ring-red-500"
                        : "border-theme focus:ring-primary"
                    } bg-theme-card text-theme-primary focus:outline-none focus:ring-2 transition-colors duration-200 backdrop-blur-sm`}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  ></textarea>
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div>
                  <FancyButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={formStatus === "submitting"}
                    className="w-full relative font-comic"
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
                        Sending Message...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </FancyButton>
                </div>
              </form>
            </FancyCard>
          </motion.div>
        </div>
      </PageContainer>
    </main>
  );
}
