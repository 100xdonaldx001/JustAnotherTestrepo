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

