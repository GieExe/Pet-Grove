// Pet Grove — minimal pet-growing game with localStorage persistence

/* --- Configuration --- */
const TICK_INTERVAL = 1000; // ms
const GROWTH_PER_TICK = 0.5; // growth points per second
const XP_THRESHOLDS = [0, 100, 250, 500]; // thresholds for stages
const GARDEN_ROWS = 3;
const GARDEN_COLS = 4;
const STARTING_COINS = 50;

const PET_TYPES = [
  { id: 'dog', emoji: '🐶', name: 'Puppy', cost: 10, harvestValue: 15 },
  { id: 'cat', emoji: '🐱', name: 'Kitten', cost: 15, harvestValue: 25 },
  { id: 'panda', emoji: '🐼', name: 'Cub', cost: 25, harvestValue: 40 },
  { id: 'dragon', emoji: '🐲', name: 'Drake', cost: 50, harvestValue: 80 }
];

/* --- DOM refs --- */
const gardenGridEl = document.getElementById('gardenGrid');
const shopEl = document.getElementById('shop');
const coinsEl = document.getElementById('coinCount');
const logEl = document.getElementById('log');

let state = {
  coins: STARTING_COINS,
  plots: [], // array of garden plots
  selectedPetType: null, // currently selected pet type to plant
  lastTick: Date.now()
};

// Initialize garden plots
function initPlots(){
  state.plots = [];
  for(let row = 0; row < GARDEN_ROWS; row++){
    for(let col = 0; col < GARDEN_COLS; col++){
      state.plots.push({
        row,
        col,
        pet: null, // null or pet object
        plantedAt: null
      });
    }
  }
}

/* --- Utilities --- */
function log(msg){
  const li = document.createElement('li');
  li.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logEl.prepend(li);
}

function save(){
  localStorage.setItem('petgrove_state', JSON.stringify(state));
}

function load(){
  const raw = localStorage.getItem('petgrove_state');
  if(raw){
    try{
      state = JSON.parse(raw);
    }catch(e){
      console.warn('Failed to load state', e);
    }
  }
}

/* --- Pet logic --- */
function createPet(type){
  return {
    id: type.id,
    baseEmoji: type.emoji,
    name: type.name,
    growth: 0, // 0-100 per stage
    stage: 0, // 0=Baby, 1=Young, 2=Adult, 3=Elder
    harvestValue: type.harvestValue
  };
}

function getStageInfo(pet){
  if(!pet) return { name: '—', emoji: '🌱' };
  const stageNames = ['Baby', 'Young', 'Adult', 'Elder'];
  const stageSizes = ['40px', '50px', '60px', '70px'];
  return {
    name: stageNames[pet.stage] || 'Baby',
    emoji: pet.baseEmoji,
    size: stageSizes[pet.stage] || '40px'
  };
}

/* --- UI --- */
function renderShop(){
  shopEl.innerHTML = '<h3>Shop - Select Pet to Plant</h3><div class="shop-items"></div>';
  const shopItems = shopEl.querySelector('.shop-items');
  
  PET_TYPES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'shop-item';
    if(state.selectedPetType && state.selectedPetType.id === t.id){
      btn.classList.add('selected');
    }
    btn.innerHTML = `
      <div class="shop-emoji">${t.emoji}</div>
      <div class="shop-info">
        <strong>${t.name}</strong>
        <div class="shop-cost">💰 ${t.cost}</div>
      </div>
    `;
    btn.onclick = () => {
      if(state.coins >= t.cost){
        state.selectedPetType = t;
        log(`Selected ${t.name} to plant (Cost: ${t.cost} coins)`);
        updateUI();
      } else {
        alert(`Not enough coins! Need ${t.cost} coins.`);
      }
    };
    shopItems.appendChild(btn);
  });
}

