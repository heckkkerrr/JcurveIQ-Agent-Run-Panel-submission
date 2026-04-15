# Architecture Decisions

## 1. Agent Thought Routing (task_id: null)

**Ambiguity**: `agent_thought` events can arrive with either a specific `task_id` or `task_id: null`. The spec did not clarify where null-task thoughts should appear.

**Decision**: In `agentReducer`, thoughts with `task_id: null` are routed to `state.coordinatorThoughts[]` — a top-level array separate from all `TaskState` objects. Thoughts with a valid `task_id` are appended to that task's `thoughts[]` array. Both surfaces are rendered independently: coordinator thoughts appear in a dedicated card above the task list; per-task thoughts appear inside each `TaskCard` via `ThoughtBubble`. Both are collapsed by default since they are scratchpad noise for the analyst audience.

---

## 2. Parallel Task Layout

**Ambiguity**: The spec described a left-border accent spanning the full group height, but did not specify how to handle mixed sequential/parallel task ordering in the DOM.

**Decision**: `groupTasksInOrder()` in `taskHelpers.js` performs a single linear pass over the `tasks` Map (which preserves insertion order). When a task has a `parallelGroup` string, the group is consolidated into a single `ParallelGroupRow` on first encounter and all subsequent tasks in that group are merged into it — avoiding duplicate group headers without requiring a pre-sort. Sequential tasks are emitted as individual `TaskCard` elements. The amber-400 left border is implemented as an absolutely-positioned `div` spanning `top-0 bottom-0 left-0` inside a `relative` container.

---

## 3. Partial Output Handling (is_final flag)

**Ambiguity**: The spec said "do not discard is_final:false outputs," but was silent on what to show if a task's `task_update` arrives as `complete` before a `is_final:true` output is emitted (possible in error scenarios).

**Decision**: All `partial_output` events are appended to `task.outputs[]` regardless of `is_final`. `OutputDisplay` renders the last item in the array. Crucially, `OutputDisplay` accepts a `taskStatus` prop: if the task has settled (`complete | failed | cancelled`), it treats the last output as final regardless of the `is_final` flag. This prevents a misleading "Streaming..." indicator on a task that is already done, which can happen when the pipeline is interrupted mid-flight.

---

## 4. Cancelled Status — Positive Framing

**Ambiguity**: The `sufficient_data` cancel reason looks like a failure in the event stream but is semantically a positive optimisation — the agent avoided redundant work.

**Decision**: A dedicated branch in `TaskCard.renderBadge()` handles `status === 'cancelled' && cancelReason === 'sufficient_data'` with a teal-600 badge labelled "Sufficient data ✓" and the `cancelMessage` displayed in small muted text beneath it. It is deliberately not grouped with the red `failed` branch. No "Retried" pill is shown for cancellation.

---

## 5. Task Dependencies (depends_on array)

**Ambiguity**: The spec passed `depends_on` in `task_spawned` payloads but did not specify whether the UI should block task rendering until dependencies are complete, or simply display the dependency metadata.

**Decision**: Dependencies are stored in `TaskState.dependsOn[]` but are **not used to gate rendering**. Tasks are displayed as soon as their `task_spawned` event arrives (status: `pending`). The rationale is that this is a *visualisation* panel, not a scheduler — analysts need to see the full pipeline graph immediately, including tasks that are still waiting on dependencies. Dependency information is available in state for any future tooltip or dependency-graph overlay feature.

---

## 6. State Management

**Decision**: `useReducer` with a single `agentReducer` function. Tasks stored in `Map<task_id, TaskState>` for O(1) lookup. `useRef` holds the `MockEmitter` instance and the `setInterval` timer ID so they survive re-renders without causing them.

---

## 7. Mock Emitter Timing

**Decision**: `MockEmitter` schedules one `setTimeout` per fixture event, with `delay = event.timestamp - fixture[0].timestamp`. All timers are registered up-front in `start()` and every timer ID is stored in `this.timers[]`. `stop()` calls `clearTimeout` on each. This means no events fire in the same tick and the cleanup path is complete — no leaked timers on unmount or fixture switch.
