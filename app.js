/* Коледа с Венито — логика */
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const hcenter=(box,el)=>{if(!box||!el)return;box.scrollTo({left:el.offsetLeft-box.clientWidth/2+el.offsetWidth/2,behavior:RM?'auto':'smooth'})};
const FINE=matchMedia('(pointer:fine)').matches;
const eur=n=>Math.round(n).toLocaleString('bg-BG').replace(/ /g,' ')+' €';
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

/* ---------- споделяне между двамата ---------- */
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const S={on:false,v:-1,outfits:[],notes:[],slots:[],log:[]};
const KMAP={'bp-fav':'fav','bp-plan':'plan','bp-rest':'rfav','bp-of':'ofav'};
let ME=ld('bp-me','');
function askWho(){return new Promise(res=>{if(ME)return res(ME);const m=$('#whoModal');m.classList.add('on');$$('#whoModal [data-who]').forEach(b=>b.onclick=()=>{ME=b.dataset.who;sv('bp-me',ME);m.classList.remove('on');whoChip();res(ME)})})}
function whoChip(){const c=$('#whoChip');if(c)c.textContent=ME?'Ти си: '+ME:'Кой си?'}
async function api(body){if(!S.on)return null;try{const r=await fetch('/api/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({who:ME,...body})});if(!r.ok)throw 0;const st=await r.json();applyRemote(st,true);return st}catch(e){toast('Не можа да се запише, опитай пак');return null}}
const _sv=sv;
const svs=(k,v,msg)=>{_sv(k,v);if(KMAP[k]&&S.on){askWho().then(()=>api({op:'map',kind:KMAP[k],val:v,msg}))}};
function applyRemote(st,force){if(!st||(!force&&st.v===S.v))return;S.v=st.v;
 const put=(obj,src)=>{Object.keys(obj).forEach(k=>delete obj[k]);Object.assign(obj,src||{})};
 put(fav,st.fav);put(plan,st.plan);put(rfav,st.rfav);if(typeof ofav!=='undefined')put(ofav,st.ofav);
 S.outfits=st.outfits||[];S.notes=st.notes||[];S.slots=st.slots||[];S.log=st.log||[];
 rerender()}
async function pull(){try{const r=await fetch('/api/state',{cache:'no-store'});if(r.status===503||!r.ok){S.on=false;syncBanner();return}const st=await r.json();
 if(!S.on){S.on=true;syncBanner();
  const empty=!Object.keys(st.fav||{}).length&&!Object.keys(st.plan||{}).length&&!Object.keys(st.rfav||{}).length&&!Object.keys(st.ofav||{}).length;
  if(empty&&(Object.keys(fav).length||Object.keys(plan).length||Object.keys(rfav).length)){applyRemote(st);return}}
 applyRemote(st)}catch(e){S.on=false;syncBanner()}}
function syncBanner(){const b=$('#syncNote');if(b)b.innerHTML=S.on?'<span class="dotlive"></span> Споделено: промените се виждат и при двамата.':'Споделянето още не е включено, затова промените се пазят само на това устройство.'}

function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1900)}
function burst(el){if(RM)return;const r=el.getBoundingClientRect();for(let i=0;i<9;i++){const s=document.createElement('span');s.className='burst';s.textContent='♥';s.style.left=(r.left+r.width/2-8)+'px';s.style.top=(r.top+r.height/2-10)+'px';const a=Math.random()*Math.PI*2,d=40+Math.random()*50;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d-20+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1000)}}

/* ---------- данни за избора ---------- */
let fav=ld('bp-fav',{}),plan=ld('bp-plan',{}),rfav=ld('bp-rest',{});
const hcap=h=>h.cap[0];

/* ---------- лайтбокс ---------- */
let LB=[],LI=0;
const showLB=()=>{const [k,c]=LB[LI];$('#lbi').src='img/'+k+'.webp';$('#lbi').alt=c;$('#lbc').textContent=c};
function openLB(list,i){LB=list;LI=Math.max(0,i);showLB();$('#lb').classList.add('on')}
$('#lbx').onclick=()=>$('#lb').classList.remove('on');
$('#lbp').onclick=()=>{LI=(LI-1+LB.length)%LB.length;showLB()};
$('#lbn').onclick=()=>{LI=(LI+1)%LB.length;showLB()};
$('#lb').onclick=e=>{if(e.target.id==='lb')$('#lb').classList.remove('on')};
let tx=0;$('#lb').addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
$('#lb').addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)(d<0?$('#lbn'):$('#lbp')).click()});
addEventListener('keydown',e=>{if(!$('#lb').classList.contains('on'))return;if(e.key==='Escape')$('#lbx').click();if(e.key==='ArrowRight')$('#lbn').click();if(e.key==='ArrowLeft')$('#lbp').click()});

/* ---------- сняг ---------- */
function snow(canvas,n){const x=canvas.getContext('2d'),host=canvas.parentElement;let F=[],raf,on=true,vis=true;
 const rs=()=>{canvas.width=host.clientWidth*devicePixelRatio;canvas.height=host.clientHeight*devicePixelRatio};rs();addEventListener('resize',rs);
 for(let i=0;i<n;i++)F.push({x:Math.random(),y:Math.random(),r:Math.random()*1.7+.4,s:Math.random()*.6+.25,d:Math.random()*7,o:Math.random()*.5+.4});
 const loop=()=>{const W=canvas.width,H=canvas.height,dp=devicePixelRatio;x.clearRect(0,0,W,H);
  F.forEach(f=>{f.y+=f.s*.0014;f.d+=.012;f.x+=Math.sin(f.d)*.0003;if(f.y>1.02){f.y=-.02;f.x=Math.random()}x.globalAlpha=f.o;x.fillStyle='#fff';x.beginPath();x.arc(f.x*W,f.y*H,f.r*dp,0,7);x.fill()});raf=requestAnimationFrame(loop)};
 const set=v=>{on=v;cancelAnimationFrame(raf);if(on&&vis&&!RM)loop();else x.clearRect(0,0,canvas.width,canvas.height)};
 new IntersectionObserver(e=>{vis=e[0].isIntersecting;set(on)}).observe(canvas);
 return set}

/* ---------- покана ---------- */
const intro=$('#intro');
if(ld('bp-intro',0)){intro.remove()}else{const s=snow($('#isnow'),70);s(true);document.body.style.overflow='hidden';
 $('#openInv').onclick=()=>{intro.classList.add('gone');document.body.style.overflow='';sv('bp-intro',1);burst($('#openInv'));setTimeout(()=>{s(false);intro.remove()},1000)}}

/* ---------- хиро ---------- */
const setSnow=snow($('#snow'),110);let snowOn=true;setSnow(true);
$('#snowbtn').onclick=()=>{snowOn=!snowOn;setSnow(snowOn);$('#snowbtn').setAttribute('aria-pressed',snowOn);$('#snowbtn').textContent=snowOn?'❄ Сняг':'❄ Без сняг'};
const sl=$$('.slides img');let si=0;if(!RM)setInterval(()=>{sl[si].classList.remove('on');si=(si+1)%sl.length;sl[si].classList.add('on')},6500);
const T=new Date('2026-12-25T14:35:00+02:00');
function tick(){const d=T-new Date(),el=$('#count');if(d<=0){el.innerHTML='<div><b>♥</b><span>весела Коледа</span></div>';return}
 const D=Math.floor(d/864e5),Hh=Math.floor(d/36e5)%24,Mm=Math.floor(d/6e4)%60,S=Math.floor(d/1e3)%60;
 el.innerHTML=`<div><b>${D}</b><span>дни</span></div><div><b>${Hh}</b><span>часа</span></div><div><b>${Mm}</b><span>минути</span></div><div><b>${String(S).padStart(2,'0')}</b><span>секунди</span></div>`}
tick();setInterval(tick,1000);
if(!RM){const hin=$('.hin');let tk=false;addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{const y=scrollY;if(y<innerHeight*1.1){hin.style.transform=`translate3d(0,${y*.22}px,0)`;hin.style.opacity=Math.max(0,1-y/(innerHeight*.75))}tk=false})},{passive:true})}

