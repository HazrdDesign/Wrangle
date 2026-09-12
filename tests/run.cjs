const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.join(__dirname,'../Extension Files');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let passed=0;const results=[];
function test(name,fn){try{fn();passed++;results.push({name,pass:true});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:e.stack});console.error('FAIL '+name+'\n'+e.stack);}}
function library(saved){
 const store={};if(saved)store.wrangle_library=JSON.stringify(saved);
 const c=vm.createContext({console,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v}}});
 ['legacy-library.js','presets.js','library.js'].forEach(f=>vm.runInContext(read('client/js/'+f),c));
 vm.runInContext('this.manager=LibraryManager;this.presets=defaultLibrary;this.legacy=legacyLibrary;this.previous=libraryV12;this.targets=targetTypes;',c);
 c.store=store;return c;
}
function runtime(){
 const c=vm.createContext({console});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'ae-mock.js'),'utf8'),c);
 vm.runInContext(read('host/index.jsx'),c);return c;
}
const c=library();c.manager.load();const items=Object.values(c.presets).flat();
const byId=id=>items.find(x=>x.id===id);
test('Retired presets are absent and 25 presets ship',()=>{
 assert.equal(items.length,25);
 [101,102,103,106,204,205,206,303,401,405,702].forEach(id=>assert(!byId(id)));
});
test('Every preset has valid target metadata and complete controllers',()=>{
 items.forEach(i=>{
  assert(c.targets[i.target]);new vm.Script(i.code);
  [...i.code.matchAll(/effect\("([^"]+)"\)/g)].forEach(m=>assert(i.controllers.some(x=>x.name===m[1])));
  i.controllers.forEach(ctrl=>{assert(ctrl.value!==undefined);assert(ctrl.name.startsWith('Wrangle '+i.id+' - '));});
 });
});
test('Migration preserves custom categories, modified entries and deletions',()=>{
 const source={version:10,categories:{Client:[{id:900,name:'mine',code:'value'}],Text:[JSON.parse(JSON.stringify(c.legacy.Text[0])),{...c.legacy.Text[1],code:'my custom code'}]},icons:{Client:'X'}};
 const d=c.manager.migrate(source);
 assert.equal(d.categories.Client[0].id,900);assert.equal(d.categories.Text[0].code,'my custom code');assert.equal(d.categories.Text.length,2);
 assert.equal(d.categories.Text[1].id,107);assert(d.categories.Wiggle.every(i=>[305,306,307].includes(i.id)));assert.equal(d.icons.Client,'X');
});
test('Migration retires stock entries and backs up original',()=>{
 const m=library({version:11,categories:c.legacy,icons:{}});m.manager.load();
 assert.equal(Object.values(m.manager.data.categories).flat().length,25);assert(m.store.wrangle_library_pre_v13);
});
test('Newer backup wins over stale disk file',()=>{
 const m=library({version:13,revision:20,categories:{Custom:[{id:1,name:'new',code:'value'}]},icons:{}});
 m.manager.fs={existsSync:()=>true,readFileSync:()=>JSON.stringify({version:13,revision:10,categories:{Custom:[]},icons:{}})};
 m.manager.filePath='mock';m.manager.load();assert.equal(m.manager.getItems('Custom').length,1);
});
test('Invalid data is never reset',()=>{
 const m=library();m.store.wrangle_library='{';assert.throws(()=>m.manager.load());assert.equal(m.store.wrangle_library,'{');
});
test('Future-version file is never replaced by an older backup',()=>{
 const m=library({version:13,revision:1,categories:{Custom:[]},icons:{}});
 m.manager.fs={existsSync:()=>true,readFileSync:()=>JSON.stringify({version:14,categories:{Custom:[]}})};
 m.manager.filePath='mock';assert.throws(()=>m.manager.load(),/newer Wrangle/);
});
test('Failed writes roll back the in-memory edit',()=>{
 const m=library();m.manager.load();const before=JSON.stringify(m.manager.data);
 m.localStorage.setItem=()=>{throw Error('full');};
 assert.throws(()=>m.manager.createCategory('Client',''));assert.equal(JSON.stringify(m.manager.data),before);
});
test('Rename collision keeps both categories unchanged',()=>{
 const m=library();m.manager.load();const before=JSON.stringify(m.manager.data);
 assert.throws(()=>m.manager.renameCategory('Text','Time',''));assert.equal(JSON.stringify(m.manager.data),before);
});
test('Edit preserves ID and row order',()=>{
 const m=library();m.manager.load();const item={...m.manager.getItems('Text')[1],name:'Edited'};
 m.manager.saveExpression('Text',item.id,'Text',item);assert.equal(m.manager.getItems('Text')[1].name,'Edited');
});
test('Real filesystem replacement persists consecutive edits',()=>{
 const dir=fs.mkdtempSync(path.join(require('os').tmpdir(),'wrangle-check-'));
 const filename=path.join(dir,'data.json');
 try {
  const m=library();m.manager.fs=fs;m.manager.filePath=filename;m.manager.load();
  m.manager.createCategory('First','');m.manager.createCategory('Second','');
  const saved=JSON.parse(fs.readFileSync(filename,'utf8'));
  assert(saved.categories.First);assert(saved.categories.Second);assert(!fs.existsSync(filename+'.tmp'));
 } finally {if(fs.existsSync(filename))fs.unlinkSync(filename);if(fs.existsSync(filename+'.tmp'))fs.unlinkSync(filename+'.tmp');fs.rmdirSync(dir);}
});
test('Opacity rejects Position before any mutation',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Position",type:3}]);',h);
 const r=JSON.parse(h.applyExpression(byId(302).code,byId(302).controllers,c.targets.opacity,'both'));
 assert(!r.ok);assert.equal(h.layer.effects.length,0);assert.equal(h.layer.selectedProperties[0].expression,'');
});
test('Explicit controllers-only mode does not require a compatible property',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Position",type:3}]);',h);
 const r=JSON.parse(h.applyExpression(byId(302).code,byId(302).controllers,c.targets.opacity,'controllers'));
 assert(r.ok);assert.equal(r.applied,0);assert.equal(r.controllers,1);assert.equal(h.layer.selectedProperties[0].expression,'');
});
test('Empty first layer does not abort later targets',()=>{
 const h=runtime();vm.runInContext('makeLayer("Empty",[]);var layer=makeLayer("Valid",[{matchName:"ADBE Opacity"}]);',h);
 const r=JSON.parse(h.applyExpression('value',[],c.targets.opacity,'both'));assert(r.ok);assert.equal(r.applied,1);assert.equal(h.undo,0);
});
test('New controls get defaults; reused controls keep values',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Opacity"}]);',h);
 const p=byId(302);let r=JSON.parse(h.applyExpression(p.code,p.controllers,c.targets.opacity,'both'));
 assert(r.ok);assert.equal(h.layer.effects[0].property(1).value,12);
 h.layer.effects[0].property(1).setValue(7);
 r=JSON.parse(h.applyExpression(p.code,p.controllers,c.targets.opacity,'both'));
 assert.equal(h.layer.effects.length,1);assert.equal(h.layer.effects[0].property(1).value,7);
});
test('Evaluation failure restores old expression and removes added controls',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Opacity"}]);layer.selectedProperties[0].expression="value";',h);
 const r=JSON.parse(h.applyExpression('INVALID',byId(302).controllers,c.targets.opacity,'both'));
 assert(!r.ok);assert.equal(h.layer.selectedProperties[0].expression,'value');assert.equal(h.layer.effects.length,0);assert.equal(h.undo,0);
});
test('Wrong-type control collision fails without replacing it',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Opacity"}]);var effect=layer.property("ADBE Effect Parade").addProperty("ADBE Color Control");',h);
 h.effect.name=byId(302).controllers[0].name;
 const r=JSON.parse(h.applyExpression('value',byId(302).controllers,c.targets.opacity,'both'));
 assert(!r.ok);assert.equal(h.layer.effects[0].matchName,'ADBE Color Control');
});
test('Capture saves values and finds expressions after empty layers',()=>{
 const h=runtime();vm.runInContext('makeLayer("Empty",[]);var layer=makeLayer("L",[{matchName:"ADBE Opacity"}]);var effect=layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");effect.name="Speed";effect.property(1).setValue(42);layer.selectedProperties[0].expression=\'effect("Speed")(1)\';',h);
 const r=JSON.parse(h.captureExpressionAndControllers(true));assert(r.ok);assert.equal(r.controllers[0].value,42);
 assert.equal(JSON.parse(h.getSelectedExpression()).controllers.length,0);
});
test('No comp removal balances undo state',()=>{
 const h=runtime();h.app.project.activeItem=null;assert(!JSON.parse(h.removeAllExpressions()).ok);assert.equal(h.undo,0);
});
test('Missing required keyframes create no controls',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Opacity"}]);',h);
 assert(!JSON.parse(h.applyExpression('value',byId(201).controllers,{...c.targets.numeric,requiresKeys:2},'both')).ok);assert.equal(h.layer.effects.length,0);
});
function evaluate(id,values,extras={}){
 return vm.runInNewContext(byId(id).code,{time:1,inPoint:0,outPoint:10,value:1,thisComp:{frameDuration:1/30},effect:name=>()=>values[name.split(' - ')[1]],...extras});
}
test('Number Counter uses controller values and formats decimals',()=>{
 assert.equal(evaluate(105,{Value:12345.678,Decimals:2}),'12,345.68');assert.equal(evaluate(105,{Value:-5,Decimals:-1}),'-5');
});
test('Sine Path remains finite with zero length and wavelength',()=>{
 const pts=evaluate(404,{Amplitude:40,Wavelength:0,Length:0,'Phase Degrees':0},{createPath:p=>p});
 assert.equal(pts.length,200);assert(pts.every(p=>p.every(Number.isFinite)));
});
test('Loop wiggle remains finite and joins at its seam',()=>{
 const controls={Frequency:1,Amplitude:25,Duration:3};
 const extra={wiggle:(f,a,o,m,t)=>Math.sin(t*1.7)*a,linear:(t,a,b,x,y)=>x+(y-x)*(t-a)/(b-a)};
 assert(Math.abs(evaluate(304,controls,{...extra,time:3-1e-7})-evaluate(304,controls,{...extra,time:0}))<1e-4);
 assert(Number.isFinite(evaluate(304,{...controls,Duration:0},extra)));
});
test('Orbit preserves Z; Random Scale is uniform in 3D',()=>{
 const p=evaluate(406,{Speed:.25,Radius:100},{value:[10,20,30]});assert.equal(p[2],30);assert(Math.abs(p[1]-120)<1e-8);
 const s=evaluate(402,{Minimum:50,Maximum:150,Seed:0},{value:[100,100,100],index:1,seedRandom(){},random:()=>70});assert.deepEqual(Array.from(s),[70,70,70]);
});
test('Color presets preserve alpha and derive original hue',()=>{
 const random=evaluate(602,{'Changes Per Second':1,Seed:0}, {value:[.2,.3,.4,.6],seedRandom(){},random:()=>.5});assert.deepEqual(Array.from(random),[.5,.5,.5,.6]);
 const pulse=evaluate(603,{Amount:0,Frequency:1},{value:[.2,.3,.4,.6],rgbToHsl:()=>[.2,.5,.3,.6],hslToRgb:x=>x});
 assert.deepEqual(Array.from(pulse),[.2,.5,.3,.6]);
});
test('All scripts parse',()=>{
 ['client/js/main.js','client/js/library.js','client/js/presets.js','client/js/legacy-library.js','host/index.jsx'].forEach(f=>new vm.Script(read(f)));
});

