import { defineConfig } from 'vite';

export default defineConfig({
  // Ensure proper handling of dependencies
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  },
  // Configure build output
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  },
  // Dev server configuration
  server: {
    port: 5173,
    open: true
  }
});
