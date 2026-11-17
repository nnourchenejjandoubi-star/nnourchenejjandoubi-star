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
  '0G HEALTH': {type:'NASA SPACE APPS CHALLENGE · 2026', title:'0G Health — suivi de santé des astronautes', description:'# Le défi\nConcevoir un dispositif de suivi de la santé des astronautes en mission de longue durée, lors du NASA Space Apps Challenge 2026 (événement local de Besançon).\n# Notre solution\nUne équipe de six personnes. Le dispositif affiche l’état de santé avec des alertes vert, jaune ou rouge, et propose des conseils adaptés à l’astronaute.\n# Mon rôle\n- Développement en C de modèles d’estimation de la perte osseuse et musculaire à partir de l’exercice et de la nutrition.\n- Contribution à la création de l’interface.\n# Résultat\n1er prix de l’événement local de Besançon.', links:[{label:'Voir le projet en ligne',url:'https://mikolajkurek.github.io/Baseline/'}], chips:['C','Santé spatiale','Modélisation','Interface','1er prix local']},
  'SÉCURITÉ AQUATIQUE': {type:'HACKING HEALTH BESANÇON · 48 H · OCTOBRE 2026', title:'Brassard anti-noyade pour enfants', description:'# Le défi\nExploiter une centrale inertielle (accéléromètre et gyroscope), en plus des capteurs de rythme cardiaque, pour reconnaître les gestes d’une noyade chez l’enfant.\n# Notre méthode\nPlutôt que de supposer ces gestes, l’équipe les a mesurés : une enfant de 10 ans, volontaire, a reproduit environ 44 gestes de noyade. Ces enregistrements ont servi de référence pour écrire le programme de détection.\n# Mon rôle\n- Câblage électronique des capteurs (PPG, oxymètre) sur le microcontrôleur ESP32.\n- Programmes de lecture des données de plusieurs capteurs.\n- Traitement des signaux et réduction du nombre de messages envoyés, en travaillant à basse fréquence, pour tenir compte des contraintes d’un objet porté dans l’eau.\n# Résultat\nPrototype réalisé en 48 h par une équipe pluridisciplinaire : alerte sans fil ESP-NOW vers le parent, qui croise mouvement et rythme cardiaque, avec des essais de nage et de détresse simulés pour ajuster les seuils.', chips:['ESP32','M5Stack Core2','IMU','PPG','ESP-NOW']},
  'COMMANDE VOCALE': {type:'SYSTÈMES EMBARQUÉS', title:'Véhicule à commande vocale', description:'Travail sur l’architecture système et le code C++ sur Arduino, avec intégration de capteurs, de moteurs et de modules sans fil. Réalisation de tests, optimisation et analyse des performances.', chips:['Arduino','C++','Capteurs','Moteurs','Sans fil']},
  'CONCEPTION PCB': {type:'ÉLECTRONIQUE & PROTOTYPAGE', title:'Conception d’une carte électronique', description:'Conception du schéma sous KiCad, soudure CMS et prototypage. Le travail comprend également les tests fonctionnels, le dépannage et la constitution du dossier technique.', chips:['KiCad','Soudure CMS','Prototypage','Validation']},
  'ROBOTIQUE & CONTRÔLE': {type:'PROJET UNIVERSITAIRE', title:'Robot LEGO EV3 détecteur de couleur', description:'Mise au point d’un robot détecteur de couleur avec réglage de la vitesse et des gains. Comparaison des performances avec un correcteur proportionnel (P), puis proportionnel-dérivé (PD).', chips:['LEGO EV3','Capteur couleur','P','PD']},
  'SIMULATION': {type:'AUTOMATIQUE · SIMULINK', title:'Contrôle-commande moteur Feedback', description:'Modélisation et simulation d’un contrôleur analogique sous Simulink, puis optimisation du comportement de la boucle fermée.', chips:['MATLAB','Simulink','Boucle fermée','Régulation']},
  'INSTRUMENTATION': {type:'PROJET UNIVERSITAIRE · INSTRUMENTATION', title:'Refroidisseur automatisé', description:'Pilotage d’un refroidisseur automatisé avec une carte d’acquisition sous LabVIEW : commande et lecture de signaux analogiques et numériques, avec mise en pratique des principes d’instrumentation et de mesure.', chips:['LabVIEW','Acquisition','Instrumentation','Mesure']}
};
const dialog = document.getElementById('projectDialog');
const photos = {};
const docs = {};
function renderText(el,text){
  el.innerHTML=''; let ul=null;
  text.split('\n').forEach(line=>{
    if(!line.trim()) return;
    if(line.startsWith('# ')){ul=null;const h=document.createElement('h4');h.textContent=line.slice(2);el.appendChild(h);}
    else if(line.startsWith('- ')){if(!ul){ul=document.createElement('ul');el.appendChild(ul);}const li=document.createElement('li');li.textContent=line.slice(2);ul.appendChild(li);}
    else{ul=null;const p=document.createElement('p');p.textContent=line;el.appendChild(p);}
  });
}
function openProject(card){
  const label = card.querySelector('.image-label').textContent;
  const data = projectDetails[label]; if(!data) return;
  document.getElementById('dialogType').textContent=data.type;
  document.getElementById('dialogTitle').textContent=data.title;
  renderText(document.getElementById('dialogDescription'),data.description);
  document.getElementById('dialogChips').innerHTML=data.chips.map(chip=>`<span>${chip}</span>`).join('');
  document.getElementById('dialogPhotos').innerHTML=(photos[label]||[]).map(u=>'<img src="'+u+'" alt="'+data.title.replace(/"/g,'&quot;')+'">').join('');
  const acts=[]; if(docs[label]) acts.push('<a class="button primary" href="'+docs[label]+'" target="_blank" rel="noopener">Lire le compte rendu (PDF) <span>↗</span></a>');
  (data.links||[]).forEach(l=>acts.push('<a class="button secondary" href="'+l.url+'" target="_blank" rel="noopener">'+l.label+' <span>↗</span></a>'));
  document.getElementById('dialogActions').innerHTML=acts.join('');
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
const photoNames={'0G HEALTH':'0g-health','SÉCURITÉ AQUATIQUE':'brassard','COMMANDE VOCALE':'vehicule','CONCEPTION PCB':'carte-pcb','ROBOTIQUE & CONTRÔLE':'ev3','SIMULATION':'simulink','INSTRUMENTATION':'refroidisseur'};
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
    photos[label]=[url];
    ['-2','-3'].forEach(sfx=>findImage(base+sfx,u=>photos[label].push(u)));
    const box=card.querySelector('.project-image');
    box.style.backgroundImage='url("'+url+'")'; box.classList.add('has-photo');
  });
});
document.querySelectorAll('[data-photo]').forEach(el=>['','-2','-3'].forEach(sfx=>findImage(el.dataset.photo+sfx,url=>{const im=document.createElement('img');im.src=url;im.alt='';el.appendChild(im);el.hidden=false;})));
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

