import { state } from '../state.js';
import * as UI from '../ui.js';
import { createClient } from '@supabase/supabase-js';
import { persistenceLoadUserData, persistenceSaveUserData } from '../persistence.js';

const SUPABASE_URL = 'https://hkdxpmcwolfmldkhsukt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZHhwbWN3b2xmbWxka2hzdWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTcwOTAsImV4cCI6MjA3NjMzMzA5MH0.bRy_4zYoPXQIhiDw-Mes6mcPd5h0cGLnq2X0gll5eb8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function hashPassword(password){
  const encoder = new TextEncoder(); const data = encoder.encode(password); const hash = await crypto.subtle.digest('SHA-256', data); const hashArray = Array.from(new Uint8Array(hash)); return hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');
}

export async function handleLogin(){
  const username = document.getElementById('authUsername').value.trim(); const password = document.getElementById('authPassword').value; const errorEl = document.getElementById('authError'); const loginBtn = document.getElementById('loginBtn');
  if(!username || !password){ errorEl.textContent = '⚠️ Please enter both username and password'; errorEl.classList.remove('hidden'); return; }
  loginBtn.disabled = true; loginBtn.textContent = 'Logging in...';
  try{ const passwordHash = await hashPassword(password); const { data: users, error: queryError } = await supabase.from('users').select('*').eq('username', username).single(); if(queryError || !users){ errorEl.textContent = '❌ Invalid username or password'; errorEl.classList.remove('hidden'); loginBtn.disabled = false; loginBtn.textContent='Login'; return; }
    if(users.password !== passwordHash){ errorEl.textContent='❌ Invalid username or password'; errorEl.classList.remove('hidden'); loginBtn.disabled=false; loginBtn.textContent='Login'; return; }
    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('user_id', users.user_id);
    // Load user data via persistence module
    await persistenceLoadUserData(users, UI.showErrorToast, UI.showInfoToast, UI.updateShopAndInventory);
    document.getElementById('authModal').classList.add('hidden'); document.getElementById('authUsername').value=''; document.getElementById('authPassword').value=''; UI.log && UI.log(`✅ Welcome back, ${username}!`);
  }catch(err){ console.error('Login error:', err); errorEl.textContent = `❌ Login failed: ${err.message || 'Please try again'}`; errorEl.classList.remove('hidden'); loginBtn.disabled=false; loginBtn.textContent='Login'; }
}

export async function handleRegister(){
  const username = document.getElementById('authUsername').value.trim(); const password = document.getElementById('authPassword').value; const errorEl = document.getElementById('authError'); const registerBtn = document.getElementById('registerBtn');
  if(!username || !password){ errorEl.textContent='⚠️ Please enter both username and password'; errorEl.classList.remove('hidden'); return; }
  if(username.length<3){ errorEl.textContent='⚠️ Username must be at least 3 characters'; errorEl.classList.remove('hidden'); return; }
  if(password.length<6){ errorEl.textContent='⚠️ Password must be at least 6 characters'; errorEl.classList.remove('hidden'); return; }
  if(!/^[a-zA-Z0-9_]+$/.test(username)){ errorEl.textContent='⚠️ Username can only contain letters, numbers, and underscores'; errorEl.classList.remove('hidden'); return; }
  registerBtn.disabled = true; registerBtn.textContent = 'Creating account...';
  try{ const { data: existing } = await supabase.from('users').select('user_id').eq('username', username).single(); if(existing){ errorEl.textContent='❌ Username already exists.'; errorEl.classList.remove('hidden'); registerBtn.disabled=false; registerBtn.textContent='Register'; return; }
    const passwordHash = await hashPassword(password);
    const { data: newUser, error: insertError } = await supabase.from('users').insert([{ username, password: passwordHash, lives: state.lives, coins: state.coins, gems: state.gems }]).select().single();
    if(insertError){ errorEl.textContent = `❌ Registration failed: ${insertError.message || 'Please try again'}`; errorEl.classList.remove('hidden'); registerBtn.disabled=false; registerBtn.textContent='Register'; return; }
    await persistenceLoadUserData(newUser, UI.showErrorToast, UI.showInfoToast, UI.updateShopAndInventory);
    document.getElementById('authModal').classList.add('hidden'); document.getElementById('authUsername').value=''; document.getElementById('authPassword').value=''; UI.log && UI.log(`✅ Welcome, ${username}! Account created successfully.`);
    registerBtn.disabled=false; registerBtn.textContent='Register';
  }catch(err){ console.error('Registration error:', err); errorEl.textContent = `❌ Registration failed: ${err.message || 'Please try again'}`; errorEl.classList.remove('hidden'); registerBtn.disabled=false; registerBtn.textContent='Register'; }
}

export function handleGuest(){ currentUser = null; isGuest = true; document.getElementById('authModal').classList.add('hidden'); UI.log && UI.log('✅ Continuing as guest'); }

export async function handleLogout(){ if(!isGuest && currentUser){ await persistenceSaveUserData(currentUser, UI.showErrorToast); }
  currentUser = null; isGuest = false; // reset state
  state.coins = state.coins || 0; state.gems = state.gems || 0; state.lives = state.lives || 0; state.wave = 1; state.isWaveActive = false; state.isPaused = false; state.cells = []; state.defenders = []; state.enemies = []; state.projectiles = []; state.ownedPets = []; state.selectedDefender = null; state.enemyIdCounter = 0; state.lastTick = Date.now(); state.selectedMap = 'classic'; state.gameSpeed = 1; state.stats = {};
}
