"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Wifi,
  Server,
  Clock
} from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Enhanced error logging with more context
    console.error("Application Error:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown"
    });

    // You could also send to external error reporting service here
    // Example: Sentry.captureException(error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsRetrying(false);
    reset();
  };

  const getErrorIcon = () => {
    const message = error.message?.toLowerCase() || "";
    
    if (message.includes("network") || message.includes("fetch")) {
      return <Wifi className="h-12 w-12" />;
    } else if (message.includes("server") || message.includes("500")) {
      return <Server className="h-12 w-12" />;
    } else if (message.includes("timeout")) {
      return <Clock className="h-12 w-12" />;
    }
    
    return <AlertTriangle className="h-12 w-12" />;
  };

  const getErrorTitle = () => {
    const message = error.message?.toLowerCase() || "";
    
    if (message.includes("network") || message.includes("fetch")) {
      return "Connection Problem";
    } else if (message.includes("server") || message.includes("500")) {
      return "Server Error";
    } else if (message.includes("timeout")) {
      return "Request Timeout";
    }
    
    return "Something Went Wrong";
  };

  const getErrorDescription = () => {
    const message = error.message?.toLowerCase() || "";
    
    if (message.includes("network") || message.includes("fetch")) {
      return "We're having trouble connecting to our servers. Please check your internet connection and try again.";
    } else if (message.includes("server") || message.includes("500")) {
      return "Our servers are experiencing some issues. Our team has been notified and is working on a fix.";
    } else if (message.includes("timeout")) {
      return "The request is taking longer than expected. This might be due to high traffic or server load.";
    }
    
    return "We encountered an unexpected error while loading your projects. Don't worry, this has been reported to our team.";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      {/* Animated background blobs */}
      <div className="absolute top-20 -left-10 w-64 h-64 bg-gradient-to-r from-red-400/10 to-orange-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 -right-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center p-6 lg:p-8">
        <motion.div
          className="w-full max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Error Icon with Animation */}
          <motion.div
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="text-red-500 dark:text-red-400">
                  {getErrorIcon()}
                </div>
              </motion.div>
              
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          {/* Error Content */}
          <motion.div
            className="text-center space-y-6"
            variants={itemVariants}
          >
            {/* Title */}
            <motion.h1
              className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-slate-900 dark:from-white dark:via-red-200 dark:to-white bg-clip-text text-transparent"
              variants={itemVariants}
            >
              {getErrorTitle()}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto"
              variants={itemVariants}
            >
              {getErrorDescription()}
            </motion.p>

            {/* Error Details (Collapsible) */}
            {process.env.NODE_ENV === "development" && (
              <motion.details
                className="mt-6 p-4 bg-red-50/80 dark:bg-red-950/20 backdrop-blur-sm rounded-xl border border-red-200/50 dark:border-red-800/50 text-left max-w-lg mx-auto"
                variants={itemVariants}
              >
                <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors">
                  <Bug className="inline h-4 w-4 mr-2" />
                  Technical Details (Development)
                </summary>
                <div className="mt-3 space-y-2 text-xs font-mono">
                  <div className="text-red-600 dark:text-red-400">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div className="text-red-600 dark:text-red-400">
                      <strong>Digest:</strong> {error.digest}
                    </div>
                  )}
                  {retryCount > 0 && (
                    <div className="text-orange-600 dark:text-orange-400">
                      <strong>Retry attempts:</strong> {retryCount}
                    </div>
                  )}
                </div>
              </motion.details>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 border-0 min-w-[140px]"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="px-8 py-3 font-semibold rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[140px]"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </motion.div>
          </motion.div>

          {/* Helpful Tips */}
          <motion.div
            className="mt-12 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 max-w-lg mx-auto"
            variants={itemVariants}
          >
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              What you can try:
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2 flex-shrink-0"></span>
                Check your internet connection
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2 flex-shrink-0"></span>
                Refresh the page or try again in a few moments
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2 flex-shrink-0"></span>
                Contact support if the problem persists
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}