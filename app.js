
const defaultGames = [
 {id:1,title:"Royal Slots",icon:"🎰",description:"Animated 5-reel slot machine.",reward:100,enabled:true,gameType:"slots"},
 {id:2,title:"European Roulette",icon:"🎡",description:"Spin the roulette wheel and pick a number or color.",reward:100,enabled:true,gameType:"roulette"},
 {id:3,title:"Blackjack 21",icon:"🃏",description:"Deal cards and try to beat the dealer.",reward:100,enabled:true,gameType:"blackjack"},
 {id:4,title:"Baccarat",icon:"♠️",description:"Choose Player, Banker or Tie in a baccarat table.",reward:100,enabled:true,gameType:"baccarat"},
 {id:5,title:"Video Poker",icon:"🃏",description:"Deal a five-card poker hand.",reward:100,enabled:true,gameType:"videopoker"},
 {id:6,title:"Craps Dice",icon:"🎲",description:"Roll the dice table.",reward:100,enabled:true,gameType:"craps"},
 {id:7,title:"Sic Bo",icon:"🎲",description:"Predict a three-dice result.",reward:100,enabled:true,gameType:"sicbo"},
 {id:8,title:"Hi-Lo Cards",icon:"🔺",description:"Guess whether the next card is higher or lower.",reward:100,enabled:true,gameType:"hilo"},
 {id:9,title:"Dragon Tiger",icon:"🐉",description:"Pick Dragon, Tiger or Tie.",reward:100,enabled:true,gameType:"dragontiger"},
 {id:10,title:"Andar Bahar",icon:"🂡",description:"Choose the side for the matching-card game.",reward:100,enabled:true,gameType:"andarbahar"},
 {id:11,title:"Teen Patti",icon:"♣️",description:"Virtual three-card hand comparison.",reward:100,enabled:true,gameType:"teenpatti"},
 {id:12,title:"Lucky 7",icon:"7️⃣",description:"Pick a virtual lucky seven result.",reward:100,enabled:true,gameType:"lucky7"},
 {id:13,title:"Wheel of Fortune",icon:"🎡",description:"Animated prize wheel with credits.",reward:100,enabled:true,gameType:"wheel"},
 {id:14,title:"Plinko Casino",icon:"🔴",description:"Drop a virtual chip through a Plinko board.",reward:100,enabled:true,gameType:"plinko"},
 {id:15,title:"Keno 10",icon:"🔢",description:"Pick numbers and reveal virtual draws.",reward:100,enabled:true,gameType:"keno"},
 {id:16,title:"Bingo Room",icon:"🎟️",description:"Virtual bingo draw with animated balls.",reward:100,enabled:true,gameType:"bingo"},
 {id:17,title:"Coin Casino",icon:"🪙",description:"Animated heads or tails table.",reward:100,enabled:true,gameType:"coin"},
 {id:18,title:"Red & Black",icon:"♦️",description:"Pick the color of the next card.",reward:100,enabled:true,gameType:"colorcard"},
 {id:19,title:"High Card",icon:"♠️",description:"Draw against the virtual dealer.",reward:100,enabled:true,gameType:"highcard"},
 {id:20,title:"War Table",icon:"⚔️",description:"Fast card battle.",reward:100,enabled:true,gameType:"war"},
 {id:21,title:"Lucky Gems",icon:"💎",description:"Pick a gem from the animated vault.",reward:100,enabled:true,gameType:"gems"},
 {id:22,title:"Treasure Vault",icon:"💰",description:"Choose one of three virtual vaults.",reward:100,enabled:true,gameType:"vault"},
 {id:23,title:"Lucky 3",icon:"🍀",description:"Pick one of three lucky doors.",reward:100,enabled:true,gameType:"lucky3"},
 {id:24,title:"Jackpot Wheel",icon:"🏆",description:"Animated jackpot wheel for credits.",reward:100,enabled:true,gameType:"jackpot"},
 {id:25,title:"3D Neon Spin",icon:"🎰",description:"Immersive 3D virtual casino wheel with animated neon effects.",reward:100,enabled:true,gameType:"3d"},
 {id:26,title:"3D Crash Airplane",icon:"✈️",description:"3D virtual airplane flight with rising multiplier and crash animation.",reward:100,enabled:true,gameType:"crash3d"}
];

let games = JSON.parse(localStorage.getItem("arcadeGames") || "null") || defaultGames;
async function loadSharedPublicData(){
 try{const d=await SharedData.public(); if(Array.isArray(d.games)&&d.games.length){games=d.games;localStorage.setItem("arcadeGames",JSON.stringify(games));renderGames?.();} if(d.settings?.depositNumbers){depositNumbers=d.settings.depositNumbers;localStorage.setItem("eliasDepositNumbers",JSON.stringify(depositNumbers));} if(d.settings?.withdrawNumbers){withdrawNumbers=d.settings.withdrawNumbers;localStorage.setItem("eliasWithdrawNumbers",JSON.stringify(withdrawNumbers));}}catch(e){console.warn("Shared backend unavailable; using local cache.",e.message)}
}
window.addEventListener("DOMContentLoaded",()=>loadSharedPublicData());
let coins = Number(localStorage.getItem("arcadeCoins") || 0);
games = games.map(g => ({...g, gameType: g.gameType || "placeholder", icon: g.icon || "🎮"}));

function save(){
 localStorage.setItem("arcadeGames",JSON.stringify(games));
 localStorage.setItem("arcadeCoins",coins);
 document.querySelectorAll("#coinBalance,#homeCoins").forEach(x=>x.textContent=coins);
}
function showPage(id){
 // All main site pages require an authenticated user. Login/Sign Up stay public.
 const publicPages = new Set(["login","signup"]);
 const sessionId = localStorage.getItem("eliasCasinoCurrentUser");
 if(!publicPages.has(id) && !sessionId){
  id = "login";
  const msg = document.getElementById("loginMsg");
  if(msg) msg.textContent = "🔐 Login or Sign Up first to access the website.";
 }
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 const target=document.getElementById(id);
 if(target) target.classList.add("active");
 document.querySelectorAll(".main-nav .nav-item").forEach(b=>b.classList.toggle("active-nav", b.dataset.page===id));
 if(window.innerWidth<=800) closeMenu();
 if(id==="games") renderGames();
 if(id==="admin") 
 if(id==="leaderboard") renderLeaderboard();
 if(id==="wallet") renderWallet();
 if(id==="virtual") renderVirtualPage();
 if(id==="profile" && typeof renderProfile === "function") renderProfile();
 closeMenu();
 window.scrollTo({top:0,behavior:"smooth"});
}
function toggleMenu(){
 const nav=document.getElementById("mainNav");
 const overlay=document.getElementById("menuOverlay");
 const open=!nav.classList.contains("menu-open");
 nav.classList.toggle("menu-open",open);
 overlay.classList.toggle("menu-visible",open);
 nav.setAttribute("aria-hidden", String(!open));
}
function closeMenu(){
 const nav=document.getElementById("mainNav"), overlay=document.getElementById("menuOverlay");
 nav.classList.remove("menu-open");
 overlay.classList.remove("menu-visible");
 nav.setAttribute("aria-hidden","true");
}

