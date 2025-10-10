# Pet Grove Garden — 2D Pet Growing Game

A garden-style pet growing game inspired by "Grow a garden" from Roblox, but with pets in 2D! Plant pet eggs in your garden plots, watch them grow through different stages, and harvest them for coins. It's built with plain HTML, CSS and JavaScript and stores progress in `localStorage`, so no backend is required.

## Features
- 🌱 **Garden Grid System** - 3x4 grid of planting plots for growing multiple pets simultaneously
- 🐾 **Multiple Pet Types** - Choose from Puppy, Kitten, Cub, and Drake with different costs and values
- 💰 **Currency System** - Earn coins by harvesting grown pets, spend coins to plant new pets
- 📈 **Growth Stages** - Pets evolve through 4 stages: Baby → Young → Adult → Elder
- ⏱️ **Time-Based Growth** - Pets automatically grow over time with visual progress bars
- 🎯 **Strategic Gameplay** - Manage your garden and coins to maximize earnings
- 💾 **Auto-Save** - Progress automatically saves to `localStorage`
- 🎨 **Clean 2D Design** - Beautiful garden aesthetic with emoji pets

## How to Play
1. Open `index.html` in a modern browser
2. Select a pet from the shop (costs coins)
3. Click an empty plot to plant your pet
4. Watch your pets grow through different stages
5. Click fully grown pets (Elder stage at 100%) to harvest for coins
6. Use earned coins to plant more pets!

## How to Run
1. Clone or copy files into a folder
2. Open `index.html` in a modern browser
3. Play! Progress is saved automatically

## Game Mechanics
- **Starting Coins**: 50 coins
- **Pet Costs**: Puppy (10), Kitten (15), Cub (25), Drake (50)
- **Harvest Values**: Puppy (15), Kitten (25), Cub (40), Drake (80)
- **Growth Rate**: 0.5 growth points per second per stage
- **Stages**: 4 stages, each requiring 100 growth points to advance

## Ideas for Next Steps
- Add crop mutations like in the original Roblox game
- Add water/fertilizer resources for boosted growth
- Add pet trading or achievements
- Replace emoji sprites with custom artwork
- Add sound effects and animations
- Add special events or rare pets
- Backend for leaderboards and multiplayer trading

## License
- MIT