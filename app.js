/* Коледа с Венито — логика */
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const hcenter=(box,el)=>{if(!box||!el)return;box.scrollTo({left:el.offsetLeft-box.clientWidth/2+el.offsetWidth/2,behavior:RM?'auto':'smooth'})};
const FINE=matchMedia('(pointer:fine)').matches;
const eur=n=>Math.round(n).toLocaleString('bg-BG').replace(/ /g,' ')+' €';
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1900)}
function burst(el){if(RM)return;const r=el.getBoundingClientRect();for(let i=0;i<9;i++){const s=document.createElement('span');s.className='burst';s.textContent='♥';s.style.left=(r.left+r.width/2-8)+'px';s.style.top=(r.top+r.height/2-10)+'px';const a=Math.random()*Math.PI*2,d=40+Math.random()*50;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d-20+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1000)}}

/* ---------- данни за избора ---------- */
let fav=ld('bp-fav',{}),plan=ld('bp-plan',{}),rfav=ld('bp-rest',{});
const hcap=h=>h.cap[0];

/* ---------- лайтбокс ---------- */
let LB=[],LI=0;
const showLB=()=>{const [k,c]=LB[LI];$('#lbi').src=/^https?:/.test(k)?k:'img/'+k+'.webp';$('#lbi').alt=c;$('#lbc').textContent=c};
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
if(sessionStorage.getItem('bp-intro')){intro.remove()}else{const s=snow($('#isnow'),70);s(true);document.body.style.overflow='hidden';
 $('#openInv').onclick=()=>{intro.classList.add('gone');document.body.style.overflow='';try{sessionStorage.setItem('bp-intro','1')}catch(e){};burst($('#openInv'));setTimeout(()=>{s(false);intro.remove()},1000)}}

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
  c.innerHTML=`<img src="img/${h.ph[0]}.webp" alt="${h.name}"><span class="stamp s-yes">ХАРЕСВАМ</span><span class="stamp s-no">НЕ</span><div class="dc"><span class="pill">${h.top?'★ Нашият хотел · ':''}${h.brand}</span><h3>${h.name}</h3><p>${h.arch} · ${h.view}${cheap.length?' · от '+eur(Math.min(...cheap))+' за 2 нощи':''}</p></div>`;
  dk.appendChild(c);if(top)drag(c,hi)});
 $('#deckres').textContent=`${pos+1} от ${order.length}`}
function decide(hi,yes,c){hist.push([hi,fav[H[hi].id]]);if(yes){fav[H[hi].id]=1;burst($('#dYes'))}else delete fav[H[hi].id];sv('bp-fav',fav);
 c.style.transition='transform .5s,opacity .5s';c.style.transform=`translateX(${yes?520:-520}px) rotate(${yes?24:-24}deg)`;c.style.opacity=0;pos++;setTimeout(()=>{deckRender();refreshFav()},380)}
function drag(c,hi){let x0=0,dx=0,down=false;
 c.addEventListener('pointerdown',e=>{down=true;x0=e.clientX;c.setPointerCapture(e.pointerId);c.style.transition='none'});
 c.addEventListener('pointermove',e=>{if(!down)return;dx=e.clientX-x0;c.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;c.querySelector('.s-yes').style.opacity=Math.max(0,dx/120);c.querySelector('.s-no').style.opacity=Math.max(0,-dx/120)});
 const up=()=>{if(!down)return;down=false;if(Math.abs(dx)>110)decide(hi,dx>0,c);else{c.style.transition='transform .4s';c.style.transform='';c.querySelectorAll('.stamp').forEach(s=>s.style.opacity=0)}dx=0};
 c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up)}
$('#dYes').onclick=()=>{const c=$$('.dcard').pop();if(c)decide(order[pos],true,c)};
$('#dNo').onclick=()=>{const c=$$('.dcard').pop();if(c)decide(order[pos],false,c)};
$('#dUndo').onclick=()=>{if(!hist.length)return;const [hi,was]=hist.pop();if(was)fav[H[hi].id]=1;else delete fav[H[hi].id];sv('bp-fav',fav);pos=Math.max(0,pos-1);deckRender();refreshFav()};
deckRender();

/* ---------- хотели ---------- */
const TT={v:'за 25–27.12',e:'оценка',f:'публикувана „от“',q:'по запитване'};
let cur=0;
function htabs(){$('#htabs').innerHTML=H.map((h,i)=>`<button class="htab ${i===cur?'on':''}" role="tab" aria-selected="${i===cur}" data-i="${i}"><img src="img/${h.ph[0]}.webp" alt="">${h.name}${h.top?' <span class="htop">резервиран</span>':''}${fav[h.id]?' <span class="h">♥</span>':''}</button>`).join('');
 $$('.htab').forEach(b=>b.onclick=()=>{cur=+b.dataset.i;htabs();hpanel();hcenter($('#htabs'),$(`.htab[data-i="${cur}"]`))})}
function hpanel(){const h=H[cur],p=$('#hpanel');p.style.animation='none';p.offsetHeight;p.style.animation='';
 const st=h.chips.slice(0,4);
 p.innerHTML=`<div class="hp-top"><div><span class="kk">${h.top?'★ Нашият хотел · ':''}${h.brand}</span><h3>${h.name}</h3><div class="meta">${h.addr} · ${h.year}</div></div><button class="heartbtn" style="position:static" aria-pressed="${!!fav[h.id]}" id="hfav" aria-label="Харесвам"></button></div>
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
 $('#hfav').onclick=e=>{fav[h.id]?delete fav[h.id]:(fav[h.id]=1);sv('bp-fav',fav);e.currentTarget.setAttribute('aria-pressed',!!fav[h.id]);if(fav[h.id]){burst(e.currentTarget);toast(h.name+' е в избора ♥')}htabs();refreshFav()};
 spot()}
function slider(wrap){const t=wrap.querySelector('.track'),l=wrap.querySelector('.arr.l'),r=wrap.querySelector('.arr.r');if(!t)return;
 const step=()=>(t.firstElementChild?.offsetWidth||300)+14;if(l)l.onclick=()=>t.scrollBy({left:-step()});if(r)r.onclick=()=>t.scrollBy({left:step()})}
htabs();hpanel();

/* ---------- сравни ---------- */
const opts=H.map((h,i)=>`<option value="${i}">${h.name}</option>`).join('');$('#c1').innerHTML=opts;$('#c2').innerHTML=opts;$('#c1').value=0;$('#c2').value=Math.min(1,H.length-1);
function cheapest(h){const v=h.rooms.filter(r=>r[4]);return v.length?eur(Math.min(...v.map(r=>r[4]))):(h.rooms.find(r=>r[5]==='f')||['','','','по запитване'])[3]}
function cmp(){$('#cmpgrid').innerHTML=[$('#c1').value,$('#c2').value].map(i=>{const h=H[i];return `<div class="cmpcol"><div class="ph card"><img src="img/${h.ph[0]}.webp" alt="${h.name}"></div><h3>${h.name}</h3>${[['Архитектура',h.arch],['Стаите',h.roomsTxt],['Ресторант',h.rest],['Гледка',h.view],['Спа',h.spa],['Оценка',(h.chips.find(c=>/Booking|Expedia|Trip|Hotels|Michelin/.test(c[0]))||['','нов хотел']).join(' ').trim()],['2 нощувки от',cheapest(h)]].map(r=>`<div class="crow"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`}).join('')}
$('#c1').onchange=cmp;$('#c2').onchange=cmp;cmp();

/* ---------- програма ---------- */
let dcur=0;
function days(){$('#daytabs').innerHTML=D.map((d,i)=>`<button class="daytab ${i===dcur?'on':''}" data-i="${i}" role="tab"><span>${d[1]}</span><b>${d[0]} дек.</b></button>`).join('');
 $$('.daytab').forEach(b=>b.onclick=()=>{dcur=+b.dataset.i;days()});
 const d=D[dcur];$('#daypanel').style.animation='none';$('#daypanel').offsetHeight;$('#daypanel').style.animation='';
 $('#daypanel').innerHTML=`<div class="dayhero card ph"><img src="img/${d[2]}.webp" alt=""><div class="cap"><h3>${d[0]} декември</h3><span>${d[1]}</span></div></div><div class="tl">${d[3].map((s,i)=>`<div class="slot ${s[3]?'simg':''}" style="animation-delay:${i*.09}s">${s[3]?`<button class="sth" data-k="${s[3]}" aria-label="Снимка: ${s[1]}"><img src="img/${s[3]}.webp" alt="" loading="lazy"></button>`:''}<time>${s[0]}</time><b>${s[1]}</b><span>${s[2]}</span></div>`).join('')}</div>`;
 const SI=d[3].filter(s=>s[3]);$$('#daypanel .sth').forEach(b=>b.onclick=()=>openLB(SI.map(s=>[s[3],s[1]]),SI.findIndex(s=>s[3]===b.dataset.k)))}
days();


