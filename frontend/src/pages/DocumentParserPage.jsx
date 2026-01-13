

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDocument, analyzeDocumentByPath } from '../services/api';
import { parseMarkdown } from '../utils/markdown';


const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http:
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V3m0 8l-3-3m3 3l3-3"></path>
  </svg>
);

const PdfIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http:
    <path d="M11.363 2c-1.658 0-3.001 1.343-3.001 3.001v2.12h-2.12c-1.018 0-1.842.825-1.842 1.842v10.074c0 1.018.825 1.842 1.842 1.842h12.118c1.018 0 1.842-.825 1.842-1.842v-10.074c0-1.018-.825-1.842-1.842-1.842h-2.12v-2.12c0-1.658-1.343-3.001-3-3.001h-2.241zm0 1.91h2.241c.599 0 1.091.492 1.091 1.091v2.12h-4.422v-2.12c0-.599.492-1.091 1.091-1.091z" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http:
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http:
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);


const LoadingIndicator = () => (
  <motion.div
    className="flex space-x-1 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.span 
      className="w-2 h-2 bg-subtext rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span 
      className="w-2 h-2 bg-subtext rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, delay: 0.1, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span 
      className="w-2 h-2 bg-subtext rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
);




function DocumentParserPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

  const handleFile = (file) => {
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      setResults(null); 
    } else if (file) {
      alert("Invalid file type. Please upload a PDF or an image.");
      setSelectedFile(null);
    }
  };

  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setResults(null);
    setError(null);
    
    try {
      console.log('[DocumentParserPage] Analyzing file:', selectedFile.name, selectedFile.type);
      
      
      const response = await analyzeDocument(selectedFile);
      
      
      if (response.full_analysis) {
        setResults(response.full_analysis);
      } else if (response.error) {
        throw new Error(response.error);
      } else {
        setResults('Analysis complete, but no detailed results were returned.');
      }
    } catch (err) {
      console.error('[DocumentParserPage] Error analyzing document:', err);
      setError(err.message || 'Failed to analyze document. Please try again.');
      
      
      setResults(`Error: ${err.message || 'Failed to analyze document. Please check if the backend is running and the file is valid.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-start text-text p-4 sm:p-6 pt-8 sm:pt-16">

      {}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-3xl sm:text-4xl font-bold mb-4 text-center"
      >
        Document Parser
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-base sm:text-lg text-subtext mb-6 sm:mb-8 max-w-lg text-center px-4"
      >
        Upload your legal document (PDF or image). The AI will analyze the text and provide a simplified summary.
      </motion.p>

      {}
      <div className="w-full max-w-2xl px-4 sm:px-0">
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            
            
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-48 sm:h-64 bg-surface border-2 border-dashed rounded-xl transition-colors
                          ${isDragOver ? 'border-active' : 'border-border'}`}
            >
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileChange}
                accept="application/pdf,image/*"
              />
              <UploadIcon className={`w-16 h-16 transition-colors ${isDragOver ? 'text-active' : 'text-primary'}`} />
              <p className="text-subtext mt-4">Drag & drop your file here, or</p>
              <label 
                htmlFor="fileUpload"
                className="mt-2 bg-active text-white font-medium px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Browse Files
              </label>
            </motion.div>

          ) : (
            
            
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-surface border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-soft gap-4 sm:gap-0"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                {selectedFile.type === 'application/pdf' ? (
                  <PdfIcon className="w-8 h-8 sm:w-10 sm:h-10 text-error flex-shrink-0" />
                ) : (
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-active flex-shrink-0" />
                )}
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-text font-medium truncate text-sm sm:text-base">{selectedFile.name}</span>
                  <span className="text-subtext text-xs sm:text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-subtext hover:text-error transition-colors p-1 rounded-full flex-shrink-0"
              >
                <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
            
          )}
        </AnimatePresence>

        {}
        {}
        {selectedFile && !results && (
          <div className="w-full mt-6">
            {isLoading ? (
              <motion.div 
                className="flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <LoadingIndicator />
                <p className="text-subtext ml-2">Analyzing document...</p>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={handleSubmit}
                disabled={!selectedFile}
                className="w-full bg-active text-white font-semibold py-3 rounded-lg text-base 
                           hover:opacity-90 transition-opacity
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Analyze Document
              </motion.button>
            )}
          </div>
        )}

        {}
        <AnimatePresence>
          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full bg-surface border border-border rounded-xl p-4 sm:p-6 mt-6 sm:mt-8 shadow-soft"
            >
              <h3 className="text-2xl font-semibold text-text mb-3 text-left">AI Analysis</h3>
              <div 
                className={`text-left ${error ? 'text-red-500' : 'text-subtext'}`}
                dangerouslySetInnerHTML={{ __html: error ? results : parseMarkdown(results) }}
              />
              {error && (
                <p className="text-xs text-red-500 mt-2">
                  {error}
                </p>
              )}
              <button
                onClick={() => { setSelectedFile(null); setResults(null); setError(null); }}
                className="w-full bg-active/20 text-active font-semibold py-3 rounded-lg mt-6 text-base hover:bg-active/40 transition-colors"
              >
                Analyze Another Document
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default DocumentParserPage;