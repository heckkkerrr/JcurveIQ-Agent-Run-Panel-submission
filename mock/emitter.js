export class MockEmitter {
  constructor(fixture, onEvent) {
    this.fixture = fixture;
    this.onEvent = onEvent;
    this.timers = [];
  }

  start() {
    if (!this.fixture || this.fixture.length === 0) return;

    const baseTime = this.fixture[0].timestamp;

    this.fixture.forEach(event => {
      const delay = event.timestamp - baseTime;
      const timerId = setTimeout(() => {
        this.onEvent(event);
      }, delay);
      this.timers.push(timerId);
    });
  }

  stop() {
    this.timers.forEach(timerId => clearTimeout(timerId));
    this.timers = [];
  }
}