/* ---------- визии ---------- */
const OF=[['Бордо и злато','Коледната вечеря · 25.12','x',[['#5b1a2b','бордо'],['#d4b06a','злато'],['#151012','черно']],'Тя: рокля от бордо кадифе и златни бижута. Той: тъмен костюм с вратовръзка или кърпичка в бордо. Класически коледен тон, който прилича на интериора в дворците.','couple matching burgundy velvet christmas dinner outfit'],
['Черно и шампанско','Круизът · 26.12','x',[['#0e0c0d','черно'],['#e8d6b0','шампанско'],['#8a8a8a','сребро']],'Тя: черна рокля с акцент в цвят шампанско. Той: черно поло и сако. Елегантно и топло на кораба, а на снимка до прозореца с осветения Парламент изглежда страхотно.','couple matching black champagne evening outfit'],
['Камел палта','Разходка в Буда · 26.12','d',[['#b98a5a','камел'],['#efe6d8','крем'],['#3b2a20','кафяво']],'Палта в цвят камел, кремави плетени шалове и тъмни ботуши. Топло за Рибарския бастион и много красиво на фона на белите кули.','couple matching camel coat winter outfit'],
['Коледни плетени шапки','Коледните базари','d',[['#9e1b2c','червено'],['#f4f1ea','бяло'],['#1e4a3a','елхово']],'Еднакви плетени шапки и шалове в червено и бяло, с норвежка шарка. Забавни, топли и идеални за снимка с греяно вино.','couple matching christmas knit beanie scarf'],
['Коледна сутрин','В хотела · 26.12 сутрин','h',[['#7a1f2b','червено каре'],['#f2ece4','кремаво'],['#2d4a36','зелено']],'Еднакви коледни пижами за закуската в стаята или за снимка на леглото. Класика, която винаги става за хубав спомен.','couple matching christmas pajamas'],
['Бани по здрач','Банята Сечени','h',[['#111111','черно'],['#ffffff','бяло'],['#d4b06a','злато']],'Бански в един цвят (черно е безпроблемно) и бели халати и джапанки. Минималистично и изглежда добре на снимка сред парата.','couple matching black swimwear thermal bath'],
['Летищен комфорт','Пътуването · 25 и 27.12','d',[['#d9cbb8','бежово'],['#f5f2ec','бяло'],['#6e6259','тауп']],'Еднакви анцузи или суитшърти в бежово, бели маратонки и голямо палто отгоре. Удобно за полета, а и изглежда добре.','couple matching beige tracksuit airport outfit'],
['Пастел пред бастиона','Сутрешна снимка','d',[['#efe2d2','крем'],['#d9a7a7','пудра'],['#9fb3c8','синьо']],'Светли пастелни тонове за сутрешната снимка на Рибарския бастион. Меката светлина и белият камък ги правят още по-красиви.','couple matching pastel winter outfit photoshoot'],
["Изумрудена вечер", "Вечеря в Gerbeaud или New York Café", "x", [["#0f4a3c", "изумрудено"], ["#d4b06a", "злато"], ["#f4efe6", "слонова кост"]], "Тя: рокля или пола от изумрудено кадифе със златни обеци. Той: тъмно сако с изумрудена кърпичка или вратовръзка. Наситеното зелено стои прекрасно на фона на позлатата в кафенетата.", "couple emerald green velvet christmas outfit"],
["Тъмносиньо и сребро", "Опера или концерт", "x", [["#16223f", "нощно синьо"], ["#c9ccd3", "сребро"], ["#0e0c0d", "черно"]], "Тя: тъмносиня сатенена рокля и сребърни бижута. Той: тъмносин костюм с бяла риза, без вратовръзка или с тънка сребриста. Елегантно, без да е прекалено официално.", "couple navy blue silver formal winter outfit"],
["Тотално черно", "Покрив бар вечерта", "x", [["#0b0a0a", "черно"], ["#2a2626", "графит"], ["#d4b06a", "злато"]], "И двамата изцяло в черно: тя с кожено яке или черна рокля и ботуши, той с черен пуловер с поло и черни панталони. Един златен акцент като часовник или колие. Изглежда стилно на всяка нощна снимка.", "couple all black outfit night city winter"],
["Червено и бяло", "Коледния ден по улиците", "d", [["#b3122e", "червено"], ["#f7f4ee", "бяло"], ["#1d1b1b", "черно"]], "Тя: червено палто или червен шал. Той: бял пуловер и червен шал в същия тон. Класическата коледна комбинация, която изпъква на всяка снимка от базара.", "couple red white christmas market outfit"],
["Каре в тон", "Разходка по Андраши", "d", [["#6b2b2b", "кафяво-червено каре"], ["#c8b79e", "пясъчно"], ["#2e2a27", "тъмно кафяво"]], "Еднакви карирани шалове (или тя с карирана пола, той с карирана риза) и неутрални палта. Лесен начин да сте в тон, без да изглежда нагласено.", "couple matching plaid scarves winter outfit"],
["Зимно бяло", "Сутрешна снимка при Парламента", "d", [["#f5f2ec", "бяло"], ["#d9d2c5", "овесено"], ["#b8a58a", "пясъчно"]], "Бели или кремави пухени якета и бели плетени шапки. Изглежда като от картичка, особено ако има скреж или сняг. На снимките изпъква чудесно на фона на тъмния Дунав.", "couple winter white outfit snow photoshoot"],
["Денимово и плетено", "Централния пазар", "d", [["#3c5a7d", "деним"], ["#efe6d8", "крем"], ["#6b4a33", "кафяво"]], "Дънки и при двамата, плетени пуловери в крем и кафяви ботуши. Удобно е за много ходене и стои непринудено и сладко.", "couple denim cream knit sweater outfit winter"],
["Еднакви суитшърти", "Вечер в стаята", "h", [["#a8b4a0", "маслинено"], ["#f4efe6", "крем"], ["#6b6b6b", "сиво"]], "Еднакви суитшърти, може с бродиран надпис или инициали, и бели чорапи. Перфектно за поръчка в стаята и филм преди сън.", "matching couple sweatshirts cozy hotel"],
["Халати и шампанско", "Спа в хотела", "h", [["#ffffff", "бяло"], ["#e8d6b0", "шампанско"], ["#d9a7a7", "розово"]], "Хотелските халати и чехли плюс тънки златни бижута за нея. Сладка снимка с чаша шампанско преди или след спа.", "couple hotel robes champagne spa"],
["Бордо пижами", "Последната вечер · 26.12", "h", [["#5b1a2b", "бордо"], ["#f2ece4", "крем"], ["#d4b06a", "злато"]], "Сатенени пижами в бордо с кремав кант. По-елегантна версия на коледните пижами за последната вечер в хотела.", "matching couple satin pajamas burgundy"]];
const OFF=[['all','Всички'],['x','Вечер'],['d','Ден'],['h','В хотела'],['fav','♥ Избрани']];
let ofav=ld('bp-of',{});
$('#of').innerHTML=OFF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
$('#outfits').innerHTML=OF.map((o,i)=>`<article class="card ac outfit" data-i="${i}"><div class="sw">${o[3].map(c=>`<span style="background:${c[0]}"><i>${c[1]}</i></span>`).join('')}<button class="heartbtn" data-i="${i}" aria-pressed="${!!ofav[i]}" aria-label="Харесвам"></button></div><div class="bd"><div class="k">${o[1]}</div><h3>${o[0]}</h3><p>${o[4]}</p><a class="btn ghost sm" style="margin-top:14px" href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(o[5])}" target="_blank" rel="noopener">Примери в Pinterest ↗</a></div></article>`).join('');
let OFc='all';const ofilt=()=>$$('#outfits .ac').forEach(c=>{const i=c.dataset.i;c.classList.toggle('hide',!(OFc==='all'||(OFc==='fav'?ofav[i]:OF[i][2]===OFc)))});
$$('#of button').forEach(b=>b.onclick=()=>{$$('#of button').forEach(x=>x.classList.remove('on'));b.classList.add('on');OFc=b.dataset.f;ofilt()});
$$('#outfits .heartbtn').forEach(b=>b.onclick=()=>{const i=b.dataset.i;ofav[i]?delete ofav[i]:(ofav[i]=1);sv('bp-of',ofav);b.setAttribute('aria-pressed',!!ofav[i]);if(ofav[i]){burst(b);toast(OF[i][0]+' е в избора ♥')}ofilt();refreshFav()});

