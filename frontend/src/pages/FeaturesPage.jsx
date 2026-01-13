

import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaFileAlt, FaShieldAlt, FaGavel, FaMobileAlt, FaLock, FaClock, FaUsers } from 'react-icons/fa';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
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

function FeaturesPage() {
  const features = [
    {
      icon: <FaRobot className="w-8 h-8 text-primary" />,
      title: "AI-Powered Legal Advisor",
      description: "Get instant answers to your legal questions through our advanced AI chatbot. Ask about contracts, rights, procedures, and legal processes in simple language.",
      details: [
        "24/7 availability for legal queries",
        "Natural language processing for easy communication",
        "Context-aware responses based on Indian law",
        "Step-by-step guidance for legal procedures"
      ]
    },
    {
      icon: <FaFileAlt className="w-8 h-8 text-primary" />,
      title: "Document Analysis & Parsing",
      description: "Upload legal documents, contracts, or agreements and get AI-powered analysis with simplified summaries and key clause identification.",
      details: [
        "Support for PDF and image formats",
        "Automated text extraction and analysis",
        "Risk assessment and warning highlights",
        "Simplified legal language explanations"
      ]
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-primary" />,
      title: "Legal Health Score",
      description: "Track your legal compliance with a comprehensive checklist covering essential documents and legal requirements for Indian citizens.",
      details: [
        "12-point legal compliance checklist",
        "Interactive step-by-step guidance",
        "Progress tracking with visual indicators",
        "Priority-based task recommendations"
      ]
    },
    {
      icon: <FaGavel className="w-8 h-8 text-primary" />,
      title: "Comprehensive Legal Coverage",
      description: "From basic document verification to complex legal procedures, eVakeel covers all aspects of personal legal compliance in India.",
      details: [
        "Aadhaar and PAN card linking guidance",
        "Bank account KYC procedures",
        "Voter ID and DigiLocker setup",
        "Tax filing and property tax information"
      ]
    },
    {
      icon: <FaMobileAlt className="w-8 h-8 text-primary" />,
      title: "Mobile-First Design",
      description: "Fully responsive design that works seamlessly across all devices - desktop, tablet, and mobile phones.",
      details: [
        "Responsive layout for all screen sizes",
        "Touch-friendly interface elements",
        "Optimized performance on mobile networks",
        "Hamburger menu for mobile navigation"
      ]
    },
    {
      icon: <FaLock className="w-8 h-8 text-primary" />,
      title: "Privacy & Security",
      description: "Your legal queries and documents are handled with the highest standards of privacy and security.",
      details: [
        "No personal data storage without consent",
        "Secure document upload and processing",
        "GDPR compliant data handling",
        "End-to-end encryption for sensitive information"
      ]
    },
    {
      icon: <FaClock className="w-8 h-8 text-primary" />,
      title: "Real-Time Assistance",
      description: "Get immediate responses to your legal questions without waiting for appointments or office hours.",
      details: [
        "Instant AI responses to queries",
        "Real-time document analysis",
        "Immediate legal health score updates",
        "Quick access to government portal links"
      ]
    },
    {
      icon: <FaUsers className="w-8 h-8 text-primary" />,
      title: "User-Friendly Interface",
      description: "Intuitive design that makes complex legal information accessible to everyone, regardless of technical expertise.",
      details: [
        "Clean, modern interface design",
        "Step-by-step guided processes",
        "Visual progress indicators",
        "Multilingual support preparation"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
          Powerful Features for Legal Empowerment
        </h1>
        <p className="text-lg md:text-xl text-subtext max-w-3xl mx-auto">
          Discover how eVakeel combines cutting-edge AI technology with comprehensive legal knowledge
          to make law accessible to every Indian citizen.
        </p>
      </motion.div>

      {}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-soft hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-subtext mb-4 text-sm md:text-base">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <svg className="w-4 h-4 text-active mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-text">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12 md:mt-16"
      >
        <div className="bg-gradient-to-r from-active/10 to-primary/10 rounded-xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
            Ready to Experience Legal Empowerment?
          </h2>
          <p className="text-subtext mb-6 max-w-2xl mx-auto">
            Join thousands of users who have simplified their legal journey with eVakeel.
            Start your legal wellness check today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/advisor"
              className="bg-active text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Legal Advisor
            </a>
            <a
              href="/score"
              className="bg-surface text-text font-semibold py-3 px-8 rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              Check Legal Score
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FeaturesPage;