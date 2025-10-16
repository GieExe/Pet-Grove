// Pet Defense — Tower Defense game with pets and gacha system

/* --- Configuration --- */
const TICK_INTERVAL = 100; // ms - faster for TD gameplay
const GRID_ROWS = 7; // Expanded from 5 to 7 for more placement space
const GRID_COLS = 10; // Expanded from 8 to 10 for more placement space
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
  { id: 'kraken', emoji: '🐙', name: 'Kraken', cost: 510, damage: 85, range: 3.0, attackSpeed: 0.9, rarity:'legendary', description:'Tentacled terror' },
  { id: 'raccoon', emoji: '🦝', name: 'Sneaky Raccoon', cost: 65, damage: 20, range: 1.7, attackSpeed: 0.7, rarity:'common', description:'Stealthy attacker' },
  { id: 'penguin', emoji: '🐧', name: 'Ice Penguin', cost: 70, damage: 24, range: 2.1, attackSpeed: 0.9, rarity:'common', description:'Cool defender' },
  { id: 'koala', emoji: '🐨', name: 'Koala Warrior', cost: 90, damage: 28, range: 1.4, attackSpeed: 1.3, rarity:'common', description:'Sleepy but strong' },
  { id: 'eagle', emoji: '🦅', name: 'War Eagle', cost: 145, damage: 32, range: 3.8, attackSpeed: 1.1, rarity:'rare', description:'Sky dominator' },
  { id: 'gorilla', emoji: '🦍', name: 'Gorilla Guard', cost: 155, damage: 48, range: 1.3, attackSpeed: 1.6, rarity:'rare', description:'Powerful tank' },
  { id: 'rhino', emoji: '🦏', name: 'Rhino Charger', cost: 165, damage: 52, range: 1.5, attackSpeed: 1.7, rarity:'rare', description:'Heavy hitter' },
  { id: 'leopard', emoji: '🐆', name: 'Speed Leopard', cost: 170, damage: 42, range: 2.5, attackSpeed: 0.7, rarity:'rare', description:'Lightning fast' },
  { id: 'hydra', emoji: '🐉', name: 'Hydra', cost: 310, damage: 72, range: 2.8, attackSpeed: 1.3, rarity:'epic', description:'Multi-headed beast' },
  { id: 'griffin', emoji: '🦅', name: 'Griffin', cost: 295, damage: 68, range: 3.2, attackSpeed: 1.0, rarity:'epic', description:'Mythical guardian' },
  { id: 'cerberus', emoji: '🐺', name: 'Cerberus', cost: 305, damage: 75, range: 1.9, attackSpeed: 1.1, rarity:'epic', description:'Three-headed guardian' },
  { id: 'snake', emoji: '🐍', name: 'Viper', cost: 85, damage: 26, range: 2.3, attackSpeed: 0.8, rarity:'common', description:'Poisonous striker', ability:'poison' },
  { id: 'elephant', emoji: '🐘', name: 'War Elephant', cost: 175, damage: 55, range: 1.4, attackSpeed: 1.8, rarity:'rare', description:'Slow but devastating', ability:'splash' },
  { id: 'bat', emoji: '🦇', name: 'Shadow Bat', cost: 95, damage: 30, range: 2.6, attackSpeed: 0.6, rarity:'common', description:'Swift night hunter', ability:'lifesteal' },
  { id: 'frog', emoji: '🐸', name: 'Poison Frog', cost: 100, damage: 22, range: 2.4, attackSpeed: 0.9, rarity:'common', description:'Toxic defender', ability:'poison' },
  { id: 'crocodile', emoji: '🐊', name: 'Croc Hunter', cost: 185, damage: 58, range: 1.6, attackSpeed: 1.5, rarity:'rare', description:'Crushing jaws', ability:'stun' },
  { id: 'seahorse', emoji: '🐴', name: 'Swift Horse', cost: 110, damage: 33, range: 2.0, attackSpeed: 0.5, rarity:'common', description:'Lightning fast', ability:'multishot' },
  { id: 'scorpion', emoji: '🦂', name: 'Scorpion King', cost: 195, damage: 44, range: 2.1, attackSpeed: 1.0, rarity:'rare', description:'Venomous stinger', ability:'poison' },
  { id: 'spider', emoji: '🕷️', name: 'Giant Spider', cost: 125, damage: 35, range: 2.5, attackSpeed: 1.1, rarity:'common', description:'Web master', ability:'slow' },
  { id: 'octopus', emoji: '🐙', name: 'Deep Octopus', cost: 200, damage: 48, range: 2.8, attackSpeed: 1.0, rarity:'rare', description:'Tentacle attacker', ability:'splash' },
  { id: 'whale', emoji: '🐋', name: 'Sky Whale', cost: 330, damage: 78, range: 3.2, attackSpeed: 1.4, rarity:'epic', description:'Massive aerial beast', ability:'splash' },
  { id: 'bee', emoji: '🐝', name: 'Queen Bee', cost: 115, damage: 28, range: 2.2, attackSpeed: 0.7, rarity:'common', description:'Swarm commander', ability:'multishot' },
  { id: 'butterfly', emoji: '🦋', name: 'Mystic Butterfly', cost: 135, damage: 32, range: 3.0, attackSpeed: 0.9, rarity:'rare', description:'Magical wings', ability:'lifesteal' },
  { id: 'crab', emoji: '🦀', name: 'Armored Crab', cost: 105, damage: 38, range: 1.3, attackSpeed: 1.4, rarity:'common', description:'Hard shell defender', ability:'stun' },
  { id: 'flamingo', emoji: '🦩', name: 'Flame Flamingo', cost: 340, damage: 70, range: 3.3, attackSpeed: 1.2, rarity:'epic', description:'Elegant fire bird', ability:'burn' },
  { id: 'sloth', emoji: '🦥', name: 'Battle Sloth', cost: 95, damage: 45, range: 1.5, attackSpeed: 2.0, rarity:'common', description:'Slow but mighty', ability:'stun' },
  { id: 'cheetah', emoji: '🐆', name: 'Cheetah Runner', cost: 115, damage: 38, range: 2.0, attackSpeed: 0.4, rarity:'common', description:'Fastest attacker', ability:'multishot' },
  { id: 'kangaroo', emoji: '🦘', name: 'Boxing Kangaroo', cost: 125, damage: 42, range: 1.7, attackSpeed: 0.8, rarity:'common', description:'Punch combo fighter' },
  { id: 'camel', emoji: '🐫', name: 'Desert Camel', cost: 135, damage: 40, range: 2.3, attackSpeed: 1.3, rarity:'rare', description:'Desert warrior' },
  { id: 'giraffe', emoji: '🦒', name: 'Long Neck', cost: 145, damage: 36, range: 4.0, attackSpeed: 1.5, rarity:'rare', description:'Ultra long range' },
  { id: 'hippo', emoji: '🦛', name: 'River Hippo', cost: 180, damage: 60, range: 1.4, attackSpeed: 1.9, rarity:'rare', description:'Heavy tank', ability:'splash' },
  { id: 'moose', emoji: '🦌', name: 'Moose Charger', cost: 155, damage: 50, range: 1.8, attackSpeed: 1.4, rarity:'rare', description:'Antler attacker', ability:'stun' },
  { id: 'mammoth', emoji: '🦣', name: 'Mammoth', cost: 350, damage: 88, range: 1.6, attackSpeed: 1.8, rarity:'epic', description:'Ancient powerhouse', ability:'splash' },
  { id: 'dodo', emoji: '🦤', name: 'Ancient Dodo', cost: 300, damage: 65, range: 2.5, attackSpeed: 1.3, rarity:'epic', description:'Extinct warrior' },
  { id: 'peacock', emoji: '🦚', name: 'Royal Peacock', cost: 315, damage: 68, range: 3.0, attackSpeed: 1.1, rarity:'epic', description:'Dazzling defender', ability:'slow' },
  { id: 'phoenix2', emoji: '🔥', name: 'True Phoenix', cost: 550, damage: 95, range: 3.8, attackSpeed: 0.9, rarity:'legendary', description:'Reborn from ashes', ability:'burn' },
  { id: 'yeti', emoji: '❄️', name: 'Frost Yeti', cost: 530, damage: 92, range: 2.2, attackSpeed: 1.0, rarity:'legendary', description:'Ice beast', ability:'slow' },
  { id: 'chimera', emoji: '🐲', name: 'Chimera', cost: 560, damage: 98, range: 2.6, attackSpeed: 0.8, rarity:'legendary', description:'Triple threat', ability:'splash' },
  // New pets for better variety
  { id: 'parrot', emoji: '🦜', name: 'Sky Parrot', cost: 90, damage: 26, range: 2.8, attackSpeed: 0.8, rarity:'common', description:'Colorful flyer' },
  { id: 'hamster', emoji: '🐹', name: 'Battle Hamster', cost: 55, damage: 19, range: 1.6, attackSpeed: 0.6, rarity:'common', description:'Tiny but fierce' },
  { id: 'hedgehog', emoji: '🦔', name: 'Spike Guard', cost: 85, damage: 28, range: 1.4, attackSpeed: 1.2, rarity:'common', description:'Spiky defender', ability:'stun' },
  { id: 'otter', emoji: '🦦', name: 'River Otter', cost: 100, damage: 30, range: 2.0, attackSpeed: 0.7, rarity:'common', description:'Playful fighter', ability:'multishot' },
  { id: 'badger', emoji: '🦡', name: 'Honey Badger', cost: 175, damage: 46, range: 1.5, attackSpeed: 1.1, rarity:'rare', description:'Fearless warrior' },
  { id: 'lynx', emoji: '🐈', name: 'Wild Lynx', cost: 165, damage: 44, range: 2.4, attackSpeed: 0.8, rarity:'rare', description:'Stealthy predator', ability:'poison' },
  { id: 'falcon', emoji: '🦅', name: 'Dive Falcon', cost: 180, damage: 38, range: 3.6, attackSpeed: 0.9, rarity:'rare', description:'Swift striker', ability:'multishot' },
  { id: 'boar', emoji: '🐗', name: 'War Boar', cost: 190, damage: 54, range: 1.3, attackSpeed: 1.5, rarity:'rare', description:'Charging beast', ability:'stun' },
  { id: 'salamander', emoji: '🦎', name: 'Fire Salamander', cost: 325, damage: 74, range: 2.7, attackSpeed: 1.2, rarity:'epic', description:'Flame thrower', ability:'burn' },
  { id: 'gargoyle', emoji: '🗿', name: 'Stone Gargoyle', cost: 340, damage: 76, range: 2.0, attackSpeed: 1.6, rarity:'epic', description:'Ancient guardian', ability:'splash' },
  { id: 'manticore', emoji: '🦁', name: 'Manticore', cost: 570, damage: 100, range: 2.8, attackSpeed: 0.85, rarity:'legendary', description:'Mythical beast', ability:'poison' },
  { id: 'thunderbird', emoji: '⚡', name: 'Thunder Bird', cost: 580, damage: 96, range: 3.5, attackSpeed: 0.95, rarity:'legendary', description:'Storm bringer', ability:'stun' },
  // NEW PETS - More variety and balance
  { id: 'squirrel', emoji: '🐿️', name: 'Acorn Guard', cost: 60, damage: 20, range: 1.9, attackSpeed: 0.6, rarity:'common', description:'Nimble defender' },
  { id: 'beaver', emoji: '🦫', name: 'Builder Beaver', cost: 75, damage: 26, range: 1.5, attackSpeed: 1.0, rarity:'common', description:'Construction expert', ability:'stun' },
  { id: 'seal', emoji: '🦭', name: 'Arctic Seal', cost: 80, damage: 28, range: 2.0, attackSpeed: 0.9, rarity:'common', description:'Cold defender', ability:'slow' },
  { id: 'duck', emoji: '🦆', name: 'Quack Warrior', cost: 65, damage: 22, range: 2.2, attackSpeed: 0.7, rarity:'common', description:'Feathered fighter' },
  { id: 'skunk', emoji: '🦨', name: 'Toxic Skunk', cost: 95, damage: 30, range: 2.4, attackSpeed: 1.0, rarity:'common', description:'Smelly defender', ability:'poison' },
  { id: 'armadillo', emoji: '🦔', name: 'Tank Armadillo', cost: 100, damage: 35, range: 1.2, attackSpeed: 1.5, rarity:'common', description:'Armored defender' },
  { id: 'bison', emoji: '🦬', name: 'Thunder Bison', cost: 180, damage: 50, range: 1.6, attackSpeed: 1.4, rarity:'rare', description:'Stampeding force', ability:'stun' },
  { id: 'raccoondog', emoji: '🦝', name: 'Shadow Tanuki', cost: 175, damage: 43, range: 2.3, attackSpeed: 0.8, rarity:'rare', description:'Mystical trickster', ability:'multishot' },
  { id: 'okapi', emoji: '🦓', name: 'Forest Okapi', cost: 170, damage: 40, range: 2.5, attackSpeed: 0.9, rarity:'rare', description:'Rare forest dweller' },
  { id: 'pangolin', emoji: '🦡', name: 'Scale Guardian', cost: 185, damage: 48, range: 1.4, attackSpeed: 1.3, rarity:'rare', description:'Scaled protector', ability:'splash' },
  { id: 'anteater', emoji: '🐜', name: 'Giant Anteater', cost: 165, damage: 38, range: 1.8, attackSpeed: 1.1, rarity:'rare', description:'Long tongue striker' },
  { id: 'tapir', emoji: '🦌', name: 'Dream Tapir', cost: 190, damage: 45, range: 2.1, attackSpeed: 1.0, rarity:'rare', description:'Dream eater', ability:'slow' },
  { id: 'basilisk', emoji: '🐍', name: 'Basilisk', cost: 335, damage: 80, range: 2.9, attackSpeed: 1.1, rarity:'epic', description:'Legendary serpent', ability:'poison' },
  { id: 'wyvern', emoji: '🐉', name: 'Wyvern', cost: 345, damage: 82, range: 3.4, attackSpeed: 1.0, rarity:'epic', description:'Lesser dragon', ability:'burn' },
  { id: 'sphinx', emoji: '🦁', name: 'Sphinx', cost: 350, damage: 78, range: 2.5, attackSpeed: 1.2, rarity:'epic', description:'Riddle keeper', ability:'stun' },
  { id: 'banshee', emoji: '👻', name: 'Wailing Banshee', cost: 330, damage: 75, range: 3.0, attackSpeed: 0.9, rarity:'epic', description:'Soul screamer', ability:'slow' },
  { id: 'gorgon', emoji: '🐍', name: 'Gorgon', cost: 355, damage: 84, range: 2.6, attackSpeed: 1.3, rarity:'epic', description:'Stone gaze', ability:'stun' },
  // NEW MYTHIC RARITY - Ultra rare and powerful
  { id: 'celestialdragon', emoji: '🌟', name: 'Celestial Dragon', cost: 800, damage: 150, range: 4.0, attackSpeed: 0.7, rarity:'mythic', description:'Divine sky ruler', ability:'splash' },
  { id: 'worldtree', emoji: '🌳', name: 'World Tree', cost: 850, damage: 130, range: 3.8, attackSpeed: 1.0, rarity:'mythic', description:'Ancient life giver', ability:'lifesteal' },
  { id: 'leviathan', emoji: '🐋', name: 'Leviathan', cost: 900, damage: 160, range: 3.2, attackSpeed: 0.9, rarity:'mythic', description:'Ocean titan', ability:'splash' },
  { id: 'archphoenix', emoji: '🔥', name: 'Arch Phoenix', cost: 880, damage: 145, range: 4.2, attackSpeed: 0.6, rarity:'mythic', description:'Eternal flame', ability:'burn' },
  { id: 'voidbeast', emoji: '🌑', name: 'Void Beast', cost: 950, damage: 170, range: 3.5, attackSpeed: 0.8, rarity:'mythic', description:'Darkness incarnate', ability:'multishot' }
];