/* ---------- игра: тесте ---------- */
let order=H.map((_,i)=>i),pos=0,hist=[];
function deckRender(){const dk=$('#deck');dk.innerHTML='';
 if(pos>=order.length){const liked=H.filter(h=>fav[h.id]).map(h=>h.name);dk.innerHTML=`<div class="deckend"><div><h3>${liked.length?'Твоите любими':'Нито един?'}</h3><p class="lead" style="margin:10px auto">${liked.length?liked.join(' · '):'Опитай пак, може би някой ще ти хареса.'}</p><button class="btn sm" id="dAgain">Още веднъж</button></div></div>`;$('#dAgain').onclick=()=>{pos=0;hist=[];deckRender()};return}
 order.slice(pos,pos+3).reverse().forEach((hi,k,arr)=>{const h=H[hi],top=k===arr.length-1;const c=document.createElement('div');c.className='dcard';
  const depth=arr.length-1-k;c.style.transform=`translateY(${depth*12}px) scale(${1-depth*.04})`;c.style.zIndex=10-depth;
  const cheap=h.rooms.filter(r=>r[4]).map(r=>r[4]);
  c.innerHTML=`<img src="img/${h.ph[0]}.webp" alt="${h.name}"><span class="stamp s-yes">ХАРЕСВАМ</span><span class="stamp s-no">НЕ</span><div class="dc"><span class="pill">${h.brand}</span><h3>${h.name}</h3><p>${h.arch} · ${h.view}${cheap.length?' · от '+eur(Math.min(...cheap))+' за 2 нощи':''}</p></div>`;
  dk.appendChild(c);if(top)drag(c,hi)});
 $('#deckres').textContent=`${pos+1} от ${order.length}`}
function decide(hi,yes,c){hist.push([hi,fav[H[hi].id]]);if(yes){fav[H[hi].id]=1;burst($('#dYes'))}else delete fav[H[hi].id];svs('bp-fav',fav,(yes?'хареса ':'не хареса ')+H[hi].name);
 c.style.transition='transform .5s,opacity .5s';c.style.transform=`translateX(${yes?520:-520}px) rotate(${yes?24:-24}deg)`;c.style.opacity=0;pos++;setTimeout(()=>{deckRender();refreshFav()},380)}
function drag(c,hi){let x0=0,dx=0,down=false;
 c.addEventListener('pointerdown',e=>{down=true;x0=e.clientX;c.setPointerCapture(e.pointerId);c.style.transition='none'});
 c.addEventListener('pointermove',e=>{if(!down)return;dx=e.clientX-x0;c.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;c.querySelector('.s-yes').style.opacity=Math.max(0,dx/120);c.querySelector('.s-no').style.opacity=Math.max(0,-dx/120)});
 const up=()=>{if(!down)return;down=false;if(Math.abs(dx)>110)decide(hi,dx>0,c);else{c.style.transition='transform .4s';c.style.transform='';c.querySelectorAll('.stamp').forEach(s=>s.style.opacity=0)}dx=0};
 c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up)}
$('#dYes').onclick=()=>{const c=$$('.dcard').pop();if(c)decide(order[pos],true,c)};
$('#dNo').onclick=()=>{const c=$$('.dcard').pop();if(c)decide(order[pos],false,c)};
$('#dUndo').onclick=()=>{if(!hist.length)return;const [hi,was]=hist.pop();if(was)fav[H[hi].id]=1;else delete fav[H[hi].id];svs('bp-fav',fav);pos=Math.max(0,pos-1);deckRender();refreshFav()};
deckRender();

/* ---------- хотели ---------- */
const TT={v:'за 25–27.12',e:'оценка',f:'публикувана „от“',q:'по запитване'};
let cur=0;
function htabs(){$('#htabs').innerHTML=H.map((h,i)=>`<button class="htab ${i===cur?'on':''}" role="tab" aria-selected="${i===cur}" data-i="${i}"><img src="img/${h.ph[0]}.webp" alt="">${h.name}${fav[h.id]?' <span class="h">♥</span>':''}</button>`).join('');
 $$('.htab').forEach(b=>b.onclick=()=>{cur=+b.dataset.i;htabs();hpanel();hcenter($('#htabs'),$(`.htab[data-i="${cur}"]`))})}
function hpanel(){const h=H[cur],p=$('#hpanel');p.style.animation='none';p.offsetHeight;p.style.animation='';
 const st=h.chips.slice(0,4);
 p.innerHTML=`<div class="hp-top"><div><span class="kk">№${cur+1} · ${h.brand}</span><h3>${h.name}</h3><div class="meta">${h.addr} · ${h.year}</div></div><button class="heartbtn" style="position:static" aria-pressed="${!!fav[h.id]}" id="hfav" aria-label="Харесвам"></button></div>
 <div class="slider"><button class="arr l" aria-label="Назад">‹</button><div class="track" id="htrack">${h.ph.map((k,j)=>`<figure class="hslide" data-j="${j}"><img src="img/${k}.webp" alt="${h.cap[j]}" loading="lazy"><figcaption>${h.cap[j]}</figcaption></figure>`).join('')}</div><button class="arr r" aria-label="Напред">›</button></div>
 <div class="dots" id="hdots">${h.ph.map((_,j)=>`<i class="${j?'':'on'}"></i>`).join('')}</div>
 <div class="hgrid"><div><p class="intro">${h.intro}</p><div class="stats">${st.map(c=>`<div class="stat"><b>${c[1]}</b><span>${c[0]}</span></div>`).join('')}</div>
  <div class="box x"><h4>Коледната вечеря</h4><p>${h.din.replace(/<b>25 декември:<\/b>\s*/,'')}</p></div>
  <div class="revs"><div class="box p"><b>Гостите хвалят</b><p>${h.plus}</p></div><div class="box m"><b>Забележки</b><p>${h.minus}</p></div></div></div>
  <div><div class="box"><h4>Архитектура</h4><p>${h.arch}</p></div><div class="box"><h4>Стаите</h4><p>${h.roomsTxt}</p></div><div class="box"><h4>Ресторант и гледка</h4><p>${h.rest} · ${h.view}</p></div><div class="box"><h4>Спа</h4><p>${h.spa}</p></div>
  <div class="btnrow"><a class="btn sm" href="${h.photos}" target="_blank" rel="noopener">Снимки на стаите ↗</a><a class="btn ghost sm" href="https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.full+' Budapest')}&checkin=2026-12-25&checkout=2026-12-27&group_adults=2&no_rooms=1&selected_currency=EUR" target="_blank" rel="noopener">Booking за 25–27.12</a><a class="btn ghost sm" href="${h.site}" target="_blank" rel="noopener">Сайт</a></div></div></div>
 <div class="rooms"><h4>Стаите и цените · 2 нощувки</h4><div class="rlist">${h.rooms.map(r=>`<div class="room"><b>${r[0]}</b><span class="sz">${r[1]!=='—'?r[1]+' м²':''}</span><p>${r[2]}</p><div class="pr"><strong>${r[3]}</strong><span class="t ${r[5]}">${TT[r[5]]}</span></div></div>`).join('')}</div><p class="note">${h.priceNote}</p></div>`;
 const tr=$('#htrack');slider(tr.parentElement);
 tr.addEventListener('scroll',()=>{const w=tr.firstElementChild.offsetWidth+14;const i=Math.round(tr.scrollLeft/w);$$('#hdots i').forEach((d,j)=>d.classList.toggle('on',j===i))},{passive:true});
 $$('.hslide').forEach(f=>f.onclick=()=>openLB(h.ph.map((k,j)=>[k,h.cap[j]]),+f.dataset.j));
 $('#hfav').onclick=e=>{fav[h.id]?delete fav[h.id]:(fav[h.id]=1);svs('bp-fav',fav,(fav[h.id]?'хареса ':'махна ')+h.name);e.currentTarget.setAttribute('aria-pressed',!!fav[h.id]);if(fav[h.id]){burst(e.currentTarget);toast(h.name+' е в избора ♥')}htabs();refreshFav()};
 spot()}
function slider(wrap){const t=wrap.querySelector('.track'),l=wrap.querySelector('.arr.l'),r=wrap.querySelector('.arr.r');if(!t)return;
 const step=()=>(t.firstElementChild?.offsetWidth||300)+14;if(l)l.onclick=()=>t.scrollBy({left:-step()});if(r)r.onclick=()=>t.scrollBy({left:step()})}
htabs();hpanel();

