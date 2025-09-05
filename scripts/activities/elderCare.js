import { game } from '../state.js';
import { VISIT_COST, visitParent } from '../actions/elderCare.js';

export function renderElderCare(container) {
  const wrap = document.createElement('div');
  wrap.className = 'actions';

  const mk = (label, fn, disabled = false) => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };

  wrap.appendChild(
    mk(
      `Visit Mother ($${VISIT_COST})`,
      () => visitParent('mother'),
      game.parents.mother.health <= 0
    )
  );

  wrap.appendChild(
    mk(
      `Visit Father ($${VISIT_COST})`,
      () => visitParent('father'),
      game.parents.father.health <= 0
    )
  );

  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = "Visits boost your parents' health but cost money.";
  wrap.appendChild(note);

  container.appendChild(wrap);
}

