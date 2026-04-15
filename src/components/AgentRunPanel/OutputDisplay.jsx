import React from 'react';

const SETTLED_STATUSES = new Set(['complete', 'failed', 'cancelled']);

export default function OutputDisplay({ outputs, taskStatus }) {
  if (!outputs || outputs.length === 0) return null;

  const latestOutput = outputs[outputs.length - 1];

  // If the task has settled, always render in final style — the streaming
  // label is misleading on a task that is already done.
  const treatAsFinal = latestOutput.is_final || SETTLED_STATUSES.has(taskStatus);

  if (!treatAsFinal) {
    return (
      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Streaming...</span>
        </div>
        <p className="text-sm italic text-gray-500">{latestOutput.content}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Output</span>
        {latestOutput.quality_score !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            latestOutput.quality_score > 0.8 ? 'bg-green-100 text-green-700' :
            latestOutput.quality_score > 0.6 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            Score: {latestOutput.quality_score.toFixed(2)}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-800 leading-relaxed">{latestOutput.content}</p>
    </div>
  );
}
