// script.js — minimal bootstrap (final)
import * as UI from './src/ui.js';
import { state, STARTING_COINS, STARTING_GEMS, STARTING_LIVES } from './src/state.js';
import * as Waves from './src/game/waves.js';
import * as Defenders from './src/game/defenders.js';
import * as Projectiles from './src/game/projectiles.js';
import * as Abilities from './src/game/abilities.js';
import * as Gacha from './src/game/gacha.js';
import * as Auth from './src/game/auth.js';
import { save as persistenceSave, load as persistenceLoad } from './src/persistence.js';

// Minimal GameAPI used by UI delegation
window.GameAPI = window.GameAPI || {};
Object.assign(window.GameAPI, {
  upgrade: Defenders.upgradeDefender,
  sell: Defenders.sellDefender,
  move: Defenders.moveDefender,
  remove: Defenders.removeDefender,
  enchant: Defenders.enchantPet || null,
  place: Defenders.placeDefender,
  createProjectile: Projectiles.createProjectile,
  applyAbility: Abilities.applyAbility,
  spawnWave: Waves.spawnWave,
  rollGacha: Gacha.rollGacha,
  openGacha: Gacha.openGacha,
  save: persistenceSave,
  auth: Auth
});

// Lightweight loop and init
let __pd_last = Date.now();
const __pd_tick = 100;
function __pd_loop(){
  const now = Date.now();
  const dtMs = now - __pd_last;
  const dtSec = (dtMs/1000) * (state.gameSpeed || 1);
  if(dtMs >= __pd_tick){
    if(state.isWaveActive && !state.isPaused){
      Waves.updateEnemies?.(dtSec);
      Defenders.updateDefenders?.(dtSec);
      Projectiles.updateProjectiles?.(dtSec);
      UI.updateUI?.();
    } else if(state.isWaveActive && state.isPaused){
      UI.updateUI?.();
    }
    __pd_last = now;
  }
  requestAnimationFrame(__pd_loop);
}

function __pd_init(){
  persistenceLoad?.();
  if(state.coins === undefined) state.coins = STARTING_COINS;
  if(state.gems === undefined) state.gems = STARTING_GEMS;
  if(state.lives === undefined) state.lives = STARTING_LIVES;
  UI.createBattleGrid?.();
  UI.updateShopAndInventory?.();
  UI.updateUI?.();
  __pd_last = Date.now();
  __pd_loop();
  UI.startRenderLoop?.();
  const el = document.getElementById('battleGrid');
  if(el) import('./phaserRenderer.js').then(m=>m?.initPhaser?.(state)).catch(()=>{});
}

__pd_init();

// Debug helper
window.__PetDefense = { state, UI, Waves, Defenders, Projectiles, Abilities, Gacha, Auth };

// Initialize battle grid
function initCells(){
  state.cells = [];
  for(let row = 0; row < GRID_ROWS; row++){
    for(let col = 0; col < GRID_COLS; col++){
      const isPath = PATH.some(p => p.row === row && p.col === col);
      state.cells.push({
        row,
        col,
        isPath,
        defender: null
      });
    }
  }
}

// Initialize with starter pets
function initStarterPets(){
  // Only seed starter pets once per browser using persistent flag
  const seeded = localStorage.getItem('petdefense_seeded');
  if(seeded === 'true') return;
  if(state.ownedPets.length === 0){
    // Give player 2 basic pets to start with kg system
    const pet1 = { ...PET_DEFENDERS[0], uniqueId: Date.now() + '_1' };
    const pet2 = { ...PET_DEFENDERS[1], uniqueId: Date.now() + '_2' };
    
    // Add kg to starter pets
    pet1.kg = generatePetKg('common');
    pet1.kgBonus = getKgBonus(pet1.kg, 'common');
    pet1.variant = null;
    pet1.variantBonus = 1.0;
    pet1.enchantLevel = 0;
    pet1.enchantBonus = 0;
    pet1.damage = Math.floor(pet1.damage * pet1.kgBonus);
    pet1.range = pet1.range * pet1.kgBonus;
    pet1.attackSpeed = pet1.attackSpeed / Math.sqrt(pet1.kgBonus);
    
    pet2.kg = generatePetKg('common');
    pet2.kgBonus = getKgBonus(pet2.kg, 'common');
    pet2.variant = null;
    pet2.variantBonus = 1.0;
    pet2.enchantLevel = 0;
    pet2.enchantBonus = 0;
    pet2.damage = Math.floor(pet2.damage * pet2.kgBonus);
    pet2.range = pet2.range * pet2.kgBonus;
    pet2.attackSpeed = pet2.attackSpeed / Math.sqrt(pet2.kgBonus);
    
    state.ownedPets.push(pet1, pet2);
    localStorage.setItem('petdefense_seeded', 'true');
  }
}

// Add a pet to inventory with optional dedupe behavior by uniqueId.
// Returns true if added, false if skipped due to duplicate uniqueId.
function addPetToInventory(pet, options = { dedupe: true }){
  if(!pet) return false;
  if(!pet.uniqueId) pet.uniqueId = Date.now() + '_' + Math.random();
  if(options.dedupe) {
    const exists = state.ownedPets.some(p => p.uniqueId === pet.uniqueId);
    if(exists){
      // Avoid silently duplicating the same pet instance. Log for debugging.
      log(`⚠️ Duplicate pet prevented from returning: ${pet.name} (${pet.uniqueId})`);
      return false;
    }
  }
  state.ownedPets.push(pet);
  return true;
}

/* --- Utilities --- */
function log(msg){
  return UI.log(msg);
}

function save(){
  // Delegate to persistence module and pass functions it may call back
  persistenceSave(currentUser, isGuest, UI.showSaveIndicator, UI.showErrorToast);
}

function showSaveIndicator(){
  return UI.showSaveIndicator();
}

// Small on-screen toast for error messages (non-blocking)
function showErrorToast(message, duration = 4000){
  return UI.showErrorToast(message, duration);
}

// Small on-screen informational toast (non-blocking)
function showInfoToast(message, duration = 3500){
  return UI.showInfoToast(message, duration);
}

function load(){
  persistenceLoad();
}

/* --- Gacha System --- */
// Utility functions (distance, getCellCenter, generatePetKg, getKgBonus) imported from ./src/utils.js

function rollGacha(){
  const roll = Math.random();
  let cumulative = 0;
  let rarity = 'common';
  
  for(const [r, rate] of Object.entries(GACHA_RATES)){
    cumulative += rate;
    if(roll < cumulative){
      rarity = r;
      break;
    }
  }
  
  // Get pets of this rarity
  const pool = PET_DEFENDERS.filter(p => p.rarity === rarity);
  const pet = pool[Math.floor(Math.random() * pool.length)];
  
  // Generate weight and apply bonuses
  const kg = generatePetKg(rarity);
  const kgBonus = getKgBonus(kg, rarity);
  
  // Variant system - 5% chance for gold, 1% chance for rainbow
  let variant = null;
  let variantBonus = 1.0;
  const variantRoll = Math.random();
  
  if(variantRoll < 0.01){ // 1% chance for rainbow
    variant = 'rainbow';
    variantBonus = 2.0; // +100% bonus
  } else if(variantRoll < 0.06){ // 5% chance for gold (1% + 5% = 6% total)
    variant = 'gold';
    variantBonus = 1.5; // +50% bonus
  }
  
  return {
    ...pet,
    uniqueId: Date.now() + '_' + Math.random(),
    kg: kg,
    kgBonus: kgBonus,
    variant: variant,
    variantBonus: variantBonus,
    enchantLevel: 0, // NEW: Enchant level starts at 0
    enchantBonus: 0, // NEW: Enchant bonus starts at 0
    damage: Math.floor(pet.damage * kgBonus * variantBonus),
    range: pet.range * kgBonus * variantBonus,
    attackSpeed: pet.attackSpeed / Math.sqrt(kgBonus * variantBonus) // Better pets attack slightly faster
  };
}

