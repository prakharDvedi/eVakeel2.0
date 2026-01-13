import React from "react";
import { motion } from "framer-motion";

export const EmptyChatView = ({ onPromptClick }) => {
  const prompts = [
    "What are my rights if I'm stopped by the police?",
    "Explain this clause in my rent agreement...",
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img src="/logo.png" alt="eVakeel Logo" className="h-16 mb-4" />
      <h1 className="text-4xl font-bold text-text mb-2">Hi, I'm eVakeel</h1>
      <p className="text-lg text-subtext">
        How can I help with your legal questions today?
      </p>

      <div className="flex gap-4 mt-8">
        {prompts.map((prompt, index) => (
          <motion.div
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="bg-surface p-4 rounded-lg border border-border w-48 text-left cursor-pointer transition-colors hover:border-active"
            whileHover={{ y: -5 }}
          >
            <p className="text-sm text-text font-medium">{prompt}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
