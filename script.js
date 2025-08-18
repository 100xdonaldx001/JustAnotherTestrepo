    await Promise.all([
      fetch('partials/dock.html').then(r => r.text()).then(html => {
        document.getElementById('dock').outerHTML = html;
      }),
      fetch('partials/window-template.html').then(r => r.text()).then(html => {
        document.getElementById('window-template').innerHTML = html;
      })
    ]);

    // ------------------------------
    // Window Manager
    // ------------------------------
    const desktop = document.getElementById('desktop');
    const template = document.getElementById('window-template');
    let zCounter = 10;

    const windowRegistry = new Map(); // id -> render function

    function setActive(win){
      document.querySelectorAll('.window').forEach(w=> w.classList.remove('active'));
      win.classList.add('active');
    }
    function bringToFront(win){
      zCounter += 1; win.style.zIndex = zCounter; setActive(win);
    }

    function makeDraggable(win){
      const bar = win.querySelector('.titlebar');
      let startX=0, startY=0, startLeft=0, startTop=0, dragging=false;

      const onDown = (e)=>{
        if (e.button !== undefined && e.button !== 0) return; // left only
        // Don't start drag when clicking controls
        if (e.target.closest('.controls')) return;
        dragging = true; win.classList.add('dragging'); bringToFront(win);
        const rect = win.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top; startX = e.clientX; startY = e.clientY;
        bar.setPointerCapture?.(e.pointerId);
      };

      const onMove = (e)=>{
        if(!dragging) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        const dRect = desktop.getBoundingClientRect();
        let newLeft = startLeft + dx; let newTop  = startTop + dy;
        const maxLeft = dRect.right - win.offsetWidth - 4; const maxTop  = dRect.bottom - win.offsetHeight - 4;
        newLeft = Math.max(dRect.left + 4, Math.min(maxLeft, newLeft));
        newTop  = Math.max(dRect.top + 4, Math.min(maxTop, newTop));
        win.style.left = (newLeft - dRect.left) + 'px';
        win.style.top  = (newTop - dRect.top) + 'px';
      };

      const onUp = (e)=>{ dragging = false; win.classList.remove('dragging'); bar.releasePointerCapture?.(e.pointerId); };

      bar.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      win.addEventListener('mousedown', ()=> bringToFront(win));

      // Close button should not start drag nor be swallowed
      const btnClose = win.querySelector('.btn-close');
      btnClose.addEventListener('click', (e)=>{ e.stopPropagation(); closeWindow(win.dataset.id); });
      btnClose.addEventListener('pointerdown', (e)=>{ e.stopPropagation(); });
    }

    function ensureWindow(id, title){
      let win = desktop.querySelector(`.window[data-id="${id}"]`);
      if(!win){
        win = template.content.firstElementChild.cloneNode(true);
        win.dataset.id = id; win.querySelector('.title').textContent = title;
        const n = desktop.querySelectorAll('.window').length;
        win.style.left = (60 + (n*24)) + 'px'; win.style.top  = (60 + (n*18)) + 'px';
        desktop.appendChild(win); makeDraggable(win);
      }
      return win;
    }

    function openWindow(id, title, renderFn){
      const win = ensureWindow(id, title);
      windowRegistry.set(id, renderFn);
      const c = win.querySelector('.content'); c.innerHTML = ''; renderFn(c, win);
      win.classList.remove('hidden'); bringToFront(win);
    }

    function toggleWindow(id, title, renderFn){
      const win = desktop.querySelector(`.window[data-id="${id}"]`);
      if(win && !win.classList.contains('hidden')){ closeWindow(id); return; }
      openWindow(id, title, renderFn);
    }

    function closeWindow(id){
      const win = desktop.querySelector(`.window[data-id="${id}"]`);
      if(!win) return; win.classList.add('hidden');
      // Set another window active if any
      const others = Array.from(document.querySelectorAll('.window:not(.hidden)'));
      if(others.length){ bringToFront(others[others.length-1]); }
    }

    function refreshOpenWindows(){
      for(const [id, fn] of windowRegistry.entries()){
        const win = desktop.querySelector(`.window[data-id="${id}"]`);
        if(!win || win.classList.contains('hidden')) continue;
        const c = win.querySelector('.content'); c.innerHTML = ''; fn(c, win);
      }
    }

    // ------------------------------
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

    // ------------------------------
    // Window Renderers
    // ------------------------------
    function renderStats(container){
      const makeKpi = (label, val)=>{ const pct = clamp(val); const div = document.createElement('div'); div.className = 'kpi'; div.innerHTML = `<span class="label">${label}</span><div class="bar"><div class="fill" style="width:${pct}%"></div></div><span class="num">${pct}</span>`; return div; };
      const top = document.createElement('div'); top.className = 'grid';
      top.innerHTML = `
        <div class="row"><strong>Year:</strong> <span>${game.year}</span></div>
        <div class="row"><strong>Age:</strong> <span>${game.age}</span></div>
        <div class="row"><strong>Money:</strong> <span>$${game.money.toLocaleString()}</span></div>
        <div class="row"><strong>Status:</strong> <span>${game.alive ? (game.inJail? 'In Jail' : 'Alive') : 'Deceased'}</span></div>
        <div class="row"><strong>Job:</strong> <span>${game.job? `${game.job.title} <span class='badge'>$${game.job.salary.toLocaleString()}</span>` : '—'}</span></div>
        <div class="row"><strong>Illness:</strong> <span>${game.sick? 'Sick' : '—'}</span></div>`;
      container.appendChild(top);
      container.appendChild(makeKpi('Health', game.health));
      container.appendChild(makeKpi('Happiness', game.happiness));
      container.appendChild(makeKpi('Smarts', game.smarts));
      container.appendChild(makeKpi('Looks', game.looks));
      const hint = document.createElement('div'); hint.className = 'muted'; hint.style.marginTop = '8px'; hint.textContent = 'Tip: Open Actions to age up and do stuff. You can drag windows around and click to bring them to the front.'; container.appendChild(hint);
    }

    function renderActions(container){
      const g = document.createElement('div'); g.className = 'actions';
      const mk = (text, fn, disabled=false)=>{ const b = document.createElement('button'); b.className = 'btn'; b.textContent = text; b.disabled = disabled; b.addEventListener('click', fn); return b; };
      const dead = !game.alive;
      g.appendChild(mk('👉 Age Up One Year', ageUp, dead));
      g.appendChild(mk('📚 Study (+Smarts)', study, dead));
      g.appendChild(mk('🏋️ Gym (+Health/Happiness)', hitGym, dead));
      g.appendChild(mk('💼 Job Hunt (open window)', ()=> toggleWindow('jobs','Jobs', renderJobs), dead));
      g.appendChild(mk('💵 Work Overtime (+$$)', workExtra, dead || !game.job || game.inJail));
      g.appendChild(mk('🩺 See Doctor', seeDoctor, dead));
      g.appendChild(mk('🕶️ Crime (risky)', crime, dead));
      const note = document.createElement('div'); note.className = 'muted'; note.style.marginTop='8px';
      let txt = 'Actions adjust your stats. Some actions are limited while in jail.';
      if(game.age < 16) txt += ' You are under 16, so most jobs are unavailable yet.';
      if(game.inJail) txt += ' You are in jail: Work/Doctor/Crime disabled. You can still age, study, and work out.';
      note.textContent = txt; g.appendChild(note); container.appendChild(g);
    }

    function renderLog(container){
      const list = document.createElement('div'); list.className = 'log';
      if(game.log.length === 0){ const e = document.createElement('div'); e.className = 'entry'; e.textContent = 'Your story will appear here.'; list.appendChild(e); }
      else { for(const item of game.log){ const e = document.createElement('div'); e.className = 'entry'; e.innerHTML = `<div>${item.text}</div><time>${item.when}</time>`; list.appendChild(e); } }
      container.appendChild(list);
    }

    function renderJobs(container){
      const head = document.createElement('div'); head.className = 'muted';
      if(game.age < 16){ head.textContent = 'You are too young to work. Come back at age 16+'; container.appendChild(head); return; }
      head.innerHTML = `Pick a job. Smarter roles require higher Smarts.`; container.appendChild(head);
      const jobs = generateJobs(); const wrap = document.createElement('div'); wrap.className = 'jobs';
      for(const j of jobs){ const e = document.createElement('div'); e.className = 'job'; const ok = game.smarts >= j.reqSmarts;
        e.innerHTML = `<div><strong>${j.title}</strong><div class="muted">Req Smarts: ${j.reqSmarts}</div></div><div><span class="badge">$${j.salary.toLocaleString()}/yr</span></div>`;
        if(!ok) e.style.opacity = .6; e.title = ok ? 'Take job' : 'Your Smarts are too low for this role';
        e.addEventListener('click', ()=>{ if(!ok){ addLog('You were not qualified for that role. (+Study to improve Smarts)'); refreshOpenWindows(); return; } game.job = j; addLog(`You became a ${j.title}. Salary $${j.salary.toLocaleString()}/yr.`); refreshOpenWindows(); });
        wrap.appendChild(e);
      }
      container.appendChild(wrap);
    }

    // Helpers to open/toggle windows via dock
    function openStats(){ openWindow('stats', 'Stats', renderStats); }
    function openActions(){ openWindow('actions', 'Actions', renderActions); }
    function openLog(){ openWindow('log', 'Log', renderLog); }
    function openJobs(){ openWindow('jobs', 'Jobs', renderJobs); }

    function toggleStats(){ toggleWindow('stats', 'Stats', renderStats); }
    function toggleActions(){ toggleWindow('actions', 'Actions', renderActions); }
    function toggleLog(){ toggleWindow('log', 'Log', renderLog); }
    function toggleJobs(){ toggleWindow('jobs', 'Jobs', renderJobs); }

    // Dock bindings (toggle behavior)
    document.querySelectorAll('[data-toggle]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-toggle');
        if(id==='stats') toggleStats();
        if(id==='actions') toggleActions();
        if(id==='log') toggleLog();
        if(id==='jobs') toggleJobs();
      });
    });

    // New Life: immediate reset (no confirm to avoid blocked dialogs)
    document.getElementById('newLife').addEventListener('click', ()=>{ newLife(); });

    // Boot
    newLife();
    // Open defaults
    openStats(); openActions(); openLog();