// Mobile swipe-only menu: swipe right from the left edge to open, swipe left to close.
let menuTouchStartX=0, menuTouchStartY=0, menuTouchActive=false;
document.addEventListener("touchstart", e=>{
 if(!e.touches || !e.touches[0]) return;
 const t=e.touches[0], nav=document.getElementById("mainNav");
 const isOpen=nav.classList.contains("menu-open");
 menuTouchStartX=t.clientX; menuTouchStartY=t.clientY;
 menuTouchActive = isOpen ? true : (t.clientX <= 28);
},{passive:true});
document.addEventListener("touchend", e=>{
 if(!menuTouchActive || !e.changedTouches || !e.changedTouches[0]) return;
 const t=e.changedTouches[0], dx=t.clientX-menuTouchStartX, dy=t.clientY-menuTouchStartY;
 menuTouchActive=false;
 if(Math.abs(dx)<55 || Math.abs(dx)<Math.abs(dy)*1.15) return;
 const nav=document.getElementById("mainNav");
 if(dx>0 && !nav.classList.contains("menu-open")) toggleMenu();
 else if(dx<0 && nav.classList.contains("menu-open")) closeMenu();
},{passive:true});

window.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
function backToGames(){
 showPage("games");
}
function updatePlayPageBalance(){
 const a=document.getElementById("playPageCoins"); if(a)a.textContent=coins;
 const b=document.getElementById("coinBalance"); if(b)b.textContent=coins;
}


function renderVirtualPage(){
 const c=document.getElementById("virtualPageCoins"); if(c)c.textContent=coins;
 const g=document.getElementById("virtualGameCount"); if(g)g.textContent=games.filter(x=>x.enabled).length;
}
function getSearchText(value){return String(value||"").toLowerCase().trim();}
function clearGameSearch(){const el=document.getElementById("gameSearch");if(el){el.value="";renderGames();el.focus();}}



function renderGames(){
 const grid=document.getElementById("gameGrid");
 if(!grid)return;
 const q=getSearchText(document.getElementById("gameSearch")?.value);
 const enabledGames=games.filter(g=>g.enabled);
 const filtered=enabledGames.filter(g=>!q || [g.title,g.description,g.gameType,String(g.id)].some(v=>getSearchText(v).includes(q)));
 grid.innerHTML=filtered.map(g=>`
  <div class="game-card">
   <div class="game-logo ${g.gameType==='3d'?'game-logo-3d':''}"><div class="logo-glow"></div><div class="logo-symbol">${String(g.icon).startsWith("data:image/")?`<img src="${g.icon}" alt="">`:`<span>${g.icon}</span>`}</div><div class="logo-label">${g.gameType==='3d'?'3D':(g.gameType||'GAME').toUpperCase()}</div></div><h3>${escapeHtml(g.title)}</h3>
   <p>${escapeHtml(g.description||"")}</p>
   <button class="primary" onclick="openGame(${g.id})">Play</button>
  </div>`).join("");
 document.getElementById("gameCount").textContent=enabledGames.length;
 const meta=document.getElementById("gameSearchMeta");
 if(meta)meta.textContent=q ? `Showing ${filtered.length} of ${enabledGames.length} games` : `${enabledGames.length} games available`;
 if(!filtered.length)grid.innerHTML='<div class="empty-search">🔎 No games found. Try another name or game type.</div>';
}
function openGame(id){
 const g=games.find(x=>x.id===id);
 const area=document.getElementById("gameArea");
 if(!g)return;
 showPage("gamePlayPage");
 const title=document.getElementById("playingTitle"); if(title)title.textContent=g.title;
 updatePlayPageBalance();
 area.innerHTML=`<div class="game-loading"><div class="loading-icon">${String(g.icon).startsWith("data:image/")?`<img src="${g.icon}" alt="">`:g.icon}</div><h2>${escapeHtml(g.title)}</h2><p>Game loading...</p><div class="loading-track"><div id="gameLoadBar" class="loading-bar"></div></div><div class="loading-percent" id="gameLoadPercent">0%</div></div>`;
 let progress=0;
 const timer=setInterval(()=>{progress+=10;const bar=document.getElementById("gameLoadBar"),pct=document.getElementById("gameLoadPercent");if(bar)bar.style.width=progress+"%";if(pct)pct.textContent=progress+"%";if(progress>=100){clearInterval(timer);renderGame(g);}},100);
}
function betPanel(){return `<div class="bet-panel"><div><b>🎟️ Bet</b><span class="bet-balance">Balance: ৳ <span id="gameBetBalance">${coins}</span></span></div><div class="bet-options">${[10,25,50,100,200].map((n,i)=>`<button class="bet-btn ${i===0?'selected':''}" onclick="selectBet(${n})">৳ ${n}</button>`).join('')}</div><small>শুধু coins — কোনো real money নয়।</small></div>`;}
function selectBet(n){window.currentBet=Number(n);document.querySelectorAll('.bet-btn').forEach(b=>b.classList.toggle('selected',b.textContent.includes(String(n))));const el=document.getElementById('gameBetBalance');if(el)el.textContent=coins;}
function chargeBet(){const bet=Number(window.currentBet||10);if(coins<bet){alert('Virtual balance কম। আগে coins যোগ করুন।');return false;}coins-=bet;save();updatePlayPageBalance();const el=document.getElementById('gameBetBalance');if(el)el.textContent=coins;return true;}
function winBet(multiplier=2){const bet=Number(window.currentBet||10);const payout=Math.round(bet*multiplier);coins+=payout;save();updatePlayPageBalance();const el=document.getElementById('gameBetBalance');if(el)el.textContent=coins;return payout;}
function renderGame(g){
 const area=document.getElementById("gameArea");
 window.currentBet=10;
 const casinoTypes=["slots","roulette","blackjack","baccarat","videopoker","craps","sicbo","hilo","dragontiger","andarbahar","teenpatti","lucky7","wheel","plinko","keno","bingo","coin","colorcard","highcard","war","gems","vault","lucky3","jackpot"];
 if(casinoTypes.includes(g.gameType)) area.innerHTML=casinoGame(g);
 else if(g.gameType==="external") area.innerHTML=`<div class="game-box">${betPanel()}<h2>🎮 ${escapeHtml(g.title)}</h2><p>${escapeHtml(g.description||"")}</p><iframe class="imported-game-frame" src="${escapeHtml(g.gameUrl)}" sandbox="allow-scripts allow-forms allow-pointer-lock"></iframe></div>`;
 else if(g.gameType==="html") area.innerHTML=`<div class="game-box">${betPanel()}<h2>🎮 ${escapeHtml(g.title)}</h2><p>${escapeHtml(g.description||"")}</p><iframe class="imported-game-frame" srcdoc="${escapeAttr(g.gameHtml||"")}" sandbox="allow-scripts allow-forms allow-pointer-lock"></iframe></div>`;
 else if(g.gameType==="3d") area.innerHTML=threeDGame(g);
 else if(g.gameType==="crash3d") area.innerHTML=crash3DGame(g);
 else area.innerHTML=`<div class="game-box">${betPanel()}<h2>${g.icon} ${escapeHtml(g.title)}</h2><p>${escapeHtml(g.description||"")}</p><p>Custom game.</p></div>`;
}

