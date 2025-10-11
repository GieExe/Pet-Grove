# Pet Defense Tower — Tower Defense with Pets & Gacha

A tower defense game featuring adorable pets as defenders! Deploy pet defenders on a strategic grid, defend against waves of enemies, and collect new pets through an exciting gacha system. Built with plain HTML, CSS and JavaScript with `localStorage` persistence.

## Features
- 🛡️ **Tower Defense Gameplay** - Deploy pets strategically to defend against enemy waves
- 🐾 **Multiple Pet Defenders** - 14 unique pets with different stats, rarities, and abilities
- 💰 **Dual Currency System** - Earn coins from battles and gems from wave completion
- 🎲 **Gacha System** - Pull for new pets with rarity tiers (Common, Rare, Epic, Legendary)
- 🌊 **Wave-Based Combat** - Face increasingly difficult waves with varied enemy types
- ⚔️ **Real-Time Combat** - Watch your pets automatically attack enemies in range
- 📊 **Strategic Depth** - Balance pet placement, range, damage, and attack speed
- 💎 **Rarity System** - Collect pets from common to legendary with different power levels
- 💾 **Auto-Save** - Progress automatically saves to `localStorage`
- 🎨 **Dark Theme UI** - Modern, polished design with smooth animations
- 🐛 **Stable Hover Effects** - Smooth, non-flickering hover animations on all interactive elements

## How to Play
1. Open `index.html` in a modern browser
2. **Select a Pet** - Click on a pet in "Your Pets" inventory to select it
3. **Deploy Defenders** - Click on empty (dark blue) grid cells to place your pet
4. **Start Wave** - Click "▶️ Start Wave" to begin the enemy assault
5. **Defend** - Your pets will automatically attack enemies in range
6. **Earn Rewards** - Complete waves to earn coins and gems
7. **Use Gacha** - Spend 50 gems to pull for new pets with random rarities
8. **Survive** - Don't let enemies reach the end or you'll lose lives!

## How to Run
1. Clone or download the repository
2. Open `index.html` in a modern browser
3. Play! Progress is saved automatically

## Game Mechanics

### Starting Resources
- **Coins**: 100
- **Gems**: 50
- **Lives**: 20
- **Starter Pets**: 2 (Guard Dog & Ninja Cat)

### Pet Defenders
| Pet | Rarity | Damage | Range | Attack Speed | Description |
|-----|--------|--------|-------|--------------|-------------|
| 🐶 Guard Dog | Common | 10 | 1.5 | 1.0s | Basic melee defender |
| 🐱 Ninja Cat | Common | 15 | 2.0 | 0.8s | Fast attacker |
| 🐰 Swift Bunny | Common | 8 | 1.8 | 0.6s | Very fast attacker |
| 🐢 Tank Turtle | Common | 18 | 1.2 | 2.0s | Slow but tough |
| 🐼 Kung Fu Panda | Rare | 25 | 1.5 | 1.5s | Strong melee fighter |
| 🦉 Wise Owl | Rare | 12 | 3.5 | 1.5s | Long range sniper |
| 🐻 Grizzly Bear | Rare | 30 | 1.8 | 1.8s | Powerful close range |
| 🐺 Alpha Wolf | Rare | 22 | 2.2 | 1.2s | Balanced fighter |
| 🐲 Fire Dragon | Epic | 40 | 3.0 | 2.0s | Powerful ranged attacker |
| 🐯 Bengal Tiger | Epic | 38 | 2.0 | 1.4s | Fierce predator |
| 🦅 Phoenix | Epic | 35 | 3.5 | 1.6s | Aerial superiority |
| 🦁 Lion King | Legendary | 50 | 2.0 | 1.2s | Ultimate damage dealer |
| 🦄 Unicorn | Legendary | 45 | 2.8 | 1.0s | Magical powerhouse |
| 🦖 T-Rex | Legendary | 55 | 1.6 | 1.8s | Prehistoric destroyer |

### Enemy Types
- **👾 Slime** - Basic enemy (50 HP, 1.0 speed)
- **👹 Goblin** - Faster enemy (80 HP, 1.2 speed)
- **👿 Imp** - Quick enemy (60 HP, 1.5 speed)
- **👺 Orc** - Tanky enemy (150 HP, 0.8 speed)
- **👻 Ghost** - Medium enemy (100 HP, 1.3 speed)
- **😈 Demon** - Boss enemy (300 HP, 1.5 speed)
- **💀 Skeleton** - Balanced enemy (120 HP, 1.1 speed)
- **👽 Alien** - Elite enemy (200 HP, 1.0 speed)

### Gacha Rates
- **Common**: 60% chance
- **Rare**: 25% chance
- **Epic**: 12% chance
- **Legendary**: 3% chance
- **Cost**: 50 gems per pull

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

## Future Ideas
- Pet upgrade system
- Multiple paths/maps
- Special abilities for legendary pets
- Boss waves
- Achievement system
- More enemy variety
- Sound effects and music
- Pet fusion/evolution

## License
- MIT