/* ---------- сравни ---------- */
const opts=H.map((h,i)=>`<option value="${i}">${h.name}</option>`).join('');$('#c1').innerHTML=opts;$('#c2').innerHTML=opts;$('#c1').value=0;$('#c2').value=3;
function cheapest(h){const v=h.rooms.filter(r=>r[4]);return v.length?eur(Math.min(...v.map(r=>r[4]))):(h.rooms.find(r=>r[5]==='f')||['','','','по запитване'])[3]}
function cmp(){$('#cmpgrid').innerHTML=[$('#c1').value,$('#c2').value].map(i=>{const h=H[i];return `<div class="cmpcol"><div class="ph card"><img src="img/${h.ph[0]}.webp" alt="${h.name}"></div><h3>${h.name}</h3>${[['Архитектура',h.arch],['Стаите',h.roomsTxt],['Ресторант',h.rest],['Гледка',h.view],['Спа',h.spa],['Оценка',(h.chips.find(c=>/Booking|Expedia|Trip|Hotels|Michelin/.test(c[0]))||['','нов хотел']).join(' ').trim()],['2 нощувки от',cheapest(h)]].map(r=>`<div class="crow"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`}).join('')}
$('#c1').onchange=cmp;$('#c2').onchange=cmp;cmp();

/* ---------- програма ---------- */
let dcur=0;S.slots=ld('bp-slots',[]);
function days(){$('#daytabs').innerHTML=D.map((d,i)=>`<button class="daytab ${i===dcur?'on':''}" data-i="${i}" role="tab"><span>${d[1]}</span><b>${d[0]} дек.</b></button>`).join('');
 $$('.daytab').forEach(b=>b.onclick=()=>{dcur=+b.dataset.i;days()});
 const d=D[dcur];$('#daypanel').style.animation='none';$('#daypanel').offsetHeight;$('#daypanel').style.animation='';
 const mine=S.slots.filter(x=>x.day===dcur).map(x=>[x.time,x.title,x.desc,x]);const all=[...d[3].map(x=>[...x,null])];mine.sort((a,b)=>String(a[0]).localeCompare(String(b[0]))).forEach(m=>{const t=/^\d{1,2}:\d{2}$/.test(m[0])?m[0].padStart(5,'0'):null;let at=all.length;if(t){const k=all.findIndex(x=>/^\d{1,2}:\d{2}/.test(x[0])&&x[0].padStart(5,'0')>t);if(k>=0)at=k}all.splice(at,0,m)});
 $('#daypanel').innerHTML=`<div class="dayhero card ph"><img src="img/${d[2]}.webp" alt=""><div class="cap"><h3>${d[0]} декември</h3><span>${d[1]}</span></div></div><div class="tl">${all.map((s,i)=>`<div class="slot ${s[3]?'mine':''}" style="animation-delay:${i*.07}s"><time>${esc(s[0])}</time><b>${esc(s[1])}</b><span>${esc(s[2])}</span>${s[3]?`<em class="by">добавено от ${esc(s[3].by||'')} <button class="lnk" data-del="${esc(s[3].id)}">изтрий</button></em>`:''}</div>`).join('')}
 <form class="addslot" id="addSlot"><input name="time" placeholder="20:00" maxlength="8" aria-label="Час"><input name="title" placeholder="Какво добавяме към деня…" maxlength="80" aria-label="Какво" required><button class="btn sm">Добави</button></form></div>`;
 $('#addSlot').onsubmit=async e=>{e.preventDefault();const f=e.target;await askWho();const item={id:'s'+Date.now().toString(36),day:dcur,time:f.time.value.trim()||'—',title:f.title.value.trim(),desc:''};
  if(S.on)await api({op:'upsert',list:'slots',item,msg:'добави към програмата: '+item.title});else{S.slots.push({...item,by:ME});sv('bp-slots',S.slots)}days()};
 $$('#daypanel [data-del]').forEach(b=>b.onclick=async()=>{const id=b.dataset.del,it=S.slots.find(x=>x.id===id);if(S.on)await api({op:'remove',list:'slots',id,msg:'махна от програмата: '+(it?it.title:'')});else{S.slots=S.slots.filter(x=>x.id!==id);sv('bp-slots',S.slots)}days()})}
days();


/* ---------- визии ---------- */
const OF=[['Бордо и злато','Коледната вечеря · 25.12','x',[['#5b1a2b','бордо'],['#d4b06a','злато'],['#151012','черно']],'Тя: рокля от бордо кадифе и златни бижута. Той: тъмен костюм с вратовръзка или кърпичка в бордо. Класически коледен тон, който прилича на интериора в дворците.','couple matching burgundy velvet christmas dinner outfit'],
['Черно и шампанско','Круизът · 26.12','x',[['#0e0c0d','черно'],['#e8d6b0','шампанско'],['#8a8a8a','сребро']],'Тя: черна рокля с акцент в цвят шампанско. Той: черно поло и сако. Елегантно и топло на кораба, а на снимка до прозореца с осветения Парламент изглежда страхотно.','couple matching black champagne evening outfit'],
['Камел палта','Разходка в Буда · 26.12','d',[['#b98a5a','камел'],['#efe6d8','крем'],['#3b2a20','кафяво']],'Палта в цвят камел, кремави плетени шалове и тъмни ботуши. Топло за Рибарския бастион и много красиво на фона на белите кули.','couple matching camel coat winter outfit'],
['Коледни плетени шапки','Коледните базари','d',[['#9e1b2c','червено'],['#f4f1ea','бяло'],['#1e4a3a','елхово']],'Еднакви плетени шапки и шалове в червено и бяло, с норвежка шарка. Забавни, топли и идеални за снимка с греяно вино.','couple matching christmas knit beanie scarf'],
['Коледна сутрин','В хотела · 26.12 сутрин','h',[['#7a1f2b','червено каре'],['#f2ece4','кремаво'],['#2d4a36','зелено']],'Еднакви коледни пижами за закуската в стаята или за снимка на леглото. Класика, която винаги става за хубав спомен.','couple matching christmas pajamas'],
['Бани по здрач','Банята Сечени','h',[['#111111','черно'],['#ffffff','бяло'],['#d4b06a','злато']],'Бански в един цвят (черно е безпроблемно) и бели халати и джапанки. Минималистично и изглежда добре на снимка сред парата.','couple matching black swimwear thermal bath'],
['Летищен комфорт','Пътуването · 25 и 27.12','d',[['#d9cbb8','бежово'],['#f5f2ec','бяло'],['#6e6259','тауп']],'Еднакви анцузи или суитшърти в бежово, бели маратонки и голямо палто отгоре. Удобно за полета, а и изглежда добре.','couple matching beige tracksuit airport outfit'],
['Пастел пред бастиона','Сутрешна снимка','d',[['#efe2d2','крем'],['#d9a7a7','пудра'],['#9fb3c8','синьо']],'Светли пастелни тонове за сутрешната снимка на Рибарския бастион. Меката светлина и белият камък ги правят още по-красиви.','couple matching pastel winter outfit photoshoot']];
const OFF=[['all','Всички'],['x','Вечер'],['d','Ден'],['h','В хотела'],['fav','♥ Избрани']];
let ofav=ld('bp-of',{});
$('#of').innerHTML=OFF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
function outfitsAll(){const ov={};S.outfits.forEach(o=>ov[o.id]=o);
 const base=OF.map((o,i)=>{const k=String(i),x=ov['b'+i];const it={key:k,id:'b'+i,title:o[0],when:o[1],cat:o[2],colors:o[3],desc:o[4],q:o[5],builtin:true};return x?{...it,...x,key:k,id:'b'+i,builtin:true,edited:true}:it}).filter(o=>!o.hidden);
 const cust=S.outfits.filter(o=>!o.id.startsWith('b')&&!o.hidden).map(o=>({...o,key:o.id}));return[...base,...cust]}
let OFc='all';
function renderOutfits(){const L=outfitsAll();window._OFL=L;
 $('#outfits').innerHTML=L.map((o,n)=>`<article class="card ac outfit ${OFc==='all'||(OFc==='fav'?ofav[o.key]:o.cat===OFc)?'':'hide'}" data-k="${esc(o.key)}"><div class="sw">${(o.colors||[]).map(c=>`<span style="background:${esc(c[0])}"><i>${esc(c[1])}</i></span>`).join('')}<button class="heartbtn" data-k="${esc(o.key)}" aria-pressed="${!!ofav[o.key]}" aria-label="Харесвам"></button></div><div class="bd"><div class="k">${esc(o.when)}</div><h3>${esc(o.title)}</h3><p>${esc(o.desc)}</p>${o.by||o.ed?`<p class="note">${o.builtin?'Редактирано':'Добавено'} от ${esc(o.ed||o.by)}</p>`:''}<div class="btnrow">${o.q?`<a class="btn ghost sm" href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(o.q)}" target="_blank" rel="noopener">Pinterest ↗</a>`:''}${o.link?`<a class="btn ghost sm" href="${esc(o.link)}" target="_blank" rel="noopener">Линк ↗</a>`:''}<button class="btn ghost sm" data-ed="${esc(o.id)}">Редактирай</button></div></div></article>`).join('')+`<button class="card addcard" id="addOutfit"><span>+</span>Добави визия</button>`;
 $$('#outfits .heartbtn').forEach(b=>b.onclick=()=>{const k=b.dataset.k,o=L.find(x=>x.key===k);ofav[k]?delete ofav[k]:(ofav[k]=1);svs('bp-of',ofav,(ofav[k]?'хареса визия ':'махна визия ')+o.title);b.setAttribute('aria-pressed',!!ofav[k]);if(ofav[k]){burst(b);toast(o.title+' е в избора ♥')}renderOutfits();refreshFav()});
 $$('#outfits [data-ed]').forEach(b=>b.onclick=()=>editOutfit(L.find(x=>x.id===b.dataset.ed)));
 $('#addOutfit').onclick=()=>editOutfit(null)}
function editOutfit(o){const m=$('#ofModal');m.classList.add('on');const f=$('#ofForm');
 const c=(o&&o.colors)||[['#5b1a2b','бордо'],['#d4b06a','злато'],['#151012','черно']];
 f.title.value=o?o.title:'';f.when.value=o?o.when:'';f.cat.value=o?o.cat:'d';f.desc.value=o?o.desc:'';f.link.value=o&&o.link?o.link:'';
 [0,1,2].forEach(i=>{f['c'+i].value=(c[i]||['#888888'])[0];f['n'+i].value=(c[i]||['',''])[1]||''});
 $('#ofDel').hidden=!o;$('#ofDel').textContent=o&&o.builtin?'Скрий':'Изтрий';
 f.onsubmit=async e=>{e.preventDefault();await askWho();const id=o?o.id:'c'+Date.now().toString(36);
  const item={id,title:f.title.value.trim()||'Визия',when:f.when.value.trim(),cat:f.cat.value,desc:f.desc.value.trim(),link:/^https?:\/\//.test(f.link.value.trim())?f.link.value.trim():'',colors:[0,1,2].map(i=>[f['c'+i].value,f['n'+i].value.trim()])};
  if(S.on){await api({op:'upsert',list:'outfits',item,msg:(o?'редактира визия „':'добави визия „')+item.title+'“'})}else{const i=S.outfits.findIndex(x=>x.id===id);i>=0?S.outfits[i]=item:S.outfits.push(item);sv('bp-outfits',S.outfits)}
  m.classList.remove('on');renderOutfits();toast('Записано')};
 $('#ofDel').onclick=async()=>{if(!o)return;await askWho();
  if(o.builtin){const item={id:o.id,title:o.title,hidden:true};if(S.on)await api({op:'upsert',list:'outfits',item,msg:'скри визия „'+o.title+'“'});else{S.outfits=S.outfits.filter(x=>x.id!==o.id);S.outfits.push(item);sv('bp-outfits',S.outfits)}}
  else{if(S.on)await api({op:'remove',list:'outfits',id:o.id,msg:'изтри визия „'+o.title+'“'});else{S.outfits=S.outfits.filter(x=>x.id!==o.id);sv('bp-outfits',S.outfits)}}
  m.classList.remove('on');renderOutfits()};
 $('#ofX').onclick=()=>m.classList.remove('on')}
const ofilt=()=>renderOutfits();
$$('#of button').forEach(b=>b.onclick=()=>{$$('#of button').forEach(x=>x.classList.remove('on'));b.classList.add('on');OFc=b.dataset.f;renderOutfits()});
S.outfits=ld('bp-outfits',[]);
renderOutfits();

/* ---------- круиз ---------- */
$('#cruise').innerHTML=CRU.map(c=>`<div class="flip" tabindex="0" role="button" aria-label="Обърни: ${c[0]}"><div class="fin"><div class="face"><div class="ph"><img src="img/${c[1]}.webp" alt="${c[0]}"></div><div class="fc"><div class="k">${c[2]}</div><h3>${c[0]}</h3><p>${c[3]}</p></div><span class="turn">обърни ↻</span></div><div class="face back"><div class="k">подробности</div><h3>${c[0]}</h3><dl>${c[4].map(d=>`<dt>${d[0]}</dt><dd>${d[1]}</dd>`).join('')}</dl><p style="margin-top:16px">Запитването е изпратено до ${c[5]}.</p><span class="turn">обърни ↻</span></div></div></div>`).join('')+`<div class="cnote" style="grid-column:1/-1">За 26 декември онлайн не се показа опция за маса до прозореца, затова чакаме отговор от компаниите. Ако никоя не гарантира такава маса, вечеряме в ресторант на сушата и правим отделен едночасов панорамен круиз, за около 25 € на човек.</div>`;
$$('.flip').forEach(f=>{f.onclick=()=>f.classList.toggle('on');f.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f.click()}}});

/* ---------- активности ---------- */
const AX={'Коледните базари':'Освен двата големи базара има по-малки в Будайската крепост, в Óbuda и в двора Gozsdu. Пред Базиликата вечер върху фасадата се прожектира светлинно шоу. Носете малко форинти в брой за щандовете, макар че повечето вече приемат карти.',
'Банята Сечени':'Сградата е от 1913 г. Външните басейни са с топла вода от около 30 до 38 °C и се пушат в студа, а местните играят шах във водата. Вътре има над десет по-малки басейна, сауни и парни бани. Вземете си кърпа или наемете на място.',
'Банята Рудаш':'Османският купол над осмоъгълния басейн е от XVI век и още е оригинален. Басейнът на покрива с изглед към Дунава и мостовете е най-хубавото място за залез. В петък и събота има нощно къпане.',
'Рибарският бастион':'Построен е между 1895 и 1902 г. и е кръстен на гилдията на рибарите, която пазела тази част от стената. Долните тераси са безплатни, а горната се плаща срещу малка такса. Нощем е осветен и почти празен.',
'Църквата „Матиаш“':'Тук през 1867 г. са коронясани Франц Йосиф и императрица Сиси за крале на Унгария. Покривът е от цветни плочки Жолнаи, а отвътре стените са изцяло изрисувани.',
'Будайската крепост':'Фуникулерът от Верижния мост работи от 1870 г. и качва за около минута. На хълма са Кралският дворец с Националната галерия и Историческия музей, тесни средновековни улички и гледка към цяла Пеща.',
'Разходка по Дунава':'По брега на Пеща, между Парламента и Верижния мост, са „Обувките на брега на Дунава“: 60 чифта железни обувки, паметник на жертвите от 1944–1945 г. Най-красиво е след залез, когато светнат Парламентът и Крепостта.',
'Трамвай 2':'Линията минава по самия бряг на Пеща, покрай Парламента, Верижния мост и Вигадо. Седнете отдясно, ако пътувате на юг, за най-хубавата гледка към Буда.',
'Парламентът':'Строен е от 1885 до 1904 г. и има 691 помещения. Обиколката минава през Главното стълбище и куполната зала, където се пази Свещената корона на Свети Стефан. Билетите се свършват, затова се купуват онлайн дни по-рано.',
'Базиликата „Св. Стефан“':'Завършена е през 1905 г. Вътре се пази Светата десница, мумифицираната ръка на Свети Стефан. До панорамната тераса на купола се стига с асансьор или по стълбите.',
'Държавната опера':'Открита е през 1884 г. по проект на Миклош Ибл. Отвътре е залата с позлата и стенописи, които са сред най-красивите в Европа. През декември често се дава „Лешникотрошачката“.',
'„Андраши“':'Булевардът е от 1870-те години, а под него минава метро M1. По него са Операта, Домът на терора и луксозните бутици. Свършва при Площада на героите и Градския парк.',
'Gerbeaud':'Основана е през 1858 г. от Хенрик Куглер, а от 1884 г. я води швейцарецът Емил Гербо, на когото е кръстена. Освен торта „Добош“ опитайте и торта „Естерхази“.',
'Руинните барове':'Szimpla Kert е първият руинен бар, от началото на 2000-те. Всяка стая е различна: стари вани, колела, Трабант. В неделя сутрин тук има фермерски пазар.',
'Синагогата на улица „Дохан“':'Построена е между 1854 и 1859 г. и е с около 3000 места. Комплексът включва Еврейския музей и Мемориала на дървото на живота.',
'Сентендре':'Градчето е заселено от сърби през XVII–XVIII век, затова има няколко православни църкви. Има малки галерии, Музей на марципана и уютни кафенета по калдъръмените улички.'};
const FLT={y:['y','отворено'],c:['c','провери'],n:['n','затворено']};
const AF=[['all','Всички'],['d25','Отворено на 25.12'],['d26','Отворено на 26.12'],['free','Безплатно'],['night','Вечер'],['warm','На топло'],['plan','♥ Избрани']];
$('#af').innerHTML=AF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
const AL=A.map(a=>[a[1],a[0]]);
$('#acts').innerHTML=A.map((a,i)=>`<article class="card ac" data-i="${i}"><div class="ph"><img src="img/${a[1]}.webp" alt="${a[0]}" loading="lazy"><span class="pill tag">${a[2]}</span><button class="heartbtn" data-i="${i}" aria-pressed="${!!plan[i]}" aria-label="В плана"></button></div>
<div class="bd"><div class="k">${a[9]}</div><h3>${a[0]}</h3><p>${a[3]}</p><div class="flags"><span class="fl ${FLT[a[4]][0]}">25.12 · ${FLT[a[4]][1]}</span><span class="fl ${FLT[a[5]][0]}">26.12 · ${FLT[a[5]][1]}</span>${a[6]?'<span class="fl y">безплатно</span>':''}${a[7]?'<span class="fl">вечер</span>':''}</div>
<div class="more"><div>${AX[a[0]]?`<p style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">${AX[a[0]]}</p>`:''}<dl><dt>Колко време</dt><dd>${a[10]}</dd><dt>Как се стига</dt><dd>${a[11]}</dd><dt>Празници</dt><dd>${a[13]}</dd><dt>Карта</dt><dd><a href="${M(a[12])}" target="_blank" rel="noopener">Google Maps ↗</a></dd></dl></div></div>
<button class="tog" aria-expanded="false">Подробности</button></div></article>`).join('');
$$('#acts .ph img').forEach(im=>im.onclick=()=>openLB(AL,+im.closest('.ac').dataset.i));
let AFc='all';const afilt=()=>$$('#acts .ac').forEach(c=>{const i=c.dataset.i,a=A[i];const ok=AFc==='all'||(AFc==='d25'&&a[4]==='y')||(AFc==='d26'&&a[5]==='y')||(AFc==='free'&&a[6])||(AFc==='night'&&a[7])||(AFc==='warm'&&a[8])||(AFc==='plan'&&plan[i]);c.classList.toggle('hide',!ok)});
$$('#af button').forEach(b=>b.onclick=()=>{$$('#af button').forEach(x=>x.classList.remove('on'));b.classList.add('on');AFc=b.dataset.f;afilt()});
$$('#acts .heartbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();const i=b.dataset.i;plan[i]?delete plan[i]:(plan[i]=1);svs('bp-plan',plan,(plan[i]?'добави в плана ':'махна от плана ')+A[i][0]);b.setAttribute('aria-pressed',!!plan[i]);if(plan[i]){burst(b);toast(A[i][0]+' е в плана ♥')}afilt();refreshFav()});

/* разгъване (общо) */
document.addEventListener('click',e=>{const t=e.target.closest('.tog');if(!t)return;const c=t.closest('.ac');c.classList.toggle('open');const o=c.classList.contains('open');t.setAttribute('aria-expanded',o);t.textContent=o?'Скрий':'Подробности'});

/* ---------- ресторанти ---------- */
const ILL={Stand:'paprikas_x1','Essência':'tokaji_x0',Rumour:'somloi_x1',Salt:'palinka_x0'};
const rimg=r=>r[2]||ILL[r[0]];
const RF=[['all','Всички'],['x','Коледна вечеря'],['m','Michelin'],['c','Кафенета'],['b','Барове с гледка'],['fav','♥ Избрани']];
$('#rf').innerHTML=RF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
const RL=R.map(r=>[rimg(r),r[0]]);
$('#rest').innerHTML=R.map((r,i)=>`<article class="card ac" data-i="${i}"><div class="ph"><img src="img/${rimg(r)}.webp" alt="${r[0]}" loading="lazy"><span class="pill tag">${r[3]}</span>${r[2]?'':'<span class="illus">илюстрация</span>'}<button class="heartbtn" data-i="${i}" aria-pressed="${!!rfav[i]}" aria-label="Харесвам"></button></div>
<div class="bd"><div class="k">${r[4]}</div><h3>${r[0]}</h3><p>${r[5]}</p>
<div class="more"><div><dl><dt>Да опитате</dt><dd>${r[6]}</dd><dt>Цена</dt><dd>${r[7]}</dd><dt>Адрес</dt><dd>${r[8]}</dd><dt>Коледа</dt><dd>${r[9]}</dd><dt>Карта</dt><dd><a href="${M(r[10])}" target="_blank" rel="noopener">Google Maps ↗</a></dd></dl></div></div>
<button class="tog" aria-expanded="false">Подробности</button></div></article>`).join('');
$$('#rest .ph img').forEach(im=>im.onclick=()=>openLB(RL,+im.closest('.ac').dataset.i));
let RFc='all';const rfilt=()=>$$('#rest .ac').forEach(c=>{const i=c.dataset.i;c.classList.toggle('hide',!(RFc==='all'||(RFc==='fav'?rfav[i]:R[i][1].includes(RFc))))});
$$('#rf button').forEach(b=>b.onclick=()=>{$$('#rf button').forEach(x=>x.classList.remove('on'));b.classList.add('on');RFc=b.dataset.f;rfilt()});
$$('#rest .heartbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();const i=b.dataset.i;rfav[i]?delete rfav[i]:(rfav[i]=1);svs('bp-rest',rfav,(rfav[i]?'хареса ':'махна ')+R[i][0]);b.setAttribute('aria-pressed',!!rfav[i]);if(rfav[i]){burst(b);toast(R[i][0]+' е в избора ♥')}rfilt();refreshFav()});

/* ---------- вкусове ---------- */
$('#food').innerHTML=FD.map(f=>`<div class="flip food" tabindex="0" role="button" aria-label="Обърни: ${f[0]}"><div class="fin"><div class="face"><div class="ph"><img src="img/${f[2]}.webp" alt="${f[0]}" loading="lazy"></div><div class="fc"><div class="hu">${f[1]}</div><h3>${f[0]}</h3><p>${f[3].split('. ')[0]}.</p></div><span class="turn">обърни ↻</span></div><div class="face back"><div class="hu">${f[1]}</div><h3>${f[0]}</h3><p style="font-size:15.5px;margin-top:12px">${f[3]}</p><dl><dt>Къде</dt><dd>${f[4]}</dd></dl><span class="turn">обърни ↻</span></div></div></div>`).join('');
$$('#food .flip').forEach(f=>{f.onclick=()=>f.classList.toggle('on');f.onkeydown=e=>{if(e.key==='Enter'){f.click()}}});
slider($('#food').parentElement);

/* ---------- карта ---------- */
const COL={h:'#e9a3b4',s:'#8cc0e0',r:'#d4b06a',k:'#8fe0a8'};
const MF=[['all','Всички'],['h','Хотели'],['s','Забележителности'],['r','Ядене и пиене'],['k','Круизи']];
$('#mf').innerHTML=MF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
let MAP,LAY={};
function initMap(){if(typeof L==='undefined'){$('#map').innerHTML='<p style="padding:20px">Картата не можа да се зареди.</p>';return}
 MAP=L.map('map',{scrollWheelZoom:false}).setView([47.4995,19.056],14);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap',className:'darktiles'}).addTo(MAP);
 'hsrk'.split('').forEach(t=>LAY[t]=L.layerGroup().addTo(MAP));
 P.forEach(p=>{const ic=L.divIcon({className:'',html:`<div class="pin ${p[3]}" style="background:${COL[p[3]]}"></div>`,iconSize:[30,30],iconAnchor:[15,30],popupAnchor:[0,-28]});
  L.marker([p[1],p[2]],{icon:ic,title:p[0]}).bindPopup(`<b>${p[0]}</b><br>${p[4]}<br><a href="${M(p[0]+' Budapest')}" target="_blank" rel="noopener">Упътване ↗</a>`).addTo(LAY[p[3]])});
 MAP.fitBounds(P.filter(p=>p[2]<19.075).map(p=>[p[1],p[2]]),{padding:[20,20]})}
const mo=new IntersectionObserver(e=>{if(e[0].isIntersecting){initMap();mo.disconnect()}},{rootMargin:'400px'});mo.observe($('#map'));
$$('#mf button').forEach(b=>b.onclick=()=>{$$('#mf button').forEach(x=>x.classList.remove('on'));b.classList.add('on');if(!MAP)return;const f=b.dataset.f;Object.entries(LAY).forEach(([k,g])=>f==='all'||f===k?g.addTo(MAP):MAP.removeLayer(g))});


/* ---------- транспорт ---------- */
const AIR=[['Трансфер от хотела','Най-удобното на 25-и вечер: шофьорът чака с табела на изхода, а цената е фиксирана. Резервира се през хотела.','~35 мин','по запитване','duna_1'],
['Такси Főtaxi','Официалното такси на летището, със стойка точно пред терминала. Плаща се с карта.','25–35 мин','~13 500–15 500 Ft (~35–40 €)','chainbridge_2'],
['Bolt или Uber','И двете работят в Будапеща с лицензирани таксита по същата регулирана тарифа. Цената се вижда в приложението предварително.','25–35 мин','~13 500–15 500 Ft','parliament_3'],
['Автобус 100E','Директно до Kálvin tér и Deák Ferenc tér, денонощно. Нужен е отделен билет за 2 500 Ft, който се плаща с карта на машините или в автобуса.','~40 мин','2 500 Ft на човек','vorosmarty_1']];
const CITY=[['Пеша','Целият център между Парламента, Базиликата, Вьорьошмарти и Матилд се обикаля пеша. От хотелите до повечето места са 5–20 минути.',''],
['Метро и трамваи','Четири линии метро, трамваи и автобуси с един билет. Трамвай 2 минава по брега на Дунава с гледка към Парламента и Крепостта.',''],
['Билети','Единичен 500 Ft, 24-часов 2 750 Ft, 72-часов 5 750 Ft. Най-лесно е през приложението BudapestGO. Фуникулерът не е включен.',''],
['До Крепостта','Фуникулер от Верижния мост или автобус 16 от Deák Ferenc tér, който е с обикновен билет и излиза по-евтино.',''],
['Такси в града','Таксита, Bolt и Uber карат по една и съща регулирана тарифа. Удобно е вечер или за банята Сечени.',''],
['Сигурност','Не се качвайте при шофьори, които сами ви предлагат превоз на летището. Ползвайте стойката на Főtaxi или приложение.','']];
$('#air').innerHTML=AIR.map(a=>`<article class="card ac"><div class="ph" style="height:150px"><img src="img/${a[4]}.webp" alt="" loading="lazy"></div><div class="bd"><h3>${a[0]}</h3><p>${a[1]}</p><div class="flags"><span class="fl c">${a[2]}</span><span class="fl y">${a[3]}</span></div></div></article>`).join('');
$('#city').innerHTML=CITY.map(c=>`<article class="card ac tip"><div class="bd"><h3>${c[0]}</h3><p>${c[1]}</p></div></article>`).join('');
const AP=['Летище Будапеща',47.4386,19.2520,'k','Летището'];
const PTS=[...P.filter(p=>p[3]!=='k'),...P.filter(p=>p[3]==='k'),AP];
const hav=(a,b)=>{const R=6371,toR=x=>x*Math.PI/180,dLa=toR(b[1]-a[1]),dLo=toR(b[2]-a[2]);const q=Math.sin(dLa/2)**2+Math.cos(toR(a[1]))*Math.cos(toR(b[1]))*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(q))};
const route=(a,b)=>{const km=hav(a,b)*1.3,walk=Math.round(km/4.8*60),car=Math.round(km/(km>10?45:16)*60+4);return{km,walk,car}};
const fmtKm=km=>km<1?Math.round(km*1000/10)*10+' м':km.toFixed(1).replace('.',',')+' км';
const hotels=P.filter(p=>p[3]==='h');
$('#dHotel').innerHTML=hotels.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
function dlist(){const h=hotels[+$('#dHotel').value];const L=PTS.filter(p=>p!==h&&p[3]!=='h').map(p=>[p,route(h,p)]).sort((a,b)=>a[1].km-b[1].km);
 $('#dlist').innerHTML=L.map(([p,r])=>`<div class="drow"><span>${p[0]}</span><span class="dm">${r.km>4?'такси '+r.car+' мин':'пеша '+r.walk+' мин'}</span><span class="dk">${fmtKm(r.km)}</span></div>`).join('')}
$('#dHotel').onchange=dlist;dlist();
const po=PTS.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');$('#dFrom').innerHTML=po;$('#dTo').innerHTML=po;
$('#dFrom').value=PTS.findIndex(p=>p[0]==='Matild Palace');$('#dTo').value=PTS.findIndex(p=>p[0]==='Рибарският бастион');
function dres(){const a=PTS[+$('#dFrom').value],b=PTS[+$('#dTo').value],r=route(a,b);
 $('#dres').innerHTML=a===b?'<p class="note">Изберете две различни места.</p>':`<div class="wx"><div><b>${fmtKm(r.km)}</b><span>разстояние</span></div><div><b>${r.walk>90?'—':r.walk+' мин'}</b><span>пеша</span></div><div><b>${r.car} мин</b><span>с такси</span></div></div><a class="btn ghost sm" style="margin-top:12px" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin=${a[1]},${a[2]}&destination=${b[1]},${b[2]}&travelmode=walking">Маршрут в Google Maps ↗</a>`}
$('#dFrom').onchange=dres;$('#dTo').onchange=dres;dres();

/* ---------- адвент ---------- */
const ADV=[['Три града в един','Будапеща се ражда през 1873 г., когато Буда, Пеща и Обуда се обединяват в един град.','duna_1'],
['Първият мост','Верижният мост е открит през 1849 г. Това е първият постоянен мост между Буда и Пеща.','chainbridge_2'],
['96 метра','Парламентът и Базиликата са високи точно по 96 м, в чест на 896 г., когато унгарците се заселват тук. Нищо в центъра не бива да е по-високо.','parliament_1'],
['Най-старото метро','Линия M1 под „Андраши“ е от 1896 г. и е най-старото метро в континентална Европа.','andrassy_2'],
['Град на изворите','Под Будапеща има над сто термални извора, затова я наричат град на баните.','szechenyi_5'],
['Микулаш','На 6 декември унгарските деца оставят лъснати ботушки на прозореца, а Микулаш (Св. Николай) ги пълни с лакомства.','christmas_5'],
['Седемте кули','Рибарският бастион има седем кули, по една за всяко от седемте маджарски племена.','bastion_0'],
['Тортата от 1885 г.','Торта „Добош“ е създадена в Будапеща през 1885 г. Карамеленият капак я пази свежа дълго време.','dobos_x0'],
['Рубик','Рубиковият куб е измислен в Будапеща през 1974 г. от архитекта Ерньо Рубик.','opera_4'],
['Химикалката','Химикалката е изобретение на унгареца Ласло Биро.','gerbeaud_4'],
['Коледа на 24-и','Унгарците празнуват на Бъдни вечер, 24 декември, която наричат Szenteste, „Светата вечер“.','vorosmarty_4'],
['Бейгли','Коледният сладкиш в Унгария е бейгли: навито тесто с орехи или мак.','kurtos_x1'],
['Бонбони по елхата','На унгарската елха се окачват szaloncukor: шоколадови бонбони, увити в лъскава хартия.','matild_1'],
['Базарът','Коледният базар на площад Вьорьошмарти се провежда от 1998 г. и е сред най-известните в Европа.','vorosmarty_1'],
['Gerbeaud','Сладкарница Gerbeaud е отворена от 1858 г. и днес е символ на града.','gerbeaud_2'],
['Островът','Остров Маргит е дълъг 2,5 км и е като парк насред Дунава.','duna_1'],
['ЮНЕСКО','Бреговете на Дунава, Будайската крепост и булевард „Андраши“ са световно наследство на ЮНЕСКО.','castle_3'],
['Банята от XVI век','Банята Рудаш е построена от османците през XVI век. Куполът ѝ още е оригинален.','rudas_2'],
['Близнаците','Matild и Клотилдиният дворец са еднакви „близнаци“ от 1902 г. Днес в единия е Matild, а в другия St. Regis.','klotild_3'],
['Площадът на героите','Площадът на героите е построен за хилядолетието на унгарската държава, отбелязано през 1896 г.','andrassy_2'],
['Роднини с финландците','Унгарският е угро-фински език, далечен роднина на финския и естонския.','parisi_2'],
['Бастионът','Рибарският бастион е построен между 1895 и 1902 г. и никога не е служил за защита. Правен е само заради гледката.','bastion_1'],
['Кой носи подаръците','В Унгария подаръците под елхата не ги носи Дядо Коледа, а Jézuska, Младенецът Исус.','basilica_4'],
['Утре заминаваме','Полетът е утре в 14:35. Весела Коледа!','castle_0']];
const now=new Date();
const advOpen=ld('bp-adv',{});
$('#adv').innerHTML=ADV.map((a,i)=>{const d=new Date(2026,11,i+1),un=now>=d,today=now.toDateString()===d.toDateString();return `<button class="door ${un?'':'locked'} ${today?'today':''} ${un&&advOpen[i]?'open':''}" data-i="${i}" aria-label="${i+1} декември"><span class="dfront"><b>${i+1}</b><i>${un?'отвори':'заключено'}</i></span><span class="dback" style="background-image:linear-gradient(rgba(14,10,12,.45),rgba(14,10,12,.75)),url(img/${a[2]}.webp)"><b style="font:600 20px 'Cormorant Garamond',serif;color:#fff">${a[0]}</b></span></button>`}).join('')+'<div class="advfact" id="advfact" style="grid-column:1/-1"></div>';
const dleft=Math.ceil((new Date(2026,11,1)-now)/864e5);
$('#advfact').innerHTML=dleft>0?`<b>Първото прозорче се отваря на 1 декември</b><span style="color:var(--mute)">Остават още ${dleft} дни. Дотогава вратичките са заключени.</span>`:'<b>Отворете днешното прозорче</b><span style="color:var(--mute)">Всеки ден по едно.</span>';
$$('.door').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(b.classList.contains('locked')){b.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:300});toast('Отваря се на '+(i+1)+' декември');return}
 b.classList.add('open');advOpen[i]=1;sv('bp-adv',advOpen);$('#advfact').innerHTML=`<b>${i+1} декември · ${ADV[i][0]}</b>${ADV[i][1]}`});