function threeDGame(g){
 return `<div class="game-box casino-game game-3d">
  ${betPanel()}
  <div class="three-d-header"><h2>🎰 ${escapeHtml(g.title)}</h2><p>${escapeHtml(g.description||"")}</p><span>100% • No cash value</span></div>
  <div class="three-d-stage">
   <div class="neon-floor"></div>
   <div class="wheel-3d" id="threeDWheel">
    <div class="wheel-ring ring-a"></div><div class="wheel-ring ring-b"></div>
    <div class="wheel-face"><span>7</span><span>💎</span><span>🍒</span><span>⭐</span><span>🔔</span><span>7</span><span>💎</span><span>🍋</span></div>
    <div class="wheel-hub">ELIAS<br><small>3D</small></div>
   </div>
   <div class="three-d-pointer">▼</div>
   <div class="three-d-chips"><i>🪙</i><i>💠</i><i>🪙</i></div>
  </div>
  <button class="primary three-d-spin" onclick="play3DGame()">SPIN 3D</button>
  <div id="threeDResult" class="big-result">READY</div>
  <small class="virtual-note">Spin uses only the selected coin amount. Nothing here is real money.</small>
 </div>`;
}

function crash3DGame(g){
 return `<div class="game-box casino-game game-3d crashpro-game">
  <div class="crash-avatar-header"><span class="crash-avatar-badge">3D</span><div><h2>🚀 ${escapeHtml(g.title)}</h2><p>Advanced 3D Crash Avatar</p></div></div>
  <div class="crashpro-stage crash-avatar-stage" id="crashStage">
   <div class="crashpro-sky"><span class="cp-cloud c1"></span><span class="cp-cloud c2"></span><span class="cp-cloud c3"></span></div>
   <div class="crashpro-mountains"></div><div class="crashpro-grid"></div><div class="crashpro-horizon"></div>
   <div class="crashpro-trail" id="crashPath"></div>
   <div class="crash-avatar" id="crashPlane"><span class="avatar-glow"></span><span class="avatar-body">🚀</span></div>
   <div class="crashpro-multiplier" id="crashMultiplier">1.00×</div>
   <div class="crashpro-status" id="crashStatus">READY</div>
   <div class="crash-level" id="crashLevel">LEVEL 01</div>
  </div>
  <div class="crash-avatar-controls">
   <button class="crashpro-start" id="crashStartBtn" onclick="startCrash3D()">▶ START</button>
   <button class="crashpro-stop" id="crashStopBtn" onclick="stopCrash3D()" disabled>■ STOP</button>
  </div>
  <div id="crashResult" class="crash-avatar-result">PRESS START TO PLAY</div>
 </div>`;
}

let crashTimer=null, crashRunning=false, crashStopValue=null;
function startCrash3D(){
 if(crashRunning)return;
 const plane=document.getElementById('crashPlane'),mult=document.getElementById('crashMultiplier'),status=document.getElementById('crashStatus'),result=document.getElementById('crashResult'),start=document.getElementById('crashStartBtn'),stop=document.getElementById('crashStopBtn'),path=document.getElementById('crashPath'),level=document.getElementById('crashLevel');
 if(!plane||!mult)return;
 crashRunning=true; crashStopValue=null;
 start.disabled=true; stop.disabled=false;
 status.textContent='FLYING'; result.textContent='3D AVATAR IN FLIGHT';
 plane.classList.remove('crashed'); plane.classList.add('flying'); path.classList.add('active');
 plane.style.left='8%'; plane.style.bottom='13%'; plane.style.transform='rotate(-8deg) scale(1)';
 let t=0,m=1,levelNo=1,crashAt=2.2+Math.random()*6.2;
 crashTimer=setInterval(()=>{
  t+=.08; m=1+Math.pow(t,1.2)*.5;
  mult.textContent=m.toFixed(2)+'×';
  levelNo=Math.min(99,1+Math.floor(m/1.5));
  if(level)level.textContent='LEVEL '+String(levelNo).padStart(2,'0');
  plane.style.left=Math.min(84,8+t*10)+'%';
  plane.style.bottom=Math.min(77,13+t*7.2)+'%';
  plane.style.transform=`rotate(-${Math.min(34,8+t*3)}deg) scale(${1+Math.min(.4,t*.045)})`;
  if(crashStopValue||m>=crashAt) finishCrash3D(crashStopValue||m,!!crashStopValue);
 },80);
}
function stopCrash3D(){
 if(!crashRunning)return;
 const m=Number((document.getElementById('crashMultiplier')?.textContent||'1').replace('×',''));
 crashStopValue=m;
}
function finishCrash3D(m,stopped){
 if(crashTimer){clearInterval(crashTimer);crashTimer=null;}
 crashRunning=false;
 const plane=document.getElementById('crashPlane'),status=document.getElementById('crashStatus'),result=document.getElementById('crashResult'),start=document.getElementById('crashStartBtn'),stop=document.getElementById('crashStopBtn'),path=document.getElementById('crashPath');
 if(plane){plane.classList.remove('flying');plane.classList.add('crashed');}
 if(path)path.classList.remove('active');
 if(status)status.textContent=stopped?'STOPPED':'CRASHED';
 if(result)result.textContent=stopped?`🛑 STOPPED AT ${m.toFixed(2)}×`:`💥 CRASHED AT ${m.toFixed(2)}×`;
 if(start)start.disabled=false;
 if(stop)stop.disabled=true;
}

function play3DGame(){
 if(!chargeBet())return;
 const wheel=document.getElementById("threeDWheel"), result=document.getElementById("threeDResult");
 if(!wheel)return;
 const multipliers=[0,2,3,5,10];
 const m=multipliers[Math.floor(Math.random()*multipliers.length)];
 const degrees=1080+Math.floor(Math.random()*360);
 wheel.style.transform=`rotateX(58deg) rotateZ(${degrees}deg)`;
 result.textContent="SPINNING…";
 setTimeout(()=>{
  if(m){winBet(m);result.textContent=`🎉 3D WIN ×${m} +৳${Math.round(Number(window.currentBet)*m)}`;}
  else result.textContent="✨ TRY AGAIN";
 },900);
}