function openGacha(){
  if(state.gems < GACHA_COST){
    log(`⚠️ Not enough gems! Need ${GACHA_COST} gems.`);
    return;
  }
  
  state.gems -= GACHA_COST;
  const newPet = rollGacha();
  
  // Check auto-sell setting
  const autoSellCheckbox = document.getElementById('autoSellCommon');
  const autoSellEnabled = autoSellCheckbox && autoSellCheckbox.checked;
  
  let autoSold = false;
  let sellValue = 0;
  
  // Auto-sell logic: sell common duplicates (keep one copy of each common pet)
  if(autoSellEnabled && newPet.rarity === 'common'){
    // Check if we already have this pet type
    const existingPet = state.ownedPets.find(p => p.id === newPet.id);
    if(existingPet){
      // We have a duplicate - auto-sell it
      sellValue = Math.floor(newPet.cost * 0.5); // 50% of cost for auto-sold pets
      state.coins += sellValue;
      autoSold = true;
      log(`💰 Auto-sold duplicate ${newPet.name} for ${sellValue} coins!`);
    }
  }
  
  // Only add to inventory if not auto-sold
  if(!autoSold){
    state.ownedPets.push(newPet);
  }
  
  // Track gacha rolls
  if(!state.stats) state.stats = {};
  state.stats.gachaRolls = (state.stats.gachaRolls || 0) + 1;
  
  // Show result
  const kgQuality = newPet.kgBonus > 1.2 ? '⭐ HEAVY!' : newPet.kgBonus < 0.9 ? '⚠️ Light' : '✓ Normal';
  const variantDisplay = newPet.variant === 'rainbow' ? '<div class="variant-badge rainbow">🌈 RAINBOW +100%</div>' : 
                         newPet.variant === 'gold' ? '<div class="variant-badge">🌟 GOLD +50%</div>' : '';
  const autoSoldMessage = autoSold ? `<div style="margin-top:12px;padding:8px;background:rgba(255,215,0,0.2);border:1px solid rgba(255,215,0,0.4);border-radius:6px;">
      <strong>✅ Auto-Sold!</strong><br>
      Duplicate common pet sold for <strong>${sellValue} coins</strong>
    </div>` : '';
  
  gachaResult.innerHTML = `
    <div class="gacha-reveal ${newPet.rarity}" style="position:relative">
      ${variantDisplay}
      <div class="gacha-emoji">${newPet.emoji}</div>
      <h3>${newPet.name}</h3>
      <div class="rarity-badge ${newPet.rarity}">${newPet.rarity.toUpperCase()}</div>
      <p>${newPet.description}</p>
      <div class="stats">
        <div>💪 Damage: ${Math.floor(newPet.damage)}</div>
        <div>📏 Range: ${newPet.range.toFixed(1)}</div>
        <div>⚡ Speed: ${newPet.attackSpeed.toFixed(2)}s</div>
        <div>⚖️ Weight: ${newPet.kg}kg ${kgQuality}</div>
        <div style="font-size:0.85rem;color:#aaa;margin-top:4px">Stats: ${Math.round(newPet.kgBonus * newPet.variantBonus * 100)}%</div>
        ${newPet.variant ? `<div style="font-size:0.9rem;color:${newPet.variant === 'rainbow' ? '#ff00ff' : '#ffd700'};margin-top:4px;font-weight:600">✨ ${newPet.variant.toUpperCase()} VARIANT!</div>` : ''}
      </div>
      ${autoSoldMessage}
    </div>
  `;
  
  gachaModal.classList.remove('hidden');
  log(`🎲 Rolled ${newPet.rarity} ${newPet.name}!`);
  save();
  updateUI();
  updateShopAndInventory();
}

/* --- Wave/Enemy System --- */
function spawnWave(){
  if(state.isWaveActive) return;

  // Clear any lingering pause state/overlay and ensure UI is in a running state
  state.isPaused = false;
  const pauseOverlay = document.getElementById('pauseOverlay');
  if(pauseOverlay) pauseOverlay.remove();

  state.isWaveActive = true;
  startWaveBtn.disabled = true;
  startWaveBtn.textContent = '⏳ Wave In Progress...';
  if(startWaveBtn && typeof startWaveBtn.blur === 'function') startWaveBtn.blur();

  // Show pause button
  const pauseBtn = document.getElementById('pauseBtn');
  if(pauseBtn){
    pauseBtn.style.display = 'inline-block';
    pauseBtn.textContent = '⏸️ Pause';
    if(typeof pauseBtn.blur === 'function') pauseBtn.blur();
  }

  // Prepare enemy wave
  if(typeof state.enemyIdCounter === 'undefined') state.enemyIdCounter = 0;
  const baseEnemies = 5 + Math.floor((state.wave || 1) * 1.5);
  const waveEnemies = [];
  for(let i = 0; i < baseEnemies; i++){
    const enemyType = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
    const scaledHp = Math.floor(enemyType.hp * (1 + (state.wave || 1) * 0.05));
    waveEnemies.push({
      ...enemyType,
      maxHp: scaledHp,
      hp: scaledHp,
      pathIndex: 0,
      position: { ...PATH[0] },
      progress: 0,
      id: state.enemyIdCounter++,
      spawnDelay: i * 0.5 // stagger spawns
    });
  }

  state.enemies = waveEnemies;
  state.totalEnemiesInWave = baseEnemies; // for progress display
  log(`🌊 Wave ${state.wave} started! ${baseEnemies} enemies incoming!`);
}

function completeWave(){
  state.isWaveActive = false;
  state.isPaused = false;
  state.wave++;
  
  const coinReward = 80 + state.wave * 15;
  const gemReward = 10 + Math.floor(state.wave / 2);
  state.coins += coinReward;
  state.gems += gemReward;
  
  // Track statistics
  if(!state.stats) state.stats = {};
  state.stats.wavesCompleted = (state.stats.wavesCompleted || 0) + 1;
  state.stats.highestWave = Math.max(state.stats.highestWave || 1, state.wave);
  state.stats.totalCoinsEarned = (state.stats.totalCoinsEarned || 0) + coinReward;
  state.stats.totalGemsEarned = (state.stats.totalGemsEarned || 0) + gemReward;
  
  log(`✅ Wave completed! +${coinReward} coins, +${gemReward} gems`);
  
  startWaveBtn.disabled = false;
  startWaveBtn.textContent = '▶️ Start Next Wave';
  
  // Hide pause button
  const pauseBtn = document.getElementById('pauseBtn');
  if(pauseBtn) pauseBtn.style.display = 'none';
  
  save();
  
  // Auto-start next wave if enabled
  const autoStartCheckbox = document.getElementById('autoStartWave');
  if(autoStartCheckbox && autoStartCheckbox.checked){
    setTimeout(() => {
      if(!state.isWaveActive){ // Double check wave isn't already active
        spawnWave();
      }
    }, 2000); // 2 second delay before auto-starting next wave
  }
}

