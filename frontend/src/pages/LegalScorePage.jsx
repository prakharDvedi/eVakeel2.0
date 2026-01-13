

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";


const legalTasks = [
  {
    id: "aadhaar",
    name: "Aadhaar Card Linked & KYC Updated",
    description:
      "Ensure your mobile number is linked and your KYC is up-to-date.",
    link: "https:
    points: 20,
    steps: [
      "Visit the UIDAI website or use the mAadhaar app",
      "Log in with your Aadhaar number and OTP",
      'Go to the "Update Profile" section',
      "Link your mobile number if not already linked",
      "Update your address and other details if needed",
      "Complete biometric verification if required",
    ],
  },
  {
    id: "pan",
    name: "PAN Card Linked with Aadhaar",
    description:
      "As per government regulations, your PAN must be linked with Aadhaar.",
    link: "https:
    points: 20,
    steps: [
      "Visit the Income Tax e-Filing portal",
      "Log in with your PAN and password",
      'Navigate to "Profile Settings" > "Link Aadhaar"',
      "Enter your Aadhaar number",
      "Verify through OTP sent to linked mobile",
      "Confirm the linking process",
    ],
  },
  {
    id: "bankKyc",
    name: "Bank Account e-KYC Completed",
    description: "Verify that all your bank accounts are fully KYC compliant.",
    link: "https:
    points: 15,
    steps: [
      "Visit your bank's website or mobile app",
      "Log in to your internet banking",
      'Look for "KYC Update" or "Profile Update" section',
      "Upload required documents (Aadhaar, PAN, etc.)",
      "Complete video KYC if available",
      "Verify all bank accounts are KYC compliant",
    ],
  },
  {
    id: "voter",
    name: "Voter ID Card (EPIC) Issued",
    description:
      "Verify you are registered to vote and have a valid EPIC card.",
    link: "https:
    points: 15,
    steps: [
      "Visit the Election Commission website",
      "Search for your name in the electoral roll",
      "If not registered, apply for voter registration",
      "Download EPIC card if available online",
      "Visit your local election office for physical card",
      "Update details if address has changed",
    ],
  },
  {
    id: "digilocker",
    name: "DigiLocker Account Verified",
    description:
      "A secure government-issued digital wallet for your documents.",
    link: "https:
    points: 10,
    steps: [
      "Visit the DigiLocker website",
      "Sign up using your Aadhaar number",
      "Verify your mobile number and email",
      "Complete the authentication process",
      "Upload and store important documents",
      "Share documents with government agencies when needed",
    ],
  },
  {
    id: "itr",
    name: "Income Tax Return (ITR) Filed",
    description: "Filed your ITR for the last assessment year (if applicable).",
    link: "https:
    points: 10,
    steps: [
      "Gather all income documents and receipts",
      "Visit the Income Tax e-Filing portal",
      "Choose the appropriate ITR form based on income",
      "Fill in personal and income details",
      "Calculate tax liability and verify",
      "Submit the return and save acknowledgment",
    ],
  },
  {
    id: "drivingLicense",
    name: "Valid Driving License (Optional)",
    description: "Check if your driving license is active and not expired.",
    link: "https:
    points: 5,
    steps: [
      "Visit the Parivahan Sewa website",
      "Check license status using DL number",
      "Renew if expired (online or at RTO)",
      "Update address if changed",
      "Pay renewal fees online",
      "Download renewed license",
    ],
  },
  {
    id: "passport",
    name: "Valid Passport (Optional)",
    description:
      "Having a valid passport is key for international travel and identity.",
    link: "https:
    points: 5,
    steps: [
      "Visit the Passport Seva website",
      "Check passport status with application number",
      "Apply for reissue if expired",
      "Book appointment at Passport Seva Kendra",
      "Submit required documents",
      "Collect passport after processing",
    ],
  },
  {
    id: "propertyTax",
    name: "Property Tax Paid",
    description: "Ensure your property tax is paid and up-to-date.",
    link: "https:
    points: 10,
    steps: [
      "Check your local municipal corporation website",
      "Search for property tax payment portal",
      "Enter property details or assessment number",
      "View outstanding dues",
      "Make online payment through available methods",
      "Save payment receipt for records",
    ],
  },
  {
    id: "insurance",
    name: "Health Insurance Active",
    description: "Maintain active health insurance coverage.",
    link: "https:
    points: 8,
    steps: [
      "Review your current health insurance policy",
      "Check renewal date and premium amount",
      "Compare plans if renewal is due",
      "Renew policy before expiry",
      "Update beneficiary details if needed",
      "Keep policy documents accessible",
    ],
  },
  {
    id: "gst",
    name: "GST Registration (If Applicable)",
    description:
      "Register for GST if your business turnover exceeds threshold.",
    link: "https:
    points: 12,
    steps: [
      "Check if your business requires GST registration",
      "Visit GST portal and create account",
      "Fill Part A of registration form",
      "Upload required documents",
      "Verify application status",
      "Complete Part B after approval",
    ],
  },
  {
    id: "providentFund",
    name: "EPF Account Active",
    description: "Maintain active Employee Provident Fund account.",
    link: "https:
    points: 8,
    steps: [
      "Visit EPFO website or use UMANG app",
      "Log in with UAN number",
      "Check account balance and status",
      "Update KYC if required",
      "Verify employer contributions",
      "Plan for retirement benefits",
    ],
  },
];


