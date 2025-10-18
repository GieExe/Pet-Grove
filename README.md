# Pet Defense Tower — Tower Defense with Pets & Gacha

A tower defense game featuring adorable pets as defenders! Deploy pet defenders on a strategic grid, defend against waves of enemies, and collect new pets through an exciting gacha system. Built with plain HTML, CSS and JavaScript with `localStorage` persistence.

## Features
- 🛡️ **Tower Defense Gameplay** - Deploy pets strategically to defend against enemy waves
- 🐾 **Multiple Pet Defenders** - 65+ unique pets with different stats, rarities, and abilities
- ✨ **Special Abilities** - Poison, Splash, Slow, Stun, Lifesteal, Burn, and Multi-Shot abilities
- 💰 **Dual Currency System** - Earn coins from battles and gems from wave completion
- 🎲 **Gacha System** - Pull for new pets with rarity tiers (Common, Rare, Epic, Legendary)
- 🌊 **Wave-Based Combat** - Face increasingly difficult waves with varied enemy types
- ⚔️ **Real-Time Combat** - Watch your pets automatically attack enemies in range with smooth projectile effects
- 📊 **Strategic Depth** - Balance pet placement, range, damage, attack speed, and abilities
- 💎 **Rarity System** - Collect pets from common to legendary with different power levels
- 💾 **Auto-Save** - Progress automatically saves to `localStorage`
- 🎨 **Dark Theme UI** - Modern, polished design with smooth animations
- 🐛 **Stable Hover Effects** - Smooth, non-flickering hover animations on all interactive elements
- 💥 **Smooth Projectiles** - Glowing projectiles that smoothly track enemies with impact animations
- ⚠️ **Permanent Sale** - Sold pets are gone forever (with confirmation dialog)
- 🗺️ **Clear Path Indicators** - Visual arrows show enemy path direction

## How to Play
1. Open `index.html` in a modern browser
2. **Select a Pet** - Click on a pet in "Your Pets" inventory to select it
3. **Deploy Defenders** - Click on empty (dark blue) grid cells to place your pet
4. **Start Wave** - Click "▶️ Start Wave" or press Space/Enter to begin the enemy assault
5. **Defend** - Your pets will automatically attack enemies in range
6. **Manage Towers** - Hover over defenders to see stats and access controls:
   - ⬆️ **Upgrade** - Improve stats for 50% of base cost per level
   - 🔄 **Move** - Relocate defender (keeps upgrade progress)
   - 💰 **Sell** - Remove defender for 70% refund
7. **Earn Rewards** - Complete waves to earn coins and gems
8. **Use Gacha** - Spend 40 gems to pull for new pets with random rarities (Press G)
9. **Survive** - Don't let enemies reach the end or you'll lose lives!

## How to Run

### Option 1: Development Server (Recommended)
1. Clone the repository
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open browser to `http://localhost:5173`
5. Build for production: `npm run build`

**Note**: The development server is required for the Supabase authentication features to work properly. Opening `index.html` directly in a browser will result in module import errors.

### Option 2: Production Build
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Serve the `dist` folder using any web server

## Authentication & Data Persistence

The game now features a complete authentication system powered by Supabase:

### Features
- 👤 **User Registration** - Create an account with username and password
- 🔐 **Secure Login** - Password hashing using SHA-256 (client-side)
- 👤 **Guest Mode** - Play without an account (uses localStorage)
- 💾 **Cloud Save** - Registered users' progress is saved to Supabase
- 🔄 **Cross-Device Sync** - Access your account from any device

### Setup Database

To enable authentication features:

1. Create a free Supabase account at https://supabase.com
2. Create a new project
3. Run the SQL schema from `DATABASE_SCHEMA.md` in your Supabase SQL Editor
4. Copy your project's URL and anon key
5. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `script.js`

See `DATABASE_SCHEMA.md` for detailed database setup instructions.

### Security Notes

- Passwords are hashed using SHA-256 before being sent to the database
- For production use, consider using Supabase Auth or implementing bcrypt server-side
- Never commit your Supabase API keys to version control
- The current implementation is suitable for learning/development purposes

### Playing the Game

**With Account:**
1. Register a new account or login with existing credentials
2. Your progress (coins, gems, pets, wave) is saved to the cloud
3. Access your progress from any device

**As Guest:**
1. Click "Continue as Guest"
2. Progress is saved locally using localStorage
3. Data is device-specific

## Game Mechanics

### Starting Resources
- **Coins**: 150
- **Gems**: 100
- **Lives**: 20
- **Starter Pets**: 2 (Guard Dog & Ninja Cat)

