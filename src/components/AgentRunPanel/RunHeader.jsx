import React from 'react';
import { formatTime } from '../../utils/taskHelpers';

export default function RunHeader({ state }) {
  const { run, status, elapsed } = state;

  if (!run) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Agent Run Query</span>
        <h1 className="text-xl font-bold text-gray-900">{run.query}</h1>
      </div>
      <div className="flex items-center space-x-4">
        {status === 'running' && (
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">Running</span>
          </div>
        )}
        {status === 'complete' && (
          <span className="text-sm font-medium text-white bg-green-600 px-2 py-1 rounded-md shadow-sm">Complete</span>
        )}
        {status === 'failed' && (
          <span className="text-sm font-medium text-white bg-red-600 px-2 py-1 rounded-md shadow-sm">Failed</span>
        )}
        <div className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
          {formatTime(elapsed)}
        </div>
      </div>
    </div>
  );
}
