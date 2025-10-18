import { state, GRID_COLS, GRID_ROWS, MAPS } from './state.js';
import { distance, getCellCenter } from './utils.js';

// DOM refs
export let battleGridEl = null;
export let shopEl = null;
export let inventoryEl = null;
export let coinsEl = null;
export let gemsEl = null;
export let livesEl = null;
export let waveNumberEl = null;
export let startWaveBtn = null;
export let gachaBtn = null;
export let gachaModal = null;
export let gachaResult = null;
export let closeGachaBtn = null;
export let logEl = null;

// Internal caches
const _enemyEls = new Map();
const _projEls = new Map();
export const cellElements = [];

function getAbilityIcon(ability){
  const icons = { poison:'☠️', splash:'💥', slow:'❄️', stun:'⭐', lifesteal:'💚', burn:'🔥', multishot:'🎯' };
  return icons[ability] || '';
}
function getAbilityName(ability){
  const names = { poison:'Poison', splash:'Splash Damage', slow:'Slow', stun:'Stun', lifesteal:'Life Steal', burn:'Burn', multishot:'Multi-Shot' };
  return names[ability] || '';
}

export function initDOMRefs(){
  battleGridEl = document.getElementById('battleGrid');
  shopEl = document.getElementById('shop');
  inventoryEl = document.getElementById('inventory');
  coinsEl = document.getElementById('coinCount');
  gemsEl = document.getElementById('gemCount');
  livesEl = document.getElementById('livesCount');
  waveNumberEl = document.getElementById('waveNumber');
  startWaveBtn = document.getElementById('startWaveBtn');
  gachaBtn = document.getElementById('gachaBtn');
  gachaModal = document.getElementById('gachaModal');
  gachaResult = document.getElementById('gachaResult');
  closeGachaBtn = document.getElementById('closeGachaBtn');
  logEl = document.getElementById('log');
}

export function log(msg){
  if(!logEl) initDOMRefs();
  const li = document.createElement('li');
  li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logEl.prepend(li);
  while(logEl.children.length > 20) logEl.removeChild(logEl.lastChild);
}

export function showSaveIndicator(){
  const indicator = document.createElement('div');
  indicator.className = 'save-indicator';
  indicator.textContent = '💾 Saved';
  document.body.appendChild(indicator);
  setTimeout(() => indicator.classList.add('show'), 10);
  setTimeout(() => { indicator.classList.remove('show'); setTimeout(() => indicator.remove(), 300); }, 1500);
}

export function showErrorToast(message, duration = 4000){
  try{ const t = document.createElement('div'); t.className = 'error-toast'; t.textContent = message; document.body.appendChild(t); void t.offsetWidth; t.classList.add('visible'); setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=>t.remove(),400); }, duration); }catch(e){ console.warn('Failed to show toast', e); }
}

export function showInfoToast(message, duration = 3500){
  try{ const t = document.createElement('div'); t.className = 'info-toast'; t.textContent = message; document.body.appendChild(t); void t.offsetWidth; t.classList.add('visible'); setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, duration); }catch(e){ console.warn('Failed to show info toast', e); }
}

export function createFloatingText(x, y, text, color){
  if(!battleGridEl) initDOMRefs();
  const enemiesContainer = document.getElementById('enemiesContainer');
  if(!enemiesContainer) return;
  const floatText = document.createElement('div');
  floatText.className = 'floating-text';
  floatText.style.left = `${x * (100 / GRID_COLS)}%`;
  floatText.style.top = `${y * (100 / GRID_ROWS)}%`;
  floatText.style.color = color;
  floatText.textContent = text;
  enemiesContainer.appendChild(floatText);
  setTimeout(() => floatText.remove(), 1000);
}

export function createBattleGrid(){
  if(!battleGridEl) initDOMRefs();
  const existingPhaser = battleGridEl.querySelector('#phaserContainer');
  if(existingPhaser) existingPhaser.remove();
  battleGridEl.innerHTML = '';
  cellElements.length = 0;
  _enemyEls.clear(); _projEls.clear();
  state.cells.forEach((cell, idx) => {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    if(cell.isPath) cellEl.classList.add('path'); else cellEl.classList.add('placeable');
    battleGridEl.appendChild(cellEl);
    cellElements[idx] = cellEl;
  });
  const enemiesContainer = document.createElement('div'); enemiesContainer.id='enemiesContainer'; enemiesContainer.style.position='absolute'; enemiesContainer.style.left='0'; enemiesContainer.style.top='0'; enemiesContainer.style.width='100%'; enemiesContainer.style.height='100%'; enemiesContainer.style.pointerEvents='none'; battleGridEl.appendChild(enemiesContainer);
  if(existingPhaser) battleGridEl.appendChild(existingPhaser);
}