function casinoGame(g){
 const controls={
  slots:`<div class="casino-reels" id="casinoVisual"><span>🍒</span><span>7️⃣</span><span>💎</span><span>🔔</span><span>🍋</span></div><button class="primary casino-action" onclick="playCasino('slots')">SPIN REELS</button>`,
  roulette:`<div class="casino-wheel" id="casinoVisual">🎡<div class="wheel-ball">●</div></div><div class="choice casino-choices"><button onclick="playCasino('roulette','red')">🔴 Red</button><button onclick="playCasino('roulette','black')">⚫ Black</button><button onclick="playCasino('roulette','green')">🟢 0</button></div>`,
  blackjack:`<div class="casino-cards" id="casinoVisual"><div>🂠</div><div>🂠</div></div><button class="primary casino-action" onclick="playCasino('blackjack')">DEAL CARDS</button>`,
  baccarat:`<div class="casino-table-choice"><button onclick="playCasino('baccarat','player')">PLAYER</button><button onclick="playCasino('baccarat','banker')">BANKER</button><button onclick="playCasino('baccarat','tie')">TIE</button></div><div id="casinoVisual" class="casino-result">♠️ ♥️</div>`,
  videopoker:`<div class="casino-cards" id="casinoVisual"><div>🂠</div><div>🂠</div><div>🂠</div><div>🂠</div><div>🂠</div></div><button class="primary casino-action" onclick="playCasino('videopoker')">DEAL HAND</button>`,
  craps:`<div class="dice-stage" id="casinoVisual"><span>⚄</span><span>⚂</span></div><button class="primary casino-action" onclick="playCasino('craps')">ROLL DICE</button>`,
  sicbo:`<div class="dice-stage" id="casinoVisual"><span>⚂</span><span>⚄</span><span>⚁</span></div><div class="choice casino-choices"><button onclick="playCasino('sicbo','small')">SMALL</button><button onclick="playCasino('sicbo','big')">BIG</button><button onclick="playCasino('sicbo','triple')">TRIPLE</button></div>`,
  hilo:`<div class="casino-cards" id="casinoVisual"><div>7</div></div><div class="choice casino-choices"><button onclick="playCasino('hilo','higher')">HIGHER ▲</button><button onclick="playCasino('hilo','lower')">LOWER ▼</button></div>`,
  dragontiger:`<div class="casino-table-choice"><button onclick="playCasino('dragontiger','dragon')">🐉 DRAGON</button><button onclick="playCasino('dragontiger','tiger')">🐯 TIGER</button><button onclick="playCasino('dragontiger','tie')">TIE</button></div><div id="casinoVisual" class="casino-result">🐉 vs 🐯</div>`,
  andarbahar:`<div class="casino-table-choice"><button onclick="playCasino('andarbahar','andar')">ANDAR</button><button onclick="playCasino('andarbahar','bahar')">BAHAR</button></div><div id="casinoVisual" class="casino-result">🃏</div>`,
  teenpatti:`<div class="casino-cards" id="casinoVisual"><div>🂠</div><div>🂠</div><div>🂠</div></div><button class="primary casino-action" onclick="playCasino('teenpatti')">DEAL 3 CARDS</button>`,
  lucky7:`<div class="casino-slot-number" id="casinoVisual">7️⃣</div><div class="choice casino-choices"><button onclick="playCasino('lucky7','under')">UNDER 7</button><button onclick="playCasino('lucky7','seven')">LUCKY 7</button><button onclick="playCasino('lucky7','over')">OVER 7</button></div>`,
  wheel:`<div class="casino-wheel" id="casinoVisual">🎡</div><button class="primary casino-action" onclick="playCasino('wheel')">SPIN WHEEL</button>`,
  plinko:`<div class="plinko-board" id="casinoVisual"><div class="plinko-ball">●</div><div class="plinko-row">• • • • •</div><div class="plinko-row"> • • • • • </div><div class="plinko-row">• • • • •</div><div class="plinko-bins">×2&nbsp;&nbsp;×0&nbsp;&nbsp;×3&nbsp;&nbsp;×0&nbsp;&nbsp;×5</div></div><button class="primary casino-action" onclick="playCasino('plinko')">DROP CHIP</button>`,
  keno:`<div class="keno-grid" id="casinoVisual">${Array.from({length:20},(_,i)=>`<button onclick="this.classList.toggle('picked')">${i+1}</button>`).join('')}</div><button class="primary casino-action" onclick="playCasino('keno')">DRAW NUMBERS</button>`,
  bingo:`<div class="bingo-ball" id="casinoVisual">●</div><button class="primary casino-action" onclick="playCasino('bingo')">DRAW BALL</button>`,
  coin:`<div class="coin-visual" id="casinoVisual">🪙</div><div class="choice casino-choices"><button onclick="playCasino('coin','heads')">HEADS</button><button onclick="playCasino('coin','tails')">TAILS</button></div>`,
  colorcard:`<div class="casino-card-big" id="casinoVisual">🂠</div><div class="choice casino-choices"><button onclick="playCasino('colorcard','red')">🔴 RED</button><button onclick="playCasino('colorcard','black')">⚫ BLACK</button></div>`,
  highcard:`<div class="casino-cards" id="casinoVisual"><div>🂠</div><div>🂠</div></div><button class="primary casino-action" onclick="playCasino('highcard')">DRAW</button>`,
  war:`<div class="casino-cards" id="casinoVisual"><div>🂠</div><strong>VS</strong><div>🂠</div></div><button class="primary casino-action" onclick="playCasino('war')">BATTLE</button>`,
  gems:`<div class="vault-grid" id="casinoVisual"><button onclick="playCasino('gems',0)">💎</button><button onclick="playCasino('gems',1)">💠</button><button onclick="playCasino('gems',2)">🔷</button><button onclick="playCasino('gems',3)">💎</button></div>`,
  vault:`<div class="vault-grid" id="casinoVisual"><button onclick="playCasino('vault',0)">🔐 1</button><button onclick="playCasino('vault',1)">🔐 2</button><button onclick="playCasino('vault',2)">🔐 3</button></div>`,
  lucky3:`<div class="vault-grid" id="casinoVisual"><button onclick="playCasino('lucky3',0)">🍀 A</button><button onclick="playCasino('lucky3',1)">🍀 B</button><button onclick="playCasino('lucky3',2)">🍀 C</button></div>`,
  jackpot:`<div class="jackpot-visual" id="casinoVisual">🏆 JACKPOT</div><button class="primary casino-action" onclick="playCasino('jackpot')">SPIN JACKPOT</button>`
 };
 return `<div class="game-box casino-game">${betPanel()}<div class="casino-header"><h2>${g.icon} ${escapeHtml(g.title)}</h2><p>${escapeHtml(g.description||"")}</p></div><div class="casino-stage">${controls[g.gameType]||controls.slots}</div><div id="casinoResult" class="big-result">READY</div><small class="virtual-note">এখানে সব amount এবং ফলাফল credits-এর জন্য।</small></div>`;
}

