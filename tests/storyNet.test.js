import { StoryNet } from '../scripts/storyNet.js';

describe('StoryNet forward', () => {
  test('computes activations for positive inputs', () => {
    const net = new StoryNet();
    const inputs = [1, 2, 3, 4];
    const hidden = inputs.map(v => Math.max(0, v));
    const expected = hidden.map(h => 1 / (1 + Math.exp(-(h - 0.5))));
    expect(net.forward(inputs)).toEqual(expected);
  });

  test('handles zeros and negatives', () => {
    const net = new StoryNet();
    const inputs = [-1, 0, 2, -3];
    const hidden = inputs.map(v => Math.max(0, v));
    const expected = hidden.map(h => 1 / (1 + Math.exp(-(h - 0.5))));
    expect(net.forward(inputs)).toEqual(expected);
  });
});