/* ---------- унгарски ---------- */
const PH=[['Здрасти / Чао','Szia!','сия'],['Добър вечер','Jó estét!','йо ещет'],['Благодаря','Köszönöm!','кьосьоньом'],['Моля','Kérem','керем'],['Наздраве!','Egészségedre!','егесшегедре'],['Весела Коледа!','Boldog karácsonyt!','болдог карачоньт'],['Обичам те','Szeretlek','серетлек'],['Едно греяно вино, моля','Egy forralt bort kérek','ед форалт борт керек'],['Сметката, моля','A számlát kérem','а самлат керем'],['Колко струва?','Mennyibe kerül?','меньибе керюл'],['Вкусно!','Finom!','фином'],['Добър апетит!','Jó étvágyat!','йо етвадят'],['Извинете','Bocsánat','бочанат'],['Да / Не','Igen / Nem','иген / нем'],['Красиво!','Gyönyörű!','дьоньорю']];
$('#phr').innerHTML=PH.map(p=>`<button class="pc" aria-label="${p[0]}"><span class="pi"><span class="pf"><b>${p[0]}</b><span>натисни за унгарски</span></span><span class="pb"><b>${p[1]}</b><span>чете се: „${p[2]}“</span><i>${p[0]}</i></span></span></button>`).join('');
$$('.pc').forEach(b=>b.onclick=()=>b.classList.toggle('on'));

