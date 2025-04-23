'use client';

import { Mulish } from 'next/font/google';
import { useState, useEffect } from 'react';
import { socialLinks, SocialLink } from '../data/socials';
import { WEBSITE_NAME } from '@/lib/types';

const mulish = Mulish({
  weight: '400',
  subsets: ['latin'],
});

interface FooterProps {
  backgroundImage?: string;
  backgroundOverlay?: string;
}

export default function Footer({
  backgroundImage = '/blank-sand.jpg',
  backgroundOverlay = 'bg-gray-800/90',
}: FooterProps) {
  const [imageLoaded, setImageLoaded] = useState(!backgroundImage);

  // Preload via the DOM Image constructor
  useEffect(() => {
    if (!backgroundImage) return;
    const img = new globalThis.Image();         // ← use globalThis.Image
    img.src = backgroundImage;
    img.onload = () => setImageLoaded(true);
  }, [backgroundImage]);

  return (
    <footer className={`${mulish.className} relative text-white py-4 mt-8`}>
      {/* Background - Using className-based styling approach to avoid hydration errors */}
      {backgroundImage && (
        <div
          className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-500 bg-cover bg-center bg-no-repeat ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url("${backgroundImage}")`,
          }}
        />
      )}
      {backgroundImage && (
        <div className={`absolute inset-0 w-full h-full z-1 ${backgroundOverlay}`} />
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gray-800 z-0" />
      )}

      {/* Content */}
      <div className="container mx-auto text-center relative z-10 md:text-left lg:px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Copy */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <p className="text-lg font-bold mb-2 inline-block">
              {WEBSITE_NAME}
            </p>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {WEBSITE_NAME}
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            {socialLinks.map((social: SocialLink) => (
              <a
                key={social.name}
                href={social.url}
                aria-label={social.name}
                className="relative group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 overflow-hidden relative">
                  {/* Render the actual icon */}
                  <img
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  {/* Ripple effect */}
                  <span className="absolute inset-0 rounded-full bg-white/30 scale-0 opacity-0 animate-ripple pointer-events-none"></span>
                </div>

                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ripple keyframes */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </footer>
  );
}