export function updateBattleGrid(){
  state.cells.forEach((cell, idx) => {
    const el = cellElements[idx]; if(!el) return;
    el.className = 'cell'; if(cell.isPath) el.classList.add('path');
    if(cell.defender){ el.classList.add('has-defender'); const upgradeLevel = cell.defender.upgradeLevel || 0; const levelBadge = upgradeLevel>0?`<span class="upgrade-badge">+${upgradeLevel}</span>`:''; const upgradeCost = Math.floor((cell.defender.cost||50)*0.5*(upgradeLevel+1)); const sellValue = Math.floor(((cell.defender.cost||50)+(cell.defender.totalCost||0))*0.7); const abilityIcon = cell.defender.ability?getAbilityIcon(cell.defender.ability):''; const kgScale = cell.defender.kg?1+(cell.defender.kgBonus-1)*0.5:1; const kgInfo = cell.defender.kg?`<div class="info-line">⚖️ ${cell.defender.kg}kg</div>`:''; const rarityColors={common:'#95a5a6',rare:'#3498db',epic:'#9b59b6',legendary:'#f39c12',mythic:'#ff1493'}; const rarityColor = rarityColors[cell.defender.rarity]||'#95a5a6'; const variantBadge = cell.defender.variant==='rainbow'?'<div class="variant-badge rainbow">🌈</div>':cell.defender.variant==='gold'?'<div class="variant-badge">🌟</div>':''; const enchantInfo = cell.defender.enchantLevel>0?`<div class="info-line">✨ +${cell.defender.enchantLevel}</div>`:''; 
      // Use data-action attributes for event delegation instead of inline onclick
      el.innerHTML = `${variantBadge}<div class="defender" style="font-size: ${32*kgScale}px; filter: drop-shadow(0 0 4px ${rarityColor})">${cell.defender.emoji}</div>${levelBadge}<div class="defender-info"><div class="info-line" style="color:${rarityColor}">${cell.defender.rarity.toUpperCase()}</div><div class="info-line">💪 ${Math.floor(cell.defender.damage)}</div><div class="info-line">📏 ${cell.defender.range.toFixed(1)}</div><div class="info-line">⚡ ${cell.defender.attackSpeed.toFixed(2)}s</div>${kgInfo}${enchantInfo}${abilityIcon?`<div class="info-line">${abilityIcon} ${getAbilityName(cell.defender.ability)}</div>`:''}</div><div class="defender-controls"><button class="control-btn upgrade-btn" data-action="upgrade" data-idx="${idx}" title="Upgrade (+20% stats for ${upgradeCost} coins)">⬆️</button><button class="control-btn move-btn" data-action="move" data-idx="${idx}" title="Move to another location">🔄</button><button class="control-btn remove-btn" data-action="remove" data-idx="${idx}" title="Return pet to inventory">↩️</button><button class="control-btn sell-btn" data-action="sell" data-idx="${idx}" title="⚠️ SELL for ${sellValue} coins (GONE FOREVER!)">💰</button></div>`; }
    else { el.innerHTML=''; if(!cell.isPath){ el.classList.add('placeable'); if(state.selectedDefender){ el.classList.add('ready-to-place'); el.innerHTML = `<div class="pet-preview">${state.selectedDefender.emoji}</div>`; } } }
  });
}

export function renderShop(){ if(!shopEl) initDOMRefs(); shopEl.innerHTML=''; (window.PET_DEFENDERS||[]).slice(0,6).forEach(pet=>{ const div=document.createElement('div'); div.className=`shop-item ${pet.rarity}`; div.innerHTML=`<div class="shop-emoji">${pet.emoji}</div><div class="shop-info"><strong>${pet.name}</strong><div class="shop-rarity">${pet.rarity}</div></div>`; div.title = `${pet.description}\nDamage: ${pet.damage}, Range: ${pet.range}`; shopEl.appendChild(div); }); }