/* ---------- бюджет ---------- */
const cRoom=$('#cRoom');
function fillRooms(){const cv=cRoom.value;let o='<option value="568|Corinthia · Deluxe">Corinthia · Deluxe – 568 € (оферта)</option>';
 H.forEach(h=>h.rooms.filter(r=>r[4]).forEach(r=>{o+=`<option value="${r[4]}|${h.name} · ${r[0]}">${fav[h.id]?'♥ ':''}${h.name} · ${r[0]} – ${eur(r[4])}${r[5]==='e'?' (оценка)':''}</option>`}));
 cRoom.innerHTML=o;cRoom.value=[...cRoom.options].some(x=>x.value===cv)?cv:'788|Matild Palace · King Deluxe';calc()}
function calc(){const [rv,rn]=cRoom.value.split('|');const P2=[['Самолетни билети (купени)',392.47,'#8cc0e0'],[rn,+rv,'#e9a3b4'],['Вечеря 25.12',+$('#cDin').value,'#d4b06a'],['Круиз 26.12',+$('#cCr').value,'#8fe0a8'],['Други разходи',+$('#cEx').value,'#b8a7ad']];
 const t=P2.reduce((a,p)=>a+p[1],0);$('#exV').textContent=$('#cEx').value;const tot=$('#tot');tot.textContent=eur(t);tot.classList.add('bump');setTimeout(()=>tot.classList.remove('bump'),250);
 $('#donut').innerHTML=P2.map(p=>`<i style="width:${p[1]/t*100}%;background:${p[2]}"></i>`).join('');
 $('#rows').innerHTML=P2.map(p=>`<div><span><span class="dot" style="background:${p[2]}"></span>${p[0]}</span><span>${eur(p[1])}</span></div>`).join('')+``}
