import { state, STARTING_COINS, STARTING_GEMS, STARTING_LIVES } from './state.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hkdxpmcwolfmldkhsukt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZHhwbWN3b2xmbWxka2hzdWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTcwOTAsImV4cCI6MjA3NjMzMzA5MH0.bRy_4zYoPXQIhiDw-Mes6mcPd5h0cGLnq2X0gll5eb8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Add helper to add a pet to inventory (keeps compatibility with refactor)
export function addPetToInventory(pet, options = { dedupe: true }){
  if(!pet) return false;
  if(!pet.uniqueId) pet.uniqueId = Date.now() + '_' + Math.random();
  if(options.dedupe){
    const exists = (state.ownedPets || []).some(p => p.uniqueId === pet.uniqueId);
    if(exists){
      console.warn('Duplicate pet prevented from being added to inventory:', pet.name, pet.uniqueId);
      return false;
    }
  }
  state.ownedPets = state.ownedPets || [];
  state.ownedPets.push(pet);
  return true;
}

export async function save(currentUser, isGuest, showSaveIndicator, showErrorToast){
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

  // Save to Supabase if logged in
  if(currentUser && !isGuest){
    try{
      await saveUserData(currentUser, showErrorToast);
    }catch(err){
      console.error('Supabase save error:', err);
    }
  }

  if(showSaveIndicator) showSaveIndicator();
}

export function load(){
  const raw = localStorage.getItem('petdefense_state');
  if(raw){
    try{
      const loaded = JSON.parse(raw);
      Object.keys(loaded).forEach(k => { state[k] = loaded[k]; });
    }catch(e){
      console.warn('Failed to load state', e);
    }
  }
}

export async function loadUserData(currentUser, showErrorToast, showInfoToast, updateShopAndInventory){
  if(!currentUser) return;
  state.coins = currentUser.coins || STARTING_COINS;
  state.gems = currentUser.gems || STARTING_GEMS;
  state.lives = currentUser.lives || STARTING_LIVES;

  const { data: pets, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', currentUser.user_id);
  console.debug('loadUserData: fetched pets rows:', { pets, error });
  if(error){
    console.error('Error fetching pets for user:', error);
    if(showErrorToast) showErrorToast('⚠️ Failed to load saved pets from server.');
  }

  if(!error && pets){
    const unmatched = [];
    let matchedCount = 0;
    state.ownedPets = pets.map(dbPet => {
      let basePet = window.PET_DEFENDERS && window.PET_DEFENDERS.find
        ? window.PET_DEFENDERS.find(p => p.id === (dbPet.name || '').toString().toLowerCase())
        : null;
      if(!basePet){
        const normalized = (dbPet.name || '').toLowerCase().replace(/\s+/g, '');
        basePet = window.PET_DEFENDERS && window.PET_DEFENDERS.find ? window.PET_DEFENDERS.find(p => p.id === normalized || p.name.toLowerCase().replace(/\s+/g, '') === normalized) : null;
      }
      if(!basePet){ unmatched.push({ dbPet }); return null; }
      return {
        ...basePet,
        uniqueId: dbPet.pet_id,
        kg: dbPet.weight_kg || 10,
        kgBonus: dbPet.power_bonus || 1,
        variant: dbPet.variant || null,
        variantBonus: dbPet.variant === 'rainbow' ? 2.0 : dbPet.variant === 'gold' ? 1.5 : 1.0,
        enchantLevel: dbPet.enchant_level || 0,
        enchantBonus: (dbPet.enchant_level || 0) * 0.1,
        rarity: dbPet.rarity,
        damage: Math.floor(basePet.damage * (dbPet.power_bonus || 1)),
        range: basePet.range * (dbPet.power_bonus || 1),
        attackSpeed: basePet.attackSpeed / Math.sqrt(dbPet.power_bonus || 1)
      };
    }).filter(p => p !== null);
    matchedCount = state.ownedPets.length;
    console.info(`loadUserData: fetched ${pets.length} rows, matched ${matchedCount} pets.`);
    if(showInfoToast) showInfoToast(`Loaded ${matchedCount}/${pets.length} saved pets from your account`);
    if(updateShopAndInventory) updateShopAndInventory();
    if(pets.length > 0 && matchedCount === 0){
      console.warn('loadUserData: no pets matched known PET_DEFENDERS. Unmatched rows:', unmatched);
      if(showErrorToast) showErrorToast('⚠️ Found saved pets, but none matched known pet types. Check server data.');
    }
  }

  if(state.ownedPets.length === 0){
    if(window.initStarterPets) window.initStarterPets();
  }
}

export async function saveUserData(currentUser, showErrorToast){
  if(!currentUser) return;
  try {
    const { error: updErr } = await supabase
      .from('users')
      .update({
        coins: Math.floor(state.coins),
        gems: Math.floor(state.gems),
        lives: state.lives,
        current_wave: state.wave,
        max_wave: Math.max(currentUser.max_wave || 1, state.wave)
      })
      .eq('user_id', currentUser.user_id);
    if(updErr){ console.error('Failed to update user stats:', updErr); if(showErrorToast) showErrorToast('⚠️ Failed to update user data on server.'); }

    const { error: delErr } = await supabase
      .from('pets')
      .delete()
      .eq('user_id', currentUser.user_id);
    if(delErr){ console.error('Failed to delete old pets from DB:', delErr); if(showErrorToast) showErrorToast('⚠️ Failed to update saved pets on server.'); }

    const petsToInsert = [];
    (state.ownedPets || []).forEach(pet => {
      const rawRarity = (pet.rarity || 'common').toString();
      const rarity = rawRarity.charAt(0).toUpperCase() + rawRarity.slice(1).toLowerCase();
      petsToInsert.push({
        user_id: currentUser.user_id,
        name: pet.id || pet.name,
        rarity: rarity,
        weight_kg: pet.kg || 10,
        variant: pet.variant || null,
        enchant_level: pet.enchantLevel || 0,
        power_bonus: Number(((pet.kgBonus || 1) * (pet.variantBonus || 1) * (1 + (pet.enchantBonus || 0))).toFixed(2)),
        equipped: false
      });
    });

    (state.defenders || []).forEach(def => {
      const rawRarity = (def.rarity || 'common').toString();
      const rarity = rawRarity.charAt(0).toUpperCase() + rawRarity.slice(1).toLowerCase();
      petsToInsert.push({
        user_id: currentUser.user_id,
        name: def.id || def.name || def.uniqueId || def.name,
        rarity: rarity,
        weight_kg: def.kg || 10,
        variant: def.variant || null,
        enchant_level: def.enchantLevel || 0,
        power_bonus: Number(((def.kgBonus || 1) * (def.variantBonus || 1) * (1 + (def.enchantBonus || 0))).toFixed(2)),
        equipped: true
      });
    });

    if(petsToInsert.length > 0){
      const { error: insertErr } = await supabase
        .from('pets')
        .insert(petsToInsert);
      if(insertErr){ console.error('Failed to insert pets to DB:', insertErr); if(showErrorToast) showErrorToast('⚠️ Failed to save pets to server. Changes may not persist.'); }
    }
  } catch(err){ console.error('Save error:', err); }
}

// Backwards-compatible aliases expected by other modules after refactor
export { loadUserData as persistenceLoadUserData, saveUserData as persistenceSaveUserData };
