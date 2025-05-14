import React from 'react';
import { motion } from 'framer-motion';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="w-12 h-12 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};