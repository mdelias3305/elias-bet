/* ELIAS BET — Standalone Administration Panel
   NOTE: This is a front-end/localStorage admin UI. For real security, move
   authentication and data operations to a server-side backend.
*/
let adminUnlocked = !!sessionStorage.getItem("eliasAdminToken");
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
let games = defaultGames.slice();
let coins = 0;
let transactions = [];
let depositNumbers = {bKash:"",Nagad:"",Rocket:""};
let withdrawNumbers = {bKash:"",Nagad:"",Rocket:""};
games = games.map(g => ({...g, gameType:g.gameType||"placeholder", icon:g.icon||"🎮"}));

function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function getSearchText(v){return String(v||"").toLowerCase().trim();}
async function persistGames(){try{await SharedData.save({games});}catch(e){alert("Server save failed. Start the backend first.")}}
async function saveWallet(){try{await SharedData.save({transactions});}catch(e){console.error(e)}}
async function unlockAdmin(){
 const input=document.getElementById("adminPassword"), msg=document.getElementById("adminLoginMsg");
 try{await SharedData.login("admin",input.value);adminUnlocked=true;input.value="";msg.textContent="";await loadSharedAdminData();renderAdmin();}
 catch(e){msg.textContent="Incorrect admin login or server unavailable.";}
}
async function lockAdmin(){adminUnlocked=false;await SharedData.logout();renderAdmin();}
async function loadSharedAdminData(){
 const d=await SharedData.get();
 if(Array.isArray(d.games)&&d.games.length) games=d.games.map(g=>({...g,gameType:g.gameType||"placeholder",icon:g.icon||"🎮"}));
 if(d.settings?.depositNumbers) depositNumbers=d.settings.depositNumbers;
 if(d.settings?.withdrawNumbers) withdrawNumbers=d.settings.withdrawNumbers;
 transactions=Array.isArray(d.transactions)?d.transactions:[];
}
function renderAdmin(){
 const locked=document.getElementById("adminLocked"), content=document.getElementById("adminContent");
 locked.style.display=adminUnlocked?"none":"block"; content.style.display=adminUnlocked?"block":"none";
 if(!adminUnlocked)return;
 renderAdminGames(); renderDepositNumbers(); renderWithdrawNumbers(); renderPaymentRequests(); renderDepositApproval(); filterAdminEverything();
}
function clearAdminGameSearch(){const e=document.getElementById("adminGameSearch");if(e){e.value="";renderAdminGames();e.focus();}}
function clearAdminGlobalSearch(){const e=document.getElementById("adminGlobalSearch");if(e){e.value="";filterAdminEverything();e.focus();}}
function filterAdminEverything(){
 const el=document.getElementById("adminGlobalSearch"), q=getSearchText(el?.value);
 document.querySelectorAll("#adminContent .admin-searchable").forEach(card=>{
   const text=getSearchText((card.dataset.adminTitle||"")+" "+card.textContent);
   card.style.display=(!q||text.includes(q))?"":"none";
 });
 const gs=document.getElementById("adminGameSearch");
 if(gs && gs.value!==q) gs.value=q;
 renderAdminGames();
 const meta=document.getElementById("adminGlobalSearchMeta");
 if(meta) meta.textContent=q?`Admin search: “${q}”`:"Search games, settings, transactions and requests";
}
function renderAdminGames(){
 const wrap=document.getElementById("adminGames"), q=getSearchText(document.getElementById("adminGameSearch")?.value);
 const filtered=games.map((g,i)=>({g,i})).filter(({g})=>!q||[g.title,g.description,g.gameType,g.enabled?"on":"off",String(g.id)].some(v=>getSearchText(v).includes(q)));
 wrap.innerHTML=filtered.map(({g,i})=>`
  <div class="game-admin-card">
   <div class="game-admin-top"><strong>${String(g.icon).startsWith("data:image/")?`<img src="${g.icon}" style="width:28px;height:28px;object-fit:contain;vertical-align:middle">`:escapeHtml(g.icon)} ${escapeHtml(g.title)}</strong>
   <button class="${g.enabled?"success":"danger"}" onclick="toggleGame(${i})">${g.enabled?"ON":"OFF"}</button>
   <button class="danger" onclick="deleteGame(${i})">Delete</button></div>
   <div class="game-admin-edit">
    <input value="${escapeHtml(g.title)}" onchange="editGameField(${i},'title',this.value)" placeholder="Title">
    <div class="admin-icon-edit"><input value="${String(g.icon).startsWith("data:image/")?"Custom uploaded icon":escapeHtml(g.icon)}" onchange="editGameField(${i},'icon',this.value)" placeholder="Icon">
    <label class="upload-btn small-upload">🖼️ Change<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange="changeGameIcon(${i},event)"></label></div>
    <input value="${escapeHtml(g.description||"")}" onchange="editGameField(${i},'description',this.value)" placeholder="Description">
    <input type="number" value="${g.reward||0}" onchange="editGameField(${i},'reward',this.value)" placeholder="Reward">
    <select onchange="editGameField(${i},'gameType',this.value)">${["dice","coin","wheel","guess","memory","reaction","placeholder","external","html","3d","crash3d","slots","roulette","blackjack","baccarat","videopoker","craps","sicbo","hilo","dragontiger","andarbahar","teenpatti","lucky7","plinko","keno","bingo","colorcard","highcard","war","gems","vault","lucky3","jackpot"].map(t=>`<option value="${t}" ${g.gameType===t?"selected":""}>${t}</option>`).join("")}</select>
   </div></div>`).join("");
 const meta=document.getElementById("adminGameSearchMeta"); if(meta)meta.textContent=q?`Showing ${filtered.length} of ${games.length} games`:`${games.length} games in admin`;
 if(!filtered.length)wrap.innerHTML='<div class="empty-search">🔎 No matching games in Admin Panel.</div>';
}
function toggleGame(i){if(!adminUnlocked)return;games[i].enabled=!games[i].enabled;persistGames();renderAdminGames();}
function deleteGame(i){if(!adminUnlocked)return;if(!confirm(`Delete "${games[i]?.title||"this game"}"?`))return;games.splice(i,1);persistGames();renderAdminGames();}
function editGameField(i,key,value){if(!adminUnlocked)return;games[i][key]=key==="reward"?Number(value):value;persistGames();renderAdminGames();}
function previewNewIcon(event){
 const file=event.target.files?.[0], img=document.getElementById("newIconPreview"); if(!file){img.hidden=true;return;}
 if(file.size>1024*1024)return alert("Icon size 1MB-এর মধ্যে রাখুন");
 const reader=new FileReader();reader.onload=()=>{img.src=reader.result;img.hidden=false;};reader.readAsDataURL(file);
}
function addGameFromBuilder(){
 if(!adminUnlocked)return;
 const title=document.getElementById("newTitle").value.trim(), iconText=document.getElementById("newIcon").value.trim(), iconFile=document.getElementById("newIconFile").files[0];
 const description=document.getElementById("newDescription").value.trim()||"Custom game", reward=Number(document.getElementById("newReward").value)||50, gameType=document.getElementById("newGameType").value;
 if(!title)return alert("Game name দিন");
 const finish=icon=>{games.push({id:Date.now(),title,icon:icon||"🎮",description,reward,enabled:true,gameType});persistGames();["newTitle","newIcon","newDescription","newReward"].forEach(id=>document.getElementById(id).value="");document.getElementById("newIconFile").value="";document.getElementById("newIconPreview").hidden=true;renderAdminGames();};
 if(iconFile){if(iconFile.size>1024*1024)return alert("Icon size 1MB-এর মধ্যে রাখুন");const r=new FileReader();r.onload=()=>finish(r.result);r.readAsDataURL(iconFile);}else finish(iconText);
}
function importGame(){
 if(!adminUnlocked)return;
 const title=document.getElementById("importGameTitle").value.trim(),url=document.getElementById("importGameUrl").value.trim(),file=document.getElementById("importGameFile").files[0];
 if(!title)return alert("Imported game name দিন");if(!url&&!file)return alert("Game URL অথবা HTML file দিন");
 if(url){try{const u=new URL(url);if(!/^https?:$/.test(u.protocol))throw 0;}catch(e){return alert("Valid http/https URL দিন");}
 games.push({id:Date.now(),title,icon:"🎮",description:"Imported web game",reward:50,enabled:true,gameType:"external",gameUrl:url});persistGames();resetImport();renderAdminGames();return;}
 if(file.size>5*1024*1024)return alert("HTML game file 5MB-এর মধ্যে রাখুন");
 const r=new FileReader();r.onload=()=>{games.push({id:Date.now(),title,icon:"🎮",description:"Imported HTML game",reward:50,enabled:true,gameType:"html",gameHtml:r.result});persistGames();resetImport();renderAdminGames();};r.readAsText(file);
}
function resetImport(){document.getElementById("importGameTitle").value="";document.getElementById("importGameUrl").value="";document.getElementById("importGameFile").value="";}
function changeGameIcon(i,event){if(!adminUnlocked)return;const file=event.target.files?.[0];if(!file)return;if(file.size>1024*1024)return alert("Icon size 1MB-এর মধ্যে রাখুন");const r=new FileReader();r.onload=()=>{games[i].icon=r.result;persistGames();renderAdminGames();};r.readAsDataURL(file);}
function renderDepositNumbers(){
 const map={bkashDepositNumber:depositNumbers.bKash||"Not set",nagadDepositNumber:depositNumbers.Nagad||"Not set",rocketDepositNumber:depositNumbers.Rocket||"Not set"};
 Object.entries(map).forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.textContent=val;});
 [["adminBkashNumber",depositNumbers.bKash],["adminNagadNumber",depositNumbers.Nagad],["adminRocketNumber",depositNumbers.Rocket]].forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.value=val||"";});
}
function renderWithdrawNumbers(){
 [["adminWithdrawBkashNumber",withdrawNumbers.bKash],["adminWithdrawNagadNumber",withdrawNumbers.Nagad],["adminWithdrawRocketNumber",withdrawNumbers.Rocket]].forEach(([id,val])=>{const e=document.getElementById(id);if(e)e.value=val||"";});
}
function saveDepositNumbers(){
 if(!adminUnlocked)return;
 depositNumbers={bKash:document.getElementById("adminBkashNumber").value.trim(),Nagad:document.getElementById("adminNagadNumber").value.trim(),Rocket:document.getElementById("adminRocketNumber").value.trim()};
 SharedData.save({settings:{depositNumbers}}).then(()=>renderDepositNumbers()).catch(()=>alert("Server save failed."));
 document.getElementById("depositSettingsMsg").textContent="Virtual deposit numbers saved.";
}
function saveWithdrawNumbers(){
 if(!adminUnlocked)return;
 withdrawNumbers={bKash:document.getElementById("adminWithdrawBkashNumber").value.trim(),Nagad:document.getElementById("adminWithdrawNagadNumber").value.trim(),Rocket:document.getElementById("adminWithdrawRocketNumber").value.trim()};
 SharedData.save({settings:{withdrawNumbers}}).then(()=>renderWithdrawNumbers()).catch(()=>alert("Server save failed."));
 document.getElementById("withdrawSettingsMsg").textContent="Virtual withdraw numbers saved.";
}
function renderPaymentRequests(){
 const box=document.getElementById("paymentRequests"); if(!box)return;
 box.innerHTML=transactions.length?transactions.map(t=>`<div class="request"><b>${escapeHtml(t.type)} — ৳ ${Number(t.amount).toLocaleString()}</b><small>${escapeHtml(t.method)} • Number: ${escapeHtml(t.number)} • TxID: ${escapeHtml(t.transactionNumber||"—")} • ${escapeHtml(t.status)}</small>${t.status==="Pending"?`<button class="success" onclick="approveRequest(${t.id})">Approve</button> <button class="danger" onclick="rejectRequest(${t.id})">Reject</button>`:""}</div>`).join(""):"<p class='muted'>No demo requests.</p>";
}
function renderDepositApproval(){
 const box=document.getElementById("depositApprovalList");if(!box)return;
 const pending=transactions.filter(t=>t.type==="Deposit"&&t.status==="Pending");
 box.innerHTML=pending.length?pending.map(t=>`<div class="request" style="margin-bottom:10px"><b>Deposit — ৳ ${Number(t.amount).toLocaleString()}</b><small>Method: ${escapeHtml(t.method||"-")} • Number: ${escapeHtml(t.number||"-")} • TxID: ${escapeHtml(t.transactionNumber||"-")} • <b>Pending</b></small><button class="success" onclick="depositDone(${t.id})">Done / Approved</button><button class="danger" onclick="depositReject(${t.id})">Reject</button></div>`).join(""):"<p class='muted'>No pending deposit transactions.</p>";
}
function approveRequest(id){if(!adminUnlocked)return;const t=transactions.find(x=>x.id===Number(id));if(!t||t.status!=="Pending")return;if(t.type==="Deposit"){coins+=Number(t.amount)||0;t.status="Approved";}else if(t.type==="Withdraw"){if(Number(t.amount)>coins)return alert("Insufficient balance");coins-=Number(t.amount)||0;t.status="Approved";}saveWallet();renderAdmin();}
function rejectRequest(id){if(!adminUnlocked)return;const t=transactions.find(x=>x.id===Number(id));if(t&&t.status==="Pending"){t.status="Rejected";saveWallet();renderAdmin();}}
function depositDone(id){approveRequest(id);}
function depositReject(id){rejectRequest(id);}
function addGame(){addGameFromBuilder();}
renderAdmin();


document.addEventListener("DOMContentLoaded",async()=>{
 if(adminUnlocked){try{await loadSharedAdminData()}catch(e){adminUnlocked=false;await SharedData.logout()}}
 renderAdmin();
});