/* ---------- круиз ---------- */
$('#cruise').innerHTML=CRU.map(c=>`<div class="flip" tabindex="0" role="button" aria-label="Обърни: ${c[0]}"><div class="fin"><div class="face"><div class="ph"><img src="img/${c[1]}.webp" alt="${c[0]}"></div><div class="fc"><div class="k">${c[2]}</div><h3>${c[0]}</h3><p>${c[3]}</p></div><span class="turn">обърни ↻</span></div><div class="face back"><div class="k">подробности</div><h3>${c[0]}</h3><dl>${c[4].map(d=>`<dt>${d[0]}</dt><dd>${d[1]}</dd>`).join('')}</dl><p style="margin-top:16px">Връзка с тях: ${c[5]}.</p><span class="turn">обърни ↻</span></div></div></div>`).join('')+`<div class="cnote" style="grid-column:1/-1">За 26 декември онлайн не се показа опция за маса до прозореца, затова чакаме отговор от компаниите. Ако никоя не гарантира такава маса, вечеряме в ресторант на сушата и правим отделен едночасов панорамен круиз, за около 25 € на човек.</div>`;
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
$$('#acts .heartbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();const i=b.dataset.i;plan[i]?delete plan[i]:(plan[i]=1);sv('bp-plan',plan);b.setAttribute('aria-pressed',!!plan[i]);if(plan[i]){burst(b);toast(A[i][0]+' е в плана ♥')}afilt();refreshFav()});

/* разгъване (общо) */
document.addEventListener('click',e=>{const t=e.target.closest('.tog');if(!t)return;const c=t.closest('.ac');c.classList.toggle('open');const o=c.classList.contains('open');t.setAttribute('aria-expanded',o);t.textContent=o?'Скрий':'Подробности'});

/* ---------- ресторанти ---------- */
const ILL={'For Sale Pub':'goulash_x0',Stand:'paprikas_x1','Essência':'tokaji_x0',Rumour:'somloi_x1',Salt:'palinka_x0'};
const rimg=r=>r[2]||ILL[r[0]];
const RF=[['all','Всички'],['x','Коледна вечеря'],['m','Michelin'],['c','Кафенета'],['b','Барове с гледка'],['t','Традиционни'],['fav','♥ Избрани']];
$('#rf').innerHTML=RF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[1]}</button>`).join('');
const RL=R.map(r=>[rimg(r),r[0]]);
$('#rest').innerHTML=R.map((r,i)=>`<article class="card ac" data-i="${i}"><div class="ph"><img src="img/${rimg(r)}.webp" alt="${r[0]}" loading="lazy"><span class="pill tag">${r[3]}</span>${r[2]?'':'<span class="illus">илюстрация</span>'}<button class="heartbtn" data-i="${i}" aria-pressed="${!!rfav[i]}" aria-label="Харесвам"></button></div>
<div class="bd"><div class="k">${r[4]}</div><h3>${r[0]}</h3><p>${r[5]}</p>
<div class="more"><div><dl><dt>Да опитате</dt><dd>${r[6]}</dd><dt>Цена</dt><dd>${r[7]}</dd><dt>Адрес</dt><dd>${r[8]}</dd><dt>Коледа</dt><dd>${r[9]}</dd><dt>Карта</dt><dd><a href="${M(r[10])}" target="_blank" rel="noopener">Google Maps ↗</a></dd></dl></div></div>
<button class="tog" aria-expanded="false">Подробности</button></div></article>`).join('');
$$('#rest .ph img').forEach(im=>im.onclick=()=>openLB(RL,+im.closest('.ac').dataset.i));
let RFc='all';const rfilt=()=>$$('#rest .ac').forEach(c=>{const i=c.dataset.i;c.classList.toggle('hide',!(RFc==='all'||(RFc==='fav'?rfav[i]:R[i][1].includes(RFc))))});
$$('#rf button').forEach(b=>b.onclick=()=>{$$('#rf button').forEach(x=>x.classList.remove('on'));b.classList.add('on');RFc=b.dataset.f;rfilt()});
$$('#rest .heartbtn').forEach(b=>b.onclick=e=>{e.stopPropagation();const i=b.dataset.i;rfav[i]?delete rfav[i]:(rfav[i]=1);sv('bp-rest',rfav);b.setAttribute('aria-pressed',!!rfav[i]);if(rfav[i]){burst(b);toast(R[i][0]+' е в избора ♥')}rfilt();refreshFav()});

/* ---------- вкусове ---------- */
$('#food').innerHTML=FD.map(f=>`<div class="flip food" tabindex="0" role="button" aria-label="Обърни: ${f[0]}"><div class="fin"><div class="face"><div class="ph"><img src="img/${f[2]}.webp" alt="${f[0]}" loading="lazy"></div><div class="fc"><div class="hu">${f[1]}</div><h3>${f[0]}</h3><p>${f[3].split('. ')[0]}.</p></div><span class="turn">обърни ↻</span></div><div class="face back"><div class="hu">${f[1]}</div><h3>${f[0]}</h3><p style="font-size:15.5px;margin-top:12px">${f[3]}</p><dl><dt>Къде</dt><dd>${f[4]}</dd></dl><span class="turn">обърни ↻</span></div></div></div>`).join('');
$$('#food .flip').forEach(f=>{f.onclick=()=>f.classList.toggle('on');f.onkeydown=e=>{if(e.key==='Enter'){f.click()}}});
slider($('#food').parentElement);

/* ---------- карта ---------- */
const COL={h:'#c2546f',s:'#3f7fb0',r:'#b8862f',k:'#2f8f6a',p:'#8a5cc4'};
const ICO={h:'<path d="M3 18V7m0 7h18v4m0-4v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10.5" r="1.8"/>',
 s:'<path d="M3 20h18M5 20v-8m4 8v-8m6 8v-8m4 8v-8M3 10l9-6 9 6z"/>',
 r:'<path d="M7 3v8m-3-8v5a3 3 0 0 0 6 0V3m-3 8v10M17 21V3c-2.5 1.5-3.5 4-3.5 8h3.5"/>',
 p:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 k:'<path d="M3 15l2 5h14l2-5zM6 15V9h12v6M9 9V5h4l2 4"/><path d="M2 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>'};
const svgI=(t,s=16)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[t]}</svg>`;
const MF=[['all','Всички'],['h','Хотели'],['s','Забележителности'],['r','Ядене и пиене'],['k','Круизи'],['p','Кадри']];
$('#mf').innerHTML=MF.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[0]}">${f[0]==='all'?'':`<i class="mfi" style="background:${COL[f[0]]}">${svgI(f[0],13)}</i>`}${f[1]}</button>`).join('');
let MAP,LAY={},TL,MKS=[],LABP=null;
const isDay=()=>{const h=new Date().getHours()+new Date().getMinutes()/60;return h>=7&&h<17};
let DAY=isDay();
function setTheme(d){DAY=d;const m=$('#map');m.classList.toggle('mday',d);m.classList.toggle('mnight',!d);const b=$('#mtheme');if(b){b.innerHTML=d?'☾ Нощ':'☀ Ден';b.setAttribute('aria-label',d?'Тъмна карта':'Светла карта')}}
function initMap(){if(typeof L==='undefined'){$('#map').innerHTML='<p style="padding:20px">Картата не можа да се зареди.</p>';return}
 MAP=L.map('map',{scrollWheelZoom:false}).setView([47.4995,19.056],14);
 TL=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap',className:'mtiles'}).addTo(MAP);
 'hsrkp'.split('').forEach(t=>LAY[t]=L.layerGroup().addTo(MAP));
 P.forEach(p=>{const ic=L.divIcon({className:'mk',html:`<div class="mpin ${p[3]}" style="--c:${COL[p[3]]}">${svgI(p[3])}</div>`,iconSize:[34,42],iconAnchor:[17,40],popupAnchor:[0,-36],tooltipAnchor:[0,-20]});
  const mk=L.marker([p[1],p[2]],{icon:ic,title:p[0]});MKS.push([mk,p[0]]);mk.bindPopup(`<span class="ptype" style="background:${COL[p[3]]}">${svgI(p[3],12)} ${MF.find(f=>f[0]===p[3])[1]}</span><b>${p[0]}</b><br>${p[4]}<br><a href="${M(p[0]+' Budapest')}" target="_blank" rel="noopener">Упътване ↗</a>`).addTo(LAY[p[3]])});
 const lab=()=>{const on=MAP.getZoom()>=15;if(on===LABP)return;LABP=on;MKS.forEach(([m,n])=>{m.unbindTooltip();m.bindTooltip(n,{direction:'right',offset:[16,-22],className:'mlab',permanent:on})})};MAP.on('zoomend',lab);
 const Ctl=L.Control.extend({onAdd(){const b=L.DomUtil.create('button','mtheme');b.id='mtheme';b.type='button';L.DomEvent.disableClickPropagation(b);b.onclick=()=>setTheme(!DAY);return b}});
 new Ctl({position:'topright'}).addTo(MAP);setTheme(DAY);
 MAP.fitBounds(P.filter(p=>p[2]<19.075).map(p=>[p[1],p[2]]),{padding:[20,20]});lab()}
const mo=new IntersectionObserver(e=>{if(e[0].isIntersecting){initMap();mo.disconnect()}},{rootMargin:'400px'});mo.observe($('#map'));
$$('#mf button').forEach(b=>b.onclick=()=>{$$('#mf button').forEach(x=>x.classList.remove('on'));b.classList.add('on');if(!MAP)return;const f=b.dataset.f;Object.entries(LAY).forEach(([k,g])=>f==='all'||f===k?g.addTo(MAP):MAP.removeLayer(g))});


