

import React from 'react';
import { motion } from 'framer-motion';

import { FaUsers, FaLock, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';



const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.2,
    },
  },
};


const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};



const TeamCard = ({ name, role, isYou = false }) => (
  <motion.div 
    variants={itemVariants}
    
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="bg-surface p-4 sm:p-6 rounded-lg border border-border text-center shadow-soft cursor-pointer"
  >
    <img 
      src={`https:
      className="w-24 h-24 rounded-full mx-auto mb-4 bg-secondary border-2 border-primary"
      alt={`${name}'s avatar`}
    />
    <h4 className="text-lg font-semibold text-text">{name}</h4>
    <p className={isYou ? "text-active" : "text-subtext"}>{role}</p>
  </motion.div>
);



function AboutPage() {
  return (
    <motion.main
      className="flex-grow flex flex-col items-center text-center px-4 sm:px-6 py-8 sm:py-16"
      
    >

      {}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-gradient-primary pb-1"
      >
        About eVakeel
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-lg md:text-xl text-subtext text-center max-w-2xl mb-12 sm:mb-16 px-4"
      >
        Democratizing legal knowledge for every citizen of India through the power of artificial intelligence.
      </motion.p>

      {}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl mb-12 sm:mb-16"
      >
        {}
        <motion.div
          variants={itemVariants}
          
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-surface border border-border rounded-xl p-6 md:p-8 flex-1 text-left cursor-pointer"
        >
          <FaLock className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-text">The Challenge</h3>
          <p className="text-subtext">
            Millions in India lack access to clear, reliable, and affordable legal guidance. Complex jargon, high consultation costs, and a general lack of awareness create a significant barrier to justice.
          </p>
        </motion.div>
        
        {}
        <motion.div
          variants={itemVariants}
          
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-surface border border-border rounded-xl p-8 flex-1 text-left cursor-pointer"
        >
          <FaLightbulb className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-text">Our Solution</h3>
          <p className="text-subtext">
            eVakeel is an AI-powered legal companion that translates complex law into simple, actionable advice. It provides instant answers to legal questions and analyzes documents to highlight key clauses and potential risks.
          </p>
        </motion.div>
      </motion.div>

      {}
      <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">Meet the Team</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mb-12 sm:mb-16"
      >
        {}
        <TeamCard name="Vansh Tambi" role="Frontend & UI/UX" isYou={true} />
        <TeamCard name="Prakhar Dvedi" role="Backend & Gen AI" />
        <TeamCard name="Mayank Verma" role="Backend & Database" />
        <TeamCard name="Raghav Upadhyay" role="Gen AI & Deployment" />
      </motion.div>

      {}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="bg-surface border border-error/50 rounded-xl p-6 sm:p-8 max-w-3xl"
      >
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <FaExclamationTriangle className="w-12 h-12 text-error mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-semibold text-error mb-2">Important Disclaimer</h3>
            <p className="text-subtext">
              eVakeel is an AI-powered informational tool developed for the MUJhackX hackathon. It does **not** provide certified legal advice. The information provided is for educational purposes only. For all legal matters, please consult a qualified human lawyer.
            </p>
          </div>
        </div>
      </motion.div>

    </motion.main>
  );
}

export default AboutPage;