/* --- Ability System --- */
function applyAbility(ability, targetEnemy, damage, x, y){
  switch(ability){
    case 'poison':
      // Apply damage over time
      if(!targetEnemy.poisonStacks) targetEnemy.poisonStacks = 0;
      targetEnemy.poisonStacks = Math.min(targetEnemy.poisonStacks + 1, 3); // Max 3 stacks
      if(!targetEnemy.poisonTimer){
        targetEnemy.poisonTimer = setInterval(() => {
          if(targetEnemy.hp > 0 && targetEnemy.poisonStacks > 0){
            const poisonDamage = Math.floor(damage * 0.1 * targetEnemy.poisonStacks);
            targetEnemy.hp -= poisonDamage;
            createFloatingText(targetEnemy.position.col + 0.5, targetEnemy.position.row + 0.5, `☠️-${poisonDamage}`, '#00ff00');
            targetEnemy.poisonStacks--;
          } else {
            clearInterval(targetEnemy.poisonTimer);
            targetEnemy.poisonTimer = null;
            targetEnemy.poisonStacks = 0;
          }
        }, 1000);
      }
      break;
      
    case 'splash':
      // Damage nearby enemies
      state.enemies.forEach(enemy => {
        if(enemy === targetEnemy || enemy.spawnDelay > 0) return;
        const enemyPos = { x: enemy.position.col + 0.5, y: enemy.position.row + 0.5 };
        const dist = distance(x, y, enemyPos.x, enemyPos.y);
        if(dist < 1.5){ // Splash radius
          const splashDamage = Math.floor(damage * 0.4);
          enemy.hp -= splashDamage;
          createFloatingText(enemy.position.col + 0.5, enemy.position.row + 0.5, `-${splashDamage}`, '#ff9900');
        }
      });
      break;
      
    case 'slow':
      // Slow enemy movement
      if(!targetEnemy.slowDuration){
        targetEnemy.originalSpeed = targetEnemy.speed;
      }
      targetEnemy.speed = targetEnemy.originalSpeed * 0.5;
      targetEnemy.slowDuration = 3; // 3 seconds
      setTimeout(() => {
        if(targetEnemy.slowDuration){
          targetEnemy.slowDuration--;
          if(targetEnemy.slowDuration === 0){
            targetEnemy.speed = targetEnemy.originalSpeed;
          }
        }
      }, 1000);
      break;
      
    case 'stun':
      // Stun enemy briefly (20% chance)
      if(Math.random() < 0.2){
        targetEnemy.stunned = true;
        targetEnemy.originalSpeed = targetEnemy.speed;
        targetEnemy.speed = 0;
        createFloatingText(targetEnemy.position.col + 0.5, targetEnemy.position.row + 0.5, '⭐STUN', '#ffff00');
        setTimeout(() => {
          targetEnemy.stunned = false;
          targetEnemy.speed = targetEnemy.originalSpeed;
        }, 1500);
      }
      break;
      
    case 'lifesteal':
      // Heal the tower (not implemented as towers don't have HP, but give bonus coins)
      const heal = Math.floor(damage * 0.15);
      state.coins += heal;
      createFloatingText(x, y, `+${heal}💰`, '#00ff00');
      break;
      
    case 'burn':
      // Apply burning damage over time
      if(!targetEnemy.burnTimer){
        let burnTicks = 5;
        targetEnemy.burnTimer = setInterval(() => {
          if(targetEnemy.hp > 0 && burnTicks > 0){
            const burnDamage = Math.floor(damage * 0.15);
            targetEnemy.hp -= burnDamage;
            createFloatingText(targetEnemy.position.col + 0.5, targetEnemy.position.row + 0.5, `🔥-${burnDamage}`, '#ff4400');
            burnTicks--;
          } else {
            clearInterval(targetEnemy.burnTimer);
            targetEnemy.burnTimer = null;
          }
        }, 800);
      }
      break;
  }
}

// Create floating damage/effect text
function createFloatingText(x, y, text, color){
  return UI.createFloatingText(x, y, text, color);
}

/* --- Defender/Tower System --- */
function updateDefenders(deltaTime){
  // Simple defender targeting & attack logic
  state.defenders.forEach(def => {
    def.attackCooldown -= deltaTime;
    if(def.attackCooldown > 0) return;
    
    // find target in range
    const center = getCellCenter(def.row, def.col);
    let target = null;
    for(const e of state.enemies){
      if(e.spawnDelay > 0) continue;
      const enemyCenter = { x: e.position.col + 0.5, y: e.position.row + 0.5 };
      if(distance(center.x, center.y, enemyCenter.x, enemyCenter.y) <= def.range){
        target = e;
        break;
      }
    }
    
    if(target){
      // Add attack animation
      triggerAttackAnimation(def);
      
      // Create projectile
      createProjectile(def, target);
      
      def.attackCooldown = def.attackSpeed;
    }
  });
}

// Create projectile from defender to enemy - OVERHAULED for smooth, slow animation
//
// Positioning details:
// - Prefer precise visual centers using DOM element bounding boxes:
//   - Defender: finds the `.defender` element inside the grid cell and computes its center
//   - Enemy: finds the enemy element in `#enemiesContainer` using the `data-enemy-id` attribute
//   - Coordinates are normalized to grid-space (0..GRID_COLS, 0..GRID_ROWS) so existing renderer
//     continues to work without changes.
// - Fallback: if DOM elements aren't available (not yet rendered or query fails), the function
//   falls back to grid math (cell center + 0.5) to keep behavior robust.
// - This ensures projectiles visually spawn from the pet emoji and aim at the exact enemy icon
//   position rather than approximating using cell centers.
function createProjectile(defender, enemy){
  // Try to compute exact visual centers using DOM elements (preferred)
  let startX, startY, targetX, targetY;
  try{
    const battleGridEl = document.getElementById('battleGrid');
    const enemiesContainer = document.getElementById('enemiesContainer');

    // Defender element: find the cell element and its .defender element
    const cellIdx = defender.row * GRID_COLS + defender.col;
    const cellEl = cellElements[cellIdx];
    if(cellEl){
      const defenderEl = cellEl.querySelector('.defender');
      if(defenderEl && battleGridEl){
        const gridRect = battleGridEl.getBoundingClientRect();
        const dRect = defenderEl.getBoundingClientRect();
        const dCenterX = dRect.left + dRect.width / 2;
        const dCenterY = dRect.top + dRect.height / 2;
        // normalize to grid cells (0..cols, 0..rows)
        startX = ((dCenterX - gridRect.left) / gridRect.width) * GRID_COLS;
        startY = ((dCenterY - gridRect.top) / gridRect.height) * GRID_ROWS;
      }
    }

    // Enemy element: look up by data attribute
    if(enemiesContainer){
      const enemyEl = enemiesContainer.querySelector(`[data-enemy-id='${enemy.id}']`);
      if(enemyEl && battleGridEl){
        const gridRect = battleGridEl.getBoundingClientRect();
        const eRect = enemyEl.getBoundingClientRect();
        const eCenterX = eRect.left + eRect.width / 2;
        const eCenterY = eRect.top + eRect.height / 2;
        targetX = ((eCenterX - gridRect.left) / gridRect.width) * GRID_COLS;
        targetY = ((eCenterY - gridRect.top) / gridRect.height) * GRID_ROWS;
      }
    }
  }catch(err){
    // DOM lookups can fail if elements aren't rendered yet; fallback below
    startX = startX; targetX = targetX; // noop
  }

  // Fallback to grid-based centers if DOM-based calculation failed
  if(startX === undefined || startY === undefined){
    const defenderPos = getCellCenter(defender.row, defender.col);
    startX = defenderPos.x;
    startY = defenderPos.y;
  }
  if(targetX === undefined || targetY === undefined){
    targetX = enemy.position.col + 0.5;
    targetY = enemy.position.row + 0.5;
  }

  const projectile = {
    id: Date.now() + Math.random(),
    x: startX,
    y: startY,
    targetEnemy: enemy,
    targetX: targetX, // Store initial target position for smoother tracking
    targetY: targetY,
    damage: defender.damage,
    speed: 1.6, // cells per second - slower so projectiles visibly travel to target
    defenderName: defender.name,
    ability: defender.ability || null, // Add ability support
    startTime: Date.now(), // Track projectile lifetime for effects
    defenderEmoji: defender.emoji // Store defender emoji for visual variety
  };
  state.projectiles.push(projectile);
  
  // Multishot ability - create additional projectiles
  if(defender.ability === 'multishot'){
    const nearbyEnemies = state.enemies.filter(e => {
      if(e.spawnDelay > 0 || e === enemy) return false;
      const enemyCenter = { x: e.position.col + 0.5, y: e.position.row + 0.5 };
      const defenderCenter = getCellCenter(defender.row, defender.col);
      return distance(defenderCenter.x, defenderCenter.y, enemyCenter.x, enemyCenter.y) <= defender.range;
    }).slice(0, 2); // Up to 2 additional targets
    
    nearbyEnemies.forEach(additionalEnemy => {
      const additionalEnemyPos = { x: additionalEnemy.position.col + 0.5, y: additionalEnemy.position.row + 0.5 };
      const additionalProj = {
        id: Date.now() + Math.random(),
        x: defenderPos.x,
        y: defenderPos.y,
        targetEnemy: additionalEnemy,
        targetX: additionalEnemyPos.x,
        targetY: additionalEnemyPos.y,
        damage: Math.floor(defender.damage * 0.5), // Reduced damage for additional projectiles
        speed: 3.5, // Match main projectile speed
        defenderName: defender.name,
        ability: null, // Additional projectiles don't trigger abilities
        startTime: Date.now(),
        defenderEmoji: defender.emoji
      };
      state.projectiles.push(additionalProj);
    });
  }
}

