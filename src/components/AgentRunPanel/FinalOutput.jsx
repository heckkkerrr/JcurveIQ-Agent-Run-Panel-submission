import React, { useState } from 'react';

export default function FinalOutput({ output }) {
  const [citationsOpen, setCitationsOpen] = useState(false);
  
  if (!output) return null;

  const { summary, citations, quality_score } = output;

  const getScoreColor = (score) => {
    if (score > 0.8) return 'bg-green-500';
    if (score > 0.6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="mx-6 mt-6 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden animate-[slideIn_0.3s_ease-out]">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {quality_score !== undefined && (
        <div className="h-2 w-full bg-gray-100 flex">
          <div
            className={`h-full ${getScoreColor(quality_score)} [width:var(--score-width)]`}
            style={{ '--score-width': `${quality_score * 100}%` }}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Final Analysis</span>
          </h2>
          {quality_score !== undefined && (
             <span className="text-sm font-semibold text-gray-600 border px-3 py-1 rounded-full bg-gray-50">
               Quality Score: <span className={quality_score > 0.8 ? 'text-green-600' : quality_score > 0.6 ? 'text-amber-600' : 'text-red-600'}>{(quality_score * 100).toFixed(0)}%</span>
             </span>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-gray-800">
          <p className="text-base leading-relaxed">{summary}</p>
        </div>

        {citations && citations.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              onClick={() => setCitationsOpen(!citationsOpen)}
              aria-expanded={citationsOpen}
              aria-controls="final-output-citations"
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <svg className={`w-4 h-4 transform transition-transform ${citationsOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{citations.length} Citation{citations.length !== 1 ? 's' : ''}</span>
            </button>

            <div
              id="final-output-citations"
              className={`grid transition-all duration-300 ease-in-out ${citationsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <ul className="mt-3 space-y-2 pl-6 list-disc text-sm text-gray-600">
                  {citations.map((cite, idx) => (
                    <li key={idx} className="leading-snug">{cite}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
