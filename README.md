# Pet Defense Tower — Tower Defense with Pets & Gacha

A tower defense game featuring adorable pets as defenders! Deploy pet defenders on a strategic grid, defend against waves of enemies, and collect new pets through an exciting gacha system. Built with plain HTML, CSS and JavaScript with `localStorage` persistence.

## Features
- 🛡️ **Tower Defense Gameplay** - Deploy pets strategically to defend against enemy waves
- 🐾 **Multiple Pet Defenders** - 6 unique pets with different stats, rarities, and abilities
- 💰 **Dual Currency System** - Earn coins from battles and gems from wave completion
- 🎲 **Gacha System** - Pull for new pets with rarity tiers (Common, Rare, Epic, Legendary)
- 🌊 **Wave-Based Combat** - Face increasingly difficult waves with varied enemy types
- ⚔️ **Real-Time Combat** - Watch your pets automatically attack enemies in range
- 📊 **Strategic Depth** - Balance pet placement, range, damage, and attack speed
- 💎 **Rarity System** - Collect pets from common to legendary with different power levels
- 💾 **Auto-Save** - Progress automatically saves to `localStorage`
- 🎨 **Dark Theme UI** - Modern, polished design with smooth animations

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
| 🐼 Kung Fu Panda | Rare | 25 | 1.5 | 1.5s | Strong melee fighter |
| 🐲 Fire Dragon | Epic | 40 | 3.0 | 2.0s | Powerful ranged attacker |
| 🦁 Lion King | Legendary | 50 | 2.0 | 1.2s | Ultimate damage dealer |
| 🦉 Wise Owl | Rare | 12 | 3.5 | 1.5s | Long range sniper |

### Enemy Types
- **👾 Slime** - Basic enemy (50 HP, 1.0 speed)
- **👹 Goblin** - Faster enemy (80 HP, 1.2 speed)
- **👺 Orc** - Tanky enemy (150 HP, 0.8 speed)
- **😈 Demon** - Boss enemy (300 HP, 1.5 speed)

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