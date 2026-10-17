import './build.mjs';
import { context } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const demo = await context({
  entryPoints: [fileURLToPath(new URL('src/demo-seed/entry.jsx', root))],
  bundle: true,
  outfile: fileURLToPath(new URL('dist/demo-seed/app.js', root)),
  format: 'esm',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' },
  legalComments: 'linked',
});
await demo.watch();
process.argv.push('--dev');
await import('./serve.mjs');
