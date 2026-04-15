import React, { useState } from 'react';
import { useAgentRun } from '../../hooks/useAgentRun';
import RunHeader from './RunHeader';
import TaskList from './TaskList';
import FinalOutput from './FinalOutput';
import ThoughtBubble from './ThoughtBubble';

export default function AgentRunPanel() {
  const { state, startRun, stopRun } = useAgentRun();
  const [activeFixture, setActiveFixture] = useState('success');

  const handleStart = (fixtureType) => {
    setActiveFixture(fixtureType);
    startRun(fixtureType);
  };

  const handleReplay = () => {
    startRun(activeFixture);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Agent Run Panel</h1>
            <p className="text-xs text-gray-500 font-medium">Real-time pipeline visualizer</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => handleStart('success')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                state.run && activeFixture === 'success' 
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Success Run
            </button>
            <button
              onClick={() => handleStart('error')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                state.run && activeFixture === 'error' 
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Error Run
            </button>
          </div>
          
          {state.run && (
            <button
              onClick={handleReplay}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold border border-indigo-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Replay</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto pb-12 w-full">
        {!state.run ? (
          <div className="mt-20 px-6 flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to trace agent execution</h2>
            <p className="text-gray-500 max-w-md mb-8">Select a fixture run above to simulate a real-time multi-agent workflow for financial data analysis.</p>
            <div className="flex space-x-4">
               <button
                  onClick={() => handleStart('success')}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Start Success Run
                </button>
                <button
                  onClick={() => handleStart('error')}
                  className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors"
                >
                  Start Error Run
                </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <RunHeader state={state} />
            
            {state.error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-red-800">Run Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{state.error}</p>
                </div>
              </div>
            )}

            {state.status === 'complete' && state.finalOutput && (
              <FinalOutput output={state.finalOutput} />
            )}

            {state.coordinatorThoughts.length > 0 && (
              <div className="mx-6 mt-6">
                 <div className="px-5 py-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                   <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Coordinator Agent</h3>
                   <ThoughtBubble thoughts={state.coordinatorThoughts} />
                 </div>
              </div>
            )}

            <TaskList state={state} />
          </div>
        )}
      </main>
    </div>
  );
}
