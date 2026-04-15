import React, { useState } from 'react';

const CONTENT_ID = 'tool-call-log-content';

export default function ToolCallLog({ toolCalls, taskId }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!toolCalls || toolCalls.length === 0) return null;

  // Make the ID unique per task by incorporating the task id when available.
  const contentId = taskId ? `${CONTENT_ID}-${taskId}` : CONTENT_ID;

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
      >
        <svg className={`w-4 h-4 transform transition-transform text-gray-400 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>{toolCalls.length} Tool Call{toolCalls.length !== 1 ? 's' : ''}</span>
      </button>

      <div
        id={contentId}
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-100">
            {toolCalls.map((call, idx) => (
              <div key={call.id || idx} className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-xs font-mono font-medium text-purple-700">{call.tool}</span>
                  {call.pending && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  )}
                </div>
                <div className="p-3 text-sm flex flex-col space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase mr-2">Input</span>
                    <span className="text-gray-700 font-mono text-xs">{call.input_summary}</span>
                  </div>
                  {call.output_summary ? (
                    <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase mr-2">Output</span>
                      <span className="text-gray-700 text-sm">{call.output_summary}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-sm">Executing tool...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