const totalMaxPoints = legalTasks.reduce((sum, task) => sum + task.points, 0);


function LegalScorePage() {
  
  const [checkedState, setCheckedState] = useState(
    new Array(legalTasks.length).fill(false)
  );

  
  const [expandedTasks, setExpandedTasks] = useState(
    new Array(legalTasks.length).fill(false)
  );

  const [score, setScore] = useState(0);

  
  useEffect(() => {
    const newScore = checkedState.reduce((currentScore, isChecked, index) => {
      if (isChecked) {
        return currentScore + legalTasks[index].points;
      }
      return currentScore;
    }, 0);
    setScore(newScore);
  }, [checkedState]);

  
  const handleCheckboxChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  
  const handleToggleExpand = (position) => {
    const updatedExpandedState = expandedTasks.map((item, index) =>
      index === position ? !item : item
    );
    setExpandedTasks(updatedExpandedState);
  };

  const scorePercentage = (score / totalMaxPoints) * 100;

  return (
    <div className="grow flex flex-col items-center justify-start text-text p-4 sm:p-6 pt-8 sm:pt-12">
      {}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-gradient-primary pb-3 text-center"
      >
        Check Your Legal Score
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-lg text-subtext text-center max-w-lg px-4"
      >
        See how legally "up-to-date" you are. Verify your documents using the
        links, then check the box.
      </motion.p>

      {}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-lg bg-surface border border-border rounded-xl p-4 sm:p-6 my-6 sm:my-8 shadow-soft"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
          <span className="text-base sm:text-lg font-medium text-text">
            Your Legal Score:
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-active">
            {Math.trunc(scorePercentage)}%
          </span>
        </div>

        {}
        <div className="w-full bg-secondary rounded-full h-3">
          <motion.div
            className="bg-active h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${scorePercentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </motion.div>

      {}
      <motion.div
        className="w-full max-w-lg space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {legalTasks.map((task, index) => (
          <div
            key={task.id}
            className="bg-surface border border-border rounded-xl shadow-soft overflow-hidden"
          >
            {}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
              {}
              <div className="flex items-start flex-grow">
                <input
                  type="checkbox"
                  id={task.id}
                  name={task.name}
                  value={task.id}
                  checked={checkedState[index]}
                  onChange={() => handleCheckboxChange(index)}
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded text-active bg-secondary border-border focus:ring-active mt-1"
                />

                {}
                <div className="ml-3 sm:ml-4 flex-grow">
                  <label
                    htmlFor={task.id}
                    className="text-base sm:text-lg font-semibold text-text cursor-pointer"
                  >
                    {task.name}
                  </label>
                  <p className="text-sm text-subtext mt-1">
                    {task.description}
                  </p>
                </div>
              </div>

              {}
              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 ml-8 sm:ml-0">
                <span className="text-xs sm:text-sm font-medium text-active bg-active/10 px-2 py-1 rounded">
                  +{task.points} pts
                </span>

                {}
                <button
                  onClick={() => handleToggleExpand(index)}
                  className="text-subtext hover:text-active transition-colors p-1"
                  title={expandedTasks[index] ? "Hide steps" : "Show steps"}
                >
                  {expandedTasks[index] ? (
                    <FaChevronUp className="w-4 h-4" />
                  ) : (
                    <FaChevronDown className="w-4 h-4" />
                  )}
                </button>

                {}
                <a
                  href={task.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Verify on official site"
                  className="text-subtext hover:text-active transition-colors p-1"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                </a>
              </div>
            </div>

            {}
            {expandedTasks[index] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border bg-secondary/30"
              >
                <div className="p-4 sm:p-5">
                  <h4 className="text-sm sm:text-md font-semibold text-text mb-3">
                    Step-by-Step Guide:
                  </h4>
                  <ol className="space-y-2">
                    {task.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-active text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm text-text">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default LegalScorePage;