/* ---------- транспорт ---------- */
const AIR=[['Uber от летището (нашият избор)','Поръчвате от приложението след кацане. В Будапеща Uber работи с лицензирани жълти таксита по регулираната тарифа, а цената се вижда предварително. До Hilton на хълма са около 35–45 мин.','35–45 мин','~13 500–16 000 Ft','chainbridge_2'],['Такси или лимузина от Hilton','Ако решите да е поръчано предварително: жълто такси от хотела 72 € до хотела и 56 € обратно, Mercedes E-класа или Tesla 90 € на посока. Плаща се в брой или към стаята с +20%.','35–45 мин','56–90 €','duna_1'],
['Такси Főtaxi','Официалното такси на летището, със стойка точно пред терминала. Плаща се с карта.','25–35 мин','~13 500–15 500 Ft (~35–40 €)','chainbridge_2'],
['Bolt','Работи в Будапеща с лицензирани таксита по същата регулирана тарифа. Цената се вижда в приложението предварително.','25–35 мин','~13 500–15 500 Ft','parliament_3'],
['Автобус 100E','Директно до Kálvin tér и Deák Ferenc tér, денонощно. Нужен е отделен билет за 2 500 Ft, който се плаща с карта на машините или в автобуса.','~40 мин','2 500 Ft на човек','vorosmarty_1']];
const CITY=[['Пеша','Хълмът на Замъка около Hilton се обикаля пеша, а до Пеща се слиза за 15 минути по стълбите и през Верижния мост. Вечер е по-удобно с такси, около 10 минути.',''],
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

/* ---------- бюджет ---------- */
const cRoom=$('#cRoom');
function fillRooms(){const cv=cRoom.value;let o='<option value="568|Corinthia · Deluxe">Corinthia · Deluxe – 568 € (оферта)</option>';
 H.forEach(h=>h.rooms.filter(r=>r[4]).forEach(r=>{o+=`<option value="${r[4]}|${h.name} · ${r[0]}">${fav[h.id]?'♥ ':''}${h.name} · ${r[0]} – ${eur(r[4])}${r[5]==='e'?' (оценка)':''}</option>`}));
 cRoom.innerHTML=o;cRoom.value=[...cRoom.options].some(x=>x.value===cv)?cv:'676|Hilton Budapest · Superior King – Danube Room';calc()}
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
const GAL=[['castle_0','Крепостта и Верижният мост'],['nycafe_2','Кафене New York'],['parisi_4','Párisi Udvar'],['basilica_4','Базиликата по Коледа'],['gresham2_2','Куполът на Gresham'],['szechenyi_5','Сечени нощем'],['matild_0','Matild Palace'],['christmas_5','Коледният базар'],['parliament_3','Парламентът от Дунава'],['bastion_1','Рибарският бастион'],['opera_4','Операта'],['dobos_x0','Торта „Добош“'],['drechsler_1','Дворецът Дрекслер'],['matthias_3','Църквата „Матиаш“'],['szentendre_5','Сентендре по Коледа'],['vorosmarty_1','Вьорьошмарти'],['kurtos_x1','Курточ калач'],['gerbeaud_4','Gerbeaud'],['chainbridge_2','Верижният мост']];
$('#gal').innerHTML=GAL.map((g,i)=>`<button data-i="${i}" aria-label="${g[1]}"><img src="img/${g[0]}.webp" alt="${g[1]}" loading="lazy"><span>${g[1]}</span></button>`).join('');
$$('#gal button').forEach(b=>b.onclick=()=>openLB(GAL,+b.dataset.i));

/* ---------- избор и споделяне ---------- */
function picks(){const o=typeof OF!=='undefined'?Object.keys(ld('bp-of',{})).filter(k=>OF[k]).map(k=>OF[k][0]):[];return{h:H.filter(h=>fav[h.id]).map(h=>h.name),a:Object.keys(plan).filter(k=>A[k]).map(k=>A[k][0]),r:Object.keys(rfav).filter(k=>R[k]).map(k=>R[k][0]),o}}
function refreshFav(){const p=picks(),n=p.h.length+p.a.length+p.r.length+p.o.length;$('#badge').hidden=!n;$('#badge').textContent=n;
 const sec=(t,l)=>l.length?`<p><b>${t}:</b> ${l.join(' · ')}</p>`:'';
 $('#mine').innerHTML=n?sec('Хотели',p.h)+sec('Места',p.a)+sec('Ресторанти и барове',p.r)+sec('Визии',p.o):'<p style="opacity:.8">Още нищо не е избрано. Натискай ♡ при хотелите, местата и ресторантите или в „Бърз избор“.</p>';
 htabs();fillRooms()}
refreshFav();
$('#shareBtn').onclick=async()=>{const p=picks();const t='♥ Коледа в Будапеща · моят избор\n'+(p.h.length?'\nХотели: '+p.h.join(', '):'')+(p.a.length?'\nМеста: '+p.a.join(', '):'')+(p.r.length?'\nРесторанти: '+p.r.join(', '):'')+(p.o.length?'\nВизии: '+p.o.join(', '):'')+((p.h.length+p.a.length+p.r.length+p.o.length)?'':'\n(още нищо не е избрано)');
 const url=location.origin+location.pathname;
 try{if(navigator.share){await navigator.share({title:'Коледа с Венито ♥',text:t,url});return}}catch(e){if(e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(t+'\n'+url);toast('Копирано, поставете го в чата')}catch(e){toast('Не можа да се сподели')}};

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
 add('.sh');add('.tcard',1);add('#acts .ac',1);add('#rest .ac',1);add('.flip:not(.food)',1);add('.tool',1);add('.calc');add('.quiz');add('.share');add('.door',1);add('#air .ac',1);add('#outfits .ac',1);add('#city .ac',1);add('.pc',1);add('#gal button',1);add('.vid',1);add('.deckwrap');add('.mapwrap');add('.cmpgrid')}



/* ---------- анимиран маршрут ---------- */
(()=>{const box=$('#rmap');if(!box)return;
 const HOME=[42.6977,23.3219],SOF=[42.6889,23.4151],BUD=[47.4337,19.2618],HOT=[47.5024,19.0335];
 const DAYC=['#e9a3b4','#d4b06a','#8cc0e0'];
 const RD=[{"n":"Ден 1 · 25.12","s":[[[42.6977,23.3219],"","Тръгваме от вкъщи"],[[42.6889,23.4151],"car","12:30 · Летище София",[[42.69769,23.3219],[42.69321,23.33421],[42.65659,23.38513],[42.65611,23.38496],[42.6566,23.38377],[42.65792,23.38635],[42.66114,23.38968],[42.66985,23.3934],[42.6763,23.39799],[42.68212,23.39965],[42.68302,23.4016],[42.6831,23.40996],[42.68538,23.4122],[42.68755,23.41566],[42.68827,23.41578],[42.68839,23.41506]]],[[47.4337,19.2618],"fly","15:00 · Кацане в Будапеща",null],[[47.5024,19.0335],"car","16:00 · Hilton, до Рибарския бастион",[[47.43306,19.26199],[47.43203,19.26084],[47.42804,19.26233],[47.42601,19.26205],[47.42439,19.26435],[47.42311,19.26445],[47.41853,19.25561],[47.4181,19.25136],[47.42145,19.24245],[47.43721,19.22445],[47.45064,19.20212],[47.45295,19.19628],[47.45786,19.17658],[47.46189,19.16797],[47.46217,19.165],[47.46114,19.15908],[47.46617,19.1324],[47.46576,19.12536],[47.47555,19.09891],[47.47241,19.09528],[47.47031,19.08867],[47.46869,19.07728],[47.46912,19.06209],[47.46969,19.06211],[47.4697,19.06449],[47.47354,19.06356],[47.47681,19.06188],[47.49113,19.04618],[47.49118,19.0445],[47.4947,19.0374],[47.4946,19.0384],[47.49516,19.03807],[47.49467,19.03933],[47.49936,19.03299],[47.49847,19.03564],[47.49898,19.03655],[47.50055,19.03428],[47.50238,19.03343]]],[[47.5021,19.035],"walk","16:15 · Бастионът по здрач",[[47.50238,19.03343],[47.50204,19.03362],[47.50234,19.03454],[47.50242,19.03465],[47.50223,19.03482],[47.50231,19.03512],[47.50245,19.03504],[47.50248,19.03518],[47.50253,19.03513],[47.50254,19.03497],[47.5024,19.03493],[47.50221,19.03498],[47.50213,19.03507]]],[[47.5066,19.0391],"walk","16:45 · Площад Батяни, Парламентът светва",[[47.50213,19.03507],[47.50232,19.03494],[47.50254,19.03497],[47.5025,19.03517],[47.50247,19.03511],[47.50233,19.03519],[47.50237,19.03548],[47.50227,19.03559],[47.50227,19.03569],[47.50219,19.03587],[47.50208,19.03585],[47.50222,19.03649],[47.50228,19.03646],[47.50234,19.03656],[47.50239,19.03676],[47.50268,19.03689],[47.5028,19.037],[47.50261,19.0377],[47.50285,19.03791],[47.50279,19.03799],[47.50283,19.03828],[47.50298,19.03852],[47.50418,19.03832],[47.5042,19.03844],[47.50576,19.03815],[47.50595,19.03823],[47.50598,19.03851],[47.50603,19.03856],[47.50604,19.03898],[47.50609,19.03913],[47.5066,19.03913]]],[[47.4994,19.0474],"walk","17:15 · По кея и през Верижния мост",[[47.5066,19.03913],[47.50609,19.03913],[47.50609,19.03919],[47.50588,19.03909],[47.50355,19.03939],[47.50209,19.03966],[47.50037,19.04025],[47.50019,19.04027],[47.50016,19.04026],[47.50009,19.03992],[47.5,19.03989],[47.49994,19.03996],[47.49874,19.0404],[47.49855,19.04074],[47.49853,19.04101],[47.49877,19.04228],[47.49882,19.04226],[47.49884,19.04237],[47.49879,19.04239],[47.49927,19.04487],[47.49932,19.04485],[47.49934,19.04496],[47.49929,19.04498],[47.49957,19.0464],[47.49966,19.04659],[47.49963,19.04664],[47.49992,19.04672],[47.49983,19.0468],[47.50014,19.04725],[47.50018,19.0474],[47.49982,19.04752],[47.4995,19.0477]]],[[47.5009,19.0539],"walk","17:40 · Базиликата и елхата",[[47.4995,19.0477],[47.49982,19.04752],[47.5002,19.0474],[47.50018,19.04755],[47.50072,19.05332],[47.50101,19.05326],[47.50107,19.05333],[47.50112,19.05385]]],[[47.5024,19.0335],"car","18:15 · Преобличане в хотела",[[47.5013,19.05382],[47.50122,19.05297],[47.50238,19.05271],[47.50263,19.05491],[47.49903,19.05483],[47.49842,19.05479],[47.49809,19.0547],[47.4978,19.05471],[47.49765,19.05475],[47.4975,19.05489],[47.49733,19.05514],[47.49612,19.05781],[47.49553,19.05897],[47.49518,19.05927],[47.49428,19.05984],[47.49333,19.05605],[47.49302,19.05505],[47.49243,19.0535],[47.49199,19.05248],[47.4917,19.05142],[47.4901,19.04694],[47.49002,19.04634],[47.49006,19.04614],[47.49019,19.0459],[47.49185,19.04369],[47.49211,19.04327],[47.49353,19.03939],[47.4947,19.0374],[47.49473,19.03772],[47.49459,19.03823],[47.4946,19.0384],[47.49476,19.03827],[47.49499,19.03791],[47.49509,19.03791],[47.49516,19.03807],[47.49513,19.03819],[47.49455,19.03917],[47.49458,19.03933],[47.49467,19.03933],[47.49583,19.03771],[47.49638,19.03687],[47.49808,19.0347],[47.49863,19.03419],[47.49936,19.03299],[47.49946,19.03301],[47.49946,19.03316],[47.49915,19.03368],[47.49847,19.03564],[47.49851,19.03597],[47.4986,19.03616],[47.4987,19.03631],[47.49898,19.03655],[47.49992,19.03502],[47.50055,19.03428],[47.50084,19.03406],[47.50132,19.03382],[47.50152,19.03364],[47.50168,19.0337],[47.50194,19.03366],[47.50238,19.03343]]],[[47.4932,19.0546],"car","19:30 · Рожденна вечеря в Párisi Udvar",[[47.50238,19.03343],[47.50286,19.03307],[47.50277,19.03286],[47.50324,19.03226],[47.50298,19.03177],[47.50268,19.0314],[47.50199,19.03252],[47.50165,19.03322],[47.50152,19.03364],[47.50132,19.03382],[47.50075,19.03412],[47.50042,19.03441],[47.49992,19.03502],[47.49946,19.03579],[47.49932,19.03564],[47.49884,19.03641],[47.4987,19.03631],[47.49853,19.03603],[47.49849,19.03553],[47.49897,19.0342],[47.49932,19.03338],[47.49946,19.03316],[47.49946,19.03301],[47.4994,19.03297],[47.49934,19.033],[47.49867,19.03412],[47.49831,19.03438],[47.49818,19.03453],[47.49638,19.03687],[47.49583,19.03771],[47.49464,19.03935],[47.49456,19.0393],[47.49455,19.03917],[47.49513,19.03819],[47.49515,19.03802],[47.49509,19.03791],[47.49499,19.03791],[47.49476,19.03827],[47.49454,19.03845],[47.49424,19.0386],[47.49409,19.03853],[47.49406,19.03849],[47.4947,19.0374],[47.49431,19.03692],[47.4935,19.03834],[47.49281,19.03974],[47.49168,19.04276],[47.49124,19.04381],[47.49061,19.04494],[47.49012,19.04562],[47.48992,19.04613],[47.48992,19.04657],[47.4901,19.04694],[47.4917,19.05142],[47.49199,19.05248],[47.49294,19.05482]]],[[47.5024,19.0335],"car","22:00 · Обратно в хотела",[[47.49294,19.05482],[47.49199,19.05248],[47.4917,19.05142],[47.4901,19.04694],[47.49002,19.04656],[47.49006,19.04614],[47.49019,19.0459],[47.49185,19.04369],[47.49211,19.04327],[47.49353,19.03939],[47.4947,19.0374],[47.49473,19.03772],[47.49459,19.03823],[47.4946,19.0384],[47.49476,19.03827],[47.49499,19.03791],[47.49509,19.03791],[47.49516,19.03807],[47.49513,19.03819],[47.49455,19.03917],[47.49458,19.03933],[47.49467,19.03933],[47.49583,19.03771],[47.49638,19.03687],[47.49808,19.0347],[47.49863,19.03419],[47.49936,19.03299],[47.49946,19.03301],[47.49946,19.03316],[47.49915,19.03368],[47.49847,19.03564],[47.49851,19.03597],[47.4986,19.03616],[47.4987,19.03631],[47.49898,19.03655],[47.49992,19.03502],[47.50055,19.03428],[47.50084,19.03406],[47.50132,19.03382],[47.50152,19.03364],[47.50168,19.0337],[47.50194,19.03366],[47.50238,19.03343]]]]},{"n":"Ден 2 · 26.12","s":[[[47.5024,19.0335],"","08:00 · Закуска"],[[47.5021,19.035],"walk","09:00 · Арките на Рибарския бастион",[[47.50238,19.03343],[47.50204,19.03362],[47.50234,19.03454],[47.50242,19.03465],[47.50223,19.03482],[47.50231,19.03512],[47.50245,19.03504],[47.50248,19.03518],[47.50253,19.03513],[47.50254,19.03497],[47.5024,19.03493],[47.50221,19.03498],[47.50213,19.03507]]],[[47.4958,19.0402],"walk","10:00 · Кралският дворец и Хабсбургските стълби",[[47.50213,19.03507],[47.50206,19.03538],[47.502,19.03545],[47.50176,19.03557],[47.50145,19.03554],[47.50104,19.03618],[47.50089,19.03594],[47.50082,19.0359],[47.50012,19.03636],[47.49974,19.03676],[47.49943,19.03699],[47.49948,19.03723],[47.49946,19.03749],[47.49926,19.03799],[47.49904,19.03827],[47.49868,19.03849],[47.49827,19.03859],[47.49775,19.03867],[47.49774,19.03858],[47.49763,19.03869],[47.49736,19.03863],[47.49743,19.03879],[47.49738,19.03875],[47.49599,19.04052]]],[[47.4937,19.0437],"walk","11:00 · Várkert Bazár",[[47.49599,19.04052],[47.49585,19.04069],[47.49583,19.04083],[47.49567,19.04093],[47.49562,19.04085],[47.49507,19.04133],[47.49505,19.04128],[47.495,19.04132],[47.49541,19.04253],[47.49439,19.04305],[47.49444,19.04327],[47.49367,19.04397],[47.4936,19.04377]]],[[47.4865,19.0565],"walk","11:40 · Пеша по кея и през моста „Свобода“",[[47.4936,19.04377],[47.49352,19.04353],[47.4934,19.04357],[47.49336,19.04363],[47.4933,19.0436],[47.49297,19.04381],[47.49286,19.04399],[47.49182,19.04491],[47.49059,19.04563],[47.49034,19.04517],[47.49026,19.04528],[47.49013,19.04527],[47.49003,19.04561],[47.48963,19.04602],[47.48923,19.04658],[47.48898,19.04736],[47.48762,19.04971],[47.48527,19.05227],[47.48464,19.05256],[47.48675,19.05672],[47.48665,19.05682],[47.4865,19.0565]]],[[47.4878,19.0587],"walk","12:00 · Обяд в For Sale Pub",[[47.4865,19.0565],[47.48665,19.05682],[47.48665,19.057],[47.48705,19.05782],[47.48722,19.05805],[47.48734,19.05791],[47.48776,19.05874]]],[[47.4867,19.047],"car","14:45 · Цитаделата по залез",[[47.48776,19.05874],[47.48705,19.05729],[47.48672,19.05675],[47.48481,19.05305],[47.48457,19.05274],[47.48397,19.05039],[47.48389,19.05027],[47.48362,19.05006],[47.48298,19.04993],[47.48291,19.04913],[47.48302,19.04858],[47.48341,19.0485],[47.48347,19.04841],[47.48392,19.04838],[47.48435,19.04825],[47.4851,19.04826],[47.48515,19.04833],[47.48538,19.04746]]],[[47.5024,19.0335],"car","16:15 · Почивка в хотела",[[47.48538,19.04746],[47.48515,19.04833],[47.4851,19.04826],[47.48435,19.04825],[47.48392,19.04838],[47.48347,19.04841],[47.48341,19.0485],[47.48305,19.04855],[47.48295,19.04878],[47.48291,19.04913],[47.48298,19.04993],[47.48272,19.04988],[47.48242,19.04973],[47.48199,19.05248],[47.48201,19.05267],[47.4831,19.05312],[47.48331,19.05326],[47.48378,19.05375],[47.48405,19.05379],[47.48472,19.05297],[47.48533,19.05241],[47.49116,19.04614],[47.4913,19.04561],[47.49116,19.04483],[47.49118,19.0445],[47.49155,19.04392],[47.49172,19.0437],[47.49195,19.04351],[47.49211,19.04327],[47.49353,19.03939],[47.4947,19.0374],[47.49473,19.03772],[47.49459,19.03823],[47.4946,19.0384],[47.49476,19.03827],[47.49499,19.03791],[47.49509,19.03791],[47.49516,19.03807],[47.49513,19.03819],[47.49455,19.03917],[47.49458,19.03933],[47.49467,19.03933],[47.49583,19.03771],[47.49638,19.03687],[47.49808,19.0347],[47.49863,19.03419],[47.49936,19.03299],[47.49946,19.03301],[47.49946,19.03316],[47.49915,19.03368],[47.49847,19.03564],[47.49851,19.03597],[47.4986,19.03616],[47.4987,19.03631],[47.49898,19.03655],[47.49992,19.03502],[47.50055,19.03428],[47.50084,19.03406],[47.50132,19.03382],[47.50152,19.03364],[47.50168,19.0337],[47.50194,19.03366],[47.50238,19.03343]]],[[47.4966,19.0507],"car","17:50 · Коледният базар и Gerbeaud",[[47.50238,19.03343],[47.50286,19.03307],[47.50277,19.03286],[47.50324,19.03226],[47.50298,19.03177],[47.50268,19.0314],[47.50199,19.03252],[47.50165,19.03322],[47.50152,19.03364],[47.50132,19.03382],[47.50075,19.03412],[47.50042,19.03441],[47.49992,19.03502],[47.49946,19.03579],[47.49932,19.03564],[47.49884,19.03641],[47.4987,19.03631],[47.49853,19.03603],[47.49849,19.03553],[47.49897,19.0342],[47.49932,19.03338],[47.49946,19.03316],[47.49946,19.03301],[47.4994,19.03297],[47.49934,19.033],[47.49867,19.03412],[47.49831,19.03438],[47.49818,19.03453],[47.49638,19.03687],[47.49583,19.03771],[47.49464,19.03935],[47.49456,19.0393],[47.49455,19.03917],[47.49513,19.03819],[47.49515,19.03802],[47.49509,19.03791],[47.49499,19.03791],[47.49476,19.03827],[47.49454,19.03845],[47.49424,19.0386],[47.49409,19.03853],[47.49406,19.03849],[47.4947,19.0374],[47.49431,19.03692],[47.4935,19.03834],[47.49281,19.03974],[47.49168,19.04276],[47.49124,19.04381],[47.49061,19.04494],[47.49012,19.04562],[47.48996,19.04598],[47.4899,19.04631],[47.48992,19.04657],[47.4901,19.04694],[47.4917,19.05142],[47.49199,19.05248],[47.49215,19.05287],[47.49216,19.05327],[47.49211,19.05336],[47.49201,19.05338],[47.49193,19.05324],[47.49146,19.05183],[47.49142,19.05149],[47.49148,19.05125],[47.49203,19.05085],[47.49279,19.0501],[47.49347,19.04956],[47.49577,19.04808],[47.4979,19.04688],[47.49818,19.04694],[47.49832,19.04705],[47.49842,19.0474],[47.49552,19.04941],[47.49596,19.05058]]],[[47.4962,19.0476],"walk","18:15 · Малката принцеса",[[47.49654,19.05071],[47.49649,19.05064],[47.49639,19.05075],[47.49611,19.05079],[47.4961,19.05093],[47.4952,19.04859],[47.49526,19.04856],[47.4952,19.04835],[47.49543,19.04809],[47.49623,19.04767],[47.49621,19.04762]]],[[47.4957,19.0482],"walk","18:30 · Качване на кораба",[[47.49621,19.04762],[47.49623,19.04767],[47.49543,19.04809],[47.4952,19.04835],[47.49522,19.04841],[47.49568,19.04813]]],[[47.496,19.0462],"boat","",null],[[47.499,19.0442],"boat","",null],[[47.503,19.043],"boat","",null],[[47.5072,19.0428],"boat","",null],[[47.511,19.0436],"boat","Покрай Парламента с шампанско",null],[[47.5142,19.0452],"boat","",null],[[47.512,19.0446],"boat","",null],[[47.5072,19.0433],"boat","",null],[[47.503,19.0436],"boat","",null],[[47.499,19.0448],"boat","",null],[[47.495,19.0468],"boat","",null],[[47.4908,19.049],"boat","",null],[[47.488,19.0522],"boat","",null],[[47.4858,19.0552],"boat","",null],[[47.4852,19.056],"boat","",null],[[47.4875,19.0532],"boat","",null],[[47.491,19.0496],"boat","",null],[[47.4945,19.0472],"boat","",null],[[47.4957,19.0482],"boat","21:30 · Обратно на кея",null],[[47.5006,19.053],"walk","22:00 · Бар на покрив",[[47.49568,19.04813],[47.49577,19.04808],[47.49581,19.04822],[47.49588,19.04818],[47.49613,19.04899],[47.49698,19.05091],[47.49735,19.05084],[47.49743,19.05173],[47.49755,19.0517],[47.49759,19.05185],[47.49778,19.05181],[47.49864,19.05321],[47.499,19.05313],[47.49898,19.05349],[47.49905,19.05338],[47.49922,19.05335],[47.49922,19.05341],[47.50061,19.05313]]],[[47.5024,19.0335],"car","23:30 · Обратно в хотела",[[47.50022,19.05321],[47.50042,19.05487],[47.49842,19.05479],[47.49809,19.0547],[47.4978,19.05471],[47.49761,19.05478],[47.49741,19.055],[47.49724,19.05533],[47.49612,19.05781],[47.49553,19.05897],[47.49518,19.05927],[47.49428,19.05984],[47.49333,19.05605],[47.49302,19.05505],[47.49243,19.0535],[47.49199,19.05248],[47.4917,19.05142],[47.4901,19.04694],[47.49002,19.04634],[47.49006,19.04614],[47.49019,19.0459],[47.49185,19.04369],[47.49211,19.04327],[47.49353,19.03939],[47.4947,19.0374],[47.49473,19.03772],[47.49459,19.03823],[47.4946,19.0384],[47.49476,19.03827],[47.49499,19.03791],[47.49509,19.03791],[47.49516,19.03807],[47.49513,19.03819],[47.49455,19.03917],[47.49458,19.03933],[47.49467,19.03933],[47.49583,19.03771],[47.49638,19.03687],[47.49808,19.0347],[47.49863,19.03419],[47.49936,19.03299],[47.49946,19.03301],[47.49946,19.03316],[47.49915,19.03368],[47.49847,19.03564],[47.49851,19.03597],[47.4986,19.03616],[47.4987,19.03631],[47.49898,19.03655],[47.49992,19.03502],[47.50055,19.03428],[47.50084,19.03406],[47.50132,19.03382],[47.50152,19.03364],[47.50168,19.0337],[47.50194,19.03366],[47.50238,19.03343]]]]},{"n":"Ден 3 · 27.12","s":[[[47.5024,19.0335],"","08:00 · Закуска и последни кадри на бастиона"],[[47.4337,19.2618],"car","11:45 · Летище Будапеща",[[47.50238,19.03343],[47.50324,19.03226],[47.50268,19.0314],[47.50152,19.03364],[47.49884,19.03641],[47.49849,19.03553],[47.49934,19.033],[47.49464,19.03935],[47.49515,19.03802],[47.49409,19.03853],[47.4947,19.0374],[47.49431,19.03692],[47.48996,19.04598],[47.49428,19.05984],[47.48966,19.06175],[47.48633,19.06871],[47.46583,19.12513],[47.46617,19.1324],[47.46114,19.15908],[47.46207,19.16721],[47.45786,19.17658],[47.45209,19.19889],[47.45001,19.20327],[47.43714,19.22443],[47.42081,19.24301],[47.41824,19.25029],[47.41813,19.25469],[47.42165,19.26155],[47.42158,19.26553],[47.42407,19.26518],[47.4254,19.26294],[47.42645,19.26236],[47.42887,19.26333],[47.43227,19.26367],[47.43306,19.26199]]],[[42.6889,23.4151],"fly","15:45 · Кацане в София",null],[[42.6977,23.3219],"car","Вкъщи, със стотици снимки",[[42.68839,23.41506],[42.68715,23.41279],[42.68314,23.40959],[42.6831,23.40157],[42.68225,23.39963],[42.67595,23.39769],[42.67008,23.3934],[42.66118,23.38956],[42.65856,23.38684],[42.65792,23.38403],[42.69321,23.33421],[42.6975,23.32387],[42.69769,23.3219]]]]}];
 $('#rdays').innerHTML=['Целият път',...RD.map(d=>d.n)].map((t,i)=>`<button class="${i?'':'on'}" data-d="${i-1}">${t}</button>`).join('');
 let M,G,tok=0,sel=-1,inited=false;
 const PLANE='<svg viewBox="0 0 24 24" width="34" height="34"><path fill="#f2d99b" stroke="#2a0f18" stroke-width=".8" d="M12 2c.8 0 1.4.8 1.4 1.8V9l7.6 4.6v2l-7.6-2.4v4.6l2.2 1.7V21L12 20l-3.6 1v-1.5l2.2-1.7v-4.6L3 15.6v-2L10.6 9V3.8C10.6 2.8 11.2 2 12 2z"/></svg>';
 const EMO={car:'🚕',walk:'🚶',boat:'🛳️'};
 const ico=(h,s=34)=>L.divIcon({className:'',html:`<div class="rmov">${h}</div>`,iconSize:[s,s],iconAnchor:[s/2,s/2]});
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const cap=t=>{$('#rcap').innerHTML=t?`<div>${t.replace(/^([^·]+·)/,'<b>$1</b>')}</div>`:''};
 const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
 function arc(a,b,t){const m=[(a[0]+b[0])/2+1.6,(a[1]+b[1])/2+.4];const u=1-t;return[u*u*a[0]+2*u*t*m[0]+t*t*b[0],u*u*a[1]+2*u*t*m[1]+t*t*b[1]]}
 const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const cam=(fn)=>new Promise(r=>{if(RM){fn();return r()}let done=false;const fin=()=>{if(!done){done=true;M.off('moveend',fin);setTimeout(r,120)}};M.stop();M.once('moveend',fin);fn();setTimeout(fin,2600)});
 const brg=(p,q)=>Math.atan2((q[1]-p[1])*Math.cos(p[0]*Math.PI/180),q[0]-p[0])*180/Math.PI;
 function move(a,b,mode,my,path){return new Promise(res=>{const fly=mode==='fly';
  const P=path&&path.length>1?path:[a,b];const cum=[0];for(let k=1;k<P.length;k++)cum.push(cum[k-1]+Math.hypot(P[k][0]-P[k-1][0],(P[k][1]-P[k-1][1])*.68));const tot=cum[cum.length-1]||1e-9;
  const at=t=>{const s=t*tot;let k=1;while(k<P.length-1&&cum[k]<s)k++;const f=(s-cum[k-1])/((cum[k]-cum[k-1])||1e-9);return lerp(P[k-1],P[k],Math.max(0,Math.min(1,f)))};
  const px=M.latLngToContainerPoint(a).distanceTo(M.latLngToContainerPoint(b));
  const dur=RM?10:fly?4500:Math.max(900,Math.min(2600,px*5+P.length*8));
  const mk=L.marker(a,{icon:ico(fly?PLANE:EMO[mode]||'•'),zIndexOffset:1000,interactive:false}).addTo(G);
  const line=L.polyline([a],{color:fly?'#f2d99b':mode==='boat'?'#8cc0e0':'#d4b06a',weight:fly?3:5,opacity:.95,dashArray:mode==='walk'?'1 9':fly?'8 8':null,lineCap:'round'}).addTo(G);
  const t0=performance.now();let prev=a,last=0;
  (function f(now){if(my!==tok){G.removeLayer(mk);res(false);return}const t=Math.min(1,(now-t0)/dur),e=fly?ease(t):(t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2),p=fly?arc(a,b,e):at(e);
   mk.setLatLng(p);if(now-last>30||t===1){line.addLatLng(p);last=now}
   if(fly&&(Math.abs(p[0]-prev[0])+Math.abs(p[1]-prev[1])>1e-4)){const el=mk.getElement();if(el)el.firstChild.style.transform=`rotate(${brg(prev,p)}deg)`;prev=p}
   if(t<1)requestAnimationFrame(f);else{G.removeLayer(mk);res(true)}})(t0)})}
 let side=0;
 function pin(p,n,lab,col,cur){const m=L.marker(p,{icon:L.divIcon({className:'',html:`<div class="rnum ${cur?'now':''}" style="--c:${col}">${n}</div>`,iconSize:[30,30],iconAnchor:[15,15]}),zIndexOffset:500}).addTo(G);
  if(lab){side^=1;m.bindTooltip(lab.replace(/^[^·]+·\s*/,''),{direction:side?'right':'left',offset:[side?14:-14,0],className:'rlab'});if(cur!==false)m.openTooltip()}return m}
 const cityB=d=>L.latLngBounds(d.s.filter(x=>x[0][1]<19.2).map(x=>x[0]));
 async function playDay(di,my){const d=RD[di],col=DAYC[di];let n=0,cur=d.s[0][0],lastPin=null;const seen=new Map();const key=p=>p[0].toFixed(4)+','+p[1].toFixed(4);
  G.clearLayers();side=0;
  await cam(()=>di===1?M.flyToBounds(cityB(d),{padding:[50,50],duration:1.2}):M.flyTo(cur,di===2?14:12,{duration:1.2}));
  if(my!==tok)return false;
  const mark=(p,lab)=>{if(lastPin){lastPin.getElement()?.firstChild.classList.remove('now');lastPin.closeTooltip()}const k=key(p);if(seen.has(k)){lastPin=seen.get(k)}else{lastPin=pin(p,++n,lab,col,true);seen.set(k,lastPin)}lastPin.getElement()?.firstChild.classList.add('now');lastPin.openTooltip()};
  mark(cur,d.s[0][2]);cap(d.s[0][2]);await wait(RM?0:900);
  for(let i=1;i<d.s.length;i++){const [p,mode,lab,path]=d.s[i];if(my!==tok)return false;
   if(mode==='fly'){await cam(()=>M.flyToBounds(L.latLngBounds([cur,p]),{padding:[70,70],duration:1.4}));cap(di===2?'✈ Полет към София · 1 ч. 20 мин.':'✈ Полет към Будапеща · 1 ч. 25 мин.')}
   else{const bb=L.latLngBounds(path||[cur,p]);if(!M.getBounds().pad(-.12).contains(bb)){await cam(()=>M.flyToBounds(bb.extend(cur),{padding:[60,60],maxZoom:16,duration:1.1}))}}
   if(my!==tok)return false;
   const wasOut=cur[1]>19.2;const ok=await move(cur,p,mode,my,path);if(!ok)return false;cur=p;
   if(mode==='fly'){await cam(()=>M.flyTo(p,12,{duration:1.2}))}
   else if(wasOut&&p[1]<19.2&&di!==2){await cam(()=>M.flyToBounds(cityB(d),{padding:[50,50],maxZoom:15,duration:1.2}))}
   if(lab){if(mode!=='boat'||/Парламента|кея/.test(lab))mark(p,lab);cap(lab);await wait(RM?0:(mode==='boat'?600:1300))}}
  return true}
 async function play(which){const my=++tok;G.clearLayers();$('#rplay').classList.add('hid');
  const days=which<0?[0,1,2]:[which];
  for(const di of days){if(!await playDay(di,my))return;await wait(RM?0:900)}
  if(my===tok){cap(which<0?'Коледа в Будапеща, 25–27.12 ♥':'');$('#rplay').classList.remove('hid');$('#rplay').classList.add('again');$('#rplay').innerHTML='<span>↻</span> Отново'}}
 function init(){if(inited||typeof L==='undefined')return;inited=true;
  M=L.map('rmap',{scrollWheelZoom:false,zoomSnap:.25}).setView([45.2,21.4],6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap',className:'mtiles'}).addTo(M);
  const dn=(()=>{const h=new Date().getHours();return h>=7&&h<17})();box.classList.add(dn?'mday':'mnight');
  G=L.layerGroup().addTo(M);
  M.fitBounds(L.latLngBounds([SOF,BUD]),{padding:[40,40]});
  pin(HOME,'🏠','София','#7a2a3e');pin(HOT,'🏨','Будапеща','#7a2a3e')}
 new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){init();o.disconnect()}},{rootMargin:'300px'}).observe(box);
 $('#rplay').onclick=()=>{init();play(sel)};
 $$('#rdays button').forEach(b=>b.onclick=()=>{$$('#rdays button').forEach(x=>x.classList.remove('on'));b.classList.add('on');sel=+b.dataset.d;init();play(sel)});
})();

