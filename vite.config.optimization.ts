import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';
import { VitePWA } from 'vite-plugin-pwa';

// Advanced Vite Optimization Configuration
export const optimizationConfig = {
  // Build Optimizations
  build: {
    // Enable minification with Terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 3,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    
    // Advanced chunking strategy
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }
          
          // UI libraries
          if (id.includes('@radix-ui') || id.includes('framer-motion')) {
            return 'ui-vendor';
          }
          
          // Data fetching
          if (id.includes('tanstack') || id.includes('axios')) {
            return 'data-vendor';
          }
          
          // Heavy libraries
          if (id.includes('recharts') || id.includes('d3')) {
            return 'charts-vendor';
          }
          
          // Editor libraries
          if (id.includes('monaco') || id.includes('codemirror')) {
            return 'editor-vendor';
          }
          
          // Utilities
          if (id.includes('lodash') || id.includes('date-fns')) {
            return 'utils-vendor';
          }
        },
        
        // Asset naming for better caching
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/${facadeModuleId}/[name].[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name].[hash][extname]`;
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return `assets/fonts/[name].[hash][extname]`;
          }
          return `assets/[ext]/[name].[hash][extname]`;
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Source maps for production debugging
    sourcemap: 'hidden',
    
    // Target modern browsers for smaller bundles
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Asset inlining threshold
    assetsInlineLimit: 4096,
    
    // Report compressed size
    reportCompressedSize: true,
  },
  
  // Development optimizations
  optimizeDeps: {
    // Pre-bundle heavy dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'date-fns',
      'recharts',
    ],
    
    // Exclude dependencies that should be bundled separately
    exclude: ['@replit/local-db'],
    
    // Force optimization of these packages
    force: true,
  },
  
  // CSS optimizations
  css: {
    // Enable CSS modules
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
    
    // PostCSS configuration
    postcss: {
      plugins: [
        // Add autoprefixer and other PostCSS plugins here
      ],
    },
    
    // Preprocessor options
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  
  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

// Plugins configuration
export const optimizationPlugins = [
  // Brotli and Gzip compression
  compression({
    algorithm: 'brotliCompress',
    ext: '.br',
    threshold: 10240,
    deleteOriginalFile: false,
  }),
  
  compression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240,
    deleteOriginalFile: false,
  }),
  
  // Bundle visualization
  visualizer({
    filename: './dist/stats.html',
    open: false,
    gzipSize: true,
    brotliSize: true,
    template: 'sunburst',
  }),
  
  // Image optimization
  viteImagemin({
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 80,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  }),
  
  // PWA configuration
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Arcadis Enterprise OS',
      short_name: 'Arcadis OS',
      description: 'Enterprise Management System',
      theme_color: '#000000',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  }),
];

// Server optimizations
export const serverConfig = {
  // Enable HTTP/2
  https: true,
  
  // Compression
  compression: true,
  
  // CORS configuration
  cors: {
    origin: true,
    credentials: true,
  },
  
  // Headers for security and performance
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  
  // Proxy configuration for API calls
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    },
  },
};

// Export complete optimization configuration
export default {
  ...optimizationConfig,
  plugins: optimizationPlugins,
  server: serverConfig,
};