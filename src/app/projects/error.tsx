'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400 text-center max-w-md">
        {error.message || "We couldn't load the projects. Please try again later."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Try again
      </button>
    </div>
  );
}
