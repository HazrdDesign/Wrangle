// Data version 15 migrates stock presets without resetting user libraries.
const LibraryManager = {
 data:null, fs:null, filePath:null, warning:'',
 clone(x){return JSON.parse(JSON.stringify(x));},
 validName(s){return typeof s==='string' && s.trim() && !['__proto__','constructor','prototype'].includes(s);},
 validate(d){
  if(!d || !d.categories || typeof d.categories!=='object' || Array.isArray(d.categories)) throw Error('Invalid library.');
  if(Number(d.version)>15) throw Error('Library requires a newer Wrangle version.');
  Object.keys(d.categories).forEach(c=>{
   if(!this.validName(c)||!Array.isArray(d.categories[c])) throw Error('Invalid category.');
   d.categories[c].forEach(i=>{if(!i||i.id==null||typeof i.name!=='string'||typeof i.code!=='string'||(i.controllers&&!Array.isArray(i.controllers))) throw Error('Invalid expression.');});
  }); return d;
 },
 init(){
  if(typeof require==='function'){
   const fs=require('fs'),path=require('path'),os=require('os');
   const base=process.platform==='win32'?process.env.APPDATA:path.join(os.homedir(),'Library','Application Support');
   const dir=path.join(base,'Hazrd','Wrangle');
   if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});
   this.fs=fs;this.filePath=path.join(dir,'data.json');
   const old=path.join(os.homedir(),'Documents','Wrangle','data.json');
   if(!fs.existsSync(this.filePath)&&fs.existsSync(old))fs.copyFileSync(old,this.filePath);
  } this.load();
 },
 load(){
  const candidates=[];let invalid=false,futureVersion=false;
  const read=text=>{if(!text)return;try{const parsed=JSON.parse(text);if(Number(parsed.version)>15){futureVersion=true;return;}candidates.push(this.validate(parsed));}catch(e){invalid=true;}};
  if(this.fs&&this.filePath&&this.fs.existsSync(this.filePath)){try{read(this.fs.readFileSync(this.filePath,'utf8'));}catch(e){invalid=true;}}
  try{read(localStorage.getItem('wrangle_library'));}catch(e){this.warning='Browser backup unavailable.';}
  if(futureVersion)throw Error('Saved data requires a newer Wrangle version. Nothing was overwritten.');
  if(!candidates.length){
   if(invalid)throw Error('Cannot read saved library. Original data was left untouched; restore a backup.');
   this.data={version:15,revision:0,categories:this.clone(defaultLibrary),icons:{}};this.save();return;
  }
  candidates.sort((a,b)=>(Number(b.revision)||0)-(Number(a.revision)||0));this.data=this.clone(candidates[0]);
  if(invalid)this.warning='Recovered a valid library copy. Check your saved backups.';
  if(Number(this.data.version||0)<15){
   const backup=JSON.stringify(this.data,null,2);
   if(this.fs&&this.filePath)this.fs.writeFileSync(this.filePath+'.pre-v15-'+Date.now()+'.bak',backup,'utf8');
   else localStorage.setItem('wrangle_library_pre_v15',backup);
   this.data=this.migrate(this.data);this.save();
  } this.data.icons=this.data.icons||{};
 },
 migrate(input){
  const d=this.clone(input),originals={},current={},homes={},available={},aliases={};
  const histories=[legacyLibrary,libraryV12,libraryV13,libraryV14];
  histories.forEach(catalog=>Object.keys(catalog).forEach(c=>catalog[c].forEach(x=>{(originals[x.id]||(originals[x.id]=[])).push(x);} )));
  reviewStockVariants.forEach(x=>{(originals[x.id]||(originals[x.id]=[])).push(x);});
  [legacyLibrary].concat(Number(input.version)>=12?[libraryV12]:[]).concat(Number(input.version)>=13?[libraryV13]:[]).concat(Number(input.version)>=14?[libraryV14]:[]).forEach(catalog=>Object.keys(catalog).forEach(c=>catalog[c].forEach(i=>{available[i.id]=true;})));
  Object.keys(defaultLibrary).forEach(c=>defaultLibrary[c].forEach(i=>{current[i.id]=i;homes[i.id]=c;}));
  const same=(a,b)=>a.name===b.name&&a.code===b.code&&JSON.stringify(a.controllers||[])===JSON.stringify(b.controllers||[]);
  Object.keys(d.categories).forEach(c=>{d.categories[c]=d.categories[c].map(i=>{
   const repair=reviewRepairs.find(r=>r.id===i.id&&same(i,r.original));
   if(!repair)return i;
   const replacement=this.clone(current[repair.to]);replacement.id=i.id;
   if(repair.to===301){replacement.controllers.forEach(ctrl=>{if(ctrl.label==='Frame Rate'||ctrl.label==='Frequency')ctrl.value=15;if(ctrl.label==='Amplitude')ctrl.value=5;});}
   if(repair.to===107){const speed=(i.controllers||[]).find(ctrl=>ctrl.name==='Speed');if(speed&&typeof speed.value==='number')replacement.controllers.find(ctrl=>ctrl.label==='Speed').value=speed.value;}
   aliases[repair.to]=i.id;return replacement;
  });});
  Object.keys(d.categories).forEach(c=>{
   d.categories[c]=d.categories[c].reduce((out,i)=>{
    const stock=(originals[i.id]||[]).some(o=>same(i,o)&&(!i.target||i.target===o.target));
    if(stock){if(current[i.id]&&!aliases[i.id])out.push(this.clone(current[i.id]));}
    else out.push(Object.assign({},i,{target:i.target||'any'}));
    return out;
   },[]);
  });
  const seen={};Object.keys(d.categories).forEach(c=>d.categories[c].forEach(i=>{seen[i.id]=true;}));
  const restore=[301,302,402,403,601,602,603];
  Object.keys(current).forEach(id=>{
   if(!seen[id]&&!aliases[id]&&(!available[id]||restore.includes(Number(id)))){
    const cat=homes[id];if(!d.categories[cat])d.categories[cat]=[];d.categories[cat].push(this.clone(current[id]));seen[id]=true;
   }
  });
  // The anchor belongs only in Essentials. Move recognized copies, never name-match arbitrary user code.
  Object.keys(d.categories).filter(c=>c!=='Essentials').forEach(c=>{
   d.categories[c]=d.categories[c].filter(i=>{
    if((i.id===407||i.id===aliases[407])&&i.code===current[407].code){if(!d.categories.Essentials)d.categories.Essentials=[];d.categories.Essentials.push(i);return false;}return true;
   });
  });
  d.categories=Object.assign({Essentials:d.categories.Essentials||[]},d.categories);
  d.version=15;d.icons=d.icons||{};return d;
 },
 save(){
  this.data.revision=Math.max(Date.now(),Number(this.data.revision||0)+1);
  const text=JSON.stringify(this.data,null,2);let fileOK=false,backupOK=false,fileError='';
  if(this.fs&&this.filePath){
   try{this.fs.writeFileSync(this.filePath+'.tmp',text,'utf8');this.fs.renameSync(this.filePath+'.tmp',this.filePath);fileOK=true;}
   catch(e){fileError=e.message;}
  }
  try{localStorage.setItem('wrangle_library',text);backupOK=true;}catch(e){}
  if(!fileOK&&!backupOK)throw Error('Could not save your library. Previous saved data is unchanged.');
  this.warning=this.fs&&!fileOK?'Saved to browser backup only. File save failed: '+fileError:!backupOK?'Saved to file; browser backup is unavailable.':'';
 },
 transaction(fn){const before=this.clone(this.data);try{fn();this.validate(this.data);this.save();}catch(e){this.data=before;throw e;}},
 getCategories(){return Object.keys(this.data.categories);},
 getStoredItems(c){return Object.prototype.hasOwnProperty.call(this.data.categories,c)?this.data.categories[c]:[];},
 getItems(c){
  if(c!=='Essentials')return this.getStoredItems(c);
  const items=this.getStoredItems(c).slice(),seen={};items.forEach(i=>{seen[i.id]=true;});
  Object.keys(this.data.categories).filter(k=>k!==c).forEach(k=>this.getStoredItems(k).forEach(i=>{if(i.essential&&!seen[i.id]){items.push(i);seen[i.id]=true;}}));
  const order=this.data.essentialOrder||[];items.sort((a,b)=>{const x=order.indexOf(a.id),y=order.indexOf(b.id);return (x<0?order.length:x)-(y<0?order.length:y);});return items;
 },
 sourceCategory(c,id){if(c==='Essentials'&&!this.getStoredItems(c).some(i=>i.id===id))return Object.keys(this.data.categories).find(k=>this.getStoredItems(k).some(i=>i.id===id))||c;return c;},
 getIcon(c){return this.data.icons[c]||'';},
 saveExpression(oldCat,oldId,cat,item){
  if(!this.validName(cat))throw Error('Choose a valid category.');
  if(oldId!=null)oldCat=this.sourceCategory(oldCat,oldId);
  this.transaction(()=>{
   if(oldId!=null&&oldCat===cat){const n=this.getStoredItems(cat).findIndex(x=>x.id===oldId);if(n<0)throw Error('Expression no longer exists.');this.data.categories[cat][n]=item;}
   else{if(oldId!=null)this.data.categories[oldCat]=this.getStoredItems(oldCat).filter(x=>x.id!==oldId);if(!Object.prototype.hasOwnProperty.call(this.data.categories,cat))this.data.categories[cat]=[];this.data.categories[cat].push(item);}
  });
 },
 removeExpression(c,id){c=this.sourceCategory(c,id);this.transaction(()=>{this.data.categories[c]=this.getStoredItems(c).filter(x=>x.id!==id);});},
 createCategory(name,icon){
  if(!this.validName(name))throw Error('Choose a valid category name.');
  if(Object.prototype.hasOwnProperty.call(this.data.categories,name))throw Error('Category already exists.');
  this.transaction(()=>{this.data.categories[name]=[];this.data.icons[name]=icon||'';});
 },
 renameCategory(old,name,icon){
  if(old==='Essentials')throw Error('Essentials is a built-in view. Move individual expressions to organize them.');
  if(!this.validName(name))throw Error('Choose a valid category name.');
  if(old!==name&&Object.prototype.hasOwnProperty.call(this.data.categories,name))throw Error('Category already exists.');
  this.transaction(()=>{const cats={};Object.keys(this.data.categories).forEach(c=>{cats[c===old?name:c]=this.data.categories[c];});this.data.categories=cats;delete this.data.icons[old];this.data.icons[name]=icon||'';});
 },
 deleteCategory(c){if(c==='Essentials')throw Error('Essentials is a built-in view.');this.transaction(()=>{delete this.data.categories[c];delete this.data.icons[c];});},
 reorderExpression(c,from,to){
  const list=this.getItems(c);
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=list.length||to>=list.length)return;
  this.transaction(()=>{list.splice(to,0,list.splice(from,1)[0]);if(c==='Essentials')this.data.essentialOrder=list.map(i=>i.id);});
 },
 reorderCategories(from,to){
  const cats=this.getCategories();
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=cats.length||to>=cats.length)return;
  this.transaction(()=>{cats.splice(to,0,cats.splice(from,1)[0]);const d={};cats.forEach(c=>{d[c]=this.data.categories[c];});this.data.categories=d;});
 }
};