function renderGarden(){
  gardenGridEl.innerHTML = '';
  
  state.plots.forEach((plot, idx) => {
    const plotEl = document.createElement('div');
    plotEl.className = 'plot';
    
    if(plot.pet){
      const stageInfo = getStageInfo(plot.pet);
      const growthPercent = plot.pet.growth;
      
      plotEl.innerHTML = `
        <div class="plot-pet" style="font-size:${stageInfo.size}">${stageInfo.emoji}</div>
        <div class="plot-stage">${stageInfo.name}</div>
        <div class="plot-progress">
          <div class="plot-progress-bar" style="width:${growthPercent}%"></div>
        </div>
      `;
      
      // Click to harvest if fully grown
      if(plot.pet.stage === 3 && plot.pet.growth >= 100){
        plotEl.classList.add('harvestable');
        plotEl.onclick = () => harvestPlot(idx);
      }
    } else {
      plotEl.classList.add('empty');
      plotEl.innerHTML = '<div class="plot-empty">🌱</div>';
      
      // Click to plant
      plotEl.onclick = () => plantPet(idx);
    }
    
    gardenGridEl.appendChild(plotEl);
  });
}

function updateUI(){
  coinsEl.textContent = Math.floor(state.coins);
  renderShop();
  renderGarden();
}

/* --- Actions --- */
function plantPet(plotIdx){
  if(!state.selectedPetType){
    alert('Select a pet from the shop first!');
    return;
  }
  
  const plot = state.plots[plotIdx];
  if(plot.pet){
    alert('This plot already has a pet!');
    return;
  }
  
  if(state.coins < state.selectedPetType.cost){
    alert(`Not enough coins! Need ${state.selectedPetType.cost} coins.`);
    return;
  }
  
  // Deduct coins and plant pet
  state.coins -= state.selectedPetType.cost;
  plot.pet = createPet(state.selectedPetType);
  plot.plantedAt = Date.now();
  
  log(`Planted ${state.selectedPetType.name} in plot ${plotIdx + 1}`);
  save();
  updateUI();
}

function harvestPlot(plotIdx){
  const plot = state.plots[plotIdx];
  if(!plot.pet) return;
  
  const value = plot.pet.harvestValue;
  state.coins += value;
  
  log(`Harvested ${plot.pet.name}! Earned ${value} coins 💰`);
  
  // Clear plot
  plot.pet = null;
  plot.plantedAt = null;
  
  save();
  updateUI();
}

/* --- Ticking / Time passage --- */
function tick(deltaSec){
  let anyGrowth = false;
  
  state.plots.forEach((plot, idx) => {
    if(!plot.pet) return;
    
    const pet = plot.pet;
    
    // Add growth
    pet.growth += GROWTH_PER_TICK * deltaSec;
    
    // Check for stage evolution
    if(pet.growth >= 100 && pet.stage < 3){
      pet.stage++;
      pet.growth = 0;
      const stageNames = ['Baby', 'Young', 'Adult', 'Elder'];
      log(`🌟 ${pet.name} in plot ${idx + 1} grew to ${stageNames[pet.stage]}!`);
      anyGrowth = true;
    }
    
    // Cap growth at 100 for final stage
    if(pet.stage === 3 && pet.growth >= 100){
      pet.growth = 100;
    }
  });
  
  return anyGrowth;
}

let last = Date.now();
function mainLoop(){
  const now = Date.now();
  const deltaMs = now - last;
  const deltaSec = deltaMs / 1000;
  if(deltaMs >= TICK_INTERVAL){
    const hadGrowth = tick(deltaSec);
    save();
    if(hadGrowth){
      updateUI();
    }
    last = now;
  }
  requestAnimationFrame(mainLoop);
}

/* --- Init --- */
function init(){
  load();
  
  // Initialize plots if not present
  if(!state.plots || state.plots.length === 0){
    initPlots();
  }
  
  // Migrate old single-pet state if present
  if(state.pet){
    delete state.pet;
    delete state.food;
  }
  
  // Set default coins if not present
  if(state.coins === undefined){
    state.coins = STARTING_COINS;
  }
  
  updateUI();
  last = Date.now();
  mainLoop();
  log('🌱 Welcome to Pet Grove! Plant and grow pets in your garden!');
}

init();