export function renderInventory(){ if(!inventoryEl) initDOMRefs(); inventoryEl.innerHTML=''; const inventoryHeader = document.querySelector('#inventorySection h3'); if(inventoryHeader) inventoryHeader.textContent = `Your Pets (${state.ownedPets.length})`; if(state.ownedPets.length===0){ inventoryEl.innerHTML='<p class="hint">No pets! Use gacha to get more.</p>'; return; } state.ownedPets.forEach(pet=>{ const div=document.createElement('div'); div.className=`inventory-item ${pet.rarity}`; if(state.selectedDefender && state.selectedDefender.uniqueId===pet.uniqueId) div.classList.add('selected'); const abilityIcon = pet.ability?getAbilityIcon(pet.ability):''; const kgScale = pet.kg?1+(pet.kgBonus-1)*0.5:1; const kgDisplay = pet.kg?` ⚖️${pet.kg}kg` : ''; const variantBadge = pet.variant==='rainbow'?'<div class="variant-badge rainbow">🌈</div>':pet.variant==='gold'?'<div class="variant-badge">🌟</div>':''; const enchantDisplay = pet.enchantLevel>0?` ✨+${pet.enchantLevel}`:''; div.innerHTML = `${variantBadge}<div class="inv-emoji" style="font-size: ${32*kgScale}px">${pet.emoji}</div><div class="inv-name">${pet.name}${enchantDisplay}</div><div class="inv-stats">💪${Math.floor(pet.damage)} 📏${pet.range.toFixed(1)}${abilityIcon? ' '+abilityIcon : ''}${kgDisplay}</div>`; div.title = `${pet.description}\nDamage: ${Math.floor(pet.damage)}, Range: ${pet.range.toFixed(1)}, Speed: ${pet.attackSpeed.toFixed(2)}s${pet.kg?`\nWeight: ${pet.kg}kg (${Math.round(pet.kgBonus*100)}% stats)`:''}${pet.variant?`\nVariant: ${pet.variant.toUpperCase()} (+${pet.variant==='rainbow'?'100':'50'}%)`:''}${pet.enchantLevel>0?`\nEnchant: +${pet.enchantLevel} (${Math.round(pet.enchantBonus*100)}% bonus)`:''}${pet.ability?`\nAbility: ${getAbilityName(pet.ability)}`:''}\nClick to select for deployment`; div.style.position='relative'; div.addEventListener('click', ()=>{ state.selectedDefender = pet; log(`✅ Selected ${pet.name} - Click on a placeable cell to deploy!`); renderInventory(); renderShop(); }); inventoryEl.appendChild(div); }); }

export function updateUI(){ if(!coinsEl) initDOMRefs(); coinsEl.textContent = Math.floor(state.coins); gemsEl.textContent = Math.floor(state.gems); livesEl.textContent = state.lives; if(state.isWaveActive && state.enemies.length>0){ const totalEnemiesInWave = state.totalEnemiesInWave || state.enemies.length; const remaining = state.enemies.length; const defeated = totalEnemiesInWave - remaining; waveNumberEl.textContent = `${state.wave} 🎯 ${defeated}/${totalEnemiesInWave}`; } else { waveNumberEl.textContent = `${state.wave}`; } let pauseOverlay = document.getElementById('pauseOverlay'); if(state.isPaused && state.isWaveActive){ if(!pauseOverlay){ pauseOverlay = document.createElement('div'); pauseOverlay.id='pauseOverlay'; pauseOverlay.className='pause-overlay'; pauseOverlay.innerHTML='⏸️ PAUSED<br><small style="font-size:0.5em;font-weight:400">Press P to Resume</small>'; document.body.appendChild(pauseOverlay); } } else if(pauseOverlay) { pauseOverlay.remove(); } updateBattleGrid(); renderEnemies(); }

export function updateShopAndInventory(){ renderShop(); renderInventory(); }

