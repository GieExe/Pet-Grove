import Phaser from 'phaser';

// Initialize Phaser overlay and sync with the game's `state` object.
export function initPhaser(state){
  const battleGridEl = document.getElementById('battleGrid');
  if(!battleGridEl) return null;

  // Create container for Phaser canvas overlaying the grid
  let container = document.getElementById('phaserContainer');
  if(!container){
    container = document.createElement('div');
    container.id = 'phaserContainer';
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none'; // don't block UI
    battleGridEl.appendChild(container);
  }

  const gridRect = battleGridEl.getBoundingClientRect();

  const config = {
    type: Phaser.AUTO,
    width: Math.max(320, Math.round(gridRect.width)),
    height: Math.max(240, Math.round(gridRect.height)),
    parent: container,
    transparent: true,
    scene: {
      create: function(){
        this.enemySprites = new Map();
        this.projSprites = new Map();
        this.gridEl = battleGridEl;
        // Expose a phaser-native impact spawner
        const scene = this;
        window.spawnPhaserImpact = function(gridX, gridY, emoji = '💥'){
          try{
            const rect = scene.gridEl.getBoundingClientRect();
            const px = (gridX / state.GRID_COLS) * rect.width;
            const py = (gridY / state.GRID_ROWS) * rect.height;
            const t = scene.add.text(px, py, emoji, { font: '32px serif' }).setOrigin(0.5);
            t.setDepth(2000);
            scene.tweens.add({
              targets: t,
              scale: { from: 0.6, to: 1.6 },
              alpha: { from: 1, to: 0 },
              duration: 600,
              ease: 'Cubic.easeOut',
              onComplete: () => t.destroy()
            });
          }catch(e){ console.warn('spawnPhaserImpact failed', e); }
        };
      },
      update: function(){
        if(!this.gridEl) return;
        const rect = this.gridEl.getBoundingClientRect();

        // Update enemies
        const existingEnemyIds = new Set(this.enemySprites.keys());
        (state.enemies || []).forEach(enemy => {
          if(enemy.spawnDelay > 0) return;
          const x = (enemy.position.col + 0.5) / state.GRID_COLS * rect.width;
          const y = (enemy.position.row + 0.5) / state.GRID_ROWS * rect.height;
          if(!this.enemySprites.has(enemy.id)){
            const t = this.add.text(x, y, enemy.emoji || '👾', { font: '28px serif' }).setOrigin(0.5);
            t.setDepth(1000);
            this.enemySprites.set(enemy.id, t);
          } else {
            const t = this.enemySprites.get(enemy.id);
            t.x = x; t.y = y;
            // update hp label as tooltip by setting text or scaling effect
          }
          existingEnemyIds.delete(enemy.id);
        });
        existingEnemyIds.forEach(id => {
          const s = this.enemySprites.get(id);
          if(s) s.destroy();
          this.enemySprites.delete(id);
        });

        // Update projectiles
        const existingProjIds = new Set(this.projSprites.keys());
        (state.projectiles || []).forEach(proj => {
          const x = (proj.x) / state.GRID_COLS * rect.width;
          const y = (proj.y) / state.GRID_ROWS * rect.height;
          if(!this.projSprites.has(proj.id)){
            const p = this.add.text(x, y, proj.defenderEmoji || '💫', { font: '20px serif' }).setOrigin(0.5);
            p.setDepth(1100);
            this.projSprites.set(proj.id, p);
          } else {
            const p = this.projSprites.get(proj.id);
            p.x = x; p.y = y;
          }
          existingProjIds.delete(proj.id);
        });
        existingProjIds.forEach(id => {
          const s = this.projSprites.get(id);
          if(s) s.destroy();
          this.projSprites.delete(id);
        });
        // Simple overlap detection (AABB) using Phaser objects' bounds
        for(const [pid, pSprite] of this.projSprites.entries()){
          for(const [eid, eSprite] of this.enemySprites.entries()){
            const pBounds = pSprite.getBounds();
            const eBounds = eSprite.getBounds();
            if(Phaser.Geom.Intersects.RectangleToRectangle(pBounds, eBounds)){
              // notify main app to apply damage and remove objects
              if(window && window.handlePhaserCollision) window.handlePhaserCollision(pid, eid);
            }
          }
        }
      }
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  const game = new Phaser.Game(config);

  // Keep a back-reference so other code can check Phaser is active
  state.usePhaser = true;
  return game;
}

export default { initPhaser };
