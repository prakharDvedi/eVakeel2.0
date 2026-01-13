import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { EmptyChatView } from "../components/EmptyChatView";
import { sendChatMessage } from "../services/api";
import { parseMarkdown } from "../utils/markdown";

const SendIcon = ({ className }) => (
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
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

const LoadingIndicator = () => (
  <motion.div
    className="flex justify-start p-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <motion.div
      className="w-8 h-8 p-1"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <img src="/img2.png" alt="Loading..." className="w-full h-full" />
    </motion.div>
  </motion.div>
);

function LegalAdvisorPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendQuery = async (query) => {
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const allMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      allMessages.push({
        role: "user",
        content: query,
      });

      const response = await sendChatMessage({
        messages: allMessages,
        sessionId: sessionId,
        jurisdiction: "india",
        domain: null,
      });

      if (response.status === "ok" && response.data) {
        if (response.data.sessionId) {
          setSessionId(response.data.sessionId);
        }

        const answerText = response.data.answer || "No response received";
        const botResponse = {
          sender: "bot",
          text: answerText,
          html: parseMarkdown(answerText),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        throw new Error(response.error || "Unknown error");
      }
    } catch (err) {
      console.error("[LegalAdvisorPage] Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");

      const errorMessage = {
        sender: "bot",
        text: `Error: ${
          err.message ||
          "Failed to get response from server. Please check if the backend is running."
        }`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendQuery(input);
    setInput("");
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    sendQuery(prompt);
    setInput("");
  };

  const inputVariants = {
    idle: { width: "100%" },
    focused: { width: "100%" },
  };

  return (
    <div className="flex-grow items-center flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar w-full max-w-4xl">
        {messages.length === 0 ? (
          <EmptyChatView onPromptClick={handlePromptClick} />
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "user" ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-active text-white p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg shadow-soft break-words"
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface text-text p-3 rounded-lg max-w-xs sm:max-w-md md:max-w-lg shadow-soft break-words prose prose-invert prose-headings:text-text prose-p:text-text prose-strong:text-text max-w-none"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.html || parseMarkdown(msg.text),
                    }}
                    className="whitespace-pre-wrap"
                  />
                </motion.div>
              )}
            </div>
          ))
        )}

        <AnimatePresence>{isLoading && <LoadingIndicator />}</AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center p-4">
        <motion.form
          onSubmit={handleSubmit}
          className="flex items-center p-3 bg-surface rounded-xl border border-border shadow-soft w-full"
          variants={inputVariants}
          animate={isFocused ? "focused" : "idle"}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            className="flex-grow bg-transparent text-text placeholder-subtext outline-none resize-none mx-2 custom-scrollbar"
            placeholder="Ask me any legal question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            className="bg-active text-white w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </motion.form>
        <p className="text-xs text-subtext mt-2">
          Your input will be sent to our AI model for analysis. Please do not
          share sensitive personal information.
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}

export default LegalAdvisorPage;
