    // Tiny Life Game Logic
    // ------------------------------
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const clamp = (v, a=0, b=100) => Math.max(a, Math.min(b, v));

    const game = {
      year: new Date().getFullYear(), age: 0, health: 80, happiness: 70, smarts: 65, looks: 50,
      money: 0, job: null, sick: false, inJail: false, alive: true, log: []
    };

    function addLog(text){
      const when = `${game.year} • age ${game.age}`;
      game.log.unshift({ when, text }); if(game.log.length > 200) game.log.pop();
      const logWin = desktop.querySelector('.window[data-id="log"]');
      if(logWin && !logWin.classList.contains('hidden')){ renderLog(logWin.querySelector('.content')); }
    }

    function newLife(){
      const now = new Date().getFullYear();
      Object.assign(game, { year: now, age: 0, health: 80, happiness: 70, smarts: 65, looks: 50,
        money: 0, job: null, sick: false, inJail: false, alive: true, log: [] });
      addLog('You were born. A new life begins.');
      refreshOpenWindows();
    }

    function paySalary(){
      if(game.job && !game.inJail){
        const monthly = game.job.salary / 12; const earned = Math.round(monthly * rand(10,12));
        game.money += earned; addLog(`You worked as a ${game.job.title} and earned $${earned.toLocaleString()}.`);
      }
    }

    function randomEvent(){
      if(game.age === 5){ addLog('You learned to read and write. (+Smarts)'); game.smarts = clamp(game.smarts + rand(2,5)); }
      if(game.age === 12){ addLog('You discovered video games. (+Happiness, -Looks?)'); game.happiness = clamp(game.happiness + 4); game.looks = clamp(game.looks - 1); }
      if(game.age === 16){ addLog('You can start looking for a part-time job.'); }
      if(game.age === 18){ addLog('You finished school. Time to work or study!'); }
      if(!game.sick && rand(1,100) <= 8){ game.sick = true; addLog('You caught a nasty flu. (See Doctor)'); }
      if(game.age > 50 && rand(1,100) <= (game.age-45)){ addLog('Aches and pains are catching up with you. (-Health)'); game.health = clamp(game.health - rand(2,6)); }
      if(rand(1,1000) === 1){ game.alive = false; addLog('A tragic accident ended your life.'); }
    }

    function ageUp(){
      if(!game.alive){ addLog('You are no longer alive. Start a new life.'); return; }
      game.age += 1; game.year += 1;
      game.health = clamp(game.health - rand(1,4));
      game.happiness = clamp(game.happiness + rand(-2,3));
      if(game.sick){ game.health = clamp(game.health - rand(2,6)); }
      paySalary(); randomEvent(); if(game.health <= 0){ game.alive = false; addLog('Your health reached zero. You passed away.'); }
      tickJail();
      refreshOpenWindows();
    }

    function study(){
      if(!game.alive) return; if(game.inJail){ addLog('You studied in jail. (+Smarts)'); }
      const gain = rand(2,4); const mood = rand(-1,1);
      game.smarts = clamp(game.smarts + gain); game.happiness = clamp(game.happiness + mood);
      addLog(`You studied hard. +${gain} Smarts${mood<0?` • ${mood} Happiness`:''}.`);
      refreshOpenWindows();
    }

    function workExtra(){
      if(!game.job){ addLog('You need a job first.'); return; }
      if(game.inJail){ addLog('You cannot work extra while in jail.'); return; }
      const bonus = rand(200, 1500); game.money += bonus; game.happiness = clamp(game.happiness - rand(0,2)); game.health = clamp(game.health - rand(0,2));
      addLog(`You took overtime. Earned $${bonus.toLocaleString()}. (-Small Health/Happiness)`);
      refreshOpenWindows();
    }

    function hitGym(){
      if(game.inJail){ game.health = clamp(game.health + rand(2,5)); game.happiness = clamp(game.happiness + rand(1,3)); addLog('You worked out in the yard. (+Health, +Happiness)'); }
      else { const cost = 20; if(game.money < cost){ addLog('Not enough money for the gym ($20).'); return; }
        game.money -= cost; game.health = clamp(game.health + rand(2,5)); game.happiness = clamp(game.happiness + rand(1,3)); addLog('You hit the gym. (+Health, +Happiness)'); }
      refreshOpenWindows();
    }

    function seeDoctor(){
      if(game.inJail){ addLog('No access to a doctor here.'); return; }
      const cost = game.sick ? 120 : 60; if(game.money < cost){ addLog(`Doctor visit costs $${cost}. Not enough money.`); return; }
      game.money -= cost; if(game.sick){ game.sick = false; game.health = clamp(game.health + rand(6,12)); addLog('The doctor treated your illness. (+Health)'); }
      else { game.health = clamp(game.health + rand(2,6)); addLog('Routine check-up made you feel better. (+Health)'); }
      refreshOpenWindows();
    }

    function crime(){
      if(game.inJail){ addLog('You are already in jail.'); return; }
      const crimes = [
        {name:'Pickpocket', risk:12, reward:[50,180]},
        {name:'Shoplift', risk:18, reward:[80,400]},
        {name:'Car theft', risk:35, reward:[800,6000]},
        {name:'Bank robbery', risk:60, reward:[5000,45000]},
      ];
      const c = crimes[rand(0, crimes.length-1)]; const roll = rand(1,100);
      if(roll > c.risk){ const amount = rand(c.reward[0], c.reward[1]); game.money += amount; game.happiness = clamp(game.happiness + rand(0,2)); addLog(`Crime succeeded: ${c.name}. You gained $${amount.toLocaleString()}.`); }
      else { if(rand(1,100) <= 75){ game.inJail = true; game.jailYears = rand(1,4); addLog(`Busted doing ${c.name}. You were jailed for ${game.jailYears} year(s).`); }
             else { const dmg = rand(4,15); game.health = clamp(game.health - dmg); addLog(`Crime failed: ${c.name}. You were injured (-${dmg} Health).`); if(game.health <= 0){ game.alive = false; addLog('You died from your injuries.'); } } }
      refreshOpenWindows();
    }

    function tickJail(){
      if(!game.inJail) return; if(typeof game.jailYears !== 'number') game.jailYears = 1; game.jailYears -= 1; if(game.jailYears <= 0){ game.inJail = false; delete game.jailYears; addLog('You were released from jail.'); }
    }

    function generateJobs(){
      const titles = [
        ['Janitor', 18000, 0], ['Store Clerk', 21000, 0], ['Courier', 24000, 0], ['Barista', 22000, 0], ['Receptionist', 26000, 20], ['Driver', 28000, 15],
        ['IT Support', 34000, 40], ['Junior Developer', 42000, 55], ['Nurse', 39000, 45], ['Teacher', 38000, 50], ['Chef', 33000, 25], ['Designer', 36000, 45],
        ['Accountant', 45000, 55], ['Engineer', 52000, 65], ['Lawyer', 72000, 75]
      ];
      const options = []; for(let i=0;i<6;i++){ const [t, base, req] = titles[rand(0,titles.length-1)]; const salary = base + rand(-3000, 12000); options.push({ title: t, salary, reqSmarts: req }); }
      return options;
    }
