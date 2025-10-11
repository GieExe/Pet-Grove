// Pet Defense — Tower Defense game with pets and gacha system

/* --- Configuration --- */
const TICK_INTERVAL = 100; // ms - faster for TD gameplay
const GRID_ROWS = 5;
const GRID_COLS = 8;
const STARTING_COINS = 100;
const STARTING_GEMS = 50;
const STARTING_LIVES = 20;
const GACHA_COST = 50;

// Pet Defenders (Towers)
const PET_DEFENDERS = [
  { 
    id: 'dog', 
    emoji: '🐶', 
    name: 'Guard Dog', 
    cost: 50, 
    damage: 10, 
    range: 1.5, 
    attackSpeed: 1.0,
    rarity: 'common',
    description: 'Basic melee defender'
  },
  { 
    id: 'cat', 
    emoji: '🐱', 
    name: 'Ninja Cat', 
    cost: 75, 
    damage: 15, 
    range: 2, 
    attackSpeed: 0.8,
    rarity: 'common',
    description: 'Fast attacker'
  },
  { id: 'rabbit', emoji: '🐰', name: 'Swift Bunny', cost: 60, damage: 8, range: 1.8, attackSpeed: 0.6, rarity:'common', description:'Very fast attacker' },
  { id: 'turtle', emoji: '🐢', name: 'Tank Turtle', cost: 80, damage: 18, range: 1.2, attackSpeed: 2.0, rarity:'common', description:'Slow but tough' },
  { id: 'panda', emoji: '🐼', name: 'Kung Fu Panda', cost: 120, damage: 25, range: 1.5, attackSpeed: 1.5, rarity:'rare', description:'Strong melee fighter' },
  { id: 'owl', emoji: '🦉', name: 'Wise Owl', cost: 150, damage: 12, range: 3.5, attackSpeed: 1.5, rarity:'rare', description:'Long range sniper' },
  { id: 'bear', emoji: '🐻', name: 'Grizzly Bear', cost: 140, damage: 30, range: 1.8, attackSpeed: 1.8, rarity:'rare', description:'Powerful close range' },
  { id: 'wolf', emoji: '🐺', name: 'Alpha Wolf', cost: 160, damage: 22, range: 2.2, attackSpeed: 1.2, rarity:'rare', description:'Balanced fighter' },
  { id: 'dragon', emoji: '🐲', name: 'Fire Dragon', cost: 300, damage: 40, range: 3.0, attackSpeed: 2.0, rarity:'epic', description:'Powerful ranged attacker' },
  { id: 'tiger', emoji: '🐯', name: 'Bengal Tiger', cost: 280, damage: 38, range: 2.0, attackSpeed: 1.4, rarity:'epic', description:'Fierce predator' },
  { id: 'phoenix', emoji: '🦅', name: 'Phoenix', cost: 320, damage: 35, range: 3.5, attackSpeed: 1.6, rarity:'epic', description:'Aerial superiority' },
  { id: 'lion', emoji: '🦁', name: 'Lion King', cost: 500, damage: 50, range: 2.0, attackSpeed: 1.2, rarity:'legendary', description:'Ultimate damage dealer' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', cost: 480, damage: 45, range: 2.8, attackSpeed: 1.0, rarity:'legendary', description:'Magical powerhouse' },
  { id: 'trex', emoji: '🦖', name: 'T-Rex', cost: 520, damage: 55, range: 1.6, attackSpeed: 1.8, rarity:'legendary', description:'Prehistoric destroyer' }
];

const ENEMY_TYPES = [
  { id: 'slime', emoji: '👾', name: 'Slime', hp: 50, speed: 1.0, reward: 10, gems: 0 },
  { id: 'goblin', emoji: '👹', name: 'Goblin', hp: 80, speed: 1.2, reward: 15, gems: 0 },
  { id: 'imp', emoji: '👿', name: 'Imp', hp: 60, speed: 1.5, reward: 12, gems: 0 },
  { id: 'orc', emoji: '👺', name: 'Orc', hp: 150, speed: 0.8, reward: 30, gems: 1 },
  { id: 'ghost', emoji: '👻', name: 'Ghost', hp: 100, speed: 1.3, reward: 25, gems: 1 },
  { id: 'demon', emoji: '😈', name: 'Demon', hp: 300, speed: 1.5, reward: 50, gems: 5 },
  { id: 'skull', emoji: '💀', name: 'Skeleton', hp: 120, speed: 1.1, reward: 28, gems: 1 },
  { id: 'alien', emoji: '👽', name: 'Alien', hp: 200, speed: 1.0, reward: 40, gems: 3 }
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

// Path definition - enemies follow this path
const PATH = [
  { row: 2, col: 0 },
  { row: 2, col: 1 },
  { row: 2, col: 2 },
  { row: 1, col: 2 },
  { row: 1, col: 3 },
  { row: 1, col: 4 },
  { row: 2, col: 4 },
  { row: 3, col: 4 },
  { row: 3, col: 5 },
  { row: 3, col: 6 },
  { row: 3, col: 7 }
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
  // Don't save active wave state
  const saveState = {
    ...state,
    isWaveActive: false,
    enemies: [],
    projectiles: [],
    defenders: []
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
    alert('Not enough gems! Need 50 gems.');
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
      hp: enemyType.hp * (1 + state.wave * 0.1), // Scale HP with wave
      maxHp: enemyType.hp * (1 + state.wave * 0.1),
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
  
  const coinReward = 50 + state.wave * 10;
  const gemReward = 5 + Math.floor(state.wave / 3);
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
      
      // instant damage for simplicity
      target.hp -= def.damage;
      if(target.hp <= 0){
        log(`💥 ${def.name} defeated ${target.name} (+${target.reward} coins)`);
        state.coins += (target.reward || 0);
        state.gems += (target.gems || 0);
      }
      def.attackCooldown = def.attackSpeed;
    }
  });
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
      el.innerHTML = `<div class="defender">${cell.defender.emoji}</div>`;
    } else {
      el.innerHTML = '';
      if (!cell.isPath) {
        el.classList.add('placeable');
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
    `;
    div.title = `${pet.description}\nDamage: ${pet.damage}, Range: ${pet.range}\nClick to select`;
    // stable event listener; recreating inventory is OK on selection changes,
    // but we use addEventListener to avoid accidental overwrite if desired
    div.addEventListener('click', () => {
      state.selectedDefender = pet;
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

/* --- Place defender (unchanged logic) --- */
function placeDefender(cellIdx){
  const cell = state.cells[cellIdx];
  
  if(!state.selectedDefender){
    alert('Select a pet from your inventory first!');
    return;
  }
  
  if(cell.isPath){
    alert('Cannot place defenders on the path!');
    return;
  }
  
  if(cell.defender){
    alert('Cell already occupied!');
    return;
  }
  
  // Place the defender
  const defender = {
    ...state.selectedDefender,
    row: cell.row,
    col: cell.col,
    attackCooldown: 0
  };
  
  cell.defender = defender;
  state.defenders.push(defender);
  
  // Remove from inventory
  state.ownedPets = state.ownedPets.filter(p => p.uniqueId !== state.selectedDefender.uniqueId);
  state.selectedDefender = null;
  
  log(`Deployed ${defender.name} at (${cell.row}, ${cell.col})`);
  updateUI();
  updateShopAndInventory();
}

/* --- Event Handlers --- */
startWaveBtn.addEventListener('click', () => spawnWave());
gachaBtn.addEventListener('click', () => openGacha());
closeGachaBtn.addEventListener('click', () => gachaModal.classList.add('hidden'));

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