// Update projectiles - OVERHAULED for smooth, slow, accurate tracking
function updateProjectiles(deltaTime){
  const toRemove = [];
  
  state.projectiles.forEach(proj => {
    if(!proj.targetEnemy || proj.targetEnemy.hp <= 0){
      toRemove.push(proj.id);
      return;
    }
    
    // Get current enemy position for smooth tracking
    const targetPos = { x: proj.targetEnemy.position.col + 0.5, y: proj.targetEnemy.position.row + 0.5 };
    
    // Calculate direction vector with smooth interpolation
    const dx = targetPos.x - proj.x;
    const dy = targetPos.y - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Attempt projectile DOM hitbox vs enemy DOM hitbox intersection for pixel-accurate collisions
    let collided = false;
    let enemyHitFound = false;
    try{
      if(state.useDomCollision){
        const battleGridEl = document.getElementById('battleGrid');
        const enemiesContainer = document.getElementById('enemiesContainer');
        if(battleGridEl && enemiesContainer){
          const gridRect = battleGridEl.getBoundingClientRect();
          const enemyEl = enemiesContainer.querySelector(`[data-enemy-id='${proj.targetEnemy.id}']`);
          if(enemyEl){
            const enemyHit = enemyEl.querySelector('.enemy-hitbox');
            enemyHitFound = !!enemyHit;
            // Derive projectile hitbox rect from projectile grid coords and CSS size
            const projHitSize = 18; // px - must match .projectile-hitbox in CSS
            const projCenterX = gridRect.left + (proj.x / GRID_COLS) * gridRect.width;
            const projCenterY = gridRect.top + (proj.y / GRID_ROWS) * gridRect.height;
            const projRect = {
              left: projCenterX - projHitSize / 2,
              top: projCenterY - projHitSize / 2,
              right: projCenterX + projHitSize / 2,
              bottom: projCenterY + projHitSize / 2
            };

            if(enemyHit){
              const enemyRect = enemyHit.getBoundingClientRect();
              // AABB intersection test
              const intersects = !(projRect.right < enemyRect.left || projRect.left > enemyRect.right || projRect.bottom < enemyRect.top || projRect.top > enemyRect.bottom);
              if(intersects) collided = true;
            }
          }
        }
      }
    }catch(err){
      // ignore DOM lookup errors and fallback to distance detection
    }

    // Only use distance fallback when DOM collision mode is disabled OR when DOM mode is enabled but enemy hitbox wasn't found.
    const DIST_FALLBACK = 0.25; // cells - tightened to reduce false positives
    const shouldUseDistanceFallback = !state.useDomCollision || (state.useDomCollision && !enemyHitFound);

    if(collided || (shouldUseDistanceFallback && dist < DIST_FALLBACK)){
      // Hit the target - create impact effect at exact position
      createImpactEffect(proj.x, proj.y);

      // Apply damage
      proj.targetEnemy.hp -= proj.damage;

      // Create floating damage text
      createFloatingText(targetPos.x, targetPos.y, `-${proj.damage}`, '#ff6b6b');

      // Track damage dealt
      if(!state.stats) state.stats = {};
      state.stats.totalDamageDealt = (state.stats.totalDamageDealt || 0) + proj.damage;

      // Apply special abilities
      if(proj.ability){
        applyAbility(proj.ability, proj.targetEnemy, proj.damage, proj.x, proj.y);
      }

      if(proj.targetEnemy.hp <= 0){
        log(`💥 ${proj.defenderName} defeated ${proj.targetEnemy.name} (+${proj.targetEnemy.reward} coins, +${proj.targetEnemy.gems} gems)`);
        state.coins += (proj.targetEnemy.reward || 0);
        state.gems += (proj.targetEnemy.gems || 0);

        // Track statistics
        state.stats.totalEnemiesDefeated = (state.stats.totalEnemiesDefeated || 0) + 1;
        state.stats.totalCoinsEarned = (state.stats.totalCoinsEarned || 0) + (proj.targetEnemy.reward || 0);
        state.stats.totalGemsEarned = (state.stats.totalGemsEarned || 0) + (proj.targetEnemy.gems || 0);
      }
      toRemove.push(proj.id);
    } else {
      // Smooth movement toward target with gentle easing
      const moveDistance = proj.speed * deltaTime;
      
      // Add slight homing behavior for better tracking
      const homingFactor = 0.95; // 95% direct tracking, 5% momentum
      
      // Calculate normalized direction
      const normalizedSpeed = Math.min(moveDistance, dist); // Don't overshoot
      const moveX = (dx / dist) * normalizedSpeed * homingFactor;
      const moveY = (dy / dist) * normalizedSpeed * homingFactor;
      
      // Update projectile position smoothly
      proj.x += moveX;
      proj.y += moveY;
      
      // Store velocity for potential visual effects
      proj.velocityX = moveX / deltaTime;
      proj.velocityY = moveY / deltaTime;
    }
  });
  
  state.projectiles = state.projectiles.filter(p => !toRemove.includes(p.id));
}

// Create impact effect when projectile hits enemy
function createImpactEffect(x, y){
  return UI.createImpactEffect(x, y);
}

// Handler called by external renderers (like Phaser) when they detect a projectile hit
function handlePhaserCollision(projId, enemyId){
  const projIdx = state.projectiles.findIndex(p => p.id === projId);
  const enemy = state.enemies.find(e => e.id === enemyId);
  if(projIdx === -1 || !enemy) return;
  const proj = state.projectiles[projIdx];

  // Apply damage and effects (mirror logic in updateProjectiles)
  // If Phaser is active, spawn a Phaser-native impact (visual) for nicer animation
  if(window.spawnPhaserImpact){
    try{ window.spawnPhaserImpact(proj.x, proj.y, '💥'); }catch(e){}
  } else {
    createImpactEffect(proj.x, proj.y);
  }
  enemy.hp -= proj.damage;
  createFloatingText(enemy.position.col + 0.5, enemy.position.row + 0.5, `-${proj.damage}`, '#ff6b6b');

  if(!state.stats) state.stats = {};
  state.stats.totalDamageDealt = (state.stats.totalDamageDealt || 0) + proj.damage;

  if(proj.ability){
    try{ applyAbility(proj.ability, enemy, proj.damage, proj.x, proj.y); }catch(e){}
  }

  if(enemy.hp <= 0){
    log(`💥 ${proj.defenderName} defeated ${enemy.name} (+${enemy.reward} coins, +${enemy.gems} gems)`);
    state.coins += (enemy.reward || 0);
    state.gems += (enemy.gems || 0);
    state.stats.totalEnemiesDefeated = (state.stats.totalEnemiesDefeated || 0) + 1;
    state.stats.totalCoinsEarned = (state.stats.totalCoinsEarned || 0) + (enemy.reward || 0);
    state.stats.totalGemsEarned = (state.stats.totalGemsEarned || 0) + (enemy.gems || 0);
    // Remove enemy from state; it will be cleaned up by render/state loops
    state.enemies = state.enemies.filter(e => e !== enemy);
  }

  // Remove projectile immediately from state so Phaser and DOM remove visuals
  state.projectiles = state.projectiles.filter(p => p.id !== projId);
}

