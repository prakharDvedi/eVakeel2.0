

import React from 'react';

function PricingPage() {
  const tiers = [
    {
      name: 'Free Access',
      price: '₹0',
      period: '/month',
      description: 'Perfect for getting started with basic legal insights.',
      features: [
        'Chat-based AI Legal Advisor → Up to 20 messages per month',
        'Document Analyzer → 3 free uploads for basic insights',
        'Legal Health Score → Score visible, but action links and completion steps locked'
      ],
      buttonText: 'Get Started',
      buttonClass: 'bg-active text-white hover:opacity-90'
    },
    {
      name: 'Pro Tier',
      price: '₹499',
      period: '/month',
      description: 'Ideal for individuals, students, and small businesses.',
      features: [
        'Increased limits: 100 messages, 10 document analyses',
        'Full Legal Health access',
        'Priority support',
        'Advanced document insights'
      ],
      buttonText: 'Upgrade to Pro',
      buttonClass: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
    },
    {
      name: 'Premium / Institutional Tier',
      price: '₹1999',
      period: '/month',
      description: 'Designed for law firms, NGOs, startups, and universities.',
      features: [
        'Unlimited access to chat, document processing',
        'Full educational/legal resources',
        'Verified advocate consultations',
        'API integrations',
        'Custom solutions',
        'Dedicated account manager'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'bg-gradient-to-r from-gold-500 to-orange-600 text-white hover:opacity-90'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg md:text-xl text-subtext max-w-2xl mx-auto px-4">
          Select the perfect tier for your legal needs. All plans include our core AI-powered legal assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-surface border border-border rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-text mb-2">{tier.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl md:text-4xl font-bold text-active">{tier.price}</span>
                <span className="text-subtext ml-1">{tier.period}</span>
              </div>
              <p className="text-subtext mt-2 text-sm md:text-base">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <svg className="w-5 h-5 text-active mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-text">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 px-6 rounded-lg font-medium transition-opacity text-sm md:text-base ${tier.buttonClass}`}>
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 md:mt-16">
        <p className="text-subtext text-sm md:text-base px-4">
          All prices are in Indian Rupees (INR). Need a custom plan?{' '}
          <a href="mailto:contact@evakeel.com" className="text-active hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

export default PricingPage;