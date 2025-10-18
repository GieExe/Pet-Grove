import { state } from '../state.js';
import * as UI from '../ui.js';
import { addPetToInventory } from '../persistence.js';

export function upgradeDefender(cellIdx){
  const cell = state.cells[cellIdx];
  if(!cell || !cell.defender) return;
  const defender = cell.defender;
  const upgradeLevel = defender.upgradeLevel || 0;
  const upgradeCost = Math.floor((defender.cost || 50) * 0.5 * (upgradeLevel + 1));
  if(state.coins < upgradeCost){ UI.log && UI.log(`⚠️ Not enough coins! Need ${upgradeCost} coins to upgrade.`); return; }
  state.coins -= upgradeCost;
  defender.upgradeLevel = upgradeLevel + 1;
  defender.totalCost = (defender.totalCost || 0) + upgradeCost;
  defender.damage = Math.floor(defender.damage * 1.2);
  defender.range = defender.range * 1.1;
  defender.attackSpeed = defender.attackSpeed * 0.95;
  UI.log && UI.log(`⬆️ Upgraded ${defender.name} to Level ${defender.upgradeLevel}! (+20% stats)`);
  if(window && window.GameAPI && typeof window.GameAPI.save === 'function') window.GameAPI.save();
  UI.updateUI();
}

export function sellDefender(cellIdx){
  const cell = state.cells[cellIdx]; if(!cell || !cell.defender) return;
  const defender = cell.defender;
  const refund = Math.floor(((defender.cost || 50) + (defender.totalCost || 0)) * 0.7);
  const confirmed = confirm(`⚠️ Are you sure you want to sell ${defender.name}?\nYou will receive ${refund} coins.`);
  if(!confirmed){ UI.log && UI.log(`❌ Sale cancelled for ${defender.name}`); return; }
  state.coins += refund;
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  UI.log && UI.log(`💰 Sold ${defender.name} for ${refund} coins!`);
  if(window && window.GameAPI && typeof window.GameAPI.save === 'function') window.GameAPI.save();
  UI.updateUI(); UI.updateShopAndInventory();
}

export function moveDefender(cellIdx){
  const cell = state.cells[cellIdx]; if(!cell || !cell.defender) return;
  const defender = cell.defender;
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  const movingPet = { ...defender, uniqueId: Date.now() + '_' + Math.random() };
  movingPet.equipped = false;
  addPetToInventory(movingPet, { dedupe: true });
  state.selectedDefender = movingPet;
  UI.log && UI.log(`🔄 Moving ${defender.name} - Click on a placeable cell to redeploy!`);
  UI.updateUI(); UI.updateShopAndInventory();
}

export function removeDefender(cellIdx){
  const cell = state.cells[cellIdx]; if(!cell || !cell.defender) return;
  const defender = cell.defender;
  state.defenders = state.defenders.filter(d => d !== defender);
  cell.defender = null;
  const returned = { ...defender, row: undefined, col: undefined };
  returned.equipped = false;
  addPetToInventory(returned, { dedupe: true });
  UI.log && UI.log(`↩️ Returned ${defender.name} to inventory.`);
  if(window && window.GameAPI && typeof window.GameAPI.save === 'function') window.GameAPI.save();
  UI.updateUI(); UI.updateShopAndInventory();
}

export function placeDefender(cellIdx){
  const cell = state.cells[cellIdx]; if(!cell) return;
  if(!state.selectedDefender){ UI.log && UI.log('⚠️ Select a pet from your inventory first!'); return; }
  const sel = state.selectedDefender;
  if(sel && !state.ownedPets.some(p => p.uniqueId === sel.uniqueId)){ UI.log && UI.log('⚠️ The selected pet is no longer in your inventory.'); state.selectedDefender = null; UI.updateShopAndInventory(); return; }
  if(cell.isPath){ UI.log && UI.log('⚠️ Cannot place defenders on the path!'); return; }
  if(cell.defender){ UI.log && UI.log('⚠️ Cell already occupied!'); return; }
  const defender = { ...state.selectedDefender, row: cell.row, col: cell.col, attackCooldown: 0, upgradeLevel: state.selectedDefender.upgradeLevel || 0, totalCost: state.selectedDefender.totalCost || 0 };
  defender.equipped = true;
  cell.defender = defender; state.defenders.push(defender);
  state.ownedPets = state.ownedPets.filter(p => p.uniqueId !== state.selectedDefender.uniqueId);
  state.selectedDefender = null;
  UI.log && UI.log(`✅ Deployed ${defender.name} at (${cell.row}, ${cell.col})`);
  UI.updateUI(); UI.updateShopAndInventory();
}

export function updateDefenders(deltaTime){
  state.defenders.forEach(def => {
    def.attackCooldown -= deltaTime;
    if(def.attackCooldown > 0) return;
    const center = { x: def.col + 0.5, y: def.row + 0.5 };
    let target = null;
    for(const e of state.enemies){ if(e.spawnDelay > 0) continue; const enemyCenter = { x: e.position.col + 0.5, y: e.position.row + 0.5 }; if(Math.hypot(center.x-enemyCenter.x, center.y-enemyCenter.y) <= def.range){ target = e; break; } }
    if(target){
      if(window && window.GameAPI && typeof window.GameAPI.triggerAttackAnimation === 'function') window.GameAPI.triggerAttackAnimation(def);
      if(window && window.GameAPI && typeof window.GameAPI.createProjectile === 'function') window.GameAPI.createProjectile(def, target);
      def.attackCooldown = def.attackSpeed;
    }
  });
}

export function enchantPet(uniqueId){
  const pet = (state.ownedPets || []).find(p => p.uniqueId === uniqueId);
  if(!pet) return;
  const enchantLevel = pet.enchantLevel || 0;
  const enchantCost = Math.floor(100 * Math.pow(1.5, enchantLevel));
  if(state.gems < enchantCost){ UI.log && UI.log('⚠️ Not enough gems to enchant!'); return; }
  // Apply enchantment
  state.gems -= enchantCost;
  pet.enchantLevel = enchantLevel + 1;
  pet.enchantBonus = (pet.enchantBonus || 0) + 0.1; // +10% per level

  // Recalculate stats using base pet definition if available
  const basePet = (window.PET_DEFENDERS || []).find(p => p.id === pet.id);
  if(basePet){
    const totalMultiplier = (pet.kgBonus || 1) * (pet.variantBonus || 1) * (1 + (pet.enchantBonus || 0));
    pet.damage = Math.floor(basePet.damage * totalMultiplier);
    pet.range = basePet.range * totalMultiplier;
    pet.attackSpeed = basePet.attackSpeed / Math.sqrt(totalMultiplier);
  }

  UI.log && UI.log(`✨ Enchanted ${pet.name} to level ${pet.enchantLevel}! (+10% stats)`);
  if(window && window.GameAPI && typeof window.GameAPI.save === 'function') window.GameAPI.save();
  UI.showEnchantModal && UI.showEnchantModal();
  UI.updateShopAndInventory && UI.updateShopAndInventory();
}
