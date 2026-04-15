import React from 'react';
import TaskCard from './TaskCard';

export default function ParallelGroupRow({ group }) {
  return (
    <div className="mb-6 relative">
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400 rounded-full" />
      <div className="pl-6 pt-2">
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            Parallel · {group.tasks.length} tasks
          </span>
        </div>
        <div>
          {group.tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