// Make available globally for renderer bridge
window.handlePhaserCollision = handlePhaserCollision;

// Trigger visual attack animation for defender
function triggerAttackAnimation(def){
  const cellIdx = def.row * GRID_COLS + def.col;
  const cellEl = cellElements[cellIdx];
  if(!cellEl) return;
  
  const defenderEl = cellEl.querySelector('.defender');
  if(!defenderEl) return;
  
  // Add attack class for animation
  defenderEl.classList.add('attacking');
  
  // Remove after animation completes
  setTimeout(() => {
    defenderEl.classList.remove('attacking');
  }, 300);
}

/* --- UI Rendering (persistent grid) --- */

// Build the grid once and attach stable handlers
function createBattleGrid(){
  return UI.createBattleGrid();
}

function updateBattleGrid(){
  return UI.updateBattleGrid();
}

function renderEnemies(){
  return UI.renderEnemies();
}

// High-frequency render loop (runs every animation frame) to update transforms smoothly
function renderLoop(){
  return UI.startRenderLoop();
}

/* --- Ability Helper Functions --- */
function getAbilityIcon(ability){
  const icons = {
    poison: '☠️',
    splash: '💥',
    slow: '❄️',
    stun: '⭐',
    lifesteal: '💚',
    burn: '🔥',
    multishot: '🎯'
  };
  return icons[ability] || '';
}

function getAbilityName(ability){
  const names = {
    poison: 'Poison',
    splash: 'Splash Damage',
    slow: 'Slow',
    stun: 'Stun',
    lifesteal: 'Life Steal',
    burn: 'Burn',
    multishot: 'Multi-Shot'
  };
  return names[ability] || '';
}

/* --- Shop/Inventory Rendering --- */
function renderShop(){
  return UI.renderShop();
}

function renderInventory(){
  return UI.renderInventory();
}

function updateUI(){
  return UI.updateUI();
}

// Separate function for updating shop/inventory that's only called when needed
function updateShopAndInventory(){
  return UI.updateShopAndInventory();
}

function gameOver(){
  state.isWaveActive = false;
  state.isPaused = false;
  // Re-enable start button and hide pause UI so player can continue
  const startWaveBtn = document.getElementById('startWaveBtn');
  if(startWaveBtn){ startWaveBtn.disabled = false; startWaveBtn.textContent = '▶️ Start Next Wave'; }
  const pauseBtn = document.getElementById('pauseBtn');
  if(pauseBtn) pauseBtn.style.display = 'none';

  // Show non-blocking overlay instead of alert so UI remains interactive
  const go = document.createElement('div');
  go.className = 'gameover-overlay';
  go.innerHTML = `<div>💀 Game Over<br><small>You survived ${state.wave - 1} waves</small><br><button id="gameoverRestart">Restart</button></div>`;
  document.body.appendChild(go);
  document.getElementById('gameoverRestart').addEventListener('click', () => {
    go.remove();
    // Reset game state
    state.lives = STARTING_LIVES;
    state.wave = 1;
    state.enemies = [];
    state.defenders = [];
    state.cells.forEach(cell => cell.defender = null);
    save();
    updateShopAndInventory();
  });
}

/* --- Tower Management Functions --- */
function upgradeDefender(cellIdx){
  const cell = state.cells[cellIdx];
  if(!cell.defender) return;
  
  const defender = cell.defender;
  const upgradeLevel = defender.upgradeLevel || 0;
  const upgradeCost = Math.floor((defender.cost || 50) * 0.5 * (upgradeLevel + 1));
  
  if(state.coins < upgradeCost){
    log(`⚠️ Not enough coins! Need ${upgradeCost} coins to upgrade.`);
    return;
  }
  
  // Apply upgrade
  state.coins -= upgradeCost;
  defender.upgradeLevel = upgradeLevel + 1;
  defender.totalCost = (defender.totalCost || 0) + upgradeCost;
  
  // Increase stats (20% boost per level)
  defender.damage = Math.floor(defender.damage * 1.2);
  defender.range = defender.range * 1.1;
  defender.attackSpeed = defender.attackSpeed * 0.95; // Faster attack (lower cooldown)
  
  log(`⬆️ Upgraded ${defender.name} to Level ${defender.upgradeLevel}! (+20% stats)`);
  save();
  updateUI();
}

function sellDefender(cellIdx){
  const cell = state.cells[cellIdx];
  if(!cell.defender) return;
  
  const defender = cell.defender;
  const refund = Math.floor(((defender.cost || 50) + (defender.totalCost || 0)) * 0.7);
  
  // Confirm sale since pet will be gone forever
  const confirmed = confirm(`⚠️ Are you sure you want to sell ${defender.name}?\n\nYou will receive ${refund} coins, but the pet will be GONE FOREVER and cannot be recovered.\n\nClick OK to confirm sale.`);
  
  if(!confirmed) {
    log(`❌ Sale cancelled for ${defender.name}`);
    return;
  }
  
  // Pet is sold and gone forever (not returned to inventory)
  state.coins += refund;
  
  // Remove defender
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  
  log(`💰 Sold ${defender.name} for ${refund} coins! (Pet is gone forever)`);
  save();
  updateUI();
  updateShopAndInventory();
}

function moveDefender(cellIdx){
  const cell = state.cells[cellIdx];
  if(!cell.defender) return;
  
  const defender = cell.defender;
  
  // Remove from current position
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  
  // Return to inventory for redeployment - preserve ALL properties
  const movingPet = {
    ...defender,
    uniqueId: Date.now() + '_' + Math.random()
  };
  // Mark as not equipped when returned to inventory
  movingPet.equipped = false;
  addPetToInventory(movingPet, { dedupe: true });
  state.selectedDefender = movingPet;
  
  log(`🔄 Moving ${defender.name} - Click on a placeable cell to redeploy!`);
  updateUI();
  updateShopAndInventory();
}

// Remove defender and return to inventory (preserve properties)
function removeDefender(cellIdx){
  const cell = state.cells[cellIdx];
  if(!cell.defender) return;
  const defender = cell.defender;
  // Remove from placed defenders
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  // Return to inventory as same uniqueId to avoid duplicates
  const returned = { ...defender, row: undefined, col: undefined };
  // Mark as not equipped when returned to inventory
  returned.equipped = false;
  addPetToInventory(returned, { dedupe: true });
  log(`↩️ Returned ${defender.name} to inventory.`);
  save();
  updateUI();
  updateShopAndInventory();
}

window.removeDefender = removeDefender;

