/* Records the automated walkthrough to MP4 (1920×1080, H.264) and writes matching SRT subtitles.
   Usage (from the repository root):
     node walkthrough/record.js                 # main walkthrough (chapters 1 and 2)
     node walkthrough/record.js --chapter learn # optional personalised-learning chapter
   Requirements: Node 18+, Playwright with Chromium, and FFmpeg with libx264
   (set FFMPEG=/path/to/ffmpeg if it is not on your PATH).
   How it works: serves the repository locally, opens walkthrough.html?video in headless Chromium,
   captures every rendered frame with the Chrome DevTools screencast, then encodes a constant 30 fps MP4. */
const fs=require('fs'),path=require('path'),http=require('http'),{spawnSync,execSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i>0?process.argv[i+1]:d};
const CHAPTER=arg('chapter','main');
const OUT_DIR=path.resolve(arg('out',path.join(__dirname,'video')));
const NAME=CHAPTER==='learn'?'pause-personalised-learning':'pause-walkthrough';
const FFMPEG=process.env.FFMPEG||'ffmpeg';
const W=1920,H=1080,FPS=30;
let chromium;try{({chromium}=require('playwright'))}catch(e){({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'))}

const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer((req,res)=>{const p=decodeURIComponent(req.url.split('?')[0]);const f=path.join(ROOT,p==='/'?'index.html':p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);res.end();return}
  res.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)});

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
  const frames=path.join(OUT_DIR,'.frames-'+NAME);fs.rmSync(frames,{recursive:true,force:true});fs.mkdirSync(frames,{recursive:true});
  const browser=await chromium.launch({args:['--force-color-profile=srgb','--font-render-hinting=none']});
  const page=await (await browser.newContext({viewport:{width:W,height:H},deviceScaleFactor:1})).newPage();
  const events=[];let done=false;
  page.on('console',m=>{const t=m.text();if(t.startsWith('WT ')){const e=JSON.parse(t.slice(3));e.wall=Date.now();events.push(e);if(e.ev==='summary')setTimeout(()=>{done=true},Number(arg('outro',9000)))}});
  const cdp=await page.context().newCDPSession(page);const shots=[];
  cdp.on('Page.screencastFrame',async f=>{const file=path.join(frames,String(shots.length).padStart(6,'0')+'.jpg');fs.writeFileSync(file,Buffer.from(f.data,'base64'));
    shots.push({file,t:f.metadata.timestamp*1000});cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}).catch(()=>{})});
  const url=`http://127.0.0.1:${port}/walkthrough.html?video${CHAPTER==='learn'?'&chapter=learn':''}`;
  await page.goto(url);await page.waitForTimeout(800);
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:92,maxWidth:W,maxHeight:H,everyNthFrame:1});
  const start=Date.now();
  while(!done&&Date.now()-start<6*60*1000)await page.waitForTimeout(250);
  await cdp.send('Page.stopScreencast');await page.waitForTimeout(300);await browser.close();server.close();
  if(shots.length<2)throw new Error('No frames captured');

  /* Frames arrive only when the screen changes, so each one is held until the next one. */
  const t0=shots[0].t,end=Date.now();
  const list=shots.map((s,i)=>`file '${s.file}'\nduration ${(((i<shots.length-1?shots[i+1].t:end)-s.t)/1000).toFixed(4)}`).join('\n')+`\nfile '${shots[shots.length-1].file}'\n`;
  const listFile=path.join(frames,'list.txt');fs.writeFileSync(listFile,list);
  const mp4=path.join(OUT_DIR,NAME+'.mp4');
  const r=spawnSync(FFMPEG,['-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',listFile,'-vf',`fps=${FPS},scale=${W}:${H}:flags=lanczos,format=yuv420p`,'-c:v','libx264','-preset','slow','-crf','20','-tune','stillimage','-movflags','+faststart','-r',String(FPS),mp4],{stdio:'inherit'});
  if(r.status!==0)throw new Error('FFmpeg failed');

  /* Subtitles and narration timing from the walkthrough's own step events. */
  const {STEPS}=loadSteps();
  const rel=e=>Math.max(0,(e.wall-t0)/1000);
  const total=(end-t0)/1000;
  const segs=[];
  const intro=events.find(e=>e.ev==='intro');
  if(intro)segs.push({from:rel(intro),text:CHAPTER==='learn'?'Pause: an optional chapter on personalised learning.':'Pause: scroll on purpose, stop by choice. Two connected interventions for doomscrolling among students and young adults.'});
  events.filter(e=>e.ev==='step').forEach(e=>{const s=STEPS.find(x=>x.id===e.id);if(s)segs.push({from:rel(e),text:s.say,title:`${s.num} · ${s.name}`})});
  const sum=events.find(e=>e.ev==='summary');
  if(sum)segs.push({from:rel(sum),text:CHAPTER==='learn'?'One detour, then done. Learning stays optional, personalised from what users choose to share, and ends cleanly at home.':'In summary: Purpose Sessions add awareness and a goal before entry; Reward the Exit adds visibility, stopping points and rising friction, and makes leaving easier. This is a prototype; its effects have not yet been evaluated.'});
  segs.forEach((s,i)=>s.to=i<segs.length-1?segs[i+1].from:total);
  const cues=[];
  segs.forEach(s=>{const parts=chunks(s.text);const len=parts.reduce((a,p)=>a+p.length,0);let t=s.from+0.2;const span=Math.max(1,s.to-s.from-0.4);
    parts.forEach(p=>{const d=span*p.length/len;cues.push({from:t,to:t+d-0.05,text:wrap(p.trim())});t+=d})});
  const ts=x=>{const ms=Math.round(x*1000),h=Math.floor(ms/3600000),m=Math.floor(ms/60000)%60,sec=Math.floor(ms/1000)%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`};
  fs.writeFileSync(path.join(OUT_DIR,NAME+'.srt'),cues.map((c,i)=>`${i+1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text}\n`).join('\n'));
  const mmss=x=>`${Math.floor(x/60)}:${String(Math.floor(x%60)).padStart(2,'0')}`;
  fs.writeFileSync(path.join(OUT_DIR,NAME+'-narration.md'),`# ${CHAPTER==='learn'?'Pause: personalised learning':'Pause walkthrough'} · optional narration script\n\nTimings match \`${NAME}.mp4\` (${mmss(total)}). Read at a calm pace; each block should end before the next timestamp.\n\n`+
    segs.map(s=>`**${mmss(s.from)}–${mmss(s.to)}** · ${s.title||(s===segs[0]?'Title':'Summary')}\n\n${s.text}\n`).join('\n'));
  fs.rmSync(frames,{recursive:true,force:true});
  console.log(`${mp4}\n  ${shots.length} frames captured, ${total.toFixed(1)} s`);
})().catch(e=>{console.error(e);server.close();process.exit(1)});

/* Subtitle cues: sentences, split further at commas, colons or semicolons so each cue fits two short lines. */
function chunks(text){const out=[];(text.match(/[^.!?]+[.!?]+(\s|$)/g)||[text]).forEach(sen=>{sen=sen.trim();if(sen.length<=84){out.push(sen);return}
  let cur='';sen.split(/(?<=[,:;])\s+/).forEach(piece=>{if(cur&&(cur+' '+piece).length>84){out.push(cur);cur=piece}else cur=(cur+' '+piece).trim()});if(cur)out.push(cur)});
  return out.flatMap(c=>{if(c.length<=84)return [c];const w=c.split(' ');const mid=Math.ceil(w.length/2);return [w.slice(0,mid).join(' '),w.slice(mid).join(' ')]})}
function wrap(t){if(t.length<=46)return t;const words=t.split(' ');let a='',b='';for(const w of words){if(!b&&(a+' '+w).trim().length<=Math.ceil(t.length/2)+6)a=(a+' '+w).trim();else b=(b+' '+w).trim()}return a+'\n'+b}
function loadSteps(){const g={};new Function('window',fs.readFileSync(path.join(__dirname,'steps.js'),'utf8'))(g);return g.WALKTHROUGH}