export function renderEnemies(){ if(!document.getElementById('enemiesContainer')){ const wrapper = document.createElement('div'); wrapper.id='enemiesContainer'; if(battleGridEl) battleGridEl.appendChild(wrapper); } const enemiesContainer = document.getElementById('enemiesContainer'); if(!enemiesContainer) return; const activeEnemyIds = new Set(); state.enemies.forEach(enemy => { if(enemy.spawnDelay>0) return; activeEnemyIds.add(enemy.id); if(!_enemyEls.has(enemy.id)){ const enemyEl = document.createElement('div'); enemyEl.className='enemy'; enemyEl.dataset.enemyId = enemy.id; enemyEl.style.width = `${100/GRID_COLS}%`; enemyEl.style.height = `${100/GRID_ROWS}%`; enemyEl.style.position='absolute'; enemyEl.style.left='0'; enemyEl.style.top='0'; enemyEl.innerHTML = `<div class="enemy-emoji">${enemy.emoji}</div><div class="status-effects"></div><div class="enemy-hp-text">${Math.max(0,Math.floor(enemy.hp))}/${Math.floor(enemy.maxHp)}</div>${state.showHitboxes?'<div class="enemy-hitbox" title="hitbox"></div>':''}`; enemiesContainer.appendChild(enemyEl); _enemyEls.set(enemy.id, enemyEl); } else { const enemyEl = _enemyEls.get(enemy.id); const hpEl = enemyEl.querySelector('.enemy-hp-text'); if(hpEl) hpEl.textContent = `${Math.max(0,Math.floor(enemy.hp))}/${Math.floor(enemy.maxHp)}`; const statusEl = enemyEl.querySelector('.status-effects'); if(statusEl){ let status=''; if(enemy.poisonStacks>0) status+='☠️'; if(enemy.burnTimer) status+='🔥'; if(enemy.slowDuration>0) status+='❄️'; if(enemy.stunned) status+='⭐'; statusEl.textContent = status; } const hitbox = enemyEl.querySelector('.enemy-hitbox'); if(state.showHitboxes && !hitbox) enemyEl.insertAdjacentHTML('beforeend','<div class="enemy-hitbox" title="hitbox"></div>'); else if(!state.showHitboxes && hitbox) hitbox.remove(); } }); for(const [id, el] of _enemyEls.entries()){ if(!activeEnemyIds.has(id)){ el.remove(); _enemyEls.delete(id); } }
  const activeProjIds = new Set(); state.projectiles.forEach(proj => { activeProjIds.add(proj.id); if(!_projEls.has(proj.id)){ const projEl = document.createElement('div'); projEl.className='projectile'; projEl.dataset.projId = proj.id; projEl.style.width = `${100/GRID_COLS}%`; projEl.style.height = `${100/GRID_ROWS}%`; projEl.style.position='absolute'; projEl.style.left='0'; projEl.style.top='0'; const projectileEmoji = proj.ability==='poison'?'☠️':proj.ability==='splash'?'💥':proj.ability==='slow'?'❄️':proj.ability==='stun'?'⭐':proj.ability==='lifesteal'?'💚':proj.ability==='burn'?'🔥':proj.ability==='multishot'?'🎯':proj.damage>=70?'🔥':proj.damage>=40?'⚡':proj.damage>=25?'✨':'💫'; projEl.innerHTML = `${projectileEmoji}${state.showHitboxes?'<div class="projectile-hitbox" title="proj-hit"></div>':''}`; enemiesContainer.appendChild(projEl); _projEls.set(proj.id, projEl); } else { const projEl = _projEls.get(proj.id); const hitbox = projEl.querySelector('.projectile-hitbox'); if(state.showHitboxes && !hitbox) projEl.insertAdjacentHTML('beforeend','<div class="projectile-hitbox" title="proj-hit"></div>'); else if(!state.showHitboxes && hitbox) hitbox.remove(); } }); for(const [id, el] of _projEls.entries()){ if(!activeProjIds.has(id)){ el.remove(); _projEls.delete(id); } } }

let rafId = null;
export function startRenderLoop(){ function frame(){ const grid = battleGridEl ? battleGridEl.getBoundingClientRect() : null; if(grid){ for(const [id, el] of _enemyEls.entries()){ const enemy = state.enemies.find(e => e.id === id); if(!enemy) continue; const relX = (enemy.position.col / GRID_COLS) * grid.width; const relY = (enemy.position.row / GRID_ROWS) * grid.height; el.style.transform = `translate3d(${relX}px, ${relY}px, 0)`; } for(const [id, el] of _projEls.entries()){ const proj = state.projectiles.find(p => p.id === id); if(!proj) continue; const relX = (proj.x / GRID_COLS) * grid.width; const relY = (proj.y / GRID_ROWS) * grid.height; el.style.transform = `translate3d(${relX}px, ${relY}px, 0)`; } } rafId = requestAnimationFrame(frame); } if(!rafId) frame(); return ()=>{ if(rafId) cancelAnimationFrame(rafId); rafId = null; }; }

export function createImpactEffect(x,y){ const enemiesContainer = document.getElementById('enemiesContainer'); if(!enemiesContainer) return; const impact = document.createElement('div'); impact.className = 'impact-effect'; impact.style.left = `${x * (100 / GRID_COLS)}%`; impact.style.top = `${y * (100 / GRID_ROWS)}%`; impact.innerHTML = '💥'; enemiesContainer.appendChild(impact); setTimeout(()=>impact.remove(), 500); }

