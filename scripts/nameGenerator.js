import { rand } from './utils.js';

const maleFirst = ['John', 'Liam', 'Noah'];
const femaleFirst = ['Emma', 'Olivia', 'Ava'];
const lastNames = ['Smith', 'Johnson', 'Brown'];
const cities = ['Springfield', 'Riverside', 'Greenville'];
const countries = ['USA', 'Canada', 'UK'];

export const faker = {
  person: {
    firstName(gender) {
      const pool =
        gender === 'male'
          ? maleFirst
          : gender === 'female'
            ? femaleFirst
            : [...maleFirst, ...femaleFirst];
      return pool[rand(0, pool.length - 1)];
    },
    lastName() {
      return lastNames[rand(0, lastNames.length - 1)];
    }
  },
  location: {
    city() {
      return cities[rand(0, cities.length - 1)];
    },
    country() {
      return countries[rand(0, countries.length - 1)];
    }
  }
};
