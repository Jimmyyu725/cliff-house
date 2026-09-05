import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const result = ts.transpileModule(fs.readFileSync('lib/scene.ts', 'utf8'), {compilerOptions: {module: ts.ModuleKind.ESNext}});
const { scenes } = await import(`data:text/javascript,${encodeURIComponent(result.outputText)}`);
assert.deepEqual(Object.keys(scenes), ['day', 'golden', 'blue']);
assert.equal(new Set(Object.values(scenes).map(x => x.filter)).size, 3);
for (const scene of Object.values(scenes)) {
  assert.ok(scene.label.length > 0);
  assert.match(scene.filter, /brightness\([\d.]+\)/);
}
const page = fs.readFileSync('app/page.tsx', 'utf8');
for (const required of ['inert={immersive}', "event.key === 'Escape'", 'aria-pressed={sound}', 'audio.current?.close()', 'prefers-reduced-motion']) {
  assert.ok((page + fs.readFileSync('app/globals.css','utf8')).includes(required), required);
}
assert.ok(fs.statSync('public/cliff-house.png').size > 100000);
assert.ok(!page.includes('Your site is taking shape'));
console.log('PASS: 3 distinct lighting presets, immersion keyboard hooks, audio cleanup, reduced-motion support, render asset and custom page.');
