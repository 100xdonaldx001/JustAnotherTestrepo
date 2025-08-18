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
