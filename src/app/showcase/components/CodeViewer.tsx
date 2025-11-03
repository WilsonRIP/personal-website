"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

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
          throw new Error(
            `Failed to fetch code: ${response.status} ${response.statusText}`
          );
        }
        const text = await response.text();
        setCode(text);
      } catch (err: unknown) {
        console.error("Error fetching component code:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCode();
  }, [componentId]);

  const copyToClipboard = useCallback(() => {
    if (!code || isCopied) return;
    navigator.clipboard
      .writeText(code)
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
      <div className="relative bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border bg-muted">
          <span className="text-xs text-muted-foreground font-medium">
            {componentId}.tsx
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={copyToClipboard}
            disabled={isLoading || !!error || isCopied}
            className={`transition-colors duration-150 ease-in-out h-7 px-2 text-xs rounded
              ${
                isCopied
                  ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }
              ${isLoading || !!error ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="max-h-80 overflow-auto p-4 bg-card">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-4">
              Loading code...
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-4">
              Error loading code: {error}
            </div>
          ) : code ? (
            <pre className="whitespace-pre-wrap overflow-auto font-mono text-xs sm:text-sm text-foreground p-1">
              <code>{code.trim()}</code>
            </pre>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No code available for this component.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
