// Pet Grove — minimal pet-growing game with localStorage persistence

/* --- Configuration --- */
const TICK_INTERVAL = 1000; // ms
const HUNGER_DECAY_PER_TICK = 0.2;
const HAPPINESS_DECAY_PER_TICK = 0.1;
const XP_PER_PLAY = 12;
const FEED_FOOD_RESTORE = 20;
const XP_THRESHOLDS = [0, 100, 250, 500]; // thresholds for stages

const PET_TYPES = [
  { id: 'dog', emoji: '🐶', name: 'Puppy' },
  { id: 'cat', emoji: '🐱', name: 'Kitten' },
  { id: 'panda', emoji: '🐼', name: 'Cub' },
  { id: 'dragon', emoji: '🐲', name: 'Drake' }
];

/* --- DOM refs --- */
const petOptionsEl = document.getElementById('petOptions');
const petCardEl = document.getElementById('petCard');
const noPetEl = document.getElementById('noPet');
const petSpriteEl = document.getElementById('petSprite');
const petNameEl = document.getElementById('petName');
const petStageEl = document.getElementById('petStage');
const petLevelEl = document.getElementById('petLevel');
const xpBarEl = document.getElementById('xpBar');
const hungerEl = document.getElementById('hunger');
const happinessEl = document.getElementById('happiness');

const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const renameBtn = document.getElementById('renameBtn');
const releaseBtn = document.getElementById('releaseBtn');

const gatherFoodBtn = document.getElementById('gatherFoodBtn');
const foodCountEl = document.getElementById('foodCount');
const logEl = document.getElementById('log');

let state = {
  food: 3,
  pet: null, // object or null
  lastTick: Date.now()
};

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
    nickname: type.name,
    xp: 0,
    level: 1,
    hunger: 60, // 0-100 (100 = full)
    happiness: 60,
    createdAt: Date.now()
  };
}

function getStage(pet){
  if(!pet) return '—';
  for(let i = XP_THRESHOLDS.length-1; i >=0; i--){
    if(pet.xp >= XP_THRESHOLDS[i]) {
      switch(i){
        case 0: return 'Baby';
        case 1: return 'Young';
        case 2: return 'Adult';
        case 3: return 'Elder';
      }
    }
  }
  return 'Baby';
}

/* --- UI --- */
function renderPetOptions(){
  petOptionsEl.innerHTML = '';
  PET_TYPES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.innerHTML = `<div class="sprite">${t.emoji}</div><div style="flex:1"><strong>${t.name}</strong><div style="font-size:12px;color:#666">${t.id}</div></div>`;
    btn.onclick = () => {
      if(state.pet){
        if(!confirm('You already have a pet. Release it first to adopt a new one.')) return;
      }
      state.pet = createPet(t);
      log(`Adopted ${t.name} ${t.emoji}`);
      save();
      updateUI();
    };
    petOptionsEl.appendChild(btn);
  });
}

function updateUI(){
  foodCountEl.textContent = Math.floor(state.food);
  if(!state.pet){
    petCardEl.classList.add('hidden');
    noPetEl.classList.remove('hidden');
  } else {
    petCardEl.classList.remove('hidden');
    noPetEl.classList.add('hidden');

    const p = state.pet;
    petSpriteEl.textContent = p.baseEmoji;
    petNameEl.textContent = p.nickname;
    petStageEl.textContent = getStage(p);
    petLevelEl.textContent = Math.max(1, Math.floor(p.xp/100)+1);
    xpBarEl.max = Math.max(1, XP_THRESHOLDS[1] || 100);
    xpBarEl.value = Math.min(100, p.xp % 100);
    hungerEl.textContent = Math.max(0, Math.round(p.hunger));
    happinessEl.textContent = Math.max(0, Math.round(p.happiness));
  }
}

/* --- Actions --- */
feedBtn.addEventListener('click', () => {
  if(!state.pet) return alert('Adopt a pet first!');
  if(state.food <= 0) return alert('No food. Gather food first.');
  state.food = Math.max(0, state.food - 1);
  state.pet.hunger = Math.min(100, state.pet.hunger + FEED_FOOD_RESTORE);
  state.pet.xp += 8;
  log(`Fed ${state.pet.nickname}. Hunger +${FEED_FOOD_RESTORE}`);
  save();
  updateUI();
});

playBtn.addEventListener('click', () => {
  if(!state.pet) return alert('Adopt a pet first!');
  state.pet.happiness = Math.min(100, state.pet.happiness + 12);
  state.pet.xp += XP_PER_PLAY;
  log(`Played with ${state.pet.nickname}. Happiness +12, XP +${XP_PER_PLAY}`);
  save();
  updateUI();
});

renameBtn.addEventListener('click', () => {
  if(!state.pet) return alert('Adopt a pet first!');
  const newName = prompt('Enter new name for your pet', state.pet.nickname);
  if(newName && newName.trim()){
    state.pet.nickname = newName.trim();
    log(`Renamed pet to ${state.pet.nickname}`);
    save();
    updateUI();
  }
});

releaseBtn.addEventListener('click', () => {
  if(!state.pet) return;
  if(confirm(`Release ${state.pet.nickname}? This will remove the pet.`)){
    log(`Released ${state.pet.nickname}`);
    state.pet = null;
    save();
    updateUI();
  }
});

gatherFoodBtn.addEventListener('click', () => {
  const found = Math.floor(Math.random() * 3) + 1;
  state.food += found;
  log(`Gathered ${found} food.`);
  save();
  updateUI();
});

/* --- Ticking / Time passage --- */
function tick(deltaSec){
  if(!state.pet) return;
  const p = state.pet;
  // hunger & happiness decay
  p.hunger = Math.max(0, p.hunger - HUNGER_DECAY_PER_TICK * deltaSec);
  p.happiness = Math.max(0, p.happiness - HAPPINESS_DECAY_PER_TICK * deltaSec);

  // If hunger is low, happiness decreases faster and xp gain is reduced (simplified)
  if(p.hunger < 20){
    p.happiness = Math.max(0, p.happiness - 0.2 * deltaSec);
  }

  // Passive XP from happy pets
  if(p.happiness > 80 && p.hunger > 40){
    p.xp += 0.5 * deltaSec;
  }

  // Level up check and log
  const stage = getStage(p);
  const newStage = getStage(p);
  if(newStage !== stage){
    log(`${p.nickname} evolved to ${newStage}!`);
  }

  // Cap xp reasonable
  p.xp = Math.min(100000, p.xp);
}

let last = Date.now();
function mainLoop(){
  const now = Date.now();
  const deltaMs = now - last;
  const deltaSec = deltaMs / 1000;
  if(deltaMs >= TICK_INTERVAL){
    tick(deltaSec);
    save();
    updateUI();
    last = now;
  }
  requestAnimationFrame(mainLoop);
}

/* --- Init --- */
function init(){
  load();
  renderPetOptions();
  updateUI();
  last = Date.now();
  mainLoop();
  log('Welcome to Pet Grove! Adopt and grow a pet 🌱');
}

init();