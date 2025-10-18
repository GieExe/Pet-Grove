import { state, PET_DEFENDERS, GACHA_RATES, GACHA_COST } from '../state.js';
import { generatePetKg, getKgBonus } from '../utils.js';
import * as UI from '../ui.js';

export function rollGacha(){
  const roll = Math.random();
  let cumulative = 0; let rarity = 'common';
  for(const [r, rate] of Object.entries(GACHA_RATES)){ cumulative += rate; if(roll < cumulative){ rarity = r; break; } }
  const pool = PET_DEFENDERS.filter(p => p.rarity === rarity);
  const pet = pool[Math.floor(Math.random() * pool.length)];
  const kg = generatePetKg(rarity); const kgBonus = getKgBonus(kg, rarity);
  let variant = null; let variantBonus = 1.0; const variantRoll = Math.random(); if(variantRoll < 0.01){ variant='rainbow'; variantBonus=2.0; } else if(variantRoll < 0.06){ variant='gold'; variantBonus=1.5; }
  return { ...pet, uniqueId: Date.now() + '_' + Math.random(), kg, kgBonus, variant, variantBonus, enchantLevel:0, enchantBonus:0, damage: Math.floor(pet.damage * kgBonus * variantBonus), range: pet.range * kgBonus * variantBonus, attackSpeed: pet.attackSpeed / Math.sqrt(kgBonus * variantBonus)};
}

export function openGacha(){
  if(state.gems < GACHA_COST){ UI.log && UI.log(`⚠️ Not enough gems! Need ${GACHA_COST} gems.`); return; }
  state.gems -= GACHA_COST; const newPet = rollGacha();
  const autoSellCheckbox = document.getElementById('autoSellCommon'); const autoSellEnabled = autoSellCheckbox && autoSellCheckbox.checked;
  let autoSold = false; let sellValue = 0;
  if(autoSellEnabled && newPet.rarity === 'common'){ const existingPet = state.ownedPets.find(p => p.id === newPet.id); if(existingPet){ sellValue = Math.floor(newPet.cost * 0.5); state.coins += sellValue; autoSold = true; UI.log && UI.log(`💰 Auto-sold duplicate ${newPet.name} for ${sellValue} coins!`); } }
  if(!autoSold) state.ownedPets.push(newPet);
  if(!state.stats) state.stats = {}; state.stats.gachaRolls = (state.stats.gachaRolls || 0) + 1;
  const kgQuality = newPet.kgBonus > 1.2 ? '⭐ HEAVY!' : newPet.kgBonus < 0.9 ? '⚠️ Light' : '✓ Normal';
  const variantDisplay = newPet.variant === 'rainbow' ? '<div class="variant-badge rainbow">🌈 RAINBOW +100%</div>' : newPet.variant === 'gold' ? '<div class="variant-badge">🌟 GOLD +50%</div>' : '';
  const autoSoldMessage = autoSold ? `<div style="margin-top:12px;padding:8px;background:rgba(255,215,0,0.2);border:1px solid rgba(255,215,0,0.4);border-radius:6px;"> <strong>✅ Auto-Sold!</strong><br> Duplicate common pet sold for <strong>${sellValue} coins</strong></div>` : '';
  const gachaResult = document.getElementById('gachaResult'); if(gachaResult){ gachaResult.innerHTML = `<div class="gacha-reveal ${newPet.rarity}" style="position:relative">${variantDisplay}<div class="gacha-emoji">${newPet.emoji}</div><h3>${newPet.name}</h3><div class="rarity-badge ${newPet.rarity}">${newPet.rarity.toUpperCase()}</div><p>${newPet.description}</p><div class="stats"><div>💪 Damage: ${Math.floor(newPet.damage)}</div><div>📏 Range: ${newPet.range.toFixed(1)}</div><div>⚡ Speed: ${newPet.attackSpeed.toFixed(2)}s</div><div>⚖️ Weight: ${newPet.kg}kg ${kgQuality}</div><div style="font-size:0.85rem;color:#aaa;margin-top:4px">Stats: ${Math.round(newPet.kgBonus * newPet.variantBonus * 100)}%</div>${newPet.variant ? `<div style="font-size:0.9rem;color:${newPet.variant === 'rainbow' ? '#ff00ff' : '#ffd700'};margin-top:4px;font-weight:600">✨ ${newPet.variant.toUpperCase()} VARIANT!</div>` : ''}</div>${autoSoldMessage}</div>`; }
  const gachaModal = document.getElementById('gachaModal'); if(gachaModal) gachaModal.classList.remove('hidden'); UI.log && UI.log(`🎲 Rolled ${newPet.rarity} ${newPet.name}!`);
  if(window && window.GameAPI && typeof window.GameAPI.save === 'function') window.GameAPI.save();
  UI.updateUI(); UI.updateShopAndInventory();
}
