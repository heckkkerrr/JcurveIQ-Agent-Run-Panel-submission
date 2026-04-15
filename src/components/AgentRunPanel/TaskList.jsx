import React from 'react';
import TaskCard from './TaskCard';
import ParallelGroupRow from './ParallelGroupRow';
import { groupTasksInOrder } from '../../utils/taskHelpers';

export default function TaskList({ state }) {
  const { tasks } = state;
  
  if (!tasks || tasks.size === 0) return null;

  const groupedAndOrdered = groupTasksInOrder(tasks);

  return (
    <div className="p-6">
      {groupedAndOrdered.map((item) => {
        if (item.type === 'group') {
          return <ParallelGroupRow key={item.id} group={item} />;
        }
        return <TaskCard key={item.id} task={item.task} />;
      })}
    </div>
  );
}