const ENEMY_TYPES = [
  { id: 'slime', emoji: '👾', name: 'Slime', hp: 40, speed: 1.0, reward: 15, gems: 1 },
  { id: 'goblin', emoji: '👹', name: 'Goblin', hp: 60, speed: 1.2, reward: 20, gems: 1 },
  { id: 'imp', emoji: '👿', name: 'Imp', hp: 50, speed: 1.5, reward: 18, gems: 1 },
  { id: 'orc', emoji: '👺', name: 'Orc', hp: 100, speed: 0.8, reward: 35, gems: 2 },
  { id: 'ghost', emoji: '👻', name: 'Ghost', hp: 70, speed: 1.3, reward: 30, gems: 2 },
  { id: 'demon', emoji: '😈', name: 'Demon', hp: 200, speed: 1.5, reward: 60, gems: 5 },
  { id: 'skull', emoji: '💀', name: 'Skeleton', hp: 80, speed: 1.1, reward: 32, gems: 2 },
  { id: 'alien', emoji: '👽', name: 'Alien', hp: 120, speed: 1.0, reward: 45, gems: 3 },
  { id: 'zombie', emoji: '🧟', name: 'Zombie', hp: 90, speed: 0.7, reward: 28, gems: 2 },
  { id: 'vampire', emoji: '🧛', name: 'Vampire', hp: 150, speed: 1.4, reward: 50, gems: 4 },
  { id: 'werewolf', emoji: '🐺', name: 'Werewolf', hp: 180, speed: 1.6, reward: 55, gems: 4 },
  { id: 'mummy', emoji: '🧟‍♂️', name: 'Mummy', hp: 110, speed: 0.9, reward: 38, gems: 3 },
  { id: 'witch', emoji: '🧙', name: 'Witch', hp: 140, speed: 1.1, reward: 48, gems: 3 },
  { id: 'troll', emoji: '🧌', name: 'Troll', hp: 250, speed: 0.6, reward: 70, gems: 6 },
  { id: 'dragon', emoji: '🐲', name: 'Mini Dragon', hp: 300, speed: 1.2, reward: 80, gems: 7 },
  { id: 'golem', emoji: '🗿', name: 'Stone Golem', hp: 350, speed: 0.5, reward: 90, gems: 8 }
];

