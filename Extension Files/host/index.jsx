// ExtendScript host. Return structured results; do not depend on a global JSON object.
function wrangleJSON(v) {
    if (v === null || v === undefined) return "null";
    if (typeof v === "string") return '"' + v.replace(/[\\"\u0000-\u001f\u2028\u2029]/g, function(c) {
        var table = {"\\":"\\\\", '"':'\\"', "\n":"\\n", "\r":"\\r", "\t":"\\t"};
        if (table[c]) return table[c];
        return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    }) + '"';
    if (typeof v === "boolean") return String(v);
    if (typeof v === "number") return isFinite(v) ? String(v) : "null";
    var parts = [], i;
    if (v instanceof Array) {
        for(i=0;i<v.length;i++) parts.push(wrangleJSON(v[i]));
        return "["+parts.join(",")+"]";
    }
    for(var k in v) if(v.hasOwnProperty(k)) parts.push(wrangleJSON(k)+":"+wrangleJSON(v[k]));
    return "{"+parts.join(",")+"}";
}
function wrangleResult() { return {ok:false,applied:0,controllers:0,skipped:0,errors:[],warnings:[]}; }
function wrangleComp() {
    var comp = app.project && app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) throw Error("Select a composition in After Effects.");
    return comp;
}
function wranglePath(prop) {
    var path=[], depth=prop.propertyDepth;
    for(var i=0;i<depth;i++) { path.unshift(prop.propertyIndex); prop=prop.propertyGroup(1); }
    return path;
}
function wrangleResolve(layer,path) {
    var p=layer;
    for(var i=0;i<path.length;i++) { p=p.property(path[i]); if(!p) throw Error("Selected property is no longer available."); }
    return p;
}
function wrangleContains(a,v) { for(var i=0;i<a.length;i++) if(a[i]===v)return true; return false; }
function wrangleCompatible(prop,layer,spec) {
    spec=spec||{};
    if(!prop.canSetExpression) return "This property does not accept expressions.";
    if(spec.matchNames && !wrangleContains(spec.matchNames,prop.matchName)) return "Use "+spec.label+".";
    if(spec.textLayer && !layer.property("ADBE Text Properties")) return "Use Gradient Ramp on a text layer.";
    if(spec.unseparated && prop.isSeparationLeader && prop.dimensionsSeparated) return "Use unseparated Position.";
    var type=prop.propertyValueType;
    if(spec.numeric) {
        var types=[PropertyValueType.OneD,PropertyValueType.TwoD,PropertyValueType.TwoD_SPATIAL,PropertyValueType.ThreeD,PropertyValueType.ThreeD_SPATIAL];
        if(!wrangleContains(types,type)) return "Use a numeric property.";
    }
    if(spec.valueTypes && spec.valueTypes[0]==="COLOR" && type!==PropertyValueType.COLOR) return "Use a color property.";
    if(spec.requiresKeys && prop.numKeys<spec.requiresKeys) return "Requires at least "+spec.requiresKeys+" keyframes.";
    return "";
}
function wrangleControllerSupported(name) {
    return wrangleContains(["ADBE Slider Control","ADBE Angle Control","ADBE Checkbox Control","ADBE Color Control","ADBE Point Control","ADBE Point3D Control","ADBE Dropdown Control","ADBE Layer Control"],name);
}
function wrangleEffects(layer) {
    var group=layer.property("ADBE Effect Parade");
    if(!group) throw Error("This layer cannot contain expression controls.");
    return group;
}
function wrangleSetupControls(layer,controls,code,created,result) {
    for(var c=0;c<controls.length;c++) {
        var ctrl=controls[c];
        if(!ctrl || typeof ctrl.name!=="string" || !wrangleControllerSupported(ctrl.matchName)) throw Error("Unsupported saved controller.");
        var group=wrangleEffects(layer), name=ctrl.name, existing=group.property(name);
        if(existing && existing.matchName!==ctrl.matchName) throw Error('Controller "'+name+'" exists with a different type. Rename it before applying.');
        // Existing controls are intentional reuse: never reset their values or keyframes.
        if(existing) continue;
        if(!group.canAddProperty(ctrl.matchName)) throw Error("Cannot add controller "+name+".");
        var effect=group.addProperty(ctrl.matchName);
        var idx=effect.propertyIndex;
        created.push(idx);
        effect.name=name;
        if(ctrl.options && ctrl.matchName==="ADBE Dropdown Control") {
            if(!effect.property(1).setPropertyParameters) throw Error("Dropdown controls require a newer After Effects version.");
            effect.property(1).setPropertyParameters(ctrl.options);
            effect=wrangleEffects(layer).property(idx); effect.name=name;
        }
        if(ctrl.matchName==="ADBE Layer Control" && ctrl.layerName) {
            var comp=layer.containingComp, target=null, matches=0;
            for(var li=1;li<=comp.numLayers;li++) if(comp.layer(li).name===ctrl.layerName) {target=comp.layer(li);matches++;}
            if(matches!==1) throw Error('Choose a unique source layer named "'+ctrl.layerName+'" before applying.');
            effect.property(1).setValue(target.index);
        } else if(ctrl.value!==undefined && ctrl.value!==null) {
            effect.property(1).setValue(ctrl.value);
        } else result.warnings.push('Controller "'+name+'" has no saved value; its default is used.');
    }
    return code;
}
function wrangleRemoveCreated(layer,created) {
    for(var i=created.length-1;i>=0;i--) { try { wrangleEffects(layer).property(created[i]).remove(); } catch(e) {} }
}
function applyExpression(code,controllers,spec,mode) {
    var result=wrangleResult(), begun=false;
    try {
        var comp=wrangleComp(), layers=comp.selectedLayers;
        if(!layers.length) throw Error("Select a layer and property in After Effects.");
        controllers=controllers||[]; mode=mode||"both";
        if(mode!=="controllers" && !code) throw Error("This expression is empty.");
        if(mode==="controllers" && !controllers.length) throw Error("This preset has no controllers.");
        // Snapshot paths before adding any effects, which invalidates indexed-group references.
        var jobs=[];
        for(var i=0;i<layers.length;i++) {
            var layer=layers[i], paths=[], props=layer.selectedProperties;
            if(layer.locked) {result.skipped++;result.errors.push(layer.name+": layer is locked.");continue;}
            for(var j=0;mode!=="controllers" && j<props.length;j++) {
                var p=props[j];
                if(p.propertyType!==PropertyType.PROPERTY)continue;
                var reason=wrangleCompatible(p,layer,spec);
                if(reason) { result.skipped++;result.errors.push(layer.name+" / "+p.name+": "+reason); }
                else paths.push({path:wranglePath(p),name:p.name});
            }
            if(mode==="controllers" || paths.length) jobs.push({layer:layer,paths:paths});
            else if(!props.length) {result.skipped++;result.errors.push(layer.name+": no property selected.");}
        }
        if(!jobs.length) throw Error("No compatible properties selected.");
        app.beginUndoGroup("Wrangle: Apply Expression");begun=true;
        for(var n=0;n<jobs.length;n++) {
            var job=jobs[n], created=[], layerApplied=0;
            try {
                if(mode!=="expression") wrangleSetupControls(job.layer,controllers,code,created,result);
                if(mode!=="controllers") {
                    for(var q=0;q<job.paths.length;q++) {
                        var previous="", enabled=false, property=null;
                        try {
                            property=wrangleResolve(job.layer,job.paths[q].path);
                            previous=property.expression;enabled=property.expressionEnabled;
                            property.expression=code;property.expressionEnabled=true;
                            property.valueAtTime(comp.time,false);
                            if(property.expressionError) throw Error(property.expressionError);
                            result.applied++;layerApplied++;
                        } catch(e) {
                            if(property) {try {property.expression=previous;if(previous)property.expressionEnabled=enabled;}catch(restoreError){result.errors.push("Could not restore previous expression: "+restoreError.message);}}
                            result.skipped++;result.errors.push(job.layer.name+" / "+job.paths[q].name+": "+e.message);
                        }
                    }
                }
                if(mode!=="controllers" && !layerApplied) wrangleRemoveCreated(job.layer,created);
                else result.controllers+=created.length;
            } catch(e) {
                wrangleRemoveCreated(job.layer,created);
                result.skipped+=Math.max(1,job.paths.length);
                result.errors.push(job.layer.name+": "+e.message);
            }
        }
        result.ok=mode==="controllers" ? result.errors.length===0 : result.applied>0;
    } catch(e) {result.errors.push(e.message);}
    finally {if(begun)app.endUndoGroup();}
    return wrangleJSON(result);
}
function captureExpressionAndControllers(includeControls) {
    var result={ok:false,code:"",controllers:[],warnings:[],errors:[],matchName:""};
    try {
        var comp=wrangleComp(), layers=comp.selectedLayers, prop=null, source=null, count=0;
        for(var i=0;i<layers.length;i++) {
            var props=layers[i].selectedProperties;
            for(var j=0;j<props.length;j++) if(props[j].canSetExpression && props[j].expression) {
                count++;if(!prop){prop=props[j];source=layers[i];}
            }
        }
        if(!prop) {result.ok=true;return wrangleJSON(result);}
        result.code=prop.expression;result.matchName=prop.matchName;
        if(count>1)result.warnings.push("Captured the first selected expression.");
        if(includeControls!==false) {
            var group=source.property("ADBE Effect Parade"), names=[], match;
            // Only unqualified/local literal names are auto-captured.
            var pattern=/(^|[^.\w])(?:thisLayer\.)?effect\s*\(\s*(["'])([^"']+)\2\s*\)/g;
            while((match=pattern.exec(result.code))!==null) if(!wrangleContains(names,match[3]))names.push(match[3]);
            if(group)for(var k=1;k<=group.numProperties;k++) {
                var effect=group.property(k);
                if(!effect.selected && !wrangleContains(names,effect.name))continue;
                if(!wrangleControllerSupported(effect.matchName)) {result.warnings.push(effect.name+": only expression controls are captured.");continue;}
                var field=effect.property(1), ctrl={name:effect.name,matchName:effect.matchName};
                ctrl.value=field.valueAtTime(comp.time,false);
                if(field.numKeys || field.expression)result.warnings.push(effect.name+": saved its current value, not its animation.");
                if(effect.matchName==="ADBE Layer Control" && ctrl.value>0) {ctrl.layerName=comp.layer(ctrl.value).name;delete ctrl.value;}
                if(effect.matchName==="ADBE Dropdown Control")result.warnings.push(effect.name+": custom menu labels cannot be captured; set them in After Effects after applying.");
                result.controllers.push(ctrl);
            }
            for(var z=0;z<names.length;z++)if(!group||!group.property(names[z]))result.warnings.push("Missing local control: "+names[z]+".");
            if(/effect\s*\(/.test(result.code))result.warnings.push("Capture supports local named controls. Check cross-layer or dynamic references before reuse.");
        }
        result.ok=true;
    } catch(e) {result.errors.push(e.message);}
    return wrangleJSON(result);
}
function getSelectedExpression() { return captureExpressionAndControllers(false); }
function removeAllExpressions() {
    // Scope intentionally matches Apply: selected properties only.
    var result=wrangleResult(), begun=false;
    try {
        var comp=wrangleComp(), layers=comp.selectedLayers;
        app.beginUndoGroup("Wrangle: Remove Selected Expressions");begun=true;
        for(var i=0;i<layers.length;i++) {
            var props=layers[i].selectedProperties;
            for(var j=0;j<props.length;j++)if(props[j].canSetExpression && props[j].expression) {
                try {props[j].expression="";result.applied++;}
                catch(e){result.skipped++;result.errors.push(layers[i].name+" / "+props[j].name+": "+e.message);}
            }
        }
        result.ok=result.applied>0;
        if(!result.ok&&!result.errors.length)result.errors.push("Select properties with expressions to remove.");
    }catch(e){result.errors.push(e.message);}
    finally{if(begun)app.endUndoGroup();}
    return wrangleJSON(result);
}
