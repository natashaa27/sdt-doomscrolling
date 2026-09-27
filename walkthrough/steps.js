/* Pause walkthrough: chapters, steps and explanations.
   Edit the text here. Each step has:
     now / insight  what the panel shows first: a short description and one systems-thinking insight
     phone, user, why, systems  the detail under “Explore further” (collapsed by default)
     prepare(d)  puts the real prototype into a known starting state (used when jumping to a step)
     run(d)      the scripted demonstration; d.click() presses real buttons in the prototype
     continues   true when the previous step already ends in this step's starting state,
                 so automatic playback does not reset the phone between them
   d.hl(target, caption) moves the numbered highlight. Targets are CSS selectors inside the
   prototype, {sel, closest} or {union:[...]}. Keep one highlight at a time. */
(function(){
  /* Sample users. They exist only in the walkthrough's in-memory storage, never in the visitor's saved data. */
  const MAIN_USER={planned:['rome'],interests:['history'],onboarded:true};
  const LEARN_USER={planned:['rome'],interests:['history'],fieldOther:['Business student'],onboarded:true};
  /* Commitments start on other answers so the walkthrough visibly selects the representative ones. */
  const START_PREFS={reason:'habit',limit:'10',after:'read',grayscale:true};
  const CHOSEN={reason:'break',limit:'5',after:'learn',grayscale:true};

  const atCheckpoint=(o)=>({screen:'checkpoint',noticeShown:true,notice:false,progress:0,sessionStart:Date.now(),...o});

  const CHAPTERS=[
    {id:'purpose',title:'Purpose Sessions',short:'Chapter 1',intervention:1},
    {id:'exit',title:'Reward the Exit',short:'Chapter 2',intervention:2},
    {id:'learn',title:'Personalised Learning',short:'Optional',intervention:1}
  ];

  const STEPS=[
  /* ---------------- Chapter 1: Purpose Sessions ---------------- */
  {id:'pause',chapter:'purpose',num:'1',name:'The five-second pause',label:'Trigger Awareness',loop:'B1',
   now:'Tapping Instagram opens a five-second breathing pause, then three choices: continue, learn something, or leave.',
   insight:'A delay at the entry point weakens the trigger → open app link in the reinforcing loop.',
   phone:'Tapping Instagram opens Pause first. A breathing circle counts down five seconds, then three options become available: continue to the feed, learn something instead, or leave.',
   user:'A short, calm delay between the impulse to open the app and the feed itself. Nothing is blocked, and leaving is always one tap away.',
   why:'Opening social media is often a cue-driven habit rather than a deliberate decision. A brief interruption is intended to create a moment in which the user can notice the trigger and reconsider, without the frustration of a hard block.',
   systems:'Acts on the entry point of the reinforcing scrolling loop (trigger → open app → reward). The pause inserts a delay and a decision point where awareness can weaken the automatic link.',
   say:'Pause begins before the feed does. When the user taps Instagram, a five-second breathing pause appears, followed by three choices: continue, learn something instead, or leave. The aim is to turn an automatic tap into a conscious decision.',
   async prepare(d){await d.reset(MAIN_USER,START_PREFS)},
   async run(d){
     await d.hl({sel:'[data-action="open"]'},'The Instagram icon on the home screen');await d.wait(2200);
     await d.click('[data-action="open"]');await d.wait(500);
     await d.hl('.breath-orbit','Five-second breathing countdown');
     await d.until(q=>q.countdown<=0,9000);await d.wait(900);
     await d.hl({union:['[data-action="purpose"]','[data-action="learn"]','.inner > [data-action="go-home"]']},'Continue, learn something instead, or leave');
     await d.wait(4200);
     await d.click('[data-action="purpose"]');await d.wait(700);
   }},
  {id:'commit',chapter:'purpose',num:'2',name:'Three commitment rules',label:'Intentional Choice',loop:'B1',continues:true,
   now:'The user sets a purpose (a short break), a finish line (5 Reels) and a next step (learn one thing).',
   insight:'A stated goal gives the system a reference point that later feedback can compare against.',
   phone:'The walkthrough selects a representative user’s commitments: purpose “Take a short break”, finish line “5 Reels”, and afterwards “Learn one thing”. This sample user is planning a trip to Rome.',
   user:'Three quick taps set a reason, a boundary and a plan for what comes next. The answers are remembered and can be changed at any time.',
   why:'Stating a purpose, a limit and a next action in advance resembles an implementation intention. Deciding where to stop before scrolling starts means the user does not have to make that decision later, when absorbed.',
   systems:'Introduces an explicit goal into the system. Later interventions compare actual use against this goal, which is the basis of a balancing feedback loop.',
   say:'Next, the user makes three small commitments: why they are here, where they will stop, and what they might do afterwards. Here the user wants a short break, sets a finish line of five Reels, and plans to learn one thing.',
   async prepare(d){await d.reset(MAIN_USER,START_PREFS);await d.cmd('set',{screen:'setup',countdown:0})},
   async run(d){
     await d.hl({sel:'[data-set="reason"][data-value="break"]',closest:'.rule-card'},'Rule 1 · Why am I here?');await d.wait(1300);
     await d.click('[data-set="reason"][data-value="break"]');await d.wait(2200);
     await d.hl({sel:'[data-set="limit"][data-value="5"]',closest:'.rule-card'},'Rule 2 · Finish line');await d.wait(1300);
     await d.click('[data-set="limit"][data-value="5"]');await d.wait(2200);
     await d.hl({sel:'[data-set="after"][data-value="learn"]',closest:'.rule-card'},'Rule 3 · What I might do afterwards');await d.wait(1300);
     await d.click('[data-set="after"][data-value="learn"]');await d.wait(3000);
   }},
  {id:'feed',chapter:'purpose',num:'3',name:'Entering the feed',label:'Feedback',loop:'B2',continues:true,
   now:'Reels play at demonstration speed. The counter shows Reels watched against the finish line, and time spent.',
   insight:'Making the stock of content consumed visible closes an information gap in the loop.',
   phone:'The session starts in a simulated Reels feed. The walkthrough advances Reels at an accelerated speed. The counter shows Reels watched against the finish line, plus elapsed time.',
   user:'The feed looks familiar, but consumption is now visible, for example “2 / 5 Reels · 0:14”.',
   why:'Infinite feeds remove natural cues about how much has been consumed. Making quantity and time visible is intended to restore a reference point the user can act on.',
   systems:'Adds an information flow from the stock of content consumed back to the user, so the gap between the goal and actual use becomes observable.',
   say:'The session opens in a simulated Reels feed. A counter at the top keeps consumption visible: Reels watched against the finish line, and time spent.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('set',{screen:'setup',countdown:0})},
   async run(d){
     await d.hl('[data-action="start-feed"]','Start my session');await d.wait(1500);
     await d.click('[data-action="start-feed"]');await d.rate(4);await d.wait(400);
     await d.hl('#feed-count','Reel counter and time');
     await d.until(q=>q.views>=2,9000);await d.rate(0.5);await d.wait(6500);
   }},
  {id:'reminder',chapter:'purpose',num:'4',name:'Purpose reminder',label:'Intentional Choice',loop:'B1',continues:true,
   now:'At Reel 3 of 5, a short banner repeats the user’s own purpose, then fades.',
   insight:'Re-inserting the goal mid-session shortens the delay before drift is noticed.',
   phone:'Halfway to the finish line (Reel 3 of 5), a short banner appears: “You came here to take a short break. Still what you want to do?” It disappears on its own after a few seconds.',
   user:'A light prompt, not a lock. The user can ignore it, dismiss it, or tap Finish at any time.',
   why:'During absorbed scrolling, the original intention tends to fade. A timely reminder is designed to bring it back into awareness at little cost to autonomy.',
   systems:'Re-inserts the goal mid-session, shortening the delay between drifting away from the purpose and noticing it.',
   say:'Halfway to the finish line, a brief reminder repeats the user’s own purpose. It does not lock the phone; it simply brings the original intention back into view.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('begin');await d.cmd('set',{views:2,progress:55});},
   async run(d){
     await d.playback({hold:2});await d.rate(3);
     await d.until(q=>q.notice,9000);await d.rate(0.35);await d.wait(300);
     await d.hl('.feed-nudge','Purpose reminder');await d.wait(6500);
     await d.hl('.reel-finish','Finish is always available');await d.wait(2200);
   }},
  /* ---------------- Chapter 2: Reward the Exit ---------------- */
  {id:'finishline',chapter:'exit',num:'5',name:'The first finish line',label:'Automatic Scrolling Interruption',loop:'B2',
   now:'At Reel 5, autoplay stops. The user chooses: finish, or three more Reels.',
   insight:'At the goal, the balancing loop closes: a continuous flow becomes a deliberate decision.',
   phone:'At Reel 5 the progress bar completes and autoplay stops. Instead of the next Reel, a checkpoint shows the user’s intention, Reels watched and time, with two options: finish or take three more Reels.',
   user:'A natural stopping point. Continuing is still possible, but it now requires an active choice.',
   why:'Autoplay and infinite scroll remove stopping cues, so continuing becomes the default. Replacing that default with a decision is intended to interrupt automatic scrolling while respecting autonomy.',
   systems:'Turns a continuous flow into discrete decisions. When the goal is reached, the balancing loop closes and hands control back to the user.',
   say:'At the fifth Reel, autoplay stops. Instead of another video, the user reaches a finish line and chooses: end the session, or consciously take three more Reels.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('begin');await d.cmd('set',{views:4,progress:50,noticeShown:true,elapsed:24})},
   async run(d){
     await d.playback({hold:1});await d.rate(3);
     await d.hl('#feed-count','Approaching the finish line');
     await d.until(q=>q.views>=5,9000);await d.hl('.reel-bar','Last Reel before the finish line');
     await d.until(q=>q.screen==='checkpoint',9000);await d.wait(600);
     await d.hl('.card','The original intention and what has been consumed');await d.wait(3800);
     await d.hl('[data-action="finish"]','Option 1 · Finish the session');await d.wait(2800);
     await d.hl('[data-action="continue"]','Option 2 · Three more Reels, by choice');await d.wait(3000);
   }},
  {id:'extra1',chapter:'exit',num:'6',name:'First extension: grayscale begins',label:'Automatic Scrolling Interruption',loop:'B2',continues:true,
   now:'Three more Reels. Grayscale starts at 35% and deepens to 65%.',
   insight:'Each Reel past the goal weakens the reward signal that drives the reinforcing loop.',
   phone:'The user chooses three more Reels. Grayscale starts immediately at 35% and deepens with each Reel, reaching 65% by the end of this portion. The indicator beside the phone shows the current level.',
   user:'Scrolling continues, but the feed gradually looks less vivid. The counter reads “Extra 1 of 3”.',
   why:'Colour contributes to the visual appeal of feeds. Reducing it gradually is intended to make continued scrolling feel less rewarding and more noticeable, rather than stopping it abruptly.',
   systems:'Weakens the reinforcing reward signal step by step: the further use overshoots the goal, the weaker the stimulus.',
   say:'If the user continues, grayscale begins straight away at thirty-five percent and deepens with every Reel, to sixty-five percent. The feed still works, but it becomes less vivid.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('set',atCheckpoint({views:5,checkpoint:5,extraRounds:0,elapsed:35}))},
   async run(d){
     await d.hl('[data-action="continue"]','+3 more Reels (first extra portion)');await d.wait(1600);
     await d.click('[data-action="continue"]');await d.rate(1.6);await d.wait(300);
     await d.hl('#feed-count','Extra Reel counter with grayscale level');
     await d.until(q=>q.screen==='checkpoint',20000);await d.wait(700);
     await d.hl('.round-indicators','1 of 2 extensions used');await d.wait(3000);
   }},
  {id:'extra2',chapter:'exit',num:'7',name:'Second and final extension',label:'Feedback',loop:'B2',continues:true,
   now:'The last +3 starts at 70% grayscale and ends fully gray. Both extensions are now used.',
   insight:'Capping extensions prevents “drifting goals”, where the limit quietly keeps moving.',
   phone:'At the next checkpoint the user takes the last +3. Grayscale now starts at 70% and reaches 100%. After the final Reel, the checkpoint shows that both extensions have been used.',
   user:'The feed is almost colourless, and the user can see that this was the last optional portion.',
   why:'A small, fixed number of extensions gives flexibility without making the boundary meaningless. Showing that both have been used makes the remaining allowance explicit.',
   systems:'Caps how often the goal can be overridden, which protects against a “drifting goals” pattern where the limit quietly keeps moving.',
   say:'The second and final extension starts at seventy percent grayscale and fades to fully gray. After the last Reel, both optional extensions have been used.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('set',atCheckpoint({views:8,checkpoint:8,extraRounds:1,extraRoundStart:6,elapsed:51}))},
   async run(d){
     await d.hl('[data-action="continue"]','+3 more Reels (last extra portion)');await d.wait(1600);
     await d.click('[data-action="continue"]');await d.rate(1.6);await d.wait(300);
     await d.hl('#feed-count','Grayscale from 70% to 100%');
     await d.until(q=>q.screen==='checkpoint',20000);await d.wait(700);
     await d.hl('.round-indicators','2 of 2 extensions used');await d.wait(3600);
   }},
  {id:'protected',chapter:'exit',num:'8',name:'Protected Instagram mode',label:'Environment Redesign',loop:'B2',continues:true,
   now:'No more extensions. Reels are off in the simulated Instagram; posts and DMs still work.',
   insight:'Changing the structure removes the loop’s main flow instead of relying on willpower.',
   phone:'No further extension is offered. The simulated Instagram opens with the Reels tab disabled, while posts from followed accounts and Direct Messages remain available.',
   user:'The user can still check posts and reply to friends; only the endless Reels feature is switched off for this session.',
   why:'Blocking a whole platform can feel punitive and may encourage workarounds. Targeting only the most absorbing feature aims to remove the main source of automatic scrolling while preserving social connection.',
   systems:'Changes the structure of the system rather than relying on willpower: the main reinforcing flow (short-form video) is removed for the rest of the session.',
   note:'Simulated Instagram. This prototype cannot change the real Instagram app; real restrictions would need a compatible browser or browser extension.',
   say:'With both extensions used, there is no further plus-three option. In this simulated Instagram, the Reels tab is disabled, but the regular feed and direct messages still work. The intervention targets the distracting feature, not the whole platform.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('set',atCheckpoint({views:11,checkpoint:11,extraRounds:2,extraRoundStart:9,reelsDisabled:true,elapsed:66}))},
   async run(d){
     await d.hl({union:['[data-action="protected-feed"]','.inner > [data-action="protected-dms"]','.inner > [data-action="finish"]']},'No +3 option: feed, DMs or finish');await d.wait(3400);
     await d.click('[data-action="protected-feed"]');await d.wait(800);
     await d.hl('.ig-tabbar button[disabled]','Reels tab disabled');await d.wait(3400);
     await d.hl('.ig-note','Labelled as simulated');await d.wait(2600);
     await d.hl('.ig-post','Regular posts still available');await d.wait(2400);
     await d.click('.ig-top [data-action="protected-dms"]');await d.wait(700);
     await d.hl({union:['.dm-row']},'Direct Messages still available');await d.wait(3000);
   }},
  {id:'alternative',chapter:'exit',num:'9',name:'A personalised alternative',label:'Positive Behavioural Reinforcement',loop:'B2',
   now:'On finishing, Pause offers one optional, personalised idea: here, an Italian phrase for the Rome trip.',
   insight:'A competing, positive flow away from the feed makes leaving the easier path.',
   phone:'When the user finishes, Pause shows Reels watched and time, then one optional idea based on their commitments and profile, labelled with the time it takes. “Another idea” swaps it; here it offers an Italian phrase for the Rome trip.',
   user:'Leaving comes with something meaningful to do, but nothing is required: “I’m done for now” ends the session straight away. There are no points, streaks or badges.',
   why:'Leaving a feed is easier when there is an attractive next action. A single personalised suggestion is intended to fill the gap left by scrolling without becoming another feed.',
   systems:'Adds a competing, positive flow away from the platform. Ending the session deliberately becomes the behaviour that is reinforced.',
   say:'When the user finishes, Pause offers one optional, personalised idea. For this user, planning a trip to Rome, that can be a useful Italian phrase. They can try it, ask for another idea, or simply finish. Ending the session is the reward.',
   async prepare(d){await d.reset(MAIN_USER,CHOSEN);await d.cmd('set',atCheckpoint({views:11,checkpoint:11,extraRounds:2,extraRoundStart:9,reelsDisabled:true,elapsed:66}))},
   async run(d){
     await d.hl('.inner > [data-action="finish"]','Finish my session');await d.wait(1500);
     await d.click('.inner > [data-action="finish"]');await d.wait(700);
     await d.hl('.stat-grid','What the session cost, made visible');await d.wait(2600);
     await d.hl('.idea','One personalised, optional idea');await d.wait(3000);
     for(let i=0;i<5&&!(await d.cmd('exists',{sel:'[data-action="do-idea"][data-id="phrase"]'}));i++){await d.click('[data-action="next-idea"]');await d.wait(900)}
     await d.wait(1200);await d.click('[data-action="do-idea"]');await d.wait(600);
     await d.hl('.phrase','A phrase for the upcoming trip');await d.wait(3400);
     await d.hl('.inner > [data-action="go-home"]','Finish immediately');await d.wait(3200);
   }},
  /* ---------------- Optional chapter: Personalised learning ---------------- */
  {id:'learn-choose',chapter:'learn',num:'L1',name:'Choosing to learn instead',label:'Intentional Choice',loop:'B1',
   now:'A sample user planning a Rome trip, interested in history and studying business, chooses to learn instead.',
   insight:'Redirecting the trigger into a finite flow means the scrolling loop is never entered.',
   phone:'This sample user has told Pause that they are planning to visit Rome, are interested in history and study business (shown under My Interests). After the pause, they choose “Learn something instead”.',
   user:'A worthwhile alternative is offered at the moment of the urge, before any Reels are seen.',
   why:'Replacing a habit is often easier than suppressing it. The detour offers a short activity with a similar appeal of quick novelty, but with a clear end.',
   systems:'Redirects the trigger into a different, finite flow, so the reinforcing scrolling loop is not entered at all.',
   say:'In the optional learning path, the user chooses to learn something instead of scrolling. Pause already knows a little about them, because they told it: a trip to Rome, an interest in history, and business studies.',
   async prepare(d){await d.reset(LEARN_USER,CHOSEN)},
   async run(d){
     await d.hl('.ph-interests','Interests the user entered themselves');await d.wait(3400);
     await d.click('[data-action="open"]');await d.wait(600);
     await d.hl('[data-action="learn"]','Learn something instead');await d.wait(2800);
     await d.click('[data-action="learn"]');await d.wait(700);
   }},
  {id:'learn-card',chapter:'learn',num:'L2',name:'One personalised card',label:'Personalisation',loop:'B1',continues:true,
   now:'One card chosen from the user’s own profile: an image, a question, about 50 words and a source.',
   insight:'Self-reported interests strengthen the alternative flow without harvesting behavioural data.',
   phone:'Pause picks one card from the voluntary profile, labelled “Because you’re planning to visit Rome”. It has an image, a question-style title, about 50 words of explanation and a source link.',
   user:'One short, relevant card that can be read in under a minute.',
   why:'Relevance based on interests, profession and travel plans that the user supplied voluntarily is intended to make the alternative attractive. Cards are curated and source-linked, not live AI output.',
   systems:'Uses information the user chose to share to strengthen the alternative flow, without harvesting behavioural data.',
   note:'Instagram-derived interests are simulated. The prototype does not connect to Instagram and never asks for a password.',
   say:'Pause shows one short card, chosen because the user is planning to visit Rome. It has an image, a short explanation and a source. The content is curated, not generated live.',
   async prepare(d){await d.reset(LEARN_USER,CHOSEN);await d.cmd('open');await d.wait(300);await d.click('[data-action="learn"]');await d.wait(500)},
   async run(d){
     await d.hl('.lcard-why','Why this card was chosen');await d.wait(3000);
     await d.hl({union:['.lcard-art','.lcard-img']},'Image');await d.wait(1800);
     await d.hl({union:['.lcard h3','.lcard-text']},'Question-style title and short explanation');await d.wait(4200);
     await d.hl('.lcard-src','Source link');await d.wait(2400);
   }},
  {id:'learn-done',chapter:'learn',num:'L3',name:'Optional quiz, feedback and a clean exit',label:'Positive Behavioural Reinforcement',loop:'B2',continues:true,
   now:'An optional quiz and a thumbs-up, then “Done for now” returns straight home.',
   insight:'A clear endpoint stops the detour from becoming a new reinforcing loop.',
   phone:'The collapsed quick question is opened and answered, then a thumbs-up is given. “Done for now” returns straight to the home screen with a small confirmation.',
   user:'The quiz and feedback are optional; feedback tunes later picks. There is no completion screen, next card or extra suggestion.',
   why:'One meaningful detour per session: chaining activities would recreate the endless-feed pattern. Ending cleanly makes stopping the natural outcome.',
   systems:'Closes the loop with a clear endpoint. Feedback adjusts future relevance (a small learning loop) without increasing time spent.',
   say:'A quick question and thumbs-up feedback are available but optional. When the user taps Done for now, they return straight to the home screen. No completion screen, no next card.',
   async prepare(d){await d.reset(LEARN_USER,CHOSEN);await d.cmd('open');await d.wait(300);await d.click('[data-action="learn"]');await d.wait(500)},
   async run(d){
     await d.hl('.lquiz','Collapsed, optional quick question');await d.wait(1800);
     await d.click('.lquiz summary');await d.wait(900);
     await d.click('[data-action="quiz"][data-i="1"]');await d.wait(1600);
     await d.hl('.thumbs','Optional feedback');await d.wait(1200);
     await d.click('.thumb[data-v="interesting"]');await d.wait(1800);
     await d.hl('[data-action="learn-complete"]','Done for now');await d.wait(2200);
     await d.click('[data-action="learn-complete"]');await d.wait(250);
     await d.hl('#app-toast','Back home, session ended');await d.wait(2600);await d.hl(null);await d.wait(1200);
   }}
  ];

  /* The systems-thinking model shown in the overview. Adjust to match your causal loop diagram. */
  const LOOPS=[
    {id:'R',name:'Automatic scrolling loop',text:'Trigger (boredom, stress, habit) → open app → variable rewards → time slips by → fatigue or guilt → more escape.'},
    {id:'B1',name:'Purpose Sessions',text:'A pause and a stated goal add a deliberate choice before entry.'},
    {id:'B2',name:'Reward the Exit',text:'Visible use, stopping points and rising friction make leaving easier.'}
  ];

  window.WALKTHROUGH={CHAPTERS,STEPS,LOOPS};
})();
