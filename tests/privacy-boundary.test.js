const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

const html=read('index.html');
const manifest=JSON.parse(read('manifest.json'));
const privateLayers=['app.js','core.js','v03.js','v03-reminders.js','v04.js','v05.js','v06-data.js','v07-experience.js','v08-trust.js'];

assert(!/<script[^>]+src=["']https?:\/\//i.test(html),'index.html must not load remote scripts');
assert.equal(manifest.start_url,'./','PWA start_url must remain relative for project Pages');
assert.equal(manifest.display,'standalone','PWA must remain installable as a standalone app');
assert.match(read('privacy.html'),/privacy/i,'privacy policy must exist');

for(const file of privateLayers){
  const source=read(file);
  assert(!/\bfetch\s*\(/.test(source),`${file} must not fetch network resources`);
  assert(!/XMLHttpRequest/.test(source),`${file} must not use XMLHttpRequest`);
  assert(!/navigator\.sendBeacon/.test(source),`${file} must not beacon telemetry`);
  assert(!/new\s+WebSocket\s*\(/.test(source),`${file} must not open WebSockets`);
}

console.log('NijRitu privacy boundary tests passed');
