export function renderCrime(container) {
  const crimes = [
    { name: 'Pickpocket', risk: 'Low', reward: 'Small cash' },
    { name: 'Burglary', risk: 'Medium', reward: 'Cash and valuables' },
    { name: 'Car Theft', risk: 'Medium', reward: 'Resell vehicles' },
    { name: 'Fraud Scheme', risk: 'High', reward: 'Large sums' },
    { name: 'Bank Heist', risk: 'Extreme', reward: 'Huge payout' }
  ];

  const wrap = document.createElement('div');
  const list = document.createElement('ul');

  for (const crime of crimes) {
    const item = document.createElement('li');
    item.textContent = `${crime.name} – Risk: ${crime.risk}, Reward: ${crime.reward}`;
    list.appendChild(item);
  }

  wrap.appendChild(list);
  container.appendChild(wrap);
}

