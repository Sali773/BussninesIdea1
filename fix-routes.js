#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fix all route files by adding null checks before .toString()
function fixRouteFiles() {
    const routesDir = path.join(__dirname, 'resources/js/routes');

    function walkDir(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (file === 'index.ts') {
                let content = fs.readFileSync(fullPath, 'utf8');
                const original = content;

                // Fix toString() calls by adding optional chaining and fallback
                content = content.replace(
                    /parsedArgs\.(\w+)\.toString\(\)/g,
                    "parsedArgs.$1?.toString() || String(parsedArgs.$1)"
                );

                if (content !== original) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Fixed: ${fullPath}`);
                }
            }
        });
    }

    if (fs.existsSync(routesDir)) {
        walkDir(routesDir);
    }
}

fixRouteFiles();
