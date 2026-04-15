export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function groupTasksInOrder(tasksMap) {
  const ordered = [];
  const processedGroups = new Set();

  for (const [taskId, task] of tasksMap.entries()) {
    if (task.parallelGroup) {
      if (!processedGroups.has(task.parallelGroup)) {
        processedGroups.add(task.parallelGroup);
        const groupTasks = [];
        for (const [id, t] of tasksMap.entries()) {
          if (t.parallelGroup === task.parallelGroup) {
            groupTasks.push(t);
          }
        }
        ordered.push({ type: 'group', id: `group_${task.parallelGroup}`, name: task.parallelGroup, tasks: groupTasks });
      }
    } else {
      ordered.push({ type: 'single', id: taskId, task });
    }
  }

  return ordered;
}
