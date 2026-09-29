/* Pause walkthrough engine.
   The phone shows the real prototype (index.html?demo) in an iframe. The prototype runs in demo mode with
   in-memory storage, so nothing here reads or changes the visitor's saved preferences.
   Communication uses postMessage, so it also works when the files are opened directly from disk. */
(function(){'use strict';
  const {CHAPTERS,STEPS,LOOPS}=window.WALKTHROUGH;
  const $=id=>document.getElementById(id);
  const wt=$('wt'),frame=$('app'),panel=$('panel-inner'),stage=$('stage'),wrap=$('phone-wrap');
  const params=new URLSearchParams(location.search);
  const VIDEO=params.has('video');
  if(VIDEO)wt.classList.add('video');

  /* ---------- Bridge to the prototype ---------- */
  let msgId=0,ready=false,readyWaiters=[];const pending=new Map();let track={rect:null};
  addEventListener('message',e=>{const m=e.data;if(!m||m.pw!==1||e.source!==frame.contentWindow)return;
    if(m.type==='ready'){ready=true;readyWaiters.splice(0).forEach(f=>f());return}
    if(m.type==='track'){track=m;layoutOverlay();return}
    if(m.re&&pending.has(m.re)){pending.get(m.re)(m.result);pending.delete(m.re)}});
  const whenReady=()=>ready?Promise.resolve():new Promise(r=>readyWaiters.push(r));
  const cmd=(name,...args)=>new Promise(res=>{const id=++msgId;pending.set(id,res);frame.contentWindow.postMessage({pw:1,id,cmd:name,args},'*');setTimeout(()=>{if(pending.has(id)){pending.delete(id);res(null)}},4000)});

  /* ---------- Playback state ---------- */
  class Abort extends Error{}
  let token=0,cur=-1,auto=false,frozen=false,speed=Number(params.get('speed'))===1.5?1.5:1,scriptDone=false,caption='',demoRate=1;
  let resumeWaiters=[],moreOpen=false;
  const log=(ev,extra)=>{if(VIDEO)console.log('WT '+JSON.stringify({ev,t:Math.round(performance.now()),...extra}))};
  const check=t=>{if(t!==token)throw new Abort()};
  const gate=async t=>{check(t);while(frozen){await new Promise(r=>resumeWaiters.push(r));check(t)}};
  const wait=(ms,t)=>new Promise((res,rej)=>{let left=ms/speed,last=performance.now();const iv=setInterval(()=>{if(t!==token){clearInterval(iv);rej(new Abort());return}const now=performance.now();if(!frozen)left-=now-last;last=now;if(left<=0){clearInterval(iv);res()}},40)});
  const until=async(pred,timeout,t)=>{let spent=0;while(true){await gate(t);const q=await cmd('query');check(t);if(q&&pred(q))return q;await wait(140,t);spent+=140;if(spent>timeout)return q}};
  const helper=t=>({
    reset:async(profile,prefs)=>{await gate(t);await cmd('reset',{profile,prefs});await cmd('playback',{hold:1,speed,rate:speed,frozen:false});demoRate=1;check(t)},
    cmd:async(n,...a)=>{await gate(t);const r=await cmd(n,...a);check(t);return r},
    click:async spec=>{await gate(t);const r=await cmd('click',spec);check(t);return r},
    hl:async(spec,text)=>{await gate(t);caption=spec?text||'':'';renderNow();const r=await cmd('highlight',spec);check(t);return r},
    wait:ms=>wait(ms,t),
    until:(pred,timeout=10000)=>until(pred,timeout,t),
    rate:async r=>{demoRate=r;await cmd('playback',{rate:r*speed});check(t)},
    playback:async o=>{await cmd('playback',o);check(t)}
  });
  const sendSpeed=()=>cmd('playback',{speed,rate:demoRate*speed});
  const setFrozen=f=>{frozen=f;cmd('playback',{frozen:f});if(!f)resumeWaiters.splice(0).forEach(r=>r());updateButtons()};

  /* ---------- Step navigation ---------- */
  const flowOf=i=>STEPS[i].chapter==='learn'?'learn':'main';
  const flowSteps=i=>STEPS.map((s,k)=>k).filter(k=>flowOf(k)===flowOf(i));
  function goto(i,{manual=false,fresh=true}={}){
    if(i<0||i>=STEPS.length)return;
    token++;const t=token;cur=i;scriptDone=false;caption='';
    if(manual)auto=false;
    frozen=false;resumeWaiters.splice(0).forEach(r=>r());cmd('playback',{frozen:false});
    hideCards();renderPanel();renderProgress();updateButtons();cmd('highlight',null);
    log('step',{id:STEPS[i].id,num:STEPS[i].num});
    const s=STEPS[i],d=helper(t);
    (async()=>{try{
      if(fresh)await s.prepare(d);
      await s.run(d);scriptDone=true;updateButtons();
      if(auto){await wait(900,t);advance()}
    }catch(e){if(!(e instanceof Abort))console.error(e)}})();
  }
  function advance(){const f=flowSteps(cur),k=f.indexOf(cur);if(k<f.length-1){const n=f[k+1];goto(n,{fresh:!STEPS[n].continues})}else showSummary(flowOf(cur))}
  const next=()=>{const f=flowSteps(cur);const k=f.indexOf(cur);if(k<f.length-1)goto(f[k+1],{manual:true});else showSummary(flowOf(cur),true)};
  const prev=()=>{const f=flowSteps(cur);const k=f.indexOf(cur);if(k>0)goto(f[k-1],{manual:true});else goto(cur,{manual:true})};
  const chapterStart=id=>STEPS.findIndex(s=>s.chapter===id);
  function play(){
    if(!$('card-intro').hidden){start();return}
    if(!$('card-summary').hidden){restart(summaryFlow);return}
    if(frozen){auto=true;setFrozen(false);if(scriptDone)advance();return}
    if(auto){setFrozen(true);return}
    auto=true;updateButtons();if(scriptDone)advance();
  }
  function start(chapter){hideCards();auto=true;goto(chapter?chapterStart(chapter):0,{fresh:true})}
  function restart(flow){token++;auto=true;goto(flow==='learn'?chapterStart('learn'):0,{fresh:true})}

  /* ---------- Rendering ---------- */
  const chapterOf=s=>CHAPTERS.find(c=>c.id===s.chapter);
  function renderPanel(){const s=STEPS[cur],c=chapterOf(s);
    panel.style.animation='none';void panel.offsetWidth;panel.style.animation='';
    panel.innerHTML=`
      <div class="p-head" id="p-head"><span class="p-badge" id="p-anchor">${s.num}</span><div><div class="p-chapter">${c.short} · ${c.title}</div><h2>${s.name}</h2></div></div>
      <p class="p-what">${s.now}</p>
      <div class="p-insight"><span class="ins-k">Systems-thinking insight</span><p>${s.insight}</p></div>
      <div class="p-now" id="p-now"><span class="dotn">${s.num}</span><span id="p-caption">${caption||'Setting up the phone…'}</span></div>
      ${s.note?`<p class="p-note">${s.note}</p>`:''}
      <details class="p-more" id="p-more"${moreOpen?' open':''}><summary>Explore further <span>design rationale and systems thinking</span></summary><div class="p-more-body">
        <div class="p-labels"><span class="sys-label">◎ ${s.label}</span><span class="sys-label loop-tag">${s.loop} · ${LOOPS.find(l=>l.id===s.loop).name}</span></div>
        <div class="p-sec"><h3>On the phone</h3><p>${s.phone}</p></div>
        <div class="p-sec"><h3>What the user experiences</h3><p>${s.user}</p></div>
        <div class="p-sec"><h3>Why this intervention</h3><p>${s.why}</p></div>
        <div class="p-sec sys"><h3>Systems-thinking link</h3><p>${s.systems}</p></div>
      </div></details>`;
    $('p-more').addEventListener('toggle',e=>{moreOpen=e.target.open;layoutOverlay()});
    document.querySelectorAll('[data-int]').forEach(el=>el.classList.toggle('on',Number(el.dataset.int)===c.intervention));
    document.querySelectorAll('.loop').forEach(el=>el.classList.toggle('on',el.dataset.id===s.loop));
    $('chapter').value=s.chapter;
    $('panel').scrollTop=0;
  }
  function renderNow(){const el=$('p-caption');if(el)el.textContent=caption||'…'}
  function renderProgress(){const box=$('progress');
    box.innerHTML=CHAPTERS.map(c=>`<div class="pg-chap"><small>${c.short}</small>${STEPS.map((s,i)=>s.chapter!==c.id?'':`<button class="pg${i===cur?' on':''}${flowOf(i)===flowOf(Math.max(cur,0))&&i<cur?' done':''}" data-step="${i}" role="tab" aria-selected="${i===cur}" title="${s.num} · ${s.name}">${s.num}</button>`).join('')}</div>`).join('');
    const on=box.querySelector('.pg.on');if(on)on.scrollIntoView({inline:'center',block:'nearest'});}
  function updateButtons(){const b=$('btn-play');const playing=auto&&!frozen&&$('card-intro').hidden&&$('card-summary').hidden;
    b.textContent=playing?'❚❚':'▶';b.setAttribute('aria-label',playing?'Pause':'Play');b.title=playing?'Pause (Space)':'Play (Space)'}
  function setOverview(open){if(wt.classList.contains('ov-collapsed')!==open)return;wt.classList.toggle('ov-collapsed',!open);$('ov-toggle').setAttribute('aria-expanded',open);setTimeout(layout,380)}
  function renderOverview(){$('ov-loops').innerHTML='<h3>Systems view</h3>'+LOOPS.map(l=>`<div class="loop" data-id="${l.id}"><span class="tag">${l.id}</span><span><b>${l.name}.</b> ${l.text}</span></div>`).join('')}
  function fillChapters(){$('chapter').innerHTML=CHAPTERS.map(c=>`<option value="${c.id}">${c.short} · ${c.title}</option>`).join('')}

  /* ---------- Phone scaling and highlight overlay ---------- */
  function layout(){const st=stage.getBoundingClientRect();const mobile=innerWidth<=900;
    const s=Math.max(.35,Math.min(mobile?1:1.22,(st.height-(mobile?16:40))/840,(st.width-(mobile?16:40))/404));
    wrap.style.transform=`scale(${s})`;wrap.style.margin=`${(840*s-840)/2}px ${(404*s-404)/2}px`;layoutOverlay()}
  function layoutOverlay(){
    const clip=$('hl-clip'),box=$('hl-box'),bub=$('hl-bubble'),line=$('hl-line');
    const fr=frame.getBoundingClientRect(),k=fr.width/frame.offsetWidth;
    const r=track.rect;const cardUp=!$('card-intro').hidden||!$('card-summary').hidden;
    if(!r||cardUp||cur<0){clip.classList.remove('on');bub.classList.remove('on');line.classList.remove('on');return}
    Object.assign(clip.style,{left:fr.left+'px',top:fr.top+'px',width:fr.width+'px',height:fr.height+'px',borderRadius:(35*k)+'px'});
    const pad=6;const x=r[0]*k-pad,y=r[1]*k-pad,w=r[2]*k+pad*2,h=r[3]*k+pad*2;
    Object.assign(box.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
    clip.classList.add('on');
    const mobile=innerWidth<=900;
    let bx=fr.left+Math.min(x+w+22,fr.width+26),by=fr.top+Math.max(18,Math.min(fr.height-18,y+h/2));
    if(mobile){bx=fr.left+Math.max(14,Math.min(x+w,fr.width-14));by=fr.top+Math.max(14,y-2)}
    bub.style.left=bx+'px';bub.style.top=by+'px';bub.textContent=STEPS[cur].num;bub.classList.add('on');
    const a=$('p-anchor');
    if(a&&!mobile){const ar=a.getBoundingClientRect();const ax=ar.left-6,ay=ar.top+ar.height/2;const sx=bx+19,sy=by;const mx=(sx+ax)/2;
      $('hl-path').setAttribute('d',`M${sx},${sy} C${mx},${sy} ${mx},${ay} ${ax},${ay}`);$('hl-dot').setAttribute('cx',ax);$('hl-dot').setAttribute('cy',ay);line.classList.add('on')}
    else line.classList.remove('on');
  }

  /* ---------- Title and summary cards ---------- */
  let summaryFlow='main';
  function hideCards(){$('card-intro').hidden=true;$('card-summary').hidden=true;layoutOverlay()}
  function showSummary(flow,manual){summaryFlow=flow;if(manual)auto=false;token++;cmd('highlight',null);
    const body=$('summary-body');
    body.innerHTML=flow==='learn'?`
      <span class="logo big">pause<i>.</i></span><h1>One detour,<br/><i>then done.</i></h1>
      <div class="sum-grid">
        <div><b>Personalised from what users choose to share</b>Travel plans, interests and study or work, entered voluntarily, select one short, source-linked card.</div>
        <div><b>Optional depth</b>A collapsed quick question and thumbs-up or thumbs-down feedback. Neither is required.</div>
        <div><b>A clean ending</b>“Done for now” returns home. No completion screen, next card or extra suggestion.</div>
        <div><b>Honest about data</b>Cards are curated demo content, not live AI. Instagram-based interests are simulated; there is no Instagram connection.</div>
      </div>
      <p class="sum-note">Prototype demonstration. Effects on behaviour have not yet been evaluated.</p>
      <div class="card-ints"><button class="card-btn" data-card="restart-learn">↺ Watch again</button><button class="card-btn alt" data-card="main">Main walkthrough</button><a class="card-btn alt" href="index.html" style="display:inline-flex;align-items:center;text-decoration:none">Try Pause</a></div>`:`
      <span class="logo big">pause<i>.</i></span><h1>Scroll on purpose.<br/><i>Stop by choice.</i></h1>
      <div class="sum-grid">
        <div><b>01 · Purpose Sessions</b>A five-second pause, three commitments (purpose, finish line, next step), a visible Reel counter and a mid-session purpose reminder.</div>
        <div><b>02 · Reward the Exit</b>Autoplay stops at the finish line, two optional +3 extensions with grayscale (35→65%, 70→100%), then Reels off while posts and DMs remain.</div>
        <div><b>Systems view</b>Both interventions add balancing feedback to the reinforcing scrolling loop: at entry (awareness and a goal) and during use (visibility, stopping points, rising friction).</div>
        <div><b>A meaningful exit</b>One optional, personalised alternative. No points, streaks or badges: ending the session deliberately is the reward.</div>
      </div>
      <p class="sum-note">Prototype demonstration with simulated Instagram screens. Effects on behaviour have not yet been evaluated.</p>
      <div class="card-ints"><button class="card-btn" data-card="restart-main">↺ Restart</button><button class="card-btn alt" data-card="learn">Optional: personalised learning</button><a class="card-btn alt" href="index.html" style="display:inline-flex;align-items:center;text-decoration:none">Try Pause</a></div>`;
    $('card-summary').hidden=false;layoutOverlay();updateButtons();renderProgress();log('summary',{flow});
  }
  $('card-summary').addEventListener('click',e=>{const b=e.target.closest('[data-card]');if(!b)return;const a=b.dataset.card;
    if(a==='restart-main'||a==='main')restart('main');else start('learn')});
  $('intro-start').addEventListener('click',()=>start());

  /* ---------- Controls ---------- */
  $('btn-play').addEventListener('click',play);
  $('btn-next').addEventListener('click',()=>{if(cur<0){start();return}next()});
  $('btn-prev').addEventListener('click',()=>{if(cur<0)return;prev()});
  $('btn-restart').addEventListener('click',()=>restart(cur>=0?flowOf(cur):'main'));
  $('chapter').addEventListener('change',e=>goto(chapterStart(e.target.value),{manual:true}));
  $('progress').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)goto(Number(b.dataset.step),{manual:true})});
  document.querySelectorAll('.spd').forEach(b=>b.addEventListener('click',()=>{speed=Number(b.dataset.speed);document.querySelectorAll('.spd').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});sendSpeed()}));
  const toggleOverview=()=>setOverview(wt.classList.contains('ov-collapsed'));
  $('ov-toggle').addEventListener('click',toggleOverview);
  document.querySelector('.ov-rail').addEventListener('click',()=>setOverview(true));
  $('panel').addEventListener('click',e=>{if(innerWidth<=900&&e.target.closest('.p-head'))wt.classList.toggle('sheet-min')});
  document.addEventListener('keydown',e=>{if(e.target.closest('select')||e.altKey||e.ctrlKey||e.metaKey)return;
    const k=e.key;
    if(k===' '||k==='k'){e.preventDefault();play()}
    else if(k==='ArrowRight'){e.preventDefault();if(cur<0)start();else next()}
    else if(k==='ArrowLeft'){e.preventDefault();if(cur>=0)prev()}
    else if(k==='r'||k==='R')restart(cur>=0?flowOf(cur):'main');
    else if(k==='Escape')location.href='index.html';
    else if(k==='o'||k==='O')toggleOverview();
    else if(k==='1'||k==='2'||k==='3')goto(chapterStart(CHAPTERS[Number(k)-1].id),{manual:true});
  });
  addEventListener('resize',layout);
  new ResizeObserver(layout).observe(stage);
  $('panel').addEventListener('scroll',layoutOverlay);

  /* ---------- Start ---------- */
  renderOverview();fillChapters();
  if(VIDEO)wt.classList.add('ov-collapsed');
  if(speed===1.5)document.querySelectorAll('.spd').forEach(x=>{x.classList.toggle('on',x.dataset.speed==='1.5');x.setAttribute('aria-pressed',x.dataset.speed==='1.5')});
  layout();renderProgress();
  whenReady().then(async()=>{await sendSpeed();
    const stepId=params.get('step'),chap=params.get('chapter');
    if(stepId&&STEPS.some(s=>s.id===stepId||s.num===stepId)){goto(STEPS.findIndex(s=>s.id===stepId||s.num===stepId),{manual:!params.has('autoplay')});if(params.has('autoplay'))auto=true;updateButtons();return}
    if(VIDEO){if(chap==='learn'){document.querySelector('#card-intro h1').innerHTML='Learning instead<br/><i>of scrolling.</i>';document.querySelector('#card-intro .card-body > p').textContent='Optional chapter: a personalised learning detour after the five-second pause, and a clean exit straight back home.'}$('card-intro').hidden=false;log('intro');await new Promise(r=>setTimeout(r,Number(params.get('intro'))||5500));start(chap==='learn'?'learn':undefined);return}
    if(params.has('autoplay')){start(chap==='learn'?'learn':undefined);return}
    if(chap){goto(chapterStart(chap),{manual:true});return}
    $('card-intro').hidden=false;updateButtons();
  });
  window.__wt={get:()=>({cur,step:cur>=0?STEPS[cur].id:null,auto,frozen,speed,scriptDone,summary:!$('card-summary').hidden,intro:!$('card-intro').hidden,track}),goto:(i)=>goto(i,{manual:true}),play,next,prev,restart};
})();