/* ---------- кадрите ---------- */
const SHOTS=[
 ['Парламентът от круиза','danubecruise_4','26.12 · вечер','С чаша шампанско на палубата, а зад вас светещият Парламент.','Палубата е студена, затова излезте за 5–10 минути само когато корабът минава покрай Парламента.'],
 ['Площад Батяни','parliament_3','25.12 · по здрач','Облегнати на парапета на кея, а отсреща е целият Парламент.','Най-красиво е в синия час, около 16:15–17:00. Гимбалът стъпва на парапета, а снимате с таймер.'],
 ['Арките на Рибарския бастион','bastion_1','26.12 · сутрин','Седнали в арката, а през нея се вижда Парламентът.','Отидете рано, за да няма хора в кадъра. Мекото сутрешно слънце пада откъм Пеща.'],
 ['Цитаделата по залез','duna_1','26.12 · около 16:00','Целият град и Дунава отгоре, по стълбите към терасите.','След ремонта Цитаделата е отворена от пролетта на 2026, а терасите са безплатни. Нагоре с такси, за да не се изморите.'],
 ['New York Café','nycafe_0','Сутрин · 7:00–9:00','Позлатата, колоните и полилеите, докато салонът е полупразен.','Сутрин опашката е най-къса. Седнете към средата на залата, за да се види таванът.'],
 ['Верижният мост и Gresham','chainbridge_2','25.12 · 17:00','Лъвовете на моста, осветеният дворец Gresham и крепостта отсреща.','Минавате по него пеша от Батяни. Снимайте от средата на моста към Парламента, а после от площада пред Gresham към лъвовете. С гимбала стават и хубави бавни видеа.'],
 ['Базиликата и елхата','basilica_4','25.12 · 17:20','Огромната елха, базарът и светлинното шоу върху фасадата.','Застанете в дъното на площада, за да влезе цялата фасада с елхата. Шоуто се повтаря през няколко минути.'],
 ['Адвент календарът на Gerbeaud','gerbeaudadv_0','26.12 · 17:50','През декември фасадата на Gerbeaud става огромен адвент календар с 24 светещи прозореца.','Снимайте от средата на базара на Вьорьошмарти, с чаша греяно вино в кадъра.'],
 ['Покривът на „Матиаш“','matthias_3','26.12 · 10:00','Шареният покрив с керемиди и готическите кули, точно до бастиона.','Най-хубаво е отдолу, под ъгъл, с телефона в режим 0.5×, за да влезе цялата кула.'],
 ['Хабсбургските стълби и Várkert Bazár','varkert_0','26.12 · обед','Аркади, стълбища и куполи под Кралския дворец.','Слизате от крепостта по стълбите. На всеки завой има нов кадър, без тълпи.'],
 ['Малката принцеса','princess_0','26.12 · преди круиза','Бронзовата принцеса на парапета, а отзад светещата крепост.','Тя е на 3 минути от пристанището на круиза, така че кадърът е по пътя. Седнете до нея на парапета.']];