function playCasino(type,pick){
 if(!chargeBet())return;
 const visual=document.getElementById('casinoVisual'), result=document.getElementById('casinoResult');
 const win=(mult)=>{winBet(mult);result.textContent=`🎉 WIN +৳${Math.round(Number(window.currentBet)*mult)}`;};
 const lose=msg=>{result.textContent=msg||'TRY AGAIN';};
 visual?.classList.add('casino-animate');
 setTimeout(()=>visual?.classList.remove('casino-animate'),450);
 if(type==='slots'){const s=['🍒','🍋','⭐','🔔','💎','7️⃣'];const a=Array.from({length:5},()=>s[Math.floor(Math.random()*s.length)]);visual.innerHTML=a.map(x=>`<span>${x}</span>`).join('');if(a.every(x=>x===a[0]))win(10);else if(new Set(a).size<=2)win(4);else if(a.filter(x=>x==='7️⃣').length>=2)win(6);else lose('No jackpot — spin again');return;}
 if(type==='roulette'){const n=Math.floor(Math.random()*37);const red=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n);const color=n===0?'green':red?'red':'black';visual.textContent=`${n} • ${color.toUpperCase()}`;if(pick===color)win(pick==='green'?36:2);else lose('No hit');return;}
 if(type==='blackjack'){const card=()=>Math.floor(Math.random()*10)+1;const a=[card(),card()],b=[card(),card()];const you=a.reduce((x,y)=>x+y,0),dealer=b.reduce((x,y)=>x+y,0);visual.innerHTML=`<div>🃏 ${you}</div><div>🃏 ${dealer}</div>`;if(you<=21&&(dealer>21||you>dealer))win(2);else if(you===dealer)win(1);else lose('Dealer wins');return;}
 if(type==='baccarat'){const r=Math.random();const out=r<.45?'player':r<.9?'banker':'tie';visual.textContent=`${out.toUpperCase()} WINS`;if(pick===out)win(out==='tie'?9:2);else lose('Round lost');return;}
 if(type==='videopoker'){const ranks=['A','K','Q','J','10','9','8','7'];const hand=Array.from({length:5},()=>ranks[Math.floor(Math.random()*ranks.length)]);visual.innerHTML=hand.map(x=>`<div>${x}</div>`).join('');const counts=Object.values(hand.reduce((o,x)=>(o[x]=(o[x]||0)+1,o),{}));if(counts.includes(3))win(4);else if(counts.includes(2))win(2);else lose('High card');return;}
 if(type==='craps'){const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6),sum=a+b;visual.innerHTML=`<span>⚄ ${a}</span><span>⚄ ${b}</span>`;if([7,11].includes(sum))win(2);else if([2,3,12].includes(sum))lose('Craps');else if(sum>=8)win(1);else lose('No win');return;}
 if(type==='sicbo'){const d=[1,2,3].map(()=>1+Math.floor(Math.random()*6));const sum=d.reduce((a,b)=>a+b,0);visual.innerHTML=d.map(x=>`<span>⚄ ${x}</span>`).join('');if(pick==='triple'&&d[0]===d[1]&&d[1]===d[2])win(8);else if(pick==='small'&&sum>=4&&sum<=10)win(2);else if(pick==='big'&&sum>=11&&sum<=17)win(2);else lose(`Total ${sum}`);return;}
 if(type==='hilo'){const cur=7,next=1+Math.floor(Math.random()*13);visual.innerHTML=`<div>${cur}</div><div>${next}</div>`;if((pick==='higher'&&next>cur)||(pick==='lower'&&next<cur))win(2);else if(next===cur)win(1);else lose('Wrong direction');return;}
 if(type==='dragontiger'){const d=1+Math.floor(Math.random()*13),t=1+Math.floor(Math.random()*13),out=d===t?'tie':d>t?'dragon':'tiger';visual.textContent=`🐉 ${d} VS 🐯 ${t}`;if(pick===out)win(out==='tie'?9:2);else lose('Round lost');return;}
 if(type==='andarbahar'){const out=Math.random()<.5?'andar':'bahar';visual.textContent=`🃏 ${out.toUpperCase()}`;if(pick===out)win(2);else lose('Round lost');return;}
 if(type==='teenpatti'){const hand=Array.from({length:3},()=>1+Math.floor(Math.random()*13));visual.innerHTML=hand.map(x=>`<div>${x}</div>`).join('');const pair=hand[0]===hand[1]||hand[1]===hand[2]||hand[0]===hand[2],triple=hand[0]===hand[1]&&hand[1]===hand[2];if(triple)win(6);else if(pair)win(3);else lose('High card');return;}
 if(type==='lucky7'){const n=1+Math.floor(Math.random()*13);visual.textContent=`${n}`;if((pick==='seven'&&n===7)||(pick==='under'&&n<7)||(pick==='over'&&n>7))win(pick==='seven'?6:2);else lose('Not lucky');return;}
 if(type==='wheel'||type==='jackpot'){const vals=[0,2,3,5,10];const m=vals[Math.floor(Math.random()*vals.length)];visual.textContent=m?`🏆 ×${m}`:'TRY AGAIN';if(m)win(m);else lose('No prize');return;}
 if(type==='plinko'){const m=[0,0,2,3,0,5][Math.floor(Math.random()*6)];visual.querySelector('.plinko-ball')?.animate([{transform:'translateY(0)'},{transform:'translateY(110px)'}],{duration:450});if(m)win(m);else lose('Chip landed on ×0');return;}
 if(type==='keno'){const picks=[...document.querySelectorAll('.keno-grid .picked')].map(b=>Number(b.textContent));const draws=[];while(draws.length<5){const n=1+Math.floor(Math.random()*20);if(!draws.includes(n))draws.push(n);}visual.querySelectorAll('button').forEach(b=>b.classList.toggle('drawn',draws.includes(Number(b.textContent))));const hits=picks.filter(n=>draws.includes(n)).length;visual.querySelectorAll('.picked').forEach(b=>b.classList.remove('picked'));if(hits>=3)win(hits===5?8:3);else lose(`Draw: ${draws.join(', ')}`);return;}
 if(type==='bingo'){const n=1+Math.floor(Math.random()*75);visual.textContent=`🎱 ${n}`;if(n%7===0)win(4);else lose('Ball drawn');return;}
 if(type==='coin'){const out=Math.random()<.5?'heads':'tails';visual.textContent=out==='heads'?'🙂 HEADS':'🪙 TAILS';if(pick===out)win(2);else lose('Wrong side');return;}
 if(type==='colorcard'){const out=Math.random()<.5?'red':'black';visual.textContent=out==='red'?'🔴 RED':'⚫ BLACK';if(pick===out)win(2);else lose('Wrong color');return;}
 if(type==='highcard'||type==='war'){const a=1+Math.floor(Math.random()*13),b=1+Math.floor(Math.random()*13);visual.innerHTML=`<div>${a}</div><strong>VS</strong><div>${b}</div>`;if(a>b)win(2);else if(a===b)win(1);else lose('Dealer wins');return;}
 if(type==='gems'||type==='vault'||type==='lucky3'){const max=type==='gems'?4:3;const target=Math.floor(Math.random()*max);visual.querySelectorAll('button').forEach((b,i)=>b.disabled=true);if(Number(pick)===target)win(type==='gems'?4:3);else lose(`Lucky choice was ${target+1}`);return;}
}

function addReward(amount){coins+=amount;save();}
function rollDice(reward){if(!chargeBet())return;let n=Math.floor(Math.random()*6)+1;document.getElementById("result").textContent=n;if(n>=4){winBet(2);alert("You won "+reward+" coins!");}else alert("Try again!");}
function flip(choice,reward){if(!chargeBet())return;let r=Math.random()<.5?"Heads":"Tails";document.getElementById("result").textContent=r;if(choice===r){winBet(2);alert("You won "+reward+" coins!");}else alert("Not this time!");}
function wheel(reward){if(!chargeBet())return;let r=Math.floor(Math.random()*5);let vals=["10","25","50","100","200"];document.getElementById("result").textContent=vals[r]+" 🪙";winBet(r===4?5:(r>=2?3:2));}
function guess(n,reward){if(!chargeBet())return;let r=Math.floor(Math.random()*5)+1;document.getElementById("result").textContent=r;if(n===r){winBet(2);alert("Correct! +"+reward+" coins");}else alert("Wrong number!");}

