import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themes, resolveTheme } from '../data/themes.mjs';
import { profile } from '../data/profile.mjs';
import { renderAscii } from '../lib/ascii.mjs';

gsap.registerPlugin(ScrollTrigger);
const $ = <T extends HTMLElement = HTMLElement>(selector:string) => document.querySelector<T>(selector)!;
const $$ = <T extends HTMLElement = HTMLElement>(selector:string) => [...document.querySelectorAll<T>(selector)];
const storage = {get(key:string){try{return localStorage.getItem(key)}catch{return null}},set(key:string,value:string){try{localStorage.setItem(key,value)}catch{/* Browsing without storage is supported. */}}};
const root=document.documentElement;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused=storage.get('vishal-motion')==='off';
const motionAllowed=()=>!reduceMotion.matches&&!userPaused;
let activeTheme=resolveTheme(root.dataset.theme);

// Real HTML dialogs provide Escape handling, focus trapping, and focus restoration.
const themeDialog=$<HTMLDialogElement>('#theme-dialog');
const commandDialog=$<HTMLDialogElement>('#command-dialog');
const search=$<HTMLInputElement>('#command-search');
function closeDialogs(){[themeDialog,commandDialog].forEach(d=>{if(d.open)d.close()})}
function openDialog(dialog:HTMLDialogElement){
 closeDialogs();dialog.showModal();
 if(dialog===commandDialog){search.value='';filterCommands();search.focus()}
 else {themeDialog.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus()}
 if(motionAllowed())gsap.fromTo(dialog,{y:12,opacity:0},{y:0,opacity:1,duration:.22,clearProps:'transform,opacity'});
}
$$('[data-theme-open]').forEach(button=>button.addEventListener('click',()=>openDialog(themeDialog)));
$$('[data-command-open]').forEach(button=>button.addEventListener('click',()=>openDialog(commandDialog)));
$$('[data-close]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.close!)?.closest<HTMLDialogElement>('dialog')?.close()));
[themeDialog,commandDialog].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();const e=event as MouseEvent;if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close()}}));