if($('#shots')){$('#shots').innerHTML=SHOTS.map((s,i)=>`<article class="card ac shot"><div class="ph"><img src="img/${s[1]}.webp" alt="${s[0]}" loading="lazy"><span class="pill tag">${s[2]}</span></div><div class="bd"><h3>${s[0]}</h3><p>${s[3]}</p><p class="tip">📸 ${s[4]}</p></div></article>`).join('');
 $$('#shots .ph').forEach((p,i)=>p.onclick=()=>openLB(SHOTS.map(s=>[s[1],s[0]]),i))}


const IDEAS=[
 ['🥂','Наздраве пред Парламента','Круизът','Чашите шампанско в средата на кадъра, Парламентът отзад. Ако ги снима някой друг, нека клекне по-ниско.'],
 ['🤍','Гърбом, ръка за ръка','Площад Батяни','Двамата гледате към Парламента, а камерата е зад вас. Изглежда естествено и не трябва да позирате.'],
 ['👣','„Следвай ме“','Арките на бастиона','Тя върви напред и ви води за ръка, а вие снимате от гърба ѝ. Арките и Парламентът се виждат напред.'],
 ['🎞','Слоу-мо по стълбите','Хабсбургските стълби / Várkert Bazár','Тя слиза бавно, а гимбалът се движи плавно назад пред нея. Снимайте видео в режим слоу-мо.'],
 ['☕','Масата отгоре','New York Café','Кафето и десертът, снимани отвисоко, а после кадър нагоре към позлатения таван.'],
 ['✍️','Вашата бележка','For Sale Pub','Снимайте как пишете бележката и я закачате на стената. Догодина може да се върнете и да я потърсите.'],
 ['🍷','Чаши и светлини','Коледният базар','Греяното вино на преден план, а светлините на базара размазани отзад.'],
 ['🌇','360° около вас','Цитаделата по залез','Гимбалът в режим за завъртане: бавно кръгово видео около вас с целия град отзад.'],
 ['👗','Еднаквите визии','Навсякъде','Поне по един кадър от глава до пети с всяка от избраните визии в тон.'],
 ['⏱','Таймлапс от палубата','Круизът','Телефонът на парапета за 1–2 минути, докато минавате покрай Парламента и мостовете.'],
 ['🚡','Фуникулерът','Под Будайската крепост','Ако слизате с фуникулера, снимайте вагончето, което се разминава с другото, на фона на Верижния мост.']];
