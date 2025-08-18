export class StoryNet {
  constructor() {
    this.w1 = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    this.b1 = [0, 0, 0, 0];
    this.w2 = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
    this.b2 = [-0.5, -0.5, -0.5, -0.5];
  }

  forward(inputs) {
    const hidden = this.w1.map((row, i) => {
      let sum = this.b1[i];
      for (let j = 0; j < row.length; j++) sum += row[j] * inputs[j];
      return Math.max(0, sum);
    });
    return this.w2.map((row, i) => {
      let sum = this.b2[i];
      for (let j = 0; j < row.length; j++) sum += row[j] * hidden[j];
      return 1 / (1 + Math.exp(-sum));
    });
  }
}

