// Pet Defense — Tower Defense game with pets and gacha system

/* --- Configuration --- */
const TICK_INTERVAL = 100; // ms - faster for TD gameplay
const GRID_ROWS = 5;
const GRID_COLS = 8;
const STARTING_COINS = 150;
const STARTING_GEMS = 100;
const STARTING_LIVES = 20;
const GACHA_COST = 40;

// Pet Defenders (Towers)
const PET_DEFENDERS = [
  { 
    id: 'dog', 
    emoji: '🐶', 
    name: 'Guard Dog', 
    cost: 50, 
    damage: 20, 
    range: 1.5, 
    attackSpeed: 0.8,
    rarity: 'common',
    description: 'Basic melee defender'
  },
  { 
    id: 'cat', 
    emoji: '🐱', 
    name: 'Ninja Cat', 
    cost: 75, 
    damage: 25, 
    range: 2, 
    attackSpeed: 0.6,
    rarity: 'common',
    description: 'Fast attacker'
  },
  { id: 'rabbit', emoji: '🐰', name: 'Swift Bunny', cost: 60, damage: 18, range: 1.8, attackSpeed: 0.5, rarity:'common', description:'Very fast attacker' },
  { id: 'turtle', emoji: '🐢', name: 'Tank Turtle', cost: 80, damage: 30, range: 1.2, attackSpeed: 1.5, rarity:'common', description:'Slow but tough' },
  { id: 'fox', emoji: '🦊', name: 'Clever Fox', cost: 70, damage: 22, range: 2.2, attackSpeed: 0.7, rarity:'common', description:'Cunning and quick' },
  { id: 'panda', emoji: '🐼', name: 'Kung Fu Panda', cost: 120, damage: 40, range: 1.5, attackSpeed: 1.2, rarity:'rare', description:'Strong melee fighter' },
  { id: 'owl', emoji: '🦉', name: 'Wise Owl', cost: 150, damage: 28, range: 3.5, attackSpeed: 1.0, rarity:'rare', description:'Long range sniper' },
  { id: 'bear', emoji: '🐻', name: 'Grizzly Bear', cost: 140, damage: 50, range: 1.8, attackSpeed: 1.4, rarity:'rare', description:'Powerful close range' },
  { id: 'wolf', emoji: '🐺', name: 'Alpha Wolf', cost: 160, damage: 38, range: 2.2, attackSpeed: 0.9, rarity:'rare', description:'Balanced fighter' },
  { id: 'monkey', emoji: '🐵', name: 'Warrior Monkey', cost: 130, damage: 35, range: 1.6, attackSpeed: 0.8, rarity:'rare', description:'Agile fighter' },
  { id: 'dragon', emoji: '🐲', name: 'Fire Dragon', cost: 300, damage: 70, range: 3.0, attackSpeed: 1.5, rarity:'epic', description:'Powerful ranged attacker' },
  { id: 'tiger', emoji: '🐯', name: 'Bengal Tiger', cost: 280, damage: 65, range: 2.0, attackSpeed: 1.0, rarity:'epic', description:'Fierce predator' },
  { id: 'phoenix', emoji: '🦅', name: 'Phoenix', cost: 320, damage: 60, range: 3.5, attackSpeed: 1.2, rarity:'epic', description:'Aerial superiority' },
  { id: 'shark', emoji: '🦈', name: 'Land Shark', cost: 290, damage: 68, range: 1.8, attackSpeed: 1.1, rarity:'epic', description:'Devastating attacker' },
  { id: 'lion', emoji: '🦁', name: 'Lion King', cost: 500, damage: 90, range: 2.0, attackSpeed: 0.8, rarity:'legendary', description:'Ultimate damage dealer' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', cost: 480, damage: 80, range: 2.8, attackSpeed: 0.7, rarity:'legendary', description:'Magical powerhouse' },
  { id: 'trex', emoji: '🦖', name: 'T-Rex', cost: 520, damage: 100, range: 1.6, attackSpeed: 1.2, rarity:'legendary', description:'Prehistoric destroyer' },
  { id: 'kraken', emoji: '🐙', name: 'Kraken', cost: 510, damage: 85, range: 3.0, attackSpeed: 0.9, rarity:'legendary', description:'Tentacled terror' }
];

const ENEMY_TYPES = [
  { id: 'slime', emoji: '👾', name: 'Slime', hp: 40, speed: 1.0, reward: 15, gems: 1 },
  { id: 'goblin', emoji: '👹', name: 'Goblin', hp: 60, speed: 1.2, reward: 20, gems: 1 },
  { id: 'imp', emoji: '👿', name: 'Imp', hp: 50, speed: 1.5, reward: 18, gems: 1 },
  { id: 'orc', emoji: '👺', name: 'Orc', hp: 100, speed: 0.8, reward: 35, gems: 2 },
  { id: 'ghost', emoji: '👻', name: 'Ghost', hp: 70, speed: 1.3, reward: 30, gems: 2 },
  { id: 'demon', emoji: '😈', name: 'Demon', hp: 200, speed: 1.5, reward: 60, gems: 5 },
  { id: 'skull', emoji: '💀', name: 'Skeleton', hp: 80, speed: 1.1, reward: 32, gems: 2 },
  { id: 'alien', emoji: '👽', name: 'Alien', hp: 120, speed: 1.0, reward: 45, gems: 3 }
];

// Gacha rarities and rates
const GACHA_RATES = {
  common: 0.60,    // 60%
  rare: 0.25,      // 25%
  epic: 0.12,      // 12%
  legendary: 0.03  // 3%
};

/* --- DOM refs --- */
const battleGridEl = document.getElementById('battleGrid');
const shopEl = document.getElementById('shop');
const inventoryEl = document.getElementById('inventory');
const coinsEl = document.getElementById('coinCount');
const gemsEl = document.getElementById('gemCount');
const livesEl = document.getElementById('livesCount');
const waveNumberEl = document.getElementById('waveNumber');
const startWaveBtn = document.getElementById('startWaveBtn');
const gachaBtn = document.getElementById('gachaBtn');
const gachaModal = document.getElementById('gachaModal');
const gachaResult = document.getElementById('gachaResult');
const closeGachaBtn = document.getElementById('closeGachaBtn');
const logEl = document.getElementById('log');

let state = {
  coins: STARTING_COINS,
  gems: STARTING_GEMS,
  lives: STARTING_LIVES,
  wave: 1,
  isWaveActive: false,
  cells: [], // grid cells for tower placement
  defenders: [], // placed defenders
  enemies: [], // active enemies
  projectiles: [], // active projectiles
  ownedPets: [], // pets from gacha
  selectedDefender: null,
  enemyIdCounter: 0,
  lastTick: Date.now()
};

// Path definition - enemies follow this path (optimized for more tower placement)
const PATH = [
  { row: 2, col: 0 },
  { row: 2, col: 1 },
  { row: 2, col: 2 },
  { row: 2, col: 3 },
  { row: 2, col: 4 },
  { row: 2, col: 5 },
  { row: 2, col: 6 },
  { row: 2, col: 7 }
];

// Persistent cell elements so we don't recreate them every frame
const cellElements = []; // populated by createBattleGrid()

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
  if(state.ownedPets.length === 0){
    // Give player 2 basic pets to start
    state.ownedPets.push(
      { ...PET_DEFENDERS[0], uniqueId: Date.now() + '_1' },
      { ...PET_DEFENDERS[1], uniqueId: Date.now() + '_2' }
    );
  }
}