/* --- Place defender (improved feedback) --- */
function placeDefender(cellIdx){
  const cell = state.cells[cellIdx];
  
  if(!state.selectedDefender){
    log('⚠️ Select a pet from your inventory first!');
    return;
  }
  // Ensure the selected pet is still present in inventory (prevents duping after selling)
  const sel = state.selectedDefender;
  if(sel && !state.ownedPets.some(p => p.uniqueId === sel.uniqueId)){
    log('⚠️ The selected pet is no longer in your inventory. Please select another pet.');
    state.selectedDefender = null;
    updateShopAndInventory();
    return;
  }
  
  if(cell.isPath){
    log('⚠️ Cannot place defenders on the path!');
    return;
  }
  
  if(cell.defender){
    log('⚠️ Cell already occupied!');
    return;
  }
  
  // Place the defender
  const defender = {
    ...state.selectedDefender,
    row: cell.row,
    col: cell.col,
    attackCooldown: 0,
    upgradeLevel: state.selectedDefender.upgradeLevel || 0, // Preserve upgrade level
    totalCost: state.selectedDefender.totalCost || 0 // Preserve total investment
  };
  // Mark as equipped when placed
  defender.equipped = true;
  
  cell.defender = defender;
  state.defenders.push(defender);
  
  // Remove from inventory
  state.ownedPets = state.ownedPets.filter(p => p.uniqueId !== state.selectedDefender.uniqueId);
  state.selectedDefender = null;
  
  log(`✅ Deployed ${defender.name} at (${cell.row}, ${cell.col})`);
  updateUI();
  updateShopAndInventory();
}

// Display statistics modal
function showStats(){
  return UI.showStats();
}

/* --- Sell All Function --- */
function sellAllPets(){
  if(state.ownedPets.length === 0){
    log('⚠️ No pets in inventory to sell!');
    return;
  }
  
  // Calculate total value
  let totalValue = 0;
  state.ownedPets.forEach(pet => {
    totalValue += Math.floor(pet.cost * 0.5); // 50% of cost
  });
  
  const petCount = state.ownedPets.length;
  
  // Confirm sale
  const confirmed = confirm(`⚠️ SELL ALL PETS?\n\nYou will sell ${petCount} pet${petCount > 1 ? 's' : ''} for ${totalValue} coins.\n\nAll pets will be GONE FOREVER and cannot be recovered.\n\nClick OK to confirm sale.`);
  
  if(!confirmed){
    log('❌ Sell all cancelled');
    return;
  }
  
  // Sell all pets
  state.coins += totalValue;
  state.ownedPets = [];
  // Clear selected pet so the user cannot place a pet that was just sold
  state.selectedDefender = null;
  
  log(`💰 Sold all ${petCount} pet${petCount > 1 ? 's' : ''} for ${totalValue} coins!`);
  save();
  updateUI();
  updateShopAndInventory();
}

/* --- Pause/Resume Function --- */
function togglePause(){
  state.isPaused = !state.isPaused;
  const pauseBtn = document.getElementById('pauseBtn');
  if(pauseBtn){
    pauseBtn.textContent = state.isPaused ? '▶️ Resume' : '⏸️ Pause';
  }
  log(state.isPaused ? '⏸️ Game paused' : '▶️ Game resumed');
}

