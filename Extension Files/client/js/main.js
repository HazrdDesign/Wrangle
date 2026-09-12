const csInterface = new CSInterface();
const $ = id => document.getElementById(id);
let activeCat = null, editingItem = null, editingCat = null, categoryBeingEdited = null;
let capturedControllers = [], captureWarnings = [], resultDetails = [], busy = false;
let focusBeforeModal = null, dragged = null;
const accentDefault = '#ff8033';

function setStatus(message, errors, details) {
    $('status-text').textContent = message;
    document.querySelector('.status').classList.toggle('error',!!errors);
    resultDetails = details || [];
    $('status-details-btn').hidden = !resultDetails.length;
}
function showPersistence() {
    if(LibraryManager.warning) setStatus(LibraryManager.warning,true);
}
function guard(action,errorId) {
    try { action(); showPersistence(); }
    catch(e) { if(errorId) $(errorId).textContent=e.message; else setStatus(e.message,true); }
}
function applyAccent(color,save) {
    if(!/^#[0-9a-f]{6}$/i.test(color)) color=accentDefault;
    const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
    document.documentElement.style.setProperty('--accent',color);
    document.documentElement.style.setProperty('--accent-soft','rgba('+rgb.join(',')+',.13)');
    document.documentElement.style.setProperty('--accent-border','rgba('+rgb.join(',')+',.36)');
    const lum=rgb.map(v=>{v/=255;return v<=0.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});
    document.documentElement.style.setProperty('--accent-ink',lum[0]*.2126+lum[1]*.7152+lum[2]*.0722>.179?'#151515':'#ffffff');
    $('set-accent').value=color.toUpperCase();$('accent-value').textContent=color.toUpperCase();
    $('accent-preview').style.backgroundColor=color;
    ['r','g','b'].forEach((channel,i)=>{ $('accent-'+channel).value=rgb[i];$('accent-'+channel+'-value').textContent=rgb[i]; });
    $('accent-error').textContent='';
    if(save)guard(()=>localStorage.setItem('wrangle_settings',JSON.stringify({accent:color})));
}
function initSettings() {
    let color=accentDefault;
    try{const stored=JSON.parse(localStorage.getItem('wrangle_settings')||'{}');color=stored.accent||accentDefault;}catch(e){}
    applyAccent(color,false);
}
function closeMenu() { $('actions-menu').hidden=true;$('open-menu').setAttribute('aria-expanded','false'); }
function openModal(id) {
    closeMenu();focusBeforeModal=document.activeElement;
    $(id).hidden=false;
    const focus=$(id).querySelector('input:not([type=checkbox]),button,select,textarea');
    if(focus)focus.focus();
}
function closeModal(id) {
    $(id).hidden=true;
    if(focusBeforeModal&&document.contains(focusBeforeModal))focusBeforeModal.focus();
    if(id==='expression-modal'){editingItem=null;capturedControllers=[];}
}
function bridge(functionName,args,callback) {
    if(!window.__adobe_cep__) {
        callback({ok:false,errors:['Open Wrangle inside After Effects to use timeline actions.']});return;
    }
    if(busy) {setStatus('Waiting for After Effects…',false);return;}
    busy=true;
    const payload=(args||[]).map(x=>JSON.stringify(x).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')).join(',');
    try {
        csInterface.evalScript(functionName+'('+payload+');',raw=>{
            busy=false;
            let response;
            try{response=JSON.parse(raw);if(!response||typeof response.ok!=='boolean')throw Error();}
            catch(e){response={ok:false,errors:['After Effects did not return a valid result. Check that the updated host script is installed.']};}
            callback(response);
        });
    }catch(e){busy=false;callback({ok:false,errors:[e.message]});}
}
function applyItem(item,event) {
    const mode=event.ctrlKey||event.metaKey?'expression':event.altKey?'controllers':'both';
    const spec=Object.assign({},targetTypes[item.target]||targetTypes.any,item.targetSpec||{},{requiresKeys:item.requiresKeys||0});
    setStatus('Applying '+item.name+'…',false);
    bridge('applyExpression',[item.code,item.controllers||[],spec,mode],res=>{
        const details=(res.errors||[]).concat(res.warnings||[]);
        let message;
        if(!res.ok)message=(res.errors||[])[0]||'Expression could not be applied.';
        else if(mode==='controllers')message=res.controllers?'Added '+res.controllers+' controller'+(res.controllers===1?'':'s')+'.':'Controllers already exist; their values were kept.';
        else message='Applied to '+res.applied+' propert'+(res.applied===1?'y':'ies')+(res.skipped?' · '+res.skipped+' skipped':'')+'.';
        setStatus(message,!res.ok,details);
    });
}
function removeSelected() {
    bridge('removeAllExpressions',[],res=>{
        setStatus(res.ok?'Removed expressions from '+res.applied+' selected propert'+(res.applied===1?'y.':'ies.'):(res.errors||[])[0],!res.ok,res.errors||[]);
    });
}
function make(tag,className,text) {const node=document.createElement(tag);if(className)node.className=className;if(text!=null)node.textContent=text;return node;}
function render() {
    const cats=LibraryManager.getCategories();
    if(!cats.includes(activeCat))activeCat=cats[0]||null;
    renderSidebar();renderContent();$('edit-category').disabled=!activeCat;
}
function reorderEvents(node,kind,index) {
    node.draggable=true;
    node.addEventListener('dragstart',e=>{
        dragged={kind,index,cat:activeCat};e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','wrangle:'+kind);
        node.classList.add('dragging');
    });
    node.addEventListener('dragover',e=>{if(dragged&&dragged.kind===kind){e.preventDefault();node.classList.add('drag-over');}});
    node.addEventListener('dragleave',()=>node.classList.remove('drag-over'));
    node.addEventListener('drop',e=>{
        node.classList.remove('drag-over');
        if(!dragged||dragged.kind!==kind)return;
        e.preventDefault();e.stopPropagation();
        guard(()=>{if(kind==='category')LibraryManager.reorderCategories(dragged.index,index);else if(dragged.cat===activeCat)LibraryManager.reorderExpression(activeCat,dragged.index,index);});
        dragged=null;render();
    });
    node.addEventListener('dragend',()=>{dragged=null;document.querySelectorAll('.dragging,.drag-over').forEach(n=>n.classList.remove('dragging','drag-over'));});
}
function renderSidebar() {
    $('sidebar-nav').textContent='';
    LibraryManager.getCategories().forEach((cat,index)=>{
        const b=make('button','nav-item'+(cat===activeCat?' active':''),cat);
        b.setAttribute('aria-pressed',String(cat===activeCat));
        b.addEventListener('click',()=>{activeCat=cat;render();});
        reorderEvents(b,'category',index);$('sidebar-nav').appendChild(b);
    });
}
function renderContent() {
    const items=activeCat?LibraryManager.getItems(activeCat):[];
    $('cat-title').textContent=activeCat||'Your library';
    $('item-count').textContent=items.length+' expression'+(items.length===1?'':'s');
    $('content').textContent='';
    if(!items.length){$('content').appendChild(make('p','empty',activeCat?'No expressions here yet. Use + to add one.':'Add a category or use + to save your first expression.'));return;}
    items.forEach((item,index)=>{
        const row=make('div','expr-card'),apply=make('button','apply-btn');
        apply.appendChild(make('span','expr-name',item.name));
        const label=(targetTypes[item.target]||targetTypes.any).label;
        const count=(item.controllers||[]).length;
        apply.appendChild(make('span','expr-target',label+(count?' · '+count+' control'+(count===1?'':'s'):'')));
        if(item.requiresKeys)apply.appendChild(make('span','requirement','Requires '+item.requiresKeys+'+ keyframes'));
        if(item.description)apply.title=item.description;
        apply.setAttribute('aria-label','Apply '+item.name+' to '+label);
        apply.addEventListener('click',e=>applyItem(item,e));row.appendChild(apply);
        const actions=make('div','row-actions');
        const edit=make('button','','✎');edit.title='Edit '+item.name;edit.setAttribute('aria-label','Edit '+item.name);
        edit.addEventListener('click',()=>openEditor(item));
        const del=make('button','','×');del.title='Delete '+item.name;del.setAttribute('aria-label','Delete '+item.name);
        del.addEventListener('click',()=>{if(confirm('Delete "'+item.name+'" from your library?'))guard(()=>{LibraryManager.removeExpression(activeCat,item.id);render();});});
        actions.append(edit,del);row.appendChild(actions);reorderEvents(row,'expression',index);$('content').appendChild(row);
    });
}
function populateSelect(id,options,selected) {
    $(id).textContent='';
    options.forEach(x=>{const option=make('option','',x.label);option.value=x.value;option.selected=x.value===selected;$(id).appendChild(option);});
}
function openEditor(item,data) {
    editingItem=item?LibraryManager.clone(item):null;editingCat=activeCat;
    data=data||{};capturedControllers=LibraryManager.clone(item?item.controllers||[]:data.controllers||[]);
    captureWarnings=data.warnings||[];
    $('expression-title').textContent=item?'Edit expression':'Add expression';
    $('inp-name').value=item?item.name:'';$('inp-code').value=item?item.code:data.code||'';
    const cats=LibraryManager.getCategories();if(!cats.includes('Custom'))cats.push('Custom');
    populateSelect('inp-cat',cats.map(c=>({value:c,label:c})),activeCat||'Custom');
    let target=item?item.target:'any';
    if(!item&&data.matchName)Object.keys(targetTypes).some(key=>{
        if((targetTypes[key].matchNames||[]).includes(data.matchName)){target=key;return true;}return false;
    });
    populateSelect('inp-target',Object.keys(targetTypes).map(k=>({value:k,label:targetTypes[k].label})),target||'any');
    $('include-controllers').checked=true;$('include-controllers').disabled=!capturedControllers.length;
    $('ctrl-status').textContent=capturedControllers.length?capturedControllers.length+' captured controller'+(capturedControllers.length===1?'':'s')+'. Existing matching controls keep their values.':'No controllers captured.';
    $('controller-list').textContent='';
    capturedControllers.forEach(c=>$('controller-list').appendChild(make('li','',(c.label||c.name)+' · '+(c.layerName|| (c.value==null?'Default value':Array.isArray(c.value)?c.value.join(', '):String(c.value))))));
    $('capture-note').textContent=captureWarnings.join(' ');$('expression-error').textContent='';
    openModal('expression-modal');$('inp-name').focus();
}
function addExpression(event) {
    if(!window.__adobe_cep__){openEditor(null,{warnings:['Browser preview: write an expression here. Timeline capture is available in After Effects.']});return;}
    bridge('captureExpressionAndControllers',[!(event.ctrlKey||event.metaKey)],res=>{
        if(!res.ok){setStatus((res.errors||[])[0],true);return;}openEditor(null,res);
    });
}
function saveExpression(event) {
    event.preventDefault();
    guard(()=>{
        const name=$('inp-name').value.trim(),code=$('inp-code').value.trim(),cat=$('inp-cat').value,target=$('inp-target').value;
        if(!name||!code)throw Error('Name and expression are required.');
        const item=Object.assign({},editingItem||{},{
            id:editingItem?editingItem.id:'user-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
            name,code,target,controllers:$('include-controllers').checked?capturedControllers:[]
        });
        if(editingItem&&(code!==editingItem.code||target!==editingItem.target)){delete item.targetSpec;delete item.requiresKeys;delete item.description;}
        LibraryManager.saveExpression(editingCat,editingItem?editingItem.id:null,cat,item);
        activeCat=cat;closeModal('expression-modal');render();setStatus('Expression saved.',false);
    },'expression-error');
}
function openCategory(name) {
    categoryBeingEdited=name;$('category-title').textContent=name?'Edit category':'New category';
    $('inp-cat-name').value=name||'';$('delete-category').hidden=!name;$('category-error').textContent='';
    openModal('category-modal');$('inp-cat-name').focus();
}
function saveCategory(event) {
    event.preventDefault();guard(()=>{
        const name=$('inp-cat-name').value.trim();
        if(categoryBeingEdited)LibraryManager.renameCategory(categoryBeingEdited,name,LibraryManager.getIcon(categoryBeingEdited));
        else LibraryManager.createCategory(name,'');
        activeCat=name;closeModal('category-modal');render();
    },'category-error');
}
window.addEventListener('DOMContentLoaded',()=>{
    initSettings();
    try{LibraryManager.init();render();showPersistence();}
    catch(e){setStatus(e.message,true);$('add-expression').disabled=true;$('open-menu').disabled=true;return;}
    $('add-expression').addEventListener('click',addExpression);
    $('open-menu').addEventListener('click',()=>{$('actions-menu').hidden=!$('actions-menu').hidden;$('open-menu').setAttribute('aria-expanded',String(!$('actions-menu').hidden));});
    $('add-category').addEventListener('click',()=>openCategory(null));
    $('edit-category').addEventListener('click',()=>openCategory(activeCat));
    $('remove-selected').addEventListener('click',()=>{closeMenu();removeSelected();});
    $('open-settings').addEventListener('click',()=>openModal('settings-modal'));
    $('open-help').addEventListener('click',()=>openModal('help-modal'));
    $('set-accent').addEventListener('input',e=>{const hex=e.target.value.trim();if(/^#?[0-9a-f]{6}$/i.test(hex))applyAccent('#'+hex.replace('#',''),true);else $('accent-error').textContent='Enter six hex digits, for example #FF8033.';});
    ['r','g','b'].forEach(channel=>$('accent-'+channel).addEventListener('input',()=>{
        const hex=['r','g','b'].map(c=>('0'+Number($('accent-'+c).value).toString(16)).slice(-2)).join('');applyAccent('#'+hex,true);
    }));
    $('reset-accent').addEventListener('click',()=>applyAccent(accentDefault,true));
    $('expression-form').addEventListener('submit',saveExpression);
    $('category-form').addEventListener('submit',saveCategory);
    $('delete-category').addEventListener('click',()=>{
        if(confirm('Delete "'+categoryBeingEdited+'" and all '+LibraryManager.getItems(categoryBeingEdited).length+' expressions in it?')){
            guard(()=>{LibraryManager.deleteCategory(categoryBeingEdited);closeModal('category-modal');render();},'category-error');
        }
    });
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
    $('status-details-btn').addEventListener('click',()=>{
        $('result-details').textContent='';resultDetails.forEach(t=>$('result-details').appendChild(make('li','',t)));openModal('details-modal');
    });
    document.addEventListener('click',e=>{if(!$('actions-menu').contains(e.target)&&!$('open-menu').contains(e.target))closeMenu();});
    document.addEventListener('keydown',e=>{
        const modal=document.querySelector('.dialog-overlay:not([hidden])');
        if(e.key==='Escape'){if(modal)closeModal(modal.id);else closeMenu();}
        if(e.key==='Tab'&&modal){
            const controls=Array.from(modal.querySelectorAll('button,input,textarea,select,[tabindex="0"]')).filter(x=>!x.disabled&&x.getClientRects().length);
            const first=controls[0],last=controls[controls.length-1];
            if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
            else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
        }
    });
});