// Gacha rarities and rates - Adjusted with new MYTHIC tier
const GACHA_RATES = {
  common: 0.62,     // 62% - Slightly reduced for mythic
  rare: 0.23,       // 23% - Increased slightly  
  epic: 0.11,       // 11% - Increased slightly
  legendary: 0.035, // 3.5% - Increased slightly
  mythic: 0.005     // 0.5% - Ultra rare new tier!
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
  lastTick: Date.now(),
  selectedMap: 'classic', // Current map selection
  gameSpeed: 1, // Game speed multiplier (1x, 1.5x, 2x, 3x)
  stats: { // Game statistics
    totalEnemiesDefeated: 0,
    totalDamageDealt: 0,
    wavesCompleted: 0,
    gachaRolls: 0,
    highestWave: 1,
    totalCoinsEarned: 0,
    totalGemsEarned: 0
  }
};

// Path definition - enemies follow this path (optimized for more tower placement)
// Multiple map layouts available
const MAPS = {
  classic: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 4 },
    { row: 3, col: 5 },
    { row: 3, col: 6 },
    { row: 3, col: 7 },
    { row: 3, col: 8 },
    { row: 3, col: 9 }
  ],
  zigzag: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
    { row: 3, col: 4 },
    { row: 3, col: 5 },
    { row: 4, col: 5 },
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 5, col: 7 },
    { row: 5, col: 8 },
    { row: 5, col: 9 }
  ],
  spiral: [
    { row: 3, col: 0 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
    { row: 2, col: 2 },
    { row: 1, col: 2 },
    { row: 1, col: 3 },
    { row: 1, col: 4 },
    { row: 2, col: 4 },
    { row: 3, col: 4 },
    { row: 4, col: 4 },
    { row: 5, col: 4 },
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 5, col: 7 },
    { row: 5, col: 8 },
    { row: 5, col: 9 }
  ]
};