/* Comptes rendus de TP : pour en ajouter un, copie une ligne ci-dessous, change le titre, la description et le nom du fichier,
   puis dépose le PDF dans le dossier documents/. Un TP dont le PDF est absent n'apparaît pas sur le site. */
const tpDocs=[
  {title:'TP FPGA : VHDL sous Quartus', desc:'Afficheur BCD 7 segments, bascules, serrure de sécurité.', file:'tp-fpga.pdf'},
  {title:'TP Régulation : robot LEGO EV3', desc:'Réglage de la vitesse et des gains, correcteurs P puis PD.', file:'tp-ev3.pdf'}
];
(function(){
  const sec=document.querySelector('.tp-section'), grid=document.getElementById('tpGrid');
  tpDocs.forEach(t=>fetch('documents/'+t.file,{method:'HEAD'}).then(r=>{
    if(!r.ok) return;
    const a=document.createElement('a'); a.className='tp-card'; a.href='documents/'+t.file; a.target='_blank'; a.rel='noopener';
    a.innerHTML='<span class="tp-icon">📄</span><span><b></b><small></small></span>';
    a.querySelector('b').textContent=t.title; a.querySelector('small').textContent=t.desc;
    grid.appendChild(a); sec.hidden=false;
  }).catch(()=>{}));
})();
