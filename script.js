const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.textContent='☰';
}));

const projectDetails = {
  '0G HEALTH': {type:'NASA SPACE APPS CHALLENGE · 2026', title:'0G Health — suivi de santé des astronautes', description:'Projet réalisé en équipe de six personnes : conception d’un dispositif de suivi de la santé des astronautes en longue mission, avec des alertes vert / jaune / rouge et des conseils adaptés. Contribution au développement en C de modèles d’estimation de la perte osseuse et musculaire à partir de l’exercice et de la nutrition, ainsi qu’à la création de l’interface.', chips:['C','Santé spatiale','Modélisation','Interface','1er prix local']},
  'SÉCURITÉ AQUATIQUE': {type:'HACKING HEALTH BESANÇON · 48 H · OCTOBRE 2026', title:'Brassard anti-noyade pour enfants', description:'Prototype développé en équipe pluridisciplinaire. Une centrale inertielle et un capteur PPG connectés à un ESP32 (M5Stack Core2) croisent les mouvements et le rythme cardiaque. Une alerte sans fil ESP-NOW peut être envoyée au parent ; des mouvements de nage et de détresse ont été simulés pour ajuster les seuils.', chips:['ESP32','M5Stack Core2','IMU','PPG','ESP-NOW']},
  'COMMANDE VOCALE': {type:'SYSTÈMES EMBARQUÉS', title:'Véhicule à commande vocale', description:'Travail sur l’architecture système et le code C++ sur Arduino, avec intégration de capteurs, de moteurs et de modules sans fil. Réalisation de tests, optimisation et analyse des performances.', chips:['Arduino','C++','Capteurs','Moteurs','Sans fil']},
  'CONCEPTION PCB': {type:'ÉLECTRONIQUE & PROTOTYPAGE', title:'Conception d’une carte électronique', description:'Conception du schéma sous KiCad, soudure CMS et prototypage. Le travail comprend également les tests fonctionnels, le dépannage et la constitution du dossier technique.', chips:['KiCad','Soudure CMS','Prototypage','Validation']},
  'ROBOTIQUE & CONTRÔLE': {type:'PROJET UNIVERSITAIRE', title:'Robot LEGO EV3 détecteur de couleur', description:'Mise au point d’un robot détecteur de couleur avec réglage de la vitesse et des gains. Comparaison des performances avec un correcteur proportionnel (P), puis proportionnel-dérivé (PD).', chips:['LEGO EV3','Capteur couleur','P','PD']},
  'SIMULATION': {type:'AUTOMATIQUE · SIMULINK', title:'Contrôle-commande moteur Feedback', description:'Modélisation et simulation d’un contrôleur analogique sous Simulink, puis optimisation du comportement de la boucle fermée.', chips:['MATLAB','Simulink','Boucle fermée','Régulation']}
};
const dialog = document.getElementById('projectDialog');
const photos = {};
const docs = {};
function openProject(card){
  const label = card.querySelector('.image-label').textContent;
  const data = projectDetails[label]; if(!data) return;
  document.getElementById('dialogType').textContent=data.type;
  document.getElementById('dialogTitle').textContent=data.title;
  document.getElementById('dialogDescription').textContent=data.description;
  document.getElementById('dialogChips').innerHTML=data.chips.map(chip=>`<span>${chip}</span>`).join('');
  const photo=document.getElementById('dialogPhoto');
  if(photos[label]){photo.src=photos[label];photo.alt=data.title;photo.hidden=false;}else{photo.hidden=true;photo.removeAttribute('src');}
  document.getElementById('dialogActions').innerHTML=docs[label]?'<a class="button primary" href="'+docs[label]+'" target="_blank" rel="noopener">Lire le compte rendu (PDF) <span>↗</span></a>':'';
  dialog.showModal();
}
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('click',()=>openProject(card));
  card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openProject(card);}});
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});

const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.main-nav a')];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}
}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section=>observer.observe(section));

/* Photos : dépose tes images dans le dossier images/ avec ces noms (jpg, jpeg, png ou webp) */
const photoNames={'0G HEALTH':'0g-health','SÉCURITÉ AQUATIQUE':'brassard','COMMANDE VOCALE':'vehicule','CONCEPTION PCB':'carte-pcb','ROBOTIQUE & CONTRÔLE':'ev3','SIMULATION':'simulink'};
function findImage(base,done){
  const exts=['jpg','jpeg','png','webp'], dirs=['images/',''];
  const tries=[]; dirs.forEach(d=>exts.forEach(e=>tries.push(d+base+'.'+e)));
  (function next(i){
    if(i>=tries.length) return;
    const img=new Image();
    img.onload=()=>done(tries[i]); img.onerror=()=>next(i+1); img.src=tries[i];
  })(0);
}
document.querySelectorAll('.project-card').forEach(card=>{
  const label=card.querySelector('.image-label').textContent, base=photoNames[label];
  if(!base) return;
  findImage(base,url=>{
    photos[label]=url;
    const box=card.querySelector('.project-image');
    box.style.backgroundImage='url("'+url+'")'; box.classList.add('has-photo');
  });
});
document.querySelectorAll('[data-photo]').forEach(el=>findImage(el.dataset.photo,url=>{el.style.backgroundImage='url("'+url+'")';el.hidden=false;}));
findImage('portrait',url=>{
  const p=document.querySelector('.portrait-placeholder');
  p.style.backgroundImage='url("'+url+'")'; p.classList.add('has-photo');
});

/* Comptes rendus PDF : dépose-les dans le dossier documents/ avec ces noms (ex. brassard.pdf) */
document.querySelectorAll('.project-card').forEach(card=>{
  const label=card.querySelector('.image-label').textContent, base=photoNames[label];
  if(!base) return;
  const url='documents/'+base+'.pdf';
  fetch(url,{method:'HEAD'}).then(r=>{
    if(!r.ok) return;
    docs[label]=url;
    const chips=card.querySelector('.chips'); if(chips) chips.insertAdjacentHTML('beforeend','<span>📄 Rapport PDF</span>');
  }).catch(()=>{});
});
document.querySelectorAll('[data-doc]').forEach(el=>{
  const url='documents/'+el.dataset.doc+'.pdf';
  fetch(url,{method:'HEAD'}).then(r=>{if(r.ok) el.hidden=false;}).catch(()=>{});
});