let PATH = MAPS.classic; // Default map

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
    // Give player 2 basic pets to start with kg system
    const pet1 = { ...PET_DEFENDERS[0], uniqueId: Date.now() + '_1' };
    const pet2 = { ...PET_DEFENDERS[1], uniqueId: Date.now() + '_2' };
    
    // Add kg to starter pets
    pet1.kg = generatePetKg('common');
    pet1.kgBonus = getKgBonus(pet1.kg, 'common');
    pet1.damage = Math.floor(pet1.damage * pet1.kgBonus);
    pet1.range = pet1.range * pet1.kgBonus;
    pet1.attackSpeed = pet1.attackSpeed / Math.sqrt(pet1.kgBonus);
    
    pet2.kg = generatePetKg('common');
    pet2.kgBonus = getKgBonus(pet2.kg, 'common');
    pet2.damage = Math.floor(pet2.damage * pet2.kgBonus);
    pet2.range = pet2.range * pet2.kgBonus;
    pet2.attackSpeed = pet2.attackSpeed / Math.sqrt(pet2.kgBonus);
    
    state.ownedPets.push(pet1, pet2);
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
  
  // Save auto-sell preference
  const autoSellCheckbox = document.getElementById('autoSellCommon');
  if(autoSellCheckbox){
    localStorage.setItem('petdefense_autoSell', autoSellCheckbox.checked);
  }
  
  // Show save indicator briefly
  showSaveIndicator();
}