const PTIPS=['Залезът на 25–26 декември е около 16:00. Най-хубавата светлина е между 15:30 и 16:45.','В студа батериите падат бързо, затова носете външна батерия и дръжте телефона във вътрешния джоб.','За архитектурата ползвайте режим 0.5×, а нощем включете нощния режим и подпрете телефона на парапет.','Сутрин рано на популярните места няма хора, затова най-хубавите кадри са до 10:00.','Направете серия от кадри, когато ходите или се смеете. Най-естествените снимки излизат така.'];
if($('#ideas')){$('#ideas').innerHTML=IDEAS.map(x=>`<div class="idea card"><span class="ie">${x[0]}</span><div><b>${x[1]}</b><em>${x[2]}</em><p>${x[3]}</p></div></div>`).join('');$('#ptips').innerHTML=PTIPS.map(t=>`<li>${t}</li>`).join('')}

/* ---------- плъзгачи на телефон ---------- */
const MQ=matchMedia('(max-width:760px)');
['#shots','#ideas','#outfits','#acts','#rest','#vids'].forEach(sel=>{const box=$(sel);if(!box)return;box.classList.add('mslide');
 const nav=document.createElement('div');nav.className='mnav';nav.innerHTML='<button aria-label="Назад">‹</button><span></span><div class="mbar"><i></i></div><button aria-label="Напред">›</button>';box.after(nav);
 const [pb,nb]=nav.querySelectorAll('button'),lab=nav.querySelector('span'),bar=nav.querySelector('i');
 const vis=()=>[...box.children].filter(c=>!c.classList.contains('hide')&&c.offsetParent!==null);
 const idx=()=>{const v=vis(),x=box.scrollLeft+box.clientWidth/2;let k=0,b=1e9;v.forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-x);if(d<b){b=d;k=i}});return k};
 const upd=()=>{if(!MQ.matches)return;const v=vis(),n=v.length,i=n?idx():0;lab.textContent=n?(i+1)+' / '+n:'0';bar.style.transform=`scaleX(${n?(i+1)/n:0})`;pb.disabled=i<=0;nb.disabled=i>=n-1;nav.style.display=n>1?'':'none'};
 const go=d=>{const v=vis(),t=v[Math.max(0,Math.min(v.length-1,idx()+d))];if(t)box.scrollTo({left:t.offsetLeft-(box.clientWidth-t.offsetWidth)/2,behavior:RM?'auto':'smooth'})};
 pb.onclick=()=>go(-1);nb.onclick=()=>go(1);
 let raf=0;box.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(upd)},{passive:true});
 let sig='';const chk=()=>{const s=[...box.children].map(c=>c.classList.contains('hide')?0:1).join('');if(s!==sig){sig=s;box.scrollLeft=0;upd()}};new MutationObserver(chk).observe(box,{attributes:true,subtree:true,attributeFilter:['class'],childList:true});
 MQ.addEventListener('change',upd);upd();
});

