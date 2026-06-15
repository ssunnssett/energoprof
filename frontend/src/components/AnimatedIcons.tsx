import { motion } from 'framer-motion';

// Custom Animated SVG: Generator Core
export const GeneratorCoreSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <motion.circle 
      cx="50" cy="50" r="45" 
      stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    <motion.circle 
      cx="50" cy="50" r="30" 
      stroke="currentColor" strokeWidth="4"
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      className="text-primary"
    />
    <motion.path 
      d="M50 20 L50 80 M20 50 L80 50 M28 28 L72 72 M28 72 L72 28" 
      stroke="currentColor" strokeWidth="2"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "50px 50px" }}
      className="text-accent"
    />
  </svg>
);

// Custom Animated SVG: Energy Bolt Burst
export const EnergyBoltSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <motion.path 
      d="M55 10 L35 50 L50 50 L45 90 L65 50 L50 50 Z" 
      fill="currentColor"
      initial={{ opacity: 0.5, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1.1, filter: "drop-shadow(0px 0px 10px rgba(249,115,22,0.8))" }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      className="text-accent"
    />
    <motion.circle
      cx="50" cy="50" r="40"
      stroke="currentColor" strokeWidth="1" strokeDasharray="10 10"
      initial={{ rotate: 0 }}
      animate={{ rotate: -360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "50px 50px" }}
      className="text-primary"
    />
  </svg>
);

