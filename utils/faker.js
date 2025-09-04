let cached;

export async function getFaker() {
  if (cached) return cached;
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm');
    cached = mod.faker;
  } catch (err) {
    console.warn('Faker CDN import failed, using internal generator', err);
    const { faker } = await import('../nameGenerator.js');
    cached = faker;
  }
  return cached;
}