/* ---------- нашите снимки ---------- */
(()=>{const G2=$('#ugal'),IN=$('#upIn'),NOTE=$('#upNote');if(!G2)return;let PHOTOS=[],ON=null;
 const render=()=>{if(ON===false){G2.innerHTML='<div class="empty">Качването още не е включено.</div>';return}
  G2.innerHTML=PHOTOS.length?PHOTOS.map((p,i)=>`<figure data-i="${i}"><img src="${p.url}" alt="" loading="lazy"><button class="ud" data-u="${p.url}" aria-label="Изтрий">✕</button></figure>`).join(''):'<div class="empty">Още няма снимки. Първата може да е от летището ✈</div>';
  $$('#ugal figure').forEach(f=>f.onclick=e=>{if(e.target.closest('.ud'))return;openLB(PHOTOS.map(p=>[p.url,'']),+f.dataset.i)});
  $$('#ugal .ud').forEach(b=>b.onclick=async e=>{e.stopPropagation();if(!b.classList.contains('sure')){b.classList.add('sure');b.textContent='Изтрий?';setTimeout(()=>{b.classList.remove('sure');b.textContent='✕'},3000);return}
   b.textContent='…';try{const r=await fetch('/api/photos?u='+encodeURIComponent(b.dataset.u),{method:'DELETE'});if(!r.ok)throw 0;PHOTOS=PHOTOS.filter(p=>p.url!==b.dataset.u);render();toast('Снимката е изтрита')}catch(_){toast('Не стана, опитай пак');render()}})};
 const load=async()=>{try{const r=await fetch('/api/photos',{cache:'no-store'});if(r.status===503){ON=false;render();return}if(!r.ok)throw 0;ON=true;PHOTOS=await r.json();render()}catch(_){ON=false;render()}};
 const shrink=f=>new Promise((res,rej)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{const m=1800,k=Math.min(1,m/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.86).split(',')[1])};im.onerror=()=>{URL.revokeObjectURL(u);rej()};im.src=u});
 IN.onchange=async()=>{const fs=[...IN.files];IN.value='';if(!fs.length)return;if(ON===false){toast('Качването още не е включено');return}
  const lab=IN.parentElement;lab.classList.add('busy');let ok=0;
  for(let i=0;i<fs.length;i++){NOTE.textContent=`Качване ${i+1} от ${fs.length}…`;G2.insertAdjacentHTML('afterbegin','<figure class="ph0" id="upTmp">качване…</figure>');
   try{const data=await shrink(fs[i]);const r=await fetch('/api/photos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data})});if(!r.ok)throw 0;const p=await r.json();PHOTOS.unshift(p);ok++}catch(_){toast('Една снимка не можа да се качи')}
   render()}
  lab.classList.remove('busy');NOTE.textContent='';if(ok){toast(ok===1?'Снимката е качена ♥':ok+' снимки са качени ♥');burst(lab)}};
 load();setInterval(()=>{if(!document.hidden&&ON)load()},60000)})();
})();