/* --- Utilities --- */
function log(msg){
  const li = document.createElement('li');
  li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logEl.prepend(li);
  // Keep only last 20 messages
  while(logEl.children.length > 20){
    logEl.removeChild(logEl.lastChild);
  }
}

function save(){
  // Save state but clear wave-specific data
  // Need to save defenders and update cell references
  const saveState = {
    ...state,
    isWaveActive: false,
    enemies: [],
    projectiles: []
  };
  localStorage.setItem('petdefense_state', JSON.stringify(saveState));
}

function load(){
  const raw = localStorage.getItem('petdefense_state');
  if(raw){
    try{
      const loaded = JSON.parse(raw);
      state = { ...state, ...loaded };
    }catch(e){
      console.warn('Failed to load state', e);
    }
  }
}

function distance(x1, y1, x2, y2){
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function getCellCenter(row, col){
  return { x: col + 0.5, y: row + 0.5 };
}

/* --- Gacha System --- */
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
  
  return {
    ...pet,
    uniqueId: Date.now() + '_' + Math.random()
  };
}

function openGacha(){
  if(state.gems < GACHA_COST){
    log(`⚠️ Not enough gems! Need ${GACHA_COST} gems.`);
    return;
  }
  
  state.gems -= GACHA_COST;
  const newPet = rollGacha();
  state.ownedPets.push(newPet);
  
  // Show result
  gachaResult.innerHTML = `
    <div class="gacha-reveal ${newPet.rarity}">
      <div class="gacha-emoji">${newPet.emoji}</div>
      <h3>${newPet.name}</h3>
      <div class="rarity-badge ${newPet.rarity}">${newPet.rarity.toUpperCase()}</div>
      <p>${newPet.description}</p>
      <div class="stats">
        <div>💪 Damage: ${newPet.damage}</div>
        <div>📏 Range: ${newPet.range}</div>
        <div>⚡ Speed: ${newPet.attackSpeed}s</div>
      </div>
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
  
  state.isWaveActive = true;
  startWaveBtn.disabled = true;
  startWaveBtn.textContent = '⏳ Wave In Progress...';
  
  // Calculate enemies for this wave
  const baseEnemies = 5 + state.wave * 2;
  const waveEnemies = [];
  
  for(let i = 0; i < baseEnemies; i++){
    // Select enemy type based on wave
    let enemyType;
    if(state.wave <= 2){
      enemyType = ENEMY_TYPES[0]; // Slimes
    } else if(state.wave <= 5){
      enemyType = Math.random() < 0.7 ? ENEMY_TYPES[0] : ENEMY_TYPES[1];
    } else if(state.wave <= 10){
      const r = Math.random();
      enemyType = r < 0.4 ? ENEMY_TYPES[0] : r < 0.8 ? ENEMY_TYPES[1] : ENEMY_TYPES[2];
    } else {
      const r = Math.random();
      enemyType = r < 0.3 ? ENEMY_TYPES[0] : r < 0.6 ? ENEMY_TYPES[1] : r < 0.9 ? ENEMY_TYPES[2] : ENEMY_TYPES[3];
    }
    
    waveEnemies.push({
      ...enemyType,
      hp: enemyType.hp * (1 + state.wave * 0.05), // Gentler HP scaling
      maxHp: enemyType.hp * (1 + state.wave * 0.05),
      pathIndex: 0,
      position: { ...PATH[0] },
      progress: 0,
      id: state.enemyIdCounter++,
      spawnDelay: i * 0.5 // Spawn enemies with delay
    });
  }
  
  state.enemies = waveEnemies;
  log(`🌊 Wave ${state.wave} started! ${baseEnemies} enemies incoming!`);
}

function updateEnemies(deltaTime){
  const toRemove = [];
  
  state.enemies.forEach(enemy => {
    // Handle spawn delay
    if(enemy.spawnDelay > 0){
      enemy.spawnDelay -= deltaTime;
      return;
    }
    
    // Move along path
    enemy.progress += enemy.speed * deltaTime;
    
    if(enemy.progress >= 1){
      enemy.progress = 0;
      enemy.pathIndex++;
      
      if(enemy.pathIndex >= PATH.length){
        // Enemy reached end
        state.lives -= 1;
        toRemove.push(enemy.id);
        log(`💔 ${enemy.name} reached the end! Lives: ${state.lives}`);
        return;
      }
      
      enemy.position = { ...PATH[enemy.pathIndex] };
    }
    
    // Interpolate position for smooth movement
    if(enemy.pathIndex > 0 && enemy.pathIndex < PATH.length){
      const from = PATH[enemy.pathIndex - 1];
      const to = PATH[enemy.pathIndex];
      enemy.position = {
        row: from.row + (to.row - from.row) * enemy.progress,
        col: from.col + (to.col - from.col) * enemy.progress
      };
    }
  });
  
  // Remove dead/finished enemies
  state.enemies = state.enemies.filter(e => !toRemove.includes(e.id) && e.hp > 0);
  
  // Check wave completion
  if(state.isWaveActive && state.enemies.length === 0){
    completeWave();
  }
  
  // Check game over
  if(state.lives <= 0){
    gameOver();
  }
}

function completeWave(){
  state.isWaveActive = false;
  state.wave++;
  
  const coinReward = 80 + state.wave * 15;
  const gemReward = 10 + Math.floor(state.wave / 2);
  state.coins += coinReward;
  state.gems += gemReward;
  
  log(`✅ Wave completed! +${coinReward} coins, +${gemReward} gems`);
  
  startWaveBtn.disabled = false;
  startWaveBtn.textContent = '▶️ Start Next Wave';
  save();
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

// Create projectile from defender to enemy
function createProjectile(defender, enemy){
  const defenderPos = getCellCenter(defender.row, defender.col);
  const projectile = {
    id: Date.now() + Math.random(),
    x: defenderPos.x,
    y: defenderPos.y,
    targetEnemy: enemy,
    damage: defender.damage,
    speed: 8, // cells per second - increased for better tracking
    defenderName: defender.name
  };
  state.projectiles.push(projectile);
}

// Update projectiles - improved accuracy with predictive targeting
function updateProjectiles(deltaTime){
  const toRemove = [];
  
  state.projectiles.forEach(proj => {
    if(!proj.targetEnemy || proj.targetEnemy.hp <= 0){
      toRemove.push(proj.id);
      return;
    }
    
    // Get current target position
    const targetPos = { x: proj.targetEnemy.position.col + 0.5, y: proj.targetEnemy.position.row + 0.5 };
    const dx = targetPos.x - proj.x;
    const dy = targetPos.y - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // More generous hit detection for better accuracy
    if(dist < 0.3){
      // Hit the target
      proj.targetEnemy.hp -= proj.damage;
      if(proj.targetEnemy.hp <= 0){
        log(`💥 ${proj.defenderName} defeated ${proj.targetEnemy.name} (+${proj.targetEnemy.reward} coins, +${proj.targetEnemy.gems} gems)`);
        state.coins += (proj.targetEnemy.reward || 0);
        state.gems += (proj.targetEnemy.gems || 0);
      }
      toRemove.push(proj.id);
    } else {
      // Move toward target with improved tracking
      const moveDistance = proj.speed * deltaTime;
      // Normalize direction and move
      const normalizedSpeed = Math.min(moveDistance, dist); // Don't overshoot
      proj.x += (dx / dist) * normalizedSpeed;
      proj.y += (dy / dist) * normalizedSpeed;
    }
  });
  
  state.projectiles = state.projectiles.filter(p => !toRemove.includes(p.id));
}

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
function createBattleGrid() {
  battleGridEl.innerHTML = '';
  cellElements.length = 0;

  state.cells.forEach((cell, idx) => {
    const cellEl = document.createElement('div');
    cellEl.classList.add('cell');
    if (cell.isPath) cellEl.classList.add('path');
    else {
      cellEl.classList.add('placeable');
      // stable event listener
      cellEl.addEventListener('click', () => placeDefender(idx));
    }
    battleGridEl.appendChild(cellEl);
    cellElements[idx] = cellEl;
  });

  // create container for enemies so they don't replace grid nodes
  const enemiesContainer = document.createElement('div');
  enemiesContainer.id = 'enemiesContainer';
  enemiesContainer.style.position = 'absolute';
  enemiesContainer.style.left = '0';
  enemiesContainer.style.top = '0';
  enemiesContainer.style.width = '100%';
  enemiesContainer.style.height = '100%';
  enemiesContainer.style.pointerEvents = 'none'; // don't block clicks
  battleGridEl.appendChild(enemiesContainer);
}

function updateBattleGrid() {
  // update classes / innerHTML without recreating nodes
  state.cells.forEach((cell, idx) => {
    const el = cellElements[idx];
    if (!el) return;
    // reset base class
    el.className = 'cell';
    if (cell.isPath) {
      el.classList.add('path');
    }
    if (cell.defender) {
      el.classList.add('has-defender');
      const upgradeLevel = cell.defender.upgradeLevel || 0;
      const levelBadge = upgradeLevel > 0 ? `<span class="upgrade-badge">+${upgradeLevel}</span>` : '';
      el.innerHTML = `
        <div class="defender">${cell.defender.emoji}</div>
        ${levelBadge}
        <div class="defender-controls">
          <button class="control-btn upgrade-btn" onclick="upgradeDefender(${idx})" title="Upgrade">⬆️</button>
          <button class="control-btn move-btn" onclick="moveDefender(${idx})" title="Move">🔄</button>
          <button class="control-btn sell-btn" onclick="sellDefender(${idx})" title="Sell">💰</button>
        </div>
      `;
    } else {
      el.innerHTML = '';
      if (!cell.isPath) {
        el.classList.add('placeable');
        // Show preview when pet is selected
        if(state.selectedDefender){
          el.classList.add('ready-to-place');
        }
      }
    }
  });
}

function renderEnemies() {
  const enemiesContainer = document.getElementById('enemiesContainer');
  if (!enemiesContainer) return;
  enemiesContainer.innerHTML = '';

  state.enemies.forEach(enemy => {
    if (enemy.spawnDelay > 0) return;
    const enemyEl = document.createElement('div');
    enemyEl.className = 'enemy';
    enemyEl.style.left = `${enemy.position.col * (100 / GRID_COLS)}%`;
    enemyEl.style.top = `${enemy.position.row * (100 / GRID_ROWS)}%`;
    enemyEl.innerHTML = `
      <div class="enemy-emoji">${enemy.emoji}</div>
      <div class="enemy-hp">
        <div class="enemy-hp-bar" style="width:${(enemy.hp / enemy.maxHp) * 100}%"></div>
      </div>
    `;
    enemiesContainer.appendChild(enemyEl);
  });
  
  // Render projectiles
  state.projectiles.forEach(proj => {
    const projEl = document.createElement('div');
    projEl.className = 'projectile';
    projEl.style.left = `${proj.x * (100 / GRID_COLS)}%`;
    projEl.style.top = `${proj.y * (100 / GRID_ROWS)}%`;
    projEl.innerHTML = '💫';
    enemiesContainer.appendChild(projEl);
  });
}

/* --- Shop/Inventory Rendering --- */
function renderShop(){
  shopEl.innerHTML = '';
  PET_DEFENDERS.slice(0, 6).forEach(pet => {
    const div = document.createElement('div');
    div.className = `shop-item ${pet.rarity}`;
    div.innerHTML = `
      <div class="shop-emoji">${pet.emoji}</div>
      <div class="shop-info">
        <strong>${pet.name}</strong>
        <div class="shop-rarity">${pet.rarity}</div>
      </div>
    `;
    div.title = `${pet.description}\nDamage: ${pet.damage}, Range: ${pet.range}`;
    shopEl.appendChild(div);
  });
}

function renderInventory(){
  inventoryEl.innerHTML = '';
  
  if(state.ownedPets.length === 0){
    inventoryEl.innerHTML = '<p class="hint">No pets! Use gacha to get more.</p>';
    return;
  }
  
  state.ownedPets.forEach(pet => {
    const div = document.createElement('div');
    div.className = `inventory-item ${pet.rarity}`;
    if(state.selectedDefender && state.selectedDefender.uniqueId === pet.uniqueId){
      div.classList.add('selected');
    }
    div.innerHTML = `
      <div class="inv-emoji">${pet.emoji}</div>
      <div class="inv-name">${pet.name}</div>
      <div class="inv-stats">💪${pet.damage} 📏${pet.range}</div>
    `;
    div.title = `${pet.description}\nDamage: ${pet.damage}, Range: ${pet.range}, Speed: ${pet.attackSpeed}s\nClick to select for deployment`;
    // stable event listener; recreating inventory is OK on selection changes,
    // but we use addEventListener to avoid accidental overwrite if desired
    div.addEventListener('click', () => {
      state.selectedDefender = pet;
      log(`✅ Selected ${pet.name} - Click on a placeable cell to deploy!`);
      updateShopAndInventory();
    });
    inventoryEl.appendChild(div);
  });
}

function updateUI(){
  coinsEl.textContent = Math.floor(state.coins);
  gemsEl.textContent = Math.floor(state.gems);
  livesEl.textContent = state.lives;
  waveNumberEl.textContent = state.wave;
  updateBattleGrid();
  renderEnemies();
}

// Separate function for updating shop/inventory that's only called when needed
function updateShopAndInventory(){
  renderShop();
  renderInventory();
}

function gameOver(){
  state.isWaveActive = false;
  alert(`Game Over! You survived ${state.wave - 1} waves!\n\nStarting fresh...`);
  
  // Reset game
  state.lives = STARTING_LIVES;
  state.wave = 1;
  state.enemies = [];
  state.defenders = [];
  state.cells.forEach(cell => cell.defender = null);
  
  save();
  updateShopAndInventory();
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
  
  // Return to inventory as new pet
  const returnedPet = {
    ...PET_DEFENDERS.find(p => p.id === defender.id),
    uniqueId: Date.now() + '_' + Math.random()
  };
  
  state.ownedPets.push(returnedPet);
  state.coins += refund;
  
  // Remove defender
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  
  log(`💰 Sold ${defender.name} for ${refund} coins!`);
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
  
  // Return to inventory for redeployment
  const movingPet = {
    ...PET_DEFENDERS.find(p => p.id === defender.id),
    uniqueId: Date.now() + '_' + Math.random(),
    // Preserve upgrade stats if upgraded
    ...(defender.upgradeLevel > 0 ? {
      damage: defender.damage,
      range: defender.range,
      attackSpeed: defender.attackSpeed,
      upgradeLevel: defender.upgradeLevel,
      totalCost: defender.totalCost
    } : {})
  };
  
  state.ownedPets.push(movingPet);
  state.selectedDefender = movingPet;
  
  log(`🔄 Moving ${defender.name} - Click on a placeable cell to redeploy!`);
  updateUI();
  updateShopAndInventory();
}

/* --- Place defender (improved feedback) --- */
function placeDefender(cellIdx){
  const cell = state.cells[cellIdx];
  
  if(!state.selectedDefender){
    log('⚠️ Select a pet from your inventory first!');
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
  
  cell.defender = defender;
  state.defenders.push(defender);
  
  // Remove from inventory
  state.ownedPets = state.ownedPets.filter(p => p.uniqueId !== state.selectedDefender.uniqueId);
  state.selectedDefender = null;
  
  log(`✅ Deployed ${defender.name} at (${cell.row}, ${cell.col})`);
  updateUI();
  updateShopAndInventory();
}

/* --- Event Handlers --- */
startWaveBtn.addEventListener('click', () => spawnWave());
gachaBtn.addEventListener('click', () => openGacha());
closeGachaBtn.addEventListener('click', () => gachaModal.classList.add('hidden'));

// Make tower management functions globally accessible
window.upgradeDefender = upgradeDefender;
window.sellDefender = sellDefender;
window.moveDefender = moveDefender;

/* --- Game Loop --- */
let last = Date.now();
function gameLoop(){
  const now = Date.now();
  const deltaMs = now - last;
  const deltaSec = deltaMs / 1000;
  
  if(deltaMs >= TICK_INTERVAL){
    if(state.isWaveActive){
      updateEnemies(deltaSec);
      updateDefenders(deltaSec);
      updateProjectiles(deltaSec);
      // Only update UI during active wave for better performance
      updateUI();
    }
    
    last = now;
  }
  
  requestAnimationFrame(gameLoop);
}

/* --- Init --- */
function init(){
  load();
  
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
  
  // create the persistent DOM grid once
  createBattleGrid();
  
  // Initialize starter pets
  initStarterPets();
  
  // Set defaults
  if(state.coins === undefined) state.coins = STARTING_COINS;
  if(state.gems === undefined) state.gems = STARTING_GEMS;
  if(state.lives === undefined) state.lives = STARTING_LIVES;
  if(state.wave === undefined) state.wave = 1;
  
  updateUI();
  updateShopAndInventory();
  last = Date.now();
  gameLoop();
  log('🛡️ Welcome to Pet Defense! Deploy pets and defend against waves!');
}

init();