[cRoom,$('#cDin'),$('#cCr')].forEach(e=>e.onchange=calc);$('#cEx').oninput=calc;fillRooms();

/* ---------- инструменти ---------- */
const huf=$('#huf'),eurI=$('#eurI'),rate=$('#rate'),rr=()=>+rate.value||395;
huf.oninput=()=>{eurI.value=huf.value?(huf.value/rr()).toFixed(2):''};eurI.oninput=()=>{huf.value=eurI.value?Math.round(eurI.value*rr()):''};rate.oninput=()=>huf.oninput();
$('#quick').innerHTML=[1000,2500,5000,10000,20000,45000].map(v=>`<button data-v="${v}">${v.toLocaleString('bg-BG')} Ft</button>`).join('');
$$('#quick button').forEach(b=>b.onclick=()=>{huf.value=b.dataset.v;huf.oninput();$$('#quick button').forEach(x=>x.classList.toggle('on',x===b))});huf.oninput();
let ck=ld('bp-ck',{});
$('#chk').innerHTML=CK.map((c,i)=>`<li><label><input type="checkbox" data-i="${i}" ${ck[i]?'checked':''}><span>${c}</span></label></li>`).join('');
const pb=()=>$('#pb').style.width=(Object.keys(ck).filter(k=>k<CK.length).length/CK.length*100)+'%';pb();
$$('#chk input').forEach(x=>x.onchange=()=>{x.checked?ck[x.dataset.i]=1:delete ck[x.dataset.i];sv('bp-ck',ck);pb();if(Object.keys(ck).length===CK.length)toast('Всичко е събрано ✓')});
const TIPS=[['Пари','Плаща се във форинти (HUF), около 395 HUF за 1 €. С карта се плаща навсякъде. Ако терминалът предложи сметка в евро, изберете форинти, защото курсът е по-добър.'],['От летището','До центъра се стига за около 35 минути с кола. Хотелите предлагат трансфер, а на 25-и вечер това е най-лесното. Официалните таксита са на Főtaxi.'],['Празниците','25 и 26 декември са официални празници. Магазините почиват, а ресторантите работят с празнично меню. Резервирайте всичко предварително.'],['Банята','Вземете бански, джапанки и шапка за басейна. Билетите за Сечени е по-добре да са онлайн. Най-красиво е по здрач, сред парата.'],['Облекло','Студено и влажно, с вятър откъм Дунава. За вечерите е подходящо нещо елегантно, а за разходките удобни топли обувки.'],['Бакшиш','Обичайно е 10–15%. Проверете дали в сметката вече е включена такса обслужване („szervizdíj“).'],['Транспорт','Центърът се обикаля пеша. Трамвай 2 по брега на Дунава е най-красивият евтин маршрут.']];
$('#tips').innerHTML=TIPS.map(t=>`<details><summary>${t[0]}</summary><p>${t[1]}</p></details>`).join('');