### Pet Defenders
| Pet | Rarity | Damage | Range | Attack Speed | Description |
|-----|--------|--------|-------|--------------|-------------|
| 🐶 Guard Dog | Common | 20 | 1.5 | 0.8s | Basic melee defender |
| 🐱 Ninja Cat | Common | 25 | 2.0 | 0.6s | Fast attacker |
| 🐰 Swift Bunny | Common | 18 | 1.8 | 0.5s | Very fast attacker |
| 🐢 Tank Turtle | Common | 30 | 1.2 | 1.5s | Slow but tough |
| 🦊 Clever Fox | Common | 22 | 2.2 | 0.7s | Cunning and quick |
| 🦝 Sneaky Raccoon | Common | 20 | 1.7 | 0.7s | Stealthy attacker |
| 🐧 Ice Penguin | Common | 24 | 2.1 | 0.9s | Cool defender |
| 🐨 Koala Warrior | Common | 28 | 1.4 | 1.3s | Sleepy but strong |
| 🐼 Kung Fu Panda | Rare | 40 | 1.5 | 1.2s | Strong melee fighter |
| 🦉 Wise Owl | Rare | 28 | 3.5 | 1.0s | Long range sniper |
| 🐻 Grizzly Bear | Rare | 50 | 1.8 | 1.4s | Powerful close range |
| 🐺 Alpha Wolf | Rare | 38 | 2.2 | 0.9s | Balanced fighter |
| 🐵 Warrior Monkey | Rare | 35 | 1.6 | 0.8s | Agile fighter |
| 🦅 War Eagle | Rare | 32 | 3.8 | 1.1s | Sky dominator |
| 🦍 Gorilla Guard | Rare | 48 | 1.3 | 1.6s | Powerful tank |
| 🦏 Rhino Charger | Rare | 52 | 1.5 | 1.7s | Heavy hitter |
| 🐆 Speed Leopard | Rare | 42 | 2.5 | 0.7s | Lightning fast |
| 🐲 Fire Dragon | Epic | 70 | 3.0 | 1.5s | Powerful ranged attacker |
| 🐯 Bengal Tiger | Epic | 65 | 2.0 | 1.0s | Fierce predator |
| 🦅 Phoenix | Epic | 60 | 3.5 | 1.2s | Aerial superiority |
| 🦈 Land Shark | Epic | 68 | 1.8 | 1.1s | Devastating attacker |
| 🐉 Hydra | Epic | 72 | 2.8 | 1.3s | Multi-headed beast |
| 🦅 Griffin | Epic | 68 | 3.2 | 1.0s | Mythical guardian |
| 🐺 Cerberus | Epic | 75 | 1.9 | 1.1s | Three-headed guardian |
| 🦁 Lion King | Legendary | 90 | 2.0 | 0.8s | Ultimate damage dealer |
| 🦄 Unicorn | Legendary | 80 | 2.8 | 0.7s | Magical powerhouse |
| 🦖 T-Rex | Legendary | 100 | 1.6 | 1.2s | Prehistoric destroyer |
| 🐙 Kraken | Legendary | 85 | 3.0 | 0.9s | Tentacled terror |
| 🐍 Viper | Common | 26 | 2.3 | 0.8s | Poisonous striker (☠️ Poison) |
| 🐘 War Elephant | Rare | 55 | 1.4 | 1.8s | Slow but devastating (💥 Splash) |
| 🦇 Shadow Bat | Common | 30 | 2.6 | 0.6s | Swift night hunter (💚 Lifesteal) |
| 🐸 Poison Frog | Common | 22 | 2.4 | 0.9s | Toxic defender (☠️ Poison) |
| 🐊 Croc Hunter | Rare | 58 | 1.6 | 1.5s | Crushing jaws (⭐ Stun) |
| 🐴 Swift Horse | Common | 33 | 2.0 | 0.5s | Lightning fast (🎯 Multi-Shot) |
| 🦂 Scorpion King | Rare | 44 | 2.1 | 1.0s | Venomous stinger (☠️ Poison) |
| 🕷️ Giant Spider | Common | 35 | 2.5 | 1.1s | Web master (❄️ Slow) |
| 🐙 Deep Octopus | Rare | 48 | 2.8 | 1.0s | Tentacle attacker (💥 Splash) |
| 🐋 Sky Whale | Epic | 78 | 3.2 | 1.4s | Massive aerial beast (💥 Splash) |
| 🐝 Queen Bee | Common | 28 | 2.2 | 0.7s | Swarm commander (🎯 Multi-Shot) |
| 🦋 Mystic Butterfly | Rare | 32 | 3.0 | 0.9s | Magical wings (💚 Lifesteal) |
| 🦀 Armored Crab | Common | 38 | 1.3 | 1.4s | Hard shell defender (⭐ Stun) |
| 🦩 Flame Flamingo | Epic | 70 | 3.3 | 1.2s | Elegant fire bird (🔥 Burn) |
| 🦥 Battle Sloth | Common | 45 | 1.5 | 2.0s | Slow but mighty (⭐ Stun) |
| 🦜 Sky Parrot | Common | 26 | 2.8 | 0.8s | Colorful flyer |
| 🐹 Battle Hamster | Common | 19 | 1.6 | 0.6s | Tiny but fierce |
| 🦔 Spike Guard | Common | 28 | 1.4 | 1.2s | Spiky defender (⭐ Stun) |
| 🦦 River Otter | Common | 30 | 2.0 | 0.7s | Playful fighter (🎯 Multi-Shot) |
| 🦡 Honey Badger | Rare | 46 | 1.5 | 1.1s | Fearless warrior |
| 🐈 Wild Lynx | Rare | 44 | 2.4 | 0.8s | Stealthy predator (☠️ Poison) |
| 🦅 Dive Falcon | Rare | 38 | 3.6 | 0.9s | Swift striker (🎯 Multi-Shot) |
| 🐗 War Boar | Rare | 54 | 1.3 | 1.5s | Charging beast (⭐ Stun) |
| 🦎 Fire Salamander | Epic | 74 | 2.7 | 1.2s | Flame thrower (🔥 Burn) |
| 🗿 Stone Gargoyle | Epic | 76 | 2.0 | 1.6s | Ancient guardian (💥 Splash) |
| 🦁 Manticore | Legendary | 100 | 2.8 | 0.85s | Mythical beast (☠️ Poison) |
| ⚡ Thunder Bird | Legendary | 96 | 3.5 | 0.95s | Storm bringer (⭐ Stun) |

