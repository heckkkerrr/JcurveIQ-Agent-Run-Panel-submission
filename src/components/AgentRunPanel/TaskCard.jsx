import React from 'react';
import ThoughtBubble from './ThoughtBubble';
import ToolCallLog from './ToolCallLog';
import OutputDisplay from './OutputDisplay';

export default function TaskCard({ task }) {
  const { label, agent, status, thoughts, toolCalls, outputs, failHistory, cancelReason, cancelMessage } = task;

  const renderBadge = () => {
    if (status === 'running') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500 text-xs font-medium text-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>Running</span>
        </span>
      );
    }
    if (status === 'complete') {
      return <span className="px-2.5 py-1 rounded-full bg-green-600 text-xs font-medium text-white">Complete</span>;
    }
    if (status === 'cancelled' && cancelReason === 'sufficient_data') {
      return (
        <div className="flex flex-col items-end">
          <span className="px-2.5 py-1 rounded-full bg-teal-600 text-xs font-medium text-white">Sufficient data ✓</span>
          {cancelMessage && <span className="text-[10px] text-gray-500 mt-1">{cancelMessage}</span>}
        </div>
      );
    }
    if (status === 'failed') {
      return <span className="px-2.5 py-1 rounded-full bg-red-600 text-xs font-medium text-white">Failed</span>;
    }
    return <span className="px-2.5 py-1 rounded-full bg-gray-200 text-xs font-medium text-gray-600 capitalize">{status}</span>;
  };

  const hasRetried = failHistory && failHistory.length > 0;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-4 relative hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-gray-900">{label}</h3>
          <span className="text-xs font-mono text-gray-500 mt-1">Agent: {agent}</span>
          
          {hasRetried && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-gray-500 text-[10px] font-bold text-white uppercase tracking-wider">Retried</span>
              <span className="text-xs text-gray-500">Task failed and was retried</span>
            </div>
          )}
        </div>
        <div>
          {renderBadge()}
        </div>
      </div>

      <ThoughtBubble thoughts={thoughts} />
      <ToolCallLog toolCalls={toolCalls} taskId={task.id} />
      <OutputDisplay outputs={outputs} taskStatus={status} />
    </div>
  );
}
