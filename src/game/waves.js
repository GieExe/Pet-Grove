import { state, ENEMY_TYPES, PATH, MAPS } from '../state.js';
import * as UI from '../ui.js';
import { log } from '../ui.js';

export function spawnWave(){
  if(state.isWaveActive) return;
  state.isPaused = false;
  const pauseOverlay = document.getElementById('pauseOverlay');
  if(pauseOverlay) pauseOverlay.remove();

  state.isWaveActive = true;
  // Update UI button state via UI module
  if(UI.startWaveBtn) UI.startWaveBtn.disabled = true;
  if(UI.startWaveBtn) UI.startWaveBtn.textContent = '⏳ Wave In Progress...';
  if(UI.startWaveBtn && typeof UI.startWaveBtn.blur === 'function') UI.startWaveBtn.blur();

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
  state.totalEnemiesInWave = baseEnemies;
  UI.log ? UI.log(`🌊 Wave ${state.wave} started! ${baseEnemies} enemies incoming!`) : console.log(`Wave ${state.wave} started`);
}

export function updateEnemies(deltaTime){
  const toRemove = [];

  state.enemies.forEach(enemy => {
    if(enemy.spawnDelay > 0){
      enemy.spawnDelay -= deltaTime;
      return;
    }
    if(!enemy.originalSpeed) enemy.originalSpeed = enemy.speed;
    if(!enemy.stunned){ enemy.progress += enemy.speed * deltaTime; }
    if(enemy.progress >= 1){
      enemy.progress = 0;
      enemy.pathIndex++;
      if(enemy.pathIndex >= PATH.length){
        state.lives -= 1;
        toRemove.push(enemy.id);
        UI.log && UI.log(`💔 ${enemy.name} reached the end! Lives: ${state.lives}`);
        return;
      }
      enemy.position = { ...PATH[enemy.pathIndex] };
    }

    if(enemy.pathIndex > 0 && enemy.pathIndex < PATH.length){
      const from = PATH[enemy.pathIndex - 1];
      const to = PATH[enemy.pathIndex];
      enemy.position = {
        row: from.row + (to.row - from.row) * enemy.progress,
        col: from.col + (to.col - from.col) * enemy.progress
      };
    }
  });

  state.enemies = state.enemies.filter(e => !toRemove.includes(e.id) && e.hp > 0);

  if(state.isWaveActive && state.enemies.length === 0){
    completeWave();
  }

  if(state.lives <= 0){
    // gameOver is provided by bootstrap via window.GameAPI
    if(window && window.GameAPI && typeof window.GameAPI.gameOver === 'function'){
      window.GameAPI.gameOver();
    }
  }
}

export function completeWave(){
  state.isWaveActive = false;
  state.isPaused = false;
  state.wave = (state.wave || 1) + 1;

  const coinReward = 80 + state.wave * 15;
  const gemReward = 10 + Math.floor(state.wave / 2);
  state.coins += coinReward;
  state.gems += gemReward;

  if(!state.stats) state.stats = {};
  state.stats.wavesCompleted = (state.stats.wavesCompleted || 0) + 1;
  state.stats.highestWave = Math.max(state.stats.highestWave || 1, state.wave);
  state.stats.totalCoinsEarned = (state.stats.totalCoinsEarned || 0) + coinReward;
  state.stats.totalGemsEarned = (state.stats.totalGemsEarned || 0) + gemReward;

  UI.log && UI.log(`✅ Wave completed! +${coinReward} coins, +${gemReward} gems`);
  if(UI.startWaveBtn){ UI.startWaveBtn.disabled = false; UI.startWaveBtn.textContent = '▶️ Start Next Wave'; }
  const pauseBtn = document.getElementById('pauseBtn'); if(pauseBtn) pauseBtn.style.display = 'none';
  // Auto-start
  const autoStartCheckbox = document.getElementById('autoStartWave');
  if(autoStartCheckbox && autoStartCheckbox.checked){ setTimeout(()=>{ if(!state.isWaveActive) { if(window && window.GameAPI && typeof window.GameAPI.spawnWave === 'function'){ window.GameAPI.spawnWave(); } } }, 2000); }
}