test('Upgrade from v1.3 removes stock, preserves moved edits and deletions, adds new IDs once',()=>{
 const old=JSON.parse(JSON.stringify(c.previous));
 const modified=old.Text.find(i=>i.id===106);modified.code='value + "custom"';
 old.Client=[old.Text.find(i=>i.id===101),modified];old.Text=old.Text.filter(i=>![101,106,104].includes(i.id));
 const m=library({version:12,categories:old,icons:{Client:'C'}});m.manager.load();
 const all=Object.values(m.manager.data.categories).flat();
 assert(!all.some(i=>i.id===101||i.id===204||i.id===104));assert.equal(m.manager.data.categories.Client[0].code,modified.code);
 assert.equal(all.filter(i=>i.id===107).length,1);assert.equal(all.find(i=>i.id===201).controllers.length,2);
 assert(m.store.wrangle_library_pre_v13);m.manager.load();assert.equal(Object.values(m.manager.data.categories).flat().filter(i=>i.id===107).length,1);
});
test('Every preset declares its property and has useful complete controllers',()=>{
 items.forEach(i=>{assert(i.code.startsWith('// Apply to '));assert(i.controllers.length>0);});
});
test('Axis wiggles preserve other coordinates in 2D and 3D',()=>{
 for(const base of [[10,20],[10,20,30]]){
  const opts={value:base,wiggle:()=>[100,200,300]};
  assert.deepEqual(Array.from(evaluate(305,{Frequency:2,Amplitude:20},opts)),base.length===3?[100,20,30]:[100,20]);
  assert.deepEqual(Array.from(evaluate(306,{Frequency:2,Amplitude:20},opts)),base.length===3?[10,200,30]:[10,200]);
 }
});
test('Anchor center uses bounds and offset while preserving Z',()=>{
 assert.deepEqual(Array.from(evaluate(407,{Offset:[2,-3]},{value:[0,0,9],sourceRectAtTime:()=>({left:-10,top:20,width:100,height:40})})),[42,37,9]);
});
test('Counter rotation traverses the full parent chain and applies angle offset',()=>{
 const grand={hasParent:false,transform:{rotation:30}},parent={hasParent:true,parent:grand,transform:{rotation:20}};
 assert.equal(evaluate(408,{'Angle Offset':5},{value:100,thisLayer:{hasParent:true,parent}}),45);
 assert.equal(evaluate(408,{'Angle Offset':5},{value:100,thisLayer:{hasParent:false}}),95);
});
test('Counter rotation rejects 3D parents and anchor rejects non-text/shape layers before controls',()=>{
 const h=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Rotate Z"}]);layer.parent={threeDLayer:true};',h);
 assert(!JSON.parse(h.applyExpression(byId(408).code,byId(408).controllers,byId(408).targetSpec,'both')).ok);assert.equal(h.layer.effects.length,0);
 const a=runtime();vm.runInContext('var layer=makeLayer("L",[{matchName:"ADBE Anchor Point",type:3}]);',a);
 assert(!JSON.parse(a.applyExpression(byId(407).code,byId(407).controllers,byId(407).targetSpec,'both')).ok);assert.equal(a.layer.effects.length,0);
 a.layer.isText=true;assert(JSON.parse(a.applyExpression(byId(407).code,byId(407).controllers,byId(407).targetSpec,'both')).ok);
});
test('Typewriter handles delayed start, both cursor styles, blink, checkbox and emoji',()=>{
 const v={Speed:2,'Delay Seconds':1,'Show Cursor':1,'Blink Speed':1,'Cursor Style':1};
 const run=(time,controls={})=>evaluate(107,{...v,...controls},{value:'A😀B',time,inPoint:5});
 assert.equal(run(5),'');assert.equal(run(6),'|');assert.equal(run(6.5),'A');
 assert.equal(run(7),'A😀|');assert.equal(run(7,{'Cursor Style':2}),'A😀_');
 assert.equal(run(8,{'Show Cursor':0}),'A😀B');assert.equal(run(6.75,{'Blink Speed':0}),'A|');
 assert.equal(run(8,{Speed:0,'Show Cursor':0}),'');
});
test('All four loop functions dispatch all modes and clamp spans',()=>{
 for(const [id,fn] of [[201,'loopOut'],[207,'loopIn'],[208,'loopOutDuration'],[209,'loopInDuration']]){
  for(let mode=1;mode<=4;mode++){
   const v={'Loop Type':mode,'Keyframe Count':50,'Duration Seconds':2};
   const result=evaluate(id,v,{numKeys:3,[fn]:(...args)=>args});
   assert.equal(result[0],['cycle','pingpong','offset','continue'][mode-1]);assert.equal(result[1],2);
  }
  assert.equal(evaluate(id,{'Loop Type':1,'Keyframe Count':0,'Duration Seconds':0},{numKeys:0,value:7}),7);
 }
});
test('Auto fade respects in/out points, zero durations, animated base and overlaps',()=>{
 const run=(time,fi=1,fo=1)=>evaluate(210,{'Fade In Seconds':fi,'Fade Out Seconds':fo},{time,inPoint:2,outPoint:6,value:80});
 assert.equal(run(2),0);assert.equal(run(2.5),40);assert.equal(run(4),80);assert.equal(run(5.5),40);assert.equal(run(6),0);
 assert.equal(run(2,0,0),80);assert.equal(run(6,0,0),0);assert.equal(run(4,8,8),20);
});
test('Inertial bounce uses incoming velocity and stays unchanged before keys',()=>{
 const opts={numKeys:2,nearestKey:()=>({index:1}),key:()=>({time:1}),velocityAtTime:()=>100};
 const v={Amplitude:.05,Frequency:3,Decay:5};
 assert.equal(evaluate(409,v,{...opts,time:.5,value:20}),20);
 const result=evaluate(409,v,{...opts,time:1.1,value:20});assert(result>20&&Number.isFinite(result));
 const vector=evaluate(409,v,{...opts,time:1.1,value:vm.runInNewContext('[10,20,30]'),velocityAtTime:()=>[100,0,-100]});
 // Evaluate arrays inside the same VM realm, as AE does.
 const p=byId(409);const script='var value=[10,20,30];'+p.code;
 const arr=vm.runInNewContext(script,{...opts,time:1.1,thisComp:{frameDuration:1/30},effect:n=>()=>v[n.split(' - ')[1]],velocityAtTime:()=>[100,0,-100]});
 assert(arr[0]>10);assert.equal(arr[1],20);assert(arr[2]<30);
});

console.log('\n'+passed+'/'+results.length+' checks passed. AE objects are mocked; live AE acceptance remains required.');
if(process.env.WRANGLE_TEST_RESULTS)fs.writeFileSync(process.env.WRANGLE_TEST_RESULTS,JSON.stringify({passed,total:results.length,scope:'Node VM and mocked AE objects',results},null,2));
if(passed!==results.length)process.exitCode=1;
