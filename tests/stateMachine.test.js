import { StateMachine } from '../scripts/utils/stateMachine.js';

describe('StateMachine', () => {
  test('transitions between states', () => {
    const sm = new StateMachine('a', { a: { go: 'b' }, b: { reset: 'a' } });
    expect(sm.state).toBe('a');
    expect(sm.transition('go')).toBe(true);
    expect(sm.state).toBe('b');
    expect(sm.transition('reset')).toBe(true);
    expect(sm.state).toBe('a');
  });

  test('rejects invalid transitions', () => {
    const sm = new StateMachine('a', { a: { go: 'b' } });
    expect(sm.transition('stop')).toBe(false);
    expect(sm.state).toBe('a');
  });
});
