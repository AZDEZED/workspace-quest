/* Workspace Quest V2. Les données de suivi sont transmises au seul service pédagogique configuré. */
(() => {
 'use strict';
 const ENDPOINT = '__DEPLOYMENT_URL__';
 const QUEUE_KEY='workspace-quest-outbox-v2',CONFIG_KEY='workspace-quest-forms-v2';
 const sessionId=crypto.randomUUID();let activeSeconds=0,lastTick=Date.now(),lastActivity=Date.now(),sending=false,retryTimer=null;
 let forms=[],status='Initialisation du suivi…',queue=[];
 try{queue=JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]');if(!Array.isArray(queue))queue=[];forms=JSON.parse(localStorage.getItem(CONFIG_KEY)||'[]');}catch(_){queue=[];forms=[];}
 const validProfile=()=>String(state.profile.surname||'').trim().length>=2&&String(state.profile.name||'').trim().length>=2;
 const persist=()=>{try{localStorage.setItem(QUEUE_KEY,JSON.stringify(queue));}catch(_){status='Mémoire pleine : exportez votre bilan et prévenez l’enseignant.';}};
 function jsonp(action,id){return new Promise((resolve,reject)=>{
  const cb='wqCB_'+crypto.randomUUID().replaceAll('-',''),script=document.createElement('script');let timer;
  const cleanup=()=>{clearTimeout(timer);script.remove();delete window[cb];};
  window[cb]=data=>{cleanup();resolve(data);};script.onerror=()=>{cleanup();reject(new Error('Service inaccessible'));};
  const u=new URL(ENDPOINT);u.searchParams.set('action',action);u.searchParams.set('callback',cb);if(id)u.searchParams.set('id',id);u.searchParams.set('_',Date.now());
  script.src=u.href;timer=setTimeout(()=>{cleanup();reject(new Error('Délai de réponse dépassé'));},20000);document.head.append(script);
 });}
 function paint(){const el=document.getElementById('wq-status');if(el)el.textContent=status+(queue.length?' ('+queue.length+' envoi(s) en attente)':'');}
 function enqueue(type,question){
  if(!validProfile()){status='Renseignez votre nom, votre prénom et votre classe pour activer le suivi.';paint();return;}
  const mod=MODS.find(m=>m.id===current);
  const p={id:crypto.randomUUID(),type,student:{surname:state.profile.surname,name:state.profile.name,classe:state.profile.classe},sessionId,activeSeconds:Math.floor(activeSeconds),moduleId:mod?.id||'home',checks:mod?{[mod.id]:state.checks[mod.id]||{}}:{},answers:question!==undefined?{[question]:state.answers[question]||[]}: {},declared:mod?{[mod.id]:!!state.declared[mod.id]}:{}};
  if(question!==undefined)p.question=question;
  // Une seule présence périodique en attente par séance. Les réponses aux quiz sont conservées.
  if(type==='heartbeat'){const i=queue.findIndex(e=>e.type==='heartbeat'&&e.sessionId===sessionId);if(i!==-1)queue.splice(i,1);}
  queue.push(p);persist();paint();flush();
 }
 async function flush(){
  if(sending||!queue.length)return;
  if(!navigator.onLine){status='Hors connexion : données conservées sur cet appareil.';paint();return;}
  sending=true;clearTimeout(retryTimer);
  try{
   while(queue.length){
    const p=queue[0];status='Transmission au tableau enseignant…';paint();
    await fetch(ENDPOINT,{method:'POST',mode:'no-cors',credentials:'omit',body:new URLSearchParams({payload:JSON.stringify(p)})});
    const ack=await jsonp('ack',p.id);if(!ack.ok||ack.id!==p.id)throw new Error('Réception non confirmée');
    queue.shift();persist();
   }
   status='Réception confirmée par le tableau enseignant à '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  }catch(_){status='Envoi non confirmé. Vos données restent sur cet appareil. Réessayez avec le bouton ci-dessous.';retryTimer=setTimeout(flush,60000);}
  finally{sending=false;paint();}
 }
 function formUrl(f){
  if(!validProfile())return f.url;
  const u=new URL(f.prefill||f.url);
  for(const [k,v] of u.searchParams){
   if(v==='__NOM__')u.searchParams.set(k,state.profile.surname);
   else if(v==='__PRENOM__')u.searchParams.set(k,state.profile.name);
   else if(v==='__CLASSE__'||v===CLASSES['2epc'].label)u.searchParams.set(k,CLASSES[state.profile.classe].label);
  }
  return u.href;
 }
 function enhance(){
  const panel=document.createElement('section');panel.className='panel';panel.id='wq-panel';
  panel.innerHTML='<h2>Validation et suivi</h2><p id="wq-status" role="status"></p><button class="btn secondary" id="wq-sync">Renvoyer les données en attente</button><p class="notice">Le suivi enregistre votre nom, votre classe, les dates, les réponses et une estimation du temps actif pour votre enseignant. Votre identité est déclarative. Les manipulations cochées restent à vérifier sur vos productions.</p>';
  const relevant=current==='home'?forms:forms.filter(f=>f.mods.includes(current));
  if(relevant.length){
   const list=document.createElement('div');list.className='row';list.style.marginTop='12px';
   for(const f of relevant){const a=document.createElement('a');a.className='btn outline';a.textContent=f.name+' · Google Forms ↗';a.href=formUrl(f);a.target='_blank';a.rel='noopener noreferrer';a.addEventListener('click',e=>{if(!validProfile()){e.preventDefault();toast('Complétez d’abord votre nom, votre prénom et votre classe sur le tableau de bord.');}});list.append(a);}panel.append(list);
  }else{const p=document.createElement('p');p.className='notice';p.textContent='Chargement des liens de validation…';panel.append(p);}
  const main=document.getElementById('main');if(current==='home')main.insertBefore(panel,main.children[1]||null);else main.append(panel);
  document.getElementById('wq-sync').onclick=flush;paint();
 }
 const baseRender=render;render=function(){baseRender();enhance();};
 window.wqTrack=(type,question)=>enqueue(type,question);
 ['pointerdown','keydown','scroll','touchstart'].forEach(t=>document.addEventListener(t,()=>{lastActivity=Date.now();},{passive:true}));
 document.addEventListener('visibilitychange',()=>{lastTick=Date.now();if(document.visibilityState==='hidden')enqueue('heartbeat');else flush();});
 window.addEventListener('online',flush);
 setInterval(()=>{const now=Date.now(),elapsed=Math.min((now-lastTick)/1000,10);if(document.visibilityState==='visible'&&now-lastActivity<60000)activeSeconds+=Math.max(elapsed,0);lastTick=now;},5000);
 setInterval(()=>{if(validProfile()&&document.visibilityState==='visible')enqueue('heartbeat');},60000);
 render();
 jsonp('config').then(data=>{if(!data.ok||!data.forms?.length)throw new Error();forms=data.forms;try{localStorage.setItem(CONFIG_KEY,JSON.stringify(forms));}catch(_){}render();}).catch(()=>{status='Liens de validation indisponibles pour le moment. Réessayez en rechargeant la page.';paint();});
 if(validProfile())enqueue('session');else{status='Complétez votre nom, votre prénom et votre classe pour activer le suivi.';paint();flush();}
})();
