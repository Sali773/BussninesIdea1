import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom plugin to fix routes after generation
function fixRoutesPlugin() {
    return {
        name: 'fix-routes',
        apply: 'build',
        enforce: 'post',
        handleHotUpdate({ file, server }) {
            if (file.includes('resources/js/routes')) {
                fixRouteFile(file);
            }
        },
    };
}

function fixRouteFile(filePath: string) {
    if (!filePath.endsWith('index.ts') || !filePath.includes('routes')) return;

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;

        content = content.replace(
            /parsedArgs\.(\w+)\.toString\(\)/g,
            "parsedArgs.$1?.toString() || String(parsedArgs.$1)"
        );

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    } catch (error) {
        // Silently fail if file doesn't exist or can't be read
    }
}

// Fix routes immediately when config is loaded
function fixAllRoutes() {
    const routesDir = path.join(__dirname, 'resources/js/routes');
    if (!fs.existsSync(routesDir)) return;

    function walkDir(dir: string) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (file === 'index.ts') {
                fixRouteFile(fullPath);
            }
        });
    }

    walkDir(routesDir);
}

export default defineConfig({
    plugins: [
        {
            name: 'fix-routes-pre',
            enforce: 'pre',
            apply: 'build',
            resolveId(id) {
                // Fix routes when they're being resolved
                if (id.includes('resources/js/routes')) {
                    fixAllRoutes();
                }
                return null;
            },
        },
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        fixRoutesPlugin(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
