import React from "react";
import { motion } from "framer-motion";
import { parseMarkdown } from "../utils/markdown";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export const BotMessage = ({ text }) => {
  const htmlContent = parseMarkdown(text);

  return (
    <motion.div
      className="bg-surface text-text p-4 rounded-lg max-w-lg shadow-soft prose prose-invert prose-headings:text-text prose-p:text-text prose-strong:text-text prose-code:text-text max-w-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