function showSaveIndicator(){
  const indicator = document.createElement('div');
  indicator.className = 'save-indicator';
  indicator.textContent = '💾 Saved';
  document.body.appendChild(indicator);
  setTimeout(() => indicator.classList.add('show'), 10);
  setTimeout(() => {
    indicator.classList.remove('show');
    setTimeout(() => indicator.remove(), 300);
  }, 1500);
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
// Generate random weight (kg) for pet - affects stats and visual size
function generatePetKg(rarity){
  let baseKg, variance;
  switch(rarity){
    case 'common': baseKg = 10; variance = 5; break;
    case 'rare': baseKg = 20; variance = 10; break;
    case 'epic': baseKg = 40; variance = 20; break;
    case 'legendary': baseKg = 80; variance = 40; break;
    case 'mythic': baseKg = 150; variance = 75; break; // NEW MYTHIC tier!
    default: baseKg = 10; variance = 5;
  }
  
  // Random weight with slight bias toward higher values for rare pets
  const kg = baseKg + (Math.random() * variance * 2) - variance;
  return Math.max(5, Math.round(kg)); // Minimum 5kg
}

// Calculate stat bonus based on kg
function getKgBonus(kg, rarity){
  let multiplier;
  switch(rarity){
    case 'common': multiplier = kg / 10; break;
    case 'rare': multiplier = kg / 20; break;
    case 'epic': multiplier = kg / 40; break;
    case 'legendary': multiplier = kg / 80; break;
    case 'mythic': multiplier = kg / 150; break; // NEW MYTHIC tier!
    default: multiplier = 1;
  }
  return Math.max(0.8, Math.min(1.5, multiplier)); // 80% to 150% stats
}

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
  
  return {
    ...pet,
    uniqueId: Date.now() + '_' + Math.random(),
    kg: kg,
    kgBonus: kgBonus,
    damage: Math.floor(pet.damage * kgBonus),
    range: pet.range * kgBonus,
    attackSpeed: pet.attackSpeed / Math.sqrt(kgBonus) // Better pets attack slightly faster
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
  const autoSoldMessage = autoSold ? `<div style="margin-top:12px;padding:8px;background:rgba(255,215,0,0.2);border:1px solid rgba(255,215,0,0.4);border-radius:6px;">
      <strong>✅ Auto-Sold!</strong><br>
      Duplicate common pet sold for <strong>${sellValue} coins</strong>
    </div>` : '';
  
  gachaResult.innerHTML = `
    <div class="gacha-reveal ${newPet.rarity}">
      <div class="gacha-emoji">${newPet.emoji}</div>
      <h3>${newPet.name}</h3>
      <div class="rarity-badge ${newPet.rarity}">${newPet.rarity.toUpperCase()}</div>
      <p>${newPet.description}</p>
      <div class="stats">
        <div>💪 Damage: ${Math.floor(newPet.damage)}</div>
        <div>📏 Range: ${newPet.range.toFixed(1)}</div>
        <div>⚡ Speed: ${newPet.attackSpeed.toFixed(2)}s</div>
        <div>⚖️ Weight: ${newPet.kg}kg ${kgQuality}</div>
        <div style="font-size:0.85rem;color:#aaa;margin-top:4px">Stats: ${Math.round(newPet.kgBonus * 100)}%</div>
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
  
  state.isWaveActive = true;
  startWaveBtn.disabled = true;
  startWaveBtn.textContent = '⏳ Wave In Progress...';
  
  // Calculate enemies for this wave
  const baseEnemies = 5 + state.wave * 2;
  const waveEnemies = [];
  
  for(let i = 0; i < baseEnemies; i++){
    // Select enemy type based on wave - progressive difficulty
    let enemyType;
    const availableTypes = ENEMY_TYPES.slice(0, Math.min(ENEMY_TYPES.length, 3 + Math.floor(state.wave / 2)));
    
    if(state.wave <= 2){
      enemyType = availableTypes[0]; // Only basic enemies
    } else if(state.wave <= 5){
      enemyType = availableTypes[Math.floor(Math.random() * Math.min(3, availableTypes.length))];
    } else if(state.wave <= 10){
      enemyType = availableTypes[Math.floor(Math.random() * Math.min(5, availableTypes.length))];
    } else if(state.wave <= 15){
      enemyType = availableTypes[Math.floor(Math.random() * Math.min(8, availableTypes.length))];
    } else {
      // High waves can spawn any enemy type
      enemyType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
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
  state.totalEnemiesInWave = baseEnemies; // Track total for progress display
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
    
    // Initialize original speed if not set
    if(!enemy.originalSpeed){
      enemy.originalSpeed = enemy.speed;
    }
    
    // Move along path (unless stunned)
    if(!enemy.stunned){
      enemy.progress += enemy.speed * deltaTime;
    }
    
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
  
  // Track statistics
  if(!state.stats) state.stats = {};
  state.stats.wavesCompleted = (state.stats.wavesCompleted || 0) + 1;
  state.stats.highestWave = Math.max(state.stats.highestWave || 1, state.wave);
  state.stats.totalCoinsEarned = (state.stats.totalCoinsEarned || 0) + coinReward;
  state.stats.totalGemsEarned = (state.stats.totalGemsEarned || 0) + gemReward;
  
  log(`✅ Wave completed! +${coinReward} coins, +${gemReward} gems`);
  
  startWaveBtn.disabled = false;
  startWaveBtn.textContent = '▶️ Start Next Wave';
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
function createProjectile(defender, enemy){
  // Get exact defender position (tower icon center)
  const defenderPos = getCellCenter(defender.row, defender.col);
  
  // Get exact enemy position (enemy icon center)
  const enemyPos = { x: enemy.position.col + 0.5, y: enemy.position.row + 0.5 };
  
  const projectile = {
    id: Date.now() + Math.random(),
    x: defenderPos.x,
    y: defenderPos.y,
    targetEnemy: enemy,
    targetX: enemyPos.x, // Store initial target position for smoother tracking
    targetY: enemyPos.y,
    damage: defender.damage,
    speed: 2.8, // cells per second - REDUCED for slower, more visible projectiles
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
        speed: 2.8, // Match main projectile speed
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
    
    // Smoother hit detection - more generous for slow projectiles
    if(dist < 0.35){
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
  const enemiesContainer = document.getElementById('enemiesContainer');
  if(!enemiesContainer) return;
  
  const impact = document.createElement('div');
  impact.className = 'impact-effect';
  impact.style.left = `${x * (100 / GRID_COLS)}%`;
  impact.style.top = `${y * (100 / GRID_ROWS)}%`;
  impact.innerHTML = '💥';
  enemiesContainer.appendChild(impact);
  
  // Remove after animation
  setTimeout(() => {
    impact.remove();
  }, 500);
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
      cellEl.addEventListener('click', (e) => {
        // Don't place if clicking on a button
        if(e.target.tagName === 'BUTTON') return;
        placeDefender(idx);
      });
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
      const upgradeCost = Math.floor((cell.defender.cost || 50) * 0.5 * (upgradeLevel + 1));
      const sellValue = Math.floor(((cell.defender.cost || 50) + (cell.defender.totalCost || 0)) * 0.7);
      const abilityIcon = cell.defender.ability ? getAbilityIcon(cell.defender.ability) : '';
      
      // Calculate visual size based on kg
      const kgScale = cell.defender.kg ? 1 + (cell.defender.kgBonus - 1) * 0.5 : 1; // Scale emoji size
      const kgInfo = cell.defender.kg ? `<div class="info-line">⚖️ ${cell.defender.kg}kg</div>` : '';
      const rarityColors = {common: '#95a5a6', rare: '#3498db', epic: '#9b59b6', legendary: '#f39c12', mythic: '#ff1493'};
      const rarityColor = rarityColors[cell.defender.rarity] || '#95a5a6';
      
      el.innerHTML = `
        <div class="defender" style="font-size: ${32 * kgScale}px; filter: drop-shadow(0 0 4px ${rarityColor})">${cell.defender.emoji}</div>
        ${levelBadge}
        <div class="defender-info">
          <div class="info-line" style="color:${rarityColor}">${cell.defender.rarity.toUpperCase()}</div>
          <div class="info-line">💪 ${Math.floor(cell.defender.damage)}</div>
          <div class="info-line">📏 ${cell.defender.range.toFixed(1)}</div>
          <div class="info-line">⚡ ${cell.defender.attackSpeed.toFixed(2)}s</div>
          ${kgInfo}
          ${abilityIcon ? `<div class="info-line">${abilityIcon} ${getAbilityName(cell.defender.ability)}</div>` : ''}
        </div>
        <div class="defender-controls">
          <button class="control-btn upgrade-btn" onclick="upgradeDefender(${idx})" title="Upgrade (+20% stats for ${upgradeCost} coins)">⬆️</button>
          <button class="control-btn move-btn" onclick="moveDefender(${idx})" title="Move to another location">🔄</button>
          <button class="control-btn sell-btn" onclick="sellDefender(${idx})" title="⚠️ SELL for ${sellValue} coins (GONE FOREVER!)">💰</button>
        </div>
      `;
    } else {
      el.innerHTML = '';
      if (!cell.isPath) {
        el.classList.add('placeable');
        // Show preview when pet is selected
        if(state.selectedDefender){
          el.classList.add('ready-to-place');
          // Show preview emoji with reduced opacity
          el.innerHTML = `<div class="pet-preview">${state.selectedDefender.emoji}</div>`;
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
    
    // Add status effect indicators
    let statusEffects = '';
    if(enemy.poisonStacks > 0) statusEffects += '☠️';
    if(enemy.burnTimer) statusEffects += '🔥';
    if(enemy.slowDuration > 0) statusEffects += '❄️';
    if(enemy.stunned) statusEffects += '⭐';
    
    enemyEl.innerHTML = `
      <div class="enemy-emoji">${enemy.emoji}</div>
      ${statusEffects ? `<div class="status-effects">${statusEffects}</div>` : ''}
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
    
    // Use different projectile emojis based on ability or damage
    let projectileEmoji;
    if(proj.ability === 'poison') projectileEmoji = '☠️';
    else if(proj.ability === 'splash') projectileEmoji = '💥';
    else if(proj.ability === 'slow') projectileEmoji = '❄️';
    else if(proj.ability === 'stun') projectileEmoji = '⭐';
    else if(proj.ability === 'lifesteal') projectileEmoji = '💚';
    else if(proj.ability === 'burn') projectileEmoji = '🔥';
    else if(proj.ability === 'multishot') projectileEmoji = '🎯';
    else projectileEmoji = proj.damage >= 70 ? '🔥' : proj.damage >= 40 ? '⚡' : proj.damage >= 25 ? '✨' : '💫';
    
    projEl.innerHTML = projectileEmoji;
    enemiesContainer.appendChild(projEl);
  });
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
  
  // Update inventory section header to show count
  const inventoryHeader = document.querySelector('#inventorySection h3');
  if(inventoryHeader){
    inventoryHeader.textContent = `Your Pets (${state.ownedPets.length})`;
  }
  
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
    const abilityIcon = pet.ability ? getAbilityIcon(pet.ability) : '';
    const kgScale = pet.kg ? 1 + (pet.kgBonus - 1) * 0.5 : 1;
    const kgDisplay = pet.kg ? ` ⚖️${pet.kg}kg` : '';
    div.innerHTML = `
      <div class="inv-emoji" style="font-size: ${32 * kgScale}px">${pet.emoji}</div>
      <div class="inv-name">${pet.name}</div>
      <div class="inv-stats">💪${Math.floor(pet.damage)} 📏${pet.range.toFixed(1)}${abilityIcon ? ' ' + abilityIcon : ''}${kgDisplay}</div>
    `;
    const abilityText = pet.ability ? `\nAbility: ${getAbilityName(pet.ability)}` : '';
    const kgText = pet.kg ? `\nWeight: ${pet.kg}kg (${Math.round(pet.kgBonus * 100)}% stats)` : '';
    div.title = `${pet.description}\nDamage: ${Math.floor(pet.damage)}, Range: ${pet.range.toFixed(1)}, Speed: ${pet.attackSpeed.toFixed(2)}s${kgText}${abilityText}\nClick to select for deployment`;
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
  
  // Show wave number with enemy count and progress during active wave
  if(state.isWaveActive && state.enemies.length > 0){
    const totalEnemiesInWave = state.totalEnemiesInWave || state.enemies.length;
    const remaining = state.enemies.length;
    const defeated = totalEnemiesInWave - remaining;
    waveNumberEl.textContent = `${state.wave} 🎯 ${defeated}/${totalEnemiesInWave}`;
  } else {
    waveNumberEl.textContent = `${state.wave}`;
  }
  
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
  
  // Return to inventory for redeployment
  const basePet = PET_DEFENDERS.find(p => p.id === defender.id);
  const movingPet = {
    ...basePet,
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

// Display statistics modal
function showStats(){
  const statsModal = document.getElementById('statsModal');
  const statsDisplay = document.getElementById('statsDisplay');
  
  if(!state.stats) state.stats = {};
  
  statsDisplay.innerHTML = `
    <div style="text-align:left;line-height:1.8">
      <div>🏆 Highest Wave: <strong>${state.stats.highestWave || state.wave}</strong></div>
      <div>✅ Waves Completed: <strong>${state.stats.wavesCompleted || 0}</strong></div>
      <div>💀 Enemies Defeated: <strong>${state.stats.totalEnemiesDefeated || 0}</strong></div>
      <div>💥 Total Damage Dealt: <strong>${Math.floor(state.stats.totalDamageDealt || 0)}</strong></div>
      <div>💰 Total Coins Earned: <strong>${state.stats.totalCoinsEarned || 0}</strong></div>
      <div>💎 Total Gems Earned: <strong>${state.stats.totalGemsEarned || 0}</strong></div>
      <div>🎲 Gacha Rolls: <strong>${state.stats.gachaRolls || 0}</strong></div>
      <div>🐾 Pets Owned: <strong>${state.ownedPets.length}</strong></div>
      <div>🛡️ Defenders Placed: <strong>${state.defenders.length}</strong></div>
    </div>
  `;
  
  statsModal.classList.remove('hidden');
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
  
  log(`💰 Sold all ${petCount} pet${petCount > 1 ? 's' : ''} for ${totalValue} coins!`);
  save();
  updateUI();
  updateShopAndInventory();
}

/* --- Event Handlers --- */
startWaveBtn.addEventListener('click', () => spawnWave());
gachaBtn.addEventListener('click', () => openGacha());
closeGachaBtn.addEventListener('click', () => gachaModal.classList.add('hidden'));

// Sell All button
const sellAllBtn = document.getElementById('sellAllBtn');
if(sellAllBtn) sellAllBtn.addEventListener('click', () => sellAllPets());

const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStatsBtn');
if(statsBtn) statsBtn.addEventListener('click', () => showStats());
if(closeStatsBtn) closeStatsBtn.addEventListener('click', () => statsModal.classList.add('hidden'));

// Map selector
const mapSelector = document.getElementById('mapSelector');
mapSelector.addEventListener('change', (e) => {
  if(state.isWaveActive){
    alert('Cannot change map during active wave!');
    mapSelector.value = state.selectedMap;
    return;
  }
  
  if(state.defenders.length > 0){
    const confirm = window.confirm('Changing map will remove all placed defenders. Continue?');
    if(!confirm){
      mapSelector.value = state.selectedMap;
      return;
    }
    // Clear defenders
    state.defenders = [];
    state.cells.forEach(cell => cell.defender = null);
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
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
  // Escape to close modals
  if(e.key === 'Escape'){
    if(!gachaModal.classList.contains('hidden')){
      gachaModal.classList.add('hidden');
    } else if(!statsModal.classList.contains('hidden')){
      statsModal.classList.add('hidden');
    }
  }
});

// Make tower management functions globally accessible
window.upgradeDefender = upgradeDefender;
window.sellDefender = sellDefender;
window.moveDefender = moveDefender;

/* --- Game Loop --- */
let last = Date.now();
function gameLoop(){
  const now = Date.now();
  const deltaMs = now - last;
  const deltaSec = (deltaMs / 1000) * state.gameSpeed; // Apply game speed multiplier
  
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
  
  // create the persistent DOM grid once
  createBattleGrid();
  
  // Initialize starter pets
  initStarterPets();
  
  updateUI();
  updateShopAndInventory();
  last = Date.now();
  gameLoop();
  log('🛡️ Welcome to Pet Defense! Deploy pets and defend against waves!');
}

init();