function gameHead(g){return `<h2>${g.icon} ${escapeHtml(g.title)}</h2><p>${escapeHtml(g.description||"")}</p>`;}
function buttonGame(g,label,fn){return `<div class="game-box">${gameHead(g)}<button class="primary" onclick="${fn}(${g.reward})">${label}</button><div id="result" class="big-result">?</div></div>`;}
function choiceGame(g,prompt,choices,type){return `<div class="game-box">${gameHead(g)}<p>${prompt}</p><div class="choice">${choices.map((c,i)=>`<button onclick="choicePlay('${type}',${i},${g.reward})">${c}</button>`).join("")}</div><div id="result" class="big-result">?</div></div>`;}
function miniBlackjack(g){return `<div class="game-box">${gameHead(g)}<p>Draw until you reach 21. Closest without going over wins the practice round.</p><button class="primary" onclick="blackjackPlay(${g.reward})">Deal Hand</button><div id="result" class="big-result">🃏</div></div>`;}
function choicePlay(type,pick,reward){if(!chargeBet())return;const win=Math.floor(Math.random()*3)===pick;document.getElementById('result').textContent=win?'⭐ WIN':'❌ TRY AGAIN';if(win)winBet(2);}
function blackjackPlay(reward){if(!chargeBet())return;let a=Math.floor(Math.random()*11)+1,b=Math.floor(Math.random()*11)+1,total=a+b;document.getElementById('result').textContent=total;if(total<=21&&total>=16){winBet(2);alert('Practice round won! +'+reward+' coins');}else alert('Practice round over.');}
function highCardPlay(reward){if(!chargeBet())return;let you=Math.floor(Math.random()*13)+1,dealer=Math.floor(Math.random()*13)+1;document.getElementById('result').textContent=`You ${you} — CPU ${dealer}`;if(you>dealer)winBet(2);}
function warPlay(reward){if(!chargeBet())return;let a=Math.floor(Math.random()*13)+1,b=Math.floor(Math.random()*13)+1;document.getElementById('result').textContent=`⚔️ ${a} vs ${b}`;if(a>b)winBet(2);}
function quickTapGame(g){return `<div class="game-box">${gameHead(g)}<button class="primary" onclick="quickTapPlay(${g.reward})">Tap!</button><div id="result" class="big-result">0</div></div>`;}
function quickTapPlay(reward){if(!chargeBet())return;let n=Math.floor(Math.random()*10)+1;document.getElementById('result').textContent=n+' taps';if(n>=6)winBet(2);}
function colorMatchGame(g){let colors=['RED','BLUE','GREEN','YELLOW'],target=colors[Math.floor(Math.random()*4)];return `<div class="game-box">${gameHead(g)}<p>Target: <b>${target}</b></p><div class="choice">${colors.map(c=>`<button onclick="matchColor('${c}','${target}',${g.reward})">${c}</button>`).join('')}</div><div id="result" class="big-result">🎨</div></div>`;}
function matchColor(c,t,reward){if(!chargeBet())return;let win=c===t;document.getElementById('result').textContent=win?'✅ MATCH':'❌ MISS';if(win)winBet(2);}
function diceDuelPlay(reward){if(!chargeBet())return;let a=Math.floor(Math.random()*6)+1,b=Math.floor(Math.random()*6)+1;document.getElementById('result').textContent=`🎲 ${a} — CPU ${b}`;if(a>b)winBet(2);}
function spinnerPlay(reward){if(!chargeBet())return;let n=Math.floor(Math.random()*10)+1;document.getElementById('result').textContent=n+'/10';if(n>=8)winBet(2);}
function safePlay(reward){if(!chargeBet())return;let v=document.getElementById('safeGuess').value,secret=String(Math.floor(Math.random()*1000)).padStart(3,'0');document.getElementById('result').textContent=v===secret?'🔓 OPEN':'🔒 '+secret+' was not your code';if(v===secret)winBet(2);}
function roulettePlay(reward){if(!chargeBet())return;let n=Math.floor(Math.random()*37);document.getElementById('result').textContent='Number '+n; if(n%2===0)winBet(2);}
function pokerPlay(reward){if(!chargeBet())return;let hand=['A','K','Q','J','10'].sort(()=>Math.random()-.5);document.getElementById('result').textContent=hand.join(' ');if(hand[0]==='A')winBet(2);}
function slotsPlay(reward){if(!chargeBet())return;let s=['🍒','🍋','⭐','🔔','💎'];let a=[0,1,2].map(()=>s[Math.floor(Math.random()*s.length)]);document.getElementById('result').textContent=a.join(' | ');if(a[0]===a[1]||a[1]===a[2])winBet(2);}

// Replace the previous simple built-in games once, while preserving custom/admin-added games.
if(!localStorage.getItem('eliasCasinoGamesV2')){
 const custom=games.filter(g=>!defaultGames.some(d=>d.id===g.id));
 games=[...defaultGames,...custom];
 localStorage.setItem('eliasCasinoGamesV2','1');
 save();
}

// Add the 3D game to existing installs without removing custom games.
if(!games.some(g=>g.id===25)){
 games.push({id:25,title:"3D Neon Spin",icon:"🎰",description:"Immersive 3D virtual casino wheel with animated neon effects.",reward:100,enabled:true,gameType:"3d"});
 save();
}

let transactions = JSON.parse(localStorage.getItem("arcadeTransactions") || "[]");
let depositNumbers = JSON.parse(localStorage.getItem("eliasDepositNumbers") || "null") || {bKash:"", Nagad:"", Rocket:""};
let withdrawNumbers = JSON.parse(localStorage.getItem("eliasWithdrawNumbers") || "null") || {bKash:"", Nagad:"", Rocket:""};
let boundWithdrawNumbers = JSON.parse(localStorage.getItem("eliasBoundWithdrawNumbers") || "null") || {bKash:"", Nagad:"", Rocket:""};

function chooseWithdrawMethod(method){
 const sel=document.getElementById("withdrawMethod");
 if(sel) sel.value=method;
 document.querySelectorAll(".payment-logo-card").forEach(btn=>btn.classList.toggle("active", btn.dataset.method===method));
 loadBoundWithdrawNumber();
}
function loadBoundWithdrawNumber(){
 const method=document.getElementById("withdrawMethod")?.value || "bKash";
 const input=document.getElementById("withdrawNumber");
 const value=boundWithdrawNumbers[method] || "";
 if(input) input.value=value;
 const status=document.getElementById("boundWithdrawStatus");
 if(status){ status.textContent=value ? "✓ Bound" : "Not bound"; status.classList.toggle("is-bound",!!value); }
 document.querySelectorAll(".payment-logo-card").forEach(btn=>btn.classList.toggle("active", btn.dataset.method===method));
}
function bindWithdrawNumber(){
 const method=document.getElementById("withdrawMethod")?.value || "bKash";
 const input=document.getElementById("withdrawNumber");
 const value=input?.value.trim() || "";
 if(!/^01[3-9]\d{8}$/.test(value)) return alert("সঠিক ১১ সংখ্যার mobile number দিন");
 boundWithdrawNumbers[method]=value;
 localStorage.setItem("eliasBoundWithdrawNumbers",JSON.stringify(boundWithdrawNumbers));
 loadBoundWithdrawNumber();
 alert(method+" withdraw number bound হয়েছে (virtual only).");
}


function saveWallet(){
 localStorage.setItem("arcadeTransactions",JSON.stringify(transactions));
 save();
 renderWallet();
 
}

function addTransaction(type,method,number,amount,transactionNumber="",status="Pending"){
 transactions.unshift({id:Date.now()+Math.floor(Math.random()*1000),type,method,number,transactionNumber,amount:Number(amount),status});
 saveWallet();
}


function selectAmount(type, amount){
 const id=type==="deposit"?"depositAmount":"withdrawAmount";
 document.getElementById(id).value=amount;
 const container=document.getElementById(type==="deposit"?"depositAmounts":"withdrawAmounts");
 container.querySelectorAll(".amount-btn").forEach(b=>b.classList.remove("selected"));
 [...container.querySelectorAll(".amount-btn")].find(b=>b.textContent.includes(amount.toLocaleString())).classList.add("selected");
}

