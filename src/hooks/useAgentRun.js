import { useReducer, useEffect, useRef } from 'react';
import { MockEmitter } from '../../mock/emitter';
import runSuccessFixture from '../../mock/fixtures/run_success.json';
import runErrorFixture from '../../mock/fixtures/run_error.json';

const initialState = {
  run: null,
  status: 'idle',
  elapsed: 0,
  startTime: null,
  tasks: new Map(),
  groups: new Map(),
  coordinatorThoughts: [],
  finalOutput: null,
  error: null,
};

function agentReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...initialState, startTime: null, tasks: new Map(), groups: new Map(), coordinatorThoughts: [] };
    case 'TICK':
      if (state.status === 'running' && state.startTime !== null) {
        return { ...state, elapsed: Math.floor((Date.now() - state.startTime) / 1000) };
      }
      return state;
    case 'run_started':
      return { ...state, run: action.payload, status: 'running', elapsed: 0, startTime: Date.now() };
    case 'run_complete':
      return { ...state, status: 'complete', finalOutput: action.payload.output };
    case 'run_error':
      return { ...state, status: 'failed', error: action.payload.message };
    case 'agent_thought': {
      const { task_id, thought } = action.payload;
      if (!task_id) {
        return {
          ...state,
          coordinatorThoughts: [...state.coordinatorThoughts, { timestamp: action.timestamp, thought }]
        };
      }
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(task_id);
      if (task) {
        newTasks.set(task_id, {
          ...task,
          thoughts: [...task.thoughts, { timestamp: action.timestamp, thought }]
        });
      }
      return { ...state, tasks: newTasks };
    }
    case 'task_spawned': {
      const { task_id, label, agent, parallel_group, depends_on } = action.payload;
      const newTasks = new Map(state.tasks);
      const newGroups = new Map(state.groups);
      
      newTasks.set(task_id, {
        id: task_id,
        label,
        agent,
        status: 'pending',
        spawnedBy: null,
        parallelGroup: parallel_group || null,
        dependsOn: depends_on || [],
        toolCalls: [],
        outputs: [],
        thoughts: [],
        failHistory: [],
        cancelReason: null,
        cancelMessage: null,
        qualityScore: null,
      });

      if (parallel_group) {
        const groupTasks = newGroups.get(parallel_group) || [];
        if (!groupTasks.includes(task_id)) {
          newGroups.set(parallel_group, [...groupTasks, task_id]);
        }
      }
      return { ...state, tasks: newTasks, groups: newGroups };
    }
    case 'task_update': {
      const { task_id, status, cancel_reason, cancel_message } = action.payload;
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(task_id);
      if (task) {
        const updatedTask = { ...task };
        if (status === 'running' && task.status === 'failed') {
          updatedTask.failHistory = [...task.failHistory, action.timestamp];
        }
        updatedTask.status = status;
        if (cancel_reason) updatedTask.cancelReason = cancel_reason;
        if (cancel_message) updatedTask.cancelMessage = cancel_message;
        newTasks.set(task_id, updatedTask);
      }
      return { ...state, tasks: newTasks };
    }
    case 'tool_call': {
      const { task_id, tool, input_summary } = action.payload;
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(task_id);
      if (task) {
        newTasks.set(task_id, {
          ...task,
          toolCalls: [...task.toolCalls, { tool, input_summary, output_summary: null, pending: true, id: action.timestamp }]
        });
      }
      return { ...state, tasks: newTasks };
    }
    case 'tool_result': {
      const { task_id, output_summary } = action.payload;
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(task_id);
      if (task && task.toolCalls.length > 0) {
        const updatedToolCalls = [...task.toolCalls];
        for (let i = updatedToolCalls.length - 1; i >= 0; i--) {
          if (updatedToolCalls[i].pending) {
            updatedToolCalls[i] = { ...updatedToolCalls[i], output_summary, pending: false };
            break;
          }
        }
        newTasks.set(task_id, { ...task, toolCalls: updatedToolCalls });
      }
      return { ...state, tasks: newTasks };
    }
    case 'partial_output': {
      const { task_id, is_final, content, quality_score } = action.payload;
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(task_id);
      if (task) {
        const updatedTask = {
          ...task,
          outputs: [...task.outputs, { is_final, content, quality_score }]
        };
        if (is_final && quality_score !== undefined) {
          updatedTask.qualityScore = quality_score;
        }
        newTasks.set(task_id, updatedTask);
      }
      return { ...state, tasks: newTasks };
    }
    default:
      return state;
  }
}

export function useAgentRun() {
  const [state, dispatch] = useReducer(agentReducer, initialState);
  const emitterRef = useRef(null);
  const timerRef = useRef(null);

  const startRun = (fixtureType) => {
    dispatch({ type: 'RESET' });
    
    if (emitterRef.current) {
      emitterRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const fixture = fixtureType === 'success' ? runSuccessFixture : runErrorFixture;
    emitterRef.current = new MockEmitter(fixture, (event) => {
      dispatch({ 
        type: event.type, 
        payload: event.payload,
        timestamp: event.timestamp
      });
    });

    emitterRef.current.start();
    
    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
  };

  const stopRun = () => {
    if (emitterRef.current) emitterRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (state.status === 'complete' || state.status === 'failed') {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [state.status]);

  useEffect(() => {
    return () => {
      if (emitterRef.current) emitterRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { state, startRun, stopRun };
}
