import React, { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const IconPlaceholder = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-secondary text-text min-h-screen flex flex-col font-sans overflow-x-hidden relative">
      {/* animated bg watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, -20, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          opacity: { duration: 1, delay: 0.5, ease: "easeOut" },
          y: {
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          },
          scale: {
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          },
        }}
        className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <img
          src="/img2.png"
          alt="Background watermark"
          className="w-2/3 md:w-1/2 h-auto opacity-5 object-contain"
        />
      </motion.div>

      {/* content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* navbar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-surface/80 border-b border-border sticky top-0 backdrop-blur-sm z-50"
        >
          <nav className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" onClick={closeMenu}>
                <img
                  src="/logo.png"
                  alt="eVakeel Logo"
                  className="h-8 w-auto"
                />
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className="font-medium text-subtext hover:text-text transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="font-medium text-subtext hover:text-text transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/pricing"
                  className="font-medium text-subtext hover:text-text transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="/features"
                  className="font-medium text-subtext hover:text-text transition-colors"
                >
                  Features
                </Link>
              </div>

              <button
                onClick={toggleMenu}
                className="md:hidden text-text hover:text-active transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>

            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 pb-4 border-t border-border pt-4"
              >
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/about"
                    onClick={closeMenu}
                    className="font-medium text-subtext hover:text-text transition-colors py-2"
                  >
                    About
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={closeMenu}
                    className="font-medium text-subtext hover:text-text transition-colors py-2"
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/features"
                    onClick={closeMenu}
                    className="font-medium text-subtext hover:text-text transition-colors py-2"
                  >
                    Features
                  </Link>
                </div>
              </motion.div>
            )}
          </nav>
        </motion.header>

        <Outlet />

        {/* footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="container mx-auto px-6 py-8 text-center text-subtext text-xs">
            <p className="font-semibold text-error mb-2 text-sm">DISCLAIMER</p>
            <p className="max-w-3xl mx-auto">
              eVakeel is an AI-powered informational tool and does not provide
              certified legal advice...
            </p>
            <p className="mt-6 text-sm">
              &copy; 2025 eVakeel Team. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export { IconPlaceholder };
export default Layout;