### Special Abilities
- **☠️ Poison** - Applies stacking damage over time (up to 3 stacks)
- **💥 Splash Damage** - Deals 40% damage to nearby enemies
- **❄️ Slow** - Reduces enemy speed by 50% for 3 seconds
- **⭐ Stun** - 20% chance to stop enemy for 1.5 seconds
- **💚 Lifesteal** - Gain bonus coins equal to 15% of damage dealt
- **🔥 Burn** - Deals 15% damage per tick for 5 ticks over 4 seconds
- **🎯 Multi-Shot** - Attacks up to 2 additional targets at 50% damage

### Enemy Types
- **👾 Slime** - Basic enemy (50 HP, 1.0 speed)
- **👹 Goblin** - Faster enemy (80 HP, 1.2 speed)
- **👿 Imp** - Quick enemy (60 HP, 1.5 speed)
- **👺 Orc** - Tanky enemy (150 HP, 0.8 speed)
- **👻 Ghost** - Medium enemy (100 HP, 1.3 speed)
- **😈 Demon** - Boss enemy (300 HP, 1.5 speed)
- **💀 Skeleton** - Balanced enemy (120 HP, 1.1 speed)
- **👽 Alien** - Elite enemy (200 HP, 1.0 speed)

### Gacha Rates (Rebalanced)
- **Common**: 65% chance
- **Rare**: 22% chance
- **Epic**: 10% chance
- **Legendary**: 3% chance
- **Cost**: 40 gems per pull

*Rates adjusted to make epic and legendary pets more valuable and rewarding*

### Wave Rewards
- Coins increase with each wave completed
- Gems awarded every few waves
- Enemy difficulty scales with wave number

## Strategy Tips
- Place defenders near corners where enemies turn
- Mix short-range high damage with long-range snipers
- Save gems for multiple gacha pulls to get rarer pets
- Higher rarity pets have significantly better stats
- Balance your currency spending between deployment and gacha

## New Features (Latest Update)

### Animation Improvements
- 💫 **Enhanced Projectile Animations** - Smooth glowing projectiles with particle trail effects and rotation
- ⚡ **Improved Attack Animations** - Bounce effects with dynamic glow and brightness changes
- 💥 **Better Impact Effects** - Explosive burst animations with rotation and expanding glow
- 🚀 **Faster Projectile Speed** - Increased from 3 to 4.5 cells/sec for smoother gameplay

### NPM & Build System
- 📦 **NPM Integration** - Professional package.json with Vite build system
- 🔧 **Phaser Ready** - Phaser 3.80.1 installed and ready for future advanced animations
- ⚙️ **Development Server** - Run `npm run dev` for hot-reload development
- 🏗️ **Production Builds** - Use `npm run build` to create optimized builds

### Pet & Balance Updates
- 🐾 **12 New Pets** - Added Parrot, Hamster, Hedgehog, Otter, Badger, Lynx, Falcon, Boar, Salamander, Gargoyle, Manticore, and Thunder Bird
- 📊 **65+ Total Pets** - Massive variety with balanced distribution across rarities
- ⚖️ **Rebalanced Gacha Rates** - Epic (12%→10%) and Rare (25%→22%) adjusted for better value
- 🎯 **Wave Progress Indicator** - Live tracking shows "Wave X 🎯 defeated/total"

### Previous Features
- ✨ **Special Abilities System** - 7 unique abilities (Poison, Splash, Slow, Stun, Lifesteal, Burn, Multi-Shot)
- 🗺️ **Enhanced Path Visualization** - Arrows on path tiles show enemy direction
- 📊 **Ability Display** - See pet abilities in inventory and on deployed defenders
- ⬆️ **Tower Upgrade System** - Upgrade defenders for better stats (+20% per level)
- 💰 **Permanent Sale System** - Sold pets are gone forever (with confirmation dialog)
- 🔄 **Move Towers** - Relocate defenders without losing upgrade progress
- ⌨️ **Keyboard Shortcuts** - Space/Enter for waves, G for gacha, Esc to close

## Future Ideas
- Multiple paths/maps
- Special abilities for legendary pets
- Boss waves
- Achievement system
- More enemy variety
- Sound effects and music
- Pet fusion/evolution
- Tower targeting modes (first, last, strongest)

## License
- MIT