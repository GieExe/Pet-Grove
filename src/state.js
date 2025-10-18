// Shared game state and constants
export const TICK_INTERVAL = 100;
export const GRID_ROWS = 7;
export const GRID_COLS = 10;
export const STARTING_COINS = 150;
export const STARTING_GEMS = 100;
export const STARTING_LIVES = 20;
export const GACHA_COST = 40;

export const PET_DEFENDERS = [
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
  { id: 'celestialdragon', emoji: '🌟', name: 'Celestial Dragon', cost: 800, damage: 150, range: 4.0, attackSpeed: 0.7, rarity:'mythic', description:'Divine sky ruler', ability:'splash' },
  { id: 'worldtree', emoji: '🌳', name: 'World Tree', cost: 850, damage: 130, range: 3.8, attackSpeed: 1.0, rarity:'mythic', description:'Ancient life giver', ability:'lifesteal' },
  { id: 'leviathan', emoji: '🐋', name: 'Leviathan', cost: 900, damage: 160, range: 3.2, attackSpeed: 0.9, rarity:'mythic', description:'Ocean titan', ability:'splash' },
  { id: 'archphoenix', emoji: '🔥', name: 'Arch Phoenix', cost: 880, damage: 145, range: 4.2, attackSpeed: 0.6, rarity:'mythic', description:'Eternal flame', ability:'burn' },
  { id: 'voidbeast', emoji: '🌑', name: 'Void Beast', cost: 950, damage: 170, range: 3.5, attackSpeed: 0.8, rarity:'mythic', description:'Darkness incarnate', ability:'multishot' }
];

export const ENEMY_TYPES = [
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
  { id: 'golem', emoji: '🗿', name: 'Stone Golem', hp: 350, speed: 0.5, reward: 90, gems: 8 },
  { id: 'pixie', emoji: '🧚', name: 'Dark Pixie', hp: 55, speed: 1.8, reward: 25, gems: 2 },
  { id: 'genie', emoji: '🧞', name: 'Evil Genie', hp: 160, speed: 1.3, reward: 52, gems: 4 },
  { id: 'ogre', emoji: '👹', name: 'Ogre Brute', hp: 220, speed: 0.7, reward: 65, gems: 5 },
  { id: 'banshee', emoji: '👻', name: 'Banshee', hp: 130, speed: 1.4, reward: 42, gems: 3 },
  { id: 'cyclops', emoji: '👁️', name: 'Cyclops', hp: 280, speed: 0.8, reward: 75, gems: 6 },
  { id: 'chimera', emoji: '🐉', name: 'Chimera', hp: 320, speed: 1.1, reward: 85, gems: 7 },
  { id: 'hydra', emoji: '🐍', name: 'Hydra', hp: 400, speed: 0.9, reward: 100, gems: 9 },
  { id: 'phoenix', emoji: '🔥', name: 'Dark Phoenix', hp: 270, speed: 1.5, reward: 78, gems: 6 },
  { id: 'basilisk', emoji: '🦎', name: 'Basilisk', hp: 190, speed: 1.2, reward: 58, gems: 5 },
  { id: 'gargoyle', emoji: '🦇', name: 'Gargoyle', hp: 175, speed: 1.3, reward: 54, gems: 4 },
  { id: 'minotaur', emoji: '🐂', name: 'Minotaur', hp: 260, speed: 0.9, reward: 72, gems: 6 },
  { id: 'kraken', emoji: '🦑', name: 'Kraken', hp: 380, speed: 0.7, reward: 95, gems: 8 },
  { id: 'necromancer', emoji: '🧙‍♂️', name: 'Necromancer', hp: 200, speed: 1.0, reward: 62, gems: 5 },
  { id: 'lich', emoji: '💀', name: 'Lich King', hp: 450, speed: 0.8, reward: 110, gems: 10 }
];

export const GACHA_RATES = {
  common: 0.62,
  rare: 0.23,
  epic: 0.11,
  legendary: 0.035,
  mythic: 0.005
};

export let state = {
  coins: STARTING_COINS,
  gems: STARTING_GEMS,
  lives: STARTING_LIVES,
  wave: 1,
  isWaveActive: false,
  isPaused: false,
  cells: [],
  defenders: [],
  enemies: [],
  projectiles: [],
  ownedPets: [],
  selectedDefender: null,
  enemyIdCounter: 0,
  lastTick: Date.now(),
  selectedMap: 'classic',
  gameSpeed: 1,
  stats: {}
};

// expose grid sizes in state for convenience
state.GRID_COLS = GRID_COLS;
state.GRID_ROWS = GRID_ROWS;

export const MAPS = {
  classic: [ { row:3, col:0 }, { row:3, col:1 }, { row:3, col:2 }, { row:3, col:3 }, { row:3, col:4 }, { row:3, col:5 }, { row:3, col:6 }, { row:3, col:7 }, { row:3, col:8 }, { row:3, col:9 } ]
};

export let PATH = MAPS.classic;