function requestDeposit(){
 const method=document.getElementById("depositMethod").value;
 const number=document.getElementById("depositNumber").value.trim();
 const txn=document.getElementById("depositTxnNumber").value.trim();
 const amount=Number(document.getElementById("depositAmount").value);
 if(!number || !txn || !amount || amount<1)return alert("Deposit number, Transaction Number ও amount দিন");
 addTransaction("Deposit",method,number,amount,txn,"Pending");
 alert("Virtual deposit request submitted. Admin approval required.");
}

function requestWithdraw(){
 const method=document.getElementById("withdrawMethod").value;
 const number=document.getElementById("withdrawNumber").value.trim();
 const amount=Number(document.getElementById("withdrawAmount").value);
 if(!number || !amount || amount<1)return alert("Method, reference number ও amount দিন");
 if(amount>coins)return alert("Virtual balance যথেষ্ট নেই");
 addTransaction("Withdraw",method,number,amount,"","Pending");
 alert("Virtual withdraw request submitted. Admin approval required.");
}










function renderWallet(){
 const wb=document.getElementById("walletBalance");
 if(wb) wb.textContent=coins;
 const body=document.getElementById("historyBody");
 if(body) body.innerHTML=transactions.length ? transactions.map(t=>`
  <tr><td>${t.type}</td><td>${t.method}</td><td>${escapeHtml(t.number)}</td><td>${escapeHtml(t.transactionNumber||"—")}</td>
  <td>৳ ${t.amount}</td><td>${t.status}</td></tr>`).join("") :
  '<tr><td colspan="6">No requests yet</td></tr>';
}


















function addGame(){ addGameFromBuilder(); }

function memoryPick(i,x,reward){
 const btn=document.getElementById("m"+i);
 if(!window._memoryFirst){if(!chargeBet())return;window._memoryFirst={i,x};btn.textContent=x;return;}
 const first=window._memoryFirst;
 btn.textContent=x;
 if(first.x===x && first.i!==i){document.getElementById("memoryResult").textContent="🎉 Match!";addReward(reward);alert("You won "+reward+" coins!");}
 else {document.getElementById("memoryResult").textContent="❌ Try again";}
 window._memoryFirst=null;
}
function startReaction(reward){
 if(!chargeBet())return;
 const b=document.getElementById("reactionBtn"), r=document.getElementById("reactionResult");
 b.disabled=true;b.textContent="Wait...";r.textContent="🟡";
 setTimeout(()=>{b.disabled=false;b.textContent="CLICK!";b.className="success";r.textContent="🟢";b.onclick=()=>{addReward(reward);r.textContent="⚡ +"+reward;alert("Reaction win! +"+reward+" coins");b.onclick=()=>startReaction(reward);};},700+Math.random()*2200);
}

function renderLeaderboard(){
 const names=["Player One","Arcade King","Lucky Star","Guest"];
 document.getElementById("leaderboardBody").innerHTML=names.map((n,i)=>`<tr><td>${i+1}</td><td>${n}</td><td>${[2500,1900,1550,coins][i]}</td></tr>`).join("");
}