/* ---------- клипове ---------- */
const VID=[['MjY8_MDtBUU','Advent Bazilika в 4K','Разходка по коледния базар пред Базиликата, в първия уикенд','m'],
['1lIWaKuci4Q','Базарът на Вьорьошмарти','От Deák tér през Fashion Street до площад Вьорьошмарти','m'],
['0kCdqc3wFdI','Будапеща в сняг','Разходка от Буда до базара пред Базиликата под силен снеговалеж','m'],
['JxGckAY0VsM','Вечерен круиз по Дунава','Покрай осветения Парламент, Крепостта и Верижния мост','n'],
['Dj9v7DRLsQU','Вечер по брега на Дунава','Парламентът и Верижният мост нощем, в 4K','n'],
['sOpZbfZBoD0','Будайската крепост нощем','Крепостта, Парламентът и Дунавът, в 4K HDR','n'],
['3a7ACWbBJAI','Зимна разходка по „Андраши“','От Операта до банята Сечени','n'],
['AjlIU7jpL7M','Банята Сечени през зимата','Какво е да се къпеш навън в студа','b'],
['7YFfpgSgSvE','Коледа в Будапеща','Влог: Будайската крепост, банята Сечени и базарът на Вьорьошмарти','v'],
['NguI9egy8pE','Будапеща през декември','Влог: Парламентът, коледните базари и банята Сечени','v']];
const VF=[['all','Всички'],['m','Коледни базари'],['n','Нощем'],['b','Бани'],['v','Влогове']];
$('#vf').innerHTML=VF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
$('#vids').innerHTML=VID.map((v,i)=>`<article class="card vid" data-c="${v[3]}"><button class="vth" data-id="${v[0]}" aria-label="Пусни: ${v[1]}"><img src="https://i.ytimg.com/vi/${v[0]}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span></button><div class="bd"><h3>${v[1]}</h3><p>${v[2]}</p><a href="https://www.youtube.com/watch?v=${v[0]}" target="_blank" rel="noopener" class="note">Отвори в YouTube ↗</a></div></article>`).join('');
$$('.vth').forEach(b=>b.onclick=()=>{$$('.vid iframe').forEach(f=>{const p=f.parentElement;p.innerHTML=p.dataset.orig});const box=b;box.dataset.orig=box.innerHTML;box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0&playsinline=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;box.onclick=null});
$$('#vf button').forEach(b=>b.onclick=()=>{$$('#vf button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const f=b.dataset.f;$$('.vid').forEach(v=>v.classList.toggle('hide',!(f==='all'||v.dataset.c===f)))});

/* ---------- галерия ---------- */
const GAL=[['castle_0','Крепостта и Верижният мост'],['nycafe_2','Кафене New York'],['parisi_4','Párisi Udvar'],['basilica_4','Базиликата по Коледа'],['gresham2_2','Куполът на Gresham'],['szechenyi_5','Сечени нощем'],['matild_0','Matild Palace'],['christmas_5','Коледният базар'],['parliament_3','Парламентът от Дунава'],['bastion_1','Рибарският бастион'],['opera_4','Операта'],['dobos_x0','Торта „Добош“'],['drechsler_1','Дворецът Дрекслер'],['matthias_3','Църквата „Матиаш“'],['szentendre_5','Сентендре по Коледа'],['dorothea_3','Dorothea'],['vorosmarty_1','Вьорьошмарти'],['kurtos_x1','Курточ калач'],['gerbeaud_4','Gerbeaud'],['chainbridge_2','Верижният мост']];
$('#gal').innerHTML=GAL.map((g,i)=>`<button data-i="${i}" aria-label="${g[1]}"><img src="img/${g[0]}.webp" alt="${g[1]}" loading="lazy"><span>${g[1]}</span></button>`).join('');
$$('#gal button').forEach(b=>b.onclick=()=>openLB(GAL,+b.dataset.i));

/* ---------- избор и споделяне ---------- */
function picks(){const OL=window._OFL||[];const o=Object.keys(ofav).map(k=>(OL.find(x=>x.key===k)||{}).title).filter(Boolean);return{h:H.filter(h=>fav[h.id]).map(h=>h.name),a:Object.keys(plan).filter(k=>A[k]).map(k=>A[k][0]),r:Object.keys(rfav).filter(k=>R[k]).map(k=>R[k][0]),o}}
function refreshFav(){const p=picks(),n=p.h.length+p.a.length+p.r.length+p.o.length;$('#badge').hidden=!n;$('#badge').textContent=n;
 const sec=(t,l)=>l.length?`<p><b>${t}:</b> ${l.join(' · ')}</p>`:'';
 $('#mine').innerHTML=n?sec('Хотели',p.h)+sec('Места',p.a)+sec('Ресторанти и барове',p.r)+sec('Визии',p.o):'<p style="opacity:.8">Още нищо не е избрано. Натискай ♡ при хотелите, местата и ресторантите или в „Бърз избор“.</p>';
 htabs();fillRooms()}
refreshFav();
$('#shareBtn').onclick=async()=>{const p=picks();const t='♥ Коледа в Будапеща · моят избор\n'+(p.h.length?'\nХотели: '+p.h.join(', '):'')+(p.a.length?'\nМеста: '+p.a.join(', '):'')+(p.r.length?'\nРесторанти: '+p.r.join(', '):'')+(p.o.length?'\nВизии: '+p.o.join(', '):'')+((p.h.length+p.a.length+p.r.length+p.o.length)?'':'\n(още нищо не е избрано)');
 const url=location.origin+location.pathname;
 try{if(navigator.share){await navigator.share({title:'Коледа с Венито ♥',text:t,url});return}}catch(e){if(e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(t+'\n'+url);toast('Копирано, поставете го в чата')}catch(e){toast('Не можа да се сподели')}};


/* ---------- бележки и промени ---------- */
function renderNotes(){const N=S.notes;$('#notesList').innerHTML=N.length?N.map(n=>`<li class="${n.done?'done':''}"><label><input type="checkbox" data-id="${esc(n.id)}" ${n.done?'checked':''}><span>${esc(n.text)}</span></label><em>${esc(n.by||'')}</em><button class="lnk" data-del="${esc(n.id)}" aria-label="Изтрий">✕</button></li>`).join(''):'<li class="empty">Още няма бележки. Добавете идея, желание или нещо за проверка.</li>';
 $$('#notesList input').forEach(x=>x.onchange=async()=>{const n=S.notes.find(y=>y.id===x.dataset.id);n.done=x.checked;await askWho();if(S.on)await api({op:'upsert',list:'notes',item:n,msg:(n.done?'отметна: ':'махна отметката: ')+n.text});else sv('bp-notes',S.notes);renderNotes()});
 $$('#notesList [data-del]').forEach(b=>b.onclick=async()=>{const n=S.notes.find(y=>y.id===b.dataset.del);await askWho();if(S.on)await api({op:'remove',list:'notes',id:n.id,msg:'изтри бележка: '+n.text});else{S.notes=S.notes.filter(y=>y!==n);sv('bp-notes',S.notes)}renderNotes()})}
$('#noteForm').onsubmit=async e=>{e.preventDefault();const t=e.target.text.value.trim();if(!t)return;await askWho();const item={id:'n'+Date.now().toString(36),text:t,done:false};
 if(S.on)await api({op:'upsert',list:'notes',item,msg:'добави бележка: '+t});else{S.notes.push({...item,by:ME});sv('bp-notes',S.notes)}e.target.reset();renderNotes()};
const ago=t=>{const d=(Date.now()-t)/1000;if(d<60)return'току-що';if(d<3600)return Math.floor(d/60)+' мин';if(d<86400)return Math.floor(d/3600)+' ч';return new Date(t).toLocaleDateString('bg-BG',{day:'numeric',month:'short'})};
function renderLog(){const L=S.log.slice(0,40);$('#logList').innerHTML=L.length?L.map(l=>`<li><b>${esc(l.who)}</b> ${esc(l.txt)}<time>${ago(l.t)}</time></li>`).join(''):`<li class="empty">${S.on?'Още няма промени.':'Списъкът с промени ще се появи, когато споделянето е включено.'}</li>`}
S.notes=ld('bp-notes',[]);
function rerender(){try{htabs();const hb=$('#hfav');if(hb)hb.setAttribute('aria-pressed',!!fav[H[cur].id]);
 $$('#acts .heartbtn').forEach(b=>b.setAttribute('aria-pressed',!!plan[b.dataset.i]));$$('#rest .heartbtn').forEach(b=>b.setAttribute('aria-pressed',!!rfav[b.dataset.i]));
 afilt();rfilt();renderOutfits();days();renderNotes();renderLog();refreshFav()}catch(e){}}
$('#whoChip').onclick=()=>{ME='';askWho()};whoChip();
renderNotes();renderLog();syncBanner();
pull();setInterval(()=>{if(!document.hidden)pull()},20000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)pull()});

/* ---------- навигация ---------- */
const links=[...$$('.navin a')];
$('#sheetIn').innerHTML=links.map(a=>`<a href="${a.getAttribute('href')}">${a.textContent}</a>`).join('');
$('#moreBtn').onclick=()=>$('#sheet').classList.add('on');
$('#sheet').onclick=e=>{if(e.target.id==='sheet'||e.target.tagName==='A')$('#sheet').classList.remove('on')};
const secObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));const on=links.find(a=>a.classList.contains('on'));if(on)hcenter($('.navin'),on);$$('.tabbar a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id))}}),{rootMargin:'-45% 0px -50% 0px'});
$$('.sec').forEach(s=>secObs.observe(s));
const pg=$('#prog');let pk=false;addEventListener('scroll',()=>{if(pk)return;pk=true;requestAnimationFrame(()=>{const h=document.documentElement;pg.style.transform=`scaleX(${h.scrollTop/(h.scrollHeight-h.clientHeight)})`;pk=false})},{passive:true});

/* ---------- снимки (лиценз) ---------- */
$('#credList').innerHTML=Object.entries(CR).map(([k,c])=>`<a href="${c[2]}" target="_blank" rel="noopener">${c[0]} · ${c[1]}</a>`).join('');
$('#credBtn').onclick=()=>$('#credModal').classList.add('on');$('#credX').onclick=()=>$('#credModal').classList.remove('on');
$('#credModal').onclick=e=>{if(e.target.id==='credModal')$('#credModal').classList.remove('on')};

/* ---------- ефекти ---------- */
function spot(){if(!FINE)return;$$('.card').forEach(c=>{if(c.dataset.sp)return;c.dataset.sp=1;c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')})})}
spot();
if(FINE&&!RM)$$('.tilt').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
if(!RM&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
 const add=(sel,stag)=>$$(sel).forEach((el,i)=>{el.classList.add('rv');if(stag)el.style.setProperty('--d',(i%3)*.08+'s');io.observe(el)});
 add('.sh');add('.tcard',1);add('#acts .ac',1);add('#rest .ac',1);add('.flip:not(.food)',1);add('.tool',1);add('.calc');add('.quiz');add('.share');add('.door',1);add('#air .ac',1);add('#city .ac',1);add('.pc',1);add('#gal button',1);add('.vid',1);add('.deckwrap');add('.mapwrap');add('.cmpgrid')}
})();
