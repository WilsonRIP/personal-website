import { Variants } from 'framer-motion';

export const ANIMATION_CONFIG = {
  heroDuration: 0.8,
  cardDuration: 0.5,
  featuredDelay: 0.3,
  staggerChildren: 0.2,
};

export const heroVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_CONFIG.heroDuration, ease: 'easeOut' },
  },
};

export const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: ANIMATION_CONFIG.featuredDelay,
      staggerChildren: ANIMATION_CONFIG.staggerChildren,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: ANIMATION_CONFIG.cardDuration, ease: 'easeOut' },
  },
};