/* --- Pet Enchant System --- */
function showEnchantModal(){
  const enchantModal = document.getElementById('enchantModal');
  const enchantContent = document.getElementById('enchantContent');
  
  if(state.ownedPets.length === 0){
    enchantContent.innerHTML = '<p style="text-align:center;color:#888;">No pets in inventory to enchant!</p>';
  } else {
    let html = '<div class="enchant-list">';
    state.ownedPets.forEach(pet => {
      const enchantLevel = pet.enchantLevel || 0;
      const enchantCost = Math.floor(100 * Math.pow(1.5, enchantLevel)); // Costs increase exponentially
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
          <button onclick="enchantPet('${pet.uniqueId}')" 
                  ${!canAfford ? 'disabled' : ''}
                  style="padding:8px 16px;background:${canAfford ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#555'};
                         color:white;border:none;border-radius:6px;cursor:${canAfford ? 'pointer' : 'not-allowed'};
                         font-weight:600;white-space:nowrap">
            ✨ Enchant
          </button>
        </div>
      `;
    });
    html += '</div>';
    enchantContent.innerHTML = html;
  }
  
  enchantModal.classList.remove('hidden');
}

function enchantPet(uniqueId){
  const pet = state.ownedPets.find(p => p.uniqueId === uniqueId);
  if(!pet) return;
  
  const enchantLevel = pet.enchantLevel || 0;
  const enchantCost = Math.floor(100 * Math.pow(1.5, enchantLevel));
  
  if(state.gems < enchantCost){
    log('⚠️ Not enough gems to enchant!');
    return;
  }
  
  // Apply enchantment
  state.gems -= enchantCost;
  pet.enchantLevel = enchantLevel + 1;
  pet.enchantBonus = (pet.enchantBonus || 0) + 0.1; // +10% per level
  
  // Update pet stats
  const basePet = PET_DEFENDERS.find(p => p.id === pet.id);
  if(basePet){
    const totalMultiplier = (pet.kgBonus || 1) * (pet.variantBonus || 1) * (1 + pet.enchantBonus);
    pet.damage = Math.floor(basePet.damage * totalMultiplier);
    pet.range = basePet.range * totalMultiplier;
    pet.attackSpeed = basePet.attackSpeed / Math.sqrt(totalMultiplier);
  }
  
  log(`✨ Enchanted ${pet.name} to level ${pet.enchantLevel}! (+10% stats)`);
  save();
  showEnchantModal(); // Refresh the modal
  updateShopAndInventory();
}

/* --- Authentication Functions --- */
// Hash password using SHA-256
async function hashPassword(password){
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function showAuthModal(){
  const authModal = document.getElementById('authModal');
  authModal.classList.remove('hidden');
  // Clear previous errors and inputs
  const errorEl = document.getElementById('authError');
  errorEl.classList.add('hidden');
  errorEl.textContent = '';
}

async function handleLogin(){
  const username = document.getElementById('authUsername').value.trim();
  const password = document.getElementById('authPassword').value;
  const errorEl = document.getElementById('authError');
  const loginBtn = document.getElementById('loginBtn');
  
  // Validation
  if(!username || !password){
    errorEl.textContent = '⚠️ Please enter both username and password';
    errorEl.classList.remove('hidden');
    return;
  }
  
  // Disable button during login
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  
  try {
    // Hash the password
    const passwordHash = await hashPassword(password);
    
    // Query for user
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if(queryError || !users){
      errorEl.textContent = '❌ Invalid username or password';
      errorEl.classList.remove('hidden');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return;
    }
    
    // Check password hash
    if(users.password !== passwordHash){
      errorEl.textContent = '❌ Invalid username or password';
      errorEl.classList.remove('hidden');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return;
    }
    
    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', users.user_id);
    
    // Load user data
    currentUser = users;
    isGuest = false;
    // Clear local-only inventory/defenders to avoid mixing guest/local items with account data
    state.ownedPets = [];
    state.defenders = [];
    state.selectedDefender = null;
    // Clear any placed defenders in cells
    if(state.cells && state.cells.length > 0){
      state.cells.forEach(c => c.defender = null);
    }

  await persistenceLoadUserData(currentUser, UI.showErrorToast, UI.showInfoToast, UI.updateShopAndInventory);
    // Ensure selected map is applied and grid refreshed after loading user data
    PATH = MAPS[state.selectedMap] || MAPS.classic;
    initCells();
    createBattleGrid();
    updateUI();
    
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    log(`✅ Welcome back, ${username}!`);
    
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  } catch(err){
    console.error('Login error:', err);
    errorEl.textContent = `❌ Login failed: ${err.message || 'Please try again'}`;
    errorEl.classList.remove('hidden');
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

async function handleRegister(){
  const username = document.getElementById('authUsername').value.trim();
  const password = document.getElementById('authPassword').value;
  const errorEl = document.getElementById('authError');
  const registerBtn = document.getElementById('registerBtn');
  
  // Validation
  if(!username || !password){
    errorEl.textContent = '⚠️ Please enter both username and password';
    errorEl.classList.remove('hidden');
    return;
  }
  
  if(username.length < 3){
    errorEl.textContent = '⚠️ Username must be at least 3 characters';
    errorEl.classList.remove('hidden');
    return;
  }
  
  if(password.length < 6){
    errorEl.textContent = '⚠️ Password must be at least 6 characters';
    errorEl.classList.remove('hidden');
    return;
  }
  
  // Additional validation for username (alphanumeric and underscores only)
  if(!/^[a-zA-Z0-9_]+$/.test(username)){
    errorEl.textContent = '⚠️ Username can only contain letters, numbers, and underscores';
    errorEl.classList.remove('hidden');
    return;
  }
  
  // Disable button during registration
  registerBtn.disabled = true;
  registerBtn.textContent = 'Creating account...';
  
  try {
    // Check if username exists
    const { data: existing } = await supabase
      .from('users')
      .select('user_id')
      .eq('username', username)
      .single();
    
    if(existing){
      errorEl.textContent = '❌ Username already exists. Please choose another.';
      errorEl.classList.remove('hidden');
      registerBtn.disabled = false;
      registerBtn.textContent = 'Register';
      return;
    }
    
    // Hash the password
    const passwordHash = await hashPassword(password);
    
    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        username: username,
        password: passwordHash,
        lives: STARTING_LIVES,
        coins: STARTING_COINS,
        gems: STARTING_GEMS,
        current_wave: 1,
        max_wave: 1
      }])
      .select()
      .single();
    
    if(insertError){
      console.error('Insert error:', insertError);
      errorEl.textContent = `❌ Registration failed: ${insertError.message || 'Please try again'}`;
      errorEl.classList.remove('hidden');
      registerBtn.disabled = false;
      registerBtn.textContent = 'Register';
      return;
    }
    
    currentUser = newUser;
    isGuest = false;
  await persistenceLoadUserData(currentUser, UI.showErrorToast, UI.showInfoToast, UI.updateShopAndInventory);
    
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    log(`✅ Welcome, ${username}! Account created successfully.`);
    
    registerBtn.disabled = false;
    registerBtn.textContent = 'Register';
  } catch(err){
    console.error('Registration error:', err);
    errorEl.textContent = `❌ Registration failed: ${err.message || 'Please try again'}`;
    errorEl.classList.remove('hidden');
    registerBtn.disabled = false;
    registerBtn.textContent = 'Register';
  }
}

function handleGuest(){
  isGuest = true;
  currentUser = null;
  document.getElementById('authModal').classList.add('hidden');
  log('✅ Continuing as guest');
  updateUserDisplay();
}

async function handleLogout(){
  if(!isGuest && currentUser){
  await persistenceSaveUserData(currentUser, showErrorToast);
  }
  
  currentUser = null;
  isGuest = false;
  
  // Reset game state by mutating the shared `state` object
  state.coins = STARTING_COINS;
  state.gems = STARTING_GEMS;
  state.lives = STARTING_LIVES;
  state.wave = 1;
  state.isWaveActive = false;
  state.isPaused = false;
  state.cells = [];
  state.defenders = [];
  state.enemies = [];
  state.projectiles = [];
  state.ownedPets = [];
  state.selectedDefender = null;
  state.enemyIdCounter = 0;
  state.lastTick = Date.now();
  state.selectedMap = 'classic';
  state.gameSpeed = 1;
  state.stats = {
    totalEnemiesDefeated: 0,
    totalDamageDealt: 0,
    wavesCompleted: 0,
    gachaRolls: 0,
    highestWave: 1,
    totalCoinsEarned: 0,
    totalGemsEarned: 0
  };
  
  initCells();
  initStarterPets();
  updateUI();
  updateShopAndInventory();
  updateUserDisplay();
  showAuthModal();
  log('👋 Logged out');
}

// Persistence functions moved to src/persistence.js

function updateUserDisplay(){
  const userDisplay = document.getElementById('userDisplay');
  const currentUserEl = document.getElementById('currentUser');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if(currentUser && !isGuest){
    userDisplay.style.display = 'inline';
    currentUserEl.textContent = currentUser.username;
    logoutBtn.style.display = 'inline-block';
  } else if(isGuest){
    userDisplay.style.display = 'inline';
    currentUserEl.textContent = 'Guest';
    logoutBtn.style.display = 'inline-block';
  } else {
    userDisplay.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

/* --- Event Handlers --- */
startWaveBtn.addEventListener('click', () => spawnWave());
gachaBtn.addEventListener('click', () => openGacha());
closeGachaBtn.addEventListener('click', () => gachaModal.classList.add('hidden'));

// Pause button
const pauseBtn = document.getElementById('pauseBtn');
if(pauseBtn) pauseBtn.addEventListener('click', () => togglePause());

// Sell All button
const sellAllBtn = document.getElementById('sellAllBtn');
if(sellAllBtn) sellAllBtn.addEventListener('click', () => sellAllPets());

const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStatsBtn');
if(statsBtn) statsBtn.addEventListener('click', () => showStats());
if(closeStatsBtn) closeStatsBtn.addEventListener('click', () => statsModal.classList.add('hidden'));

// Enchant button
const enchantBtn = document.getElementById('enchantBtn');
const enchantModal = document.getElementById('enchantModal');
const closeEnchantBtn = document.getElementById('closeEnchantBtn');
if(enchantBtn) enchantBtn.addEventListener('click', () => showEnchantModal());
if(closeEnchantBtn) closeEnchantBtn.addEventListener('click', () => enchantModal.classList.add('hidden'));

// Auth buttons
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const guestBtn = document.getElementById('guestBtn');
const logoutBtn = document.getElementById('logoutBtn');
if(loginBtn) loginBtn.addEventListener('click', () => handleLogin());
if(registerBtn) registerBtn.addEventListener('click', () => handleRegister());
if(guestBtn) guestBtn.addEventListener('click', () => handleGuest());
if(logoutBtn) logoutBtn.addEventListener('click', () => handleLogout());

// Auth input handlers - press Enter to login
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
if(authUsername){
  authUsername.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      authPassword.focus();
    }
  });
}
if(authPassword){
  authPassword.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      handleLogin();
    }
  });
}

// Map selector
const mapSelector = document.getElementById('mapSelector');
mapSelector.addEventListener('change', (e) => {
  if(state.isWaveActive){
    alert('Cannot change map during active wave!');
    mapSelector.value = state.selectedMap;
    return;
  }
  
  if(state.defenders.length > 0){
    const confirm = window.confirm('Changing map will return all placed defenders to your inventory. Continue?');
    if(!confirm){
      mapSelector.value = state.selectedMap;
      return;
    }
    // Return each placed defender to inventory (preserve properties) to avoid accidental loss
    state.defenders.forEach(d => {
      const returned = { ...d };
      // remove grid position
      delete returned.row; delete returned.col;
      // ensure uniqueId exists
      if(!returned.uniqueId) returned.uniqueId = Date.now() + '_' + Math.random();
      addPetToInventory(returned, { dedupe: true });
    });
    state.defenders = [];
    state.cells.forEach(cell => cell.defender = null);
    updateShopAndInventory();
  }
  
  state.selectedMap = e.target.value;
  PATH = MAPS[state.selectedMap];
  initCells();
  createBattleGrid();
  updateUI();
  log(`🗺️ Map changed to ${state.selectedMap}!`);
  save();
});

// Game speed selector
const gameSpeedSelector = document.getElementById('gameSpeed');
if(gameSpeedSelector){
  gameSpeedSelector.addEventListener('change', (e) => {
    state.gameSpeed = parseFloat(e.target.value);
    log(`⚡ Game speed set to ${state.gameSpeed}x`);
    save();
  });
}

// Helper: return true when the user is typing into an input-like element
function isInteractiveElementFocused(){
  try{
    const el = document.activeElement;
    if(!el) return false;
    const tag = el.tagName;
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if(el.isContentEditable) return true;
    // some custom widgets may use role="textbox"
    if(el.getAttribute && el.getAttribute('role') === 'textbox') return true;
    return false;
  }catch(err){
    return false;
  }
}

// Keyboard shortcuts (ignore while typing in inputs)
document.addEventListener('keydown', (e) => {
  // Always allow Escape to close modals even when typing
  if(e.key === 'Escape'){
    if(!gachaModal.classList.contains('hidden')){
      gachaModal.classList.add('hidden');
    } else if(!statsModal.classList.contains('hidden')){
      statsModal.classList.add('hidden');
    }
    return;
  }

  // If an input-like element is focused, don't run other shortcuts
  if(isInteractiveElementFocused()) return;

  // Space or Enter to start wave
  if((e.key === ' ' || e.key === 'Enter') && !state.isWaveActive && gachaModal.classList.contains('hidden') && statsModal.classList.contains('hidden')){
    e.preventDefault();
    spawnWave();
  }
  // G for gacha
  if((e.key === 'g' || e.key === 'G') && statsModal.classList.contains('hidden')){
    openGacha();
  }
  // S for stats
  if((e.key === 's' || e.key === 'S') && gachaModal.classList.contains('hidden') && statsModal.classList.contains('hidden')){
    showStats();
  }
  // P for pause/resume
  if((e.key === 'p' || e.key === 'P') && state.isWaveActive && gachaModal.classList.contains('hidden') && statsModal.classList.contains('hidden')){
    togglePause();
  }
});

// Make tower management functions globally accessible
// Provide a small global bridge for UI delegation. UI will call window.GameAPI[action]
window.GameAPI = window.GameAPI || {};
window.GameAPI.upgrade = upgradeDefender;
window.GameAPI.sell = sellDefender;
window.GameAPI.move = moveDefender;
window.GameAPI.remove = removeDefender;
window.GameAPI.enchant = enchantPet;
window.GameAPI.place = placeDefender;

// Also expose the older direct functions for compatibility
window.upgradeDefender = upgradeDefender;
window.sellDefender = sellDefender;
window.moveDefender = moveDefender;
window.enchantPet = enchantPet;
window.removeDefender = removeDefender;

/* --- Game Loop --- */
let last = Date.now();
function gameLoop(){
  const now = Date.now();
  const deltaMs = now - last;
  const deltaSec = (deltaMs / 1000) * state.gameSpeed; // Apply game speed multiplier
  
  if(deltaMs >= TICK_INTERVAL){
    if(state.isWaveActive && !state.isPaused){ // Only update when not paused
      updateEnemies(deltaSec);
      updateDefenders(deltaSec);
      updateProjectiles(deltaSec);
      // Only update UI during active wave for better performance
      updateUI();
    } else if(state.isWaveActive && state.isPaused){
      // Still render but don't update game logic
      updateUI();
    }
    
    last = now;
  }
  
  requestAnimationFrame(gameLoop);
}

/* --- Init --- */
function init(){
  load();
  
  // If not logged in and not using a guest session, clear local inventory/placed defenders
  // so refresh doesn't keep local-only pets. Logged-in users will have their server inventory loaded on login.
  if(!currentUser && !isGuest){
    state.ownedPets = [];
    state.defenders = [];
    state.selectedDefender = null;
    if(state.cells && state.cells.length > 0){
      state.cells.forEach(c => c.defender = null);
    }
  }

  // Load auto-sell preference
  const autoSellCheckbox = document.getElementById('autoSellCommon');
  if(autoSellCheckbox){
    const savedAutoSell = localStorage.getItem('petdefense_autoSell');
    if(savedAutoSell !== null){
      autoSellCheckbox.checked = savedAutoSell === 'true';
    }
  }
  
  // Set defaults
  if(state.coins === undefined) state.coins = STARTING_COINS;
  if(state.gems === undefined) state.gems = STARTING_GEMS;
  if(state.lives === undefined) state.lives = STARTING_LIVES;
  if(state.wave === undefined) state.wave = 1;
  if(state.selectedMap === undefined) state.selectedMap = 'classic';
  if(state.gameSpeed === undefined) state.gameSpeed = 1;
  
  // Set the path based on selected map
  PATH = MAPS[state.selectedMap];
  
  // Update map selector
  const mapSelector = document.getElementById('mapSelector');
  if(mapSelector) mapSelector.value = state.selectedMap;
  
  // Update game speed selector
  const gameSpeedSelector = document.getElementById('gameSpeed');
  if(gameSpeedSelector) gameSpeedSelector.value = state.gameSpeed;
  
  // Initialize grid
  if(!state.cells || state.cells.length === 0){
    initCells();
  }
  
  // Ensure defenders array exists
  if(!state.defenders) state.defenders = [];
  
  // Ensure projectiles array exists
  if(!state.projectiles) state.projectiles = [];
  
  // Rebuild defender references in cells from loaded defenders
  if(state.defenders.length > 0){
    state.defenders.forEach(def => {
      const cellIdx = def.row * GRID_COLS + def.col;
      if(state.cells[cellIdx]){
        state.cells[cellIdx].defender = def;
      }
    });
  }
  
  // create the persistent DOM grid once (handled by UI module)
  UI.createBattleGrid();

  // Initialize starter pets
  initStarterPets();

  // Initial UI render
  UI.updateUI();
  UI.updateShopAndInventory();
  last = Date.now();
  gameLoop();
  // Create initial enemy/projectile DOM and start high-frequency render loop via UI
  UI.renderEnemies();
  UI.startRenderLoop();
  // Initialize Phaser renderer overlay (optional): creates canvas and syncs sprites
    try{
      const battleGridEl = document.getElementById('battleGrid');
      if(battleGridEl){
        // Lazy-load Phaser renderer to reduce initial bundle size
        import('./phaserRenderer.js').then(mod => {
          if(mod && typeof mod.initPhaser === 'function'){
            mod.initPhaser(state);
            battleGridEl.classList.add('phaser-active');
            console.log('Phaser renderer initialized (lazy-loaded)');
          }
        }).catch(err => {
          console.warn('Phaser init failed to load', err);
        });
      }
    }catch(err){
      console.warn('Phaser init failed', err);
    }
  
  // Show auth modal on startup
  showAuthModal();
  log('🛡️ Welcome to Pet Defense! Deploy pets and defend against waves!');

  // Initialize debug toggle UI if present
  const showHitboxesCb = document.getElementById('showHitboxes');
  if(showHitboxesCb){
    showHitboxesCb.checked = !!state.showHitboxes;
    showHitboxesCb.addEventListener('change', (e) => { state.showHitboxes = e.target.checked; updateUI(); });
  }
  const useDomCollisionCb = document.getElementById('useDomCollision');
  if(useDomCollisionCb){
    useDomCollisionCb.checked = !!state.useDomCollision;
    useDomCollisionCb.addEventListener('change', (e) => { state.useDomCollision = e.target.checked; });
  }

  // Hotkeys: H toggles hitbox visuals; C toggles DOM collision mode
  document.addEventListener('keydown', (e) => {
    // Don't trigger these toggles while typing in inputs
    if(isInteractiveElementFocused()) return;
    if(e.key === 'h' || e.key === 'H'){
      state.showHitboxes = !state.showHitboxes;
      if(showHitboxesCb) showHitboxesCb.checked = state.showHitboxes;
      updateUI();
    }
    if(e.key === 'c' || e.key === 'C'){
      state.useDomCollision = !state.useDomCollision;
      if(useDomCollisionCb) useDomCollisionCb.checked = state.useDomCollision;
      log(`Collision mode: ${state.useDomCollision ? 'DOM hitboxes' : 'Distance fallback'}`);
    }
  });
}

init();