export function showStats(){ const statsModal = document.getElementById('statsModal'); const statsDisplay = document.getElementById('statsDisplay'); if(!state.stats) state.stats = {}; statsDisplay.innerHTML = `<div style="text-align:left;line-height:1.8"><div>🏆 Highest Wave: <strong>${state.stats.highestWave || state.wave}</strong></div><div>✅ Waves Completed: <strong>${state.stats.wavesCompleted || 0}</strong></div><div>💀 Enemies Defeated: <strong>${state.stats.totalEnemiesDefeated || 0}</strong></div><div>💥 Total Damage Dealt: <strong>${Math.floor(state.stats.totalDamageDealt || 0)}</strong></div><div>💰 Total Coins Earned: <strong>${state.stats.totalCoinsEarned || 0}</strong></div><div>💎 Total Gems Earned: <strong>${state.stats.totalGemsEarned || 0}</strong></div><div>🎲 Gacha Rolls: <strong>${state.stats.gachaRolls || 0}</strong></div><div>🐾 Pets Owned: <strong>${state.ownedPets.length}</strong></div><div>🛡️ Defenders Placed: <strong>${state.defenders.length}</strong></div></div>`; statsModal.classList.remove('hidden'); }

export function showEnchantModal(){
  const enchantModal = document.getElementById('enchantModal');
  const enchantContent = document.getElementById('enchantContent');
  if(!enchantModal || !enchantContent) return;
  if(!state.ownedPets || state.ownedPets.length === 0){
    enchantContent.innerHTML = '<p style="text-align:center;color:#888;">No pets in inventory to enchant!</p>';
    enchantModal.classList.remove('hidden');
    return;
  }
  let html = '<div class="enchant-list">';
  state.ownedPets.forEach(pet => {
    const enchantLevel = pet.enchantLevel || 0;
    const enchantCost = Math.floor(100 * Math.pow(1.5, enchantLevel));
    const canAfford = state.gems >= enchantCost;
    const variantBadge = pet.variant === 'rainbow' ? '🌈' : pet.variant === 'gold' ? '🌟' : '';
    html += `
      <div class="enchant-item" style="${canAfford ? '' : 'opacity:0.5'}">
        <div class="enchant-emoji">${pet.emoji}${variantBadge}</div>
        <div class="enchant-info">
          <div style="font-weight:600">${pet.name}${enchantLevel > 0 ? `<span class="enchant-level">✨+${enchantLevel}</span>` : ''}</div>
          <div style="font-size:0.8rem;color:#aaa;">${pet.rarity} | 💪${Math.floor(pet.damage)} 📏${pet.range.toFixed(1)}</div>
          <div class="enchant-cost">Cost: ${enchantCost} gems 💎</div>
        </div>
        <button class="enchant-btn" data-action="enchant" data-idx="${pet.uniqueId}" ${!canAfford ? 'disabled' : ''} style="padding:8px 16px;background:${canAfford ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#555'}; color:white;border:none;border-radius:6px;cursor:${canAfford ? 'pointer' : 'not-allowed'}; font-weight:600;white-space:nowrap">
          ✨ Enchant
        </button>
      </div>
    `;
  });
  html += '</div>';
  enchantContent.innerHTML = html;
  enchantModal.classList.remove('hidden');
}

// Delegated click handling for UI actions (upgrade/move/remove/sell/enchant/place)
document.addEventListener('click', (ev) => {
  try{
    const btn = ev.target.closest && ev.target.closest('[data-action]');
    if(btn){
      const action = btn.getAttribute('data-action');
      const idx = btn.getAttribute('data-idx');
      if(window && window.GameAPI && typeof window.GameAPI[action] === 'function'){
        // numeric idx -> convert
        const parsedIdx = idx !== null ? parseInt(idx, 10) : undefined;
        window.GameAPI[action](parsedIdx);
      } else {
        console.warn('No GameAPI handler for', action);
      }
      ev.stopPropagation();
      ev.preventDefault();
      return;
    }

    // Placeable cell click -> deploy selected pet
    const cellEl = ev.target.closest && ev.target.closest('.cell.placeable');
    if(cellEl && cellElements.length > 0){
      const idx = cellElements.indexOf(cellEl);
      if(idx >= 0){
        if(window && window.GameAPI && typeof window.GameAPI.place === 'function'){
          window.GameAPI.place(idx);
        }
      }
    }
  }catch(e){ console.warn('UI delegation error', e); }
});