function escapeAttr(s){return escapeHtml(String(s)).replace(/`/g,"&#096;");}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
save();renderGames();renderWallet();loadBoundWithdrawNumber();


/* ===== DEPOSIT_APPROVAL_PATCH =====
  deposit approval workflow.
  Admin can approve/reject pending requests; approved amount updates balance.
*/
(function(){
 const KEY = "elias_deposit_requests";
 function getReqs(){ try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
 function saveReqs(a){localStorage.setItem(KEY,JSON.stringify(a))}
 function currentBalance(){
  for(const k of ["balance","virtualBalance","walletBalance","bdtBalance"]){
   const v=localStorage.getItem(k);
   if(v!==null) return {k:k,v:Number(v)||0};
  }
  return {k:"balance",v:Number(localStorage.getItem("balance")||0)};
 }
 window.eliasSubmitDeposit=function(amount,number,txid,method){
  const n=Number(amount)||0;
  if(n<=0) return false;
  const a=getReqs();
  a.push({id:Date.now().toString(),amount:n,number:String(number||""),txid:String(txid||""),method:String(method||""),status:"pending",createdAt:new Date().toISOString()});
  saveReqs(a); return true;
 };
 window.eliasApproveDeposit=function(id){
  const a=getReqs(), i=a.findIndex(x=>String(x.id)===String(id));
  if(i<0 || a[i].status!=="pending") return false;
  a[i].status="approved"; a[i].approvedAt=new Date().toISOString(); saveReqs(a);
  const b=currentBalance(); localStorage.setItem(b.k,String(b.v+Number(a[i].amount||0)));
  return true;
 };
 window.eliasRejectDeposit=function(id){
  const a=getReqs(), i=a.findIndex(x=>String(x.id)===String(id));
  if(i<0 || a[i].status!=="pending") return false;
  a[i].status="rejected"; a[i].rejectedAt=new Date().toISOString(); saveReqs(a); return true;
 };
 window.eliasGetDepositRequests=function(){return getReqs()};
})();



/* ELIAS_DEPOSIT_DONE_REJECT_V2 */
(function(){
 const K="elias_deposit_requests";
 const get=()=>{try{return JSON.parse(localStorage.getItem(K)||"[]")}catch(e){return[]}};
 const put=a=>localStorage.setItem(K,JSON.stringify(a));
 const bal=()=>{let k=["balance","virtualBalance","walletBalance","bdtBalance"].find(x=>localStorage.getItem(x)!==null)||"balance";return [k,Number(localStorage.getItem(k)||0)||0]};
 window.depositDone=function(id){
  const a=get(), r=a.find(x=>String(x.id)===String(id));
  if(!r || r.status!=="pending") return false;
  r.status="done"; r.completedAt=new Date().toISOString();
  const [k,v]=bal(); localStorage.setItem(k,String(v+Number(r.amount||0)));
  put(a); if(window.renderDepositApproval) window.renderDepositApproval(); return true;
 };
 window.depositReject=function(id){
  const a=get(), r=a.find(x=>String(x.id)===String(id));
  if(!r || r.status!=="pending") return false;
  r.status="rejected"; r.rejectedAt=new Date().toISOString();
  put(a); if(window.renderDepositApproval) window.renderDepositApproval(); return true;
 };
})();



/* ===== ELIAS CASINO MUSIC =====
  Procedural, royalty-free casino-style background music using Web Audio.
  Browser autoplay rules are respected: audio starts after the user's first interaction.
*/
(function(){
 let ctx=null, master=null, musicTimer=null, musicOn=true, step=0;
 const melody=[261.63,329.63,392.00,523.25,392.00,329.63,293.66,349.23,440.00,587.33,440.00,349.23];
 const bass=[130.81,130.81,164.81,164.81,146.83,146.83,174.61,174.61];
 function ensure(){
  if(!ctx){
   ctx=new (window.AudioContext||window.webkitAudioContext)();
   master=ctx.createGain(); master.gain.value=.055; master.connect(ctx.destination);
  }
  if(ctx.state==='suspended') ctx.resume();
 }
 function tone(freq,dur,type='triangle',vol=.08,delay=0){
  if(!ctx||!master||!musicOn)return;
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type=type; o.frequency.value=freq;
  const t=ctx.currentTime+delay;
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.018); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.03);
 }
 function tick(){
  if(!musicOn)return;
  const m=melody[step%melody.length], b=bass[Math.floor(step/2)%bass.length];
  tone(m,.30,'sine',.075); tone(m*2,.16,'triangle',.028,.10); tone(b,.42,'triangle',.035);
  if(step%4===0) tone(m*1.5,.09,'square',.012,.22);
  step++;
 }
 function start(){
  ensure();
  if(!musicOn)return;
  if(!musicTimer){tick();musicTimer=setInterval(tick,420);}
  updateButton();
 }
 function stop(){
  if(musicTimer){clearInterval(musicTimer);musicTimer=null;}
  updateButton();
 }
 function updateButton(){
  const b=document.getElementById('musicToggle'); if(b)b.textContent=musicOn?'🎵 Music ON':'🔇 Music OFF';
  if(b)b.classList.toggle('music-active',musicOn);
 }
 window.toggleCasinoMusic=function(){
  musicOn=!musicOn;
  if(musicOn)start(); else stop();
  updateButton();
 };
 window.startCasinoMusic=start;
 document.addEventListener('click',function(e){
  if(e.target.closest('#musicToggle'))return;
  if(musicOn && !musicTimer) start();
 },{passive:true});
 document.addEventListener('visibilitychange',function(){ if(document.hidden) stop(); else if(musicOn)start(); });
 window.addEventListener('beforeunload',stop);
 setTimeout(updateButton,0);
})();

/* ELIAS BET local demo authentication + player profile */
(function(){
 const USERS_KEY='eliasCasinoUsers';
 const SESSION_KEY='eliasCasinoCurrentUser';
 function getUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY)||'[]')}catch(e){return[]}}
 function saveUsers(a){localStorage.setItem(USERS_KEY,JSON.stringify(a))}
 function currentUser(){const id=localStorage.getItem(SESSION_KEY); if(!id)return null; return getUsers().find(u=>u.id===id)||null}
 function setMsg(id,msg,ok){const el=document.getElementById(id);if(el){el.textContent=msg;el.className='auth-msg '+(ok?'ok':'error')}}
 function normalize(v){return String(v||'').trim().toLowerCase()}
 function safeDate(iso){try{return new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}catch(e){return '—'}}
 function syncUserBalance(u){ if(!u)return; u.balance=Number(localStorage.getItem('arcadeCoins')||0); const users=getUsers(); const i=users.findIndex(x=>x.id===u.id); if(i>=0){users[i]=u;saveUsers(users)} }

 window.openProfileOrLogin=function(){ const u=currentUser(); if(u){ showPage('profile'); renderProfile(); } else { showPage('login'); } };
 window.loginUser=function(e){
  e.preventDefault();
  const identity=normalize(document.getElementById('loginIdentity').value), pass=document.getElementById('loginPassword').value;
  const u=getUsers().find(x=>normalize(x.username)===identity||normalize(x.email)===identity||String(x.phone)===String(identity));
  if(!u || u.password!==pass){setMsg('loginMsg','❌ Login information is incorrect.',false);return}
  localStorage.setItem(SESSION_KEY,u.id);
  syncUserBalance(u);
  setMsg('loginMsg','✅ Login successful! Redirecting to Home…',true);
  setTimeout(()=>{renderProfile();showPage('home');},350);
 };
 window.signupUser=function(e){
  e.preventDefault();
  const name=document.getElementById('signupName').value.trim(), username=document.getElementById('signupUsername').value.trim(), email=normalize(document.getElementById('signupEmail').value), phone=document.getElementById('signupPhone').value.trim(), pass=document.getElementById('signupPassword').value, pass2=document.getElementById('signupPassword2').value;
  if(pass!==pass2){setMsg('signupMsg','❌ Passwords do not match.',false);return}
  const users=getUsers();
  if(users.some(x=>normalize(x.username)===normalize(username))){setMsg('signupMsg','❌ Username already exists.',false);return}
  if(users.some(x=>normalize(x.email)===email)){setMsg('signupMsg','❌ Email already exists.',false);return}
  if(users.some(x=>String(x.phone)===phone)){setMsg('signupMsg','❌ Phone number already exists.',false);return}
  const u={id:'u_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),name,username,email,phone,password:pass,joinedAt:new Date().toISOString(),balance:Number(localStorage.getItem('arcadeCoins')||0)};
  users.push(u);saveUsers(users);
  setMsg('signupMsg','✅ Account created successfully! Please Login to continue.',true);
  setTimeout(()=>{
   document.getElementById('loginIdentity').value=username;
   document.getElementById('loginPassword').value='';
   showPage('login');
   setMsg('loginMsg','✅ Account created. Login to access Home and all features.',true);
  },450);
 };
 window.logoutUser=function(){localStorage.removeItem(SESSION_KEY);renderProfile();showPage('login');alert('Logged out successfully.');}
 window.renderProfile=function(){
  const guest=document.getElementById('profileGuest'), content=document.getElementById('profileContent'), label=document.getElementById('profileNavLabel');
  const u=currentUser();
  if(label)label.textContent=u?('👤 '+(u.username||'Profile')):'Login / Profile';
  if(!guest||!content)return;
  if(!u){guest.style.display='block';content.classList.add('profile-hidden');return}
  syncUserBalance(u); const fresh=currentUser()||u;
  guest.style.display='none';content.classList.remove('profile-hidden');
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v||'—'};
  set('profileDisplayName',fresh.name);set('profileDisplayUsername','@'+fresh.username);set('profileName',fresh.name);set('profileUsername',fresh.username);set('profileEmail',fresh.email);set('profilePhone',fresh.phone);set('profileJoined',safeDate(fresh.joinedAt));set('profileBalance',Number(localStorage.getItem('arcadeCoins')||fresh.balance||0).toLocaleString());
  const av=document.getElementById('profileAvatar'); if(av)av.textContent=(fresh.name||fresh.username||'P').trim().charAt(0).toUpperCase();
 };
 window.editProfile=function(){const u=currentUser();if(!u)return showPage('login');document.getElementById('editProfileName').value=u.name||'';document.getElementById('editProfileEmail').value=u.email||'';document.getElementById('editProfilePhone').value=u.phone||'';document.getElementById('profileEditBox').hidden=false;}
 window.cancelProfileEdit=function(){document.getElementById('profileEditBox').hidden=true;}
 window.saveProfileEdit=function(){
  const users=getUsers(), id=localStorage.getItem(SESSION_KEY), i=users.findIndex(x=>x.id===id); if(i<0)return;
  const name=document.getElementById('editProfileName').value.trim(), email=normalize(document.getElementById('editProfileEmail').value), phone=document.getElementById('editProfilePhone').value.trim();
  if(!name||!email||!/^01[3-9][0-9]{8}$/.test(phone))return alert('সঠিক Name, Email এবং 11-digit Bangladesh phone দিন।');
  if(users.some((x,j)=>j!==i&&normalize(x.email)===email))return alert('এই email অন্য account-এ আছে।');
  if(users.some((x,j)=>j!==i&&String(x.phone)===phone))return alert('এই phone অন্য account-এ আছে।');
  users[i].name=name;users[i].email=email;users[i].phone=phone;saveUsers(users);renderProfile();document.getElementById('profileEditBox').hidden=true;alert('Profile updated successfully.');
 };
 document.addEventListener('DOMContentLoaded',()=>{
  renderProfile();
  const u=currentUser();
  if(u){ showPage('home'); } else { showPage('login'); }
 });
 setInterval(()=>{if(document.getElementById('profile')?.classList.contains('active'))renderProfile()},1000);
})();
