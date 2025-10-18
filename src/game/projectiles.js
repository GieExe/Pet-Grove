import { state } from '../state.js';
import * as UI from '../ui.js';

export function createProjectile(defender, enemy){
  const defenderPos = { x: defender.col + 0.5, y: defender.row + 0.5 };
  const projectile = {
    id: Date.now() + Math.random(),
    x: defenderPos.x,
    y: defenderPos.y,
    targetEnemy: enemy,
    targetX: enemy.position.col + 0.5,
    targetY: enemy.position.row + 0.5,
    damage: defender.damage,
    speed: 1.6,
    defenderName: defender.name,
    ability: defender.ability || null,
    startTime: Date.now(),
    defenderEmoji: defender.emoji
  };
  state.projectiles.push(projectile);
  if(defender.ability === 'multishot'){
    const nearby = state.enemies.filter(e => e !== enemy && e.spawnDelay <= 0).slice(0,2);
    nearby.forEach(e => {
      state.projectiles.push({ ...projectile, id: Date.now() + Math.random(), targetEnemy: e, targetX: e.position.col + 0.5, targetY: e.position.row + 0.5, damage: Math.floor(projectile.damage*0.5) });
    });
  }
}

export function updateProjectiles(deltaTime){
  const toRemove = [];
  state.projectiles.forEach(proj => {
    if(!proj.targetEnemy || proj.targetEnemy.hp <= 0){ toRemove.push(proj.id); return; }
    const targetPos = { x: proj.targetEnemy.position.col + 0.5, y: proj.targetEnemy.position.row + 0.5 };
    const dx = targetPos.x - proj.x; const dy = targetPos.y - proj.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const step = proj.speed * deltaTime;
    if(dist <= step){
      // impact
      proj.targetEnemy.hp -= proj.damage;
      UI.createFloatingText(proj.targetEnemy.position.col+0.5, proj.targetEnemy.position.row+0.5, `-${proj.damage}`, '#ff4444');
      if(proj.ability){ if(window && window.GameAPI && typeof window.GameAPI.applyAbility === 'function'){ window.GameAPI.applyAbility(proj.ability, proj.targetEnemy, proj.damage, proj.targetX, proj.targetY); } }
      UI.createImpactEffect(proj.targetX, proj.targetY);
      toRemove.push(proj.id);
    } else {
      proj.x += (dx/dist)*step; proj.y += (dy/dist)*step;
    }
  });
  state.projectiles = state.projectiles.filter(p => !toRemove.includes(p.id));
}
