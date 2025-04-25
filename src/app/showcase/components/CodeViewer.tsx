"use client";

import React, { useState, useEffect, useCallback } from "react";

interface CodeViewerProps {
  componentId: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ componentId }) => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchCode = async () => {
      try {
        const response = await fetch(`/api/showcase/code/${componentId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch code: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setCode(text);
      } catch (err: unknown) {
        console.error("Error fetching component code:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCode();
  }, [componentId]);

  const copyToClipboard = useCallback(() => {
    if (!code || isCopied) return;
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        alert("Failed to copy code to clipboard");
      });
  }, [code, isCopied]);

  return (
    <div className="mt-6 w-full max-w-full text-sm">
      <div className="relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{componentId}.tsx</span>
          <button
            onClick={copyToClipboard}
            disabled={isLoading || !!error || isCopied}
            className={`px-3 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out
              ${isCopied ? "bg-green-500 text-white" : "bg-teal-500 hover:bg-teal-600 text-white"}
              ${(isLoading || !!error) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="max-h-80 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Loading code...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 dark:text-red-400 py-4">
              Error loading code: {error}
            </div>
          ) : code ? (
            <pre className="whitespace-pre-wrap overflow-auto font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 p-1">
              <code>{code.trim()}</code>
            </pre>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No code available for this component.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;