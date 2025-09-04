export class StateMachine {
  constructor(initial, transitions = {}) {
    this.state = initial;
    this.transitions = transitions;
  }

  can(event) {
    const stateTransitions = this.transitions[this.state];
    return stateTransitions && Object.prototype.hasOwnProperty.call(stateTransitions, event);
  }

  transition(event) {
    if (!this.can(event)) return false;
    this.state = this.transitions[this.state][event];
    return true;
  }
}
