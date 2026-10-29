import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderAscii,modes} from '../src/lib/ascii.mjs';
import {themes,resolveTheme} from '../src/data/themes.mjs';
import {projects,profile} from '../src/data/profile.mjs';
test('all ASCII shapes produce bounded printable frames that change over time',()=>{
 for(const mode of modes){const first=renderAscii(mode,0),second=renderAscii(mode,2);assert.notEqual(first,second);const rows=first.split('\n');assert.equal(rows.length,29);assert(rows.every(row=>row.length===64));assert.match(first,/^[\x20-\x7e\n]+$/);assert(first.trim().length>60);assert.notEqual(first,renderAscii(mode,0,{x:.8,y:.4}))}
});
test('theme IDs are unique, palettes complete, and stale preferences fall back safely',()=>{
 assert.equal(new Set(themes.map(t=>t.id)).size,8);for(const theme of themes){for(const key of ['bg','panel','ink','muted','line','accent','secondary','selection'])assert.match(theme[key],/^#[0-9a-f]{6}$/i);assert.equal(resolveTheme(theme.id),theme)}assert.equal(resolveTheme('dark').id,'solarized-light');assert.equal(resolveTheme(undefined).id,'solarized-light');
});
test('theme foregrounds retain readable text contrast',()=>{
 const lum=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 for(const t of themes){for(const bg of [t.bg,t.panel]){assert(contrast(t.ink,bg)>=4.5,`${t.name}: foreground contrast`);assert(contrast(t.muted,bg)>=4.5,`${t.name}: secondary text contrast`);assert(contrast(t.accent,bg)>=4.5,`${t.name}: accent contrast`);assert(contrast(t.secondary,bg)>=4.5,`${t.name}: secondary accent contrast`)}}
});
test('project links and Pages configuration target the user repository',()=>{for(const p of projects)assert(p.url.startsWith(profile.github+'/'));const config=readFileSync(new URL('../astro.config.mjs',import.meta.url),'utf8');assert(config.includes("base: '/Portfolio'"));assert(config.includes("output: 'static'"));assert(readFileSync(new URL('../public/images/vishal.jpeg',import.meta.url)).length>10000)});