function applyTheme(id:string,save=true){
 activeTheme=resolveTheme(id);root.dataset.theme=activeTheme.id;
 $$('[data-theme-name]').forEach(label=>label.textContent=activeTheme.name);
 $$('.theme-trigger,.status-theme').forEach(button=>button.setAttribute('aria-label',`Choose color theme, current: ${activeTheme.name}`));
 $$<HTMLButtonElement>('.theme-option').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===activeTheme.id)));
 document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content=activeTheme.bg;
 // The favicon follows the palette too; SVG remains the standalone fallback.
 const icon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="17" fill="${activeTheme.bg}"/><path d="m12 20 9 25h6l10-25h-7l-5 17-6-17z" fill="${activeTheme.ink}"/><path d="M46 13v20m-10-10h20m-17-7 14 14m0-14-14 14" stroke="${activeTheme.accent}" stroke-width="3"/></svg>`;
 document.querySelector<HTMLLinkElement>('link[rel="icon"]')!.href='data:image/svg+xml,'+encodeURIComponent(icon);
 if(save)storage.set('vishal-editor-theme',activeTheme.id);
}
applyTheme(activeTheme.id,false);
$$<HTMLButtonElement>('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>{applyTheme(button.dataset.themeChoice!);if(commandDialog.open)commandDialog.close()}));

const commandItems=$$<HTMLAnchorElement|HTMLButtonElement>('.command-item');
function filterCommands(){const query=search.value.trim().toLowerCase();let found=0;commandItems.forEach(item=>{item.hidden=!item.dataset.command!.includes(query);if(!item.hidden)found++});$('#command-empty').hidden=found>0}
search.addEventListener('input',filterCommands);
commandItems.forEach(item=>{if(item instanceof HTMLAnchorElement)item.addEventListener('click',()=>commandDialog.close())});
commandDialog.addEventListener('keydown',event=>{
 const visible=commandItems.filter(item=>!item.hidden),index=visible.indexOf(document.activeElement as HTMLButtonElement);
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const next=event.key==='ArrowDown'?(index+1)%visible.length:index<0?visible.length-1:(index-1+visible.length)%visible.length;visible[next]?.focus()}
 if(event.key==='Enter'&&document.activeElement===search){event.preventDefault();visible[0]?.click()}
});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();commandDialog.open?commandDialog.close():openDialog(commandDialog)}});

// Project filtering keeps source links and details native and keyboard accessible.
$$<HTMLButtonElement>('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let count=0;$$('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});
 $('#project-count').textContent=`${count} exploration${count===1?'':'s'}`;
 if(motionAllowed())gsap.fromTo('.project-card:not([hidden])',{y:10},{y:0,duration:.3,stagger:.06,clearProps:'transform'});
 ScrollTrigger.refresh();
}));

// WAI-ARIA tab keyboard model: arrow keys, Home and End, with one tab stop.
const skillTabs=$$<HTMLButtonElement>('[data-skill]');
function selectSkill(tab:HTMLButtonElement){skillTabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;const panel=document.getElementById(t.getAttribute('aria-controls')!)!;panel.hidden=!selected});ScrollTrigger.refresh()}
skillTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectSkill(tab));tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%skillTabs.length;else if(event.key==='ArrowLeft')next=(index-1+skillTabs.length)%skillTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=skillTabs.length-1;else return;event.preventDefault();selectSkill(skillTabs[next]);skillTabs[next].focus()})});

$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(profile.email);$('#copy-status').textContent='Email copied. Your next hello is one paste away.'}catch{$('#copy-status').textContent=profile.email}});

const ascii=$<HTMLPreElement>('#ascii'),stage=$('#ascii-stage'),pauseButton=$<HTMLButtonElement>('#ascii-pause');
let shape='sphere',localPaused=false,speed=1,artTime=0,lastDraw=0,labVisible=true,contactVisible=false;
const pointer={x:0,y:0},target={x:0,y:0};
function drawAscii(){ascii.textContent=renderAscii(shape,artTime,pointer);stage.setAttribute('aria-label',`ASCII ${shape} sculpture. Choose a shape below, adjust speed, or move your pointer to rotate it.`)}
function syncPause(){const forced=!motionAllowed();pauseButton.disabled=forced;pauseButton.textContent=localPaused||forced?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',localPaused?'Play ASCII animation':'Pause ASCII animation');pauseButton.setAttribute('aria-pressed',String(localPaused||forced));$('#ascii-hint').textContent=forced?'A still moment. Motion is paused.':localPaused?'A still moment. Press play to explore.':'Move your pointer. Make some waves.'}
$$<HTMLButtonElement>('[data-shape]').forEach(button=>button.addEventListener('click',()=>{shape=button.dataset.shape!;$$('[data-shape]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));drawAscii()}));
pauseButton.addEventListener('click',()=>{localPaused=!localPaused;syncPause()});
$<HTMLInputElement>('#ascii-speed').addEventListener('input',event=>{speed=Number((event.target as HTMLInputElement).value)});
stage.addEventListener('pointermove',event=>{const rect=stage.getBoundingClientRect();target.x=(event.clientX-rect.left)/rect.width*2-1;target.y=(event.clientY-rect.top)/rect.height*2-1});
stage.addEventListener('pointerleave',()=>{target.x=0;target.y=0});
const visibilityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target===stage)labVisible=entry.isIntersecting;else contactVisible=entry.isIntersecting}),{threshold:.05});
visibilityObserver.observe(stage);visibilityObserver.observe($('#contact-ascii'));
let roleTime=0,roleIndex=0,scramble=0,lastRoleDraw=0;
const roles=['machine learning','adaptive networks','creative code','the next good question'];
let nextRole=roles[0];const role=$('#rotating-role');
gsap.ticker.add((time,deltaMs)=>{
 if(!motionAllowed()||document.hidden)return;
 const dt=Math.min(deltaMs/1000,.07);
 if(labVisible&&!localPaused){artTime+=dt*speed;pointer.x+=(target.x-pointer.x)*.08;pointer.y+=(target.y-pointer.y)*.08;if(time-lastDraw>1/24){ascii.textContent=renderAscii(shape,artTime,pointer);lastDraw=time}}
 if(window.scrollY<window.innerHeight){roleTime+=dt;if(roleTime>4.5){roleTime=0;roleIndex=(roleIndex+1)%roles.length;nextRole=roles[roleIndex];scramble=.55}if(scramble>0){scramble-=dt;if(time-lastRoleDraw>.045){const progress=1-Math.max(0,scramble)/.55;role.textContent=[...nextRole].map((c,i)=>i/nextRole.length<progress?c:'<>/{}*'[Math.floor(Math.random()*6)]).join('');lastRoleDraw=time}if(scramble<=0)role.textContent=nextRole}}
 if(contactVisible&&time%1<.05){const c=['.','+','*',':'][Math.floor(time)%4];$('#contact-ascii').textContent=`       .     ${c}     .\n    .     . : .     .\n  ${c}    . :  *  : .    ${c}\n    .     . : .     .\n       .     ${c}     .`}
});

let animations:gsap.Context|undefined;
let media:gsap.MatchMedia|undefined;
function setupAnimations(entrance=false){
 animations?.revert();media?.revert();
 if(!motionAllowed())return;
 animations=gsap.context(()=>{
  if(entrance){gsap.from('.hero-line',{y:26,duration:.85,stagger:.1,ease:'power3.out'});gsap.from('.hero-enter',{y:16,duration:.7,stagger:.07,delay:.25,ease:'power2.out'})}
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(element=>gsap.from(element,{y:24,duration:.7,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 94%',once:true}}));
  gsap.to('.ticker-track',{xPercent:-25,repeat:-1,duration:38,ease:'none'});
  gsap.to('.contact-ascii',{y:-7,duration:2.5,yoyo:true,repeat:-1,ease:'sine.inOut',scrollTrigger:{trigger:'.contact-ascii',start:'top bottom',end:'bottom top',toggleActions:'play pause resume pause'}});
 });
 media=gsap.matchMedia();
 media.add('(hover: hover) and (pointer: fine)',()=>{
  const cleanups:(()=>void)[]=[];
  $$('.magnetic').forEach(button=>{const move=(event:PointerEvent)=>{if(!motionAllowed())return;const r=button.getBoundingClientRect();gsap.to(button,{x:(event.clientX-r.left-r.width/2)*.14,y:(event.clientY-r.top-r.height/2)*.18,duration:.35,ease:'power2.out'})};const leave=()=>gsap.to(button,{x:0,y:0,duration:.5,ease:'elastic.out(1,.5)'});button.addEventListener('pointermove',move);button.addEventListener('pointerleave',leave);cleanups.push(()=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',leave);gsap.killTweensOf(button);gsap.set(button,{clearProps:'transform'})})});
  const photo=$('.photo-card');const enter=()=>gsap.to(photo,{rotation:-3,y:-6,duration:.4});const leave=()=>gsap.to(photo,{rotation:-8,y:0,duration:.4});photo.addEventListener('pointerenter',enter);photo.addEventListener('pointerleave',leave);cleanups.push(()=>{photo.removeEventListener('pointerenter',enter);photo.removeEventListener('pointerleave',leave);gsap.killTweensOf(photo);gsap.set(photo,{clearProps:'transform'})});
  const graph=$('.scatter-art');const animate=()=>gsap.fromTo('.plot-line',{strokeDashoffset:450},{strokeDashoffset:0,duration:1.2,ease:'power2.out'});graph.closest('a')!.addEventListener('pointerenter',animate);cleanups.push(()=>graph.closest('a')!.removeEventListener('pointerenter',animate));
  return ()=>cleanups.forEach(cleanup=>cleanup());
 });
}
const motionButton=$<HTMLButtonElement>('#motion-toggle');
function syncMotion(){const allowed=motionAllowed();root.dataset.motion=allowed?'on':'off';motionButton.textContent=reduceMotion.matches?'Motion: reduced':`Motion: ${allowed?'on':'off'}`;motionButton.setAttribute('aria-pressed',String(!allowed));motionButton.setAttribute('aria-label',allowed?'Pause motion throughout the page':reduceMotion.matches?'Reduced motion follows your system preference':'Enable motion throughout the page');motionButton.disabled=reduceMotion.matches;syncPause();if(!allowed){role.textContent=nextRole;scramble=0}}
motionButton.addEventListener('click',()=>{userPaused=!userPaused;storage.set('vishal-motion',userPaused?'off':'on');syncMotion();setupAnimations();ScrollTrigger.refresh()});
reduceMotion.addEventListener('change',()=>{syncMotion();setupAnimations();ScrollTrigger.refresh()});
syncMotion();setupAnimations(true);

// Scroll feedback remains useful even when decorative motion is disabled.
let scrollQueued=false;
function updateScroll(){const max=document.documentElement.scrollHeight-window.innerHeight;const progress=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;$('.scroll-progress').style.transform=`scaleX(${progress})`;$('#scroll-percent').textContent=`${Math.round(progress*100)}%`;const sections=['home','work','about','contact'];let current='home';for(const id of sections){if(document.getElementById(id)!.getBoundingClientRect().top<window.innerHeight*.4)current=id}$('#section-status').textContent=`~/${current}`;$$<HTMLAnchorElement>('.nav-links a').forEach(link=>{if(link.hash===`#${current}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});scrollQueued=false}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll)}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
document.fonts.ready.then(()=>ScrollTrigger.refresh());
window.addEventListener('pagehide',()=>{animations?.revert();media?.revert();visibilityObserver.disconnect()},{once:true});
