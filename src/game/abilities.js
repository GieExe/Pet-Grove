import { state } from '../state.js';
import * as UI from '../ui.js';

export function applyAbility(ability, targetEnemy, damage, x, y){
  switch(ability){
    case 'poison':
      if(!targetEnemy.poisonStacks) targetEnemy.poisonStacks = 0;
      targetEnemy.poisonStacks = Math.min(targetEnemy.poisonStacks + 1, 3);
      if(!targetEnemy.poisonTimer){
        targetEnemy.poisonTimer = setInterval(()=>{
          if(targetEnemy.hp > 0 && targetEnemy.poisonStacks > 0){
            const poisonDamage = Math.floor(damage * 0.1 * targetEnemy.poisonStacks);
            targetEnemy.hp -= poisonDamage;
            UI.createFloatingText(targetEnemy.position.col+0.5, targetEnemy.position.row+0.5, `☠️-${poisonDamage}`, '#00ff00');
            targetEnemy.poisonStacks--;
          } else { clearInterval(targetEnemy.poisonTimer); targetEnemy.poisonTimer = null; targetEnemy.poisonStacks = 0; }
        }, 1000);
      }
      break;
    case 'splash':
      state.enemies.forEach(enemy => { if(enemy === targetEnemy || enemy.spawnDelay > 0) return; const dist = Math.hypot(enemy.position.col+0.5 - x, enemy.position.row+0.5 - y); if(dist < 1.5){ const splashDamage = Math.floor(damage * 0.4); enemy.hp -= splashDamage; UI.createFloatingText(enemy.position.col+0.5, enemy.position.row+0.5, `-${splashDamage}`, '#ff9900'); } });
      break;
    case 'slow':
      if(!targetEnemy.slowDuration) targetEnemy.originalSpeed = targetEnemy.speed;
      targetEnemy.speed = targetEnemy.originalSpeed * 0.5;
      targetEnemy.slowDuration = 3;
      setTimeout(()=>{ if(targetEnemy.slowDuration){ targetEnemy.slowDuration--; if(targetEnemy.slowDuration === 0) targetEnemy.speed = targetEnemy.originalSpeed; } }, 1000);
      break;
    case 'stun':
      if(Math.random() < 0.2){ targetEnemy.stunned = true; targetEnemy.originalSpeed = targetEnemy.speed; targetEnemy.speed = 0; UI.createFloatingText(targetEnemy.position.col+0.5, targetEnemy.position.row+0.5, '⭐STUN', '#ffff00'); setTimeout(()=>{ targetEnemy.stunned = false; targetEnemy.speed = targetEnemy.originalSpeed; }, 1500); }
      break;
    case 'lifesteal':
      const heal = Math.floor(damage * 0.15); state.coins += heal; UI.createFloatingText(x, y, `+${heal}💰`, '#00ff00');
      break;
    case 'burn':
      if(!targetEnemy.burnTimer){ let burnTicks = 5; targetEnemy.burnTimer = setInterval(()=>{ if(targetEnemy.hp > 0 && burnTicks > 0){ const burnDamage = Math.floor(damage * 0.15); targetEnemy.hp -= burnDamage; UI.createFloatingText(targetEnemy.position.col+0.5, targetEnemy.position.row+0.5, `🔥-${burnDamage}`, '#ff4400'); burnTicks--; } else { clearInterval(targetEnemy.burnTimer); targetEnemy.burnTimer = null; } }, 800); }
      break;
  }
}
