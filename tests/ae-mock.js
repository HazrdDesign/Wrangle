var PropertyType={PROPERTY:1};
var PropertyValueType={OneD:1,TwoD:2,TwoD_SPATIAL:3,ThreeD:4,ThreeD_SPATIAL:5,COLOR:6};
function CompItem(){this.selectedLayers=[];this.time=1;}
var undo=0;var app={project:{activeItem:new CompItem()},beginUndoGroup:function(){undo++;},endUndoGroup:function(){undo--;}};
function makeLayer(name,properties){
 var effects=[],layer={name:name,locked:false,selectedProperties:[],containingComp:app.project.activeItem};
 var group={canAddProperty:function(){return true;},property:function(key){if(typeof key==='number')return effects[key-1];for(var i=0;i<effects.length;i++)if(effects[i].name===key)return effects[i];return null;},
  addProperty:function(match){
   var field={value:0,numKeys:0,expression:'',valueAtTime:function(){return this.value;},setValue:function(v){this.value=v;},setPropertyParameters:function(a){this.options=a;}};
   var effect={name:match,matchName:match,propertyIndex:effects.length+1,property:function(){return field;},remove:function(){effects.splice(effects.indexOf(effect),1);}};
   effects.push(effect);return effect;
  }};
 Object.defineProperty(group,'numProperties',{get:function(){return effects.length;}});
 layer.property=function(key){if(key==='ADBE Effect Parade')return group;if(key==='ADBE Text Properties')return layer.isText?{}:null;return layer.selectedProperties[key-1];};
 layer.effects=effects;
 properties.forEach(function(def,index){
  var expression='',p={name:def.name||def.matchName,matchName:def.matchName,propertyType:1,propertyValueType:def.type||1,propertyIndex:index+1,propertyDepth:1,numKeys:def.keys||0,canSetExpression:true,
   propertyGroup:function(){return layer;},expressionEnabled:true,expressionError:'',valueAtTime:function(){if(p.expression==='INVALID')p.expressionError='Evaluation failed';return 1;}};
  Object.defineProperty(p,'expression',{get:function(){return expression;},set:function(v){expression=v;p.expressionError='';}});
  layer.selectedProperties.push(p);
 });
 app.project.activeItem.selectedLayers.push(layer);return layer;
}

