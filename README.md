# Agent Run Panel

A real-time frontend visualization component for live multi-agent AI pipelines. Built in React + Vite, styled precisely with Tailwind CSS.

### Project Context
This application acts as a mock UI for tracking task sequences and thought progression from an orchestrating AI model assigning asynchronous agent tasks during data synthesis.

### How to Run

1. Make sure you are using Node 18+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

### How to Switch Fixtures
The top right panel contains interactive fixture controllers:
- Click **Success Run** to dispatch the `run_success.json` sequence.
- Click **Error Run** to simulate a pipeline failure utilizing the `run_error.json` suite.
- Once a run has commenced, hitting the **Replay** button seamlessly restarts the data pipeline emitter from `timestamp=0`.

### Known Gaps & Limitations
- **Memory Optimization:** Reducers update deeply nested maps by creating new instances every tick/state progression. For extensive million+ line analytics payloads, this approach may require Immutable.js or structured clone alternatives down the line.
- **Scroll Behavior:** During heavy streams (like real-time continuous generation outputs), automatic scrolling isn't configured, requiring arbitrary manual analyst scrolling.
- **Animations:** Certain transition states such as components loading linearly within the flex container do not use dynamic layout reflowing elements (like Framer Motion) which would make task spawns smoother. Currently uses simple slide-in CSS animations for finalized outputs.
