import React, { useState } from 'react';

const CONTENT_ID = 'thought-bubble-content';

export default function ThoughtBubble({ thoughts }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={CONTENT_ID}
        className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center space-x-1"
      >
        <svg className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>{isOpen ? 'Hide agent thoughts' : 'Show agent thoughts'}</span>
      </button>

      <div
        id={CONTENT_ID}
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm font-mono text-gray-700 space-y-2">
            {thoughts.map((t, idx) => (
              <div key={idx} className="flex space-x-2">
                <span className="text-yellow-600 opacity-70 select-none">→</span>
                <span>{t.thought}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
