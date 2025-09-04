import { game } from '../state.js';
import { rand } from '../utils.js';

const CONDITIONS = ['sunny', 'rainy', 'snowy'];

export function updateWeather() {
  game.weather = CONDITIONS[rand(0, CONDITIONS.length - 1)];
}

export function getCurrentWeather() {
  return game.weather;
}
